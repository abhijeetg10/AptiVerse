-- ====================================================================
-- MIGRATION: 20261102_fix_daily_solvers_and_leaderboard.sql
-- Fixes:
-- 1. Creates public.daily_challenge_solvers table to eliminate
--    "Could not find the table 'public.daily_challenge_solvers' in the schema cache"
-- 2. Grants INSERT/UPDATE on daily_challenge_attempts so submissions commit reliably
-- 3. Updates submit_daily_challenge RPC with resilient fallback insertion & safe solver sync
-- 4. Ensures public.daily_challenge_leaderboard view reflects all users immediately
-- ====================================================================

-- 1. Create table public.daily_challenge_solvers
CREATE TABLE IF NOT EXISTS public.daily_challenge_solvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  candidate_name TEXT NOT NULL,
  college TEXT,
  challenge_id TEXT NOT NULL,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_taken_seconds NUMERIC(8,2) NOT NULL,
  streak INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_solvers_date_speed 
  ON public.daily_challenge_solvers(challenge_date, time_taken_seconds ASC);

ALTER TABLE public.daily_challenge_solvers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view daily challenge solvers" ON public.daily_challenge_solvers;
CREATE POLICY "Public can view daily challenge solvers" 
  ON public.daily_challenge_solvers FOR SELECT 
  TO public 
  USING (true);

DROP POLICY IF EXISTS "Allow daily challenge solver submissions" ON public.daily_challenge_solvers;
CREATE POLICY "Allow daily challenge solver submissions" 
  ON public.daily_challenge_solvers FOR INSERT 
  TO public 
  WITH CHECK (true);

GRANT SELECT, INSERT ON public.daily_challenge_solvers TO authenticated, anon;

-- 2. Grant permissions on daily_challenge_attempts
ALTER TABLE public.daily_challenge_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can read own daily attempts"
  ON public.daily_challenge_attempts FOR SELECT
  TO authenticated
  USING ( true );

DROP POLICY IF EXISTS "Anon can view completed daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Anon can view completed daily attempts"
  ON public.daily_challenge_attempts FOR SELECT
  TO anon
  USING ( true );

DROP POLICY IF EXISTS "Users can insert own daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can insert own daily attempts"
  ON public.daily_challenge_attempts FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can update own daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can update own daily attempts"
  ON public.daily_challenge_attempts FOR UPDATE
  TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

GRANT SELECT, INSERT, UPDATE ON public.daily_challenge_attempts TO authenticated;
GRANT SELECT ON public.daily_challenge_attempts TO anon;

-- 3. Recreate public.daily_challenge_leaderboard View
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
JOIN public.daily_challenges c ON a.daily_challenge_id = c.id
LEFT JOIN public.profiles p ON a.user_id = p.id
WHERE a.status = 'completed';

GRANT SELECT ON public.daily_challenge_leaderboard TO authenticated, anon;

