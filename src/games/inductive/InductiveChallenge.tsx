import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { InductiveState } from './types';
import { getLevel } from './levels';
import { createInitialState, toggleSelection, submitAnswer } from './engine';
import { InductiveBoard } from './InductiveBoard';
import { useGameSession } from '../../hooks/useGameSession';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import FeedbackModal from '../../components/ui/FeedbackModal';
import { createAttemptId, getFreshVariantSeed } from '../../utils/puzzlePool';
import { useAuth } from '../../context/AuthContext';

export const InductiveChallenge: React.FC = () => {
  const STORAGE_KEY = 'inductive_level';
  const { user } = useAuth();

  const [levelIndex, setLevelIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [attemptId, setAttemptId] = useState<string>(() => createAttemptId());
  const [variantSeed, setVariantSeed] = useState<number>(() => getFreshVariantSeed('inductive', user?.id, levelIndex, 30));
  const [puzzle, setPuzzle] = useState(() => getLevel(levelIndex, variantSeed));
  const [state, setState] = useState<InductiveState>(() => createInitialState(puzzle));
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0 || state.status === 'completed') return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, state.status]);

  const { saveSession } = useGameSession('inductive');

  useEffect(() => {
    if (state.status === 'completed' && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveSession(levelIndex + 1, 10, 100, Math.max(3, 360 - timeLeft), true, attemptId);
      try {
        localStorage.setItem(STORAGE_KEY, String(levelIndex + 1));
      } catch {}
    }
  }, [state.status, levelIndex, timeLeft, attemptId, saveSession]);

  const handleToggle = (index: number) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    setState(toggleSelection(state, index));
  };

  const handleSubmit = () => {
    setState(submitAnswer(state));
  };

  const loadNextLevel = () => {
    const nextIdx = levelIndex + 1;
    setLevelIndex(nextIdx);
    const newSeed = getFreshVariantSeed('inductive', user?.id, nextIdx, 30);
    setVariantSeed(newSeed);
    const newPuzzle = getLevel(nextIdx, newSeed);
    setPuzzle(newPuzzle);
    setAttemptId(createAttemptId());
    hasSavedRef.current = false;
    try {
      localStorage.setItem(STORAGE_KEY, String(nextIdx));
    } catch {}
    setState(createInitialState(newPuzzle));
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit, advanceNow } = useAutoAdvance(
    state.status === 'completed', 
    loadNextLevel, 
    1500, 
    timeLeft <= 0
  );

  // Reset clears selection for the current puzzle attempt without re-rolling the puzzle
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
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-600/20 text-white">
              I
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Inductive Challenge</h1>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">Level {levelIndex + 1}</div>
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
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors" title="Restart Level">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
        <div className="text-center mb-6 max-w-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Identify the Rule</h2>
          <p className="text-slate-500 text-sm">
            Study the sets below. Find the hidden pattern and select all matching figures.
          </p>
        </div>

        <InductiveBoard
          state={state}
          onToggle={handleToggle}
        />

        {state.status === 'playing' && (
          <Button
            onClick={handleSubmit}
            disabled={state.selectedIndices.length !== 2}
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-md disabled:opacity-40 cursor-pointer"
          >
            Submit Answer ({state.selectedIndices.length}/2 selected)
          </Button>
        )}

        {state.status === 'completed' && (
          <div className="mt-8 bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 text-center animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-emerald-500/10 z-10 relative">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} />
            </div>
            <h2 className="text-2xl font-extrabold mb-1">Rule Discovered!</h2>
            <p className="font-medium text-emerald-700 mb-4">{puzzle.ruleName}</p>
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
            <h2 className="text-2xl font-extrabold mb-2">Incorrect</h2>
            <p className="font-medium text-red-700 mb-4">The rule was: {puzzle.ruleName}</p>
            <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white font-bold">Try Again</Button>
          </div>
        )}

        {/* Timeout Overlay */}
        {timeLeft <= 0 && (
          <div className="absolute inset-0 z-50 bg-slate-50/80 backdrop-blur-md rounded-xl flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border border-red-500/50">
              <h2 className="text-3xl font-extrabold text-red-500 mb-2">Time's Up!</h2>
              <p className="text-slate-500 mb-6">Session finished! You reached Level {levelIndex + 1}.</p>
              <button 
                onClick={() => { 
                  setTimeLeft(360); 
                  handleReset();
                }}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 cursor-pointer"
              >
                Try Again
              </button>
            </div>
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

export default InductiveChallenge;
