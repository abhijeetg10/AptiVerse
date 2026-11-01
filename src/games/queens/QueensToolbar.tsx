import React from 'react';
import { Crown, X as XIcon, Undo2, Redo2, Lightbulb, CheckSquare, Sparkles, HelpCircle } from 'lucide-react';

interface QueensToolbarProps {
  inputMode: 'queen' | 'x';
  onInputModeChange: (mode: 'queen' | 'x') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  hintsUsed: number;
  autoCheck: boolean;
  onToggleAutoCheck: () => void;
  autoMark: boolean;
  onToggleAutoMark: () => void;
  onOpenRules: () => void;
  disabled?: boolean;
}

export const QueensToolbar: React.FC<QueensToolbarProps> = ({
  inputMode,
  onInputModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onHint,
  hintsUsed,
  autoCheck,
  onToggleAutoCheck,
  autoMark,
  onToggleAutoMark,
  onOpenRules,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mt-4 px-2 flex flex-col gap-3">
      
      {/* Primary Action Row: Mode Switcher & Undo/Redo/Hint */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-md flex items-center justify-between gap-2">
        
        {/* Mode Toggle: Queen vs X */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => onInputModeChange('queen')}
            disabled={disabled}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              inputMode === 'queen'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown size={15} className={inputMode === 'queen' ? 'fill-white' : ''} />
            <span>Place Queen</span>
          </button>

          <button
            onClick={() => onInputModeChange('x')}
            disabled={disabled}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              inputMode === 'x'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <XIcon size={15} className="stroke-[2.5]" />
            <span>Mark X</span>
          </button>
        </div>

        {/* Undo / Redo / Hint buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          <button
            onClick={onUndo}
            disabled={!canUndo || disabled}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center transition-all active:scale-95"
            title="Undo Move"
          >
            <Undo2 size={17} />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo || disabled}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center transition-all active:scale-95"
            title="Redo Move"
          >
            <Redo2 size={17} />
          </button>

          <button
            onClick={onHint}
            disabled={disabled}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="Get Smart Hint"
          >
            <Lightbulb size={15} className="fill-indigo-500" />
            <span className="hidden xs:inline">Hint</span>
            {hintsUsed > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                {hintsUsed}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Auxiliary Options Bar: Auto-Check, Auto-Mark, Rules */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        
        <div className="flex items-center gap-3">
          {/* Auto-check toggle */}
          <button
            onClick={onToggleAutoCheck}
            className={`flex items-center gap-1.5 font-semibold px-2 py-1 rounded-lg transition-colors ${
              autoCheck ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Show rule violations immediately"
          >
            <CheckSquare size={14} className={autoCheck ? 'text-indigo-600' : 'text-slate-400'} />
            <span>Auto-Check</span>
          </button>

          {/* Auto-mark toggle */}
          <button
            onClick={onToggleAutoMark}
            className={`flex items-center gap-1.5 font-semibold px-2 py-1 rounded-lg transition-colors ${
              autoMark ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Automatically place X on blocked cells when Queen is set"
          >
            <Sparkles size={14} className={autoMark ? 'text-indigo-600' : 'text-slate-400'} />
            <span>Auto-Mark</span>
          </button>
        </div>

        {/* How to Play link */}
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1 font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <HelpCircle size={14} />
          <span>Rules</span>
        </button>

      </div>

    </div>
  );
};

