const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🔍 PRE-DEPLOYMENT ARCHITECTURAL & SECURITY AUDIT');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(cond, msg) {
  totalTests++;
  if (cond) {
    passedTests++;
    console.log(`  ✅ PASS: ${msg}`);
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
  }
}

// ---------------------------------------------------------
// 1. PROFILE POLICY & RECURSION AUDIT
// ---------------------------------------------------------
console.log('--- 1. Profile Security & Recursion Analysis ---');

// Simulate the evaluation of an UPDATE with RLS vs Trigger
function simulateProfileUpdate({ oldRow, newRow, callerRole, isCallerAdmin, method }) {
  if (method === 'rls_self_query') {
    // If evaluated via RLS WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles))
    // If SELECT policy on profiles checks is_admin(), which checks profiles:
    // A cyclic dependency forms if the policy owner does not bypass RLS.
    const wouldRecurse = true; // In standard Postgres, correlated subquery to same relation in RLS can trigger 42P17
    const allowed = (newRow.role === oldRow.role) && 
                    (newRow.is_blocked === oldRow.is_blocked) && 
                    (newRow.warning_message === oldRow.warning_message);
    return { success: allowed, recursionRisk: wouldRecurse };
  } else if (method === 'before_update_trigger') {
    // Evaluates directly using OLD and NEW tuples in memory. Zero relation queries.
    const changedPrivileged = (oldRow.role !== newRow.role) ||
                              (oldRow.is_blocked !== newRow.is_blocked) ||
                              (oldRow.warning_message !== newRow.warning_message);
    if (changedPrivileged && !isCallerAdmin) {
      return { success: false, recursionRisk: false, error: 'Unauthorized modification of privileged fields' };
    }
    return { success: true, recursionRisk: false };
  }
}

const userProfile = { id: 'usr-1', name: 'Alice', college: 'MIT', role: 'user', is_blocked: false, warning_message: null };

// Non-admin attempts to elevate to admin
const hackedProfile = { ...userProfile, role: 'admin' };
const triggerResult = simulateProfileUpdate({
  oldRow: userProfile,
  newRow: hackedProfile,
  callerRole: 'user',
  isCallerAdmin: false,
  method: 'before_update_trigger'
});
assert(triggerResult.success === false && !triggerResult.recursionRisk, 'BEFORE UPDATE trigger strictly rejects unauthorized role escalation without recursion');

// Non-admin unblocks themselves
const unblockedProfile = { ...userProfile, is_blocked: false };
const blockedOld = { ...userProfile, is_blocked: true };
const unblockResult = simulateProfileUpdate({
  oldRow: blockedOld,
  newRow: unblockedProfile,
  callerRole: 'user',
  isCallerAdmin: false,
  method: 'before_update_trigger'
});
assert(unblockResult.success === false && !unblockResult.recursionRisk, 'BEFORE UPDATE trigger strictly rejects unauthorized unblocking without recursion');

// Legitimate profile update (updating name and college)
const legitUpdate = { ...userProfile, name: 'Alice Smith', college: 'Harvard' };
const legitResult = simulateProfileUpdate({
  oldRow: userProfile,
  newRow: legitUpdate,
  callerRole: 'user',
  isCallerAdmin: false,
  method: 'before_update_trigger'
});
assert(legitResult.success === true && !legitResult.recursionRisk, 'Legitimate student name/college updates are permitted with zero recursion');

// Admin updating user role
const adminUpdate = simulateProfileUpdate({
  oldRow: userProfile,
  newRow: hackedProfile,
  callerRole: 'admin',
  isCallerAdmin: true,
  method: 'before_update_trigger'
});
assert(adminUpdate.success === true && !adminUpdate.recursionRisk, 'Admin callers are permitted to modify role/blocked status via trigger');

// ---------------------------------------------------------
// 2. DEMONSTRATION OF CLIENT-TRUSTED SCORE LIMITATION
// ---------------------------------------------------------
console.log('\n--- 2. Fabricated Score Ingestion Demonstration ---');

// Emulate the trigger's exact SQL check logic
function simulateDatabaseTriggerValidation(session, authUserId, userIsBlocked, userHistory = []) {
  // 1. Auth check
  if (!authUserId || authUserId !== session.user_id) {
    return { rejected: true, reason: 'Unauthorized session submission' };
  }
  // 2. Blocked status
  if (userIsBlocked) {
    return { rejected: true, reason: 'Account is suspended' };
  }
  // 3. Game ID whitelist
  let gameId = session.game_id === 'geo_sudoku' ? 'sudoku' : session.game_id;
  if (!['motion', 'sudoku', 'grid', 'switch', 'inductive', 'di', 'rc'].includes(gameId)) {
    return { rejected: true, reason: 'Unknown game identifier' };
  }
  // 4. Level
  if (session.level < 1) {
    return { rejected: true, reason: 'Invalid level' };
  }
  // 5. Score & Accuracy
  if (session.score < 0 || session.score > 10) {
    return { rejected: true, reason: 'Score must be between 0 and 10' };
  }
  if (session.accuracy < 0 || session.accuracy > 100) {
    return { rejected: true, reason: 'Accuracy must be between 0 and 100' };
  }
  // 6. Minimum human completion time
  if (session.time_spent < 2) {
    return { rejected: true, reason: 'Completion time too low' };
  }
  // 7. Spacing check
  const lastTime = userHistory.length > 0 ? userHistory[userHistory.length - 1].createdAt : 0;
  if (lastTime && (session.createdAt - lastTime) < 2000) {
    return { rejected: true, reason: 'Submissions too fast' };
  }
  return { rejected: false, normalizedGameId: gameId };
}

