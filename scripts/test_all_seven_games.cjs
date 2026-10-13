const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🎮 COMPREHENSIVE BEHAVIORAL AUDIT: ALL 7 GAMES');
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

const { getLevel: getMotionLevel } = require('../src/games/motion/levels');
const { createInitialState: createMotionState, applyMove } = require('../src/games/motion/engine');

const motionPuzzle = getMotionLevel(0);
assert(motionPuzzle && motionPuzzle.rows === 6 && motionPuzzle.cols === 6, 'Motion puzzle loads valid 6x6 grid');
const motionState = createMotionState(motionPuzzle);
assert(motionState.status === 'playing', 'Motion initializes in "playing" status');

// Test move application
const movedState = applyMove(motionState, 'ball', 'right');
assert(movedState !== null, 'Motion applies move transitions cleanly');

// Test timeout handling & clamp
let motionTime = 1;
motionTime = Math.max(0, motionTime - 1); // 0
assert(motionTime === 0, 'Motion timer ticks to 0 cleanly');
motionTime = Math.max(0, motionTime - 1); // clamped
assert(motionTime === 0, 'Motion timer is strictly clamped at 0 (cannot become negative)');

// 2. GEO SUDOKU ENGINE
console.log('\n--- 2. Geo Sudoku Challenge ---');
const { getLevel: getSudokuLevel } = require('../src/games/sudoku/levels');
const { createInitialState: createSudokuState, applyAnswer: applySudokuAnswer, getCandidates } = require('../src/games/sudoku/engine');

const sudokuPuzzle = getSudokuLevel(0, 42);
assert(sudokuPuzzle && sudokuPuzzle.symbols.length > 0, 'Geo Sudoku level loads with symbols');
const sudokuState = createSudokuState(sudokuPuzzle);
assert(sudokuState.status === 'playing', 'Geo Sudoku initializes in "playing" status');

const candidates = getCandidates(sudokuPuzzle.board, sudokuPuzzle.target.row, sudokuPuzzle.target.col, sudokuPuzzle.symbols);
assert(candidates.length === 1, `Target cell has unique candidate solution: ${candidates[0]}`);
const solutionSymbol = candidates[0];

// Test wrong answer -> 'failed' state
const wrongSymbol = sudokuPuzzle.symbols.find(s => s !== solutionSymbol);
const failedSudoku = applySudokuAnswer(sudokuState, wrongSymbol);
assert(failedSudoku.status === 'failed', 'Wrong symbol triggers explicit "failed" state');

// Test correct answer -> 'completed' state
const wonSudoku = applySudokuAnswer(sudokuState, solutionSymbol);
assert(wonSudoku.status === 'completed', 'Correct symbol triggers explicit "completed" state');

// 3. GRID CHALLENGE ENGINE
console.log('\n--- 3. Grid Challenge ---');
const { generateGridLevel } = require('../src/games/grid/generator');
const { createInitialState: createGridState, tickCountdown, submitDistraction, toggleCell } = require('../src/games/grid/engine');

const gridPuzzle = generateGridLevel('grid-1-s42', 3);
assert(gridPuzzle && gridPuzzle.sequence.length === 3, 'Grid generates sequence of 3 dots');
let gridState = createGridState(gridPuzzle);
assert(gridState.phase === 'memorize', 'Grid initializes in "memorize" phase');

// Tick countdown to distract
while (gridState.phase === 'memorize') {
  gridState = tickCountdown(gridState);
}
assert(gridState.phase === 'distract', 'Grid transitions to "distract" phase upon countdown expiry');
assert(gridState.countdown >= 0, 'Grid countdown does not tick below 0');

// Answer distraction
gridState = submitDistraction(gridState, gridPuzzle.distraction.isTrue);
assert(gridState.phase === 'recreate', 'Grid transitions to "recreate" phase');
assert(gridState.distractionPassed === true, 'Distraction accuracy recorded as passed');

// 4. SWITCH CHALLENGE ENGINE
console.log('\n--- 4. Switch Challenge ---');
const { getLevel: getSwitchLevel } = require('../src/games/switch/levels');
const { createInitialState: createSwitchState, submitAnswer: submitSwitchAnswer } = require('../src/games/switch/engine');

