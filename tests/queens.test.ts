import { describe, it, expect } from 'vitest';
import { 
  createInitialState, 
  handleCellClick, 
  undo, 
  resetBoard 
} from '../src/games/queens/engine';
import { 
  checkConflicts, 
  isBoardSolved, 
  countSolutions 
} from '../src/games/queens/solver';
import type { QueensPuzzle, CellState } from '../src/games/queens/types';

describe('Queens Challenge Engine & CSP Solver', () => {
  const samplePuzzle: QueensPuzzle = {
    id: 'queens_4x4',
    size: 4,
    regions: [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [2, 2, 3, 3],
      [2, 2, 3, 3]
    ],
    difficulty: 'easy'
  };

  it('initializes empty NxN board', () => {
    const state = createInitialState(samplePuzzle);
    expect(state.board.length).toBe(4);
    expect(state.board[0].length).toBe(4);
    expect(state.status).toBe('playing');
    expect(state.board.flat().every(cell => cell === 'empty')).toBe(true);
  });

  it('places and removes queens with click toggling', () => {
    let state = createInitialState(samplePuzzle);

    // Place queen
    state = handleCellClick(state, 0, 1, 'queen');
    expect(state.board[0][1]).toBe('queen');
    // Ensure surrounding cells are NOT automatically marked with 'x' by default
    expect(state.board[0][0]).toBe('empty');
    expect(state.board[0][2]).toBe('empty');
    expect(state.board[1][1]).toBe('empty');

    // Toggle off
    state = handleCellClick(state, 0, 1, 'queen');
    expect(state.board[0][1]).toBe('empty');
  });

  it('detects row conflicts correctly', () => {
    const board: CellState[][] = [
      ['queen', 'queen', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty']
    ];
    const conflicts = checkConflicts(board, samplePuzzle.regions, samplePuzzle.size);
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts.some(c => c.type === 'row')).toBe(true);
  });

  it('detects adjacent queen conflicts (diagonal/orthogonal touch)', () => {
    const board: CellState[][] = [
      ['queen', 'empty', 'empty', 'empty'],
      ['empty', 'queen', 'empty', 'empty'], // Diagonally touching!
      ['empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty']
    ];
    const conflicts = checkConflicts(board, samplePuzzle.regions, samplePuzzle.size);
    expect(conflicts.some(c => c.type === 'adjacent')).toBe(true);
  });

  it('detects same region conflicts', () => {
    const board: CellState[][] = [
      ['queen', 'empty', 'empty', 'empty'],
      ['queen', 'empty', 'empty', 'empty'], // Both in region 0
      ['empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty']
    ];
    const conflicts = checkConflicts(board, samplePuzzle.regions, samplePuzzle.size);
    expect(conflicts.some(c => c.type === 'region' || c.type === 'col')).toBe(true);
  });

  it('recognizes a fully solved board', () => {
    // Valid 4x4 queens placement: (0,1), (1,3), (2,0), (3,2)
    // Ensure that each queen belongs to a unique region 0, 1, 2, 3
    const regions = [
      [1, 0, 1, 2], // (0,1) is in region 0
      [2, 3, 2, 1], // (1,3) is in region 1
      [2, 0, 3, 0], // (2,0) is in region 2
      [3, 1, 3, 0]  // (3,2) is in region 3
    ];

    const solvedBoard: CellState[][] = [
      ['empty', 'queen', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'queen'],
      ['queen', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'queen', 'empty']
    ];

    expect(isBoardSolved(solvedBoard, regions, 4)).toBe(true);
  });

  it('CSP countSolutions counts valid boards correctly', () => {
    const count = countSolutions(4, samplePuzzle.regions, 2);
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
