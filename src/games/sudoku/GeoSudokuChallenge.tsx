import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RefreshCw, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { GeoSudokuState, GeoSymbol } from './types';
import { getLevel } from './levels';
import { createInitialState, applyAnswer, setActiveCell } from './engine';
import { GeoSudokuBoard, SymbolIcon } from './GeoSudokuBoard';
import { useGameSession } from '../../hooks/useGameSession';
import FeedbackModal from '../../components/ui/FeedbackModal';

export const GeoSudokuChallenge: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [state, setState] = useState<GeoSudokuState>(() => createInitialState(getLevel(0)));
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const { saveSession } = useGameSession('geo_sudoku');

  useEffect(() => {
    if (state.status === 'completed') {
      saveSession(levelIndex + 1, 10, 100, 360 - timeLeft, true);
    }
  }, [state.status, levelIndex, timeLeft]);

  const handleAnswer = (symbol: GeoSymbol) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    setState(applyAnswer(state, symbol));
  };

  const loadNextLevel = () => {
    const nextIdx = levelIndex + 1;
    setLevelIndex(nextIdx);
    setState(createInitialState(getLevel(nextIdx)));
  };

  const handleReset = () => {
    setState(createInitialState(getLevel(levelIndex)));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col fixed inset-0 z-[100]">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-100">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-white"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-500/20 text-neutral-900">
              S
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Geo Sudoku</h1>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">Level {levelIndex + 1} - {state.puzzle.difficulty}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Time Left</span>
            <span className={`font-mono text-xl font-bold tracking-tight ${timeLeft < 60 ? 'text-red-500' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 relative">
        
        {/* Game Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Find the missing shape</h2>
            <p className="text-slate-500 text-sm">Every row and column must contain exactly one of each shape.</p>
          </div>

          <div className="mb-10 w-full flex justify-center">
            <GeoSudokuBoard state={state} onCellClick={(r, c) => setState(prev => setActiveCell(prev, r, c))} />
          </div>

          {/* Answer Options */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Select the missing shape</span>
            <div className="flex flex-wrap justify-center gap-4 max-w-lg">
              {state.puzzle.symbols.map(symbol => (
                <button 
                  key={symbol}
                  onClick={() => handleAnswer(symbol)}
                  disabled={state.status !== 'playing'}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-neutral-700 hover:scale-105 hover:border-neutral-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SymbolIcon symbol={symbol} className="w-8 h-8 sm:w-10 sm:h-10" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Completion Overlay */}
          {state.status === 'completed' && (
            <div className="absolute inset-0 z-50 bg-slate-50/60 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in duration-300">
              <div className="bg-slate-50 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border border-slate-200">
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Level Complete!</h2>
                <p className="text-emerald-500 font-bold mb-6">Great job!</p>
                <div className="flex flex-col gap-3 mt-4">
                  <button 
                    onClick={loadNextLevel}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
                  >
                    Next Level
                  </button>
                  <button 
                    onClick={() => setIsFeedbackOpen(true)}
                    className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Leave Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Failure Overlay */}
          {state.status === 'failed' && (
            <div className="absolute inset-0 z-50 bg-slate-50/60 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in duration-300">
              <div className="bg-slate-50 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border border-slate-200">
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Incorrect</h2>
                <p className="text-red-500 font-bold mb-6">That shape breaks the rule.</p>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={handleReset}
                    className="flex-1 py-3 bg-neutral-700 text-white font-bold rounded-xl hover:bg-neutral-600 transition-colors flex justify-center items-center gap-2"
                  >
                    <RefreshCw size={18} /> Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeout Overlay */}
          {timeLeft <= 0 && (
            <div className="absolute inset-0 z-50 bg-slate-50/80 backdrop-blur-md rounded-xl flex items-center justify-center animate-in fade-in duration-300">
              <div className="bg-slate-100 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border border-red-500/50">
                <h2 className="text-3xl font-extrabold text-red-500 mb-2">Time's Up!</h2>
                <p className="text-slate-500 mb-6">You've completed {levelIndex} levels.</p>
                <button 
                  onClick={() => { setTimeLeft(360); setLevelIndex(0); handleReset(); }}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                >
                  Restart Assessment
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Panel - Info */}
        <div className="w-full md:w-80 bg-slate-100 border-l border-slate-200 p-6 flex flex-col z-10">
          <div className="flex-1 flex flex-col gap-6">
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Logic Progress</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Target Row</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-500">Target Column</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-white my-2"></div>

            {/* Tips / Instructions */}
            <div className="bg-amber-900/20 border border-amber-900/50 rounded-xl p-4 flex gap-3">
              <HelpCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-400 mb-1">Sudoku Rule</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Focus on the row and column intersecting at the <span className="text-primary-400 font-bold">?</span> mark. Eliminate shapes that already exist in that row or column.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-auto pt-6">
             <Button className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:bg-neutral-700 border border-slate-200">Get a Hint (-50pts)</Button>
          </div>
        </div>

      </main>

    </div>
  );
};

export default GeoSudokuChallenge;
