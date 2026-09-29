import type { RCPuzzle, RCState, RCAnswer } from './types';

export function createInitialState(puzzle: RCPuzzle): RCState {
  return {
    puzzle,
    currentQuestionIndex: 0,
    status: "playing",
    score: 0,
    answers: {}
  };
}

export function submitAnswer(state: RCState, answer: RCAnswer): RCState {
  if (state.status !== "playing") return state;

  const currentQ = state.puzzle.questions[state.currentQuestionIndex];
  const isCorrect = answer === currentQ.correctAnswer;
  
  const newAnswers = { ...state.answers, [currentQ.id]: answer };
  const newScore = isCorrect ? state.score + 1 : state.score;
  
  const isLastQuestion = state.currentQuestionIndex >= state.puzzle.questions.length - 1;

  return {
    ...state,
    answers: newAnswers,
    score: newScore,
    currentQuestionIndex: isLastQuestion ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
    status: isLastQuestion ? "completed" : "playing"
  };
}
