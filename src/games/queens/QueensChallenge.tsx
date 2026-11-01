import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Difficulty, QueensGameState, ScoreSummary } from './types';
import { generateQueensPuzzle } from './generator';
import {
  createInitialState,
  handleCellClick,
  undo,
  redo,
  resetBoard,
  applyHint,
  calculateScoreSummary,
} from './engine';
import { QueensHeader } from './QueensHeader';
import { QueensBoard } from './QueensBoard';
import { QueensToolbar } from './QueensToolbar';
import { QueensInstructions } from './QueensInstructions';
import { QueensCompletion } from './QueensCompletion';
import { useGameSession } from '../../hooks/useGameSession';
import { useAuth } from '../../context/AuthContext';
import { createAttemptId, getFreshVariantSeed } from '../../utils/puzzlePool';

const QUEENS_DIFFICULTY_KEY = 'aptiverse_queens_difficulty';
const QUEENS_LEVEL_KEY = 'aptiverse_queens_level';

const DIFFICULTY_LEVELS: Difficulty[] = ['beginner', 'easy', 'medium', 'hard', 'expert'];

export const QueensChallenge: React.FC = () => {
  const { user } = useAuth();

  // Difficulty selection
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    try {
      const saved = localStorage.getItem(QUEENS_DIFFICULTY_KEY);
      return (saved as Difficulty) || 'beginner';
    } catch {
      return 'beginner';
    }
  });

  // Level index per difficulty
  const [levelIndex, setLevelIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${QUEENS_LEVEL_KEY}_${difficulty}`);
      return saved ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  const [attemptId, setAttemptId] = useState<string>(() => createAttemptId());
  const [variantSeed, setVariantSeed] = useState<number>(() =>
    getFreshVariantSeed('queens', user?.id, levelIndex, 30)
  );

  const [puzzle, setPuzzle] = useState(() =>
    generateQueensPuzzle(difficulty, variantSeed)
  );

  const [gameState, setGameState] = useState<QueensGameState>(() =>
    createInitialState(puzzle)
  );

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [scoreSummary, setScoreSummary] = useState<ScoreSummary | null>(null);

  const hasSavedRef = useRef(false);
  const { saveSession, startAttempt } = useGameSession('queens');

  // Register attempt on server when puzzle begins
  useEffect(() => {
    startAttempt(levelIndex + 1, attemptId);
  }, [levelIndex, attemptId, startAttempt]);

  // Live Timer
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;
        return {
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status]);

  // Completion Detection & Server Submission
  useEffect(() => {
    if (gameState.status === 'completed' && !hasSavedRef.current) {
      hasSavedRef.current = true;
      const summary = calculateScoreSummary(gameState);
      setScoreSummary(summary);
      setIsCompletionOpen(true);

      const accuracy = Math.max(
        40,
        Math.round(100 - gameState.mistakesCount * 12 - gameState.hintsUsed * 8)
      );
      const elapsed = Math.max(3, gameState.timeElapsed);

      saveSession(
        levelIndex + 1,
        summary.normalizedScore,
        accuracy,
        elapsed,
        true,
        attemptId
      );
    }
  }, [
    gameState,
    levelIndex,
    attemptId,
    saveSession,
  ]);

  // Load a new puzzle variant
  const loadPuzzle = useCallback(
    (newDiff: Difficulty, newLevel: number) => {
      setDifficulty(newDiff);
      setLevelIndex(newLevel);
      try {
        localStorage.setItem(QUEENS_DIFFICULTY_KEY, newDiff);
        localStorage.setItem(`${QUEENS_LEVEL_KEY}_${newDiff}`, String(newLevel));
      } catch {}

      const newSeed = getFreshVariantSeed('queens', user?.id, newLevel, 30);
      setVariantSeed(newSeed);
      const newPuzzle = generateQueensPuzzle(newDiff, newSeed);
      setPuzzle(newPuzzle);
      setGameState(createInitialState(newPuzzle));
      setAttemptId(createAttemptId());
      hasSavedRef.current = false;
      setIsCompletionOpen(false);
      setScoreSummary(null);
    },
    [user?.id]
  );

  // Cell Click Handler
  const handleCellAction = (row: number, col: number, overrideMode?: 'queen' | 'x') => {
    setGameState((prev) => handleCellClick(prev, row, col, overrideMode));
  };

  // Undo / Redo / Reset / Hint Handlers
  const handleUndo = () => setGameState((prev) => undo(prev));
  const handleRedo = () => setGameState((prev) => redo(prev));
  const handleReset = () => {
    setGameState((prev) => resetBoard(prev));
    hasSavedRef.current = false;
    setIsCompletionOpen(false);
  };
  const handleHint = () => setGameState((prev) => applyHint(prev));

  // Mode & Toggles
  const handleInputModeChange = (mode: 'queen' | 'x') => {
    setGameState((prev) => ({ ...prev, inputMode: mode }));
  };

  const handleToggleAutoCheck = () => {
    setGameState((prev) => ({ ...prev, autoCheck: !prev.autoCheck }));
  };

  const handleToggleAutoMark = () => {
    setGameState((prev) => ({ ...prev, autoMark: !prev.autoMark }));
  };

  const handleDifficultyChange = (newDiff: Difficulty) => {
    loadPuzzle(newDiff, 0);
  };

  const handleNextDifficulty = () => {
    const currentIdx = DIFFICULTY_LEVELS.indexOf(difficulty);
    if (currentIdx < DIFFICULTY_LEVELS.length - 1) {
      loadPuzzle(DIFFICULTY_LEVELS[currentIdx + 1], 0);
    } else {
      loadPuzzle(difficulty, levelIndex + 1);
    }
  };

  const handlePlayAgain = () => {
    loadPuzzle(difficulty, levelIndex + 1);
  };

  // Count placed queens
  let queensPlaced = 0;
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (gameState.board[r][c] === 'queen') queensPlaced++;
    }
  }

  const currentDiffIdx = DIFFICULTY_LEVELS.indexOf(difficulty);
  const canNextDifficulty = currentDiffIdx < DIFFICULTY_LEVELS.length - 1;

  return (
    <div className="game-container min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col fixed inset-0 z-[100] overflow-y-auto">
      
      {/* Header */}
      <QueensHeader
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        timeElapsed={gameState.timeElapsed}
        queensPlaced={queensPlaced}
        totalQueens={puzzle.size}
        mistakesCount={gameState.mistakesCount}
        onReset={handleReset}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Main Game Play Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 relative">
        
        {/* Title & Guidance */}
        <div className="text-center mb-3">
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
            Place 1 Queen Per Row, Col & Color
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto hidden sm:block">
            Queens cannot touch horizontally, vertically, or diagonally.
          </p>
        </div>

        {/* The Grid Board */}
        <QueensBoard
          state={gameState}
          onCellClick={handleCellAction}
          disabled={gameState.status === 'completed'}
        />

        {/* Interactive Toolbar */}
        <QueensToolbar
          inputMode={gameState.inputMode}
          onInputModeChange={handleInputModeChange}
          canUndo={gameState.history.length > 0}
          canRedo={gameState.redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onHint={handleHint}
          hintsUsed={gameState.hintsUsed}
          autoCheck={gameState.autoCheck}
          onToggleAutoCheck={handleToggleAutoCheck}
          autoMark={gameState.autoMark}
          onToggleAutoMark={handleToggleAutoMark}
          onOpenRules={() => setIsRulesOpen(true)}
          disabled={gameState.status === 'completed'}
        />

      </main>

      {/* How to Play Rules Modal */}
      <QueensInstructions
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Victory / Completion Modal */}
      <QueensCompletion
        isOpen={isCompletionOpen}
        summary={scoreSummary}
        onPlayAgain={handlePlayAgain}
        onNextDifficulty={handleNextDifficulty}
        canNextDifficulty={canNextDifficulty}
      />

    </div>
  );
};

export default QueensChallenge;

