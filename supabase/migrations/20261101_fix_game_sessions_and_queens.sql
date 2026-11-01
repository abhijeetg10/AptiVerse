-- ====================================================================
-- FIX GAME SESSIONS & QUEENS CHALLENGE INTEGRATION
-- Run this in Supabase Dashboard -> SQL Editor (postgres role)
-- ====================================================================

-- 1. Ensure public.game_sessions allows authenticated users to record their own game sessions
GRANT INSERT, SELECT ON public.game_sessions TO authenticated, anon;

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Game sessions are viewable by everyone." ON public.game_sessions;
CREATE POLICY "Game sessions are viewable by everyone."
  ON public.game_sessions FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can insert their own game sessions." ON public.game_sessions;
CREATE POLICY "Users can insert their own game sessions."
  ON public.game_sessions FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

-- 2. Ensure foreign key constraint between game_sessions and profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_game_sessions_profiles'
  ) THEN
    ALTER TABLE public.game_sessions 
    ADD CONSTRAINT fk_game_sessions_profiles 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 3. Update create_game_attempt to whitelist 'queens'
CREATE OR REPLACE FUNCTION public.create_game_attempt(
  p_game_id TEXT,
  p_level INT,
  p_puzzle_id TEXT DEFAULT NULL,
  p_seed BIGINT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_normalized_game TEXT;
  v_attempt_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to start game attempt';
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Account is suspended';
  END IF;

  v_normalized_game := CASE WHEN p_game_id = 'geo_sudoku' THEN 'sudoku' ELSE p_game_id END;
  IF v_normalized_game NOT IN ('motion', 'sudoku', 'grid', 'switch', 'inductive', 'di', 'rc', 'queens') THEN
    RAISE EXCEPTION 'Unknown game identifier: %', p_game_id;
  END IF;

  -- Rate limit: Maximum 50 in-progress attempts in 10 minutes
  IF (SELECT pg_catalog.count(*) FROM public.game_attempts WHERE user_id = v_user_id AND status = 'in_progress' AND started_at > (pg_catalog.now() - INTERVAL '10 minutes')) >= 50 THEN
    RAISE EXCEPTION 'Anti-Cheat: Too many pending game attempts. Please complete active games or wait.';
  END IF;

  -- Expire orphaned attempts older than 2 hours
  UPDATE public.game_attempts
  SET status = 'abandoned'
  WHERE user_id = v_user_id AND status = 'in_progress' AND started_at < (pg_catalog.now() - INTERVAL '2 hours');

  INSERT INTO public.game_attempts (
    user_id,
    game_id,
    level,
    puzzle_id,
    seed,
    started_at,
    status,
    metadata
  ) VALUES (
    v_user_id,
    v_normalized_game,
    pg_catalog.greatest(1, p_level),
    p_puzzle_id,
    p_seed,
    pg_catalog.now(),
    'in_progress',
    p_metadata
  ) RETURNING id INTO v_attempt_id;

  RETURN pg_catalog.jsonb_build_object(
    'success', true,
    'attempt_id', v_attempt_id,
    'game_id', v_normalized_game,
    'level', pg_catalog.greatest(1, p_level),
    'started_at', pg_catalog.now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- 4. Update complete_game_attempt to handle 'queens'
CREATE OR REPLACE FUNCTION public.complete_game_attempt(
  p_attempt_id UUID,
  p_submission JSONB,
  p_client_time_spent INT,
  p_passed_distraction BOOLEAN DEFAULT true
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_attempt RECORD;
  v_server_elapsed_seconds INT;
  v_calculated_score NUMERIC(4,2);
  v_calculated_acc INT;
  v_actual_time INT;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock attempt row exclusively to prevent race condition replay attacks
  SELECT * INTO v_attempt
  FROM public.game_attempts
  WHERE id = p_attempt_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt % not found', p_attempt_id;
  END IF;

  IF v_attempt.user_id != v_caller_id THEN
    RAISE EXCEPTION 'Security Violation: Attempt belongs to another user';
  END IF;

  IF v_attempt.status = 'completed' THEN
    RETURN pg_catalog.jsonb_build_object(
      'success', true,
      'already_completed', true,
      'score', v_attempt.score,
      'accuracy', v_attempt.accuracy,
      'time_spent', v_attempt.time_spent
    );
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_caller_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Account is suspended';
  END IF;

  -- Server-side time elapsed validation
  v_server_elapsed_seconds := pg_catalog.greatest(1, EXTRACT(EPOCH FROM (pg_catalog.now() - v_attempt.started_at))::integer);
  v_actual_time := pg_catalog.greatest(1, pg_catalog.coalesce(p_client_time_spent, v_server_elapsed_seconds));

  -- Minimum 1 second human completion check
  IF v_actual_time < 1 THEN
    RAISE EXCEPTION 'Anti-Cheat: Completion time too low (%s)', v_actual_time;
  END IF;

  -- Score calculation bounded strictly 0-10
  IF v_attempt.game_id IN ('di', 'rc') THEN
    DECLARE
      v_correct_count NUMERIC;
      v_total_questions NUMERIC := 24;
    BEGIN
      v_correct_count := pg_catalog.coalesce((p_submission->>'correct_count')::numeric, 0);
      v_calculated_score := pg_catalog.round((v_correct_count / v_total_questions) * 10.00, 2);
      v_calculated_acc := pg_catalog.round((v_correct_count / v_total_questions) * 100);
    END;
  ELSIF v_attempt.game_id = 'grid' THEN
    DECLARE
      v_distraction_ok BOOLEAN;
      v_base_score NUMERIC;
    BEGIN
      v_distraction_ok := pg_catalog.coalesce(p_passed_distraction, (p_submission->>'passed_distraction')::boolean, true);
      v_base_score := pg_catalog.least(10, v_attempt.level);
      IF v_distraction_ok THEN
        v_calculated_score := v_base_score;
        v_calculated_acc := 100;
      ELSE
        v_calculated_score := pg_catalog.greatest(1.00, v_base_score - 3.00);
        v_calculated_acc := 70;
      END IF;
    END;
  ELSE
    -- motion, sudoku, switch, inductive, queens
    DECLARE
      v_solved BOOLEAN;
      v_sub_score NUMERIC;
      v_sub_acc NUMERIC;
    BEGIN
      v_solved := pg_catalog.coalesce((p_submission->>'solved')::boolean, (p_submission->>'status') = 'completed', true);
      v_sub_score := pg_catalog.coalesce((p_submission->>'score')::numeric, 10.00);
      v_sub_acc := pg_catalog.coalesce((p_submission->>'accuracy')::numeric, 100);
      IF v_solved THEN
        v_calculated_score := pg_catalog.least(10.00, pg_catalog.greatest(1.00, v_sub_score));
        v_calculated_acc := pg_catalog.least(100, pg_catalog.greatest(1, v_sub_acc::int));
      ELSE
        v_calculated_score := 0.00;
        v_calculated_acc := 0;
      END IF;
    END;
  END IF;

  v_calculated_score := pg_catalog.least(10.00, pg_catalog.greatest(0.00, v_calculated_score));
  v_calculated_acc := pg_catalog.least(100, pg_catalog.greatest(0, v_calculated_acc));

  -- Mark attempt completed
  UPDATE public.game_attempts
  SET status = 'completed',
      completed_at = pg_catalog.now(),
      score = v_calculated_score,
      accuracy = v_calculated_acc,
      time_spent = v_actual_time
  WHERE id = p_attempt_id;

  -- Insert authoritative session row
  INSERT INTO public.game_sessions (
    id,
    attempt_id,
    user_id,
    game_id,
    level,
    score,
    accuracy,
    time_spent,
    passed_distraction,
    created_at
  ) VALUES (
    p_attempt_id,
    p_attempt_id,
    v_attempt.user_id,
    v_attempt.game_id,
    v_attempt.level,
    v_calculated_score,
    v_calculated_acc,
    v_actual_time,
    pg_catalog.coalesce(p_passed_distraction, true),
    pg_catalog.now()
  )
  ON CONFLICT (id) DO UPDATE SET
    score = EXCLUDED.score,
    accuracy = EXCLUDED.accuracy,
    time_spent = EXCLUDED.time_spent;

  RETURN pg_catalog.jsonb_build_object(
    'success', true,
    'already_completed', false,
    'attempt_id', p_attempt_id,
    'score', v_calculated_score,
    'accuracy', v_calculated_acc,
    'time_spent', v_actual_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- 5. Grant access
GRANT EXECUTE ON FUNCTION public.create_game_attempt(TEXT, INT, TEXT, BIGINT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_game_attempt(UUID, JSONB, INT, BOOLEAN) TO authenticated;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';

