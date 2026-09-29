import React from 'react';
import type { ShapeId, Grid3x3, InductiveState } from './types';
import { cn } from '../../utils/cn';

const ShapeIcon = ({ shape, className = "" }: { shape: ShapeId, className?: string }) => {
  switch (shape) {
    case 'yc':
      return <div className={cn("w-full h-full rounded-full bg-yellow-400 shadow-sm", className)} />;
    case 'rs':
      return <div className={cn("w-full h-full rounded-sm bg-red-600 shadow-sm", className)} />;
    case 'gt':
      return <div className={cn("w-full h-full bg-green-600 shadow-sm", className)} style={{ clipPath: 'polygon(50% 10%, 0% 100%, 100% 100%)' }} />;
    case 'bp':
      return (
        <div className={cn("relative w-full h-full", className)}>
           <div className="absolute top-[35%] bottom-[35%] left-0 right-0 bg-blue-600 shadow-sm"></div>
           <div className="absolute left-[35%] right-[35%] top-0 bottom-0 bg-blue-600 shadow-sm"></div>
        </div>
      );
    default:
      return null;
  }
};

const GridBox = ({ grid, selectable, selected, onClick, status, isCorrect }: { grid: Grid3x3, selectable?: boolean, selected?: boolean, onClick?: () => void, status?: string, isCorrect?: boolean }) => {
  // Outline based on status
  let outlineClass = "border-transparent";
  if (selected) {
    outlineClass = "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.3)]";
    if (status === 'completed') outlineClass = "border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.3)]";
    else if (status === 'failed') {
      outlineClass = isCorrect ? "border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.3)]" : "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.3)]";
    }
  } else if (status === 'failed' && isCorrect) {
    // Show what should have been selected
    outlineClass = "border-emerald-500 border-dashed shadow-[0_0_0_3px_rgba(16,185,129,0.3)]";
  }

  return (
    <div 
      onClick={selectable ? onClick : undefined}
      className={cn(
        "grid grid-cols-3 grid-rows-3 gap-1 p-2 bg-white rounded-xl border-4 transition-all w-32 h-32",
        outlineClass,
        selectable && status === 'playing' ? "cursor-pointer hover:border-blue-300 hover:shadow-md hover:-translate-y-1" : "cursor-default",
        selected && "scale-105"
      )}
    >
      {grid.map((shape, i) => (
        <div key={i} className="flex items-center justify-center bg-slate-100 rounded-sm p-1">
          <ShapeIcon shape={shape} />
        </div>
      ))}
    </div>
  );
};

export const InductiveBoard: React.FC<{
  state: InductiveState,
  onToggle: (index: number) => void
}> = ({ state, onToggle }) => {
  const { puzzle, status, selectedIndices } = state;

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-stretch justify-center max-w-4xl">
      {/* Left Panel: Examples */}
      <div className="flex-1 bg-slate-100 rounded-3xl p-6 border border-slate-200 flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">These two grids follow a rule</h3>
        <div className="flex flex-col gap-6">
          {puzzle.examples.map((grid, i) => (
            <GridBox key={`ex-${i}`} grid={grid} />
          ))}
        </div>
      </div>

      {/* Right Panel: Options */}
      <div className="flex-[2] bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Which two of these grids follow the same rule?</h3>
        <div className="grid grid-cols-2 gap-8">
          {puzzle.options.map((grid, i) => (
            <GridBox 
              key={`opt-${i}`} 
              grid={grid} 
              selectable={true}
              selected={selectedIndices.includes(i)}
              onClick={() => onToggle(i)}
              status={status}
              isCorrect={puzzle.correctOptionIndices.includes(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
