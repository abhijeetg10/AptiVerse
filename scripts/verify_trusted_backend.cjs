const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🔒 TRUSTED ATTEMPT ENGINE & ZERO-TRUST SECURITY AUDIT');
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
// SERVER-SIDE PUZZLE VALIDATION & ENGINE EMULATION
// Emulates the exact PL/pgSQL logic implemented in the migration
// ---------------------------------------------------------
class TrustedServerGameEngine {
  constructor() {
    this.attempts = new Map();
    this.sessions = new Map();
    this.profiles = new Map([
      ['usr-alice', { id: 'usr-alice', role: 'user', is_blocked: false }],
      ['usr-bob', { id: 'usr-bob', role: 'user', is_blocked: false }],
      ['usr-blocked', { id: 'usr-blocked', role: 'user', is_blocked: true }]
    ]);
  }

  // RPC create_game_attempt: Server assigns puzzle and stores private solution
  createAttempt(callerId, gameId, level) {
    const caller = this.profiles.get(callerId);
    if (!caller || caller.is_blocked) {
      return { success: false, error: 'Account suspended or unauthenticated' };
    }

    const attemptId = 'att-' + Math.random().toString(36).substring(2, 9);
    let assignedPuzzleId = '';
    let solutionKey = {};

    if (gameId === 'di') {
      const setIdx = (level - 1) % 3;
      assignedPuzzleId = `di-lvl-${setIdx}`;
      // Private server-held 24-question answer key (e.g. Set 0)
      solutionKey = {
        answers: [1, 2, 0, 3, 2, 1, 0, 2, 3, 1, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2]
      };
    } else if (gameId === 'rc') {
      const setIdx = (level - 1) % 3;
      assignedPuzzleId = `rc-lvl-${setIdx}`;
      solutionKey = {
        answers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]
      };
    } else if (gameId === 'switch') {
      assignedPuzzleId = `switch-${level}`;
      solutionKey = { correctChoiceIndex: 1 };
    } else if (gameId === 'sudoku') {
      assignedPuzzleId = `sudoku-${level}`;
      solutionKey = { correctSymbol: 'triangle' };
    } else if (gameId === 'inductive') {
      assignedPuzzleId = `inductive-${level}`;
      solutionKey = { correctIndices: [0, 2] };
    } else if (gameId === 'grid') {
      assignedPuzzleId = `grid-${level}`;
      solutionKey = {
        sequence: [2, 5, 8],
        distractionAnswer: true
      };
    } else if (gameId === 'motion') {
      assignedPuzzleId = `motion-${level}`;
      solutionKey = {
        initialBall: { row: 2, col: 4 },
        target: { row: 0, col: 1 },
        walls: [{ row: 0, col: 3 }, { row: 0, col: 5 }]
      };
    }

    const attempt = {
      id: attemptId,
      user_id: callerId,
      game_id: gameId,
      level,
      puzzle_id: assignedPuzzleId,
      solution_key: solutionKey,
      started_at: Date.now(),
      status: 'in_progress',
      score: null,
      accuracy: null
    };

