-- ====================================================================
-- APTIVERSE MASTER DATABASE SECURITY & LEADERBOARD SYNC SUITE
-- Run this in Supabase Dashboard -> SQL Editor (with Admin / postgres role)
-- ====================================================================

-- 1. Helper function to check if caller has 'admin' role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. PROFILE SECURITY: Prevent ordinary users from altering role or is_blocked
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK (
    auth.uid() = id
    AND (
      (role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
      OR is_admin()
    )
    AND (
      (is_blocked IS NOT DISTINCT FROM (SELECT p.is_blocked FROM public.profiles p WHERE p.id = auth.uid()))
      OR is_admin()
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

DROP POLICY IF EXISTS "Admins have full access to game_sessions" ON public.game_sessions;
CREATE POLICY "Admins have full access to game_sessions"
  ON public.game_sessions FOR ALL
  TO authenticated
  USING ( is_admin() )
  WITH CHECK ( is_admin() );

DROP POLICY IF EXISTS "Admins have full access to bug_reports" ON public.bug_reports;
CREATE POLICY "Admins have full access to bug_reports"
  ON public.bug_reports FOR ALL
  TO authenticated
  USING ( is_admin() );

DROP POLICY IF EXISTS "Admins have full access to feedback" ON public.feedback;
CREATE POLICY "Admins have full access to feedback"
  ON public.feedback FOR ALL
  TO authenticated
  USING ( is_admin() );

-- 3. Add columns to profiles and game_sessions if missing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS warning_message TEXT;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS attempt_id UUID;

-- 4. Recreate global_leaderboard view with DISTINCT LEVEL SCORING & geo_sudoku merged
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

-- 5. Recreate game_leaderboard view
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

-- 6. Weekly leaderboard view
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

-- 7. College leaderboard view
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

-- 8. ANTI-CHEAT VALIDATION TRIGGER (Proportionate protection, no arbitrary level 50 ceiling)
CREATE OR REPLACE FUNCTION public.secure_validate_game_session()
RETURNS TRIGGER AS $$
DECLARE
  v_last_session_time TIMESTAMP WITH TIME ZONE;
  v_recent_count INT;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != NEW.user_id THEN
    RAISE EXCEPTION 'Security Violation: Unauthorized session submission';
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.user_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Security Violation: Account is suspended';
  END IF;

  IF NEW.game_id = 'geo_sudoku' THEN
    NEW.game_id := 'sudoku';
  END IF;

  IF NEW.game_id NOT IN ('motion', 'sudoku', 'grid', 'switch', 'inductive', 'di', 'rc') THEN
    RAISE EXCEPTION 'Security Violation: Unknown game identifier';
  END IF;

  IF NEW.level < 1 THEN
    RAISE EXCEPTION 'Security Violation: Invalid level %', NEW.level;
  END IF;

  IF NEW.score < 0 OR NEW.score > 10 THEN
    RAISE EXCEPTION 'Security Violation: Score must be between 0 and 10';
  END IF;
  IF NEW.accuracy < 0 OR NEW.accuracy > 100 THEN
    RAISE EXCEPTION 'Security Violation: Accuracy must be between 0 and 100';
  END IF;

  IF NEW.time_spent < 2 THEN
    RAISE EXCEPTION 'Anti-Cheat: Completion time too low';
  END IF;

  SELECT created_at INTO v_last_session_time
  FROM public.game_sessions
  WHERE user_id = NEW.user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_last_session_time IS NOT NULL AND (NOW() - v_last_session_time) < INTERVAL '2 seconds' THEN
    RAISE EXCEPTION 'Anti-Cheat: Submissions too fast. Please play normally.';
  END IF;

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

NOTIFY pgrst, 'reload schema';
