-- ====================================================================
-- APTIVERSE MASTER DATABASE AUDIT & SECURITY MIGRATION
-- Run this in Supabase Dashboard -> SQL Editor (with postgres / admin role)
-- ====================================================================

-- 1. Helper functions (SECURITY DEFINER prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role(u_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_is_blocked(u_id UUID)
RETURNS BOOLEAN AS $$
  SELECT is_blocked FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_warning_message(u_id UUID)
RETURNS TEXT AS $$
  SELECT warning_message FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. PROFILE SECURITY: Prevent ordinary users from altering role, is_blocked, or warnings
-- Ordinary users can ONLY update their personal details: name, college, department, avatar_url
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK (
    auth.uid() = id
    AND (
      (role IS NOT DISTINCT FROM public.get_user_role(auth.uid()))
      OR public.is_admin()
    )
    AND (
      (is_blocked IS NOT DISTINCT FROM public.get_user_is_blocked(auth.uid()))
      OR public.is_admin()
    )
    AND (
      (warning_message IS NOT DISTINCT FROM public.get_user_warning_message(auth.uid()))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING ( is_admin() )
  WITH CHECK ( is_admin() );

-- 3. GAME SESSIONS SCHEMA ENHANCEMENTS
-- Ensure score supports fractional values (numeric(4,2)) for normalized scores (e.g. 2.08)
DO $$
BEGIN
  ALTER TABLE public.game_sessions ALTER COLUMN score TYPE NUMERIC(4,2) USING score::numeric(4,2);
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Add attempt_id to enforce uniqueness of each assigned puzzle attempt
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

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_game_level ON public.game_sessions(user_id, game_id, level);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON public.game_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON public.profiles(college);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at DESC);

-- 5. STANDARDIZED VIEWS: Merges geo_sudoku into sudoku, no 300 game penalty, no level <= 50 cutoff

-- 5A. All-time global leaderboard view
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

-- 5B. Game-specific leaderboard view
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

-- 5C. Weekly leaderboard view (Past 7 days)
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

-- 5D. College standings leaderboard view (Calculated in PostgreSQL)
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

-- 6. SECURITY VALIDATION TRIGGER (Proportionate protection, no arbitrary level 50 ceiling)
CREATE OR REPLACE FUNCTION public.secure_validate_game_session()
RETURNS TRIGGER AS $$
DECLARE
  v_last_session_time TIMESTAMP WITH TIME ZONE;
  v_recent_count INT;
  v_recent_same_level_count INT;
BEGIN
  -- 1. Authentication check
  IF auth.uid() IS NULL OR auth.uid() != NEW.user_id THEN
    RAISE EXCEPTION 'Security Violation: Unauthorized session submission';
  END IF;

  -- 2. Blocked status check
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.user_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Security Violation: Account is suspended';
  END IF;

  -- 3. Whitelisted Game ID check (normalizes geo_sudoku to sudoku)
  IF NEW.game_id = 'geo_sudoku' THEN
    NEW.game_id := 'sudoku';
  END IF;

  IF NEW.game_id NOT IN ('motion', 'sudoku', 'grid', 'switch', 'inductive', 'di', 'rc') THEN
    RAISE EXCEPTION 'Security Violation: Unknown game identifier';
  END IF;

  -- 4. Level must be positive (removed arbitrary level 50 limit)
  IF NEW.level < 1 THEN
    RAISE EXCEPTION 'Security Violation: Invalid level %', NEW.level;
  END IF;

  -- 5. Score & Accuracy boundaries
  IF NEW.score < 0 OR NEW.score > 10 THEN
    RAISE EXCEPTION 'Security Violation: Score must be between 0 and 10';
  END IF;
  IF NEW.accuracy < 0 OR NEW.accuracy > 100 THEN
    RAISE EXCEPTION 'Security Violation: Accuracy must be between 0 and 100';
  END IF;

  -- 6. Minimum human completion time (at least 2 seconds)
  IF NEW.time_spent < 2 THEN
    RAISE EXCEPTION 'Anti-Cheat: Completion time too low';
  END IF;

  -- 7. Submission spacing check (prevent automated scripts firing in under 2 seconds)
  SELECT created_at INTO v_last_session_time
  FROM public.game_sessions
  WHERE user_id = NEW.user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_last_session_time IS NOT NULL AND (NOW() - v_last_session_time) < INTERVAL '2 seconds' THEN
    RAISE EXCEPTION 'Anti-Cheat: Submissions too fast. Please play normally.';
  END IF;

  -- 8. Hourly quota (allows dedicated students up to 120 attempts per hour)
  SELECT count(*) INTO v_recent_count
  FROM public.game_sessions
  WHERE user_id = NEW.user_id
    AND created_at > (NOW() - INTERVAL '1 hour');

  IF v_recent_count >= 120 THEN
    RAISE EXCEPTION 'Anti-Cheat: Hourly game quota reached. Please take a break.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_secure_game_session ON public.game_sessions;
CREATE TRIGGER trg_secure_game_session
BEFORE INSERT ON public.game_sessions
FOR EACH ROW
EXECUTE FUNCTION public.secure_validate_game_session();

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
