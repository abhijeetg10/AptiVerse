import type { GeoSudokuPuzzle, GeoSudokuState, GeoSymbol } from './types';

export function createInitialState(puzzle: GeoSudokuPuzzle): GeoSudokuState {
  return {
    puzzle,
    status: "playing",
    selectedSymbol: null,
    moves: 0,
    activeCell: puzzle.target, // Default to target
    userFills: {}
  };
}

export function getCandidates(board: (GeoSymbol | null)[][], row: number, col: number, symbols: GeoSymbol[]): GeoSymbol[] {
  const used = new Set<GeoSymbol>();
  
  for (const item of board[row]) {
    if (item) used.add(item);
  }
  
  for (let r = 0; r < board.length; r++) {
    if (board[r][col]) used.add(board[r][col] as GeoSymbol);
  }
  
  return symbols.filter(s => !used.has(s));
}

export function checkAnswer(puzzle: GeoSudokuPuzzle, answer: GeoSymbol): boolean {
  const candidates = getCandidates(puzzle.board, puzzle.target.row, puzzle.target.col, puzzle.symbols);
  return candidates.length === 1 && candidates[0] === answer;
}

export function setActiveCell(state: GeoSudokuState, row: number, col: number): GeoSudokuState {
  if (state.status !== "playing") return state;
  return { ...state, activeCell: { row, col } };
}

export function clearCell(state: GeoSudokuState, row: number, col: number): GeoSudokuState {
  if (state.status !== "playing") return state;
  const key = `${row}-${col}`;
  const newFills = { ...state.userFills };
  delete newFills[key];
  return { ...state, userFills: newFills };
}

export function applyAnswer(state: GeoSudokuState, answer: GeoSymbol): GeoSudokuState {
  if (state.status !== "playing" || !state.activeCell) return state;
  
  const isTarget = state.activeCell.row === state.puzzle.target.row && state.activeCell.col === state.puzzle.target.col;
  
  if (isTarget) {
    const isCorrect = checkAnswer(state.puzzle, answer);
    return {
      ...state,
      moves: state.moves + 1,
      status: isCorrect ? "completed" : "failed",
      selectedSymbol: answer
    };
  } else {
    // Fill a working step cell
    const key = `${state.activeCell.row}-${state.activeCell.col}`;
    return {
      ...state,
      userFills: {
        ...state.userFills,
        [key]: answer
      }
    };
  }
}
