export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export type CellState = 'empty' | 'queen' | 'x';

export interface CellCoord {
  row: number;
  col: number;
}

export type ConflictType = 'row' | 'col' | 'region' | 'adjacent';

export interface Conflict {
  type: ConflictType;
  row: number;
  col: number;
  conflictingRow?: number;
  conflictingCol?: number;
  message: string;
}

export interface Hint {
  type: 'queen' | 'remove_queen' | 'x_mark';
  row: number;
  col: number;
  reason: string;
}

export interface Move {
  row: number;
  col: number;
  prev: CellState;
  next: CellState;
  isAutoMark?: boolean;
}

export interface QueensPuzzle {
  id: string;
  size: number;
  difficulty: Difficulty;
  regions: number[][]; // [row][col] -> regionId (0..size-1)
  solution: number[];  // [row] -> queenCol
}

export interface QueensGameState {
  puzzle: QueensPuzzle;
  board: CellState[][];
  conflicts: Conflict[];
  history: Move[];
  redoStack: Move[];
  movesCount: number;
  mistakesCount: number;
  hintsUsed: number;
  inputMode: 'queen' | 'x';
  autoCheck: boolean;
  autoMark: boolean;
  status: 'playing' | 'completed' | 'paused';
  timeElapsed: number;
  highlightedCell: CellCoord | null;
  suggestedCell: CellCoord | null;
  activeHint: Hint | null;
}

export interface ScoreSummary {
  difficulty: Difficulty;
  baseScore: number;
  timeBonus: number;
  accuracyBonus: number;
  hintPenalty: number;
  finalScore: number;
  normalizedScore: number; // 0-10 for server submission
  timeElapsed: number;
  movesCount: number;
  mistakesCount: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
}

