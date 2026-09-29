import type { InductivePuzzle } from './types';
import { generateInductiveLevel } from './generator';

export const getLevel = (i: number): InductivePuzzle => {
  return generateInductiveLevel(`inductive-${i+1}-${Date.now()}`);
};
