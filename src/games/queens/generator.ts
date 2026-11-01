import type { QueensPuzzle, Difficulty } from './types';
import { countSolutions } from './solver';
import { getPresetPuzzle } from './puzzles';
import { createSeededRandom } from '../../utils/puzzlePool';

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { size: number; label: string; baseScore: number; targetTimeSecs: number }
> = {
  beginner: { size: 6, label: 'Beginner (6×6)', baseScore: 500, targetTimeSecs: 90 },
  easy: { size: 7, label: 'Easy (7×7)', baseScore: 750, targetTimeSecs: 150 },
  medium: { size: 8, label: 'Medium (8×8)', baseScore: 1000, targetTimeSecs: 240 },
  hard: { size: 9, label: 'Hard (9×9)', baseScore: 1500, targetTimeSecs: 360 },
  expert: { size: 10, label: 'Expert (10×10)', baseScore: 2000, targetTimeSecs: 480 },
};

/**
 * Checks whether all cells belonging to a region are orthogonally connected via BFS.
 */
function isRegionConnected(
  grid: number[][],
  size: number,
  regId: number
): boolean {
  const cells: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === regId) cells.push([r, c]);
    }
  }
  if (cells.length === 0) return false;

  const dirs: [number, number][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const visited = new Set<string>();
  const queue: [number, number][] = [cells[0]];
  visited.add(`${cells[0][0]},${cells[0][1]}`);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === regId) {
        const key = `${nr},${nc}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  }

  return visited.size === cells.length;
}

/**
 * Attempts to generate a procedural Queens puzzle with guaranteed 100% unique solution.
 */
function tryGenerateUniquePuzzle(
  size: number,
  difficulty: Difficulty,
  rng: () => number,
  maxTries: number = 80
): QueensPuzzle | null {
  const dirs: [number, number][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  for (let attempt = 0; attempt < maxTries; attempt++) {
    // 1. Backtracking search for a valid Queen placement
    const perm = Array.from({ length: size }, (_, i) => i);
    function findQueens(r: number, current: number[]): number[] | null {
      if (r === size) return current;
      // Seeded shuffle of columns
      const shuffled = perm
        .map((val) => ({ val, sort: rng() }))
        .sort((a, b) => a.sort - b.sort)
        .map((o) => o.val);

      for (const c of shuffled) {
        if (current.includes(c)) continue;
        // Non-adjacent row check
        if (r > 0 && Math.abs(current[r - 1] - c) <= 1) continue;

        current.push(c);
        const res = findQueens(r + 1, current);
        if (res) return res;
        current.pop();
      }
      return null;
    }

    const queens = findQueens(0, []);
    if (!queens) continue;

    // 2. Initialize regions with 1 Queen cell per region
    const grid: number[][] = Array.from({ length: size }, () =>
      Array(size).fill(-1)
    );
    for (let r = 0; r < size; r++) {
      grid[r][queens[r]] = r;
    }

    // 3. Multi-source growth
    let unassigned = size * size - size;
    let growthSteps = 0;
    const maxGrowthSteps = size * size * 8;

    while (unassigned > 0 && growthSteps < maxGrowthSteps) {
      growthSteps++;
      let progress = false;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === -1) {
            const adj: number[] = [];
            for (const [dr, dc] of dirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (
                nr >= 0 &&
                nr < size &&
                nc >= 0 &&
                nc < size &&
                grid[nr][nc] !== -1
              ) {
                adj.push(grid[nr][nc]);
              }
            }
            if (adj.length > 0 && rng() < 0.75) {
              grid[r][c] = adj[Math.floor(rng() * adj.length)];
              unassigned--;
              progress = true;
            }
          }
        }
      }
      if (!progress) {
        // Fallback fill any remaining unassigned cells
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c] === -1) {
              for (const [dr, dc] of dirs) {
                const nr = r + dr;
                const nc = c + dc;
                if (
                  nr >= 0 &&
                  nr < size &&
                  nc >= 0 &&
                  nc < size &&
                  grid[nr][nc] !== -1
                ) {
                  grid[r][c] = grid[nr][nc];
                  unassigned--;
                  break;
                }
              }
            }
          }
        }
      }
    }

    // 4. Verify connectivity for all regions
    let allConnected = true;
    for (let reg = 0; reg < size; reg++) {
      if (!isRegionConnected(grid, size, reg)) {
        allConnected = false;
        break;
      }
    }
    if (!allConnected) continue;

    // 5. Verify solution uniqueness: MUST be exactly 1 solution
    const solutionsCount = countSolutions(size, grid, 2);
    if (solutionsCount === 1) {
      return {
        id: `queens_proc_${difficulty}_${Date.now()}_${attempt}`,
        size,
        difficulty,
        regions: grid,
        solution: queens,
      };
    }
  }

  return null;
}

/**
 * Generates or fetches a Queens puzzle for a given difficulty and seed.
 * Always guarantees:
 * 1. Exactly 1 solution.
 * 2. 100% connected, non-empty regions.
 * 3. Fast non-blocking execution.
 */
export function generateQueensPuzzle(
  difficulty: Difficulty,
  seed?: number
): QueensPuzzle {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.beginner;
  const safeSeed = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const rng = createSeededRandom(safeSeed);

  // Set retry budget based on size
  const maxTries = config.size <= 8 ? 60 : config.size === 9 ? 80 : 120;
  const generated = tryGenerateUniquePuzzle(config.size, difficulty, rng, maxTries);

  if (generated) {
    return generated;
  }

  // Guaranteed fallback to verified preset
  return getPresetPuzzle(difficulty, safeSeed);
}

