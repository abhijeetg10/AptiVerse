import type { Ball, Cell, Direction, GameState, MovableBlock, PuzzleDefinition } from "./types";

export function createInitialState(puzzle: PuzzleDefinition): GameState {
  return {
    id: puzzle.id,
    rows: puzzle.rows,
    cols: puzzle.cols,
    difficulty: puzzle.difficulty,
    ball: {
      id: "ball",
      type: "ball",
      row: puzzle.ball.row,
      col: puzzle.ball.col,
    },
    target: {
      type: "target",
      row: puzzle.target.row,
      col: puzzle.target.col,
    },
    blocks: puzzle.blocks.map(b => ({ ...b, type: "block" })),
    walls: (puzzle.walls || []).map(w => ({ ...w, type: "wall" })),
    moves: 0,
    optimalMoves: puzzle.optimalMoves,
    status: "playing"
  };
}

export function insideBoard(cell: Cell, rows: number, cols: number): boolean {
  return cell.row >= 0 && cell.row < rows && cell.col >= 0 && cell.col < cols;
}

export function getOccupiedCellsBlock(block: MovableBlock): Cell[] {
  const cells: Cell[] = [];
  const width = block.orientation === "horizontal" ? block.length : 1;
  const height = block.orientation === "vertical" ? block.length : 1;
  
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      cells.push({ row: block.row + r, col: block.col + c });
    }
  }
  return cells;
}

export function calculateNewPosition(cell: Cell, direction: Direction): Cell {
  switch (direction) {
    case "UP": return { row: cell.row - 1, col: cell.col };
    case "DOWN": return { row: cell.row + 1, col: cell.col };
    case "LEFT": return { row: cell.row, col: cell.col - 1 };
    case "RIGHT": return { row: cell.row, col: cell.col + 1 };
  }
}

export function checkCollisionRect(
  targetRow: number,
  targetCol: number,
  width: number,
  height: number,
  ignoreId: string | null,
  state: GameState,
  ignoreTarget = false // Unused now but kept for signature
): boolean {
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const cell = { row: targetRow + r, col: targetCol + c };
      
      // Board bounds
      if (!insideBoard(cell, state.rows, state.cols)) return true;

      // Check Ball
      if (ignoreId !== "ball") {
        if (cell.row === state.ball.row && cell.col === state.ball.col) return true;
      }

      // Check target hole (unless ball)
      // Blocks can slide over the hole because it's a recess in the floor!
      // No collision needed for target.

      // Check walls
      for (const w of state.walls) {
        if (cell.row === w.row && cell.col === w.col) return true;
      }

      // Check blocks
      for (const b of state.blocks) {
        if (b.id === ignoreId) continue;
        const bCells = getOccupiedCellsBlock(b);
        if (bCells.some(bc => bc.row === cell.row && bc.col === cell.col)) return true;
      }
    }
  }
  return false;
}

export function applyMove(state: GameState, entityId: string, direction: Direction, steps: number = 1): GameState {
  if (state.status !== "playing") return state;
  if (steps === 0) return state;

  const newState = {
    ...state,
    ball: { ...state.ball },
    blocks: state.blocks.map(b => ({ ...b }))
  };

  if (entityId === "ball") {
    let currentRow = newState.ball.row;
    let currentCol = newState.ball.col;
    let actualSteps = 0;

    for (let i = 0; i < steps; i++) {
      const next = calculateNewPosition({ row: currentRow, col: currentCol }, direction);
      if (checkCollisionRect(next.row, next.col, 1, 1, "ball", newState, false)) break;
      
      currentRow = next.row;
      currentCol = next.col;
      actualSteps++;
      
      if (currentRow === newState.target.row && currentCol === newState.target.col) break;
    }

    if (actualSteps > 0) {
      newState.ball.row = currentRow;
      newState.ball.col = currentCol;
      newState.moves += 1; // 1 move regardless of distance
    }
  } else {
    const blockIndex = newState.blocks.findIndex(b => b.id === entityId);
    if (blockIndex === -1) return state;
    
    const block = newState.blocks[blockIndex];
    
    // Validate orientation vs direction
    if (block.orientation === "horizontal" && (direction === "UP" || direction === "DOWN")) return state;
    if (block.orientation === "vertical" && (direction === "LEFT" || direction === "RIGHT")) return state;

    const width = block.orientation === "horizontal" ? block.length : 1;
    const height = block.orientation === "vertical" ? block.length : 1;

    let currentRow = block.row;
    let currentCol = block.col;
    let actualSteps = 0;

    for (let i = 0; i < steps; i++) {
      const next = calculateNewPosition({ row: currentRow, col: currentCol }, direction);
      if (checkCollisionRect(next.row, next.col, width, height, block.id, newState, false)) break;
      
      currentRow = next.row;
      currentCol = next.col;
      actualSteps++;
    }

    if (actualSteps > 0) {
      block.row = currentRow;
      block.col = currentCol;
      newState.moves += 1;
    }
  }

  // Check win condition
  if (newState.ball.row === newState.target.row && newState.ball.col === newState.target.col) {
    newState.status = "completed";
  }

  return newState;
}
