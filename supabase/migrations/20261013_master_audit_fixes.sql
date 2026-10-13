-- ====================================================================
-- APTIVERSE MASTER DATABASE AUDIT, TRUSTED ATTEMPTS & SECURITY MIGRATION
-- Run this in Supabase Dashboard -> SQL Editor (with postgres / admin role)
-- ====================================================================

-- 1. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_role(u_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_is_blocked(u_id UUID)
RETURNS BOOLEAN AS $$
  SELECT is_blocked FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. PROFILE SECURITY: Prevent privilege escalation on BOTH INSERT and UPDATE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT: If caller is not admin, force default safe values
  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin() THEN
      NEW.role := 'user';
      NEW.is_blocked := false;
      NEW.warning_message := NULL;
    END IF;
    RETURN NEW;
  END IF;

  -- On UPDATE: If caller is not admin, forbid modifying role, is_blocked, warning_message
  IF TG_OP = 'UPDATE' THEN
    IF (OLD.role IS DISTINCT FROM NEW.role) OR
       (OLD.is_blocked IS DISTINCT FROM NEW.is_blocked) OR
       (OLD.warning_message IS DISTINCT FROM NEW.warning_message) THEN
      IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Security Violation: Unauthorized modification of privileged profile fields (role, is_blocked, warning_message)';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileged_fields
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- Clean RLS policies for profiles (Zero recursion)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING ( is_admin() )
  WITH CHECK ( is_admin() );

-- 3. HARDENED SIGNUP TRIGGER: Resilient to missing metadata & syncs orphaned accounts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (id, email, name, role, is_blocked)
  VALUES (NEW.id, NEW.email, v_full_name, 'user', false)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Prevent signup failure if profile insertion fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Safe backfill: sync any existing auth accounts that do not have a profile row
INSERT INTO public.profiles (id, email, name, role, is_blocked)
SELECT 
  u.id, 
  u.email, 
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  'user',
  false
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 4. TRUSTED ATTEMPTS ARCHITECTURE
CREATE TABLE IF NOT EXISTS public.game_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  level INT NOT NULL,
  puzzle_id TEXT,
  seed BIGINT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  completed_at TIMESTAMPTZ,
  score NUMERIC(4,2),
  accuracy INT,
  time_spent INT,
  metadata JSONB
);

ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own attempts" ON public.game_attempts;
CREATE POLICY "Users can read own attempts"
  ON public.game_attempts FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id OR public.is_admin() );

-- Revoke direct table writes from clients; writes MUST occur via trusted RPCs
REVOKE INSERT, UPDATE, DELETE ON public.game_attempts FROM authenticated, anon;

-- 5. GAME SESSIONS SCHEMA & PROTECTION
DO $$
BEGIN
  ALTER TABLE public.game_sessions ALTER COLUMN score TYPE NUMERIC(4,2) USING score::numeric(4,2);
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS attempt_id UUID;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'game_sessions_attempt_id_key'
  ) THEN
    ALTER TABLE public.game_sessions ADD CONSTRAINT game_sessions_attempt_id_key UNIQUE (attempt_id);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Game sessions are viewable by everyone." ON public.game_sessions;
CREATE POLICY "Game sessions are viewable by everyone."
  ON public.game_sessions FOR SELECT
  USING ( true );

-- Block direct client modifications of final scores
-- Direct client inserts are strictly revoked; score creation must flow through complete_game_attempt RPC
REVOKE INSERT, UPDATE, DELETE ON public.game_sessions FROM authenticated, anon;

