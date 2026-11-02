import { describe, it, expect } from 'vitest';
import { 
  createInitialState, 
  tickCountdown, 
  submitDistraction, 
  toggleCell 
} from '../src/games/grid/engine';
import type { GridPuzzle } from '../src/games/grid/types';

describe('Grid Memory Dual-Task Engine', () => {
  const samplePuzzle: GridPuzzle = {
    id: 'grid_p1',
    dotsCount: 4,
    sequence: [2, 7, 12, 17],
    distraction: {
      type: 'symmetry',
      grid1: [true, false, false, true],
      grid2: [true, false, false, true],
      isTrue: true
    }
  };

  it('initializes in memorize phase with correct countdown', () => {
    const state = createInitialState(samplePuzzle);
    expect(state.phase).toBe('memorize');
    expect(state.countdown).toBe(4);
    expect(state.userSelection).toEqual([]);
  });

  it('ticks countdown down and transitions to distract phase at 0', () => {
    let state = createInitialState(samplePuzzle);
    state = tickCountdown(state);
    expect(state.countdown).toBe(3);
    expect(state.phase).toBe('memorize');

    // Run until 0
    state = tickCountdown(state);
    state = tickCountdown(state);
    state = tickCountdown(state);
    expect(state.countdown).toBe(0);
    expect(state.phase).toBe('distract');
  });

  it('evaluates distraction task correctly and advances to recreate phase', () => {
    let state = createInitialState(samplePuzzle);
    state.phase = 'distract';

    state = submitDistraction(state, true);
    expect(state.distractionPassed).toBe(true);
    expect(state.phase).toBe('recreate');
  });

  it('handles recreation selection and validates exact match regardless of order', () => {
    let state = createInitialState(samplePuzzle);
    state.phase = 'recreate';

    // Select in reversed order: 17, 12, 7, 2
    state = toggleCell(state, 17);
    state = toggleCell(state, 12);
    state = toggleCell(state, 7);
    state = toggleCell(state, 2);

    expect(state.phase).toBe('result');
    expect(state.result).toBe('won');
  });

  it('fails recreation if wrong cells are chosen', () => {
    let state = createInitialState(samplePuzzle);
    state.phase = 'recreate';

    state = toggleCell(state, 0); // wrong
    state = toggleCell(state, 1); // wrong
    state = toggleCell(state, 2); // right
    state = toggleCell(state, 3); // wrong

    expect(state.phase).toBe('result');
    expect(state.result).toBe('lost');
  });
});

