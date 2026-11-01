import React from 'react';
import { Crown, Flag } from 'lucide-react';
import type { DailyChallengeProblem } from '../../data/dailyChallenges';

interface DailyChallengeGameBoardProps {
  problem: DailyChallengeProblem;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  disabled?: boolean;
}

export const DailyChallengeGameBoard: React.FC<DailyChallengeGameBoardProps> = ({
  problem,
  selectedOption,
  onSelectOption,
  disabled = false,
}) => {
  switch (problem.gameId) {
    case 'queens':
      return <QueensVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    case 'sudoku':
      return <SudokuVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    case 'switch':
      return <SwitchVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    case 'motion':
      return <MotionVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    case 'inductive':
      return <InductiveVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    case 'grid':
      return <GridVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    case 'di':
      return <DIVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    case 'rc':
      return <RCVisualBoard selectedOption={selectedOption} onSelectOption={onSelectOption} disabled={disabled} />;
    default:
      return null;
  }
};

// 1. QUEENS INTERACTIVE 6x6 VISUAL BOARD
const QueensVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = ({ selectedOption, onSelectOption, disabled }) => {
  // 6x6 board with regions and known queens
  // Row 4 is the target row. Option 0 = Col 1, 1 = Col 3, 2 = Col 5, 3 = Col 6
  const queens: Record<string, boolean> = {
    '0,2': true, // (1,3)
    '1,5': true, // (2,6)
    '2,1': true, // (3,2)
    '4,0': true, // (5,1)
    '5,3': true, // (6,4)
  };

  const optionColMap: Record<number, number> = { 0: 0, 1: 2, 2: 4, 3: 5 }; // col 1, 3, 5, 6 (0-indexed)

  const regionFills: string[][] = [
    ['#eff6ff', '#eff6ff', '#eff6ff', '#ecfdf5', '#ecfdf5', '#fef2f2'],
    ['#eff6ff', '#faf5ff', '#faf5ff', '#ecfdf5', '#fef2f2', '#fef2f2'],
    ['#fffbeb', '#faf5ff', '#faf5ff', '#ecfdf5', '#ecfdf5', '#fef2f2'],
    ['#fffbeb', '#fffbeb', '#f0fdf4', '#f0fdf4', '#f0fdf4', '#fff7ed'],
    ['#fffbeb', '#fffbeb', '#f0fdf4', '#fff7ed', '#fff7ed', '#fff7ed'],
    ['#fffbeb', '#fffbeb', '#fff7ed', '#fff7ed', '#fff7ed', '#fff7ed'],
  ];

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="w-full max-w-[340px] bg-slate-900/5 p-3 rounded-2xl border border-slate-200 shadow-inner">
        <div className="grid grid-cols-6 gap-1 w-full aspect-square bg-slate-800 p-1.5 rounded-xl shadow-md">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => {
              const hasQueen = queens[`${r},${c}`];
              const isTargetRow = r === 3; // Row 4 (0-indexed 3)
              const isSelectedTarget = selectedOption !== null && optionColMap[selectedOption] === c && isTargetRow;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => {
                    if (disabled || !isTargetRow) return;
                    if (c === 0) onSelectOption(0);
                    if (c === 2) onSelectOption(1);
                    if (c === 4) onSelectOption(2);
                    if (c === 5) onSelectOption(3);
                  }}
                  style={{ backgroundColor: regionFills[r][c] }}
                  className={`relative flex items-center justify-center rounded-lg transition-all duration-200 ${
                    isTargetRow
                      ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:scale-105 z-10'
                      : ''
                  } ${
                    isSelectedTarget ? 'ring-2 ring-primary-600 bg-amber-100 shadow-md scale-105' : ''
                  }`}
                >
                  {hasQueen && (
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center animate-fadeIn">
                      <Crown size={16} className="text-amber-600 fill-amber-500 drop-shadow-xs" />
                    </div>
                  )}

                  {isTargetRow && !hasQueen && (
                    isSelectedTarget ? (
                      <div className="w-7 h-7 rounded-full bg-primary-600/20 flex items-center justify-center animate-bounce">
                        <Crown size={16} className="text-primary-700 fill-primary-600" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700">
                        ?
                      </span>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 font-medium">
        🎯 Row 4 needs a Queen! Tap a cell in Row 4 or select an option below.
      </p>
    </div>
  );
};

// 2. GEO SUDOKU 4x4 INTERACTIVE VISUAL BOARD
const SudokuVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = ({ selectedOption, onSelectOption, disabled }) => {
  // 4x4 Grid
  // Row 2: [▲, ?, ●, ★]
  const board = [
    ['●', '■', '★', '▲'],
    ['▲', '?', '●', '★'],
    ['●', '★', '■', '▲'],
    ['■', '▲', '▲', '●'],
  ];

  const symbolMap: Record<number, string> = { 0: '★', 1: '▲', 2: '●', 3: '■' };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="w-full max-w-[280px] bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner">
        <div className="grid grid-cols-4 gap-1.5 w-full aspect-square bg-slate-900 p-2 rounded-xl shadow-md">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isTarget = r === 1 && c === 1;
              const cellDisplay = isTarget && selectedOption !== null ? symbolMap[selectedOption] : cell;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => {
                    if (isTarget && !disabled) {
                      onSelectOption((selectedOption === null ? 0 : (selectedOption + 1) % 4));
                    }
                  }}
                  className={`flex items-center justify-center rounded-lg text-lg sm:text-xl font-bold transition-all ${
                    isTarget
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-500 cursor-pointer animate-pulse'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  {cellDisplay}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 font-medium">
        Row 2 & Column 2 must contain ★, ▲, ●, ■ without duplicates.
      </p>
    </div>
  );
};

// 3. SWITCH CHALLENGE VISUAL TRANSFORMATION PIPELINE
const SwitchVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-3 select-none">
      {/* Initial Input */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Start:</span>
        <div className="flex items-center gap-2 font-mono font-bold">
          <span className="px-2 py-1 rounded bg-white border border-slate-200">1: ●</span>
          <span className="px-2 py-1 rounded bg-white border border-slate-200">2: ▲</span>
          <span className="px-2 py-1 rounded bg-white border border-slate-200">3: ■</span>
          <span className="px-2 py-1 rounded bg-white border border-slate-200">4: ◆</span>
        </div>
      </div>

      {/* Operator Steps Track */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-indigo-50 border border-indigo-200 p-2 rounded-lg">
          <div className="text-[10px] font-bold text-indigo-700">Switch 1</div>
          <div className="text-[11px] text-indigo-900 font-semibold mt-0.5">Swap 1 ⇄ 3</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-2 rounded-lg">
          <div className="text-[10px] font-bold text-purple-700">Switch 2</div>
          <div className="text-[11px] text-purple-900 font-semibold mt-0.5">Shift Right ➜</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg">
          <div className="text-[10px] font-bold text-rose-700">Switch 3</div>
          <div className="text-[11px] text-rose-900 font-semibold mt-0.5">Swap 2 ⇄ 4</div>
        </div>
      </div>
    </div>
  );
};

// 4. MOTION CHALLENGE 5x5 OBSTACLE GRID
const MotionVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = () => {
  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="w-full max-w-[260px] bg-slate-900 p-2.5 rounded-2xl shadow-lg border border-slate-800">
        <div className="grid grid-cols-5 gap-1.5 w-full aspect-square">
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => {
              const isBall = r === 1 && c === 1; // (2,2)
              const isExit = r === 4 && c === 4; // (5,5)
              const isObstacleA = (r === 1 && c === 3) || (r === 2 && c === 3); // (2,4), (3,4)
              const isObstacleB = (r === 3 && c === 2) || (r === 3 && c === 3); // (4,3), (4,4)

              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isBall
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 animate-pulse'
                      : isExit
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                        : isObstacleA || isObstacleB
                          ? 'bg-slate-700 text-slate-300 border border-slate-600'
                          : 'bg-slate-800/80 text-slate-600'
                  }`}
                >
                  {isBall && '🔴'}
                  {isExit && <Flag size={14} className="text-white fill-white" />}
                  {isObstacleA && 'A'}
                  {isObstacleB && 'B'}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 font-medium">
        🔴 Ball must reach 🏁 Exit. How many single-block linear slides to clear the path?
      </p>
    </div>
  );
};

