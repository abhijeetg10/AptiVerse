import React, { useState, useEffect } from 'react';
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

export const InductiveChallenge: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [state, setState] = useState<InductiveState>(() => createInitialState(getLevel(0)));
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const { saveSession } = useGameSession('inductive');

  useEffect(() => {
    if (state.status === 'completed') {
      saveSession(levelIndex + 1, 10, 100, 360 - timeLeft, true);
    }
  }, [state.status, levelIndex, timeLeft]);

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
    setState(createInitialState(getLevel(nextIdx)));
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.status === 'completed', loadNextLevel);

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
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-bold shadow-md shadow-red-600/20 text-slate-900">
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
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 relative overflow-y-auto">
        
        <div className="w-full flex justify-center mb-8">
          <InductiveBoard state={state} onToggle={handleToggle} />
        </div>

        {/* Submit Button */}
        {state.status === 'playing' && (
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={state.selectedIndices.length !== 2}
              className="bg-red-600 hover:bg-red-700 text-slate-900 px-12 py-6 rounded-2xl text-lg font-bold shadow-xl shadow-red-600/20 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none transition-all flex items-center gap-2"
            >
              Submit Answer <CheckCircle size={20} />
            </Button>
          </div>
        )}

        {/* Result Overlay */}
        {state.status === 'completed' && (
          <div className="mt-8 bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 text-center animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-emerald-500/10">
            <h2 className="text-2xl font-extrabold mb-2">Correct!</h2>
            <p className="font-medium text-emerald-700 mb-6">The rule was: {state.puzzle.ruleName}</p>
          </div>
        )}

        {state.status === 'failed' && (
          <div className="mt-8 bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200 text-center animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-red-500/10">
            <h2 className="text-2xl font-extrabold mb-2">Incorrect</h2>
            <p className="font-medium text-red-700 mb-4">The rule was: {state.puzzle.ruleName}</p>
            <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-slate-900">Try Again</Button>
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
