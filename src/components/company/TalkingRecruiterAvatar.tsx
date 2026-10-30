import React, { useEffect, useState } from 'react';

interface TalkingRecruiterAvatarProps {
  isSpeaking: boolean;
  recruiter: {
    name: string;
    role: string;
    unit: string;
    img: string;
  };
}

export const TalkingRecruiterAvatar: React.FC<TalkingRecruiterAvatarProps> = ({
  isSpeaking,
  recruiter
}) => {
  // Mouth openness / phoneme simulation (0 to 3)
  const [mouthState, setMouthState] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Lip-sync speech oscillation
  useEffect(() => {
    if (!isSpeaking) {
      setMouthState(0);
      return;
    }

    const interval = setInterval(() => {
      // Rapid pseudo-phoneme changes to simulate natural speech articulation
      setMouthState(prev => (prev + 1) % 4);
    }, 110);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Natural eye blink every 3.5 - 5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl flex items-center justify-center select-none">
      
      {/* Background Corporate Video Office Backdrop */}
      <div className="absolute inset-0 bg-cover bg-center filter blur-[1px] brightness-75 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80')`
        }}
      />
      
      {/* Lighting vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/60 pointer-events-none" />

      {/* Recruiter Container with subtle micro-movements */}
      <div className={`relative z-10 w-full h-full flex flex-col items-center justify-end transition-transform duration-300 ${
        isSpeaking ? 'translate-y-[-2px]' : 'translate-y-0'
      }`}>
        
        {/* Recruiter Persona Photo with Headroom & Proper Center-Top Alignment */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={recruiter.img}
            alt={recruiter.name}
            className={`w-full h-full object-cover object-top filter contrast-105 transition-all duration-500 ${
              isSpeaking ? 'scale-[1.02]' : 'scale-100'
            }`}
          />

          {/* Dynamic Mouth / Lip-Sync Articulation Overlay */}
          {isSpeaking && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-100 ease-out"
              style={{
                top: '58%', // Precise location of the mouth on professional headshots
                width: '42px',
                height: mouthState === 0 ? '12px' : mouthState === 1 ? '18px' : mouthState === 2 ? '22px' : '15px',
              }}
            >
              {/* Dynamic Realistic Lip Overlay SVG */}
              <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-md">
                {/* Upper lip */}
                <path 
                  d="M10,22 Q30,12 50,20 Q70,12 90,22 Q50,16 10,22 Z" 
                  fill="#993d4c" 
                  opacity="0.9"
                />
                {/* Inner oral cavity (opens with speech) */}
                <ellipse 
                  cx="50" 
                  cy="26" 
                  rx={mouthState === 0 ? "16" : mouthState === 1 ? "22" : mouthState === 2 ? "26" : "20"} 
                  ry={mouthState === 0 ? "5" : mouthState === 1 ? "10" : mouthState === 2 ? "14" : "8"} 
                  fill="#330b13" 
                />
                {/* Teeth highlights */}
                {(mouthState === 1 || mouthState === 2) && (
                  <path d="M35,21 Q50,23 65,21 L62,25 Q50,27 38,25 Z" fill="#ffffff" opacity="0.85" />
                )}
                {/* Lower lip */}
                <path 
                  d="M10,22 Q50,42 90,22 Q50,28 10,22 Z" 
                  fill="#b34759" 
                  opacity="0.95"
                />
              </svg>
            </div>
          )}

          {/* Eye Blink Overlay */}
          {isBlinking && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ top: '38%', width: '110px', height: '14px' }}
            >
              <div className="flex justify-between px-2">
                <span className="w-8 h-2 bg-[#8c5344]/80 rounded-full blur-[0.5px]" />
                <span className="w-8 h-2 bg-[#8c5344]/80 rounded-full blur-[0.5px]" />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Recruiter Video UI Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 border border-blue-400/30">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          Infosys Panelist
        </span>

        {isSpeaking ? (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/95 text-white text-[10px] font-extrabold flex items-center gap-1.5 shadow-md animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            SPEAKING
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold border border-slate-700/60">
            LISTENING
          </span>
        )}
      </div>

      {/* Real-Time Audio Equalizer Bar */}
      {isSpeaking && (
        <div className="absolute top-3 right-3 z-20 flex items-end gap-1 h-5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-lg">
          <span className="w-1 bg-emerald-400 h-2.5 animate-pulse rounded-full" />
          <span className="w-1 bg-emerald-400 h-5 animate-bounce rounded-full" />
          <span className="w-1 bg-emerald-400 h-2 animate-pulse rounded-full" />
          <span className="w-1 bg-emerald-400 h-4 animate-bounce rounded-full" />
          <span className="w-1 bg-emerald-400 h-3 animate-pulse rounded-full" />
        </div>
      )}

      {/* Bottom Recruiter Nameplate & Info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex items-end justify-between text-white">
        <div>
          <div className="font-extrabold text-sm sm:text-base flex items-center gap-1.5 text-white drop-shadow">
            {recruiter.name}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xs text-slate-300 drop-shadow-sm font-medium">
            {recruiter.role} • {recruiter.unit}
          </div>
        </div>

        <div className="text-[11px] bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-slate-300 font-mono shadow-sm">
          Live Connection
        </div>
      </div>

    </div>
  );
};

