import React, { useState, useEffect } from 'react';
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
    } catch (error) {
      console.error('Error submitting bug report:', error);
      alert('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting || isSuccess) return;
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-[460px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {isSuccess ? (
           <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300 h-[400px]">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
              <p className="text-slate-500 text-sm">Thank you for helping us improve.</p>
           </div>
        ) : (
           <>
              {/* Header */}
              <div className="relative pt-8 px-6 pb-4 flex flex-col items-center text-center">
                 <button 
                   onClick={handleClose}
                   className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                   aria-label="Close report form"
                 >
                    <X size={20} />
                 </button>
                 
                 <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-red-100 rotate-[-4deg]">
                    <Bug size={28} className="text-red-600" />
                 </div>
                 
                 <h2 className="text-xl font-extrabold text-slate-900 mb-1.5 tracking-tight">Report a Bug</h2>
                 <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    Found an issue or want to contact us? Let us know below.
                 </p>
              </div>

              <div className="px-6 pb-6 flex flex-col gap-5">
                 
                 {/* Title Input */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-slate-800">Issue Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Game freezing on level 2"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
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
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none h-[120px]"
                       />
                       <span className="absolute bottom-3 right-3 text-[10px] font-medium text-slate-400 bg-slate-50 px-1">
                          {description.length} / 500
                       </span>
                    </div>
                 </div>
                 
                 {/* Footer Buttons */}
                 <div className="flex items-center gap-3 pt-2">
                    <button
                       onClick={handleClose}
                       className="flex-1 py-3 text-[13px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                       Cancel
                    </button>
                    <button
                       onClick={handleSubmit}
                       disabled={!title.trim() || !description.trim() || isSubmitting}
                       className={cn(
                          "flex-[2] py-3 rounded-xl text-[14px] font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2",
                          title.trim() && description.trim()
                             ? "bg-red-600 hover:bg-red-700 hover:shadow-md active:scale-[0.98]"
                             : "bg-slate-200 text-slate-400 cursor-not-allowed"
                       )}
                    >
                       {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                 </div>
              </div>
           </>
        )}

      </div>
    </div>
  );
};

export default ReportBugModal;
