import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RefreshCw, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import type { GridState } from './types';
import { createInitialState, tickCountdown, submitDistraction, toggleCell } from './engine';
import { generateGridLevel } from './generator';
import { useGameSession } from '../../hooks/useGameSession';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import FeedbackModal from '../../components/ui/FeedbackModal';

export const GridChallenge: React.FC = () => {
  const [level, setLevel] = useState(1);
  const dotsCount = Math.min(2 + level, 12);
  
  // Generate memory pattern ONCE per level
  const puzzle = useMemo(() => generateGridLevel(`grid-${level}`, dotsCount), [level, dotsCount]);
  
  const [state, setState] = useState<GridState>(() => createInitialState(puzzle));
  const { saveSession } = useGameSession('grid');
  // Reset state when puzzle changes
  useEffect(() => {
    setState(createInitialState(puzzle));
  }, [puzzle]);

  // Save session when won
  useEffect(() => {
    if (state.phase === 'result' && state.result === 'won') {
      saveSession(level, Math.min(10, level), 100, 30, state.distractionPassed ?? true);
    }
  }, [state.phase, state.result, level, state.distractionPassed]);

  // Countdown timer
  useEffect(() => {
    if (state.phase === 'memorize' && state.countdown > 0) {
      const timer = setTimeout(() => {
        setState(prev => tickCountdown(prev));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.countdown]);

  const loadNextLevel = () => {
    setLevel(l => l + 1);
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.phase === 'result' && state.result === 'won', loadNextLevel);

  const handleDistractionAnswer = (answer: boolean) => {
    setState(prev => submitDistraction(prev, answer));
  };

  const handleCellClick = (index: number) => {
    setState(prev => toggleCell(prev, index));
  };

  const { phase, countdown, distractionPassed, userSelection, result } = state;
  const { distraction, sequence, gridSize } = puzzle;

  return (
    <div className="game-container min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col fixed inset-0 z-[100]">
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-100">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-white"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-emerald-600/20 text-white">
              G
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Grid Challenge</h1>
              <div className="text-xs text-slate-500 font-medium tracking-wider">LEVEL {level} • {dotsCount} DOTS</div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold", phase === 'memorize' ? "bg-primary-500 text-white" : "text-slate-500")}>1. MEMORIZE</div>
          <div className="w-4 h-px bg-neutral-700"></div>
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold", phase === 'distract' ? "bg-amber-500 text-white" : "text-slate-500")}>2. DISTRACT</div>
          <div className="w-4 h-px bg-neutral-700"></div>
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold", phase === 'recreate' ? "bg-emerald-500 text-white" : "text-slate-500")}>3. RECALL</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setState(createInitialState(puzzle))} className="w-10 h-10 rounded-lg bg-white hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative bg-slate-50 overflow-hidden">
        
        {phase === 'memorize' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Memorize the sequence</h2>
            <div className="text-slate-500 text-sm mb-10 flex items-center gap-2">
               Time remaining: <span className="font-mono text-primary-400 font-bold text-lg">{countdown}s</span>
            </div>

            <div className="bg-white/80 p-6 rounded-3xl shadow-2xl border border-slate-200/50 backdrop-blur-sm relative">
              <div className="grid grid-cols-5 gap-3 sm:gap-4 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
                {Array.from({ length: gridSize }).map((_, i) => {
                  const isPresent = sequence.includes(i);
                  return (
                    <div key={i} className="flex items-center justify-center bg-white rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
                      {isPresent && (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-500 shadow-[0_4px_12px_rgba(99,102,241,0.4)] animate-in zoom-in duration-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {phase === 'distract' && distraction && (
          <div className="flex flex-col items-center animate-in slide-in-from-right duration-500">
            <div className="bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-sm font-bold mb-4 flex items-center gap-2 border border-amber-500/20">
               <ShieldAlert size={16} /> DISTRACTION TASK
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center max-w-md">
              {distraction.type === 'symmetry' ? "Is this shape vertically symmetrical?" : "Are these two shapes exactly identical?"}
            </h2>
            <p className="text-slate-500 text-sm mb-10">Answer quickly to proceed to the recall phase.</p>

            <div className="flex gap-6 sm:gap-10 mb-10">
              <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100">
                 <div className="w-32 h-32 sm:w-40 sm:h-40 grid grid-cols-4 gap-1.5">
                    {distraction.grid1.map((v, i) => (
                      <div key={i} className={cn("rounded-md transition-colors", v ? "bg-amber-400 shadow-sm" : "bg-slate-50")}></div>
                    ))}
                 </div>
              </div>
              
              {distraction.type === 'matching' && distraction.grid2 && (
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100">
                   <div className="w-32 h-32 sm:w-40 sm:h-40 grid grid-cols-4 gap-1.5">
                      {distraction.grid2.map((v, i) => (
                        <div key={i} className={cn("rounded-md transition-colors", v ? "bg-amber-400 shadow-sm" : "bg-slate-50")}></div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => handleDistractionAnswer(true)} className="w-32 h-12 bg-emerald-600 hover:bg-emerald-500 text-white border-0">YES</Button>
              <Button onClick={() => handleDistractionAnswer(false)} className="w-32 h-12 bg-error hover:bg-red-500 text-white border-0">NO</Button>
            </div>
          </div>
        )}

        {phase === 'recreate' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-emerald-500 mb-2">Recall the positions</h2>
            <p className="text-slate-500 text-sm mb-10">Select the <span className="font-bold text-slate-700">{dotsCount}</span> cells that were previously highlighted.</p>

            {distractionPassed === false && (
              <div className="absolute top-6 bg-error/20 text-error px-4 py-2 rounded-lg border border-error/50 flex items-center gap-2">
                 <XCircle size={18} /> Distraction task failed. Penalty applied.
              </div>
            )}

            <div className="bg-white/80 p-6 rounded-3xl shadow-2xl border border-slate-200/50 backdrop-blur-sm relative">
              <div className="grid grid-cols-5 gap-3 sm:gap-4 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
                {Array.from({ length: gridSize }).map((_, i) => {
                  const isSelected = userSelection.includes(i);
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleCellClick(i)}
                      className={cn(
                        "flex items-center justify-center rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all focus:outline-none hover:scale-[1.02]",
                        isSelected ? "bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)] scale-105 border-emerald-400" : "bg-white hover:bg-slate-50"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="flex flex-col items-center bg-slate-50/90 p-8 rounded-3xl border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
             {result === 'won' ? (
               <>
                 <CheckCircle2 size={64} className="text-emerald-500 mb-4" />
                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Positions Recalled!</h2>
                 <p className="text-slate-500 mb-2">You successfully remembered all {dotsCount} dots.</p>
                 {distractionPassed === false && <p className="text-error text-sm mb-6">However, you failed the distraction task.</p>}
                 {distractionPassed === true && <p className="text-emerald-400 text-sm mb-6">Perfect focus! Distraction task passed.</p>}
               </>
             ) : (
               <>
                 <XCircle size={64} className="text-error mb-4" />
                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Wrong Positions</h2>
                 <p className="text-slate-500 mb-6">You selected an incorrect coordinate.</p>
                 <Button onClick={() => setState(createInitialState(puzzle))} size="lg" variant="secondary" className="px-10 bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200">Try Again</Button>
               </>
             )}
          </div>
        )}

      </main>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={handleFeedbackClose} 
        onSubmit={handleFeedbackSubmit} 
      />
    </div>
  );
};

export default GridChallenge;
