import React from 'react';
import { Triangle, Circle, Plus, Star } from 'lucide-react';
import type { SwitchSymbol, Permutation, SwitchState } from './types';
import { cn } from '../../utils/cn';

interface SwitchBoardProps {
  state: SwitchState;
  onChoiceSelect: (index: number) => void;
}

export const ShapeIcon = ({ symbol, className = "" }: { symbol: SwitchSymbol, className?: string }) => {
  const props = { fill: "currentColor", className };
  switch (symbol) {
    case 'triangle': return <Triangle {...props} className={cn("text-amber-500", className)} />;
    case 'circle': return <Circle {...props} className={cn("text-rose-500", className)} />;
    case 'cross': return <Plus {...props} strokeWidth={4} className={cn("text-blue-500", className)} />;
    case 'star': return <Star {...props} className={cn("text-purple-500", className)} />;
    default: return null;
  }
};

const ShapeRow = ({ shapes }: { shapes: SwitchSymbol[] }) => (
  <div className="flex gap-4 p-4 bg-neutral-100 rounded-xl border border-neutral-200">
    {shapes.map((s, i) => (
      <div key={i} className="w-12 h-12 flex items-center justify-center">
        <ShapeIcon symbol={s} className="w-10 h-10 drop-shadow-md" />
      </div>
    ))}
  </div>
);

const CodeBlock = ({ code, active, onClick, status }: { code: Permutation, active?: boolean, onClick?: () => void, status?: 'completed'|'failed'|'playing' }) => {
  let bgColor = "bg-neutral-300 text-neutral-600";
  if (active) {
    if (status === 'completed') bgColor = "bg-emerald-400 text-emerald-950";
    else if (status === 'failed') bgColor = "bg-red-400 text-red-950";
    else bgColor = "bg-amber-300 text-amber-950";
  }

  return (
    <button 
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg font-mono font-bold text-lg tracking-widest transition-all",
        bgColor,
        onClick && !active ? "hover:bg-neutral-400 cursor-pointer" : "cursor-default",
        active && "scale-110 shadow-lg"
      )}
    >
      {code.join('')}
    </button>
  );
};

export const SwitchBoard: React.FC<SwitchBoardProps> = ({ state, onChoiceSelect }) => {
  const { input, output, fixedCodes, choices } = state.puzzle;
  
  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-2xl">
      {/* Input Row */}
      <ShapeRow shapes={input} />

      {/* Funnel down */}
      <div className="w-full flex flex-col items-center my-4 relative">
        <div className="w-32 h-12 bg-neutral-600 rounded-t-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}>
           <div className="w-full flex justify-around px-4 pt-1 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
           </div>
        </div>
        <div className="w-4 h-8 bg-neutral-600"></div>
      </div>

      {/* Fixed Codes */}
      {fixedCodes.map((code, idx) => (
        <div key={idx} className="flex flex-col items-center relative w-full">
           <div className="absolute top-1/2 left-0 right-0 h-4 bg-neutral-200 -z-10 transform -translate-y-1/2 rounded-full mx-10"></div>
           <CodeBlock code={code} />
           <div className="w-4 h-8 bg-neutral-600 my-4"></div>
        </div>
      ))}

      {/* Choice Row */}
      <div className="flex gap-4 relative w-full justify-center">
         <div className="absolute top-1/2 left-0 right-0 h-4 bg-neutral-200 -z-10 transform -translate-y-1/2 rounded-full mx-10 border-t-2 border-b-2 border-dashed border-neutral-400"></div>
         {choices.map((code, idx) => (
           <CodeBlock 
             key={idx} 
             code={code} 
             active={state.selectedChoice === idx} 
             onClick={() => onChoiceSelect(idx)}
             status={state.status}
           />
         ))}
      </div>

      {/* Funnel up (inverted) */}
      <div className="w-full flex flex-col items-center mt-4 mb-4 relative">
        <div className="w-4 h-8 bg-neutral-600"></div>
        <div className="w-32 h-12 bg-neutral-600 rounded-b-lg" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }}>
           <div className="w-full flex justify-around px-4 pb-1 opacity-50 absolute bottom-1">
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
           </div>
        </div>
      </div>

      {/* Output Row */}
      <ShapeRow shapes={output} />
      
    </div>
  );
};
