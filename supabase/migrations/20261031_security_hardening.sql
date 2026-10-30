-- ====================================================================
-- APTIVERSE MASTER SECURITY HARDENING & AUDIT REMEDIATION MIGRATION
-- Run this in Supabase Dashboard -> SQL Editor (with postgres / admin role)
-- ====================================================================

-- 1. SECURE SEARCH_PATH ON ALL SECURITY DEFINER FUNCTIONS (Mitigate search_path hijacking)
-- Enforce CIS/OWASP standard: SET search_path = '' with fully schema-qualified object references

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_user_role(u_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_user_is_blocked(u_id UUID)
RETURNS BOOLEAN AS $$
  SELECT is_blocked FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = '';

-- 2. PROFILE SECURITY: Prevent privilege escalation on both INSERT and UPDATE
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileged_fields
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- Clean RLS policies for profiles
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
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- 3. HARDENED SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  v_full_name := pg_catalog.coalesce(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    pg_catalog.split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (id, email, name, role, is_blocked)
  VALUES (NEW.id, NEW.email, v_full_name, 'user', false)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 4. SECURE BUG REPORTS & FEEDBACK (Fix Data Exposure & Spam Abuse)
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Drop insecure open-read policies
DROP POLICY IF EXISTS "Bug reports are viewable by everyone." ON public.bug_reports;
DROP POLICY IF EXISTS "Anyone can insert bug reports." ON public.bug_reports;
DROP POLICY IF EXISTS "Feedback is viewable by everyone." ON public.feedback;
DROP POLICY IF EXISTS "Anyone can insert feedback." ON public.feedback;
DROP POLICY IF EXISTS "Users can view own bug reports" ON public.bug_reports;
DROP POLICY IF EXISTS "Authenticated users can submit bug reports" ON public.bug_reports;
DROP POLICY IF EXISTS "Admins have full access to bug_reports" ON public.bug_reports;
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins have full access to feedback" ON public.feedback;

-- Hardened bug_reports policies: only the author or admins can view
CREATE POLICY "Users can view own bug reports"
  ON public.bug_reports FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id OR public.is_admin() );

CREATE POLICY "Authenticated users can submit bug reports"
  ON public.bug_reports FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Admins have full access to bug_reports"
  ON public.bug_reports FOR ALL
  TO authenticated
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- Hardened feedback policies: only author or admins can view
CREATE POLICY "Users can view own feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id OR public.is_admin() );

CREATE POLICY "Authenticated users can submit feedback"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Admins have full access to feedback"
  ON public.feedback FOR ALL
  TO authenticated
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- 5. TRUSTED ATTEMPTS & SCORE INTEGRITY
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Enforce attempt row ownership
DROP POLICY IF EXISTS "Users can read own attempts" ON public.game_attempts;
CREATE POLICY "Users can read own attempts"
  ON public.game_attempts FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id OR public.is_admin() );

-- Game sessions: Everyone can view for leaderboards, but direct client mutations are strictly forbidden
DROP POLICY IF EXISTS "Game sessions are viewable by everyone." ON public.game_sessions;
DROP POLICY IF EXISTS "Users can insert their own game sessions." ON public.game_sessions;
CREATE POLICY "Game sessions are viewable by everyone."
  ON public.game_sessions FOR SELECT
  USING ( true );

-- Revoke direct table manipulation from client sessions; writes MUST occur via trusted RPCs
REVOKE INSERT, UPDATE, DELETE ON public.game_attempts FROM authenticated, anon;
REVOKE INSERT, UPDATE, DELETE ON public.game_sessions FROM authenticated, anon;