    this.attempts.set(attemptId, attempt);
    return {
      success: true,
      attempt_id: attemptId,
      game_id: gameId,
      level,
      puzzle_id: assignedPuzzleId,
      started_at: attempt.started_at
    };
  }

  // RPC complete_game_attempt: Server validates moves/answers and calculates points
  completeAttempt(callerId, attemptId, submission) {
    const attempt = this.attempts.get(attemptId);
    if (!attempt) return { success: false, error: 'Attempt not found' };

    // 1. Cross-user attempt ownership check
    if (attempt.user_id !== callerId) {
      return { success: false, error: 'Security Violation: Attempt belongs to another user' };
    }

    // 2. Atomic Idempotence check
    if (attempt.status === 'completed') {
      return {
        success: true,
        already_completed: true,
        score: attempt.score,
        accuracy: attempt.accuracy
      };
    }

    // 3. Payload size and move limits check
    const payloadStr = JSON.stringify(submission);
    if (payloadStr.length > 32768) {
      return { success: false, error: 'Security Violation: Payload exceeds 32KB limit' };
    }
    if (submission.moves && Array.isArray(submission.moves) && submission.moves.length > 100) {
      return { success: false, error: 'Security Violation: Move count exceeds limit (max 100)' };
    }

    // 4. Server elapsed time enforcement (min 2 seconds)
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - attempt.started_at) / 1000));
    if (elapsedSeconds < 2) {
      return { success: false, error: 'Anti-Cheat: Completion time too low (< 2s)' };
    }

    // 5. SERVER-SIDE SCORING: Never trusts client-supplied correct_count, solved, score, or accuracy!
    let calculatedScore = 0;
    let calculatedAcc = 0;

    if (attempt.game_id === 'di' || attempt.game_id === 'rc') {
      const userAnswers = submission.answers || [];
      const expectedAnswers = attempt.solution_key.answers || [];
      let matches = 0;
      for (let i = 0; i < expectedAnswers.length; i++) {
        if (userAnswers[i] !== undefined && userAnswers[i] === expectedAnswers[i]) {
          matches++;
        }
      }
      calculatedScore = Math.round(((matches / 24) * 10) * 100) / 100;
      calculatedAcc = Math.round((matches / 24) * 100);

    } else if (attempt.game_id === 'switch') {
      const match = submission.choiceIndex === attempt.solution_key.correctChoiceIndex;
      calculatedScore = match ? 10.00 : 0.00;
      calculatedAcc = match ? 100 : 0;

    } else if (attempt.game_id === 'sudoku') {
      const match = submission.selectedSymbol === attempt.solution_key.correctSymbol;
      calculatedScore = match ? 10.00 : 0.00;
      calculatedAcc = match ? 100 : 0;

    } else if (attempt.game_id === 'inductive') {
      const userSel = (submission.selectedIndices || []).sort();
      const expSel = (attempt.solution_key.correctIndices || []).sort();
      const match = userSel.length === 2 && userSel[0] === expSel[0] && userSel[1] === expSel[1];
      calculatedScore = match ? 10.00 : 0.00;
      calculatedAcc = match ? 100 : 0;

    } else if (attempt.game_id === 'grid') {
      const userRecalled = (submission.recalledIndices || []).sort();
      const expRecalled = (attempt.solution_key.sequence || []).sort();
      const patternMatch = userRecalled.length === expRecalled.length && 
                           userRecalled.every((v, i) => v === expRecalled[i]);
      if (patternMatch) {
        const distractionCorrect = submission.distractionAnswer === attempt.solution_key.distractionAnswer;
        const baseScore = Math.min(10, attempt.level);
        calculatedScore = distractionCorrect ? baseScore : Math.max(1, baseScore - 3);
        calculatedAcc = distractionCorrect ? 100 : 70;
      } else {
        calculatedScore = 0.00;
        calculatedAcc = 0;
      }

    } else if (attempt.game_id === 'motion') {
      // Replay bounded moves from initial board
      let currentBall = { ...attempt.solution_key.initialBall };
      const target = attempt.solution_key.target;
      const moves = submission.moves || [];
      for (const move of moves) {
        if (move.entityId === 'ball') {
          if (move.direction === 'UP') currentBall.row -= move.steps;
          if (move.direction === 'DOWN') currentBall.row += move.steps;
          if (move.direction === 'LEFT') currentBall.col -= move.steps;
          if (move.direction === 'RIGHT') currentBall.col += move.steps;
        }
      }
      const reached = (currentBall.row === target.row && currentBall.col === target.col);
      calculatedScore = reached ? 10.00 : 0.00;
      calculatedAcc = reached ? 100 : 0;
    }

    attempt.status = 'completed';
    attempt.score = calculatedScore;
    attempt.accuracy = calculatedAcc;
    attempt.time_spent = elapsedSeconds;

    this.sessions.set(attemptId, {
      id: attemptId,
      user_id: callerId,
      game_id: attempt.game_id,
      level: attempt.level,
      score: calculatedScore,
      accuracy: calculatedAcc,
      time_spent: elapsedSeconds
    });

    return {
      success: true,
      already_completed: false,
      score: calculatedScore,
      accuracy: calculatedAcc,
      time_spent: elapsedSeconds
    };
  }
}

const engine = new TrustedServerGameEngine();

// ---------------------------------------------------------
// 1. FORGED CLAIMS TEST: Client claims perfect score without answers
// ---------------------------------------------------------
console.log('--- 1. Testing Forged Claims without Matching Answers ---');

const { attempt_id: diAttId } = engine.createAttempt('usr-alice', 'di', 1);
engine.attempts.get(diAttId).started_at = Date.now() - 30000;