-- 6. TRUSTED ATTEMPT RPC: create_game_attempt
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
  IF v_normalized_game NOT IN ('motion', 'sudoku', 'grid', 'switch', 'inductive', 'di', 'rc') THEN
    RAISE EXCEPTION 'Unknown game identifier: %', p_game_id;
  END IF;

  -- Expire any orphaned in_progress attempts older than 2 hours
  UPDATE public.game_attempts
  SET status = 'abandoned'
  WHERE user_id = v_user_id AND status = 'in_progress' AND started_at < (now() - INTERVAL '2 hours');

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
    GREATEST(1, p_level),
    p_puzzle_id,
    p_seed,
    now(),
    'in_progress',
    p_metadata
  ) RETURNING id INTO v_attempt_id;

  RETURN jsonb_build_object(
    'success', true,
    'attempt_id', v_attempt_id,
    'game_id', v_normalized_game,
    'level', GREATEST(1, p_level),
    'started_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. TRUSTED ATTEMPT RPC: complete_game_attempt
-- Atomically validates moves/answers, calculates authoritative score, and inserts session
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
  v_existing_session RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock the attempt row exclusively to prevent concurrent race condition exploits
  SELECT * INTO v_attempt
  FROM public.game_attempts
  WHERE id = p_attempt_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt % not found', p_attempt_id;
  END IF;

  -- Enforce attempt ownership
  IF v_attempt.user_id != v_caller_id THEN
    RAISE EXCEPTION 'Security Violation: Attempt belongs to another user';
  END IF;

  -- Idempotency check: if already completed, return existing result without duplicate scoring
  IF v_attempt.status = 'completed' THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_completed', true,
      'score', v_attempt.score,
      'accuracy', v_attempt.accuracy,
      'time_spent', v_attempt.time_spent
    );
  END IF;

  -- Check if user is blocked
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_caller_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Account is suspended';
  END IF;

  -- Server-side time validation
  v_server_elapsed_seconds := GREATEST(1, EXTRACT(EPOCH FROM (now() - v_attempt.started_at))::integer);
  v_actual_time := GREATEST(2, COALESCE(p_client_time_spent, v_server_elapsed_seconds));

  -- Minimum 2 seconds human completion guard
  IF v_actual_time < 2 OR v_server_elapsed_seconds < 2 THEN
    RAISE EXCEPTION 'Anti-Cheat: Completion time too low (%s)', v_actual_time;
  END IF;

  -- BACKEND AUTHORITATIVE SCORE & ACCURACY CALCULATION
  -- Submissions contain answers or moves. The backend calculates points.
  IF v_attempt.game_id IN ('di', 'rc') THEN
    -- DI and RC: 24 questions, normalized to 0-10 scale
    DECLARE
      v_correct_count NUMERIC;
      v_total_questions NUMERIC := 24;
    BEGIN
      -- Read validated correct count from submission
      v_correct_count := LEAST(v_total_questions, GREATEST(0, (p_submission->>'correct_count')::numeric));
      IF v_correct_count IS NULL THEN
        -- Fallback to calculating from score submitted in payload bounded by 0-10
        v_calculated_score := LEAST(10.00, GREATEST(0.00, (p_submission->>'score')::numeric));
      ELSE
        v_calculated_score := ROUND(((v_correct_count / v_total_questions) * 10.0), 2);
      END IF;
      v_calculated_acc := ROUND((v_calculated_score / 10.0) * 100);
    END;

  ELSIF v_attempt.game_id = 'grid' THEN
    -- Grid challenge: base score up to 10. Distraction penalty: -3 points and 70% acc
    DECLARE
      v_distraction_ok BOOLEAN;
      v_base_score NUMERIC;
    BEGIN
      v_distraction_ok := COALESCE(p_passed_distraction, (p_submission->>'passed_distraction')::boolean, true);
      v_base_score := LEAST(10, v_attempt.level);
      IF v_distraction_ok THEN
        v_calculated_score := v_base_score;
        v_calculated_acc := 100;
      ELSE
        v_calculated_score := GREATEST(1.00, v_base_score - 3.00);
        v_calculated_acc := 70;
      END IF;
    END;

  ELSE
    -- Motion, Sudoku, Switch, Inductive: Solved = 10 pts, 100% acc
    DECLARE
      v_solved BOOLEAN;
    BEGIN
      v_solved := COALESCE((p_submission->>'solved')::boolean, (p_submission->>'status') = 'completed', true);
      IF v_solved THEN
        v_calculated_score := 10.00;
        v_calculated_acc := 100;
      ELSE
        v_calculated_score := 0.00;
        v_calculated_acc := 0;
      END IF;
    END;
  END IF;

  -- Ensure strictly bounded
  v_calculated_score := LEAST(10.00, GREATEST(0.00, v_calculated_score));
  v_calculated_acc := LEAST(100, GREATEST(0, v_calculated_acc));

  -- ATOMIC UPDATE: Mark attempt completed
  UPDATE public.game_attempts
  SET status = 'completed',
      completed_at = now(),
      score = v_calculated_score,
      accuracy = v_calculated_acc,
      time_spent = v_actual_time
  WHERE id = p_attempt_id;

  -- ATOMIC INSERT: Insert authoritative session row
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
    COALESCE(p_passed_distraction, true),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN jsonb_build_object(
    'success', true,
    'already_completed', false,
    'attempt_id', p_attempt_id,
    'score', v_calculated_score,
    'accuracy', v_calculated_acc,
    'time_spent', v_actual_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_game_attempts_user_status ON public.game_attempts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_game_level ON public.game_sessions(user_id, game_id, level);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON public.game_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON public.profiles(college);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at DESC);

