-- ====================================================================
-- MIGRATION: Daily Challenge Solvers & Streak System
-- Tracks daily hard problem completions, solve speeds, and consecutive streaks
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.daily_challenge_solvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  candidate_name TEXT NOT NULL,
  college TEXT,
  challenge_id TEXT NOT NULL,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_taken_seconds NUMERIC(6,2) NOT NULL,
  streak INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for today's speed leaderboard
CREATE INDEX IF NOT EXISTS idx_daily_solvers_date_speed 
  ON public.daily_challenge_solvers(challenge_date, time_taken_seconds ASC);

-- Index for user streak lookups
CREATE INDEX IF NOT EXISTS idx_daily_solvers_user 
  ON public.daily_challenge_solvers(user_id, challenge_date DESC);

-- Enable Row Level Security
ALTER TABLE public.daily_challenge_solvers ENABLE ROW LEVEL SECURITY;

-- Allow public to view daily leaderboard
DROP POLICY IF EXISTS "Public can view daily challenge solvers" ON public.daily_challenge_solvers;
CREATE POLICY "Public can view daily challenge solvers"
  ON public.daily_challenge_solvers FOR SELECT
  TO public
  USING ( true );

-- Allow insert
DROP POLICY IF EXISTS "Allow daily challenge solver submissions" ON public.daily_challenge_solvers;
CREATE POLICY "Allow daily challenge solver submissions"
  ON public.daily_challenge_solvers FOR INSERT
  TO public
  WITH CHECK ( true );

-- Delete any legacy test/seed dummy records
DELETE FROM public.daily_challenge_solvers 
WHERE candidate_name IN ('Ananya Deshmukh', 'Rahul Kulkarni', 'Siddharth Roy', 'Sample Candidate', 'Test Candidate')
   OR candidate_name ILIKE '%test%';


