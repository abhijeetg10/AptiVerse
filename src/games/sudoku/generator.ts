import type { GeoSudokuPuzzle, GeoSymbol } from './types';
import { getCandidates } from './engine';

const ALL_SYMBOLS: GeoSymbol[] = ["circle", "triangle", "square", "star", "hexagon", "pentagon", "diamond", "cross"];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateLatinSquare(size: number, symbols: GeoSymbol[]): (GeoSymbol | null)[][] {
  const board: (GeoSymbol | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

  function solve(row: number, col: number): boolean {
    if (row === size) return true;
    if (col === size) return solve(row + 1, 0);

    const candidates = shuffle(getCandidates(board, row, col, symbols));
    for (const c of candidates) {
      board[row][col] = c;
      if (solve(row, col + 1)) return true;
      board[row][col] = null;
    }
    return false;
  }

  solve(0, 0);
  return board;
}

export function generateGeoSudokuLevel(id: string, size: number, difficulty: "easy" | "medium" | "hard"): GeoSudokuPuzzle {
  const symbols = ALL_SYMBOLS.slice(0, size);
  const fullBoard = generateLatinSquare(size, symbols);
  
  // Pick target
  const targetRow = Math.floor(Math.random() * size);
  const targetCol = Math.floor(Math.random() * size);
  const targetSymbol = fullBoard[targetRow][targetCol]!;

  // Copy board
  const board = fullBoard.map(row => [...row]);
  
  // Remove the target
  board[targetRow][targetCol] = null;

  // We want to hide cells as long as target has exactly 1 candidate.
  // The number of cells to hide depends on difficulty, but we must ensure target is solvable.
  const cellsToHide = difficulty === "easy" ? size * 1 : difficulty === "medium" ? size * 2 : size * 3;
  
  const positions = shuffle(
    Array.from({ length: size * size }, (_, i) => ({ r: Math.floor(i / size), c: i % size }))
      .filter(p => p.r !== targetRow || p.c !== targetCol)
  );

  let hiddenCount = 0;
  for (const pos of positions) {
    if (hiddenCount >= cellsToHide) break;
    
    const original = board[pos.r][pos.c];
    board[pos.r][pos.c] = null;
    
    // Check if target is still solvable (exactly 1 candidate)
    const candidates = getCandidates(board, targetRow, targetCol, symbols);
    if (candidates.length !== 1) {
      // Revert if it becomes ambiguous
      board[pos.r][pos.c] = original;
    } else {
      hiddenCount++;
    }
  }

  return {
    id,
    size,
    symbols,
    board,
    target: { row: targetRow, col: targetCol },
    difficulty
  };
}
