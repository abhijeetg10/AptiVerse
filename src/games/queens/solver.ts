import type { CellState, Conflict, Hint } from './types';

/**
 * Counts the number of valid solutions for a given region configuration up to maxCount.
 * Aborts early as soon as maxCount is reached to maintain fast performance.
 */
export function countSolutions(
  size: number,
  regions: number[][],
  maxCount: number = 2
): number {
  let count = 0;
  const colUsed = new Array(size).fill(false);
  const regionUsed = new Array(size).fill(false);
  const queens = new Array(size).fill(-1);

  function solve(r: number): boolean {
    if (r === size) {
      count++;
      return count >= maxCount;
    }

    for (let c = 0; c < size; c++) {
      if (colUsed[c]) continue;
      const reg = regions[r][c];
      if (regionUsed[reg]) continue;

      // No adjacent queens (including diagonals from previous row)
      if (r > 0 && Math.abs(queens[r - 1] - c) <= 1) continue;

      colUsed[c] = true;
      regionUsed[reg] = true;
      queens[r] = c;

      const stop = solve(r + 1);
      if (stop) return true;

      colUsed[c] = false;
      regionUsed[reg] = false;
      queens[r] = -1;
    }
    return false;
  }

  solve(0);
  return count;
}

/**
 * Finds a valid solution for the board, returning an array of column indices for each row.
 */
export function findSolution(size: number, regions: number[][]): number[] | null {
  const colUsed = new Array(size).fill(false);
  const regionUsed = new Array(size).fill(false);
  const queens = new Array(size).fill(-1);

  function solve(r: number): boolean {
    if (r === size) return true;

    for (let c = 0; c < size; c++) {
      if (colUsed[c]) continue;
      const reg = regions[r][c];
      if (regionUsed[reg]) continue;
      if (r > 0 && Math.abs(queens[r - 1] - c) <= 1) continue;

      colUsed[c] = true;
      regionUsed[reg] = true;
      queens[r] = c;

      if (solve(r + 1)) return true;

      colUsed[c] = false;
      regionUsed[reg] = false;
      queens[r] = -1;
    }
    return false;
  }

  return solve(0) ? [...queens] : null;
}

/**
 * Evaluates the current board state and detects all rule conflicts among placed Queens.
 */
