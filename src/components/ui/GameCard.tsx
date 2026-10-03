import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, BarChart2 } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

export interface GameCardProps {
  to: string;
  bgClass: string;
  visual: React.ReactNode;
  title: string;
  desc: string;
  difficulty: string;
  category: {
    label: string;
    icon: React.ReactNode;
  };
}

export const GameCard = ({ to, bgClass, visual, title, desc, difficulty, category }: GameCardProps) => {
  return (
    <Link to={to} className="group bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
      <div className={cn("h-40 flex items-center justify-center p-4 relative overflow-hidden", bgClass)}>
        <div className="absolute inset-0 bg-white/40"></div>
        <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500 w-full h-full flex items-center justify-center">
          {visual}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-neutral-900 mb-1">{title}</h3>
        <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">{desc}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={difficulty === 'Hard' ? 'error' : 'warning'} className="text-[10px] px-2 py-0.5">{difficulty}</Badge>
          <Badge variant="neutral" className="text-[10px] px-2 py-0.5 flex items-center gap-1">
            {category.icon} {category.label}
          </Badge>
        </div>

        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Play Now</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:bg-primary-600 transition-colors shrink-0">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};
