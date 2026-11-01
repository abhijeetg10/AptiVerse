import React, { useState } from 'react';
import { Crown, X as XIcon, AlertTriangle } from 'lucide-react';
import type { QueensGameState, CellCoord } from './types';
import { getRegionColor, getRegionBorders } from './colors';

interface QueensBoardProps {
  state: QueensGameState;
  onCellClick: (row: number, col: number, overrideMode?: 'queen' | 'x') => void;
  disabled?: boolean;
}

export const QueensBoard: React.FC<QueensBoardProps> = ({
  state,
  onCellClick,
  disabled = false,
}) => {
  const { puzzle, board, conflicts, highlightedCell, suggestedCell, activeHint } = state;
  const { size, regions } = puzzle;
  const [hoveredCell, setHoveredCell] = useState<CellCoord | null>(null);

  // Map of conflict messages per cell
  const conflictMap = new Map<string, string>();
  for (const c of conflicts) {
    conflictMap.set(`${c.row},${c.col}`, c.message);
  }

  // Active highlighted cell (either hovered or explicitly highlighted)
  const activeCell = hoveredCell || highlightedCell;

  const handleContextMenu = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (disabled) return;
    // Right click directly toggles X mark
    onCellClick(r, c, 'x');
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      
      {/* Active Hint Banner */}
      {activeHint && (
        <div className="w-full mb-3 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            💡
          </div>
          <div className="flex-1">
            <span className="font-bold text-indigo-800">Hint: </span>
            <span>{activeHint.reason}</span>
          </div>
        </div>
      )}

      {/* Primary Game Board Grid */}
      <div 
        className="relative bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-200/90 w-full aspect-square flex items-center justify-center overflow-hidden"
        onMouseLeave={() => setHoveredCell(null)}
      >
        <div
          className="grid w-full h-full rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: size }).map((_, r) =>
            Array.from({ length: size }).map((_, c) => {
              const regId = regions[r][c];
              const cellVal = board[r][c];
              const cellColor = getRegionColor(regId);
              const borders = getRegionBorders(r, c, regions, size);
              const hasConflict = conflictMap.has(`${r},${c}`);
              const isSuggested = suggestedCell?.row === r && suggestedCell?.col === c;

              // Hover effect calculations
              const isHovered = activeCell?.row === r && activeCell?.col === c;
              const isSameRow = activeCell?.row === r;
              const isSameCol = activeCell?.col === c;
              const isSameRegion = activeCell && regions[activeCell.row][activeCell.col] === regId;
              const isNeighbor =
                activeCell &&
                Math.abs(activeCell.row - r) <= 1 &&
                Math.abs(activeCell.col - c) <= 1 &&
                !isHovered;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => !disabled && onCellClick(r, c)}
                  onContextMenu={(e) => handleContextMenu(e, r, c)}
                  onMouseEnter={() => setHoveredCell({ row: r, col: c })}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors duration-100 ease-out group ${
                    disabled ? 'cursor-not-allowed opacity-80' : ''
                  }`}
                  style={{
                    backgroundColor: cellColor.fill,
                    // Inter-region thick borders
                    borderTopWidth: borders.top ? '2.5px' : '0.5px',
                    borderRightWidth: borders.right ? '2.5px' : '0.5px',
                    borderBottomWidth: borders.bottom ? '2.5px' : '0.5px',
                    borderLeftWidth: borders.left ? '2.5px' : '0.5px',
                    borderTopColor: borders.top ? cellColor.border : 'rgba(148, 163, 184, 0.35)',
                    borderRightColor: borders.right ? cellColor.border : 'rgba(148, 163, 184, 0.35)',
                    borderBottomColor: borders.bottom ? cellColor.border : 'rgba(148, 163, 184, 0.35)',
                    borderLeftColor: borders.left ? cellColor.border : 'rgba(148, 163, 184, 0.35)',
                  }}
                  title={hasConflict ? conflictMap.get(`${r},${c}`) : `Region ${regId + 1}`}
                >
                  {/* Row/Col/Region/Neighbor Hover Wash */}
                  {(isSameRow || isSameCol || isSameRegion) && (
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                      style={{
                        backgroundColor: isHovered
                          ? 'rgba(99, 102, 241, 0.22)'
                          : isSameRegion
                          ? 'rgba(99, 102, 241, 0.12)'
                          : 'rgba(0, 0, 0, 0.04)',
                      }}
                    />
                  )}

                  {/* Neighbor prohibited zone highlight when hovered */}
                  {isNeighbor && (
                    <div className="absolute inset-0 border border-dashed border-red-400/40 bg-red-500/5 pointer-events-none" />
                  )}

                  {/* Suggested Cell Glow (Hint) */}
                  {isSuggested && (
                    <div className="absolute inset-0 ring-4 ring-indigo-500 ring-offset-1 rounded-sm animate-pulse pointer-events-none z-10" />
                  )}

                  {/* Error / Conflict Ring */}
                  {hasConflict && cellVal === 'queen' && (
                    <div className="absolute inset-0 ring-4 ring-red-500 ring-offset-1 rounded-sm bg-red-500/15 animate-bounce pointer-events-none z-10 flex items-start justify-end p-0.5">
                      <AlertTriangle size={12} className="text-red-600 fill-red-100" />
                    </div>
                  )}

                  {/* Content: Queen */}
                  {cellVal === 'queen' && (
                    <div className="transform transition-transform active:scale-95 group-hover:scale-110 z-10">
                      <div className="relative flex items-center justify-center">
                        <Crown
                          size={size <= 7 ? 32 : size <= 9 ? 26 : 22}
                          className={`${
                            hasConflict
                              ? 'text-red-600 fill-red-500 drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]'
                              : 'text-amber-500 fill-amber-400 drop-shadow-[0_2px_6px_rgba(245,158,11,0.55)]'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Content: X mark */}
                  {cellVal === 'x' && (
                    <div className="transform transition-transform group-hover:scale-110 z-10">
                      <XIcon
                        size={size <= 7 ? 20 : size <= 9 ? 16 : 14}
                        className="text-slate-500/80 stroke-[2.5]"
                      />
                    </div>
                  )}

                  {/* Empty cell hover ghost (shows what will be placed) */}
                  {cellVal === 'empty' && isHovered && (
                    <div className="opacity-35 pointer-events-none transform scale-90">
                      {state.inputMode === 'queen' ? (
                        <Crown size={size <= 7 ? 26 : 20} className="text-amber-600 fill-amber-300" />
                      ) : (
                        <XIcon size={size <= 7 ? 16 : 12} className="text-slate-500" />
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Hint on Touch/Right-click */}
      <div className="mt-3 text-[11px] text-slate-600 font-medium flex items-center justify-center gap-4">
        <span>💡 Left-click: Place / remove</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">Right-click: Quick X mark</span>
      </div>

    </div>
  );
};

