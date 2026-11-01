import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Crown, X as XIcon, RotateCcw, Undo, 
  AlertTriangle, XCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import type { DailyGameType } from '../../services/dailyChallengeService';

// Queens Game Imports
import { 
  createInitialState as createQueensInitialState, 
  handleCellClick as handleQueensCellClick, 
  undo as queensUndo, 
  resetBoard as queensReset 
} from '../../games/queens/engine';
import { QueensBoard } from '../../games/queens/QueensBoard';
import type { QueensGameState, QueensPuzzle } from '../../games/queens/types';

// Motion Game Imports
import { 
  createInitialState as createMotionInitialState, 
  applyMove as applyMotionMove 
} from '../../games/motion/engine';
import { MotionBoard } from '../../games/motion/MotionBoard';
import type { GameState as MotionGameState, Direction, PuzzleDefinition } from '../../games/motion/types';

// Geo Sudoku Imports
import { 
  createInitialState as createSudokuInitialState, 
  applyAnswer as applySudokuAnswer, 
  setActiveCell as setSudokuActiveCell 
} from '../../games/sudoku/engine';
import { GeoSudokuBoard, SymbolIcon } from '../../games/sudoku/GeoSudokuBoard';
import type { GeoSudokuState, GeoSymbol, GeoSudokuPuzzle } from '../../games/sudoku/types';

// Grid Memory Imports
import { 
  createInitialState as createGridInitialState, 
  tickCountdown as tickGridCountdown, 
  submitDistraction as submitGridDistraction, 
  toggleCell as toggleGridCell 
} from '../../games/grid/engine';
import type { GridState, GridPuzzle } from '../../games/grid/types';

// Inductive Imports
import { 
  createInitialState as createInductiveInitialState, 
  toggleSelection as toggleInductiveSelection, 
  submitAnswer as submitInductiveAnswer 
} from '../../games/inductive/engine';
import { InductiveBoard } from '../../games/inductive/InductiveBoard';
import type { InductiveState, InductivePuzzle } from '../../games/inductive/types';

interface DailyPlayableGameProps {
  gameType: DailyGameType;
  challengeConfig: any;
  onSolve: (isCorrect: boolean, score: number, accuracy: number) => void;
  isSolved: boolean;
  disabled?: boolean;
}

export const DailyPlayableGame: React.FC<DailyPlayableGameProps> = ({
  gameType,
  challengeConfig,
  onSolve,
  isSolved,
  disabled = false,
}) => {
  const puzzle = challengeConfig?.puzzle;

  if (!puzzle) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500">
        Loading today's challenge configuration...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      {gameType === 'motion' && (
        <MotionPlayable puzzle={puzzle} onSolve={onSolve} isSolved={isSolved} disabled={disabled} />
      )}
      {gameType === 'queens' && (
        <QueensPlayable puzzle={puzzle} onSolve={onSolve} isSolved={isSolved} disabled={disabled} />
      )}
      {gameType === 'sudoku' && (
        <SudokuPlayable puzzle={puzzle} onSolve={onSolve} isSolved={isSolved} disabled={disabled} />
      )}
      {gameType === 'grid' && (
        <GridPlayable puzzle={puzzle} onSolve={onSolve} isSolved={isSolved} disabled={disabled} />
      )}
      {gameType === 'inductive' && (
        <InductivePlayable puzzle={puzzle} onSolve={onSolve} isSolved={isSolved} disabled={disabled} />
      )}
    </div>
  );
};

