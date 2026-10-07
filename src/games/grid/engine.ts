import type { GridState, GridPuzzle } from './types';

export function createInitialState(puzzle: GridPuzzle): GridState {
  return {
    puzzle,
    phase: 'memorize',
    countdown: Math.max(3, puzzle.dotsCount), // 1 sec per dot, min 3
    userSelection: [],
    distractionPassed: null,
    result: null
  };
}

export function tickCountdown(state: GridState): GridState {
  if (state.phase !== 'memorize') return state;
  const newCountdown = state.countdown - 1;
  return {
    ...state,
    countdown: newCountdown,
    phase: newCountdown <= 0 ? 'distract' : 'memorize'
  };
}

export function submitDistraction(state: GridState, answer: boolean): GridState {
  if (state.phase !== 'distract') return state;
  const isCorrect = answer === state.puzzle.distraction.isTrue;
  return {
    ...state,
    distractionPassed: isCorrect,
    phase: 'recreate'
  };
}

export function toggleCell(state: GridState, index: number): GridState {
  if (state.phase !== 'recreate') return state;
  
  let newSelection = [...state.userSelection];
  if (newSelection.includes(index)) {
    newSelection = newSelection.filter(i => i !== index);
  } else {
    if (newSelection.length < state.puzzle.dotsCount) {
      newSelection.push(index);
    }
  }

  // Auto-submit if we reached the dot count
  if (newSelection.length === state.puzzle.dotsCount) {
    // Check if the sets match regardless of order
    let isCorrect = true;
    for (const val of state.puzzle.sequence) {
      if (!newSelection.includes(val)) {
        isCorrect = false;
        break;
      }
    }
    
    return {
      ...state,
      userSelection: newSelection,
      phase: 'result',
      result: isCorrect ? 'won' : 'lost'
    };
  }

  return {
    ...state,
    userSelection: newSelection
  };
}
