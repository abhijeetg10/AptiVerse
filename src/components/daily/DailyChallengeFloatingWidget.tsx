import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Flame, X, ArrowRight, Trophy, Sparkles } from 'lucide-react';

interface DailyChallengeFloatingWidgetProps {
  onOpen: () => void;
}

export const DailyChallengeFloatingWidget: React.FC<DailyChallengeFloatingWidgetProps> = ({
  onOpen
}) => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Today in IST
  const getTodayIST = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 3600000 * 5.5);
    return ist.toISOString().split('T')[0];
  };

  const today = getTodayIST();
  const lastSolvedDate = typeof window !== 'undefined' ? localStorage.getItem('aptiverse_daily_last_solved_date') : null;
  const isAlreadySolvedToday = lastSolvedDate === today;

  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    // Check if dismissed in this session
    const sessionDismissed = sessionStorage.getItem(`aptiverse_daily_popup_dismissed_${today}`);
    
    // Only show gentle pop-up if user hasn't solved today and hasn't dismissed in this session
    if (!isAlreadySolvedToday && !sessionDismissed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [today, isAlreadySolvedToday]);

  const handleDismissPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
    setIsDismissed(true);
    sessionStorage.setItem(`aptiverse_daily_popup_dismissed_${today}`, 'true');
  };

  const handleOpenChallenge = () => {
    setShowPopup(false);
    setIsDismissed(true);
    sessionStorage.setItem(`aptiverse_daily_popup_dismissed_${today}`, 'true');
    onOpen();
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9990] flex flex-col items-end pointer-events-auto select-none font-sans">
      
      {/* Pop-up Attention Card on arrival */}
      {showPopup && !isDismissed && (
        <div 
          onClick={handleOpenChallenge}
          className="mb-3 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-orange-300 text-neutral-800 transition-all duration-300 hover:shadow-orange-500/20 hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
        >
          {/* Background subtle glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleDismissPopup}
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            title="Dismiss"
          >
            <X size={15} />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
              <Flame size={20} className="text-white fill-amber-100 animate-pulse" />
            </div>

            <div className="flex-1 pr-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  Daily Challenge
                </span>
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                  <Sparkles size={10} /> Live
                </span>
              </div>
              <h4 className="text-xs font-extrabold text-neutral-900 group-hover:text-orange-600 transition-colors">
                Solve Today's Hard Problem!
              </h4>
              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5 line-clamp-2">
                Beat the leaderboard timer and keep your solving streak alive.
              </p>
            </div>
          </div>

          {/* Action button inside popup */}
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
              <Trophy size={11} className="text-amber-500" /> Rank on Leaderboard
            </span>
            <span className="text-xs font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Solve Now <ArrowRight size={13} />
            </span>
          </div>
        </div>
      )}

      {/* Floating Circular Daily Challenge Logo / Button (FAB) */}
      <div className="relative flex items-center">
        {/* Tooltip / Expanded Label on Hover */}
        <div 
          className={`hidden sm:flex items-center gap-2 mr-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold shadow-lg transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          <Flame size={14} className="fill-orange-400 text-orange-400" />
          <span>{isAlreadySolvedToday ? 'View Leaderboard' : "Today's Daily Challenge"}</span>
        </div>

        {/* Circular Button */}
        <button
          onClick={handleOpenChallenge}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/90 ring-4 ring-orange-400/25"
          title="Daily Hard Problem Challenge & Leaderboard"
          aria-label="Open Daily Challenge"
        >
          {/* Animated pulsing outer ring */}
          <span className="absolute -inset-1.5 rounded-full bg-orange-400/35 animate-ping opacity-60 pointer-events-none" />

          {/* Inner Flame Icon */}
          <Flame 
            size={28} 
            className="text-white fill-amber-200 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6 drop-shadow-md" 
          />

          {/* Small Top Badge: LIVE or Solved Check */}
          <span className="absolute -top-1 -right-1 flex h-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[9px] font-black uppercase text-amber-300 border-2 border-white shadow-xs">
            {isAlreadySolvedToday ? '✓' : 'LIVE'}
          </span>
        </button>
      </div>

    </div>,
    document.body
  );
};
