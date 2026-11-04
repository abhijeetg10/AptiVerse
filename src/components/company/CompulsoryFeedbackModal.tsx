import React, { useState } from 'react';
import { Star, MessageSquare, AlertCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface CompulsoryFeedbackModalProps {
  testTitle?: string;
  testId?: string;
  candidateName?: string;
  recordId?: string | null;
  scoreData?: {
    score: number;
    totalQuestions: number;
    percentage: number;
    sectionalScores?: { [secName: string]: any };
    cleared?: boolean;
  };
  contextType?: 'mock_test' | 'interview' | 'complete_drive';
  onSubmitted: () => void;
}

export const CompulsoryFeedbackModal: React.FC<CompulsoryFeedbackModalProps> = ({
  testTitle = 'Infosys Systems Engineer Assessment',
  testId = 'infosys_format_a',
  candidateName: propCandidateName,
  recordId = null,
  scoreData,
  contextType = 'mock_test',
  onSubmitted
}) => {
  const { user } = useAuth();

  // Ratings (1 to 5)
  const [mockRating, setMockRating] = useState(5);
  const [interviewRating, setInterviewRating] = useState(5);
  const [appRating, setAppRating] = useState(5);

  // Compulsory Written Feedback
  const [writtenFeedback, setWrittenFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const minChars = 20;
  const currentChars = writtenFeedback.trim().length;
  const isValidLength = currentChars >= minChars;

  const quickPills = [
    'Question pattern was authentic to Infosys',
    'Loved the real-time speech-to-text dictation',
    'Priya Sharma recruiter voice was very fluent',
    'Proctoring alerts helped maintain eye contact',
    'Timers matched actual exam pressure'
  ];

  const handleAddPill = (pill: string) => {
    setWrittenFeedback(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}. ${pill}` : pill;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidLength) {
      setErrorMessage(`Please write at least ${minChars} characters to complete your compulsory evaluation.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const overallRating = Math.round((mockRating + interviewRating + appRating) / 3);
    const structuredComment = `[INFOSYS COMPULSORY FEEDBACK] [Context: ${contextType}] [Drive: ${testTitle}] [Mock: ${mockRating}★, Interview: ${interviewRating}★, App: ${appRating}★] Review: ${writtenFeedback.trim()}`;
    const candidateFinalName = propCandidateName?.trim() || user?.name || localStorage.getItem('aptiverse_interview_candidate_name') || 'Candidate';

    try {
      // 1. If mock test or interview: store candidate name, test title, minutes/score & feedback in company_mock_scores
      if (contextType === 'mock_test' || contextType === 'interview') {
        if (recordId) {
          await supabase.from('company_mock_scores').update({
            candidate_name: candidateFinalName,
            feedback_rating: overallRating,
            feedback_comment: writtenFeedback.trim()
          }).eq('id', recordId);
        } else {
          await supabase.from('company_mock_scores').insert([{
            user_id: user?.id || null,
            candidate_name: candidateFinalName,
            company: 'infosys',
            test_id: testId || (contextType === 'interview' ? 'infosys_interview' : 'infosys_format_a'),
            test_title: testTitle,
            score: scoreData?.score ?? 0,
            total_questions: scoreData?.totalQuestions ?? 0,
            percentage: scoreData?.percentage ?? 0,
            sectional_scores: scoreData?.sectionalScores || {},
            cleared: scoreData?.cleared ?? true,
            feedback_rating: overallRating,
            feedback_comment: writtenFeedback.trim()
          }]);
        }
      }

      // 2. Insert into feedback table for general review logging
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id || null,
        rating: overallRating,
        tag: contextType === 'interview' ? 'infosys_interview' : 'infosys_mock_drive',
        comment: structuredComment
      });

      if (error) {
        console.warn('Feedback DB submission note (fallback to localStorage):', error);
      }

      // 3. Cache submission locally so it never blocks the user twice
      localStorage.setItem(`aptiverse_feedback_submitted_${testTitle}`, 'true');

      // Call onSubmitted callback to unlock score card
      onSubmitted();
    } catch (err: any) {
      console.warn('Feedback submission caught error:', err);
      // Even if network glitches, store locally and allow proceeding
      localStorage.setItem(`aptiverse_feedback_submitted_${testTitle}`, 'true');
      onSubmitted();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white shadow-2xl relative my-auto">
        
        {/* Compulsory Badge */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Mandatory Feedback Required
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Step 1 of 1</span>
        </div>

        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          Assessment & Interview Experience Feedback
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
          To finalize your score and unlock your detailed performance scorecard, please submit your written review on this mock drive and platform.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Rating 1: Mock Test Pattern Accuracy */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">
                1. Mock Test Pattern & Question Quality:
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">{mockRating} / 5</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setMockRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    size={22} 
                    className={star <= mockRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Rating 2: AI Recruiter & Audio Experience */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">
                2. AI Interviewer Voice, Speech-to-Text & Proctoring:
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">{interviewRating} / 5</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setInterviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    size={22} 
                    className={star <= interviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Rating 3: Platform Performance & UI */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">
                3. Platform Speed & User Interface:
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">{appRating} / 5</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setAppRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    size={22} 
                    className={star <= appRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Written Feedback Area (COMPULSORY) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare size={13} className="text-primary-400" />
                <span>Your Written Review & Suggestions (Compulsory):</span>
              </label>
              <span className={`text-[11px] font-mono font-bold ${isValidLength ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentChars} / {minChars} chars min
              </span>
            </div>

            <textarea
              required
              rows={4}
              value={writtenFeedback}
              onChange={(e) => {
                setWrittenFeedback(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Tell us what you liked about this Infosys test, how realistic the questions were, how the AI recruiter performed, and any improvements..."
              className="w-full bg-slate-950 text-slate-200 text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-primary-500 leading-relaxed font-sans"
            />

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500">Suggestions:</span>
              {quickPills.map((pill, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAddPill(pill)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  +{pill}
                </button>
              ))}
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-medium flex items-center gap-1 pt-1">
                <AlertCircle size={13} /> {errorMessage}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isValidLength || isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Recording Feedback...' : 'Submit Compulsory Review & Unlock Scorecard'}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              🔒 Submitting unlocks your sectional cutoff results, solution keys, and certification.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

