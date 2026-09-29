import fs from 'fs';
import path from 'path';
import { solveBoard } from '../src/games/motion/solver';
import { checkCollisionRect } from '../src/games/motion/engine';
import type { GameState, MovableBlock, Cell } from '../src/games/motion/types';

const generateRushHourBoard = (rows: number, cols: number, id: string) => {
  let attempt = 0;
  while (attempt < 1000) {
    attempt++;
    const ballRow = Math.floor(Math.random() * rows);
    const ballCol = Math.floor(Math.random() * cols);
    let targetRow = Math.floor(Math.random() * rows);
    let targetCol = Math.floor(Math.random() * cols);
    
    // Ensure ball and target are somewhat apart
    while (Math.abs(ballRow - targetRow) + Math.abs(ballCol - targetCol) < 3) {
        targetRow = Math.floor(Math.random() * rows);
        targetCol = Math.floor(Math.random() * cols);
    }

    const state: GameState = {
      id, rows, cols, difficulty: "hard",
      ball: { id: "ball", type: "ball", row: ballRow, col: ballCol },
      target: { id: "target", type: "target", row: targetRow, col: targetCol },
      blocks: [], walls: [], moves: 0, optimalMoves: 0, status: "playing"
    };

    // Add 1-2 walls
    const numWalls = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numWalls; i++) {
        let wr = Math.floor(Math.random() * rows);
        let wc = Math.floor(Math.random() * cols);
        if ((wr === ballRow && wc === ballCol) || (wr === targetRow && wc === targetCol)) continue;
        state.walls.push({ type: "wall", row: wr, col: wc, id: `w${i}` } as any);
    }

    // Add blocks
    const numBlocks = 6 + Math.floor(Math.random() * 4); // 6 to 9 blocks
    const colors = ['blue', 'yellow', 'purple', 'green', 'teal', 'indigo', 'orange'];
    
    for (let i = 0; i < numBlocks; i++) {
        let placed = false;
        for (let tries = 0; tries < 20; tries++) {
            const isHoriz = Math.random() > 0.5;
            const length = Math.random() > 0.7 ? 3 : 2;
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            
            const w = isHoriz ? length : 1;
            const h = !isHoriz ? length : 1;
            
            if (!checkCollisionRect(r, c, w, h, null, state, true)) {
                state.blocks.push({
                    type: "block",
                    id: `b${i}`,
                    orientation: isHoriz ? "horizontal" : "vertical",
                    length,
                    row: r,
                    col: c,
                    color: colors[i % colors.length]
                });
                placed = true;
                break;
            }
        }
    }

    const solution = solveBoard(state);
    
    // Check if the solution involves moving blocks (at least 3 blocks moved?)
    if (solution && solution.length >= 8) {
        // Find how many unique blocks are moved
        const uniqueBlocks = new Set(solution.map(m => m.entityId));
        if (uniqueBlocks.size >= 4) {
             return {
                id, rows, cols, difficulty: solution.length > 12 ? "very-hard" : "hard",
                ball: { row: ballRow, col: ballCol },
                target: { row: targetRow, col: targetCol },
                walls: state.walls.map(w => ({ row: w.row, col: w.col })),
                blocks: state.blocks.map(b => ({
                    id: b.id, orientation: b.orientation, length: b.length, row: b.row, col: b.col, color: b.color
                })),
                optimalMoves: solution.length
            };
        }
    }
  }
  return null;
};

const generateStaticLevels = () => {
  const levels = [];
  console.log("Generating 17 hard static levels for Motion Challenge...");
  
  for (let i = 1; i <= 17; i++) {
    console.log(`Generating level ${i}...`);
    const id = `motion_gen_${i.toString().padStart(2, '0')}`;
    let level = null;
    while (!level) {
        level = generateRushHourBoard(6, 6, id);
    }
    levels.push(level);
  }

  const outputPath = path.resolve(process.cwd(), 'src/games/motion/staticLevels.ts');
  
  // We can just statically inject the hand crafted ones
  const fileContent = `// Auto-generated 1D-sliding hard puzzles
import type { PuzzleDefinition } from './types';

export const staticLevels: PuzzleDefinition[] = [
  {
    "id": "motion_h_01",
    "difficulty": "hard",
    "rows": 6,
    "cols": 6,
    "ball": { "row": 2, "col": 4 },
    "target": { "row": 0, "col": 1 },
    "walls": [
      { "row": 0, "col": 3 },
      { "row": 0, "col": 5 }
    ],
    "blocks": [
      { "id": "A", "orientation": "vertical",   "length": 2, "row": 1, "col": 1 },
      { "id": "B", "orientation": "horizontal", "length": 2, "row": 4, "col": 2 },
      { "id": "C", "orientation": "vertical",   "length": 2, "row": 4, "col": 0 },
      { "id": "D", "orientation": "horizontal", "length": 3, "row": 1, "col": 2 },
      { "id": "E", "orientation": "horizontal", "length": 3, "row": 3, "col": 0 },
      { "id": "F", "orientation": "horizontal", "length": 2, "row": 2, "col": 2 },
      { "id": "G", "orientation": "vertical",   "length": 3, "row": 0, "col": 0 },
      { "id": "H", "orientation": "vertical",   "length": 3, "row": 2, "col": 5 },
      { "id": "I", "orientation": "vertical",   "length": 2, "row": 3, "col": 4 }
    ],
    "optimalMoves": 10
  },
  {
    "id": "motion_vh_01",
    "difficulty": "very-hard",
    "rows": 6,
    "cols": 6,
    "ball": { "row": 5, "col": 0 },
    "target": { "row": 0, "col": 5 },
    "walls": [
      { "row": 0, "col": 3 }
    ],
    "blocks": [
      { "id": "A", "orientation": "horizontal", "length": 2, "row": 1, "col": 1 },
      { "id": "B", "orientation": "vertical",   "length": 3, "row": 1, "col": 4 },
      { "id": "C", "orientation": "vertical",   "length": 2, "row": 3, "col": 0 },
      { "id": "D", "orientation": "horizontal", "length": 2, "row": 4, "col": 3 },
      { "id": "E", "orientation": "horizontal", "length": 2, "row": 0, "col": 1 },
      { "id": "F", "orientation": "vertical",   "length": 3, "row": 1, "col": 5 },
      { "id": "G", "orientation": "vertical",   "length": 3, "row": 3, "col": 2 },
      { "id": "H", "orientation": "vertical",   "length": 3, "row": 1, "col": 3 }
    ],
    "optimalMoves": 12
  },
  ...${JSON.stringify(levels, null, 2)}
];
`;

  fs.writeFileSync(outputPath, fileContent);
  console.log(`Successfully generated and saved to ${outputPath}`);
};

generateStaticLevels();
