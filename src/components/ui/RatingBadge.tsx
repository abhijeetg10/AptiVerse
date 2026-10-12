import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { usePlatformRatings } from '../../hooks/usePlatformRatings';
import { cn } from '../../utils/cn';

interface RatingBadgeProps {
  className?: string;
  variant?: 'pill' | 'card' | 'compact';
  onFeedbackClick?: () => void;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  className = '',
  variant = 'pill',
  onFeedbackClick,
}) => {
  const { total, average } = usePlatformRatings();

  if (variant === 'compact') {
    return (
      <div className={cn("inline-flex items-center gap-2 text-xs", className)}>
        <div className="flex items-center text-amber-500">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-slate-800 ml-1">{average.toFixed(1)}</span>
          <span className="text-slate-400 text-[10px]">/5.0</span>
        </div>
        <span className="text-slate-300">•</span>
        <span className="font-medium text-slate-500">{total}+ ratings</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          "p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4",
          className
        )}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 shrink-0">
            <Star size={24} className="fill-white" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {average.toFixed(1)}
              </span>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={cn(
                      star <= Math.round(average)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Rated by <strong className="text-slate-800 font-bold">{total}+ students</strong> across universities
            </span>
          </div>
        </div>

        {onFeedbackClick && (
          <button
            onClick={onFeedbackClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all shrink-0 cursor-pointer"
          >
            <MessageSquare size={13} /> Rate Platform
          </button>
        )}
      </div>
    );
  }

  // Default 'pill' variant
  return (
    <div
      onClick={onFeedbackClick}
      role={onFeedbackClick ? "button" : undefined}
      className={cn(
        "inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-200/90 shadow-2xs text-xs backdrop-blur-xs transition-all",
        onFeedbackClick && "hover:bg-amber-50/50 hover:border-amber-300 cursor-pointer",
        className
      )}
    >
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={cn(
              star <= Math.round(average)
                ? "fill-amber-400 text-amber-400"
                : "fill-neutral-200 text-neutral-300"
            )}
          />
        ))}
        <span className="font-extrabold text-slate-900 ml-1.5 text-xs">
          {average.toFixed(1)}
        </span>
        <span className="text-[10px] text-slate-400 font-normal">/5.0</span>
      </div>
      <span className="text-slate-200">•</span>
      <span className="font-semibold text-slate-600">
        <strong className="text-slate-900 font-bold">{total}+</strong> ratings
      </span>
    </div>
  );
};
