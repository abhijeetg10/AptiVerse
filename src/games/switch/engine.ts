import type { SwitchSymbol, Permutation, SwitchPuzzle, SwitchState } from './types';

export function createInitialState(puzzle: SwitchPuzzle): SwitchState {
  return { puzzle, status: "playing", selectedChoice: null };
}

export function applyPermutation<T>(input: T[], perm: Permutation): T[] {
  return perm.map(index => input[index - 1]);
}

export function checkAnswer(puzzle: SwitchPuzzle, choiceIndex: number): boolean {
  return choiceIndex === puzzle.correctChoiceIndex;
}

export function submitAnswer(state: SwitchState, choiceIndex: number): SwitchState {
  if (state.status !== "playing") return state;
  const isCorrect = checkAnswer(state.puzzle, choiceIndex);
  return {
    ...state,
    selectedChoice: choiceIndex,
    status: isCorrect ? "completed" : "failed"
  };
}
