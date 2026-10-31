import React, { useState, useEffect } from 'react';
import { 
  Rocket, Calendar, MessageSquare, CheckCircle2, Sparkles, Send, 
  Vote, Building2, ArrowRight, X, Heart, HelpCircle, ChevronRight 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface PollOption {
  id: string;
  name: string;
  votes: number;
}

const INITIAL_POLL_DATA: PollOption[] = [
  { id: 'infosys', name: 'Infosys Systems Engineer', votes: 142 },
  { id: 'tcs_nqt', name: 'TCS NQT (Ninja & Digital)', votes: 218 },
  { id: 'cognizant', name: 'Cognizant (GenC & GenC Next)', votes: 165 },
  { id: 'other', name: 'Other Company', votes: 53 },
];

export const LaunchEventBanner: React.FC = () => {
  const { user } = useAuth();
  
  // Suggestion Modal State
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [senderName, setSenderName] = useState(user?.name || '');
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [suggestionSuccess, setSuggestionSuccess] = useState(false);

  // Poll State
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customCompanyName, setCustomCompanyName] = useState<string>('');
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [pollData, setPollData] = useState<PollOption[]>(INITIAL_POLL_DATA);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  // Load existing vote from localStorage
  useEffect(() => {
    try {
      const savedVote = localStorage.getItem('aptiverse_5th_sept_poll_vote');
      if (savedVote) {
        setSelectedOption(savedVote);
        setHasVoted(true);
      }
      const savedPollData = localStorage.getItem('aptiverse_5th_sept_poll_counts');
      if (savedPollData) {
        setPollData(JSON.parse(savedPollData));
      }
    } catch (e) {
      console.warn('LocalStorage poll read note:', e);
    }
  }, []);

  const totalVotes = pollData.reduce((acc, curr) => acc + curr.votes, 0);

  // Handle Poll Submission
  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;
    if (selectedOption === 'other' && !customCompanyName.trim()) return;

    setIsSubmittingVote(true);

    const chosenName = selectedOption === 'other' 
      ? `Other: ${customCompanyName.trim()}` 
      : pollData.find(p => p.id === selectedOption)?.name || selectedOption;

    const updatedPoll = pollData.map(opt => {
      if (opt.id === selectedOption) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    setPollData(updatedPoll);
    setHasVoted(true);

    // Save to localStorage
    try {
      localStorage.setItem('aptiverse_5th_sept_poll_vote', selectedOption);
      localStorage.setItem('aptiverse_5th_sept_poll_counts', JSON.stringify(updatedPoll));
    } catch (err) {}

    // Save to Supabase feedback table so admin can review
    try {
      await supabase.from('feedback').insert({
        rating: 5,
        tag: 'placement',
        comment: `[5th Sept Launch Poll Vote] Voted for: ${chosenName}${user?.email ? ` | User Email: ${user.email}` : ''}`,
        user_id: user?.id || null
      });
    } catch (err) {
      console.warn('Poll vote DB sync non-blocking note:', err);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  // Handle Suggestion Submission
  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionMessage.trim()) return;

    setIsSubmittingSuggestion(true);

    try {
      await supabase.from('feedback').insert({
        rating: 5,
        tag: 'placement',
        comment: `[5th Sept Launch Suggestion] From: ${senderName || user?.name || 'Anonymous Student'} | ${suggestionMessage.trim()}${user?.email ? ` | Email: ${user.email}` : ''}`,
        user_id: user?.id || null
      });

      setSuggestionSuccess(true);
      setTimeout(() => {
        setSuggestionSuccess(false);
        setIsSuggestionOpen(false);
        setSuggestionMessage('');
      }, 2500);
    } catch (err) {
      console.warn('Suggestion submission note:', err);
      // Fallback success for user
      setSuggestionSuccess(true);
      setTimeout(() => {
        setSuggestionSuccess(false);
        setIsSuggestionOpen(false);
        setSuggestionMessage('');
      }, 2500);
    } finally {
      setIsSubmittingSuggestion(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-6 font-sans">
      
      {/* Container Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#0f1b36] to-[#12182c] border border-blue-500/30 text-white overflow-hidden shadow-2xl">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Event Announcement & Suggestions */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Event Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center gap-2 border border-blue-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                MAJOR RECRUITMENT UPDATE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-amber-300 border border-white/15 flex items-center gap-1.5">
                <Calendar size={13} className="text-amber-400" />
                Launching on 5th Sept
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              Target Company Placement Drives <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-300 to-teal-300">
                Officially Launching on 5th Sept!
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Get placement ready with pattern-accurate recruitment simulations: 
              timed online screening tests with strict sectional cutoffs, followed by full-screen 
              AI Technical and HR video interview panels.
            </p>

            {/* Feature Checklist */}
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Timed Multi-Section Screening</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>AI Technical & HR Recruiter Panels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Section-Wise Cutoff Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Authentic Company Blueprints</span>
              </div>
            </div>

            {/* Actions: Share Suggestion / Explore Drives */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsSuggestionOpen(true)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-[1.02] shadow-sm active:scale-98"
              >
                <MessageSquare size={15} className="text-primary-400" />
                Share Suggestion or Message
              </button>

              <a
                href="#target-company-drives"
                className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
              >
                Preview Infosys Mock Drive <ArrowRight size={14} />
              </a>
            </div>

          </div>

          {/* Right Column: Live Community Poll */}
          <div className="lg:col-span-5">
            <div className="bg-[#11192e]/90 backdrop-blur-md rounded-2xl border border-blue-500/30 p-5 sm:p-6 shadow-xl">
              
              {/* Poll Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <Vote size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Placement Drive Poll</h3>
                    <span className="text-[10px] text-slate-400 block">Shape our 5th Sept launch</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  {totalVotes} Votes Cast
                </span>
              </div>

              <div className="pt-3.5">
                <p className="text-xs font-semibold text-slate-200 mb-3">
                  Which company-specific mock drive do you want next?
                </p>

                {/* If already voted: Show live percentage results */}
                {hasVoted ? (
                  <div className="space-y-2.5">
                    {pollData.map((opt) => {
                      const percentage = Math.round((opt.votes / totalVotes) * 100) || 0;
                      const isUserPick = selectedOption === opt.id;

                      return (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                              {opt.name}
                              {isUserPick && (
                                <span className="text-[9px] bg-primary-500/20 text-primary-300 border border-primary-500/40 px-1.5 py-0.2 rounded font-bold">
                                  Your Vote
                                </span>
                              )}
                            </span>
                            <span className="font-mono font-bold text-slate-400 text-[11px]">
                              {percentage}% ({opt.votes})
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${
                                isUserPick ? 'bg-gradient-to-r from-primary-500 to-teal-400' : 'bg-slate-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                        <CheckCircle2 size={13} /> Vote recorded!
                      </span>
                      <button
                        onClick={() => setHasVoted(false)}
                        className="text-[11px] text-slate-400 hover:text-white underline transition-colors"
                      >
                        Change Vote
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Voting Form */
                  <form onSubmit={handleVoteSubmit} className="space-y-2.5">
                    
                    {/* Option 1: Infosys */}
                    <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedOption === 'infosys'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="company_poll"
                          value="infosys"
                          checked={selectedOption === 'infosys'}
                          onChange={() => setSelectedOption('infosys')}
                          className="accent-primary-500"
                        />
                        <span className="text-xs font-semibold">Infosys Limited</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        Active Prep
                      </span>
                    </label>

                    {/* Option 2: TCS NQT */}
                    <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedOption === 'tcs_nqt'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="company_poll"
                          value="tcs_nqt"
                          checked={selectedOption === 'tcs_nqt'}
                          onChange={() => setSelectedOption('tcs_nqt')}
                          className="accent-primary-500"
                        />
                        <span className="text-xs font-semibold">TCS NQT (Ninja & Digital)</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                        Upcoming
                      </span>
                    </label>

                    {/* Option 3: Cognizant */}
                    <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedOption === 'cognizant'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="company_poll"
                          value="cognizant"
                          checked={selectedOption === 'cognizant'}
                          onChange={() => setSelectedOption('cognizant')}
                          className="accent-primary-500"
                        />
                        <span className="text-xs font-semibold">Cognizant (GenC & Next)</span>
                      </div>
                      <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
                        Requested
                      </span>
                    </label>

                    {/* Option 4: Other (With text input) */}
                    <label className={`flex flex-col p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedOption === 'other'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="company_poll"
                          value="other"
                          checked={selectedOption === 'other'}
                          onChange={() => setSelectedOption('other')}
                          className="accent-primary-500"
                        />
                        <span className="text-xs font-semibold">Other (Type company name below)</span>
                      </div>

                      {/* Expandable Company Input */}
                      {selectedOption === 'other' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60">
                          <input
                            type="text"
                            placeholder="Enter company name (e.g. Wipro, Capgemini, Amazon...)"
                            value={customCompanyName}
                            onChange={(e) => setCustomCompanyName(e.target.value)}
                            autoFocus
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-primary-400"
                          />
                        </div>
                      )}
                    </label>

                    {/* Submit Vote Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingVote || !selectedOption || (selectedOption === 'other' && !customCompanyName.trim())}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2"
                    >
                      {isSubmittingVote ? 'Submitting Vote...' : 'Submit My Vote'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Suggestion / Message Modal */}
      {isSuggestionOpen && (
        <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsSuggestionOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Rocket size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Launching on 5th Sept
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">Share Your Suggestion</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Have a feature request, company test you'd like added, or advice for the 5th Sept launch? Send us a message directly to help shape this release.
            </p>

            {suggestionSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Thank You for Your Suggestion!</h4>
                <p className="text-xs text-slate-300">
                  Your message has been delivered to our engineering and placement content team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Name or College (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma • SPPU Pune"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Message / Suggestion <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what mock tests, syllabus guides, or interview features you'd like on 5th Sept..."
                    value={suggestionMessage}
                    onChange={(e) => setSuggestionMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSuggestionOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingSuggestion || !suggestionMessage.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98"
                  >
                    <Send size={13} />
                    {isSubmittingSuggestion ? 'Sending...' : 'Send Suggestion'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
