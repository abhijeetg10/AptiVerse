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
      className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-xl border border-slate-200/60"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gap: '12px',
        width: '100%',
        maxWidth: `${size * 90}px`,
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
                className={`rounded-2xl flex items-center justify-center border-4 transition-all duration-300 ${
                  status === "completed" ? "bg-emerald-50 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]" :
                  status === "failed" ? "bg-red-50 border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.3)]" :
                  isActive ? "bg-primary-50 border-primary-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110 z-10" :
                  "bg-primary-50/50 border-primary-300 hover:bg-primary-100 hover:border-primary-400"
                }`}
              >
                {showAnswer ? (
                  <SymbolIcon symbol={selectedSymbol!} className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-md" />
                ) : (
                  <span className="text-primary-500 text-4xl sm:text-6xl font-black drop-shadow-sm animate-pulse">?</span>
                )}
              </button>
            );
          }

          if (cell) {
            return (
              <div key={`${r}-${c}`} className="bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)]">
                <SymbolIcon symbol={cell} className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-sm" />
              </div>
            );
          }

          // Empty cell (can be clicked and filled by user)
          return (
            <button 
              key={`${r}-${c}`} 
              onClick={() => onCellClick(r, c)}
              className={`rounded-2xl flex items-center justify-center border-2 border-dashed transition-all duration-200 ${
                isActive ? "bg-slate-100 border-slate-400 scale-105 shadow-lg z-10" : "bg-transparent border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {userFill && <SymbolIcon symbol={userFill} className="w-8 h-8 sm:w-12 sm:h-12 opacity-40 drop-shadow-sm" />}
            </button>
          );
        })
      )}
    </div>
  );
};
