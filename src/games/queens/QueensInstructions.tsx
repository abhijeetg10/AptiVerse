import React from 'react';
import { X, Crown, CheckCircle2 } from 'lucide-react';

interface QueensInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueensInstructions: React.FC<QueensInstructionsProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 shrink-0">
            <Crown size={24} className="fill-white" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              How to Play Queens
            </h3>
            <p className="text-xs text-slate-500">
              Inspired by LinkedIn Queens • Pure Logical Deduction
            </p>
          </div>
        </div>

        {/* Objective */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-indigo-950 leading-relaxed">
          <strong className="text-indigo-800">Your Goal:</strong> Place exactly{' '}
          <strong>one Queen (👑)</strong> in every row, every column, and every colored region without any two Queens touching.
        </div>

        {/* 4 Core Rules */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            The 4 Fundamental Rules
          </h4>

          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h5 className="font-bold text-sm text-slate-800">One Queen Per Row</h5>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Every horizontal row on the board must have exactly one Queen.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h5 className="font-bold text-sm text-slate-800">One Queen Per Column</h5>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Every vertical column on the board must have exactly one Queen.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h5 className="font-bold text-sm text-slate-800">One Queen Per Colored Region</h5>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Each colored group of cells must contain exactly one Queen.
              </p>
            </div>
          </div>

          {/* Rule 4: Critical Distinction */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h5 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                <span>No Adjacent Queens</span>
                <span className="text-[10px] bg-amber-200/80 text-amber-800 px-1.5 py-0.2 rounded font-bold uppercase">
                  Important
                </span>
              </h5>
              <p className="text-xs text-amber-800/90 leading-relaxed mt-0.5">
                Two Queens <strong>cannot touch each other</strong> horizontally, vertically, or diagonally.
              </p>
              <div className="mt-2 text-[11px] text-amber-900 font-medium bg-amber-100/70 p-2 rounded-lg border border-amber-200/60">
                ✨ <em>Unlike chess, distant Queens on the same diagonal ARE allowed</em>—they just cannot be directly adjacent in the 8 neighboring cells!
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pro Tips & Strategy
          </h4>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            <li>
              Use <strong>Mark X</strong> mode or right-click to manually cross out and eliminate impossible cells as you deduce the puzzle.
            </li>
            <li>
              When a row, column, or region has only 1 remaining empty cell, placing a Queen there is 100% guaranteed.
            </li>
            <li>
              Optionally enable <strong>Auto-Mark</strong> in the options if you ever prefer automatic elimination, or keep it off to mark cells yourself.
            </li>
          </ul>
        </div>

        {/* Start Playing Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} /> Got It, Let's Play!
        </button>

      </div>
    </div>
  );
};

