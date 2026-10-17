-- Migration: 20261017_cumulative_leaderboards.sql
-- Switch all leaderboard views from deduplicated distinct_level_scores to pure cumulative scoring

-- 1. GLOBAL LEADERBOARD (Cumulative sum of all games played)
DROP VIEW IF EXISTS public.global_leaderboard CASCADE;
CREATE VIEW public.global_leaderboard AS
SELECT 
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(s.score), 0) AS total_score,
  COALESCE(ROUND(AVG(s.accuracy)), 0) AS avg_accuracy,
  COUNT(s.id)::integer AS total_games,
  COALESCE(SUM(s.time_spent), 0)::integer AS total_time
FROM public.profiles p
JOIN public.game_sessions s ON p.id = s.user_id
WHERE (p.is_blocked IS NOT TRUE)
GROUP BY p.id, p.name, p.college, p.avatar_url;

-- 2. GAME-SPECIFIC LEADERBOARD (Cumulative sum per game)
DROP VIEW IF EXISTS public.game_leaderboard CASCADE;
CREATE VIEW public.game_leaderboard AS
SELECT 
  CASE WHEN s.game_id = 'geo_sudoku' THEN 'sudoku' ELSE s.game_id END AS game_id,
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(s.score), 0) AS total_score,
  COALESCE(ROUND(AVG(s.accuracy)), 0) AS avg_accuracy,
  COUNT(s.id)::integer AS total_games,
  COALESCE(SUM(s.time_spent), 0)::integer AS total_time
FROM public.profiles p
JOIN public.game_sessions s ON p.id = s.user_id
WHERE (p.is_blocked IS NOT TRUE)
GROUP BY CASE WHEN s.game_id = 'geo_sudoku' THEN 'sudoku' ELSE s.game_id END, p.id, p.name, p.college, p.avatar_url;

-- 3. WEEKLY LEADERBOARD (Cumulative sum past 7 days)
DROP VIEW IF EXISTS public.weekly_leaderboard CASCADE;
CREATE VIEW public.weekly_leaderboard AS
SELECT 
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(s.score), 0) AS total_score,
  COALESCE(ROUND(AVG(s.accuracy)), 0) AS avg_accuracy,
  COUNT(s.id)::integer AS total_games,
  COALESCE(SUM(s.time_spent), 0)::integer AS total_time
FROM public.profiles p
JOIN public.game_sessions s ON p.id = s.user_id
WHERE (p.is_blocked IS NOT TRUE)
  AND s.created_at >= (NOW() - INTERVAL '7 days')
GROUP BY p.id, p.name, p.college, p.avatar_url;

-- Grants
GRANT SELECT ON public.global_leaderboard TO anon, authenticated;
GRANT SELECT ON public.game_leaderboard TO anon, authenticated;
GRANT SELECT ON public.weekly_leaderboard TO anon, authenticated;
