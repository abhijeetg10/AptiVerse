export type ShapeId = 'yc' | 'rs' | 'gt' | 'bp'; // Yellow Circle, Red Square, Green Triangle, Blue Plus
export type Grid3x3 = ShapeId[]; // Always length 9 (row-major order)

export interface InductivePuzzle {
  id: string;
  ruleName: string; // Internal name of rule
  examples: [Grid3x3, Grid3x3];
  options: [Grid3x3, Grid3x3, Grid3x3, Grid3x3];
  correctOptionIndices: [number, number]; // Exactly 2 correct
}

export interface InductiveState {
  puzzle: InductivePuzzle;
  status: "playing" | "completed" | "failed";
  selectedIndices: number[]; // e.g. [0, 2]
}
