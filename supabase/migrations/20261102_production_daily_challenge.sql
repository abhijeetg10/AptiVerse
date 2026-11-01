-- ====================================================================
-- MIGRATION: Production-Ready Global Daily Challenge System
-- 
-- Rules:
-- 1. One globally shared challenge per day (Asia/Kolkata timezone, reset 12:00 AM IST)
-- 2. Concurrency-safe: Single source of truth in database
-- 3. One official scored attempt per user per daily challenge
-- 4. Server-authoritative timing (started_at -> submitted_at in milliseconds)
-- 5. Immutable completed attempts and competitive leaderboard
-- ====================================================================

-- 1. TABLE: daily_challenges
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  game_type TEXT NOT NULL,
  game_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Hard',
  challenge_seed BIGINT NOT NULL,
  challenge_config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'upcoming', 'active', 'archived'
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON public.daily_challenges(challenge_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_status ON public.daily_challenges(status, starts_at, expires_at);

-- 2. TABLE: daily_challenge_attempts
CREATE TABLE IF NOT EXISTS public.daily_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  college TEXT,
  avatar_url TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  completion_time_ms BIGINT,
  score NUMERIC(5,2),
  accuracy NUMERIC(5,2),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  attempt_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_daily_challenge_user UNIQUE (daily_challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_attempts_challenge_user ON public.daily_challenge_attempts(daily_challenge_id, user_id);
CREATE INDEX IF NOT EXISTS idx_daily_attempts_ranking ON public.daily_challenge_attempts(
  daily_challenge_id, 
  is_completed, 
  is_correct DESC, 
  score DESC, 
  accuracy DESC, 
  completion_time_ms ASC, 
  submitted_at ASC
);
CREATE INDEX IF NOT EXISTS idx_daily_attempts_user_history ON public.daily_challenge_attempts(user_id, created_at DESC);

-- 3. ROW LEVEL SECURITY
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_attempts ENABLE ROW LEVEL SECURITY;

-- Public can view daily challenges
DROP POLICY IF EXISTS "Public can view daily challenges" ON public.daily_challenges;
CREATE POLICY "Public can view daily challenges"
  ON public.daily_challenges FOR SELECT
  TO public
  USING ( true );

-- Restrict direct mutations on daily_challenges from client
REVOKE INSERT, UPDATE, DELETE ON public.daily_challenges FROM authenticated, anon;

-- Attempts RLS: Users can view their own attempts, and everyone can view completed attempts for leaderboard
DROP POLICY IF EXISTS "Users can read own daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can read own daily attempts"
  ON public.daily_challenge_attempts FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id OR is_completed = true );

DROP POLICY IF EXISTS "Anon can view completed daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Anon can view completed daily attempts"
  ON public.daily_challenge_attempts FOR SELECT
  TO anon
  USING ( is_completed = true );

-- Direct mutations on daily_challenge_attempts are revoked; mutations MUST flow through trusted RPCs
REVOKE INSERT, UPDATE, DELETE ON public.daily_challenge_attempts FROM authenticated, anon;

-- 4. VIEW: daily_challenge_leaderboard
CREATE OR REPLACE VIEW public.daily_challenge_leaderboard AS
SELECT 
  a.id AS attempt_id,
  a.daily_challenge_id,
  c.challenge_date,
  c.game_type,
  a.user_id,
  COALESCE(p.name, a.candidate_name, 'AptiVerse Scholar') AS player_name,
  COALESCE(p.college, a.college, 'Engineering Institute') AS college,
  COALESCE(p.avatar_url, a.avatar_url) AS avatar_url,
  COALESCE(a.score, 0) AS score,
  COALESCE(a.accuracy, 0) AS accuracy,
  a.completion_time_ms,
  ROUND((a.completion_time_ms::numeric / 1000.0), 2) AS completion_time_seconds,
  a.is_correct,
  a.submitted_at,
  DENSE_RANK() OVER (
    PARTITION BY a.daily_challenge_id 
    ORDER BY 
      a.is_correct DESC, 
      a.score DESC, 
      a.accuracy DESC, 
      a.completion_time_ms ASC, 
      a.submitted_at ASC
  ) AS rank
FROM public.daily_challenge_attempts a
JOIN public.daily_challenges c ON c.id = a.daily_challenge_id
LEFT JOIN public.profiles p ON p.id = a.user_id
WHERE a.is_completed = true;

-- 5. RPC: get_or_create_daily_challenge
CREATE OR REPLACE FUNCTION public.get_or_create_daily_challenge(
  p_target_date DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_today DATE;
  v_starts_at TIMESTAMPTZ;
  v_expires_at TIMESTAMPTZ;
  v_challenge RECORD;
  v_game_type TEXT;
  v_game_id TEXT;
  v_title TEXT;
  v_category TEXT;
  v_seed BIGINT;
  v_config JSONB;
  v_date_hash INT;
  v_rotation_idx INT;
  v_participants_count INT;
BEGIN
  -- Determine date in Asia/Kolkata timezone
  IF p_target_date IS NOT NULL THEN
    v_today := p_target_date;
  ELSE
    v_today := (now() AT TIME ZONE 'Asia/Kolkata')::date;
  END IF;

  v_starts_at := (v_today::text || ' 00:00:00 Asia/Kolkata')::timestamptz;
  v_expires_at := (v_today::text || ' 23:59:59.999 Asia/Kolkata')::timestamptz;

  -- 1. Check if challenge already exists for this date
  SELECT * INTO v_challenge FROM public.daily_challenges WHERE challenge_date = v_today;

  -- 2. If not found, use advisory lock to prevent concurrent duplicate inserts
  IF v_challenge.id IS NULL THEN
    PERFORM pg_advisory_xact_lock(hashtext('daily_challenge_' || v_today::text));

    -- Re-check after lock acquired
    SELECT * INTO v_challenge FROM public.daily_challenges WHERE challenge_date = v_today;

    IF v_challenge.id IS NULL THEN
      -- Deterministic game rotation based on calendar date hash
      v_date_hash := abs(('x' || substr(md5(v_today::text), 1, 8))::bit(32)::int);
      v_rotation_idx := v_date_hash % 5;
      v_seed := v_date_hash;

      CASE v_rotation_idx
        -- 0: Motion Challenge
        WHEN 0 THEN
          v_game_type := 'motion';
          v_game_id := 'motion';
          v_title := 'Obstacle Clearance Optimization';
          v_category := 'Spatial Reasoning & Pathfinding';
          v_config := jsonb_build_object(
            'gameType', 'motion',
            'levelId', 'motion_h_01',
            'puzzle', jsonb_build_object(
              'id', 'motion_h_01',
              'difficulty', 'hard',
              'rows', 6,
              'cols', 6,
              'ball', jsonb_build_object('row', 2, 'col', 4),
              'target', jsonb_build_object('row', 0, 'col', 1),
              'walls', jsonb_build_array(
                jsonb_build_object('row', 0, 'col', 3),
                jsonb_build_object('row', 0, 'col', 5)
              ),
              'blocks', jsonb_build_array(
                jsonb_build_object('id', 'A', 'orientation', 'vertical', 'length', 2, 'row', 1, 'col', 1),
                jsonb_build_object('id', 'B', 'orientation', 'horizontal', 'length', 2, 'row', 4, 'col', 2),
                jsonb_build_object('id', 'C', 'orientation', 'vertical', 'length', 2, 'row', 4, 'col', 0),
                jsonb_build_object('id', 'D', 'orientation', 'horizontal', 'length', 3, 'row', 1, 'col', 2),
                jsonb_build_object('id', 'E', 'orientation', 'horizontal', 'length', 3, 'row', 3, 'col', 0),
                jsonb_build_object('id', 'F', 'orientation', 'horizontal', 'length', 2, 'row', 2, 'col', 2),
                jsonb_build_object('id', 'G', 'orientation', 'vertical', 'length', 3, 'row', 0, 'col', 0),
                jsonb_build_object('id', 'H', 'orientation', 'vertical', 'length', 3, 'row', 2, 'col', 5),
                jsonb_build_object('id', 'I', 'orientation', 'vertical', 'length', 2, 'row', 3, 'col', 4)
              ),
              'optimalMoves', 10
            )
          );

        -- 1: Queens Challenge
        WHEN 1 THEN
          v_game_type := 'queens';
          v_game_id := 'queens';
          v_title := 'Corner Constraint Deduction (7×7)';
          v_category := 'Spatial & Constraint Reasoning';
          v_config := jsonb_build_object(
            'gameType', 'queens',
            'levelId', 'queens_easy_1',
            'puzzle', jsonb_build_object(
              'id', 'queens_easy_1',
              'size', 7,
              'difficulty', 'easy',
              'solution', jsonb_build_array(2, 0, 4, 1, 6, 3, 5),
              'regions', jsonb_build_array(
                jsonb_build_array(0, 0, 0, 0, 0, 0, 0),
                jsonb_build_array(1, 0, 0, 0, 0, 0, 0),
                jsonb_build_array(1, 3, 2, 2, 2, 0, 0),
                jsonb_build_array(3, 3, 3, 2, 2, 2, 0),
                jsonb_build_array(3, 3, 3, 2, 2, 4, 4),
                jsonb_build_array(3, 3, 3, 5, 5, 5, 4),
                jsonb_build_array(3, 3, 3, 5, 6, 6, 4)
              )
            )
          );

        -- 2: Geo Sudoku
        WHEN 2 THEN
          v_game_type := 'sudoku';
          v_game_id := 'sudoku';
          v_title := 'Intersecting Geometric Symbol Logic (4×4)';
          v_category := 'Pattern & Grid Deduction';
          v_config := jsonb_build_object(
            'gameType', 'sudoku',
            'levelId', 'geo_sudoku_hard_1',
            'puzzle', jsonb_build_object(
              'id', 'geo_sudoku_hard_1',
              'size', 4,
              'symbols', jsonb_build_array('circle', 'square', 'triangle', 'star'),
              'target', jsonb_build_object('row', 1, 'col', 1),
              'difficulty', 'hard',
              'board', jsonb_build_array(
                jsonb_build_array('circle', 'square', 'triangle', 'star'),
                jsonb_build_array('triangle', NULL, 'circle', 'square'),
                jsonb_build_array('square', 'triangle', 'star', 'circle'),
                jsonb_build_array('star', 'circle', 'square', 'triangle')
              )
            )
          );

        -- 3: Grid Memory
        WHEN 3 THEN
          v_game_type := 'grid';
          v_game_id := 'grid';
          v_title := '6-Dot Spatial Pattern Recall';
          v_category := 'Working Memory & Attention';
          v_config := jsonb_build_object(
            'gameType', 'grid',
            'levelId', 'grid_hard_1',
            'puzzle', jsonb_build_object(
              'id', 'grid_hard_1',
              'gridSize', 25,
              'dotsCount', 6,
              'sequence', jsonb_build_array(2, 6, 12, 14, 18, 22),
              'distraction', jsonb_build_object(
                'type', 'symmetry',
                'grid1', jsonb_build_array(
                  true, false, false, true,
                  false, true, true, false,
                  false, true, true, false,
                  true, false, false, true
                ),
                'isTrue', true
              )
            )
          );

        -- 4: Inductive Logic
        ELSE
          v_game_type := 'inductive';
          v_game_id := 'inductive';
          v_title := 'Set A Pattern Rule Classification';
          v_category := 'Pattern Recognition & Induction';
          v_config := jsonb_build_object(
            'gameType', 'inductive',
            'levelId', 'inductive_hard_1',
            'puzzle', jsonb_build_object(
              'id', 'inductive_hard_1',
              'difficulty', 'hard',
              'setAGrids', jsonb_build_array(
                jsonb_build_array('yc', 'yc', 'yc', NULL, NULL, NULL, NULL, NULL, NULL),
                jsonb_build_array(NULL, NULL, NULL, 'yc', 'yc', 'yc', NULL, NULL, NULL),
                jsonb_build_array(NULL, NULL, NULL, NULL, NULL, NULL, 'yc', 'yc', 'yc')
              ),
              'setBGrids', jsonb_build_array(
                jsonb_build_array('rs', NULL, NULL, 'rs', NULL, NULL, 'rs', NULL, NULL),
                jsonb_build_array(NULL, 'rs', NULL, NULL, 'rs', NULL, NULL, 'rs', NULL),
                jsonb_build_array(NULL, NULL, 'rs', NULL, NULL, 'rs', NULL, NULL, 'rs')
              ),
              'testGrids', jsonb_build_array(
                jsonb_build_array('yc', 'yc', 'yc', NULL, 'rs', NULL, NULL, NULL, NULL),
                jsonb_build_array(NULL, NULL, 'rs', NULL, 'rs', NULL, NULL, 'rs', NULL),
                jsonb_build_array('rs', 'rs', 'rs', NULL, NULL, NULL, NULL, NULL, NULL),
                jsonb_build_array(NULL, NULL, NULL, 'yc', 'yc', 'yc', 'rs', NULL, NULL)
              ),
              'correctOptionIndices', jsonb_build_array(0, 3)
            )
          );
      END CASE;

      INSERT INTO public.daily_challenges (
        challenge_date,
        game_type,
        game_id,
        title,
        category,
        difficulty,
        challenge_seed,
        challenge_config,
        status,
        starts_at,
        expires_at
      ) VALUES (
        v_today,
        v_game_type,
        v_game_id,
        v_title,
        v_category,
        'Hard',
        v_seed,
        v_config,
        'active',
        v_starts_at,
        v_expires_at
      )
      ON CONFLICT (challenge_date) DO NOTHING;

      SELECT * INTO v_challenge FROM public.daily_challenges WHERE challenge_date = v_today;
    END IF;
  END IF;

  -- Count total completed participants for this challenge
  SELECT COUNT(*) INTO v_participants_count 
  FROM public.daily_challenge_attempts 
  WHERE daily_challenge_id = v_challenge.id AND is_completed = true;

  RETURN jsonb_build_object(
    'id', v_challenge.id,
    'challenge_date', v_challenge.challenge_date,
    'game_type', v_challenge.game_type,
    'game_id', v_challenge.game_id,
    'title', v_challenge.title,
    'category', v_challenge.category,
    'difficulty', v_challenge.difficulty,
    'challenge_seed', v_challenge.challenge_seed,
    'challenge_config', v_challenge.challenge_config,
    'status', v_challenge.status,
    'starts_at', v_challenge.starts_at,
    'expires_at', v_challenge.expires_at,
    'server_time', now(),
    'participants_count', v_participants_count
  );
END;
$$;

-- 6. RPC: start_daily_challenge
CREATE OR REPLACE FUNCTION public.start_daily_challenge(
  p_challenge_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_challenge RECORD;
  v_attempt RECORD;
  v_user_profile RECORD;
  v_candidate_name TEXT;
  v_college TEXT;
  v_avatar_url TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to start an official daily challenge attempt.';
  END IF;

  -- Verify challenge exists and is currently active
  SELECT * INTO v_challenge FROM public.daily_challenges WHERE id = p_challenge_id;
  IF v_challenge.id IS NULL THEN
    RAISE EXCEPTION 'Daily challenge not found.';
  END IF;

  IF now() > v_challenge.expires_at THEN
    RAISE EXCEPTION 'This daily challenge has expired and can no longer be started.';
  END IF;

  -- Check if attempt already exists for this user and challenge
  SELECT * INTO v_attempt 
  FROM public.daily_challenge_attempts 
  WHERE daily_challenge_id = p_challenge_id AND user_id = v_user_id;

  -- If attempt exists, return it (preserves genuine started_at and state!)
  IF v_attempt.id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'attempt_id', v_attempt.id,
      'daily_challenge_id', v_attempt.daily_challenge_id,
      'started_at', v_attempt.started_at,
      'submitted_at', v_attempt.submitted_at,
      'completion_time_ms', v_attempt.completion_time_ms,
      'score', v_attempt.score,
      'accuracy', v_attempt.accuracy,
      'is_completed', v_attempt.is_completed,
      'is_correct', v_attempt.is_correct,
      'status', v_attempt.status,
      'server_time', now(),
      'already_existed', true
    );
  END IF;

  -- Retrieve user profile details
  SELECT * INTO v_user_profile FROM public.profiles WHERE id = v_user_id;
  v_candidate_name := COALESCE(v_user_profile.name, 'AptiVerse Scholar');
  v_college := v_user_profile.college;
  v_avatar_url := v_user_profile.avatar_url;

  -- Insert new attempt with server started_at timestamp
  INSERT INTO public.daily_challenge_attempts (
    daily_challenge_id,
    user_id,
    candidate_name,
    college,
    avatar_url,
    started_at,
    status
  ) VALUES (
    p_challenge_id,
    v_user_id,
    v_candidate_name,
    v_college,
    v_avatar_url,
    now(),
    'in_progress'
  )
  RETURNING * INTO v_attempt;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt.id,
    'daily_challenge_id', v_attempt.daily_challenge_id,
    'started_at', v_attempt.started_at,
    'submitted_at', NULL,
    'completion_time_ms', NULL,
    'score', NULL,
    'accuracy', NULL,
    'is_completed', false,
    'is_correct', false,
    'status', 'in_progress',
    'server_time', now(),
    'already_existed', false
  );
END;
$$;

-- 7. RPC: submit_daily_challenge
CREATE OR REPLACE FUNCTION public.submit_daily_challenge(
  p_attempt_id UUID,
  p_is_correct BOOLEAN,
  p_score NUMERIC,
  p_accuracy NUMERIC,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_attempt RECORD;
  v_challenge RECORD;
  v_elapsed_ms BIGINT;
  v_rank INT;
  v_completion_secs NUMERIC;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit daily challenge.';
  END IF;

  -- Retrieve attempt and verify ownership
  SELECT * INTO v_attempt 
  FROM public.daily_challenge_attempts 
  WHERE id = p_attempt_id AND user_id = v_user_id;

  IF v_attempt.id IS NULL THEN
    RAISE EXCEPTION 'Daily challenge attempt not found or does not belong to authenticated user.';
  END IF;

  -- If already completed, return existing result (idempotency prevents double submit)
  IF v_attempt.is_completed THEN
    SELECT rank INTO v_rank 
    FROM public.daily_challenge_leaderboard 
    WHERE attempt_id = v_attempt.id;

    RETURN jsonb_build_object(
      'attempt_id', v_attempt.id,
      'is_completed', true,
      'is_correct', v_attempt.is_correct,
      'score', v_attempt.score,
      'accuracy', v_attempt.accuracy,
      'completion_time_ms', v_attempt.completion_time_ms,
      'completion_time_seconds', ROUND((v_attempt.completion_time_ms::numeric / 1000.0), 2),
      'submitted_at', v_attempt.submitted_at,
      'rank', v_rank,
      'already_submitted', true
    );
  END IF;

  -- Retrieve challenge and check expiration
  SELECT * INTO v_challenge FROM public.daily_challenges WHERE id = v_attempt.daily_challenge_id;
  IF now() > v_challenge.expires_at THEN
    RAISE EXCEPTION 'Daily challenge has expired. Submissions are no longer accepted.';
  END IF;

  -- Calculate genuine server-side elapsed duration in milliseconds
  v_elapsed_ms := GREATEST(1000, EXTRACT(EPOCH FROM (now() - v_attempt.started_at)) * 1000)::bigint;
  v_completion_secs := ROUND((v_elapsed_ms::numeric / 1000.0), 2);

  -- Update attempt to completed state
  UPDATE public.daily_challenge_attempts
  SET
    submitted_at = now(),
    completion_time_ms = v_elapsed_ms,
    score = COALESCE(p_score, 0),
    accuracy = COALESCE(p_accuracy, 0),
    is_completed = true,
    is_correct = COALESCE(p_is_correct, false),
    status = 'completed',
    attempt_metadata = COALESCE(p_metadata, '{}'::jsonb)
  WHERE id = v_attempt.id;

  -- Sync to legacy daily_challenge_solvers table for backward compatibility
  IF p_is_correct THEN
    INSERT INTO public.daily_challenge_solvers (
      user_id,
      candidate_name,
      college,
      challenge_id,
      challenge_date,
      time_taken_seconds,
      streak
    ) VALUES (
      v_user_id,
      v_attempt.candidate_name,
      v_attempt.college,
      v_challenge.id::text,
      v_challenge.challenge_date,
      v_completion_secs,
      COALESCE((p_metadata->>'streak')::int, 1)
    );
  END IF;

  -- Calculate new rank on the official leaderboard
  SELECT rank INTO v_rank 
  FROM public.daily_challenge_leaderboard 
  WHERE attempt_id = v_attempt.id;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt.id,
    'is_completed', true,
    'is_correct', p_is_correct,
    'score', p_score,
    'accuracy', p_accuracy,
    'completion_time_ms', v_elapsed_ms,
    'completion_time_seconds', v_completion_secs,
    'submitted_at', now(),
    'rank', v_rank,
    'already_submitted', false
  );
END;
$$;

-- 8. RPC: get_daily_challenge_leaderboard
CREATE OR REPLACE FUNCTION public.get_daily_challenge_leaderboard(
  p_challenge_id UUID,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_entries JSONB;
  v_my_entry JSONB := NULL;
  v_total_participants INT;
BEGIN
  v_user_id := auth.uid();

  -- Get total count of completed participants
  SELECT COUNT(*) INTO v_total_participants 
  FROM public.daily_challenge_leaderboard 
  WHERE daily_challenge_id = p_challenge_id;

  -- Get top ranked leaderboard entries
  SELECT COALESCE(jsonb_agg(to_jsonb(r)), '[]'::jsonb) INTO v_entries
  FROM (
    SELECT 
      rank,
      attempt_id,
      user_id,
      player_name,
      college,
      avatar_url,
      score,
      accuracy,
      completion_time_ms,
      completion_time_seconds,
      is_correct,
      submitted_at
    FROM public.daily_challenge_leaderboard
    WHERE daily_challenge_id = p_challenge_id
    ORDER BY rank ASC
    LIMIT p_limit OFFSET p_offset
  ) r;

  -- Get current user's entry if authenticated
  IF v_user_id IS NOT NULL THEN
    SELECT to_jsonb(m) INTO v_my_entry
    FROM (
      SELECT 
        rank,
        attempt_id,
        user_id,
        player_name,
        college,
        avatar_url,
        score,
        accuracy,
        completion_time_ms,
        completion_time_seconds,
        is_correct,
        submitted_at
      FROM public.daily_challenge_leaderboard
      WHERE daily_challenge_id = p_challenge_id AND user_id = v_user_id
    ) m;
  END IF;

  RETURN jsonb_build_object(
    'total_participants', v_total_participants,
    'entries', v_entries,
    'my_entry', v_my_entry
  );
END;
$$;

-- 9. RPC: get_daily_challenge_history
CREATE OR REPLACE FUNCTION public.get_daily_challenge_history(
  p_limit INT DEFAULT 14
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_history JSONB;
BEGIN
  v_user_id := auth.uid();

  SELECT COALESCE(jsonb_agg(to_jsonb(h)), '[]'::jsonb) INTO v_history
  FROM (
    SELECT 
      c.id AS challenge_id,
      c.challenge_date,
      c.game_type,
      c.title,
      c.category,
      c.difficulty,
      c.starts_at,
      c.expires_at,
      (SELECT COUNT(*) FROM public.daily_challenge_attempts a WHERE a.daily_challenge_id = c.id AND a.is_completed = true) AS total_solvers,
      a.id AS my_attempt_id,
      a.is_completed AS my_is_completed,
      a.is_correct AS my_is_correct,
      a.score AS my_score,
      a.accuracy AS my_accuracy,
      ROUND((a.completion_time_ms::numeric / 1000.0), 2) AS my_time_seconds,
      (SELECT rank FROM public.daily_challenge_leaderboard lb WHERE lb.attempt_id = a.id) AS my_rank
    FROM public.daily_challenges c
    LEFT JOIN public.daily_challenge_attempts a ON a.daily_challenge_id = c.id AND a.user_id = v_user_id
    WHERE c.challenge_date <= (now() AT TIME ZONE 'Asia/Kolkata')::date
    ORDER BY c.challenge_date DESC
    LIMIT p_limit
  ) h;

  RETURN v_history;
END;
$$;

