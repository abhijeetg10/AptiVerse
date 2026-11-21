-- ====================================================================
-- MIGRATION: 20261121_scale_indexes_and_optimizations.sql
-- Optimizations for 2,750+ Users & 144,000+ Game Sessions
--
-- 1. High-Performance Composite Indexes for instant query execution
-- 2. Standardize and Merge Duplicate College Names (JECRC/JSRC, VSB, CIT, RIT, KGCAS)
-- 3. Clean Cumulative College Leaderboard View
-- 4. Grants and security verification for all leaderboard views
-- ====================================================================

-- 1. COMPOSITE INDEXES ON game_sessions
-- Eliminates sequential table scans when querying user history on 144k+ rows
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_created 
  ON public.game_sessions(user_id, created_at DESC);

-- Accelerates game-specific and date-range queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_created 
  ON public.game_sessions(game_id, created_at DESC);

-- Accelerates score aggregation per user
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_score 
  ON public.game_sessions(user_id, score);

-- 2. INDEXES ON profiles
-- Accelerates filtering out blocked accounts
CREATE INDEX IF NOT EXISTS idx_profiles_unblocked 
  ON public.profiles(is_blocked);

-- Accelerates college grouping and filtering
CREATE INDEX IF NOT EXISTS idx_profiles_college_active 
  ON public.profiles(college) WHERE (college IS NOT NULL AND college <> '-');

-- 3. INDEXES ON daily_challenge_solvers & company_mock_scores
CREATE INDEX IF NOT EXISTS idx_daily_solvers_date 
  ON public.daily_challenge_solvers(challenge_date);

CREATE INDEX IF NOT EXISTS idx_daily_solvers_created 
  ON public.daily_challenge_solvers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_company_mock_scores_user_created 
  ON public.company_mock_scores(user_id, created_at DESC);

-- 4. STANDARDIZE & MERGE COLLEGE NAME VARIATIONS IN profiles
-- Unifies JECRC / JSRC Foundation & University variants into one canonical name
UPDATE public.profiles
SET college = 'JECRC University & Foundation, Jaipur'
WHERE college ILIKE '%jecrc%' 
   OR college ILIKE '%jsrc%' 
   OR college ILIKE '%jaipur engineering college%research%';

-- Unifies VSB Engineering College variants
UPDATE public.profiles
SET college = 'VSB Engineering College, Karur'
WHERE college ILIKE '%vsb%' 
   OR college ILIKE '%v.s.b.%';

-- Unifies Chennai Institute of Technology (CIT)
UPDATE public.profiles
SET college = 'Chennai Institute of Technology (CIT), Chennai'
WHERE college ILIKE 'cit' 
   OR college ILIKE '%chennai institute of technology%';

-- Unifies Rajarambapu Institute of Technology (RIT)
UPDATE public.profiles
SET college = 'Rajarambapu Institute of Technology (RIT), Sangli'
WHERE college ILIKE 'rit' 
   OR college ILIKE '%rajarambapu institute of technology%';

-- Unifies KG College of Arts and Science (KGCAS)
UPDATE public.profiles
SET college = 'KG College of Arts and Science (KGCAS), Coimbatore'
WHERE college ILIKE '%kgcas%' 
   OR college ILIKE '%kg college of%'
   OR college ILIKE '%kg college of arys%';

-- 5. CUMULATIVE COLLEGE LEADERBOARD VIEW
-- Groups total scores, average accuracy, and student count by college
DROP VIEW IF EXISTS public.college_leaderboard CASCADE;
CREATE VIEW public.college_leaderboard AS
SELECT 
  p.college AS name,
  COUNT(DISTINCT p.id)::integer AS students,
  COALESCE(SUM(s.score), 0)::numeric AS total_score,
  COALESCE(ROUND(AVG(s.accuracy)), 0)::numeric AS avg_accuracy,
  COUNT(s.id)::integer AS total_games
FROM public.profiles p
JOIN public.game_sessions s ON p.id = s.user_id
WHERE (p.is_blocked IS NOT TRUE)
  AND p.college IS NOT NULL 
  AND LENGTH(TRIM(p.college)) > 0 
  AND p.college <> '-'
GROUP BY p.college;

-- Ensure grants for anon and authenticated users
GRANT SELECT ON public.global_leaderboard TO anon, authenticated;
GRANT SELECT ON public.game_leaderboard TO anon, authenticated;
GRANT SELECT ON public.weekly_leaderboard TO anon, authenticated;
GRANT SELECT ON public.college_leaderboard TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
