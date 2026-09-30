import React, { useState, useEffect } from 'react';
import { Heart, X, Star, CheckCircle2, Gamepad2, LayoutTemplate, Zap, Trophy, Briefcase, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const FEEDBACK_TAGS = [
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'ui', label: 'UI/Design', icon: LayoutTemplate },
  { id: 'placement', label: 'Helps in Placement', icon: Briefcase },
  { id: 'variety', label: 'Variety of Challenges', icon: Zap },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'overall', label: 'Overall Experience', icon: Sparkles },
];

const RATING_TEXT = {
  0: "Select a rating",
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent"
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [comment, setComment] = useState('');
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
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id || null,
        rating,
        tag: selectedTag,
        comment
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      onSubmit();
      
      setTimeout(() => {
        setIsSuccess(false);
        setRating(0);
        setSelectedTag(null);
        setComment('');
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback. Error: ${error?.message || JSON.stringify(error)}`);
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
      className="fixed inset-0 z-[99999] flex p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative z-10 m-auto bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 w-full max-w-[460px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {isSuccess ? (
           <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300 h-[400px]">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50">
                 <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Thank you!</h2>
              <p className="text-slate-500 text-sm">Your feedback helps us make AptiVerse even better.</p>
           </div>
        ) : (
           <div className="flex flex-col">
              {/* Header */}
              <div className="relative pt-8 px-6 pb-4 flex flex-col items-center text-center shrink-0">
                 <button 
                   onClick={handleClose}
                   className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                   aria-label="Close feedback"
                 >
                    <X size={20} />
                 </button>
                 
                 <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-indigo-100 rotate-[-4deg]">
                    <Heart size={28} className="fill-indigo-600" />
                 </div>
                 
                 <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Enjoying AptiVerse?</h2>
                 <p className="text-[13px] text-slate-500 leading-relaxed max-w-sm">
                    Your feedback helps us improve and build better games for you and other students.
                 </p>
              </div>

              <div className="px-6 pb-6 flex flex-col gap-6 shrink-0">
                 
                 {/* Rating Section */}
                 <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 flex flex-col items-center">
                    <p className="text-sm font-bold text-slate-800 mb-3">How would you rate your experience so far?</p>
                    <div className="flex items-center gap-2 mb-2">
                       {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            aria-label={`Rate ${star} out of 5`}
                          >
                             <Star 
                               size={36} 
                               className={cn(
                                 "transition-all duration-150",
                                 (hoverRating || rating) >= star 
                                    ? "fill-amber-400 text-amber-400 drop-shadow-sm" 
                                    : "text-slate-300 hover:text-slate-400"
                               )} 
                             />
                          </button>
                       ))}
                    </div>
                    <span className="text-[13px] font-medium text-slate-500">
                       {RATING_TEXT[(hoverRating || rating) as keyof typeof RATING_TEXT]}
                    </span>
                 </div>

                 {/* Optional Tags */}
                 <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-1">
                       <span className="text-sm font-bold text-slate-800">What do you like the most?</span>
                       <span className="text-xs text-slate-400 font-medium">(Optional)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {FEEDBACK_TAGS.map((tag) => {
                         const Icon = tag.icon;
                         const isSelected = selectedTag === tag.id;
                         return (
                            <button
                               key={tag.id}
                               onClick={() => setSelectedTag(isSelected ? null : tag.id)}
                               className={cn(
                                 "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all",
                                 isSelected 
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                               )}
                            >
                               <Icon size={14} className={isSelected ? "text-indigo-600" : "text-slate-400"} />
                               {tag.label}
                               {isSelected && <CheckCircle2 size={14} className="ml-0.5 text-indigo-600" />}
                            </button>
                         )
                       })}
                    </div>
                 </div>

                 {/* Optional Comment */}
                 <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-1">
                       <span className="text-sm font-bold text-slate-800">Any suggestions?</span>
                       <span className="text-xs text-slate-400 font-medium">(Optional)</span>
                    </div>
                    <div className="relative">
                       <textarea
                         value={comment}
                         onChange={(e) => setComment(e.target.value.slice(0, 200))}
                         placeholder="Tell us what we can improve..."
                         className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none h-[80px]"
                       />
                       <span className="absolute bottom-3 right-3 text-[10px] font-medium text-slate-400 bg-white px-1">
                          {comment.length} / 200
                       </span>
                    </div>
                 </div>
                 
                  {/* Footer Buttons */}
                 <div className="flex items-center gap-3 pt-4 pb-2">
                    <button
                       onClick={handleClose}
                       className="flex-1 py-3.5 text-[14px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors"
                    >
                       Maybe Later
                    </button>
                    <button
                       onClick={handleSubmit}
                       disabled={rating === 0 || isSubmitting}
                       className={cn(
                          "flex-[2] py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                          rating > 0
                             ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                             : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                       )}
                    >
                       {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default FeedbackModal;
