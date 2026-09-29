export type SwitchSymbol = 'triangle' | 'circle' | 'cross' | 'star';
export type Permutation = [number, number, number, number]; // 1-indexed

export interface SwitchPuzzle {
  id: string;
  input: SwitchSymbol[];
  output: SwitchSymbol[];
  fixedCodes: Permutation[]; // earlier rows of codes
  choices: Permutation[]; // exactly 3 choices
  correctChoiceIndex: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface SwitchState {
  puzzle: SwitchPuzzle;
  status: "playing" | "completed" | "failed";
  selectedChoice: number | null;
}
