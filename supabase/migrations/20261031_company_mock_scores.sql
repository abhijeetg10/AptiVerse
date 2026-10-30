-- Migration: Company Mock Test Minimal Scores
-- Minimal storage to minimize database bandwidth and prevent table bloat

CREATE TABLE IF NOT EXISTS public.company_mock_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL DEFAULT 'infosys',
  test_id TEXT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  sectional_scores JSONB,
  cleared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.company_mock_scores ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own test scores
DROP POLICY IF EXISTS "Users can insert own mock scores" ON public.company_mock_scores;
CREATE POLICY "Users can insert own mock scores"
  ON public.company_mock_scores FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

-- Allow users to view their own test scores
DROP POLICY IF EXISTS "Users can view own mock scores" ON public.company_mock_scores;
CREATE POLICY "Users can view own mock scores"
  ON public.company_mock_scores FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

-- Create index for quick lookup by user and test
CREATE INDEX IF NOT EXISTS idx_company_mock_scores_user ON public.company_mock_scores(user_id, company, test_id);

