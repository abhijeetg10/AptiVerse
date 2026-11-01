import React from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ScoreSummary } from './types';
import { DIFFICULTY_CONFIG } from './generator';

interface QueensCompletionProps {
  isOpen: boolean;
  summary: ScoreSummary | null;
  onPlayAgain: () => void;
  onNextDifficulty: () => void;
  canNextDifficulty: boolean;
}

export const QueensCompletion: React.FC<QueensCompletionProps> = ({
  isOpen,
  summary,
  onPlayAgain,
  onNextDifficulty,
  canNextDifficulty,
}) => {
  if (!isOpen || !summary) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const diffLabel = DIFFICULTY_CONFIG[summary.difficulty]?.label || summary.difficulty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Trophy Glow */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/40 mx-auto mb-4 animate-bounce">
          <Trophy size={40} className="fill-white" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 size={13} /> Puzzle Completed!
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
          Queens Solved
        </h2>
        
        <p className="text-xs text-slate-500 mb-5">
          {diffLabel} • Perfect logical deduction
        </p>

        {/* Star Rating */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transform transition-transform ${
                starIdx <= summary.stars ? 'scale-110' : 'opacity-30'
              }`}
            >
              <Star
                size={32}
                className={
                  starIdx <= summary.stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                    : 'text-slate-300'
                }
              />
            </div>
          ))}
        </div>

        {/* Score & Time Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Total Score
              </span>
              <span className="text-2xl font-black text-indigo-600 font-mono">
                {summary.finalScore.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-600 block mt-0.5">
                Rating: {summary.normalizedScore.toFixed(1)}/10
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Solving Time
              </span>
              <span className="text-2xl font-black text-slate-800 font-mono">
                {formatTime(summary.timeElapsed)}
              </span>
              <span className="text-[10px] text-slate-600 block mt-0.5">
                {summary.movesCount} moves • {summary.mistakesCount} mistakes
              </span>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-3 gap-1 text-[11px] text-slate-600">
            <div>
              <span className="block text-slate-600 text-[10px]">Base</span>
              <span className="font-bold text-slate-700">+{summary.baseScore}</span>
            </div>
            <div>
              <span className="block text-slate-600 text-[10px]">Speed</span>
              <span className="font-bold text-emerald-600">+{summary.timeBonus}</span>
            </div>
            <div>
              <span className="block text-slate-600 text-[10px]">Accuracy</span>
              <span className="font-bold text-indigo-600">+{summary.accuracyBonus}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          
          {canNextDifficulty ? (
            <button
              onClick={onNextDifficulty}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Next Difficulty</span> <ArrowRight size={17} />
            </button>
          ) : (
            <button
              onClick={onPlayAgain}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <RotateCcw size={17} /> <span>Play Another Puzzle</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onPlayAgain}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={14} /> Replay Level
            </button>
            <Link
              to="/leaderboard"
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Award size={14} /> Leaderboard
            </Link>
          </div>

          <Link
            to="/games"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 mt-1"
          >
            Back to All Games
          </Link>

        </div>

      </div>
    </div>
  );
};