// ============================================================================
// 1. MOTION CHALLENGE (SERVER-DELIVERED PUZZLE & IDENTICAL ENGINE)
// ============================================================================
const MotionPlayable: React.FC<{
  puzzle: PuzzleDefinition;
  onSolve: (isCorrect: boolean, score: number, accuracy: number) => void;
  isSolved: boolean;
  disabled: boolean;
}> = ({ puzzle, onSolve, isSolved, disabled }) => {
  const [state, setState] = useState<MotionGameState>(() => createMotionInitialState(puzzle));
  const [history, setHistory] = useState<MotionGameState[]>([]);

  // Reset when puzzle changes
  useEffect(() => {
    setState(createMotionInitialState(puzzle));
    setHistory([]);
  }, [puzzle]);

  const isDraggingRef = useRef(false);
  const dragStartStateRef = useRef<MotionGameState | null>(null);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    dragStartStateRef.current = state;
  }, [state]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMove = useCallback((entityId: string, direction: Direction, steps?: number) => {
    if (state.status !== 'playing' || disabled || isSolved) return false;

    const isDragMove = isDraggingRef.current;
    const newState = applyMoveWithOptimalMoves(state, entityId, direction, steps);

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

      if (newState.status === 'completed') {
        const accuracy = Math.min(100, Math.round(((puzzle.optimalMoves || 10) / Math.max(1, newState.moves)) * 100));
        onSolve(true, 100, accuracy);
      }
      return true;
    }
    return false;
  }, [state, disabled, isSolved, puzzle, onSolve]);

  const applyMoveWithOptimalMoves = (currentState: MotionGameState, id: string, dir: Direction, steps?: number) => {
    return applyMotionMove(currentState, id, dir, steps);
  };

  const handleUndo = () => {
    if (history.length === 0 || disabled || isSolved) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setState(previous);
  };

  const handleReset = () => {
    if (disabled || isSolved) return;
    setState(createMotionInitialState(puzzle));
    setHistory([]);
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-4">
      <div className="flex justify-between items-center w-full px-2">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Moves</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-700">{state.moves}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Target</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-500">{puzzle.optimalMoves || 10}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0 || isSolved}
            className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            <Undo size={14} /> Undo
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSolved}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Restart Board"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center bg-slate-100/80 p-3 sm:p-5 rounded-3xl border border-slate-200">
        <div className="w-full max-w-[340px]">
          <MotionBoard
            state={state}
            onMove={handleMove}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. QUEENS CHALLENGE (SERVER-DELIVERED 7x7 BOARD)
// ============================================================================
const QueensPlayable: React.FC<{
  puzzle: QueensPuzzle;
  onSolve: (isCorrect: boolean, score: number, accuracy: number) => void;
  isSolved: boolean;
  disabled: boolean;
}> = ({ puzzle, onSolve, isSolved, disabled }) => {
  const [inputMode, setInputMode] = useState<'queen' | 'x'>('queen');
  const [state, setState] = useState<QueensGameState>(() => createQueensInitialState(puzzle));

  useEffect(() => {
    setState(createQueensInitialState(puzzle));
  }, [puzzle]);

  const handleCellClick = (row: number, col: number, overrideMode?: 'queen' | 'x') => {
    if (disabled || isSolved || state.status === 'completed') return;
    const mode = overrideMode || inputMode;
    const nextState = handleQueensCellClick(state, row, col, mode);
    setState(nextState);

    if (nextState.status === 'completed') {
      onSolve(true, 100, 100);
    }
  };

  const handleUndo = () => {
    if (disabled || isSolved || state.history.length === 0) return;
    setState(queensUndo(state));
  };

  const handleReset = () => {
    if (disabled || isSolved) return;
    setState(queensReset(state));
  };

  const queensPlaced = state.board.reduce(
    (acc, row) => acc + row.filter((c) => c === 'queen').length,
    0
  );

  return (
    <div className="w-full max-w-lg flex flex-col items-center space-y-4">
      <div className="w-full flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-800">Queens Placed:</span>
          <span className="font-mono font-bold text-primary-700 bg-primary-100/70 px-2.5 py-0.5 rounded-full text-xs">
            {queensPlaced} / {puzzle.size}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
          1 Queen per row, col &amp; color zone • No touching
        </div>
      </div>

      {state.conflicts.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
          <span>{state.conflicts[0].message}</span>
        </div>
      )}

      <div className="w-full flex justify-center">
        <QueensBoard state={state} onCellClick={handleCellClick} disabled={disabled || isSolved} />
      </div>

      <div className="w-full flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setInputMode('queen')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              inputMode === 'queen'
                ? "bg-white text-primary-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Crown size={14} className={inputMode === 'queen' ? "fill-amber-500 text-amber-500" : ""} />
            <span>Place Queen</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('x')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              inputMode === 'x'
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <XIcon size={14} className="text-slate-500" />
            <span>Mark X</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={state.history.length === 0 || isSolved}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors cursor-pointer"
            title="Undo Move"
          >
            <Undo size={15} />
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSolved}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors cursor-pointer"
            title="Reset Board"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. GEO SUDOKU (SERVER-DELIVERED 4x4/5x5 PUZZLE)
