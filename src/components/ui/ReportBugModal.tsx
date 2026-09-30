import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bug, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ReportBugModal: React.FC<ReportBugModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting && !isSuccess) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting, isSuccess]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('bug_reports').insert({
        user_id: user?.id || null,
        title,
        description
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      onSubmit();
      
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setDescription('');
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting bug report:', error);
      alert(`Failed to submit report: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting || isSuccess) return;
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={handleClose}
        ></div>
        
        {/* Modal */}
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-rose-500/10 w-full max-w-[460px] max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col text-left animate-in fade-in zoom-in-95 duration-300">
        
        {isSuccess ? (
           <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300 h-[400px]">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50">
                 <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Report Submitted!</h2>
              <p className="text-slate-500 text-sm">Thank you for helping us improve.</p>
           </div>
        ) : (
           <div className="flex flex-col">
              {/* Header */}
              <div className="relative pt-8 px-6 pb-4 flex flex-col items-center text-center shrink-0">
                 <button 
                   onClick={handleClose}
                   className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                   aria-label="Close report form"
                 >
                    <X size={20} />
                 </button>
                 
                 <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-red-100 text-rose-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-rose-200 rotate-[-4deg]">
                    <Bug size={32} className="text-rose-600" />
                 </div>
                 
                 <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Report an Issue</h2>
                 <p className="text-[14px] text-slate-600 leading-relaxed max-w-sm">
                    Found a bug or want to suggest an improvement? We're all ears.
                 </p>
              </div>

              <div className="px-6 pb-6 flex flex-col gap-5 shrink-0">
                 
                 {/* Title Input */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-slate-800">Issue Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Game freezing on level 2"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[14px] text-slate-700 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all shadow-sm"
                    />
                 </div>

                 {/* Description Input */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-slate-800">Description</label>
                    <div className="relative">
                       <textarea
                         value={description}
                         onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                         placeholder="Please describe the issue in detail..."
                         className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[14px] text-slate-700 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all resize-none h-[120px] shadow-sm custom-scrollbar"
                       />
                       <span className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400 bg-slate-50/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                          {description.length} / 500
                       </span>
                    </div>
                 </div>
                 
                  {/* Footer Buttons */}
                 <div className="flex items-center gap-3 pt-4 pb-2">
                    <button
                       onClick={handleClose}
                       className="flex-1 py-3.5 text-[14px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors"
                    >
                       Cancel
                    </button>
                    <button
                       onClick={handleSubmit}
                       disabled={!title.trim() || !description.trim() || isSubmitting}
                       className={cn(
                          "flex-[2] py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                          title.trim() && description.trim()
                             ? "bg-red-600 hover:bg-red-700 shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                             : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                       )}
                    >
                       {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
    </div>,
    document.body
  );
};

export default ReportBugModal;
