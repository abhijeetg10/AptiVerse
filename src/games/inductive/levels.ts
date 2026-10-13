import type { InductivePuzzle } from './types';
import { generateInductiveLevel } from './generator';

export const getLevel = (i: number, seed?: number): InductivePuzzle => {
  const seedKey = seed !== undefined ? seed : i + 1;
  return generateInductiveLevel(`inductive-${i + 1}-s${seedKey}`);
};
