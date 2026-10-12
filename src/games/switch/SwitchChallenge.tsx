import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RefreshCw, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { SwitchState } from './types';
import { getLevel } from './levels';
import { createInitialState, submitAnswer } from './engine';
import { SwitchBoard } from './SwitchBoard';
import { useGameSession } from '../../hooks/useGameSession';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import FeedbackModal from '../../components/ui/FeedbackModal';

export const SwitchChallenge: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [state, setState] = useState<SwitchState>(() => createInitialState(getLevel(0)));
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const { saveSession } = useGameSession('switch');

  useEffect(() => {
    if (state.status === 'completed') {
      saveSession(levelIndex + 1, 10, 100, 360 - timeLeft, true);
    }
  }, [state.status, levelIndex, timeLeft]);

  const handleChoice = (index: number) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    setState(submitAnswer(state, index));
  };

  const loadNextLevel = () => {
    const nextIdx = levelIndex + 1;
    setLevelIndex(nextIdx);
    setState(createInitialState(getLevel(nextIdx)));
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.status === 'completed', loadNextLevel, 1500, timeLeft <= 0);

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
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-100">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-white"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyan-600/20 text-white">
              S
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Switch Challenge</h1>
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
          <div className="flex gap-2">
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-white hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 relative">
        
        <div className="flex-1 flex flex-col items-center p-6 relative overflow-y-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Find the correct operator</h2>
            <p className="text-slate-500 text-sm">Select the 4-digit code that transforms the shapes into the output below.</p>
          </div>

          <div className="mb-10 flex justify-center w-full max-w-xl relative">
            <SwitchBoard state={state} onChoiceSelect={handleChoice} />

            {/* Overlays */}
            {state.status === 'completed' && (
              <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white p-7 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border border-slate-100">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-100">
                    <Play size={28} className="fill-emerald-600 ml-1" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Correct Code!</h2>
                  <p className="text-emerald-600 font-bold text-sm mb-5">Level {levelIndex + 1} Solved!</p>
                  
                  <div className="flex flex-col gap-2.5">
                    <button 
                      onClick={loadNextLevel}
                      className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                    >
                      <span>Next Level</span>
                      <Play size={16} className="fill-white ml-0.5" />
                    </button>
                    <Link
                      to="/games"
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      All Games
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {state.status === 'failed' && (
              <div className="absolute inset-0 z-50 bg-slate-50/60 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in duration-300">
                <div className="bg-slate-50 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border border-slate-200">
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Incorrect</h2>
                  <p className="text-red-500 font-bold mb-6">That code produced a different result.</p>
                  <Button onClick={handleReset} className="w-full bg-white hover:bg-neutral-700 border-slate-200">Try Again</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Info */}
        <div className="w-full md:w-80 bg-slate-100 border-l border-slate-200 p-6 flex flex-col z-10">
          <div className="bg-cyan-900/20 border border-cyan-900/50 rounded-xl p-4 flex gap-3">
            <HelpCircle size={20} className="text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-cyan-400 mb-1">How it works</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">
                The 4-digit code changes the order of the shapes.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-mono bg-slate-50 p-2 rounded border border-slate-200">
                Code: 3 1 4 2<br/>
                1st gets 3rd shape<br/>
                2nd gets 1st shape<br/>
                3rd gets 4th shape<br/>
                4th gets 2nd shape
              </p>
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

export default SwitchChallenge;
