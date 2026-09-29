import type { GridPuzzle, DistractionTask } from './types';

function generateSequence(length: number, gridSize: number): number[] {
  const sequence: number[] = [];
  while (sequence.length < length) {
    const r = Math.floor(Math.random() * gridSize);
    if (!sequence.includes(r)) sequence.push(r);
  }
  return sequence;
}

function generateDistraction(): DistractionTask {
  const isSymmetry = Math.random() > 0.5;
  const isTrue = Math.random() > 0.5;
  
  if (isSymmetry) {
    // 4x4 grid (16 cells)
    const half = Array.from({ length: 8 }, () => Math.random() > 0.5);
    const grid1 = [...half, ...[...half].reverse()]; // perfectly symmetrical vertically
    
    if (!isTrue) {
      // Break symmetry
      const flipIdx = Math.floor(Math.random() * 8);
      grid1[flipIdx] = !grid1[flipIdx];
    }
    return { type: 'symmetry', grid1, isTrue };
  } else {
    // Matching 4x4
    const grid1 = Array.from({ length: 16 }, () => Math.random() > 0.5);
    const grid2 = [...grid1];
    
    if (!isTrue) {
      // Break match
      const flipIdx = Math.floor(Math.random() * 16);
      grid2[flipIdx] = !grid2[flipIdx];
    }
    return { type: 'matching', grid1, grid2, isTrue };
  }
}

export function generateGridLevel(id: string, dotsCount: number): GridPuzzle {
  return {
    id,
    gridSize: 25, // 5x5
    dotsCount,
    sequence: generateSequence(dotsCount, 25),
    distraction: generateDistraction()
  };
}
