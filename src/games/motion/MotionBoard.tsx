import React, { useRef, useState, useEffect } from 'react';
import type { GameState, Direction, MovableBlock } from './types';
import { cn } from '../../utils/cn';

interface MotionBoardProps {
  state: GameState;
  onMove: (entityId: string, direction: Direction, steps?: number) => boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const MotionBoard: React.FC<MotionBoardProps> = ({ state, onMove, onDragStart, onDragEnd }) => {
  const { rows, cols, ball, target, blocks, walls } = state;
  const boardRef = useRef<HTMLDivElement>(null);

  const [dragId, setDragId] = useState<string | null>(null);
  
  // We need refs to keep track of drag data across renders smoothly
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  const dragIdRef = useRef<string | null>(null);
  // To restrict axis during drag without state update lag
  const dragOrientationRef = useRef<"horizontal" | "vertical" | "any">( "any" );

  const getCellSize = () => {
    if (!boardRef.current) return 50;
    return boardRef.current.clientWidth / cols;
  };

  const handlePointerDown = (id: string, orientation: "horizontal" | "vertical" | "any", e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    
    setDragId(id);
    dragIdRef.current = id;
    dragOrientationRef.current = orientation;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    onDragStart?.();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current || dragIdRef.current !== e.currentTarget.getAttribute('data-id')) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    const cellSize = getCellSize();
    const threshold = cellSize * 0.45; // 45% of a cell to trigger snap

    let moveX = 0;
    let moveY = 0;

    const orient = dragOrientationRef.current;
    
    if (orient === "horizontal" || orient === "any") {
      if (Math.abs(dx) > threshold) moveX = Math.sign(dx);
    }
    if (orient === "vertical" || orient === "any") {
      if (Math.abs(dy) > threshold) moveY = Math.sign(dy);
    }

    if ((moveX !== 0 || moveY !== 0) && dragIdRef.current) {
      if (Math.abs(dx) > Math.abs(dy) || orient === "horizontal") {
        if (moveX !== 0) {
          const moved = onMove(dragIdRef.current, moveX > 0 ? 'RIGHT' : 'LEFT', 1);
          if (moved) dragStartRef.current.x += moveX * cellSize;
        }
      } else {
        if (moveY !== 0) {
          const moved = onMove(dragIdRef.current, moveY > 0 ? 'DOWN' : 'UP', 1);
          if (moved) dragStartRef.current.y += moveY * cellSize;
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragId(null);
    dragIdRef.current = null;
    dragStartRef.current = null;
    onDragEnd?.();
  };

  // Keyboard navigation for ball
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); onMove('ball', 'UP'); break;
        case 'ArrowDown': e.preventDefault(); onMove('ball', 'DOWN'); break;
        case 'ArrowLeft': e.preventDefault(); onMove('ball', 'LEFT'); break;
        case 'ArrowRight': e.preventDefault(); onMove('ball', 'RIGHT'); break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove]);

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    yellow: 'bg-amber-400',
    purple: 'bg-purple-500',
    green: 'bg-emerald-500',
    teal: 'bg-teal-500',
    indigo: 'bg-indigo-500',
    orange: 'bg-orange-500'
  };

  const toPct = (val: number, max: number) => `${(val / max) * 100}%`;

  const getWidth = (b: MovableBlock) => b.orientation === "horizontal" ? b.length : 1;
  const getHeight = (b: MovableBlock) => b.orientation === "vertical" ? b.length : 1;

  return (
    <div 
      ref={boardRef}
      className="bg-slate-300 w-full max-w-[600px] mx-auto relative overflow-hidden shadow-2xl rounded-xl touch-none"
      style={{ aspectRatio: `${cols} / ${rows}`, border: '4px solid #cbd5e1' }}
    >
      {/* Background Grid Cells */}
      <div className="absolute inset-0 grid gap-[2px] p-[2px]" style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const isTarget = row === target.row && col === target.col;
          return (
            <div key={i} className={isTarget ? "bg-amber-950/40 rounded-sm shadow-inner" : "bg-slate-100 rounded-sm shadow-inner"} />
          );
        })}
      </div>

      {/* Target (Hole) - always visible with glow */}
      <div 
        className="absolute flex items-center justify-center pointer-events-none z-[5]"
        style={{
          left: toPct(target.col, cols),
          top: toPct(target.row, rows),
          width: toPct(1, cols),
          height: toPct(1, rows),
        }}
      >
        {/* Outer glow ring */}
        <div className="absolute w-[85%] h-[85%] rounded-full animate-ping opacity-30" 
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} 
        />
        {/* Hole */}
        <div className="w-[75%] h-[75%] rounded-full shadow-[0_0_12px_4px_rgba(245,158,11,0.6)] flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 35% 35%, #1e293b, #000)' }}
        >
          <div className="w-[45%] h-[45%] rounded-full opacity-80"
            style={{ background: 'radial-gradient(circle at 30% 30%, #374151, #000)' }}
          />
        </div>
        {/* Amber label below */}
        <div className="absolute bottom-[2px] text-[7px] font-black text-amber-400 uppercase tracking-widest leading-none drop-shadow-md">
          GOAL
        </div>
      </div>

      {/* Fixed Walls */}
      {(walls || []).map((wall, i) => (
        <div
          key={`wall-${i}`}
          className="absolute flex items-center justify-center pointer-events-none z-20"
          style={{
            left: `calc(${toPct(wall.col, cols)} + 2px)`,
            top: `calc(${toPct(wall.row, rows)} + 2px)`,
            width: `calc(${toPct(1, cols)} - 4px)`,
            height: `calc(${toPct(1, rows)} - 4px)`,
          }}
        >
          <div className="w-full h-full bg-slate-400 rounded-sm flex items-center justify-center shadow-inner border border-slate-500">
             <div className="w-full h-full relative opacity-20">
               <div className="absolute inset-0 border-t border-b border-black rotate-45 transform origin-center scale-150"></div>
               <div className="absolute inset-0 border-t border-b border-black -rotate-45 transform origin-center scale-150"></div>
             </div>
          </div>
        </div>
      ))}

      {/* Blocks */}
      {blocks.map((block, i) => {
        const w = getWidth(block);
        const h = getHeight(block);
        const colorClass = colorMap[block.color || ''] || Object.values(colorMap)[i % Object.keys(colorMap).length];
        
        return (
          <div
            key={block.id}
            data-id={block.id}
            className={cn(
              "absolute flex items-center justify-center border-2 border-white/20 select-none shadow-md rounded-md",
              "transition-all duration-150 ease-out touch-none",
              `${colorClass} cursor-grab hover:brightness-110 active:cursor-grabbing`,
              dragId === block.id && "z-50 scale-[1.02] shadow-xl brightness-110 !duration-75"
            )}
            style={{
              left: `calc(${toPct(block.col, cols)} + 2px)`,
              top: `calc(${toPct(block.row, rows)} + 2px)`,
              width: `calc(${toPct(w, cols)} - 4px)`,
              height: `calc(${toPct(h, rows)} - 4px)`,
              zIndex: dragId === block.id ? 50 : 20
            }}
            onPointerDown={(e) => handlePointerDown(block.id, block.orientation, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="w-full h-full opacity-30 flex gap-2 items-center justify-center pointer-events-none">
                <div className={cn("rounded-full bg-white/50", block.orientation === "horizontal" ? "w-1/2 h-2" : "w-2 h-1/2")}></div>
            </div>
          </div>
        );
      })}

      {/* Ball */}
      <div
        data-id="ball"
        className={cn(
          "absolute flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none",
          "transition-all duration-150 ease-out",
          dragId === 'ball' && "scale-110 z-50 !duration-75"
        )}
        style={{
          left: toPct(ball.col, cols),
          top: toPct(ball.row, rows),
          width: toPct(1, cols),
          height: toPct(1, rows),
          zIndex: dragId === 'ball' ? 50 : 30
        }}
        onPointerDown={(e) => handlePointerDown('ball', "any", e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-[0_4px_10px_rgba(239,68,68,0.4)] border-2 border-red-300 flex items-center justify-center pointer-events-none">
          <div className="w-1/3 h-1/3 rounded-full bg-white/40 absolute top-[20%] left-[20%] blur-[1px]"></div>
        </div>
      </div>
    </div>
  );
};
