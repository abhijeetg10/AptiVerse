import React from 'react';
import { Hexagon, Circle, Square, Triangle, Star, Diamond, Pentagon, X } from 'lucide-react';
import type { GeoSudokuState, GeoSymbol } from './types';

interface GeoSudokuBoardProps {
  state: GeoSudokuState;
  onCellClick: (row: number, col: number) => void;
}

export const SymbolIcon = ({ symbol, className = "" }: { symbol: GeoSymbol, className?: string }) => {
  const props = { fill: "currentColor", className };
  switch (symbol) {
    case "circle": return <Circle {...props} className={`text-blue-500 ${className}`} />;
    case "square": return <Square {...props} className={`text-emerald-500 ${className}`} />;
    case "triangle": return <Triangle {...props} className={`text-amber-500 ${className}`} />;
    case "hexagon": return <Hexagon {...props} className={`text-purple-500 ${className}`} />;
    case "star": return <Star {...props} className={`text-yellow-500 ${className}`} />;
    case "pentagon": return <Pentagon {...props} className={`text-rose-500 ${className}`} />;
    case "diamond": return <Diamond {...props} className={`text-cyan-500 ${className}`} />;
    case "cross": return <X {...props} className={`text-red-500 ${className}`} />;
    default: return null;
  }
};

export const GeoSudokuBoard: React.FC<GeoSudokuBoardProps> = ({ state, onCellClick }) => {
  const { puzzle, status, selectedSymbol, activeCell, userFills } = state;
  const { size, board, target } = puzzle;

  return (
    <div 
      className="bg-neutral-800/60 p-4 rounded-3xl shadow-2xl border border-neutral-700/50 backdrop-blur-sm"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gap: '8px',
        width: '100%',
        maxWidth: `${size * 80}px`,
        aspectRatio: '1 / 1'
      }}
    >
      {board.map((row, r) => 
        row.map((cell, c) => {
          const isTarget = r === target.row && c === target.col;
          const isActive = activeCell?.row === r && activeCell?.col === c;
          const showAnswer = isTarget && status !== "playing";
          const userFill = userFills[`${r}-${c}`];
          
          if (isTarget) {
            return (
              <button 
                key={`${r}-${c}`} 
                onClick={() => onCellClick(r, c)}
                className={`rounded-xl flex items-center justify-center border-2 transition-all ${
                  status === "completed" ? "bg-emerald-900/30 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" :
                  status === "failed" ? "bg-red-900/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" :
                  isActive ? "bg-primary-900/50 border-primary-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105" :
                  "bg-primary-900/20 border-primary-500/50 hover:bg-primary-900/30"
                }`}
              >
                {showAnswer ? (
                  <SymbolIcon symbol={selectedSymbol!} className="w-8 h-8 sm:w-12 sm:h-12" />
                ) : (
                  <span className="text-primary-500 text-3xl sm:text-5xl font-bold">?</span>
                )}
              </button>
            );
          }

          if (cell) {
            return (
              <div key={`${r}-${c}`} className="bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-700/50 shadow-inner">
                <SymbolIcon symbol={cell} className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
            );
          }

          // Empty cell (can be clicked and filled by user)
          return (
            <button 
              key={`${r}-${c}`} 
              onClick={() => onCellClick(r, c)}
              className={`rounded-xl flex items-center justify-center border border-dashed transition-all ${
                isActive ? "bg-neutral-700 border-neutral-400 scale-105 shadow-lg" : "bg-neutral-900/50 border-neutral-700/50 hover:bg-neutral-800"
              }`}
            >
              {userFill && <SymbolIcon symbol={userFill} className="w-8 h-8 sm:w-12 sm:h-12 opacity-50" />}
            </button>
          );
        })
      )}
    </div>
  );
};
