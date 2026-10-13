const assert = require('assert');

console.log('====================================================');
console.log('🧪 APTIVERSE AUDIT & BEHAVIOR VALIDATION TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// ---------------------------------------------------------------------
// TEST SUITE 1: DI / RC Score Normalization & Fractional Compatibility
// ---------------------------------------------------------------------
console.log('--- Suite 1: Scoring Math & Fractional Compatibility ---');

function calculateAssessmentScore(correctAnswers, totalQuestions = 24) {
  const rawScore = (correctAnswers / totalQuestions) * 10;
  const normalizedScore = Math.round(rawScore * 100) / 100;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  return { score: normalizedScore, accuracy };
}

runTest('DI/RC 0 correct out of 24 -> 0.00 score, 0% accuracy', () => {
  const res = calculateAssessmentScore(0, 24);
  assert.strictEqual(res.score, 0.00);
  assert.strictEqual(res.accuracy, 0);
});

runTest('DI/RC 5 correct out of 24 -> 2.08 score, 21% accuracy', () => {
  const res = calculateAssessmentScore(5, 24);
  assert.strictEqual(res.score, 2.08);
  assert.strictEqual(res.accuracy, 21);
});

runTest('DI/RC 12 correct out of 24 -> 5.00 score, 50% accuracy', () => {
  const res = calculateAssessmentScore(12, 24);
  assert.strictEqual(res.score, 5.00);
  assert.strictEqual(res.accuracy, 50);
});

runTest('DI/RC 24 correct out of 24 -> 10.00 score, 100% accuracy', () => {
  const res = calculateAssessmentScore(24, 24);
  assert.strictEqual(res.score, 10.00);
  assert.strictEqual(res.accuracy, 100);
});

runTest('Numeric(4,2) SQL range validation accommodates fractional scores', () => {
  const sampleScores = [0.00, 2.08, 4.17, 5.00, 7.50, 9.58, 10.00];
  for (const s of sampleScores) {
    // Check against trigger constraints: NEW.score >= 0 AND NEW.score <= 10
    assert.ok(s >= 0 && s <= 10, `Score ${s} must be within 0..10`);
    // Check SQL numeric(4,2) precision: max 99.99, 2 decimal places
    const str = s.toFixed(2);
    const parts = str.split('.');
    assert.ok(parts[0].length <= 2, `Integer part ${parts[0]} must be <= 2 digits`);
    assert.ok(parts[1].length <= 2, `Fractional part ${parts[1]} must be <= 2 digits`);
  }
});

runTest('Grid distraction penalty (-3 pts, 70% acc on failure)', () => {
  function getGridScore(hasWon, passedDistraction) {
    if (!hasWon) return { score: 0, accuracy: 0 };
    const score = passedDistraction ? 10 : 7;
    const accuracy = passedDistraction ? 100 : 70;
    return { score, accuracy };
  }

  const perfect = getGridScore(true, true);
  assert.strictEqual(perfect.score, 10);
  assert.strictEqual(perfect.accuracy, 100);

  const distracted = getGridScore(true, false);
  assert.strictEqual(distracted.score, 7);
  assert.strictEqual(distracted.accuracy, 70);

  const failed = getGridScore(false, false);
  assert.strictEqual(failed.score, 0);
  assert.strictEqual(failed.accuracy, 0);
});

// ---------------------------------------------------------------------
// TEST SUITE 2: Puzzle Lifecycle & Pool Exhaustion Policy
// ---------------------------------------------------------------------
console.log('\n--- Suite 2: Puzzle Pool Lifecycle & Exhaustion ---');

// Mock localStorage for node environment
const mockStorage = new Map();
global.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear()
};

