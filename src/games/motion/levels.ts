import type { PuzzleDefinition } from './types';
import { staticLevels } from './staticLevels';

const DECK_STORAGE_KEY = 'aptiverse_motion_unplayed_deck';

const COLOR_PALETTE = ['blue', 'yellow', 'purple', 'green', 'teal', 'indigo', 'orange'];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Applies rotation/mirror to a coordinate on an N x N board (6x6)
function transformCoord(row: number, col: number, rows: number, cols: number, variant: number): { row: number; col: number } {
  switch (variant) {
    case 1: // Rotate 90 deg clockwise
      return { row: col, col: cols - 1 - row };
    case 2: // Rotate 180 deg
      return { row: rows - 1 - row, col: cols - 1 - col };
    case 3: // Rotate 270 deg
      return { row: rows - 1 - col, col: row };
    case 4: // Flip Horizontal (left-right)
      return { row: row, col: cols - 1 - col };
    case 5: // Flip Vertical (top-bottom)
      return { row: rows - 1 - row, col: col };
    case 6: // Transpose (Diagonal)
      return { row: col, col: row };
    case 7: // Anti-Diagonal
      return { row: rows - 1 - col, col: cols - 1 - row };
    default: // 0: Original
      return { row, col };
  }
}

// Generate an unplayed deck across 160 symmetric variants (20 base * 8 symmetry transforms)
function getNextUniqueLevelKey(): { baseIndex: number; variant: number } {
  let deck: number[] = [];
  try {
    const stored = localStorage.getItem(DECK_STORAGE_KEY);
    if (stored) {
      deck = JSON.parse(stored);
    }
  } catch {
    deck = [];
  }

  const TOTAL_COMBINATIONS = staticLevels.length * 8; // 160 distinct board layouts
  if (!Array.isArray(deck) || deck.length === 0) {
    deck = shuffle(Array.from({ length: TOTAL_COMBINATIONS }, (_, i) => i));
  }

  const chosenCombo = deck.pop() ?? 0;
  try {
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
  } catch {
    // LocalStorage quota or access ignored
  }

  const baseIndex = Math.floor(chosenCombo / 8) % staticLevels.length;
  const variant = chosenCombo % 8;
  return { baseIndex, variant };
}

/** Returns true if a block occupies the given cell */
const blockCoversCell = (block: PuzzleDefinition['blocks'][number], row: number, col: number): boolean => {
  if (block.orientation === 'horizontal') {
    return block.row === row && col >= block.col && col < block.col + block.length;
  } else {
    return block.col === col && row >= block.row && row < block.row + block.length;
  }
};

export const getLevel = (_levelSeq: number): PuzzleDefinition => {
  const { baseIndex, variant } = getNextUniqueLevelKey();
  const base = staticLevels[baseIndex];

  const rows = base.rows;
  const cols = base.cols;

  const transformedBall = transformCoord(base.ball.row, base.ball.col, rows, cols, variant);
  const transformedTarget = transformCoord(base.target.row, base.target.col, rows, cols, variant);

  const transformedWalls = (base.walls || []).map(w => 
    transformCoord(w.row, w.col, rows, cols, variant)
  );

  const colors = shuffle(COLOR_PALETTE);

  const transformedBlocks: PuzzleDefinition['blocks'] = base.blocks.map((b, i) => {
    // Generate all cell coordinates for the block
    const cells: { row: number; col: number }[] = [];
    for (let c = 0; c < b.length; c++) {
      if (b.orientation === 'horizontal') {
        cells.push({ row: b.row, col: b.col + c });
      } else {
        cells.push({ row: b.row + c, col: b.col });
      }
    }

    // Transform cells
    const tCells = cells.map(cell => transformCoord(cell.row, cell.col, rows, cols, variant));
    const minRow = Math.min(...tCells.map(c => c.row));
    const minCol = Math.min(...tCells.map(c => c.col));

    // Determine new orientation: if multiple rows -> vertical, else horizontal
    const isVertical = tCells.length > 1 && tCells[0].col === tCells[1].col;

    return {
      id: b.id,
      orientation: isVertical ? 'vertical' : 'horizontal',
      length: b.length,
      row: minRow,
      col: minCol,
      color: colors[i % colors.length] as any
    };
  });

  // Ensure no block starts on top of the target hole
  const validBlocks = transformedBlocks.filter(
    b => !blockCoversCell(b, transformedTarget.row, transformedTarget.col)
  );

  return {
    id: `${base.id}_v${variant}_${Date.now()}`,
    difficulty: base.difficulty,
    rows,
    cols,
    ball: transformedBall,
    target: transformedTarget,
    walls: transformedWalls,
    blocks: validBlocks,
    optimalMoves: base.optimalMoves
  };
};
