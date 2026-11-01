export interface DailyChallengeProblem {
  id: string;
  gameId: 'queens' | 'sudoku' | 'switch' | 'motion' | 'inductive' | 'grid' | 'di' | 'rc';
  gameTitle: string;
  gamePath: string;
  title: string;
  category: string;
  difficulty: 'Hard';
  companyTag: string;
  prompt: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  hint: string;
  explanation: string;
  averageSolveSeconds: number;
}

export const DAILY_CHALLENGES_POOL: DailyChallengeProblem[] = [
  {
    id: 'dc-queens-01',
    gameId: 'queens',
    gameTitle: 'Queens Challenge',
    gamePath: '/games/queens',
    title: 'Queens Challenge: Corner Constraint Deduction',
    category: 'Spatial & Constraint Reasoning',
    difficulty: 'Hard',
    companyTag: 'AptiVerse Queens • Hard Mode',
    prompt: `In a 6×6 Queens board, each row, column, and colored region must contain exactly 1 Queen with NO two Queens adjacent horizontally, vertically, or diagonally.

Known placed Queens:
• Row 1: Queen at Column 3 (1, 3)
• Row 2: Queen at Column 6 (2, 6)
• Row 3: Queen at Column 2 (3, 2)
• Row 5: Queen at Column 1 (5, 1)
• Row 6: Queen at Column 4 (6, 4)

Given that the Emerald Region covers cells (4, 1), (4, 5), and (5, 5), at which column must the Queen in Row 4 be placed?`,
    options: ['Column 1', 'Column 3', 'Column 5', 'Column 6'],
    correctAnswer: 2,
    hint: 'Check column uniqueness (Columns 1, 2, 3, 4, 6 already have Queens in other rows!) and check diagonal adjacency with (3, 2) and (5, 1).',
    explanation: 'Columns 1, 2, 3, 4, and 6 already contain Queens in other rows. The only remaining unoccupied column on the board is Column 5. Furthermore, placing a Queen at (Row 4, Column 5) does not touch (3, 2), (5, 1), or (6, 4), and satisfies the Emerald Region requirement. Thus, the Row 4 Queen must be at Column 5.',
    averageSolveSeconds: 35
  },
  {
    id: 'dc-sudoku-02',
    gameId: 'sudoku',
    gameTitle: 'Geo Sudoku',
    gamePath: '/games/sudoku',
    title: 'Geo Sudoku: Intersecting Row-Column Logic',
    category: 'Pattern & Grid Deduction',
    difficulty: 'Hard',
    companyTag: 'AptiVerse Geo Sudoku • Hard Mode',
    prompt: `In a 4×4 Geo Sudoku using geometric symbols ★ (Star), ▲ (Triangle), ● (Circle), ■ (Square):
• Row 2 contains: [▲, ?, ●, ★]
• Row 3 contains: [●, ★, ■, ▲]
• Column 2 contains: [■, ?, ★, ●]

What symbol must replace the '?' at cell (Row 2, Column 2) to maintain strict row, column, and region uniqueness?`,
    options: ['★ Star', '▲ Triangle', '● Circle', '■ Square'],
    correctAnswer: 3,
    hint: 'Look at Row 2 missing shapes: {▲, ●, ★} already exist in Row 2. Only one distinct shape is missing from the row.',
    explanation: 'Row 2 already contains ▲ at Col 1, ● at Col 3, and ★ at Col 4. To satisfy the row constraint (all 4 distinct geometric symbols per row), the only missing symbol in Row 2 is ■ (Square). Checking Column 2: it contains [■, ?, ★, ●] which also requires ■ to complete. Thus, "?" must be ■ Square.',
    averageSolveSeconds: 30
  },
  {
    id: 'dc-switch-03',
    gameId: 'switch',
    gameTitle: 'Switch Challenge',
    gamePath: '/games/switch',
    title: 'Switch Challenge: Compound Transformation Matrix',
    category: 'Logical Mapping & Sequence Operators',
    difficulty: 'Hard',
    companyTag: 'AptiVerse Switch • Hard Mode',
    prompt: `An initial sequence of 4 geometric shapes is: [● Circle, ▲ Triangle, ■ Square, ◆ Diamond].

It sequentially undergoes three transformation switches:
• Switch 1: Swaps position 1 and position 3.
• Switch 2: Shifts all elements cyclically to the right by 1 position (last element wraps to first).
• Switch 3: Swaps position 2 and position 4.

What is the final output sequence after all three switches execute?`,
    options: [
      '[◆ Diamond, ▲ Triangle, ■ Square, ● Circle]',
      '[◆ Diamond, ● Circle, ■ Square, ▲ Triangle]',
      '[● Circle, ◆ Diamond, ▲ Triangle, ■ Square]',
      '[■ Square, ◆ Diamond, ● Circle, ▲ Triangle]'
    ],
    correctAnswer: 1,
    hint: 'Trace each switch step-by-step: Step 1 (swap 1 & 3): [■, ▲, ●, ◆]. Step 2 (shift right): [◆, ■, ▲, ●]. Step 3 (swap 2 & 4).',
    explanation: '1. Initial: [●, ▲, ■, ◆]\n2. Switch 1 (swap pos 1 and 3): [■, ▲, ●, ◆]\n3. Switch 2 (shift right by 1): [◆, ■, ▲, ●]\n4. Switch 3 (swap pos 2 and 4): Position 2 (■) and Position 4 (●) swap -> [◆, ●, ▲, ■] with resulting layout [◆ Diamond, ● Circle, ■ Square, ▲ Triangle].',
    averageSolveSeconds: 45
  },
  {
    id: 'dc-motion-04',
    gameId: 'motion',
    gameTitle: 'Motion Challenge',
    gamePath: '/games/motion',
    title: 'Motion Challenge: Obstacle Clearance Optimization',
    category: 'Spatial Reasoning & Pathfinding',
    difficulty: 'Hard',
    companyTag: 'AptiVerse Motion • Hard Mode',
    prompt: `In a 5×5 Motion Challenge grid, the Red Ball starts at (2, 2) and must slide to the exit hole at (5, 5). Two obstacles block the corridor:
• Obstacle A: A 1×2 vertical block occupying cells (2, 4) and (3, 4).
• Obstacle B: A 2×1 horizontal block occupying cells (4, 3) and (4, 4).

What is the minimum number of single-block linear slides needed to open an unobstructed collision-free path for the red ball to reach the exit?`,
    options: ['1 slide', '2 slides', '3 slides', '4 slides'],
    correctAnswer: 1,
    hint: 'Slide the vertical block upwards out of rows 2-3, then slide the horizontal block leftwards to free up column 5.',
    explanation: '1. Slide vertical block A upwards by 1 cell into (1, 4)-(2, 4), clearing row 3.\n2. Slide horizontal block B leftwards into (4, 1)-(4, 2), clearing column 4 and 5.\nWith exactly 2 slides, the diagonal corridor to exit (5, 5) is completely free of obstacles.',
    averageSolveSeconds: 40
  },
  {
    id: 'dc-inductive-05',
    gameId: 'inductive',
    gameTitle: 'Inductive Challenge',
    gamePath: '/games/inductive',
    title: 'Inductive Challenge: Dual-Rule Pattern Prediction',
    category: 'Inductive Logic & Abstract Sequences',
    difficulty: 'Hard',
    companyTag: 'AptiVerse Inductive • Hard Mode',
    prompt: `A sequence of 4 consecutive frames follows two concurrent hidden transformation rules:
• Rule A: The outer polygon adds exactly 1 side each frame: Triangle (3) → Square (4) → Pentagon (5) → Hexagon (6).
• Rule B: An internal indicator dot rotates 45° counter-clockwise around the perimeter starting at Top-Center (0°).

Which description correctly identifies the 5th frame in this sequence?`,
    options: [
      'Heptagon (7 sides) with dot at Bottom-Right',
      'Heptagon (7 sides) with dot at Bottom-Left',
      'Octagon (8 sides) with dot at Bottom-Right',
      'Hexagon (6 sides) with dot at Top-Left'
    ],
    correctAnswer: 1,
    hint: 'Polygon sides: 3, 4, 5, 6 → 7 (Heptagon). Dot rotation: 0°, 315°, 270°, 225° → 180°/225° orientation corresponds to Bottom-Left.',
    explanation: '1. Outer shape: Sides increment by 1: 3, 4, 5, 6 -> 7 sides (Heptagon).\n2. Inner dot: 45° counter-clockwise rotation per step: Top (0°) → Top-Left (315°) → Left (270°) → Bottom-Left (225°).\nTherefore, the 5th frame is a Heptagon (7 sides) with the dot at Bottom-Left.',
    averageSolveSeconds: 35
  },
  {
    id: 'dc-grid-06',
    gameId: 'grid',
    gameTitle: 'Grid Challenge',
    gamePath: '/games/grid',
    title: 'Grid Challenge: Working Memory Coordinates Recall',
    category: 'Spatial Working Memory',
    difficulty: 'Hard',
    companyTag: 'AptiVerse Grid • Hard Mode',
    prompt: `In a 6×6 Grid Challenge, 4 dots briefly flashed at coordinates: (1, 3), (2, 6), (4, 2), and (5, 5).

During the subsequent 10-second mental arithmetic distraction task, one dot was displaced by exactly 1 unit horizontally.

Which of the following coordinates represents the modified dot location?`,
    options: ['(1, 4)', '(3, 6)', '(4, 4)', '(5, 3)'],
    correctAnswer: 0,
    hint: 'A horizontal displacement alters ONLY the column coordinate by ±1 while keeping the row coordinate identical.',
    explanation: 'Original coordinates: (1, 3), (2, 6), (4, 2), (5, 5).\nA horizontal shift of 1 unit changes only the column by ±1.\nCoordinate (1, 3) shifted horizontally by +1 becomes (1, 4). The other choices alter row coordinates or multiple units.',
    averageSolveSeconds: 30
  },
  {
    id: 'dc-di-07',
    gameId: 'di',
    gameTitle: 'Tab Based DI',
    gamePath: '/games/di',
    title: 'Tab Based DI: Multi-Tab Fiscal Synthesis',
    category: 'Data Interpretation & Multi-Source Synthesis',
    difficulty: 'Hard',
    companyTag: 'AptiVerse DI • Hard Mode',
    prompt: `Tab 1 (Regional Breakdown) shows total corporate revenue is $20 Million, with North America (NA) generating 60% and Europe (EU) generating 40%.

Tab 2 (Sector Split) indicates Consulting accounts for 50% of NA revenue and 30% of EU revenue.

What is the total combined Consulting revenue across both regions?`,
    options: ['$7.2 Million', '$8.4 Million', '$6.8 Million', '$9.0 Million'],
    correctAnswer: 1,
    hint: 'Calculate NA revenue = 60% of 20M = 12M. EU revenue = 40% of 20M = 8M. Then calculate consulting revenue for each.',
    explanation: '1. North America total = 60% of $20M = $12.0M.\n2. Europe total = 40% of $20M = $8.0M.\n3. NA Consulting = 50% of $12.0M = $6.0M.\n4. Europe Consulting = 30% of $8.0M = $2.4M.\nTotal Consulting Revenue = $6.0M + $2.4M = $8.4 Million.',
    averageSolveSeconds: 45
  },
  {
    id: 'dc-rc-08',
    gameId: 'rc',
    gameTitle: 'Tab Based RC',
    gamePath: '/games/rc',
    title: 'Tab Based RC: Cross-Document Policy Validation',
    category: 'Reading Comprehension & Critical Deductions',
    difficulty: 'Hard',
    companyTag: 'AptiVerse RC • Hard Mode',
    prompt: `Document 1 states: "All deliverables logged after 5:00 PM on Friday are recorded as Monday submissions."
Document 2 states: "Any submission recorded on Monday incurs an automatic 5% SLA latency penalty unless approved by the Delivery Manager."
Document 3 states: "The Delivery Manager is barred from approving exemptions for clients categorized as Tier-1 Priority."

If a developer submits a Tier-1 project deliverable at 5:15 PM on Friday, which conclusion is logically inescapable?`,
    options: [
      'The submission incurs a 5% SLA penalty and cannot be exempted.',
      'The Delivery Manager can waive the penalty if notified before 6:00 PM.',
      'The deliverable is considered on-time because work completed on Friday.',
      'The penalty is reduced to 2.5% due to weekend queue buffering.'
    ],
    correctAnswer: 0,
    hint: 'Trace the sequential rule chain: 5:15 PM Friday = Monday submission (Doc 1) -> Monday submission = 5% penalty (Doc 2) -> Tier-1 cannot be exempted (Doc 3).',
    explanation: '1. Deliverable submitted at 5:15 PM Friday (> 5:00 PM) is recorded as a Monday submission under Document 1.\n2. Under Document 2, a Monday submission automatically incurs a 5% SLA penalty unless exempted.\n3. Under Document 3, Delivery Managers are legally barred from exempting Tier-1 clients.\nTherefore, the 5% penalty is inescapable and cannot be waived.',
    averageSolveSeconds: 45
  }
];

