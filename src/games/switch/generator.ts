import type { SwitchSymbol, Permutation, SwitchPuzzle } from './types';
import { applyPermutation } from './engine';

const ALL_SYMBOLS: SwitchSymbol[] = ['triangle', 'circle', 'cross', 'star'];

function generateAllPermutations(): Permutation[] {
  const perms: Permutation[] = [];
  for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= 4; j++) {
      if (j === i) continue;
      for (let k = 1; k <= 4; k++) {
        if (k === i || k === j) continue;
        for (let l = 1; l <= 4; l++) {
          if (l === i || l === j || l === k) continue;
          perms.push([i, j, k, l]);
        }
      }
    }
  }
  return perms;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSwitchLevel(id: string, rows: number): SwitchPuzzle {
  const input = shuffle([...ALL_SYMBOLS]);
  const allPerms = generateAllPermutations();
  const shuffledPerms = shuffle(allPerms);
  
  const fixedCodes: Permutation[] = [];
  for (let i = 0; i < rows - 1; i++) {
    fixedCodes.push(shuffledPerms[i]);
  }
  
  const correctCode = shuffledPerms[rows - 1];
  
  let currentOutput = [...input];
  for (const code of fixedCodes) {
    currentOutput = applyPermutation(currentOutput, code);
  }
  const finalOutput = applyPermutation(currentOutput, correctCode);
  
  // Distractors
  const distractors = [shuffledPerms[rows], shuffledPerms[rows + 1]];
  
  const choices = shuffle([correctCode, ...distractors]);
  const correctChoiceIndex = choices.indexOf(correctCode);
  
  return {
    id,
    input,
    output: finalOutput,
    fixedCodes,
    choices,
    correctChoiceIndex,
    difficulty: rows === 1 ? "easy" : rows === 2 ? "medium" : "hard"
  };
}
