import type { SwitchPuzzle } from './types';
import { generateSwitchLevel } from './generator';

export const getLevel = (i: number): SwitchPuzzle => {
  const rows = i < 5 ? 1 : i < 15 ? 2 : 3;
  return generateSwitchLevel(`switch-${i+1}-${Date.now()}`, rows);
};
