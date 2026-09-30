import React, { useState, useEffect } from 'react';
import { X, Wrench, Bug } from 'lucide-react';

interface BetaNoticeModalProps {
  onReportClick: () => void;
}

const BetaNoticeModal: React.FC<BetaNoticeModalProps> = ({ onReportClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('beta_notice_seen');
    if (!hasSeenNotice) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('beta_notice_seen', 'true');
  };

  const handleReportClick = () => {
    handleClose();
    onReportClick();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 w-full max-w-[460px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="relative pt-10 px-8 pb-4 flex flex-col items-center text-center shrink-0">
           <button 
             onClick={handleClose}
             className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
             aria-label="Close"
           >
              <X size={20} />
           </button>
           
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-indigo-200 rotate-[4deg]">
              <Wrench size={32} className="text-indigo-600" />
           </div>
           
           <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome to Beta! 🚀</h2>
           <p className="text-[14px] text-slate-600 leading-relaxed">
              We are actively building and upgrading AptiVerse. You might notice some layout changes, schema updates, or occasional hiccups while we fine-tune the engine.
           </p>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6 shrink-0 mt-2">
           
           <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex flex-col items-center text-center">
              <p className="text-[13px] font-medium text-amber-800">
                 Your feedback is gold. If you find any bugs or have suggestions to make the platform better, we'd love to hear them!
              </p>
           </div>
           
           {/* Footer Buttons */}
           <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                 onClick={handleClose}
                 className="w-full sm:w-auto flex-1 py-3.5 text-[14px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors"
              >
                 Got it, thanks!
              </button>
              <button
                 onClick={handleReportClick}
                 className="w-full sm:w-auto flex-[1.5] py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                 <Bug size={18} />
                 Report an Issue
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BetaNoticeModal;
