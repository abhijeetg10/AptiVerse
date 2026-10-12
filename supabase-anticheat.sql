-- ====================================================================
-- APTIVERSE ANTI-CHEAT & DATABASE SECURITY SUITE
-- Run this in Supabase Dashboard -> SQL Editor to:
-- 1. Wipe all bot/scripted accounts to 0 points immediately.
-- 2. Issue probation warning on all their profiles.
-- 3. Install strict anti-cheat rate limiting so no one can inject fake data again.
-- ====================================================================

-- STEP 1: Add columns to profiles if not already added
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS warning_message TEXT;

-- STEP 2: Flag and wipe all suspected bot accounts (>= 300 games or Level > 50)
-- A. Set warning message on their profiles
UPDATE profiles
SET warning_message = '⚠️ ACCOUNT FLAGGED FOR FAIR PLAY VIOLATIONS: All artificial scores have been wiped to 0 due to detected automated bot scripting. Any further automation or unauthorized data injection will result in an immediate, permanent ban.'
WHERE id IN (
  SELECT user_id 
  FROM game_sessions 
  GROUP BY user_id 
  HAVING count(*) >= 300 OR max(level) > 50
);

-- B. Delete all game sessions for these bot accounts (resets total score to 0)
DELETE FROM game_sessions 
WHERE user_id IN (
  SELECT user_id 
  FROM game_sessions 
  GROUP BY user_id 
  HAVING count(*) >= 300 OR max(level) > 50
);

-- Delete any remaining rogue sessions with impossible levels
DELETE FROM game_sessions WHERE level > 50;

-- STEP 3: BULLETPROOF ANTI-CHEAT SECURITY TRIGGER
-- This executes inside PostgreSQL on EVERY insert, making it impossible
-- to inject fake data even via browser console (F12), curl, or scripts.

CREATE OR REPLACE FUNCTION secure_validate_game_session()
RETURNS TRIGGER AS $$
DECLARE
  v_last_session_time TIMESTAMP WITH TIME ZONE;
  v_recent_count INT;
BEGIN
  -- 1. Authentication check: Caller must be authenticated
  IF auth.uid() IS NULL OR auth.uid() != NEW.user_id THEN
    RAISE EXCEPTION 'Security Violation: Unauthorized session submission';
  END IF;

  -- 2. Blocked status check: Suspended users cannot submit games
  IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.user_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Security Violation: Account is suspended';
  END IF;

  -- 3. Whitelisted Game ID check
  IF NEW.game_id NOT IN ('motion', 'sudoku', 'geo_sudoku', 'grid', 'switch', 'inductive', 'di', 'rc') THEN
    RAISE EXCEPTION 'Security Violation: Unknown game identifier';
  END IF;

  -- 4. Level boundaries: Max level is 50
  IF NEW.level < 1 OR NEW.level > 50 THEN
    RAISE EXCEPTION 'Security Violation: Level % is out of bounds', NEW.level;
  END IF;

  -- 5. Score & Accuracy boundaries
  IF NEW.score < 0 OR NEW.score > 10 THEN
    RAISE EXCEPTION 'Security Violation: Score must be between 0 and 10';
  END IF;
  IF NEW.accuracy < 0 OR NEW.accuracy > 100 THEN
    RAISE EXCEPTION 'Security Violation: Accuracy must be between 0 and 100';
  END IF;

  -- 6. Human Speed Barrier: A human cannot legitimately finish a level in under 3 seconds
  IF NEW.time_spent < 3 THEN
    RAISE EXCEPTION 'Anti-Cheat: Impossible completion time detected';
  END IF;

  -- 7. Rate Limit Defense: Minimum 4 seconds between consecutive submissions
  SELECT created_at INTO v_last_session_time
  FROM game_sessions
  WHERE user_id = NEW.user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_last_session_time IS NOT NULL AND (NOW() - v_last_session_time) < INTERVAL '4 seconds' THEN
    RAISE EXCEPTION 'Anti-Cheat: Submissions too fast. Please play normally.';
  END IF;

  -- 8. Hourly Flood Cap: Maximum 60 sessions per user per hour
  SELECT count(*) INTO v_recent_count
  FROM game_sessions
  WHERE user_id = NEW.user_id
    AND created_at > (NOW() - INTERVAL '1 hour');

  IF v_recent_count >= 60 THEN
    RAISE EXCEPTION 'Anti-Cheat: Hourly game quota reached. Please take a break.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to game_sessions table
DROP TRIGGER IF EXISTS trg_secure_game_session ON game_sessions;
CREATE TRIGGER trg_secure_game_session
BEFORE INSERT ON game_sessions
FOR EACH ROW
EXECUTE FUNCTION secure_validate_game_session();

-- STEP 4: RESET FAKE / ABBREVIATED COLLEGE NAMES AND REQUIRE RE-SELECTION
-- Resets fake colleges ('CIT', 'tki', 'aps', 'j', 'San', 'abc', etc.) and clears invalid departments
-- so students are required to select their verified college & department from the dropdown before playing.
UPDATE profiles
SET college = NULL, department = NULL
WHERE college IS NULL
   OR LENGTH(TRIM(college)) < 5
   OR LOWER(TRIM(college)) IN (
     'abc', 'xyz', 'test', 'demo', 'fake', 'none', 'na', 'n/a', 'asdf', 'qwerty',
     '...', '---', 'other', 'unknown', 'invalid', 'dummy', 'null', 'nil', 'college',
     'cit', 'tki', 'aps', 'vsb', 'iitk', 'ycce', 'gla', 'iem', 'uem', 'siom', 'sfax', 'j', 'san'
   )
   OR department IS NULL;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';

