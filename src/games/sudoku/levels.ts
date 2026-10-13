import type { GeoSudokuPuzzle } from './types';
import { generateGeoSudokuLevel } from './generator';

export const getLevel = (i: number, seed?: number): GeoSudokuPuzzle => {
  const size = i < 5 ? 4 : i < 12 ? 5 : 6;
  const difficulty = i < 5 ? "easy" : i < 12 ? "medium" : "hard";
  const seedKey = seed !== undefined ? seed : i + 1;
  return generateGeoSudokuLevel(`sudoku-${i + 1}-s${seedKey}`, size, difficulty);
};
