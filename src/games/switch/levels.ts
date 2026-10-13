import type { SwitchPuzzle } from './types';
import { generateSwitchLevel } from './generator';

export const getLevel = (i: number, seed?: number): SwitchPuzzle => {
  const rows = i < 5 ? 1 : i < 15 ? 2 : 3;
  const seedKey = seed !== undefined ? seed : i + 1;
  return generateSwitchLevel(`switch-${i + 1}-s${seedKey}`, rows);
};
