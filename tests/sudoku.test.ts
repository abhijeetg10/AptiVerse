import { describe, it, expect } from 'vitest';
import { 
  createInitialState, 
  getCandidates, 
  checkAnswer, 
  applyAnswer 
} from '../src/games/sudoku/engine';
import { generateGeoSudokuLevel } from '../src/games/sudoku/generator';
import type { GeoSudokuPuzzle, GeoSymbol } from '../src/games/sudoku/types';

describe('Geo Sudoku Engine & Latin Square Generator', () => {
  const samplePuzzle: GeoSudokuPuzzle = {
    id: 'sudoku_4x4',
    size: 4,
    symbols: ['circle', 'square', 'triangle', 'star'],
    board: [
      ['circle', 'square', 'triangle', 'star'],
      ['triangle', 'star', 'circle', 'square'],
      ['square', 'circle', 'star', 'triangle'],
      ['star', 'triangle', null, 'circle']
    ],
    target: { row: 3, col: 2 }
  };

  it('determines valid candidates strictly via row/column uniqueness', () => {
    // Row 3 has: star, triangle, circle -> missing: square
    // Col 2 has: triangle, circle, star -> missing: square
    const candidates = getCandidates(
      samplePuzzle.board, 
      samplePuzzle.target.row, 
      samplePuzzle.target.col, 
      samplePuzzle.symbols
    );
    expect(candidates).toEqual(['square']);
  });

  it('evaluates checkAnswer correctly', () => {
    expect(checkAnswer(samplePuzzle, 'square')).toBe(true);
    expect(checkAnswer(samplePuzzle, 'circle')).toBe(false);
  });

  it('transitions state upon applying correct symbol', () => {
    let state = createInitialState(samplePuzzle);
    state.activeCell = { row: 3, col: 2 };
    state = applyAnswer(state, 'square');
    expect(state.status).toBe('completed');
  });

  it('detects incorrect symbol and transitions to failed', () => {
    let state = createInitialState(samplePuzzle);
    state.activeCell = { row: 3, col: 2 };
    state = applyAnswer(state, 'circle');
    expect(state.status).toBe('failed');
  });

  it('generates valid GeoSudoku levels dynamically', () => {
    const puzzle = generateGeoSudokuLevel('gen_test_1', 4, 'medium');
    expect(puzzle.size).toBe(4);
    expect(puzzle.symbols.length).toBe(4);
    expect(puzzle.board.length).toBe(4);
    expect(puzzle.target).toBeDefined();

    // The target must have exactly 1 valid candidate
    const candidates = getCandidates(puzzle.board, puzzle.target.row, puzzle.target.col, puzzle.symbols);
    expect(candidates.length).toBe(1);
  });
});
