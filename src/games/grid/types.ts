export type GridPhase = 'memorize' | 'distract' | 'recreate' | 'result';

export interface DistractionTask {
  type: 'symmetry' | 'matching';
  grid1: boolean[];
  grid2?: boolean[];
  isTrue: boolean;
}

export interface GridPuzzle {
  id: string;
  gridSize: number; // e.g. 25 for 5x5
  dotsCount: number;
  sequence: number[]; // the indices to remember
  distraction: DistractionTask;
}

export interface GridState {
  puzzle: GridPuzzle;
  phase: GridPhase;
  countdown: number;
  userSelection: number[];
  distractionPassed: boolean | null;
  result: "won" | "lost" | null;
}
