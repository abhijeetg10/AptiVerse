import React from 'react';
import { ArrowLeft, Crown, Clock, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Difficulty } from './types';
import { DIFFICULTY_CONFIG } from './generator';

interface QueensHeaderProps {
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  timeElapsed: number;
  queensPlaced: number;
  totalQueens: number;
  mistakesCount: number;
  onReset: () => void;
  onOpenRules: () => void;
}

export const QueensHeader: React.FC<QueensHeaderProps> = ({
  difficulty,
  onDifficultyChange,
  timeElapsed,
  queensPlaced,
  totalQueens,
  mistakesCount,
  onReset,
  onOpenRules,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isAllQueensPlaced = queensPlaced === totalQueens;

  return (
    <header className="h-16 sm:h-20 border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between bg-white shrink-0 shadow-sm z-30">
      
      {/* Left: Back & Game Identity */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/games"
          className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors shrink-0"
          title="Back to Games"
        >
          <ArrowLeft size={20} />
        </Link>
        
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0">
            <Crown size={20} className="fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Queens Challenge
              </h1>
              <button
                onClick={onOpenRules}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="How to Play"
              >
                <HelpCircle size={15} />
              </button>
            </div>
            
            {/* Difficulty Selector Dropdown */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <select
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg border border-slate-200/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase tracking-wider"
              >
                {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
                  <option key={d} value={d}>
                    {DIFFICULTY_CONFIG[d].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Metrics & Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* Queens Placed Counter */}
        <div className="hidden xs:flex flex-col items-center sm:items-end">
          <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">
            Queens
          </span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm sm:text-base">
            <Crown size={14} className={isAllQueensPlaced ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
            <span className={isAllQueensPlaced ? 'text-emerald-600' : 'text-slate-800'}>
              {queensPlaced}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">{totalQueens}</span>
          </div>
        </div>

        {/* Mistakes Counter */}
        {mistakesCount > 0 && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">
              Mistakes
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-red-500">
              <AlertCircle size={13} />
              <span>{mistakesCount}</span>
            </div>
          </div>
        )}

        {/* Live Timer */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase flex items-center gap-1">
            <Clock size={10} /> Time
          </span>
          <span className="font-mono text-base sm:text-xl font-black text-slate-800 tracking-tight">
            {formatTime(timeElapsed)}
          </span>
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-sm shrink-0"
          title="Restart Puzzle"
        >
          <RefreshCw size={17} />
        </button>

      </div>

    </header>
  );
};

