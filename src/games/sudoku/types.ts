export type GeoSymbol = "circle" | "triangle" | "square" | "star" | "hexagon" | "pentagon" | "diamond" | "cross";

export interface CellPos {
  row: number;
  col: number;
}

export interface GeoSudokuPuzzle {
  id: string;
  size: number;
  symbols: GeoSymbol[];
  board: (GeoSymbol | null)[][];
  target: CellPos;
  difficulty: "easy" | "medium" | "hard";
}

export interface GeoSudokuState {
  puzzle: GeoSudokuPuzzle;
  status: "playing" | "completed" | "failed";
  selectedSymbol: GeoSymbol | null;
  moves: number;
  activeCell: CellPos | null;
  userFills: Record<string, GeoSymbol>;
}