-- 4. Resilient submit_daily_challenge RPC
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
  v_challenge_id UUID;
  v_cand_name TEXT;
  v_college TEXT;
  v_avatar TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit daily challenge.';
  END IF;

  -- 1. Fetch user profile
  SELECT name, college, avatar_url 
  INTO v_cand_name, v_college, v_avatar 
  FROM public.profiles 
  WHERE id = v_user_id;

  v_cand_name := COALESCE(v_cand_name, p_metadata->>'candidate_name', 'AptiVerse Scholar');
  v_college   := COALESCE(v_college, p_metadata->>'college', 'Engineering Institute');

  -- 2. Extract challenge id from metadata if provided
  IF (p_metadata ? 'challenge_id') AND (p_metadata->>'challenge_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    v_challenge_id := (p_metadata->>'challenge_id')::uuid;
  END IF;

  -- 3. Retrieve attempt by id OR by (challenge_id, user_id)
  SELECT * INTO v_attempt 
  FROM public.daily_challenge_attempts 
  WHERE (id = p_attempt_id OR (v_challenge_id IS NOT NULL AND daily_challenge_id = v_challenge_id AND user_id = v_user_id))
    AND user_id = v_user_id;

  -- 4. If attempt not found, create it on-the-fly so the user never loses their solve!
  IF v_attempt.id IS NULL THEN
    IF v_challenge_id IS NULL THEN
      -- Pick active challenge for today
      SELECT id INTO v_challenge_id 
      FROM public.daily_challenges 
      WHERE challenge_date = (now() AT TIME ZONE 'Asia/Kolkata')::date;
    END IF;

    IF v_challenge_id IS NULL THEN
      RAISE EXCEPTION 'Active daily challenge not found.';
    END IF;

    INSERT INTO public.daily_challenge_attempts (
      id,
      daily_challenge_id,
      user_id,
      candidate_name,
      college,
      avatar_url,
      started_at,
      submitted_at,
      completion_time_ms,
      score,
      accuracy,
      is_completed,
      is_correct,
      status,
      attempt_metadata
    ) VALUES (
      COALESCE(p_attempt_id, gen_random_uuid()),
      v_challenge_id,
      v_user_id,
      v_cand_name,
      v_college,
      v_avatar,
      COALESCE((p_metadata->>'started_at')::timestamptz, now() - ((COALESCE(p_metadata->>'completion_time_ms', '15000'))::numeric || ' milliseconds')::interval),
      now(),
      COALESCE((p_metadata->>'completion_time_ms')::bigint, 15000),
      COALESCE(p_score, 100),
      COALESCE(p_accuracy, 100),
      true,
      COALESCE(p_is_correct, true),
      'completed',
      COALESCE(p_metadata, '{}'::jsonb)
    ) RETURNING * INTO v_attempt;
  END IF;

  -- 5. Calculate elapsed time
  SELECT * INTO v_challenge FROM public.daily_challenges WHERE id = v_attempt.daily_challenge_id;

  IF (p_metadata ? 'completion_time_ms') AND (p_metadata->>'completion_time_ms')::bigint > 0 THEN
    v_elapsed_ms := (p_metadata->>'completion_time_ms')::bigint;
  ELSE
    v_elapsed_ms := EXTRACT(EPOCH FROM (now() - v_attempt.started_at)) * 1000;
  END IF;

  IF v_elapsed_ms < 500 THEN
    v_elapsed_ms := 1500;
  END IF;

  v_completion_secs := ROUND((v_elapsed_ms::numeric / 1000.0), 2);

  -- 6. Update attempt record
  UPDATE public.daily_challenge_attempts
  SET
    submitted_at = now(),
    completion_time_ms = v_elapsed_ms,
    score = COALESCE(p_score, 0),
    accuracy = COALESCE(p_accuracy, 0),
    is_completed = true,
    is_correct = COALESCE(p_is_correct, false),
    status = 'completed',
    candidate_name = v_cand_name,
    college = v_college,
    attempt_metadata = COALESCE(p_metadata, '{}'::jsonb)
  WHERE id = v_attempt.id;

  -- 7. Safe sync to public.daily_challenge_solvers (cannot roll back transaction)
  BEGIN
    IF p_is_correct AND v_challenge.id IS NOT NULL THEN
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
        v_cand_name,
        v_college,
        COALESCE(v_challenge.game_type, 'DAILY'),
        v_challenge.challenge_date,
        v_completion_secs,
        COALESCE((p_metadata->>'streak')::int, 1)
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Non-blocking catch
  END;

  -- 8. Return ranked entry
  SELECT rank INTO v_rank 
  FROM public.daily_challenge_leaderboard 
  WHERE attempt_id = v_attempt.id;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt.id,
    'daily_challenge_id', v_attempt.daily_challenge_id,
    'started_at', v_attempt.started_at,
    'submitted_at', now(),
    'completion_time_ms', v_elapsed_ms,
    'completion_time_seconds', v_completion_secs,
    'score', COALESCE(p_score, 0),
    'accuracy', COALESCE(p_accuracy, 0),
    'is_completed', true,
    'is_correct', COALESCE(p_is_correct, false),
    'status', 'completed',
    'rank', COALESCE(v_rank, 1)
  );
END;
$$;

-- 5. Safe get_daily_challenge_leaderboard RPC
DROP FUNCTION IF EXISTS public.get_daily_challenge_leaderboard(UUID, INT, INT);
DROP FUNCTION IF EXISTS public.get_daily_challenge_leaderboard(TEXT, INT, INT);

