import { describe, it, expect } from 'vitest';
import { 
  createInitialState as createSwitchState, 
  applyPermutation, 
  checkAnswer as checkSwitchAnswer, 
  submitAnswer as submitSwitchAnswer 
} from '../src/games/switch/engine';
import { 
  createInitialState as createInductiveState, 
  toggleSelection as toggleInductiveSelection, 
  submitAnswer as submitInductiveAnswer 
} from '../src/games/inductive/engine';
import type { SwitchPuzzle } from '../src/games/switch/types';
import type { InductivePuzzle } from '../src/games/inductive/types';

describe('Switch Challenge Engine', () => {
  const sampleSwitchPuzzle: SwitchPuzzle = {
    id: 'switch_1',
    initialState: ['circle', 'square', 'triangle', 'star'],
    targetState: ['square', 'circle', 'star', 'triangle'],
    choices: [
      { id: 'c0', operators: ['op1'] },
      { id: 'c1', operators: ['op2'] },
      { id: 'c2', operators: ['op3'] }
    ],
    correctChoiceIndex: 1
  };

  it('correctly maps 1-based permutations', () => {
    const input = ['A', 'B', 'C', 'D'];
    const perm = [2, 1, 4, 3]; // Swap 1 & 2, Swap 3 & 4
    const result = applyPermutation(input, perm);
    expect(result).toEqual(['B', 'A', 'D', 'C']);
  });

  it('validates switch answer choice', () => {
    expect(checkSwitchAnswer(sampleSwitchPuzzle, 1)).toBe(true);
    expect(checkSwitchAnswer(sampleSwitchPuzzle, 0)).toBe(false);
  });

  it('submits switch answer and updates status', () => {
    let state = createSwitchState(sampleSwitchPuzzle);
    state = submitSwitchAnswer(state, 1);
    expect(state.status).toBe('completed');
  });
});

describe('Inductive Challenge Engine', () => {
  const sampleInductivePuzzle: InductivePuzzle = {
    id: 'ind_1',
    ruleName: 'Corner Matching',
    examples: [
      ['yc', 'rs', 'yc', 'gt', 'bp', 'gt', 'yc', 'rs', 'yc'],
      ['yc', 'bp', 'yc', 'rs', 'gt', 'rs', 'yc', 'bp', 'yc']
    ],
    options: [
      ['yc', 'gt', 'yc', 'bp', 'rs', 'bp', 'yc', 'gt', 'yc'], // Option 0: satisfies rule
      ['rs', 'gt', 'yc', 'bp', 'rs', 'bp', 'yc', 'gt', 'yc'], // Option 1: violates
      ['gt', 'gt', 'gt', 'bp', 'rs', 'bp', 'gt', 'gt', 'gt'], // Option 2: violates
      ['yc', 'bp', 'yc', 'gt', 'gt', 'gt', 'yc', 'bp', 'yc']  // Option 3: satisfies rule
    ],
    correctOptionIndices: [0, 3]
  };

  it('initializes playing state with no cards selected', () => {
    const state = createInductiveState(sampleInductivePuzzle);
    expect(state.status).toBe('playing');
    expect(state.selectedIndices).toEqual([]);
  });

  it('toggles selection and caps at 2 selections max', () => {
    let state = createInductiveState(sampleInductivePuzzle);
    state = toggleInductiveSelection(state, 0);
    state = toggleInductiveSelection(state, 2);
    expect(state.selectedIndices).toEqual([0, 2]);

    // Attempting a third selection should be rejected
    state = toggleInductiveSelection(state, 3);
    expect(state.selectedIndices).toEqual([0, 2]);

    // Unselecting 2
    state = toggleInductiveSelection(state, 2);
    expect(state.selectedIndices).toEqual([0]);
  });

  it('submits correct pair and marks completed', () => {
    let state = createInductiveState(sampleInductivePuzzle);
    state = toggleInductiveSelection(state, 3);
    state = toggleInductiveSelection(state, 0);

    state = submitInductiveAnswer(state);
    expect(state.status).toBe('completed');
  });

  it('submits wrong pair and marks failed', () => {
    let state = createInductiveState(sampleInductivePuzzle);
    state = toggleInductiveSelection(state, 1);
    state = toggleInductiveSelection(state, 0);

    state = submitInductiveAnswer(state);
    expect(state.status).toBe('failed');
  });
});