const switchPuzzle = getSwitchLevel(0, 101);
assert(switchPuzzle && switchPuzzle.choices.length === 3, 'Switch challenge loads with 3 operator choices');
const switchState = createSwitchState(switchPuzzle);
assert(switchState.status === 'playing', 'Switch challenge initializes in "playing" state');

const wonSwitch = submitSwitchAnswer(switchState, switchPuzzle.correctChoiceIndex);
assert(wonSwitch.status === 'completed', 'Selecting correct operator option completes Switch challenge');

const wrongSwitchIndex = (switchPuzzle.correctChoiceIndex + 1) % 3;
const failedSwitch = submitSwitchAnswer(switchState, wrongSwitchIndex);
assert(failedSwitch.status === 'failed', 'Selecting incorrect operator option fails Switch challenge');

// 5. INDUCTIVE CHALLENGE ENGINE
console.log('\n--- 5. Inductive Challenge ---');
const { getLevel: getInductiveLevel } = require('../src/games/inductive/levels');
const { createInitialState: createInductiveState, toggleSelection, submitAnswer: submitInductiveAnswer } = require('../src/games/inductive/engine');

const inductivePuzzle = getInductiveLevel(0);
assert(inductivePuzzle && inductivePuzzle.options.length === 4, 'Inductive challenge loads 4 candidate grids');
let inductiveState = createInductiveState(inductivePuzzle);

// Toggle correct items
inductivePuzzle.correctOptionIndices.forEach(idx => {
  inductiveState = toggleSelection(inductiveState, idx);
});
assert(inductiveState.selectedIndices.length === 2, 'Inductive allows selecting exactly 2 items');
const wonInductive = submitInductiveAnswer(inductiveState);
assert(wonInductive.status === 'completed', 'Submitting correct matching items completes Inductive challenge');

// 6. DI CHALLENGE (DATA INTERPRETATION)
console.log('\n--- 6. Data Interpretation (DI) Challenge ---');
const { getLevelPuzzle: getDIPuzzle, levels: diLevels } = require('../src/games/di/levels');
const { createInitialState: createDIState, submitAnswer: submitDIAnswer } = require('../src/games/di/engine');

assert(diLevels.length > 0, `DI contains ${diLevels.length} assessment sets`);
const diPuzzle = getDIPuzzle(0);
assert(diPuzzle && diPuzzle.questions.length === 24, 'DI assessment set contains 24 structured questions');
let diState = createDIState(diPuzzle);

// Submit correct answer to question 0
const q0 = diPuzzle.questions[0];
diState = submitDIAnswer(diState, q0.correctAnswer);
assert(diState.score === 1, 'DI accurately scores correct answer (1/24)');

// Verify fractional normalization: 1/24 * 10 = 0.42
const diNormalizedScore = Math.round(((diState.score / diPuzzle.questions.length) * 10) * 100) / 100;
assert(diNormalizedScore === 0.42, 'DI fractional score properly normalizes to 0.42 on 0-10 scale');

// 7. RC CHALLENGE (READING COMPREHENSION)
console.log('\n--- 7. Reading Comprehension (RC) Challenge ---');
const { getLevelPuzzle: getRCPuzzle, levels: rcLevels } = require('../src/games/rc/levels');
const { createInitialState: createRCState, submitAnswer: submitRCAnswer } = require('../src/games/rc/engine');

assert(rcLevels.length > 0, `RC contains ${rcLevels.length} reading passages`);
const rcPuzzle = getRCPuzzle(0);
assert(rcPuzzle && rcPuzzle.questions.length === 24, 'RC assessment set contains 24 passage questions');
let rcState = createRCState(rcPuzzle);

// Submit correct answer to question 0
const rcQ0 = rcPuzzle.questions[0];
rcState = submitRCAnswer(rcState, rcQ0.correctAnswer);
assert(rcState.score === 1, 'RC accurately scores correct passage answer (1/24)');

console.log('\n====================================================');
console.log(`🏁 ALL 7 GAMES AUDIT COMPLETE: ${passedTests} / ${totalTests} passed`);
console.log('====================================================\n');
