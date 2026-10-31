-- ====================================================================
-- APTIVERSE REGISTERED USERS EMAIL RECOVERY & TRIGGER UPGRADE MIGRATION
-- Run this in Supabase Dashboard -> SQL Editor (postgres/admin role)
-- ====================================================================

-- 1. BACKFILL ALL EXISTING REGISTERED USER EMAILS FROM auth.users INTO public.profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '' OR p.email != u.email);

-- 2. UPGRADE SIGNUP TRIGGER TO PERMANENTLY KEEP EMAILS IN SYNC ON CONFLICT
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
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(public.profiles.name, EXCLUDED.name);
  
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

-- 3. CALLABLE ADMIN RPC TO RETRIEVE GUARANTEED USER EMAILS DIRECTLY JOINED WITH auth.users
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  college TEXT,
  department TEXT,
  role TEXT,
  is_blocked BOOLEAN,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    COALESCE(p.email, u.email, '-') AS email,
    p.college,
    p.department,
    p.role,
    p.is_blocked,
    p.avatar_url,
    p.updated_at,
    u.created_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  ORDER BY p.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- 4. ONE-CLICK ADMIN EMAIL SYNC RPC
CREATE OR REPLACE FUNCTION public.sync_all_profile_emails()
RETURNS INTEGER AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Admin privileges required';
  END IF;

  UPDATE public.profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.id = u.id AND (p.email IS NULL OR p.email = '' OR p.email != u.email);

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';
