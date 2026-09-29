import type { GameState, MovableBlock, Cell, Direction } from './types';
import { checkCollisionRect, insideBoard, getOccupiedCellsBlock } from './engine';

interface Move {
  entityId: string;
  direction: Direction;
  steps: number;
}

interface StateNode {
  ball: Cell;
  blocks: Omit<MovableBlock, "type">[];
  path: Move[];
}

const serializeState = (blocks: Omit<MovableBlock, "type">[], ball: Cell): string => {
  return `${ball.row},${ball.col}|` + blocks.map(b => `${b.id}:${b.row},${b.col}`).join('|');
};

export const solveBoard = (state: GameState): Move[] | null => {
  const queue: StateNode[] = [{ 
    ball: { row: state.ball.row, col: state.ball.col }, 
    blocks: state.blocks, 
    path: [] 
  }];
  
  const visited = new Set<string>();
  visited.add(serializeState(state.blocks, state.ball));

  let iterations = 0;
  const maxIterations = 50000;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const current = queue.shift()!;

    if (current.ball.row === state.target.row && current.ball.col === state.target.col) {
      return current.path;
    }

    const stateObj: GameState = {
      ...state,
      ball: { ...state.ball, row: current.ball.row, col: current.ball.col },
      blocks: current.blocks as MovableBlock[]
    };

    // 1. Move blocks
    for (let i = 0; i < current.blocks.length; i++) {
      const block = current.blocks[i];
      const isHoriz = block.orientation === "horizontal";
      
      const width = isHoriz ? block.length : 1;
      const height = !isHoriz ? block.length : 1;
      
      // Try positive direction (RIGHT or DOWN)
      for (let steps = 1; steps < 6; steps++) {
        const dRow = isHoriz ? 0 : steps;
        const dCol = isHoriz ? steps : 0;
        
        // We only check the leading edge to be fast, but checkCollisionRect handles the whole block.
        // Actually, we must check every step along the way to ensure no jumping over objects!
        let collision = false;
        for(let s = 1; s <= steps; s++) {
             const tR = block.row + (isHoriz ? 0 : s);
             const tC = block.col + (isHoriz ? s : 0);
             if (checkCollisionRect(tR, tC, width, height, block.id, stateObj, false)) {
                 collision = true;
                 break;
             }
        }
        if (collision) break;

        const nextBlocks = current.blocks.map(b => ({ ...b }));
        nextBlocks[i].row = block.row + dRow;
        nextBlocks[i].col = block.col + dCol;

        const sStr = serializeState(nextBlocks, current.ball);
        if (!visited.has(sStr)) {
          visited.add(sStr);
          queue.push({ 
            blocks: nextBlocks, 
            ball: current.ball, 
            path: [...current.path, { entityId: block.id, direction: isHoriz ? "RIGHT" : "DOWN", steps }] 
          });
        }
      }

      // Try negative direction (LEFT or UP)
      for (let steps = 1; steps < 6; steps++) {
        const dRow = isHoriz ? 0 : -steps;
        const dCol = isHoriz ? -steps : 0;
        
        let collision = false;
        for(let s = 1; s <= steps; s++) {
             const tR = block.row - (isHoriz ? 0 : s);
             const tC = block.col - (isHoriz ? s : 0);
             if (checkCollisionRect(tR, tC, width, height, block.id, stateObj, false)) {
                 collision = true;
                 break;
             }
        }
        if (collision) break;

        const nextBlocks = current.blocks.map(b => ({ ...b }));
        nextBlocks[i].row = block.row + dRow;
        nextBlocks[i].col = block.col + dCol;

        const sStr = serializeState(nextBlocks, current.ball);
        if (!visited.has(sStr)) {
          visited.add(sStr);
          queue.push({ 
            blocks: nextBlocks, 
            ball: current.ball, 
            path: [...current.path, { entityId: block.id, direction: isHoriz ? "LEFT" : "UP", steps }] 
          });
        }
      }
    }

    // 2. Move ball
    const ballMoves: { dir: Direction, r: number, c: number }[] = [
      { dir: "UP", r: -1, c: 0 }, { dir: "DOWN", r: 1, c: 0 },
      { dir: "LEFT", r: 0, c: -1 }, { dir: "RIGHT", r: 0, c: 1 }
    ];

    for (const bm of ballMoves) {
      for (let steps = 1; steps < 6; steps++) {
        const dRow = bm.r * steps;
        const dCol = bm.c * steps;
        
        let collision = false;
        for(let s = 1; s <= steps; s++) {
             const tR = current.ball.row + bm.r * s;
             const tC = current.ball.col + bm.c * s;
             if (checkCollisionRect(tR, tC, 1, 1, "ball", stateObj, false)) {
                 collision = true;
                 break;
             }
        }
        if (collision) break;
        
        const nextBall = { row: current.ball.row + dRow, col: current.ball.col + dCol };
        const sStr = serializeState(current.blocks, nextBall);
        if (!visited.has(sStr)) {
          visited.add(sStr);
          queue.push({ 
            blocks: current.blocks, 
            ball: nextBall, 
            path: [...current.path, { entityId: "ball", direction: bm.dir, steps }] 
          });
        }
      }
    }
  }

  return null; // Unsolvable or exceeded max iterations
};
