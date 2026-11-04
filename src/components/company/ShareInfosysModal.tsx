import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, Building2, CheckCircle2, Clock } from 'lucide-react';
import { InfosysBrandLogo } from './CompanyLogos';

interface ShareInfosysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareInfosysModal: React.FC<ShareInfosysModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedType, setCopiedType] = useState<'link' | 'text' | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.aptiverse.in';
  const shareUrl = `${origin}/company/infosys`;

  const shareMessage = `🎯 *Free Infosys Placement Mock Test & AI Interview on AptiVerse!*

Practice with authentic full-length Infosys tests (54 Questions • 100 Minutes) curated from real Infosys PYQs:
⏱️ 5 Timed Sections (Reasoning, Math, Verbal, Pseudocode & Puzzles)
🎯 Section-wise Cutoff Analysis
🤖 Real-time AI Mock Interview Simulation
✅ 100% Free • Zero Negative Marking

Attempt the test now:
👉 ${shareUrl}`;

  const copyToClipboard = async (type: 'link' | 'text') => {
    try {
      const content = type === 'link' ? shareUrl : shareMessage;
      await navigator.clipboard.writeText(content);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = type === 'link' ? shareUrl : shareMessage;
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
          title: 'Infosys Mock Test & AI Interview Prep - AptiVerse',
          text: shareMessage,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          copyToClipboard('link');
        }
      }
    } else {
      copyToClipboard('link');
    }
  };

  const openWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openTwitter = () => {
    const tweet = `Free Infosys Systems Engineer Mock Test & AI Interview room on @AptiVerse! 54 questions, sectional timers, and authentic PYQs. Check it out: ${shareUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-neutral-100 overflow-hidden relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Infosys Blue Gradient */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-primary-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Share2 size={11} /> Share Drive
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px] tracking-wider uppercase">
              Free Access
            </span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Share Infosys Placement Test
          </h3>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Invite friends and college batchmates to practice full mock tests and AI interviews.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-4 border border-blue-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-neutral-200/80 shadow-xs flex items-center">
                <InfosysBrandLogo className="h-6" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={11} /> Active 2025–2026
              </span>
            </div>

            <h4 className="font-extrabold text-neutral-900 text-sm mb-1">
              Infosys Systems Engineer Placement Drive
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed mb-3">
              54 Questions • 100 Minutes • Reasoning, Math, Verbal, Pseudocode & Numerical Puzzles.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-neutral-700">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-neutral-200/60 shadow-2xs">
                <Clock size={13} className="text-primary-600 shrink-0" />
                <span>5 Timed Sections</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-neutral-200/60 shadow-2xs">
                <Sparkles size={13} className="text-indigo-600 shrink-0" />
                <span>AI Interview Room</span>
              </div>
            </div>
          </div>

          {/* Social Platform Share Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">
              Share directly to:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
                title="Share on WhatsApp"
              >
                <svg className="w-4 h-4 fill-emerald-600 shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>WhatsApp</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={openLinkedIn}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4 fill-blue-600 shrink-0" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={openTwitter}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
                title="Share on X"
              >
                <svg className="w-3.5 h-3.5 fill-black shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / Post</span>
              </button>

              {/* Native Share / Instagram */}
              <button
                onClick={shareViaNative}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs"
                title="Instagram / Native Share"
              >
                <Share2 size={14} className="text-pink-600 shrink-0" />
                <span>More</span>
              </button>
            </div>
          </div>

          {/* Direct Link Copy */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 block">
              Direct Link:
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
                    <Check size={14} className="text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Copy Message with Emojis for Telegram/WhatsApp Groups */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500 font-medium">
              Study group message ready to paste:
            </span>
            <button
              onClick={() => copyToClipboard('text')}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedType === 'text' ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied Text!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
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

