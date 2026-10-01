import type { PuzzleDefinition } from './types';
import { staticLevels } from './staticLevels';

// We shuffle indices once when module loads so that a session plays through randomized but unique levels
const shuffledIndices = Array.from({ length: staticLevels.length }, (_, i) => i)
  .sort(() => Math.random() - 0.5);

/** Returns true if a block occupies the given cell */
const blockCoversCell = (block: PuzzleDefinition['blocks'][number], row: number, col: number): boolean => {
  if (block.orientation === 'horizontal') {
    return block.row === row && col >= block.col && col < block.col + block.length;
  } else {
    return block.col === col && row >= block.row && row < block.row + block.length;
  }
};

export const getLevel = (i: number): PuzzleDefinition => {
  // Safe bounds check. If user plays more than 10 levels, it wraps around safely.
  const index = shuffledIndices[i % staticLevels.length];
  
  // Return a copy so state mutations don't corrupt the static reference
  const levelData: PuzzleDefinition = JSON.parse(JSON.stringify(staticLevels[index]));

  // Ensure no block starts on the target cell — the hole must always be visible
  levelData.blocks = levelData.blocks.filter(
    block => !blockCoversCell(block, levelData.target.row, levelData.target.col)
  );

  return levelData;
};
