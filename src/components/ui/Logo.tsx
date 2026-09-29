import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 32, withText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Logo Mark */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" /> {/* Blue 600 */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet 500 */}
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Main 'A' shape (Left leg + Right leg) */}
        <path 
          d="M 50 15 L 20 85 L 38 85 L 45 65 L 55 65 L 62 85 L 80 85 Z" 
          fill="url(#grad1)" 
        />
        
        {/* Overlay arrow head to represent Upward Progress at the peak of A */}
        <path 
          d="M 50 10 L 35 30 L 45 30 L 45 40 L 55 40 L 55 30 L 65 30 Z" 
          fill="url(#grad1)" 
        />

        {/* Cutout / mask could be used, but we can draw the orbit over it */}
        
        {/* Play Icon in the center (negative space or colored) */}
        <path 
          d="M 45 50 L 45 70 L 60 60 Z" 
          fill="#1e3a8a" 
        />

        {/* Orbit (Ellipse rotated) */}
        <ellipse 
          cx="50" 
          cy="55" 
          rx="45" 
          ry="15" 
          transform="rotate(-25 50 55)" 
          stroke="url(#grad2)" 
          strokeWidth="6" 
          fill="none" 
        />

        {/* Star / Sparkle top right */}
        <path 
          d="M 75 10 Q 80 10 80 5 Q 80 10 85 10 Q 80 10 80 15 Q 80 10 75 10 Z" 
          fill="#8b5cf6" 
        />
      </svg>

      {/* Text Mark */}
      {withText && (
        <div className="flex flex-col">
          <span className="text-xl font-extrabold tracking-tight text-neutral-900 leading-none">
            Apti<span className="text-primary-600">Verse</span>
          </span>
          <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 mt-1 uppercase">
            Play • Practice • Progress
          </span>
        </div>
      )}
    </div>
  );
};