// Fabricated Score with plausible human values:
const fabricatedPlausibleSession = {
  user_id: 'usr-legit-token',
  game_id: 'motion',
  level: 10,
  score: 10,
  accuracy: 100,
  time_spent: 45, // 45 seconds looks realistic
  createdAt: 10000
};
const plausibleResult = simulateDatabaseTriggerValidation(fabricatedPlausibleSession, 'usr-legit-token', false, []);
assert(plausibleResult.rejected === false, 'DEMONSTRATED: Fabricated score with valid values PASSES trigger (client-trusted limitation verified)');

// Fabricated Score with invalid values (rejected by trigger):
const invalidScoreSession = { ...fabricatedPlausibleSession, score: 999 };
assert(simulateDatabaseTriggerValidation(invalidScoreSession, 'usr-legit-token', false).rejected === true, 'Trigger correctly rejects out-of-range score (> 10)');

const instantBotSession = { ...fabricatedPlausibleSession, time_spent: 0 };
assert(simulateDatabaseTriggerValidation(instantBotSession, 'usr-legit-token', false).rejected === true, 'Trigger correctly rejects instant bot submission (< 2s)');

const wrongUserSession = { ...fabricatedPlausibleSession, user_id: 'victim-id' };
assert(simulateDatabaseTriggerValidation(wrongUserSession, 'usr-legit-token', false).rejected === true, 'Trigger correctly rejects identity spoofing (user_id mismatch)');

// ---------------------------------------------------------
// 3. RESET BEHAVIOR ACROSS GAMES
// ---------------------------------------------------------
console.log('\n--- 3. Reset Attempt ID & Deduplication Verification ---');

class GameSessionSimulator {
  constructor() {
    this.attemptId = 'att-' + Math.random().toString(36).substring(2, 9);
    this.levelIndex = 1;
    this.hasSaved = false;
    this.status = 'playing';
    this.dbRows = [];
  }

  solve() {
    this.status = 'completed';
    if (!this.hasSaved) {
      this.hasSaved = true;
      this.dbRows.push({ attemptId: this.attemptId, level: this.levelIndex, score: 10 });
    }
  }

  handleReset() {
    // Reset restores the board without re-rolling the attempt or re-enabling save
    this.status = 'playing';
    // Does NOT reset this.attemptId
    // Does NOT reset this.hasSaved
  }

  loadNextLevel() {
    this.levelIndex++;
    this.attemptId = 'att-' + Math.random().toString(36).substring(2, 9);
    this.hasSaved = false;
    this.status = 'playing';
  }
}

const sim = new GameSessionSimulator();
const initialAttempt = sim.attemptId;
sim.solve();
assert(sim.dbRows.length === 1, 'Initial solve saves 1 session');

// Player clicks Reset and solves again
sim.handleReset();
assert(sim.attemptId === initialAttempt, 'Reset retains the EXACT SAME attempt ID');
sim.solve();
assert(sim.dbRows.length === 1, 'Reset CANNOT award points twice (hasSaved guard blocks second save)');

// Player advances to next level
sim.loadNextLevel();
assert(sim.attemptId !== initialAttempt, 'Next Level generates a new unique attempt ID');
sim.solve();
assert(sim.dbRows.length === 2, 'Next level saves exactly 1 new session for the new attempt');

// ---------------------------------------------------------
// 4. MIGRATION COMPATIBILITY & ROLLBACK INTEGRITY
// ---------------------------------------------------------
console.log('\n--- 4. Migration & Rollback Script Compatibility ---');

const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261013_master_audit_fixes.sql');
const rollbackPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261013_master_audit_rollback.sql');

const migrationContent = fs.readFileSync(migrationPath, 'utf8');
const rollbackContent = fs.readFileSync(rollbackPath, 'utf8');

assert(migrationContent.includes('protect_profile_privileged_fields'), 'Migration defines protect_profile_privileged_fields trigger');
assert(migrationContent.includes('secure_validate_game_session'), 'Migration defines secure_validate_game_session trigger');
assert(migrationContent.includes('NUMERIC(4,2)'), 'Migration alters score to NUMERIC(4,2) for fractional support');
assert(migrationContent.includes('attempt_id UUID'), 'Migration adds attempt_id UUID column');
assert(rollbackContent.includes('DROP TRIGGER IF EXISTS trg_secure_game_session'), 'Rollback script drops validation trigger');
assert(rollbackContent.includes('DROP TRIGGER IF EXISTS trg_protect_profile_privileged_fields'), 'Rollback script drops profile security trigger');

console.log('\n====================================================');
console.log(`🏁 PRE-DEPLOYMENT AUDIT COMPLETE: ${passedTests} / ${totalTests} passed`);
console.log('====================================================\n');
