import React, { useState, useEffect, useRef } from 'react';
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
import { createAttemptId, getFreshVariantSeed } from '../../utils/puzzlePool';
import { useAuth } from '../../context/AuthContext';

const SWITCH_LEVEL_KEY = 'aptiverse_switch_level';

export const SwitchChallenge: React.FC = () => {
  const { user } = useAuth();
  const [levelIndex, setLevelIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SWITCH_LEVEL_KEY);
      return saved ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  const [attemptId, setAttemptId] = useState<string>(() => createAttemptId());
  const [variantSeed, setVariantSeed] = useState<number>(() => getFreshVariantSeed('switch', user?.id, levelIndex, 30));
  const [puzzle, setPuzzle] = useState(() => getLevel(levelIndex, variantSeed));
  const [state, setState] = useState<SwitchState>(() => createInitialState(puzzle));
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0 || state.status === 'completed') return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, state.status]);

  const { saveSession } = useGameSession('switch');

  useEffect(() => {
    if (state.status === 'completed' && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveSession(levelIndex + 1, 10, 100, Math.max(3, 360 - timeLeft), true, attemptId);
    }
  }, [state.status, levelIndex, timeLeft, attemptId, saveSession]);

  const handleChoice = (index: number) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    setState(submitAnswer(state, index));
  };

  const loadNextLevel = () => {
    const nextIdx = levelIndex + 1;
    setLevelIndex(nextIdx);
    const newSeed = getFreshVariantSeed('switch', user?.id, nextIdx, 30);
    setVariantSeed(newSeed);
    const newPuzzle = getLevel(nextIdx, newSeed);
    setPuzzle(newPuzzle);
    setAttemptId(createAttemptId());
    hasSavedRef.current = false;
    try {
      localStorage.setItem(SWITCH_LEVEL_KEY, String(nextIdx));
    } catch {}
    setState(createInitialState(newPuzzle));
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit, advanceNow } = useAutoAdvance(
    state.status === 'completed', 
    loadNextLevel, 
    1500, 
    timeLeft <= 0
  );

  // Reset keeps the exact same puzzle stable for this attempt without rolling a new one
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
            <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyan-600/20 text-white">
              S
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Switch Challenge</h1>
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
        <div className="flex-1 flex flex-col items-center p-6 relative overflow-y-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Find the correct operator</h2>
            <p className="text-slate-500 text-sm">Select the 4-digit code that transforms the shapes into the output below.</p>
          </div>

          <div className="w-full max-w-xl flex flex-col items-center gap-8">
            <SwitchBoard state={state} onChoiceSelect={handleChoice} />

            {state.status === 'completed' && (
              <div className="w-full p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between animate-in fade-in duration-300">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {state.selectedChoice === puzzle.correctChoiceIndex ? 'Correct Solution!' : 'Completed'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {state.selectedChoice === puzzle.correctChoiceIndex ? 'Well done! Loading next challenge...' : 'Reviewing next step.'}
                  </div>
                </div>
                <Button onClick={advanceNow} size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                  Next Level →
                </Button>
              </div>
            )}

            {/* Timeout Overlay */}
            {timeLeft <= 0 && (
              <div className="absolute inset-0 z-50 bg-red-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in duration-300 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border-4 border-red-500">
                  <h2 className="text-3xl font-extrabold text-red-600 mb-2">Time's Up!</h2>
                  <p className="text-slate-600 mb-6">You reached Level {levelIndex + 1}.</p>
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