-- Secure create_game_attempt RPC
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

  -- Rate limit: Maximum 25 in-progress attempts in 10 minutes to prevent database flooding
  IF (SELECT pg_catalog.count(*) FROM public.game_attempts WHERE user_id = v_user_id AND status = 'in_progress' AND started_at > (pg_catalog.now() - INTERVAL '10 minutes')) >= 25 THEN
    RAISE EXCEPTION 'Anti-Cheat: Too many pending game attempts. Please complete active games or wait.';
  END IF;

  -- Expire orphaned attempts older than 2 hours
  UPDATE public.game_attempts
  SET status = 'abandoned'
  WHERE user_id = v_user_id AND status = 'in_progress' AND started_at < (pg_catalog.now() - INTERVAL '2 hours');

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
    pg_catalog.greatest(1, p_level),
    p_puzzle_id,
    p_seed,
    pg_catalog.now(),
    'in_progress',
    p_metadata
  ) RETURNING id INTO v_attempt_id;

  RETURN pg_catalog.jsonb_build_object(
    'success', true,
    'attempt_id', v_attempt_id,
    'game_id', v_normalized_game,
    'level', pg_catalog.greatest(1, p_level),
    'started_at', pg_catalog.now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Secure complete_game_attempt RPC
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
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock attempt row exclusively to prevent race condition replay attacks
  SELECT * INTO v_attempt
  FROM public.game_attempts
  WHERE id = p_attempt_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt % not found', p_attempt_id;
  END IF;

  IF v_attempt.user_id != v_caller_id THEN
    RAISE EXCEPTION 'Security Violation: Attempt belongs to another user';
  END IF;

  IF v_attempt.status = 'completed' THEN
    RETURN pg_catalog.jsonb_build_object(
      'success', true,
      'already_completed', true,
      'score', v_attempt.score,
      'accuracy', v_attempt.accuracy,
      'time_spent', v_attempt.time_spent
    );
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_caller_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Account is suspended';
  END IF;

  -- Server-side time elapsed validation
  v_server_elapsed_seconds := pg_catalog.greatest(1, EXTRACT(EPOCH FROM (pg_catalog.now() - v_attempt.started_at))::integer);
  v_actual_time := pg_catalog.greatest(2, pg_catalog.coalesce(p_client_time_spent, v_server_elapsed_seconds));

  -- Minimum 2 seconds human completion anti-cheat guard
  IF v_actual_time < 2 OR v_server_elapsed_seconds < 2 THEN
    RAISE EXCEPTION 'Anti-Cheat: Completion time too low (%s)', v_actual_time;
  END IF;

  -- Score calculation bounded strictly 0-10
  IF v_attempt.game_id IN ('di', 'rc') THEN
    DECLARE
      v_correct_count NUMERIC;
      v_total_questions NUMERIC := 24;
    BEGIN
      v_correct_count := pg_catalog.least(v_total_questions, pg_catalog.greatest(0, (p_submission->>'correct_count')::numeric));
      IF v_correct_count IS NULL THEN
        v_calculated_score := pg_catalog.least(10.00, pg_catalog.greatest(0.00, (p_submission->>'score')::numeric));
      ELSE
        v_calculated_score := pg_catalog.round(((v_correct_count / v_total_questions) * 10.0), 2);
      END IF;
      v_calculated_acc := pg_catalog.round((v_calculated_score / 10.0) * 100);
    END;
  ELSIF v_attempt.game_id = 'grid' THEN
    DECLARE
      v_distraction_ok BOOLEAN;
      v_base_score NUMERIC;
    BEGIN
      v_distraction_ok := pg_catalog.coalesce(p_passed_distraction, (p_submission->>'passed_distraction')::boolean, true);
      v_base_score := pg_catalog.least(10, v_attempt.level);
      IF v_distraction_ok THEN
        v_calculated_score := v_base_score;
        v_calculated_acc := 100;
      ELSE
        v_calculated_score := pg_catalog.greatest(1.00, v_base_score - 3.00);
        v_calculated_acc := 70;
      END IF;
    END;
  ELSE
    DECLARE
      v_solved BOOLEAN;
    BEGIN
      v_solved := pg_catalog.coalesce((p_submission->>'solved')::boolean, (p_submission->>'status') = 'completed', true);
      IF v_solved THEN
        v_calculated_score := 10.00;
        v_calculated_acc := 100;
      ELSE
        v_calculated_score := 0.00;
        v_calculated_acc := 0;
      END IF;
    END;
  END IF;

  v_calculated_score := pg_catalog.least(10.00, pg_catalog.greatest(0.00, v_calculated_score));
  v_calculated_acc := pg_catalog.least(100, pg_catalog.greatest(0, v_calculated_acc));

  -- Mark attempt completed
  UPDATE public.game_attempts
  SET status = 'completed',
      completed_at = pg_catalog.now(),
      score = v_calculated_score,
      accuracy = v_calculated_acc,
      time_spent = v_actual_time
  WHERE id = p_attempt_id;

  -- Insert authoritative session row
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
    pg_catalog.coalesce(p_passed_distraction, true),
    pg_catalog.now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN pg_catalog.jsonb_build_object(
    'success', true,
    'already_completed', false,
    'attempt_id', p_attempt_id,
    'score', v_calculated_score,
    'accuracy', v_calculated_acc,
    'time_spent', v_actual_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- 6. GRANT AUTHORIZED RPC ACCESS
GRANT EXECUTE ON FUNCTION public.create_game_attempt(TEXT, INT, TEXT, BIGINT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_game_attempt(UUID, JSONB, INT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
