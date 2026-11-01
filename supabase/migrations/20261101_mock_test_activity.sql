-- ====================================================================
-- MIGRATION: Company Mock Test Activity & Candidate Feedback
-- Stores: Candidate Name, Test Given, Score, and Feedback in DB
-- Interview scores/answers are explicitly NOT stored to prevent DB bloat.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.company_mock_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  candidate_name TEXT,
  company TEXT NOT NULL DEFAULT 'infosys',
  test_id TEXT NOT NULL,
  test_title TEXT,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  percentage NUMERIC(5,2),
  sectional_scores JSONB,
  cleared BOOLEAN DEFAULT false,
  feedback_rating INT,
  feedback_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- In case table already existed from earlier schema, ensure all columns exist
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS candidate_name TEXT;
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS test_title TEXT;
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS percentage NUMERIC(5,2);
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS feedback_rating INT;
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS feedback_comment TEXT;

-- Make user_id nullable so guest attempts can also be tracked if needed
DO $$
BEGIN
  ALTER TABLE public.company_mock_scores ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Enable Row Level Security
ALTER TABLE public.company_mock_scores ENABLE ROW LEVEL SECURITY;

-- Allow insert by authenticated users or public
DROP POLICY IF EXISTS "Users can insert own mock scores" ON public.company_mock_scores;
DROP POLICY IF EXISTS "Allow mock test submissions" ON public.company_mock_scores;
CREATE POLICY "Allow mock test submissions"
  ON public.company_mock_scores FOR INSERT
  TO public
  WITH CHECK ( true );

-- Allow users to view their own test scores
DROP POLICY IF EXISTS "Users can view own mock scores" ON public.company_mock_scores;
CREATE POLICY "Users can view own mock scores"
  ON public.company_mock_scores FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

-- Allow admins full access (view, delete, review)
DROP POLICY IF EXISTS "Admins have full access to mock scores" ON public.company_mock_scores;
CREATE POLICY "Admins have full access to mock scores"
  ON public.company_mock_scores FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_company_mock_scores_created ON public.company_mock_scores(created_at DESC);