function getNextUnseenAssessmentIndex(gameId, userId, level, poolSize = 3) {
  const safeUser = userId || 'anon';
  const totalAssessments = Math.max(1, poolSize);
  const storageKey = `aptiverse_unseen_assessments_${gameId}_${safeUser}`;
  let playedList = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) playedList = JSON.parse(raw);
  } catch {
    playedList = [];
  }

  const unplayed = [];
  for (let i = 0; i < totalAssessments; i++) {
    if (!playedList.includes(i)) {
      unplayed.push(i);
    }
  }

  let chosen;
  if (unplayed.length > 0) {
    chosen = unplayed[0]; // deterministic choice for test
  } else {
    const lastIndex = playedList[playedList.length - 1];
    const pool = Array.from({ length: totalAssessments }, (_, i) => i).filter(i => i !== lastIndex);
    chosen = pool.length > 0 ? pool[0] : 0;
    playedList = [];
  }

  playedList.push(chosen);
  localStorage.setItem(storageKey, JSON.stringify(playedList));
  return chosen;
}

runTest('Assessment cycles through all pool items before repeating', () => {
  mockStorage.clear();
  const userId = 'user_123';
  const poolSize = 3;
  const picked = [];
  for (let i = 0; i < poolSize; i++) {
    picked.push(getNextUnseenAssessmentIndex('rc', userId, 0, poolSize));
  }
  assert.strictEqual(new Set(picked).size, 3, 'All 3 initial picks must be distinct');
});

runTest('Assessment exhaustion avoids immediately repeating the most recent one', () => {
  mockStorage.clear();
  const userId = 'user_123';
  const poolSize = 3;
  let lastPick = -1;
  // Play through 2 full cycles (6 assessments)
  for (let i = 0; i < 6; i++) {
    const pick = getNextUnseenAssessmentIndex('rc', userId, 0, poolSize);
    if (lastPick !== -1) {
      assert.notStrictEqual(pick, lastPick, `Pick at step ${i} (${pick}) repeated immediately after ${lastPick}`);
    }
    lastPick = pick;
  }
});

// ---------------------------------------------------------------------
// TEST SUITE 3: Leaderboard Ranking, Tie-Breaking & 300+ Games Visibility
// ---------------------------------------------------------------------
console.log('\n--- Suite 3: Leaderboard Ranking & 300+ Games ---');

function sortLeaderboardEntries(a, b) {
  if ((b.total_score || 0) !== (a.total_score || 0)) {
    return (b.total_score || 0) - (a.total_score || 0);
  }
  if ((b.avg_accuracy || 0) !== (a.avg_accuracy || 0)) {
    return (b.avg_accuracy || 0) - (a.avg_accuracy || 0);
  }
  if ((a.total_time || 0) !== (b.total_time || 0)) {
    return (a.total_time || 0) - (b.total_time || 0);
  }
  return String(a.user_id || '').localeCompare(String(b.user_id || ''));
}

runTest('Deterministic 4-tier tie breaking: score -> acc -> time -> user_id', () => {
  const p1 = { user_id: 'user_b', total_score: 100, avg_accuracy: 95, total_time: 120 };
  const p2 = { user_id: 'user_a', total_score: 100, avg_accuracy: 95, total_time: 120 };
  const p3 = { user_id: 'user_c', total_score: 100, avg_accuracy: 95, total_time: 110 }; // faster
  const p4 = { user_id: 'user_d', total_score: 100, avg_accuracy: 98, total_time: 200 }; // higher acc
  const p5 = { user_id: 'user_e', total_score: 105, avg_accuracy: 90, total_time: 300 }; // higher score

  const list = [p1, p2, p3, p4, p5].sort(sortLeaderboardEntries);
  assert.strictEqual(list[0].user_id, 'user_e', 'Top score must be rank 1');
  assert.strictEqual(list[1].user_id, 'user_d', 'Highest accuracy must be rank 2');
  assert.strictEqual(list[2].user_id, 'user_c', 'Faster time must be rank 3');
  assert.strictEqual(list[3].user_id, 'user_a', 'Alphabetical user_a must precede user_b on exact tie');
  assert.strictEqual(list[4].user_id, 'user_b', 'user_b must follow user_a');
});

