import React, { useState } from 'react';
import { X, Copy, Check, Share2, Flame, Trophy, ExternalLink, Sparkles } from 'lucide-react';

interface ChallengeFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengerName: string;
  solveTimeSeconds?: number | string;
  streak?: number;
  challengeTitle?: string;
  challengeDate?: string;
}

export const ChallengeFriendModal: React.FC<ChallengeFriendModalProps> = ({
  isOpen,
  onClose,
  challengerName,
  solveTimeSeconds = '15',
  streak = 1,
  challengeTitle = 'Daily Hard Problem Challenge',
  challengeDate = new Date().toISOString().split('T')[0]
}) => {
  const [copiedType, setCopiedType] = useState<'link' | 'text' | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aptiverse.in';
  const cleanName = challengerName.trim() || 'AptiVerse Scholar';
  const timeFormatted = `${solveTimeSeconds}s`;

  // Deep link with challenge and challenger metadata
  const shareUrl = `${origin}/?challenge=daily&challenger=${encodeURIComponent(cleanName)}&time=${encodeURIComponent(timeFormatted)}`;

  // Formatted viral challenge message
  const challengeMessage = `⚔️ *AptiVerse Daily Challenge: Can you beat my time?*

👤 *Challenger:* ${cleanName}
🧩 *Problem:* ${challengeTitle}
⏱️ *Solve Speed:* ${timeFormatted} (100% Accuracy)
🔥 *Streak:* ${streak} ${streak === 1 ? 'Day' : 'Days'}

Think your aptitude and speed is faster than mine? Accept my challenge on AptiVerse now:
👉 ${shareUrl}`;

  const copyToClipboard = async (type: 'link' | 'text') => {
    try {
      const content = type === 'link' ? shareUrl : challengeMessage;
      await navigator.clipboard.writeText(content);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = type === 'link' ? shareUrl : challengeMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AptiVerse Daily Challenge - ${cleanName}'s Score`,
          text: challengeMessage,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard('link');
        }
      }
    } else {
      copyToClipboard('link');
    }
  };

  const openWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(challengeMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openTwitter = () => {
    const tweet = `I just solved today's @AptiVerse Daily Challenge in ${timeFormatted} with 100% accuracy! 🎯 Can you beat my speed?`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 text-white text-left relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
                ⚔️
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight leading-tight">Challenge a Friend</h3>
                <p className="text-xs text-orange-100 font-medium">Showcase your speed & see if they can beat your score</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-left">
          {/* Card Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-slate-50 border border-orange-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-orange-900 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <Sparkles size={13} className="text-orange-500" /> AptiVerse Daily Challenge Card
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">{challengeDate}</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-neutral-500 font-medium">Challenger</p>
              <h4 className="text-base font-black text-neutral-900">{cleanName}</h4>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-200/60">
              <div className="bg-white/80 p-2.5 rounded-xl border border-orange-100">
                <span className="text-[10px] text-neutral-500 font-bold block">OFFICIAL SPEED</span>
                <span className="text-base font-extrabold text-emerald-600 font-mono">{timeFormatted}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-orange-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block">STREAK</span>
                  <span className="text-base font-extrabold text-orange-600 font-mono">{streak}d</span>
                </div>
                <Flame size={20} className="fill-orange-500 text-orange-500 opacity-90" />
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 italic bg-white/50 p-2 rounded-lg border border-orange-100/50">
              "Think you're faster than me? Beat my solve time on AptiVerse!"
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">
              Share to platforms:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-emerald-600 shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={openLinkedIn}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-blue-700 shrink-0" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={openTwitter}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-black shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Twitter / X</span>
              </button>

              {/* Instagram / System Share */}
              <button
                onClick={shareViaNative}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-pink-600 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </button>
            </div>
          </div>

          {/* Copy Link Input Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 block">
              Direct Challenge Link:
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={shareUrl}
                className="w-full text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-600 focus:outline-hidden select-all"
              />
              <button
                onClick={() => copyToClipboard('link')}
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
              >
                {copiedType === 'link' ? (
                  <>
                    <Check size={14} className="text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Copy Full Challenge Message */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500 font-medium">
              Want to share the formatted text with emojis?
            </span>
            <button
              onClick={() => copyToClipboard('text')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedType === 'text' ? (
                <>
                  <Check size={12} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied Text!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy Full Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