// ============================================================================
const SudokuPlayable: React.FC<{
  puzzle: GeoSudokuPuzzle;
  onSolve: (isCorrect: boolean, score: number, accuracy: number) => void;
  isSolved: boolean;
  disabled: boolean;
}> = ({ puzzle, onSolve, isSolved, disabled }) => {
  const [state, setState] = useState<GeoSudokuState>(() => createSudokuInitialState(puzzle));
  const [wrongAttempt, setWrongAttempt] = useState(false);

  useEffect(() => {
    setState(createSudokuInitialState(puzzle));
  }, [puzzle]);

  const handleCellClick = (row: number, col: number) => {
    if (disabled || isSolved || state.status === 'completed') return;
    setState(setSudokuActiveCell(state, row, col));
  };

  const handleSelectSymbol = (symbol: GeoSymbol) => {
    if (disabled || isSolved || state.status === 'completed') return;
    const nextState = applySudokuAnswer(state, symbol);
    setState(nextState);

    if (nextState.status === 'completed') {
      onSolve(true, 100, 100);
    } else if (nextState.status === 'failed') {
      setWrongAttempt(true);
      setTimeout(() => setWrongAttempt(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center space-y-4">
      <div className="w-full flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <span className="font-extrabold text-slate-800">Target Cell:</span>
        <span className="text-[11px] text-slate-600 font-medium">
          Deduce unique geometric shape for the highlighted target cell
        </span>
      </div>

      {wrongAttempt && (
        <div className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
          <XCircle size={15} className="text-rose-600 shrink-0" />
          <span>Incorrect symbol! That shape conflicts with row or column uniqueness.</span>
        </div>
      )}

      <div className="w-full flex justify-center">
        <GeoSudokuBoard state={state} onCellClick={handleCellClick} />
      </div>

      <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-700">Choose Shape to Place:</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {puzzle.symbols.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => handleSelectSymbol(sym)}
              disabled={disabled || isSolved}
              className="p-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 border-2 border-slate-200 hover:border-primary-500 shadow-sm transition-all cursor-pointer flex items-center justify-center w-12 h-12"
              title={`Place ${sym}`}
            >
              <SymbolIcon symbol={sym} className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. GRID MEMORY (SERVER-DELIVERED 6-DOT PATTERN)
// ============================================================================
const GridPlayable: React.FC<{
  puzzle: GridPuzzle;
  onSolve: (isCorrect: boolean, score: number, accuracy: number) => void;
  isSolved: boolean;
  disabled: boolean;
}> = ({ puzzle, onSolve, isSolved, disabled }) => {
  const [state, setState] = useState<GridState>(() => createGridInitialState(puzzle));

  useEffect(() => {
    setState(createGridInitialState(puzzle));
  }, [puzzle]);

  useEffect(() => {
    if (state.phase !== 'memorize') return;
    const interval = setInterval(() => {
      setState(tickGridCountdown);
    }, 1000);
    return () => clearInterval(interval);
  }, [state.phase]);

  const handleDistractionAnswer = (ans: boolean) => {
    if (disabled || isSolved) return;
    setState(submitGridDistraction(state, ans));
  };

  const handleCellClick = (idx: number) => {
    if (disabled || isSolved || state.phase !== 'recreate') return;
    const nextState = toggleGridCell(state, idx);
    setState(nextState);

    if (nextState.phase === 'result' && nextState.result === 'won') {
      const acc = nextState.distractionPassed ? 100 : 70;
      onSolve(true, 100, acc);
    }
  };

  const handleRetry = () => {
    setState(createGridInitialState(puzzle));
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center space-y-4">
      {state.phase === 'memorize' && (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 text-xs font-bold text-amber-800">
            <span>Memorize 6 Dot Positions</span>
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono flex items-center justify-center text-[10px]">
              {state.countdown}s
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2.5 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm w-72 h-72">
            {Array.from({ length: 25 }).map((_, i) => {
              const isDot = puzzle.sequence.includes(i);
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl transition-all",
                    isDot ? "bg-emerald-500 shadow-md shadow-emerald-500/30 scale-105" : "bg-slate-100"
                  )}
                />
              );
            })}
          </div>
        </div>
      )}

      {state.phase === 'distract' && (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <p className="text-xs text-slate-700 text-center max-w-xs font-bold">
            {puzzle.distraction.type === 'symmetry'
              ? 'Is this pattern vertically symmetrical?'
              : 'Are these two patterns identical?'}
          </p>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-28 h-28 grid grid-cols-4 gap-1">
              {puzzle.distraction.grid1.map((v, i) => (
                <div key={i} className={cn("rounded-sm", v ? "bg-amber-400" : "bg-slate-100")} />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDistractionAnswer(true)}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              YES
            </button>
            <button
              type="button"
              onClick={() => handleDistractionAnswer(false)}
              className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              NO
            </button>
          </div>
        </div>
      )}

      {state.phase === 'recreate' && (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between w-full text-xs font-bold text-slate-800 px-1">
            <span>Tap the 6 Memorized Cells:</span>
            <span className="text-emerald-700 font-mono">
              {state.userSelection.length} / {puzzle.dotsCount}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2.5 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm w-72 h-72">
            {Array.from({ length: 25 }).map((_, i) => {
              const isSelected = state.userSelection.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCellClick(i)}
                  className={cn(
                    "rounded-xl border transition-all cursor-pointer flex items-center justify-center",
                    isSelected
                      ? "bg-emerald-500 border-emerald-600 shadow-md shadow-emerald-500/25 scale-105"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  )}
                />
              );
            })}
          </div>
        </div>
      )}

      {state.phase === 'result' && state.result === 'lost' && (
        <div className="flex flex-col items-center space-y-3 p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center animate-fadeIn">
          <XCircle size={28} className="text-rose-600" />
          <div className="text-xs font-bold text-rose-900">Positions did not match!</div>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. INDUCTIVE CHALLENGE (SERVER-DELIVERED RULE SET)
// ============================================================================
const InductivePlayable: React.FC<{
  puzzle: InductivePuzzle;
  onSolve: (isCorrect: boolean, score: number, accuracy: number) => void;
  isSolved: boolean;
  disabled: boolean;
}> = ({ puzzle, onSolve, isSolved, disabled }) => {
  const [state, setState] = useState<InductiveState>(() => createInductiveInitialState(puzzle));
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    setState(createInductiveInitialState(puzzle));
  }, [puzzle]);

  const handleToggle = (idx: number) => {
    if (disabled || isSolved || state.status === 'completed') return;
    setState(toggleInductiveSelection(state, idx));
  };

  const handleSubmit = () => {
    if (disabled || isSolved || state.selectedIndices.length !== 2) return;
    const nextState = submitInductiveAnswer(state);
    setState(nextState);

    if (nextState.status === 'completed') {
      onSolve(true, 100, 100);
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center space-y-4">
      <div className="w-full flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <span className="font-extrabold text-slate-800">Rule Deduction:</span>
        <span className="text-[11px] text-slate-600 font-medium">
          Identify Set A rule &bull; Select the 2 matching test cards
        </span>
      </div>

      {isWrong && (
        <div className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
          <XCircle size={15} className="text-rose-600 shrink-0" />
          <span>That combination does not satisfy Set A rule! Try another pair.</span>
        </div>
      )}

      <div className="w-full flex justify-center scale-95 origin-top">
        <InductiveBoard state={state} onToggle={handleToggle} />
      </div>

      <div className="w-full flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-500 font-medium">
          {state.selectedIndices.length} / 2 Test Cards Selected
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={state.selectedIndices.length !== 2 || isSolved}
          className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          Verify Solution
        </button>
      </div>
    </div>
  );
};
