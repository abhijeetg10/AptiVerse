export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type EntityType = "ball" | "target" | "block" | "wall";

export interface Cell {
  row: number;
  col: number;
}

export interface BaseEntity extends Cell {
  type: EntityType;
}

export interface Ball extends BaseEntity {
  type: "ball";
  id: "ball";
}

export interface Target extends BaseEntity {
  type: "target";
}

export interface Wall extends BaseEntity {
  type: "wall";
}

export interface MovableBlock extends BaseEntity {
  type: "block";
  id: string;
  orientation: "horizontal" | "vertical";
  length: number;
  color?: string;
}

export interface GameState {
  id: string;
  rows: number;
  cols: number;
  difficulty: "easy" | "medium" | "hard" | "very-hard" | "expert";
  ball: Ball;
  target: Target;
  blocks: MovableBlock[];
  walls: Wall[];
  moves: number;
  optimalMoves: number;
  status: "playing" | "completed";
}

export interface PuzzleDefinition {
  id: string;
  rows: number;
  cols: number;
  difficulty: "easy" | "medium" | "hard" | "very-hard" | "expert";
  ball: Cell;
  target: Cell;
  blocks: {
    id: string;
    orientation: "horizontal" | "vertical";
    length: number;
    row: number;
    col: number;
    color?: string;
  }[];
  walls?: Cell[];
  optimalMoves: number;
}
