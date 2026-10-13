import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RefreshCw, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { GeoSudokuState, GeoSymbol } from './types';
import { getLevel } from './levels';
import { createInitialState, applyAnswer, setActiveCell } from './engine';
import { GeoSudokuBoard, SymbolIcon } from './GeoSudokuBoard';
import { useGameSession } from '../../hooks/useGameSession';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import FeedbackModal from '../../components/ui/FeedbackModal';
import { createAttemptId, getFreshVariantSeed } from '../../utils/puzzlePool';
import { useAuth } from '../../context/AuthContext';

const SUDOKU_LEVEL_KEY = 'aptiverse_sudoku_level';

export const GeoSudokuChallenge: React.FC = () => {
  const { user } = useAuth();
  const [levelIndex, setLevelIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SUDOKU_LEVEL_KEY);
      return saved ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  const [attemptId, setAttemptId] = useState<string>(() => createAttemptId());
  const [variantSeed, setVariantSeed] = useState<number>(() => getFreshVariantSeed('sudoku', user?.id, levelIndex, 30));
  const [puzzle, setPuzzle] = useState(() => getLevel(levelIndex, variantSeed));
  const [state, setState] = useState<GeoSudokuState>(() => createInitialState(puzzle));
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0 || state.status === 'completed') return;
    const timer = setInterval(() => {
      setTimeLeft(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, state.status]);

  const { saveSession } = useGameSession('sudoku');

  useEffect(() => {
    if (state.status === 'completed' && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveSession(levelIndex + 1, 10, 100, Math.max(3, 360 - timeLeft), true, attemptId);
    }
  }, [state.status, levelIndex, timeLeft, attemptId, saveSession]);

  const handleAnswer = (symbol: GeoSymbol) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    setState(applyAnswer(state, symbol));
  };

  const loadNextLevel = () => {
    const nextIdx = levelIndex + 1;
    setLevelIndex(nextIdx);
    const newSeed = getFreshVariantSeed('sudoku', user?.id, nextIdx, 30);
    setVariantSeed(newSeed);
    const newPuzzle = getLevel(nextIdx, newSeed);
    setPuzzle(newPuzzle);
    setAttemptId(createAttemptId());
    hasSavedRef.current = false;
    try {
      localStorage.setItem(SUDOKU_LEVEL_KEY, String(nextIdx));
    } catch {}
    setState(createInitialState(newPuzzle));
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit, advanceNow } = useAutoAdvance(
    state.status === 'completed', 
    loadNextLevel, 
    1500, 
    timeLeft <= 0
  );

  // Reset preserves the exact current puzzle and board inputs without re-rolling
  const handleReset = () => {
    setState(createInitialState(puzzle));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col fixed inset-0 z-[100]">
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-100">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-white"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-600/20 text-white">
              S
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Geo Sudoku</h1>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">Level {levelIndex + 1} - {puzzle.difficulty}</div>
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
          <div className="flex gap-2">
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-white hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors" title="Restart Level">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 relative">
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Identify the missing symbol</h2>
            <p className="text-slate-500 text-sm">Find which symbol fits the target cell based on row and column constraints.</p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <GeoSudokuBoard
              state={state}
              onCellClick={(row: number, col: number) => setState(setActiveCell(state, row, col))}
            />

            {/* Symbol Palette */}
            <div className="flex gap-4 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
              {puzzle.symbols.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleAnswer(symbol)}
                  disabled={state.status !== 'playing' || timeLeft <= 0}
                  className="w-14 h-14 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer border border-slate-100"
                >
                  <SymbolIcon symbol={symbol} className="w-7 h-7" />
                </button>
              ))}
            </div>
          </div>

          {state.status === 'completed' && (
            <div className="mt-8 bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 text-center animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-emerald-500/10 z-10 relative">
              <h2 className="text-2xl font-extrabold mb-1">Sudoku Solved!</h2>
              <p className="font-medium text-emerald-700 mb-4">Level {levelIndex + 1} completed.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={advanceNow}
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Next Level →
                </button>
                <Link
                  to="/games"
                  className="py-3 px-5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-xl text-center transition-colors flex items-center justify-center"
                >
                  All Games
                </Link>
              </div>
            </div>
          )}

          {state.status === 'failed' && (
            <div className="mt-8 bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200 text-center animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-red-500/10 z-10 relative">
              <h2 className="text-2xl font-extrabold mb-1">Incorrect Symbol</h2>
              <p className="font-medium text-red-700 mb-4">That symbol violates row or column constraints. Try again!</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={18} /> Try Again
                </button>
                <Link
                  to="/games"
                  className="py-3 px-5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-xl text-center transition-colors flex items-center justify-center"
                >
                  All Games
                </Link>
              </div>
            </div>
          )}

          {/* Timeout Overlay */}
          {timeLeft <= 0 && (
            <div className="absolute inset-0 z-50 bg-red-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in duration-300 p-4">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border-4 border-red-500">
                <h2 className="text-3xl font-extrabold text-red-600 mb-2">Time's Up!</h2>
                <p className="text-slate-600 mb-6">Session finished! You reached Level {levelIndex + 1}.</p>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => { setTimeLeft(360); handleReset(); }}
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 cursor-pointer"
                  >
                    Try Again
                  </button>
                  <Link
                    to="/games"
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center"
                  >
                    All Games
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Info */}
        <div className="w-full md:w-80 bg-slate-100 border-l border-slate-200 p-6 flex flex-col z-10">
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-amber-900/10 border border-amber-900/20 rounded-xl p-4 flex gap-3">
              <HelpCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800 mb-1">Sudoku Rule</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus on the row and column intersecting at the <span className="text-amber-700 font-bold">?</span> mark. Eliminate shapes that already exist in that row or column.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={handleFeedbackClose} 
        onSubmit={handleFeedbackSubmit} 
      />
    </div>
  );
};

export default GeoSudokuChallenge;
