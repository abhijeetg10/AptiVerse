-- ====================================================================
-- APTIVERSE MASTER AUDIT REVISED SAFE ROLLBACK SCRIPT
-- Reverts trusted attempts RPCs while strictly preserving security boundaries.
-- Does NOT re-introduce privilege escalation, unblocking exploits, or recursion!
-- ====================================================================

-- 1. Drop attempt RPC functions
DROP FUNCTION IF EXISTS public.complete_game_attempt(UUID, JSONB, INT, BOOLEAN);
DROP FUNCTION IF EXISTS public.create_game_attempt(TEXT, INT, TEXT, BIGINT, JSONB);

-- 2. Drop game_attempts table (if safe)
DROP TABLE IF EXISTS public.game_attempts CASCADE;

-- 3. Restore direct game_sessions insert permissions for authenticated users
-- Protected by RLS check (auth.uid() = user_id)
GRANT INSERT ON public.game_sessions TO authenticated;
GRANT SELECT ON public.game_sessions TO authenticated, anon;

-- 4. PRESERVE PROFILE HARDENING (Do NOT revert to vulnerable open policies!)
-- Keep protect_profile_privileged_fields trigger active so users cannot grant themselves admin
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin() THEN
      NEW.role := 'user';
      NEW.is_blocked := false;
      NEW.warning_message := NULL;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF (OLD.role IS DISTINCT FROM NEW.role) OR
       (OLD.is_blocked IS DISTINCT FROM NEW.is_blocked) OR
       (OLD.warning_message IS DISTINCT FROM NEW.warning_message) THEN
      IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Security Violation: Unauthorized modification of privileged profile fields';
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Drop performance indexes added during audit
DROP INDEX IF EXISTS public.idx_game_attempts_user_status;
DROP INDEX IF EXISTS public.idx_game_sessions_user_game_level;
DROP INDEX IF EXISTS public.idx_game_sessions_created_at;
DROP INDEX IF EXISTS public.idx_profiles_college;
DROP INDEX IF EXISTS public.idx_profiles_updated_at;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
