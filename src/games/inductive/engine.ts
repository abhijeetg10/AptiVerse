import type { InductivePuzzle, InductiveState } from './types';

export function createInitialState(puzzle: InductivePuzzle): InductiveState {
  return {
    puzzle,
    status: "playing",
    selectedIndices: []
  };
}

export function toggleSelection(state: InductiveState, index: number): InductiveState {
  if (state.status !== "playing") return state;
  
  let newSelected = [...state.selectedIndices];
  if (newSelected.includes(index)) {
    newSelected = newSelected.filter(i => i !== index);
  } else {
    if (newSelected.length >= 2) return state; // Max 2 selections
    newSelected.push(index);
  }
  
  return { ...state, selectedIndices: newSelected };
}

export function submitAnswer(state: InductiveState): InductiveState {
  if (state.status !== "playing" || state.selectedIndices.length !== 2) return state;
  
  const correct = [...state.puzzle.correctOptionIndices].sort();
  const selected = [...state.selectedIndices].sort();
  
  const isCorrect = correct[0] === selected[0] && correct[1] === selected[1];
  
  return {
    ...state,
    status: isCorrect ? "completed" : "failed"
  };
}
