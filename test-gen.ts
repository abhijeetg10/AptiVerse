import { getLevel } from './src/games/motion/levels.ts';

const t0 = performance.now();
const level = getLevel(5); // hard
const t1 = performance.now();

console.log(`Generated in ${t1 - t0}ms`);
console.log(`Blocks: ${level.blocks.length}`);
console.log(`Optimal moves: ${level.optimalMoves}`);