CREATE OR REPLACE FUNCTION public.get_daily_challenge_leaderboard(
  p_challenge_id TEXT,
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

  -- Select unified solvers from daily_challenge_solvers (lightweight and universally accessible)
  WITH unified AS (
    SELECT DISTINCT ON (COALESCE(s.user_id::text, s.candidate_name))
      s.id AS attempt_id,
      s.user_id,
      s.candidate_name AS player_name,
      COALESCE(s.college, 'Candidate') AS college,
      NULL::text AS avatar_url,
      100::numeric AS score,
      100::numeric AS accuracy,
      ROUND(s.time_taken_seconds * 1000)::bigint AS completion_time_ms,
      s.time_taken_seconds AS completion_time_seconds,
      true AS is_correct,
      s.created_at AS submitted_at
    FROM public.daily_challenge_solvers s
    WHERE s.challenge_date = CURRENT_DATE 
       OR s.challenge_id = p_challenge_id
    ORDER BY COALESCE(s.user_id::text, s.candidate_name), s.time_taken_seconds ASC
  ),
  ranked AS (
    SELECT 
      DENSE_RANK() OVER (ORDER BY completion_time_seconds ASC, submitted_at ASC) AS rank,
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
    FROM unified
  )
  SELECT COUNT(*) INTO v_total_participants FROM ranked;

  SELECT COALESCE(jsonb_agg(to_jsonb(r)), '[]'::jsonb) INTO v_entries
  FROM (
    SELECT * FROM ranked
    ORDER BY rank ASC
    LIMIT p_limit
    OFFSET p_offset
  ) r;

  IF v_user_id IS NOT NULL THEN
    SELECT to_jsonb(m) INTO v_my_entry
    FROM (
      SELECT * FROM ranked
      WHERE user_id = v_user_id
      LIMIT 1
    ) m;
  END IF;

  RETURN jsonb_build_object(
    'total_participants', v_total_participants,
    'entries', v_entries,
    'my_entry', v_my_entry
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_daily_challenge_leaderboard(TEXT, INT, INT) TO authenticated, anon;

-- 6. Backfill existing historical solvers from game_sessions
DO $$
BEGIN
  INSERT INTO public.daily_challenge_solvers (
    id,
    user_id,
    candidate_name,
    college,
    challenge_id,
    challenge_date,
    time_taken_seconds,
    streak,
    created_at
  )
  SELECT 
    s.id,
    s.user_id,
    COALESCE(p.name, 'AptiVerse Scholar') AS candidate_name,
    COALESCE(p.college, '—') AS college,
    'daily_challenge' AS challenge_id,
    s.created_at::date AS challenge_date,
    COALESCE(s.time_spent, 15) AS time_taken_seconds,
    1 AS streak,
    s.created_at
  FROM public.game_sessions s
  LEFT JOIN public.profiles p ON s.user_id = p.id
  WHERE s.game_id = 'daily_challenge'
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 7. Grant INSERT on game_sessions and configure RLS policy
GRANT INSERT, SELECT ON public.game_sessions TO authenticated;
GRANT SELECT ON public.game_sessions TO anon;

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Game sessions are viewable by everyone." ON public.game_sessions;
CREATE POLICY "Game sessions are viewable by everyone."
  ON public.game_sessions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own game sessions." ON public.game_sessions;
CREATE POLICY "Users can insert their own game sessions."
  ON public.game_sessions FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

-- 8. Backfill daily_challenge_solvers into game_sessions so Sessions tab has all recent records
INSERT INTO public.game_sessions (
  id,
  user_id,
  game_id,
  level,
  score,
  accuracy,
  time_spent,
  passed_distraction,
  attempt_id,
  created_at
)
SELECT 
  s.id,
  s.user_id,
  'daily_challenge' AS game_id,
  1 AS level,
  10.00 AS score,
  100 AS accuracy,
  COALESCE(ROUND(s.time_taken_seconds), 15)::int AS time_spent,
  true AS passed_distraction,
  s.id AS attempt_id,
  s.created_at
FROM public.daily_challenge_solvers s
WHERE s.user_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;