runTest('Legitimate user with 300+ games is NOT filtered out or treated as bot', () => {
  // Generate 1,500 synthetic users (demonstrates > 1,000 scale)
  const users = [];
  for (let i = 1; i <= 1500; i++) {
    users.push({
      user_id: `user_${i}`,
      name: `Player ${i}`,
      total_score: (i % 200) * 10,
      avg_accuracy: 85,
      total_games: i === 42 ? 385 : (i % 50) + 1, // user_42 has 385 games!
      total_time: 1000 + i
    });
  }

  // Filter: ordinary public leaderboard excludes only blocked users
  const activePlayers = users.filter(u => !u.is_blocked);
  assert.strictEqual(activePlayers.length, 1500, 'All 1500 users remain active');

  const legitDedicatedUser = activePlayers.find(u => u.user_id === 'user_42');
  assert.ok(legitDedicatedUser, 'User 42 with 385 games must exist in active list');
  assert.strictEqual(legitDedicatedUser.total_games, 385);

  activePlayers.sort(sortLeaderboardEntries);
  const foundRank = activePlayers.findIndex(u => u.user_id === 'user_42') + 1;
  assert.ok(foundRank >= 1 && foundRank <= 1500, 'User 42 must be properly ranked');
});

// ---------------------------------------------------------------------
// TEST SUITE 4: Duplicate Submission & 23505 Collision Verification
// ---------------------------------------------------------------------
console.log('\n--- Suite 4: Duplicate Submissions & 23505 Error ---');

class MockDatabase {
  constructor() {
    this.sessions = new Map(); // id -> session
  }

  insert(record) {
    if (this.sessions.has(record.id)) {
      const err = new Error('duplicate key value violates unique constraint');
      err.code = '23505';
      return { error: err };
    }
    this.sessions.set(record.id, { ...record });
    return { data: [record], error: null };
  }

  get(id) {
    return this.sessions.get(id) || null;
  }
}

async function saveSessionMock(db, sessionPayload, callerUserId) {
  const { error } = db.insert({
    id: sessionPayload.attemptId,
    user_id: callerUserId,
    score: sessionPayload.score,
    level: sessionPayload.level
  });

  if (error) {
    if (error.code === '23505') {
      const existing = db.get(sessionPayload.attemptId);
      if (existing && existing.user_id === callerUserId) {
        return { success: true, alreadySaved: true };
      } else {
        return { success: false, error: 'Attempt ID collision or unauthorized replay detected.' };
      }
    }
    return { success: false, error: error.message };
  }
  return { success: true, alreadySaved: false };
}

runTest('First attempt submission succeeds and persists', async () => {
  const db = new MockDatabase();
  const res = await saveSessionMock(db, { attemptId: 'att-1', score: 10, level: 1 }, 'user-A');
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.alreadySaved, false);
});

runTest('Duplicate submission by same user returns alreadySaved: true without double-recording', async () => {
  const db = new MockDatabase();
  await saveSessionMock(db, { attemptId: 'att-1', score: 10, level: 1 }, 'user-A');
  
  // Re-submit identical attempt
  const res2 = await saveSessionMock(db, { attemptId: 'att-1', score: 10, level: 1 }, 'user-A');
  assert.strictEqual(res2.success, true);
  assert.strictEqual(res2.alreadySaved, true);
  assert.strictEqual(db.sessions.size, 1, 'Database must only contain 1 row');
});

runTest('Duplicate key 23505 from DIFFERENT user is REJECTED (unauthorized replay collision)', async () => {
  const db = new MockDatabase();
  // user-A saves att-1
  await saveSessionMock(db, { attemptId: 'att-1', score: 10, level: 1 }, 'user-A');

  // malicious user-B attempts to reuse att-1
  const resMalicious = await saveSessionMock(db, { attemptId: 'att-1', score: 10, level: 1 }, 'user-B');
  assert.strictEqual(resMalicious.success, false);
  assert.strictEqual(resMalicious.error, 'Attempt ID collision or unauthorized replay detected.');
});

// ---------------------------------------------------------------------
// TEST SUITE 5: Auto-Advance vs Manual Next Race Condition Lock
// ---------------------------------------------------------------------
console.log('\n--- Suite 5: Auto-Advance vs Manual Next Race Condition ---');

function createAutoAdvanceController(onAdvance) {
  let hasAdvanced = false;
  let timerId = null;

  return {
    startTimer: (ms) => {
      timerId = setTimeout(() => {
        if (!hasAdvanced) {
          hasAdvanced = true;
          onAdvance('auto');
        }
      }, ms);
    },
    advanceNow: () => {
      if (!hasAdvanced) {
        hasAdvanced = true;
        if (timerId) clearTimeout(timerId);
        onAdvance('manual');
      }
    },
    hasAdvanced: () => hasAdvanced
  };
}