// 5. INDUCTIVE CHALLENGE VISUAL SEQUENCE FRAMES
const InductiveVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = () => {
  return (
    <div className="w-full max-w-lg mx-auto select-none">
      <div className="grid grid-cols-5 gap-2 items-center">
        {/* Frame 1: Triangle */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center aspect-square shadow-2xs">
          <span className="text-2xl">▲</span>
          <span className="text-[9px] font-bold text-slate-500 mt-1">3 Sides</span>
        </div>

        {/* Frame 2: Square */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center aspect-square shadow-2xs">
          <span className="text-2xl">■</span>
          <span className="text-[9px] font-bold text-slate-500 mt-1">4 Sides</span>
        </div>

        {/* Frame 3: Pentagon */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center aspect-square shadow-2xs">
          <span className="text-2xl">⬠</span>
          <span className="text-[9px] font-bold text-slate-500 mt-1">5 Sides</span>
        </div>

        {/* Frame 4: Hexagon */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center aspect-square shadow-2xs">
          <span className="text-2xl">⬡</span>
          <span className="text-[9px] font-bold text-slate-500 mt-1">6 Sides</span>
        </div>

        {/* Frame 5: Target Frame */}
        <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-400 border-dashed flex flex-col items-center justify-center aspect-square shadow-2xs animate-pulse">
          <span className="text-xl font-black text-amber-700">?</span>
          <span className="text-[9px] font-bold text-amber-600 mt-1">Frame 5</span>
        </div>
      </div>
    </div>
  );
};

// 6. GRID CHALLENGE VISUAL MEMORY BOARD
const GridVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = () => {
  const dots: Record<string, boolean> = {
    '0,2': true, // (1,3)
    '1,5': true, // (2,6)
    '3,1': true, // (4,2)
    '4,4': true, // (5,5)
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="w-full max-w-[260px] bg-slate-900 p-2.5 rounded-2xl shadow-lg border border-slate-800">
        <div className="grid grid-cols-6 gap-1 w-full aspect-square">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => {
              const hasDot = dots[`${r},${c}`];
              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-md flex items-center justify-center transition-all ${
                    hasDot
                      ? 'bg-amber-400 shadow-md shadow-amber-400/50 scale-110'
                      : 'bg-slate-800'
                  }`}
                >
                  {hasDot && <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 font-medium">
        One dot shifted horizontally by 1 cell. Identify the modified location.
      </p>
    </div>
  );
};

// 7. DI CHALLENGE VISUAL TAB CARDS
const DIVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto select-none">
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
        <span className="text-[10px] font-bold text-blue-700 uppercase">Tab 1: Regional Revenue</span>
        <div className="mt-2 text-xs space-y-1">
          <div className="flex justify-between"><span>Total Revenue:</span><strong className="font-mono">$20.0M</strong></div>
          <div className="flex justify-between"><span>North America (NA):</span><strong className="font-mono">60% ($12M)</strong></div>
          <div className="flex justify-between"><span>Europe (EU):</span><strong className="font-mono">40% ($8M)</strong></div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
        <span className="text-[10px] font-bold text-emerald-700 uppercase">Tab 2: Consulting Share</span>
        <div className="mt-2 text-xs space-y-1">
          <div className="flex justify-between"><span>NA Consulting:</span><strong className="font-mono">50%</strong></div>
          <div className="flex justify-between"><span>EU Consulting:</span><strong className="font-mono">30%</strong></div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">Compute total consulting revenue.</div>
        </div>
      </div>
    </div>
  );
};

// 8. RC CHALLENGE VISUAL DOSSIER TABS
const RCVisualBoard: React.FC<{
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}> = () => {
  return (
    <div className="space-y-2 w-full max-w-lg mx-auto text-xs select-none">
      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold shrink-0">Doc 1</span>
        <span>Deliverables submitted after 5:00 PM Friday count as <strong>Monday submissions</strong>.</span>
      </div>
      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold shrink-0">Doc 2</span>
        <span>Monday submissions incur automatic <strong>5% SLA penalty</strong> unless exempted by Manager.</span>
      </div>
      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold shrink-0">Doc 3</span>
        <span>Delivery Manager is barred from approving exemptions for <strong>Tier-1 Priority</strong> clients.</span>
      </div>
    </div>
  );
};
