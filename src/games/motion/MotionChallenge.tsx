import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Direction } from './types';
import { getLevel } from './levels';
import { createInitialState, applyMove } from './engine';
import { solveBoard } from './solver';
import { MotionBoard } from './MotionBoard';
import { RefreshCw, Undo, Play, ArrowLeft, Maximize, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import FeedbackModal from '../../components/ui/FeedbackModal';

export const MotionChallenge: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [state, setState] = useState<GameState>(() => createInitialState(getLevel(0)));
  const [history, setHistory] = useState<GameState[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  // Timer for 6-minute assessment (360 seconds)
  const [timeLeft, setTimeLeft] = useState(360);
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Fullscreen logic
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const { saveSession } = useGameSession('motion');

  const calculateScore = () => {
    const extraMoves = Math.max(0, state.moves - state.optimalMoves);
    return Math.max(100, 1000 - extraMoves * 25);
  };

  // Save session on complete
  useEffect(() => {
    if (state.status === 'completed') {
      saveSession(levelIndex + 1, 10, 100, 360 - timeLeft, true);
    }
  }, [state.status, levelIndex, timeLeft]);

  const isDraggingRef = useRef(false);
  const dragStartStateRef = useRef<GameState | null>(null);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    dragStartStateRef.current = state;
  }, [state]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMove = useCallback((entityId: string, direction: Direction, steps?: number) => {
    if (state.status !== 'playing' || timeLeft <= 0 || isSolving) return false;
    
    const isDragMove = isDraggingRef.current;
    const newState = applyMove(state, entityId, direction, steps);
    
    if (newState !== state && newState.moves > state.moves) {
      if (isDragMove && dragStartStateRef.current) {
        newState.moves = dragStartStateRef.current.moves + 1;
        
        setHistory(prev => {
          if (state === dragStartStateRef.current) {
            return [...prev, state];
          }
          return prev;
        });
      } else {
        setHistory(prev => [...prev, state]);
      }
      setState(newState);
      return true;
    }
    return false;
  }, [state, timeLeft, isSolving]);

  const handleAutoSolve = async () => {
    if (isSolving || state.status !== 'playing') return;
    setIsSolving(true);
    
    // We run the solver on the current state!
    const moves = solveBoard(state);
    
    if (!moves || moves.length === 0) {
      alert("No solution found or already solved!");
      setIsSolving(false);
      return;
    }

    let currentState = state;
    for (const move of moves) {
      // delay for animation effect
      await new Promise(r => setTimeout(r, 400));
      currentState = applyMove(currentState, move.entityId, move.direction, move.steps);
      setState(currentState);
    }
    
    setIsSolving(false);
  };

  const handleReset = () => {
    // Generate a fresh variant of the current difficulty
    setState(createInitialState(getLevel(levelIndex)));
    setHistory([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      setState(history[history.length - 1]);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleSkip = () => {
    saveSession(levelIndex + 1, 0, 0, 360 - timeLeft, false);
    loadNextLevel();
  };

  const loadNextLevel = () => {
    const nextIdx = levelIndex + 1;
    setLevelIndex(nextIdx);
    setState(createInitialState(getLevel(nextIdx)));
    setHistory([]);
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.status === 'completed', loadNextLevel);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/20 text-white">
              MC
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-slate-900">Motion Challenge</h1>
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
            <button onClick={handleAutoSolve} disabled={isSolving || state.status !== 'playing'} className="w-10 h-10 rounded-lg bg-amber-100 hover:bg-amber-200 flex items-center justify-center text-amber-700 transition-colors disabled:opacity-50" title="Auto Solve (Hint)">
              <Lightbulb size={18} />
            </button>
            <button onClick={toggleFullScreen} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors" title="Toggle Fullscreen">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start justify-center">
          
          {/* Left panel - Progress & Stats */}
          <div className="w-full md:w-64 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="mb-6">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Progress</p>
              <p className="text-xl font-bold text-slate-800">Level {levelIndex + 1}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase">Moves</p>
                <p className="text-2xl font-bold text-slate-800">{state.moves}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase">Best</p>
                <p className="text-2xl font-bold text-slate-800">{state.optimalMoves}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleUndo} 
                disabled={history.length === 0 || state.status !== 'playing'}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Undo size={16} /> Undo
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>
            
            <button 
              onClick={handleSkip}
              disabled={state.status !== 'playing'}
              className="w-full mt-2 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip Level (Counts as Wrong)
            </button>
          </div>

          {/* Board Area */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[500px]">
              <MotionBoard 
                state={state} 
                onMove={handleMove} 
                onDragStart={handleDragStart} 
                onDragEnd={handleDragEnd} 
              />

              {/* Completion Overlay */}
              {state.status === 'completed' && (
                <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in duration-300">
                  <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Level Complete!</h2>
                    <p className="text-green-600 font-bold mb-6">Great job!</p>
                  </div>
                </div>
              )}

              {/* Timeout Overlay */}
              {timeLeft <= 0 && (
                <div className="absolute inset-0 z-50 bg-red-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in duration-300">
                  <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all border-4 border-red-500">
                    <h2 className="text-3xl font-extrabold text-red-600 mb-2">Time's Up!</h2>
                    <p className="text-slate-600 mb-6">You've completed {levelIndex} levels in 6 minutes.</p>
                    <button 
                      onClick={() => { setTimeLeft(360); setLevelIndex(0); handleReset(); }}
                      className="w-full py-3 bg-red-600 text-slate-900 font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
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
