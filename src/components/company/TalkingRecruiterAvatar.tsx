import React, { useEffect, useState } from 'react';
import { Volume2, Mic, User } from 'lucide-react';

interface TalkingRecruiterAvatarProps {
  isSpeaking: boolean;
  recruiter: {
    name: string;
    role: string;
    unit: string;
  };
}

export const TalkingRecruiterAvatar: React.FC<TalkingRecruiterAvatarProps> = ({
  isSpeaking,
  recruiter
}) => {
  // Wave bar height variations
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 18, 10, 24, 16, 30, 22, 14, 28, 18, 12]);

  useEffect(() => {
    if (!isSpeaking) {
      setWaveHeights([8, 10, 8, 12, 8, 10, 8, 12, 8, 10, 8]);
      return;
    }

    const interval = setInterval(() => {
      // Dynamic audio frequency heights between 15% and 95%
      setWaveHeights([
        Math.floor(Math.random() * 25) + 15,
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 30) + 15,
        Math.floor(Math.random() * 55) + 35,
        Math.floor(Math.random() * 70) + 25,
        Math.floor(Math.random() * 85) + 15, // center spike
        Math.floor(Math.random() * 70) + 25,
        Math.floor(Math.random() * 55) + 35,
        Math.floor(Math.random() * 30) + 15,
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 25) + 15,
      ]);
    }, 120);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-[#090d16] via-[#0d1527] to-[#060a12] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center select-none">
      
      {/* Background Subtle Tech Grid & Ambient Glow */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 60%), 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px'
        }}
      />

      {/* Speaking Ripple Pulse Rings */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-primary-500/20 animate-ping opacity-40" />
          <div className="w-64 h-64 rounded-full border border-primary-400/10 animate-pulse opacity-30" />
        </div>
      )}

      {/* Main Recruiter Holographic Silhouette & Avatar Structure */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Silhouette Head & Shoulders Structure */}
        <div className="relative flex items-center justify-center mb-3">
          
          {/* Outer Glowing Ring */}
          <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
            isSpeaking 
              ? 'bg-gradient-to-tr from-primary-600/30 via-indigo-500/20 to-emerald-500/30 border-2 border-primary-400/60 shadow-[0_0_35px_rgba(59,130,246,0.35)]' 
              : 'bg-slate-900/90 border border-slate-700/80'
          }`}>
            
            {/* Dark Human Structure / Silhouette with Clean Accent Contours */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0a0f1d] flex flex-col items-center justify-center relative overflow-hidden border border-slate-800 shadow-inner">
              
              {/* Sleek Human Silhouette Avatar Icon */}
              <div className="relative z-10 text-slate-400 flex flex-col items-center">
                <User size={52} className={`transition-colors duration-300 ${
                  isSpeaking ? 'text-primary-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-slate-500'
                }`} />
              </div>

              {/* Holographic scanner sweep light */}
              {isSpeaking && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-400/20 to-transparent animate-pulse pointer-events-none" />
              )}
            </div>

          </div>

          {/* Floating Microphone Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg transition-all duration-300 ${
            isSpeaking ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/40' : 'bg-slate-800 text-slate-400'
          }`}>
            <Mic size={15} className={isSpeaking ? 'animate-bounce' : ''} />
          </div>
        </div>

        {/* Dynamic Voice Equalizer Waveform / Heartbeat Lines */}
        <div className="flex items-center justify-center gap-1.5 h-12 px-6 py-2 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-inner my-1">
          {waveHeights.map((h, idx) => (
            <span
              key={idx}
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-100 ${
                isSpeaking 
                  ? 'bg-gradient-to-t from-primary-500 via-indigo-400 to-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' 
                  : 'bg-slate-700'
              }`}
              style={{
                height: `${isSpeaking ? h : 8}px`,
              }}
            />
          ))}
        </div>

      </div>

      {/* Top Left: Corporate Panelist Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 border border-blue-400/30">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          Infosys AI Panelist
        </span>

        {isSpeaking ? (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/95 text-white text-[10px] font-extrabold flex items-center gap-1.5 shadow-md animate-pulse">
            <Volume2 size={12} />
            SPEAKING QUESTION
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-400 text-[10px] font-semibold border border-slate-700/60">
            LISTENING TO CANDIDATE
          </span>
        )}
      </div>

      {/* Top Right: Status */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400">
        <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
        <span>{isSpeaking ? 'Audio Active' : 'Waiting for Response'}</span>
      </div>

      {/* Bottom Nameplate & Info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex items-end justify-between text-white">
        <div>
          <div className="font-extrabold text-sm sm:text-base flex items-center gap-1.5 text-white">
            {recruiter.name}
            <span className="text-[10px] bg-primary-950 text-primary-300 px-2 py-0.5 rounded border border-primary-800/60">
              Virtual Panelist
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {recruiter.role} • {recruiter.unit}
          </div>
        </div>

        <div className="text-[11px] bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-emerald-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Connected
        </div>
      </div>

    </div>
  );
};
