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

const FixedCodeBlock = ({ code }: { code: Permutation }) => {
  return (
    <div className="px-4 py-2 rounded-lg font-mono font-bold text-lg tracking-widest bg-neutral-200 text-neutral-700 border border-neutral-300 shadow-xs">
      {code.join('')}
    </div>
  );
};

const ChoiceCodeBlock = ({
  code,
  label,
  active,
  onClick,
  status
}: {
  code: Permutation;
  label: string;
  active?: boolean;
  onClick?: () => void;
  status?: 'completed' | 'failed' | 'playing';
}) => {
  let btnColors = "bg-white text-slate-800 border-2 border-cyan-400 hover:border-cyan-600 hover:bg-cyan-50/60 shadow-sm";
  if (active) {
    if (status === 'completed') {
      btnColors = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-400/40";
    } else if (status === 'failed') {
      btnColors = "bg-rose-500 text-white border-2 border-rose-600 shadow-md ring-2 ring-rose-400/40";
    } else {
      btnColors = "bg-cyan-600 text-white border-2 border-cyan-700 shadow-md ring-2 ring-cyan-400/40";
    }
  }

  return (
    <button 
      disabled={!onClick || status !== 'playing'}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center px-4 py-2 rounded-xl font-mono transition-all select-none",
        btnColors,
        onClick && status === 'playing' && !active ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default",
        active && "scale-105"
      )}
    >
      <span className={cn(
        "text-[10px] font-black uppercase tracking-wider mb-0.5",
        active ? "text-white/90" : "text-cyan-700 font-bold"
      )}>
        Option {label}
      </span>
      <span className="font-extrabold text-lg tracking-widest">
        {code.join('')}
      </span>
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
           <FixedCodeBlock code={code} />
           <div className="w-4 h-8 bg-neutral-600 my-4"></div>
        </div>
      ))}

      {/* Choice Row */}
      <div className="flex flex-col items-center relative w-full gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-0.5 rounded-full border border-cyan-200 mb-1">
          Select Operator
        </span>
        <div className="flex gap-4 relative w-full justify-center">
          <div className="absolute top-1/2 left-0 right-0 h-4 bg-neutral-200 -z-10 transform -translate-y-1/2 rounded-full mx-10 border-t-2 border-b-2 border-dashed border-neutral-400"></div>
          {choices.map((code, idx) => (
            <ChoiceCodeBlock 
              key={idx} 
              code={code} 
              label={String.fromCharCode(65 + idx)}
              active={state.selectedChoice === idx} 
              onClick={() => onChoiceSelect(idx)}
              status={state.status}
            />
          ))}
        </div>
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