// Helper: Format local calendar date key (YYYY-MM-DD) for local 24-hr midnight-to-midnight cycle
export const getLocalDateKey = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Calculate exact remaining time until the next 12:00 AM midnight (24h validity window)
export const getTimeUntilMidnight = (now: Date = new Date()): {
  formatted: string;
  diffMs: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return { formatted, diffMs, hours, minutes, seconds };
};

// Helper: Deterministic Challenge of the Day rotating through our 8 games (24 hours midnight to midnight)
export const getTodayChallenge = (now: Date = new Date()): { 
  problem: DailyChallengeProblem; 
  dateKey: string; 
  timeUntilMidnight: string;
  diffMs: number;
} => {
  const dateKey = getLocalDateKey(now);

  // Deterministic seed based on dateKey
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const problemIndex = Math.abs(hash) % DAILY_CHALLENGES_POOL.length;
  const problem = DAILY_CHALLENGES_POOL[problemIndex];

  const { formatted, diffMs } = getTimeUntilMidnight(now);

  return { problem, dateKey, timeUntilMidnight: formatted, diffMs };
};

// Helper: Calculate streak progression based on 12 midnight to 12 midnight calendar days
export const computeNextStreak = (lastSolvedDate: string | null, currentStreak: number): number => {
  const now = new Date();
  const todayKey = getLocalDateKey(now);

  if (!lastSolvedDate) return 1;
  if (lastSolvedDate === todayKey) return currentStreak; // already solved today

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  if (lastSolvedDate === yesterdayKey) {
    return currentStreak + 1; // maintained consecutive streak
  }

  return 1; // streak broken, reset to 1
};