export function checkConflicts(
  board: CellState[][],
  regions: number[][],
  size: number
): Conflict[] {
  const conflicts: Conflict[] = [];
  const placedQueens: { r: number; c: number; reg: number }[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'queen') {
        placedQueens.push({ r, c, reg: regions[r][c] });
      }
    }
  }

  // Pairwise conflict check
  for (let i = 0; i < placedQueens.length; i++) {
    const q1 = placedQueens[i];
    for (let j = i + 1; j < placedQueens.length; j++) {
      const q2 = placedQueens[j];

      // 1. Same row
      if (q1.r === q2.r) {
        conflicts.push({
          type: 'row',
          row: q1.r,
          col: q1.c,
          conflictingRow: q2.r,
          conflictingCol: q2.c,
          message: `Row ${q1.r + 1} has multiple Queens. Only 1 Queen per row allowed.`,
        });
        conflicts.push({
          type: 'row',
          row: q2.r,
          col: q2.c,
          conflictingRow: q1.r,
          conflictingCol: q1.c,
          message: `Row ${q2.r + 1} has multiple Queens. Only 1 Queen per row allowed.`,
        });
      }

      // 2. Same column
      if (q1.c === q2.c) {
        conflicts.push({
          type: 'col',
          row: q1.r,
          col: q1.c,
          conflictingRow: q2.r,
          conflictingCol: q2.c,
          message: `Column ${q1.c + 1} has multiple Queens. Only 1 Queen per column allowed.`,
        });
        conflicts.push({
          type: 'col',
          row: q2.r,
          col: q2.c,
          conflictingRow: q1.r,
          conflictingCol: q1.c,
          message: `Column ${q2.c + 1} has multiple Queens. Only 1 Queen per column allowed.`,
        });
      }

      // 3. Same region
      if (q1.reg === q2.reg) {
        conflicts.push({
          type: 'region',
          row: q1.r,
          col: q1.c,
          conflictingRow: q2.r,
          conflictingCol: q2.c,
          message: `This colored region already contains a Queen. Only 1 Queen per region allowed.`,
        });
        conflicts.push({
          type: 'region',
          row: q2.r,
          col: q2.c,
          conflictingRow: q1.r,
          conflictingCol: q1.c,
          message: `This colored region already contains a Queen. Only 1 Queen per region allowed.`,
        });
      }

      // 4. Adjacent (including diagonal 8-neighbors)
      const dr = Math.abs(q1.r - q2.r);
      const dc = Math.abs(q1.c - q2.c);
      if (dr <= 1 && dc <= 1) {
        conflicts.push({
          type: 'adjacent',
          row: q1.r,
          col: q1.c,
          conflictingRow: q2.r,
          conflictingCol: q2.c,
          message: `Queens cannot touch each other (including diagonally).`,
        });
        conflicts.push({
          type: 'adjacent',
          row: q2.r,
          col: q2.c,
          conflictingRow: q1.r,
          conflictingCol: q1.c,
          message: `Queens cannot touch each other (including diagonally).`,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Checks if the board satisfies all winning conditions.
 */
export function isBoardSolved(
  board: CellState[][],
  regions: number[][],
  size: number
): boolean {
  let queenCount = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'queen') queenCount++;
    }
  }
  if (queenCount !== size) return false;

  const conflicts = checkConflicts(board, regions, size);
  return conflicts.length === 0;
}

/**
 * Automatically calculates cell coordinates that must be marked 'X' given current placed Queens.
 */
export function calculateAutoMarks(
  board: CellState[][],
  regions: number[][],
  size: number
): { row: number; col: number }[] {
  const toMark: { row: number; col: number }[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'queen') {
        const queenReg = regions[r][c];

        // 1. Same row
        for (let cc = 0; cc < size; cc++) {
          if (cc !== c && board[r][cc] === 'empty') {
            toMark.push({ row: r, col: cc });
          }
        }

        // 2. Same column
        for (let rr = 0; rr < size; rr++) {
          if (rr !== r && board[rr][c] === 'empty') {
            toMark.push({ row: rr, col: c });
          }
        }

        // 3. Same region
        for (let rr = 0; rr < size; rr++) {
          for (let cc = 0; cc < size; cc++) {
            if ((rr !== r || cc !== c) && regions[rr][cc] === queenReg && board[rr][cc] === 'empty') {
              toMark.push({ row: rr, col: cc });
            }
          }
        }

        // 4. 8-neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === 'empty') {
              toMark.push({ row: nr, col: nc });
            }
          }
        }
      }
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const uniqueMarks: { row: number; col: number }[] = [];
  for (const m of toMark) {
    const key = `${m.row},${m.col}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueMarks.push(m);
    }
  }

  return uniqueMarks;
}

/**
 * Intelligent Hint Generator using CSP deduction.
 */
export function generateHint(
  board: CellState[][],
  regions: number[][],
  solution: number[],
  size: number
): Hint | null {
  // Step 1: Detect if player placed a queen in a wrong cell
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'queen') {
        const correctCol = solution[r];
        if (c !== correctCol) {
          return {
            type: 'remove_queen',
            row: r,
            col: c,
            reason: `The Queen at Row ${r + 1}, Col ${c + 1} does not lead to a valid solution. Removing it will open new candidates.`,
          };
        }
      }
    }
  }

  // Step 2: Check for forced queen in a Row (only 1 valid candidate in the row)
  for (let r = 0; r < size; r++) {
    const validCols: number[] = [];
    let hasQueen = false;
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'queen') {
        hasQueen = true;
        break;
      }
      if (board[r][c] === 'empty') {
        validCols.push(c);
      }
    }
    if (!hasQueen && validCols.length === 1) {
      const c = validCols[0];
      return {
        type: 'queen',
        row: r,
        col: c,
        reason: `Row ${r + 1} has only one remaining valid cell. A Queen must be placed here.`,
      };
    }
  }

  // Step 3: Check for forced queen in a Column
  for (let c = 0; c < size; c++) {
    const validRows: number[] = [];
    let hasQueen = false;
    for (let r = 0; r < size; r++) {
      if (board[r][c] === 'queen') {
        hasQueen = true;
        break;
      }
      if (board[r][c] === 'empty') {
        validRows.push(r);
      }
    }
    if (!hasQueen && validRows.length === 1) {
      const r = validRows[0];
      return {
        type: 'queen',
        row: r,
        col: c,
        reason: `Column ${c + 1} has only one remaining cell. A Queen belongs here.`,
      };
    }
  }

  // Step 4: Check for forced queen in a Region
  for (let regId = 0; regId < size; regId++) {
    const regionCells: { r: number; c: number }[] = [];
    let hasQueen = false;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (regions[r][c] === regId) {
          if (board[r][c] === 'queen') {
            hasQueen = true;
            break;
          }
          if (board[r][c] === 'empty') {
            regionCells.push({ r, c });
          }
        }
      }
      if (hasQueen) break;
    }
    if (!hasQueen && regionCells.length === 1) {
      const cell = regionCells[0];
      return {
        type: 'queen',
        row: cell.r,
        col: cell.c,
        reason: `This colored region only has one open spot for its required Queen.`,
      };
    }
  }

  // Step 5: Suggest a target Queen from the solution that isn't placed yet
  for (let r = 0; r < size; r++) {
    const correctCol = solution[r];
    if (board[r][correctCol] !== 'queen') {
      return {
        type: 'queen',
        row: r,
        col: correctCol,
        reason: `Hint: Placing a Queen at Row ${r + 1}, Column ${correctCol + 1} satisfies all row, column, and region constraints.`,
      };
    }
  }

  return null;
}

