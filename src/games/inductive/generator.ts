import type { ShapeId, Grid3x3, InductivePuzzle } from './types';

const SHAPES: ShapeId[] = ['yc', 'rs', 'gt', 'bp'];

function randomShape(): ShapeId {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function randomOtherShape(avoid: ShapeId): ShapeId {
  let s = randomShape();
  while (s === avoid) s = randomShape();
  return s;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface RuleGenerator {
  name: string;
  generateValid: () => Grid3x3;
  generateInvalid: () => Grid3x3;
}

const rules: RuleGenerator[] = [
  {
    // Rule 1: A specific shape occupies all 4 corners
    name: "Corners match",
    generateValid: () => {
      const g = Array.from({length: 9}, randomShape);
      const target = randomShape();
      g[0] = target; g[2] = target; g[6] = target; g[8] = target;
      return g;
    },
    generateInvalid: () => {
      const g = Array.from({length: 9}, randomShape);
      // Ensure corners are NOT all the same
      if (g[0] === g[2] && g[2] === g[6] && g[6] === g[8]) {
        g[0] = randomOtherShape(g[0]);
      }
      return g;
    }
  },
  {
    // Rule 2: The top 6 spaces are filled with the same shape
    name: "Top 6 match",
    generateValid: () => {
      const g = Array.from({length: 9}, randomShape);
      const target = randomShape();
      for(let i=0; i<6; i++) g[i] = target;
      return g;
    },
    generateInvalid: () => {
      const g = Array.from({length: 9}, randomShape);
      const target = g[0];
      let allMatch = true;
      for(let i=1; i<6; i++) {
        if (g[i] !== target) { allMatch = false; break; }
      }
      if (allMatch) g[5] = randomOtherShape(target);
      return g;
    }
  },
  {
    // Rule 3: Right 6 spaces are filled with same shape
    name: "Right 6 match",
    generateValid: () => {
      const g = Array.from({length: 9}, randomShape);
      const target = randomShape();
      [1,2,4,5,7,8].forEach(i => g[i] = target);
      return g;
    },
    generateInvalid: () => {
      const g = Array.from({length: 9}, randomShape);
      const target = g[1];
      let allMatch = true;
      [2,4,5,7,8].forEach(i => { if (g[i] !== target) allMatch = false; });
      if (allMatch) g[8] = randomOtherShape(target);
      return g;
    }
  },
  {
    // Rule 4: Exactly 7 of a specific shape
    name: "Count is 7",
    generateValid: () => {
      const g = Array.from({length: 9}, () => randomShape());
      const target = randomShape();
      let pos = shuffle([0,1,2,3,4,5,6,7,8]);
      for(let i=0; i<7; i++) g[pos[i]] = target;
      g[pos[7]] = randomOtherShape(target);
      g[pos[8]] = randomOtherShape(target);
      return g;
    },
    generateInvalid: () => {
      const g = Array.from({length: 9}, () => randomShape());
      const counts: Record<string, number> = { yc:0, rs:0, gt:0, bp:0 };
      g.forEach(s => counts[s]++);
      Object.entries(counts).forEach(([s, c]) => {
        if (c >= 7) {
          // Change it so it's not 7
          const pos = g.indexOf(s as ShapeId);
          g[pos] = randomOtherShape(s as ShapeId);
        }
      });
      return g;
    }
  },
  {
    // Rule 5: Central cross is same shape
    name: "Central cross",
    generateValid: () => {
      const g = Array.from({length: 9}, () => randomShape());
      const target = randomShape();
      [1, 3, 4, 5, 7].forEach(i => g[i] = target);
      return g;
    },
    generateInvalid: () => {
      const g = Array.from({length: 9}, () => randomShape());
      const target = g[4];
      let allMatch = true;
      [1, 3, 5, 7].forEach(i => { if (g[i] !== target) allMatch = false; });
      if (allMatch) g[1] = randomOtherShape(target);
      return g;
    }
  }
];

let lastRuleIndex = -1;

export function generateInductiveLevel(id: string): InductivePuzzle {
  // Pick a rule different from the last one used
  let ruleIndex: number;
  do {
    ruleIndex = Math.floor(Math.random() * rules.length);
  } while (ruleIndex === lastRuleIndex && rules.length > 1);
  lastRuleIndex = ruleIndex;

  const rule = rules[ruleIndex];
  
  const examples: [Grid3x3, Grid3x3] = [
    rule.generateValid(),
    rule.generateValid()
  ];
  
  // We need exactly 2 correct and 2 incorrect grids
  let opts = [
    { grid: rule.generateValid(), isCorrect: true },
    { grid: rule.generateValid(), isCorrect: true },
    { grid: rule.generateInvalid(), isCorrect: false },
    { grid: rule.generateInvalid(), isCorrect: false }
  ];
  
  opts = shuffle(opts);
  
  const options = opts.map(o => o.grid) as [Grid3x3, Grid3x3, Grid3x3, Grid3x3];
  const correctOptionIndices = opts
    .map((o, idx) => o.isCorrect ? idx : -1)
    .filter(idx => idx !== -1) as [number, number];
    
  return {
    id,
    ruleName: rule.name,
    examples,
    options,
    correctOptionIndices
  };
}
