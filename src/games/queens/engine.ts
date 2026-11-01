import type {
  QueensPuzzle,
  QueensGameState,
  CellState,
  Move,
  ScoreSummary,
} from './types';
import {
  checkConflicts,
  isBoardSolved,
  calculateAutoMarks,
  generateHint,
} from './solver';
import { DIFFICULTY_CONFIG } from './generator';

/**
 * Creates the initial game state for a puzzle.
 */
export function createInitialState(puzzle: QueensPuzzle): QueensGameState {
  const board: CellState[][] = Array.from({ length: puzzle.size }, () =>
    Array(puzzle.size).fill('empty')
  );

  return {
    puzzle,
    board,
    conflicts: [],
    history: [],
    redoStack: [],
    movesCount: 0,
    mistakesCount: 0,
    hintsUsed: 0,
    inputMode: 'queen',
    autoCheck: true,
    autoMark: true,
    status: 'playing',
    timeElapsed: 0,
    highlightedCell: null,
    suggestedCell: null,
    activeHint: null,
  };
}

/**
 * Handles a cell click according to current inputMode ('queen' or 'x').
 */
export function handleCellClick(
  state: QueensGameState,
  row: number,
  col: number,
  overrideMode?: 'queen' | 'x'
): QueensGameState {
  if (state.status !== 'playing') return state;

  const mode = overrideMode || state.inputMode;
  const currentVal = state.board[row][col];
  let nextVal: CellState = 'empty';

  if (mode === 'queen') {
    // In Queen mode: Empty -> Queen, Queen -> Empty, X -> Queen
    nextVal = currentVal === 'queen' ? 'empty' : 'queen';
  } else {
    // In X mode: Empty -> X, X -> Empty, Queen -> X
    nextVal = currentVal === 'x' ? 'empty' : 'x';
  }

  // Clone board
  const newBoard: CellState[][] = state.board.map((r) => [...r]);
  newBoard[row][col] = nextVal;

  const move: Move = {
    row,
    col,
    prev: currentVal,
    next: nextVal,
  };

  const autoMarkMoves: Move[] = [];

  // If a Queen was placed and autoMark is enabled, automatically mark X on conflicting cells
  if (nextVal === 'queen' && state.autoMark) {
    const marks = calculateAutoMarks(newBoard, state.puzzle.regions, state.puzzle.size);
    for (const m of marks) {
      if (newBoard[m.row][m.col] === 'empty') {
        newBoard[m.row][m.col] = 'x';
        autoMarkMoves.push({
          row: m.row,
          col: m.col,
          prev: 'empty',
          next: 'x',
          isAutoMark: true,
        });
      }
    }
  }

  // Calculate conflicts
  const conflicts = checkConflicts(newBoard, state.puzzle.regions, state.puzzle.size);
  const hadMistake = conflicts.some((c) => c.row === row && c.col === col);

  // Check if solved
  const solved = isBoardSolved(newBoard, state.puzzle.regions, state.puzzle.size);

  return {
    ...state,
    board: newBoard,
    conflicts: state.autoCheck ? conflicts : [],
    history: [...state.history, move, ...autoMarkMoves],
    redoStack: [], // Clearing redo stack on new action
    movesCount: state.movesCount + 1,
    mistakesCount: hadMistake ? state.mistakesCount + 1 : state.mistakesCount,
    status: solved ? 'completed' : 'playing',
    suggestedCell: null,
    activeHint: null,
  };
}

/**
 * Undoes the last user move (including associated auto-marks).
 */
export function undo(state: QueensGameState): QueensGameState {
  if (state.history.length === 0 || state.status !== 'playing') return state;

  const newHistory = [...state.history];
  const newBoard = state.board.map((r) => [...r]);
  const newRedo = [...state.redoStack];

  // If last moves were auto-marks, undo them all together with the triggering move
  let lastMove = newHistory.pop();
  while (lastMove && lastMove.isAutoMark) {
    newBoard[lastMove.row][lastMove.col] = lastMove.prev;
    newRedo.push(lastMove);
    lastMove = newHistory.pop();
  }

  if (lastMove) {
    newBoard[lastMove.row][lastMove.col] = lastMove.prev;
    newRedo.push(lastMove);
  }

  const conflicts = checkConflicts(newBoard, state.puzzle.regions, state.puzzle.size);

  return {
    ...state,
    board: newBoard,
    history: newHistory,
    redoStack: newRedo,
    conflicts: state.autoCheck ? conflicts : [],
    suggestedCell: null,
    activeHint: null,
  };
}

