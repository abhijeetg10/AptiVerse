import { describe, it, expect } from 'vitest';
import { 
  createInitialState, 
  applyMove, 
  checkCollisionRect, 
  insideBoard, 
  getOccupiedCellsBlock 
} from '../src/games/motion/engine';
import { solveBoard } from '../src/games/motion/solver';
import type { PuzzleDefinition } from '../src/games/motion/types';

describe('Motion Challenge Engine & Solver', () => {
  const samplePuzzle: PuzzleDefinition = {
    id: 'test_puzzle_1',
    rows: 6,
    cols: 6,
    ball: { row: 2, col: 4 },
    target: { row: 0, col: 1 },
    blocks: [
      { id: 'b1', row: 0, col: 0, length: 3, orientation: 'vertical', color: 'orange' },
      { id: 'b2', row: 1, col: 1, length: 2, orientation: 'vertical', color: 'blue' },
      { id: 'b3', row: 1, col: 2, length: 2, orientation: 'horizontal', color: 'green' }
    ],
    walls: [],
    optimalMoves: 5
  };

  it('correctly initializes game state', () => {
    const state = createInitialState(samplePuzzle);
    expect(state.status).toBe('playing');
    expect(state.moves).toBe(0);
    expect(state.ball.row).toBe(2);
    expect(state.ball.col).toBe(4);
    expect(state.blocks.length).toBe(3);
  });

  it('enforces insideBoard boundary conditions', () => {
    expect(insideBoard({ row: 0, col: 0 }, 6, 6)).toBe(true);
    expect(insideBoard({ row: 5, col: 5 }, 6, 6)).toBe(true);
    expect(insideBoard({ row: -1, col: 0 }, 6, 6)).toBe(false);
    expect(insideBoard({ row: 0, col: 6 }, 6, 6)).toBe(false);
  });

  it('correctly calculates occupied cells for blocks', () => {
    const vBlock = { id: 'v1', row: 1, col: 2, length: 3, orientation: 'vertical' as const, type: 'block' as const };
    const hBlock = { id: 'h1', row: 4, col: 1, length: 2, orientation: 'horizontal' as const, type: 'block' as const };

    const vCells = getOccupiedCellsBlock(vBlock);
    expect(vCells).toEqual([
      { row: 1, col: 2 },
      { row: 2, col: 2 },
      { row: 3, col: 2 }
    ]);

    const hCells = getOccupiedCellsBlock(hBlock);
    expect(hCells).toEqual([
      { row: 4, col: 1 },
      { row: 4, col: 2 }
    ]);
  });

  it('enforces directional constraints on horizontal and vertical blocks', () => {
    const state = createInitialState(samplePuzzle);

    // b1 is vertical: moving right/left should be rejected
    const invalidMoveH = applyMove(state, 'b1', 'right', 1);
    expect(invalidMoveH.moves).toBe(state.moves); // Move count remains 0
    expect(invalidMoveH.blocks.find(b => b.id === 'b1')?.col).toBe(0);

    // b3 is horizontal: moving up/down should be rejected
    const invalidMoveV = applyMove(state, 'b3', 'up', 1);
    expect(invalidMoveV.moves).toBe(state.moves);
    expect(invalidMoveV.blocks.find(b => b.id === 'b3')?.row).toBe(1);
  });

  it('successfully reaches target and transitions to completed status', () => {
    const goalState = createInitialState({
      id: 'simple_goal',
      rows: 4,
      cols: 4,
      ball: { row: 1, col: 1 },
      target: { row: 0, col: 1 },
      blocks: [],
      walls: []
    });

    const nextState = applyMove(goalState, 'ball', 'up', 1);
    expect(nextState.ball.row).toBe(0);
    expect(nextState.ball.col).toBe(1);
    expect(nextState.status).toBe('completed');
  });

  it('BFS solver terminates and finds solution path', () => {
    const solvableBoard = createInitialState({
      id: 'solver_test',
      rows: 4,
      cols: 4,
      ball: { row: 2, col: 1 },
      target: { row: 0, col: 1 },
      blocks: [
        { id: 'b1', row: 1, col: 1, length: 2, orientation: 'horizontal', color: 'blue' }
      ],
      walls: []
    });

    const solution = solveBoard(solvableBoard);
    expect(solution).not.toBeNull();
    expect(Array.isArray(solution)).toBe(true);
    expect(solution!.length).toBeGreaterThan(0);
  });
});