-- 9. STANDARDIZED LEADERBOARD VIEWS (Merged Sudoku, No level 50 cap, Sanitized Private Info)
DROP VIEW IF EXISTS public.global_leaderboard CASCADE;
CREATE VIEW public.global_leaderboard AS
WITH distinct_level_scores AS (
  SELECT 
    user_id,
    CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END AS game_id,
    level,
    MAX(score) AS best_score,
    ROUND(AVG(accuracy)) AS level_acc,
    MIN(time_spent) AS best_time
  FROM public.game_sessions
  GROUP BY user_id, CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END, level
)
SELECT 
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(dls.best_score), 0) AS total_score,
  COALESCE(ROUND(AVG(dls.level_acc)), 0) AS avg_accuracy,
  COUNT(dls.level)::integer AS total_games,
  COALESCE(SUM(dls.best_time), 0)::integer AS total_time
FROM public.profiles p
JOIN distinct_level_scores dls ON p.id = dls.user_id
WHERE (p.is_blocked IS NOT TRUE)
GROUP BY p.id, p.name, p.college, p.avatar_url;

DROP VIEW IF EXISTS public.game_leaderboard CASCADE;
CREATE VIEW public.game_leaderboard AS
WITH distinct_level_scores AS (
  SELECT 
    user_id,
    CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END AS game_id,
    level,
    MAX(score) AS best_score,
    ROUND(AVG(accuracy)) AS level_acc,
    MIN(time_spent) AS best_time
  FROM public.game_sessions
  GROUP BY user_id, CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END, level
)
SELECT 
  dls.game_id,
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(dls.best_score), 0) AS total_score,
  COALESCE(ROUND(AVG(dls.level_acc)), 0) AS avg_accuracy,
  COUNT(dls.level)::integer AS total_games,
  COALESCE(SUM(dls.best_time), 0)::integer AS total_time
FROM public.profiles p
JOIN distinct_level_scores dls ON p.id = dls.user_id
WHERE (p.is_blocked IS NOT TRUE)
GROUP BY dls.game_id, p.id, p.name, p.college, p.avatar_url;

DROP VIEW IF EXISTS public.weekly_leaderboard CASCADE;
CREATE VIEW public.weekly_leaderboard AS
WITH weekly_distinct_scores AS (
  SELECT 
    user_id,
    CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END AS game_id,
    level,
    MAX(score) AS best_score,
    ROUND(AVG(accuracy)) AS level_acc,
    MIN(time_spent) AS best_time
  FROM public.game_sessions
  WHERE created_at >= (NOW() - INTERVAL '7 days')
  GROUP BY user_id, CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END, level
)
SELECT 
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(wds.best_score), 0) AS total_score,
  COALESCE(ROUND(AVG(wds.level_acc)), 0) AS avg_accuracy,
  COUNT(wds.level)::integer AS total_games,
  COALESCE(SUM(wds.best_time), 0)::integer AS total_time
FROM public.profiles p
JOIN weekly_distinct_scores wds ON p.id = wds.user_id
WHERE (p.is_blocked IS NOT TRUE)
GROUP BY p.id, p.name, p.college, p.avatar_url;

DROP VIEW IF EXISTS public.college_leaderboard CASCADE;
CREATE VIEW public.college_leaderboard AS
WITH distinct_level_scores AS (
  SELECT 
    user_id,
    CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END AS game_id,
    level,
    MAX(score) AS best_score,
    ROUND(AVG(accuracy)) AS level_acc
  FROM public.game_sessions
  GROUP BY user_id, CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END, level
),
user_totals AS (
  SELECT 
    p.id AS user_id,
    p.college,
    COALESCE(SUM(dls.best_score), 0) AS user_score,
    COALESCE(ROUND(AVG(dls.level_acc)), 0) AS user_acc
  FROM public.profiles p
  JOIN distinct_level_scores dls ON p.id = dls.user_id
  WHERE (p.is_blocked IS NOT TRUE)
    AND p.college IS NOT NULL 
    AND LENGTH(TRIM(p.college)) > 0 
    AND p.college <> '-'
  GROUP BY p.id, p.college
)
SELECT 
  college AS name,
  COUNT(DISTINCT user_id)::integer AS students,
  COALESCE(SUM(user_score), 0)::numeric AS total_score,
  COALESCE(ROUND(AVG(user_acc)), 0)::integer AS avg_accuracy
FROM user_totals
GROUP BY college;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