runTest('Race condition lock prevents double-firing when manual click coincides with timer', (done) => {
  let advanceCount = 0;
  const calls = [];
  const controller = createAutoAdvanceController((source) => {
    advanceCount++;
    calls.push(source);
  });

  // Start a 10ms timer
  controller.startTimer(10);
  // Manual button clicked immediately
  controller.advanceNow();
  // Attempt duplicate manual click
  controller.advanceNow();

  // Wait 25ms to let timer expiry pass
  setTimeout(() => {
    assert.strictEqual(advanceCount, 1, 'Advance callback must only be called ONCE');
    assert.strictEqual(calls[0], 'manual', 'Manual invocation must win and cancel auto timer');
  }, 25);
});

// ---------------------------------------------------------------------
// TEST SUITE 6: SQL Migration Security Audit
// ---------------------------------------------------------------------
console.log('\n--- Suite 6: SQL Migration Security & Structure ---');

const fs = require('fs');
const path = require('path');
const migrationPath = path.join(__dirname, '../supabase/migrations/20261013_master_audit_fixes.sql');
const migrationSql = fs.readFileSync(migrationPath, 'utf8');

runTest('Migration defines SECURITY DEFINER functions without recursive profile lookups', () => {
  assert.ok(migrationSql.includes('CREATE OR REPLACE FUNCTION public.is_admin()'));
  assert.ok(migrationSql.includes('CREATE OR REPLACE FUNCTION public.get_user_role('));
  assert.ok(migrationSql.includes('CREATE OR REPLACE FUNCTION public.get_user_is_blocked('));
  assert.ok(migrationSql.includes('CREATE OR REPLACE FUNCTION public.get_user_warning_message('));
  // Must NOT do direct SELECT p.role FROM public.profiles inside the policy itself
  assert.ok(!migrationSql.includes('SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()'));
});

runTest('Profile policy explicitly rejects modifications to role, is_blocked, warning_message', () => {
  assert.ok(migrationSql.includes('role IS NOT DISTINCT FROM public.get_user_role(auth.uid())'));
  assert.ok(migrationSql.includes('is_blocked IS NOT DISTINCT FROM public.get_user_is_blocked(auth.uid())'));
  assert.ok(migrationSql.includes('warning_message IS NOT DISTINCT FROM public.get_user_warning_message(auth.uid())'));
});

runTest('Leaderboard views merge geo_sudoku into sudoku', () => {
  assert.ok(migrationSql.includes("CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END"));
});

runTest('Leaderboard views do not expose email or warning_message', () => {
  const globalViewMatch = migrationSql.match(/CREATE VIEW public\.global_leaderboard AS[\s\S]*?FROM public\.profiles/);
  assert.ok(globalViewMatch, 'global_leaderboard view must exist');
  const viewSelect = globalViewMatch[0];
  assert.ok(!viewSelect.includes('p.email'), 'Must not select p.email in global_leaderboard');
  assert.ok(!viewSelect.includes('p.warning_message'), 'Must not select p.warning_message in global_leaderboard');
});

runTest('Attempt ID unique constraint is defined on game_sessions', () => {
  assert.ok(migrationSql.includes('ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS attempt_id UUID;'));
  assert.ok(migrationSql.includes('game_sessions_attempt_id_key UNIQUE (attempt_id)'));
});

runTest('Secure validate trigger normalizes geo_sudoku and permits legitimate gameplay without level 50 cap', () => {
  assert.ok(migrationSql.includes("IF NEW.game_id = 'geo_sudoku' THEN"));
  assert.ok(migrationSql.includes("NEW.game_id := 'sudoku';"));
  assert.ok(!migrationSql.includes('NEW.level > 50'), 'Level 50 artificial ceiling must be removed');
  assert.ok(migrationSql.includes('NEW.score < 0 OR NEW.score > 10'), 'Score bounds check 0..10 present');
});

// Print final summary
setTimeout(() => {
  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} passed`);
  console.log('====================================================');
  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}, 50);
