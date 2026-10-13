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
import { createAttemptId } from '../../utils/puzzlePool';

const MOTION_LEVEL_KEY = 'aptiverse_motion_level';

export const MotionChallenge: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(MOTION_LEVEL_KEY);
      return saved ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  const [attemptId, setAttemptId] = useState<string>(() => createAttemptId());
  const [puzzle, setPuzzle] = useState(() => getLevel(levelIndex));
  const [state, setState] = useState<GameState>(() => createInitialState(puzzle));
  const [history, setHistory] = useState<GameState[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(360);
  const hasSavedRef = useRef(false);
  
  useEffect(() => {
    if (timeLeft <= 0 || state.status === 'completed') return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, state.status]);

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

  // Save session on complete
  useEffect(() => {
    if (state.status === 'completed' && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveSession(levelIndex + 1, 10, 100, Math.max(3, 360 - timeLeft), true, attemptId);
    }
  }, [state.status, levelIndex, timeLeft, attemptId, saveSession]);

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
    
    const moves = solveBoard(state);
    
    if (!moves || moves.length === 0) {
      alert("No solution found or already solved!");
      setIsSolving(false);
      return;
    }

    let currentState = state;
    for (const move of moves) {
      await new Promise(r => setTimeout(r, 400));
      currentState = applyMove(currentState, move.entityId, move.direction, move.steps);
      setState(currentState);
    }
    
    setIsSolving(false);
  };

  // Reset restores the current attempt board without re-rolling the puzzle or creating duplicate points
  const handleReset = () => {
    setState(createInitialState(puzzle));
    setHistory([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      setState(history[history.length - 1]);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const loadNextLevel = () => {
    const nextIdx = levelIndex + 1;
    setLevelIndex(nextIdx);
    const newPuzzle = getLevel(nextIdx);
    setPuzzle(newPuzzle);
    setAttemptId(createAttemptId());
    hasSavedRef.current = false;
    try {
      localStorage.setItem(MOTION_LEVEL_KEY, String(nextIdx));
    } catch {}
    setState(createInitialState(newPuzzle));
    setHistory([]);
  };

  const handleSkip = () => {
    saveSession(levelIndex + 1, 0, 0, Math.max(3, 360 - timeLeft), false, attemptId);
    loadNextLevel();
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit, advanceNow } = useAutoAdvance(
    state.status === 'completed', 
    loadNextLevel, 
    1500, 
    timeLeft <= 0
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col fixed inset-0 z-[100] overflow-y-auto">
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm font-bold shadow-md shadow-blue-600/20 text-white">
              M
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Motion Challenge</h1>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">Level {levelIndex + 1} • {puzzle.difficulty}</div>
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
            <button onClick={toggleFullScreen} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors" title="Toggle Fullscreen">
              <Maximize size={18} />
            </button>
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors" title="Restart Board">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100 relative">
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto">
          
          <div className="flex flex-col items-center gap-6 max-w-lg w-full">
            <div className="flex justify-between items-center w-full px-4">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Moves</div>
                  <div className="text-2xl font-bold text-slate-700">{state.moves}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Target</div>
                  <div className="text-2xl font-bold text-slate-500">{puzzle.optimalMoves}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0 || isSolving}
                  className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <Undo size={14} /> Undo
                </button>
                <button
                  onClick={handleAutoSolve}
                  disabled={isSolving || state.status !== 'playing'}
                  className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <Lightbulb size={14} /> {isSolving ? 'Solving...' : 'Solve'}
                </button>
                <button
                  onClick={handleSkip}
                  className="px-3 py-2 bg-slate-200 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-300 shadow-xs"
                >
                  Skip
                </button>
              </div>
            </div>

            <MotionBoard
              state={state}
              onMove={handleMove}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />

            {state.status === 'completed' && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between w-full shadow-sm animate-in zoom-in-95">
                <div>
                  <h3 className="font-extrabold text-sm">Target Reached!</h3>
                  <p className="text-xs text-emerald-600 mt-0.5">Completed in {state.moves} moves.</p>
                </div>
                <button
                  onClick={advanceNow}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Next Level →
                </button>
              </div>
            )}
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

export default MotionChallenge;
