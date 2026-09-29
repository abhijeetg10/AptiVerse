import type { PuzzleDefinition } from './types';
import { staticLevels } from './staticLevels';

// We shuffle indices once when module loads so that a session plays through randomized but unique levels
const shuffledIndices = Array.from({ length: staticLevels.length }, (_, i) => i)
  .sort(() => Math.random() - 0.5);

export const getLevel = (i: number): PuzzleDefinition => {
  // Safe bounds check. If user plays more than 10 levels, it wraps around safely.
  const index = shuffledIndices[i % staticLevels.length];
  
  // Return a copy so state mutations don't corrupt the static reference
  const levelData = staticLevels[index];
  return JSON.parse(JSON.stringify(levelData));
};
