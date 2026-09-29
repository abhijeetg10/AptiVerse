import type { GeoSudokuPuzzle } from './types';
import { generateGeoSudokuLevel } from './generator';

export const getLevel = (i: number): GeoSudokuPuzzle => {
  const size = i < 5 ? 4 : i < 12 ? 5 : 6;
  const difficulty = i < 5 ? "easy" : i < 12 ? "medium" : "hard";
  return generateGeoSudokuLevel(`sudoku-${i+1}-${Date.now()}`, size, difficulty);
};
