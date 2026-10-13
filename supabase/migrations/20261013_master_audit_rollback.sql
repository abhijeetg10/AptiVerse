-- ====================================================================
-- APTIVERSE MASTER AUDIT FIXES ROLLBACK SCRIPT
-- Execute in Supabase SQL Editor if you need to revert the audit migration
-- ====================================================================

-- 1. Drop validation and security triggers
DROP TRIGGER IF EXISTS trg_secure_game_session ON public.game_sessions;
DROP FUNCTION IF EXISTS public.secure_validate_game_session();

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_fields ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_profile_privileged_fields();

-- 2. Drop helper functions
DROP FUNCTION IF EXISTS public.get_user_warning_message(UUID);
DROP FUNCTION IF EXISTS public.get_user_is_blocked(UUID);
DROP FUNCTION IF EXISTS public.get_user_role(UUID);
DROP FUNCTION IF EXISTS public.is_admin();

-- 3. Drop performance indexes added by audit
DROP INDEX IF EXISTS public.idx_game_sessions_user_game_level;
DROP INDEX IF EXISTS public.idx_game_sessions_created_at;
DROP INDEX IF EXISTS public.idx_profiles_college;
DROP INDEX IF EXISTS public.idx_profiles_updated_at;

-- 4. Remove unique constraint on attempt_id (leaving column intact to prevent data loss)
ALTER TABLE public.game_sessions DROP CONSTRAINT IF EXISTS game_sessions_attempt_id_key;

-- 5. Restore default permissive RLS policies on profiles
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- Notify PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';