/**
 * Redoes the previously undone move.
 */
export function redo(state: QueensGameState): QueensGameState {
  if (state.redoStack.length === 0 || state.status !== 'playing') return state;

  const newRedo = [...state.redoStack];
  const newBoard = state.board.map((r) => [...r]);
  const newHistory = [...state.history];

  let move = newRedo.pop();
  if (move) {
    newBoard[move.row][move.col] = move.next;
    newHistory.push(move);
  }

  // Redo attached auto-marks
  while (newRedo.length > 0 && newRedo[newRedo.length - 1].isAutoMark) {
    const autoMove = newRedo.pop()!;
    newBoard[autoMove.row][autoMove.col] = autoMove.next;
    newHistory.push(autoMove);
  }

  const conflicts = checkConflicts(newBoard, state.puzzle.regions, state.puzzle.size);
  const solved = isBoardSolved(newBoard, state.puzzle.regions, state.puzzle.size);

  return {
    ...state,
    board: newBoard,
    history: newHistory,
    redoStack: newRedo,
    conflicts: state.autoCheck ? conflicts : [],
    status: solved ? 'completed' : 'playing',
  };
}

/**
 * Resets the current puzzle board to empty.
 */
export function resetBoard(state: QueensGameState): QueensGameState {
  const board: CellState[][] = Array.from({ length: state.puzzle.size }, () =>
    Array(state.puzzle.size).fill('empty')
  );

  return {
    ...state,
    board,
    conflicts: [],
    history: [],
    redoStack: [],
    suggestedCell: null,
    activeHint: null,
    status: 'playing',
  };
}

/**
 * Requests an intelligent hint.
 */
export function applyHint(state: QueensGameState): QueensGameState {
  if (state.status !== 'playing') return state;

  const hint = generateHint(
    state.board,
    state.puzzle.regions,
    state.puzzle.solution,
    state.puzzle.size
  );

  if (!hint) return state;

  return {
    ...state,
    activeHint: hint,
    suggestedCell: { row: hint.row, col: hint.col },
    hintsUsed: state.hintsUsed + 1,
  };
}

/**
 * Computes a standardized AptiVerse score breakdown.
 */
export function calculateScoreSummary(state: QueensGameState): ScoreSummary {
  const config = DIFFICULTY_CONFIG[state.puzzle.difficulty] || DIFFICULTY_CONFIG.beginner;
  const baseScore = config.baseScore;

  // Time Bonus: Awarded if completed faster than target time
  const targetTime = config.targetTimeSecs;
  const timeFactor = Math.max(0, 1 - state.timeElapsed / (targetTime * 1.5));
  const timeBonus = Math.round(baseScore * 0.4 * timeFactor);

  // Accuracy Bonus: Deduct per mistake
  const mistakePenalty = state.mistakesCount * 40;
  const accuracyBonus = Math.max(0, Math.round(baseScore * 0.3) - mistakePenalty);

  // Hint Penalty
  const hintPenalty = state.hintsUsed * 60;

  // Final Raw Score
  const rawScore = Math.max(100, baseScore + timeBonus + accuracyBonus - hintPenalty);

  // Star Rating
  let stars: 1 | 2 | 3 = 1;
  if (state.mistakesCount <= 1 && state.hintsUsed === 0 && state.timeElapsed <= targetTime) {
    stars = 3;
  } else if (state.mistakesCount <= 3 && state.hintsUsed <= 1) {
    stars = 2;
  }

  // Normalized score (0.00 - 10.00) for AptiVerse backend attempt submission
  const maxPossible = baseScore * 1.7;
  const normalizedScore = Math.min(10, Math.max(1, Math.round((rawScore / maxPossible) * 10 * 100) / 100));

  return {
    difficulty: state.puzzle.difficulty,
    baseScore,
    timeBonus,
    accuracyBonus,
    hintPenalty,
    finalScore: rawScore,
    normalizedScore,
    timeElapsed: state.timeElapsed,
    movesCount: state.movesCount,
    mistakesCount: state.mistakesCount,
    hintsUsed: state.hintsUsed,
    stars,
  };
}