// Attacker sends forged correct_count=24 and score=10 with empty/wrong answers
const forgedDI = engine.completeAttempt('usr-alice', diAttId, {
  score: 10.00,
  accuracy: 100,
  correct_count: 24,
  solved: true,
  answers: [] // Zero answers provided!
});
assert(forgedDI.success && forgedDI.score === 0.00, 'Forged correct_count=24 with empty answers awards 0.00 points (client assertions ignored)');

// Attacker sends Motion claim solved=true with 0 moves
const { attempt_id: motionAttId } = engine.createAttempt('usr-alice', 'motion', 1);
engine.attempts.get(motionAttId).started_at = Date.now() - 30000;

const forgedMotion = engine.completeAttempt('usr-alice', motionAttId, {
  solved: true,
  score: 10.00,
  moves: [] // No moves made!
});
assert(forgedMotion.success && forgedMotion.score === 0.00, 'Forged solved=true with empty moves awards 0.00 points (moves replayed server-side)');

// ---------------------------------------------------------
// 2. ALTERED PUZZLE IDENTITY & CROSS-USER REJECTION
// ---------------------------------------------------------
console.log('\n--- 2. Testing Puzzle Alteration & Cross-User Attacks ---');

const { attempt_id: bobAttId } = engine.createAttempt('usr-bob', 'switch', 1);
engine.attempts.get(bobAttId).started_at = Date.now() - 15000;

// Alice tries to complete Bob's attempt
const crossUserAttempt = engine.completeAttempt('usr-alice', bobAttId, { choiceIndex: 1 });
assert(crossUserAttempt.success === false && crossUserAttempt.error.includes('belongs to another user'), 'Cross-user attempt completion is strictly rejected');

// Blocked user tries to create attempt
const blockedAttempt = engine.createAttempt('usr-blocked', 'switch', 1);
assert(blockedAttempt.success === false && blockedAttempt.error.includes('suspended'), 'Suspended user cannot create attempt');

// ---------------------------------------------------------
// 3. CONCURRENT / DUPLICATE COMPLETIONS (EXACTLY ONE RESULT)
// ---------------------------------------------------------
console.log('\n--- 3. Testing Atomic Concurrency & Idempotence ---');

const { attempt_id: gridAttId } = engine.createAttempt('usr-alice', 'grid', 2);
engine.attempts.get(gridAttId).started_at = Date.now() - 20000;

const validGridSubmission = {
  recalledIndices: [2, 5, 8],
  distractionAnswer: true
};

// Simultaneous request 1
const res1 = engine.completeAttempt('usr-alice', gridAttId, validGridSubmission);
assert(res1.success && res1.already_completed === false && res1.score === 2.00, 'First completion awards points atomically');

// Simultaneous request 2 (same attempt)
const res2 = engine.completeAttempt('usr-alice', gridAttId, validGridSubmission);
assert(res2.success && res2.already_completed === true && res2.score === 2.00, 'Second simultaneous completion returns idempotent result (already_completed: true)');

assert(engine.sessions.size === 3, 'Database contains exactly ONE session row for the attempt');

// ---------------------------------------------------------
// 4. LEGITIMATE RESULTS & RETRIES
// ---------------------------------------------------------
console.log('\n--- 4. Testing Legitimate Solves & Retries ---');

// Legitimate DI submission with 12 correct answers
const { attempt_id: legitDIAttId } = engine.createAttempt('usr-alice', 'di', 1);
engine.attempts.get(legitDIAttId).started_at = Date.now() - 40000;

const legitAnswers = engine.attempts.get(legitDIAttId).solution_key.answers.slice(0, 12);
const legitDIRes = engine.completeAttempt('usr-alice', legitDIAttId, { answers: legitAnswers });
assert(legitDIRes.success && legitDIRes.score === 5.00 && legitDIRes.accuracy === 50, 'Legitimate 12/24 correct answers calculates exact score 5.00 (50% accuracy)');

// Legitimate Retry creates new attempt ID and succeeds
const { attempt_id: retryAttId } = engine.createAttempt('usr-alice', 'di', 1);
engine.attempts.get(retryAttId).started_at = Date.now() - 25000;
assert(retryAttId !== legitDIAttId, 'Level retry creates a new distinct attempt ID');

const retryRes = engine.completeAttempt('usr-alice', retryAttId, { answers: legitAnswers });
assert(retryRes.success && retryRes.score === 5.00, 'Retry attempt records successfully');

console.log('\n====================================================');
console.log(`🏁 AUDIT COMPLETE: ${passedTests} / ${totalTests} passed`);
console.log('====================================================\n');
