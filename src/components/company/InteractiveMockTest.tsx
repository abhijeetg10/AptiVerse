import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, XCircle, RotateCcw, AlertTriangle, 
  HelpCircle, ChevronRight, ChevronLeft, Bookmark, Award, BookOpen, 
  ArrowRight, ShieldCheck, ShieldAlert, Sparkles, Video, Maximize2, Play, Lock, LogIn, ArrowLeft, UserCheck 
} from 'lucide-react';
import type { InfosysQuestion, SectionConfig } from '../../data/infosysPrepData';
import { MOCK_TEST_1, type MockTestBundle } from '../../data/infosysMockTests';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface InteractiveMockTestProps {
  bundle?: MockTestBundle;
  onProceedToTechnicalInterview?: () => void;
  onBackToMockList?: () => void;
}

export const InteractiveMockTest: React.FC<InteractiveMockTestProps> = ({ 
  bundle = MOCK_TEST_1,
  onProceedToTechnicalInterview,
  onBackToMockList
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const activeBundle = bundle;
  const sectionsConfig = activeBundle.sectionsConfig;
  const allQuestions = activeBundle.questions;

  const [hasStarted, setHasStarted] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const activeSectionConfig = sectionsConfig[currentSectionIdx] || sectionsConfig[0];

  const sectionQuestions = allQuestions.filter(
    q => q.section === activeSectionConfig.name
  );

  const [activeQuestionInSecIdx, setActiveQuestionInSecIdx] = useState(0);
  const currentQ: InfosysQuestion = sectionQuestions[activeQuestionInSecIdx] || sectionQuestions[0];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});

  const [sectionTimeLeft, setSectionTimeLeft] = useState(activeSectionConfig.timeMinutes * 60);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [speedMode, setSpeedMode] = useState(false);

  // Compulsory Fullscreen states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenAlert, setShowFullscreenAlert] = useState(false);

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        setShowFullscreenAlert(false);
      }
    } catch (err) {
      console.warn('Fullscreen request declined or unsupported:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && hasStarted && !isTestCompleted) {
        setShowFullscreenAlert(true);
      } else {
        setShowFullscreenAlert(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [hasStarted, isTestCompleted]);

  // Reset section timer whenever section changes
  useEffect(() => {
    if (hasStarted && !isTestCompleted) {
      setSectionTimeLeft(speedMode ? 60 : activeSectionConfig.timeMinutes * 60);
      setActiveQuestionInSecIdx(0);
    }
  }, [currentSectionIdx, speedMode, hasStarted, activeSectionConfig]);

  // Section countdown timer (pauses if fullscreen alert is showing)
  useEffect(() => {
    if (!hasStarted || isTestCompleted || showFullscreenAlert) return;

    const timer = setInterval(() => {
      setSectionTimeLeft(prev => {
        if (prev <= 1) {
          handleAdvanceSection(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSectionIdx, hasStarted, isTestCompleted, speedMode, showFullscreenAlert]);

  const handleStartExam = async () => {
    setHasStarted(true);
    setIsTestCompleted(false);
    setCurrentSectionIdx(0);
    setActiveQuestionInSecIdx(0);
    await requestFullscreen();
  };

  const handleSelectOption = (optIdx: number) => {
    if (isTestCompleted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIdx
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Minimal student marks persistence (zero database bloat, no per-question timestamps)
  const saveStudentMarks = async (finalAnswers: { [qId: string]: number }) => {
    let totalScore = 0;
    const sectionalScores: { [secName: string]: number } = {};
    
    sectionsConfig.forEach(sec => {
      const secQs = allQuestions.filter(q => q.section === sec.name);
      const secCorrect = secQs.filter(q => finalAnswers[q.id] === q.correctAnswer).length;
      totalScore += secCorrect;
      sectionalScores[sec.name] = secCorrect;
    });

    const isAllCleared = sectionsConfig.every(sec => {
      const secQs = allQuestions.filter(q => q.section === sec.name);
      const secCorrect = secQs.filter(q => finalAnswers[q.id] === q.correctAnswer).length;
      return secQs.length > 0 ? (secCorrect / secQs.length) * 100 >= sec.cutoffPercentage : true;
    });

    const userKey = user?.id || 'guest';
    const record = {
      user_id: userKey,
      company: 'infosys',
      test_id: activeBundle.id,
      test_title: activeBundle.title,
      score: totalScore,
      total_questions: allQuestions.length,
      sectional_scores: sectionalScores,
      cleared: isAllCleared,
      created_at: new Date().toISOString()
    };

    // 1. Cache to localStorage for fast instant access (both logged in and guest)
    try {
      localStorage.setItem(`aptiverse_infosys_score_${userKey}_${activeBundle.id}`, JSON.stringify(record));
    } catch (e) {
      console.warn('LocalStorage save note:', e);
    }

    // 2. Minimal DB insert if authenticated
    if (user?.id) {
      try {
        await supabase.from('company_mock_scores').insert([{
          user_id: user.id,
          company: 'infosys',
          test_id: activeBundle.id,
          score: totalScore,
          total_questions: allQuestions.length,
          sectional_scores: sectionalScores,
          cleared: isAllCleared
        }]);
      } catch (err) {
        console.warn('DB score save note (non-blocking):', err);
      }
    }
  };

  const handleAdvanceSection = (isAuto: boolean = false) => {
    if (currentSectionIdx + 1 < sectionsConfig.length) {
      if (!isAuto) {
        const confirmMsg = `Are you sure you want to submit "${activeSectionConfig.name}"? You will NOT be able to return to this section once submitted.`;
        if (!window.confirm(confirmMsg)) return;
      }
      setCurrentSectionIdx(prev => prev + 1);
    } else {
      if (!isAuto) {
        if (!window.confirm(`This is the final section. Submit entire ${activeBundle.title}?`)) return;
      }
      setIsTestCompleted(true);
      saveStudentMarks(selectedAnswers);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  };

  const handleResetTest = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentSectionIdx(0);
    setActiveQuestionInSecIdx(0);
    setSectionTimeLeft(sectionsConfig[0].timeMinutes * 60);
    setIsTestCompleted(false);
    setHasStarted(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sectional Cutoff Evaluation
  const sectionalReport = sectionsConfig.map(sec => {
    const questions = allQuestions.filter(q => q.section === sec.name);
    const correctCount = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
    const answeredCount = questions.filter(q => selectedAnswers[q.id] !== undefined).length;
    const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const cleared = scorePct >= sec.cutoffPercentage;

    return {
      ...sec,
      correctCount,
      answeredCount,
      scorePct,
      cleared
    };
  });

  const totalQuestions = allQuestions.length;
  const totalCorrect = sectionalReport.reduce((acc, curr) => acc + curr.correctCount, 0);
  const totalAttempted = Object.keys(selectedAnswers).length;
  const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const allSectionsCleared = sectionalReport.every(sec => sec.cleared);
  const failedSections = sectionalReport.filter(sec => !sec.cleared);

  const handleExitTest = () => {
    if (window.confirm("Are you sure you want to exit the assessment? Your progress in this attempt will be discarded.")) {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      setHasStarted(false);
      setIsTestCompleted(false);
      if (onBackToMockList) {
        onBackToMockList();
      }
    }
  };

  const containerClass = hasStarted && !isTestCompleted
    ? "fixed inset-0 z-[100] bg-[#070b14] text-slate-100 w-screen h-screen flex flex-col overflow-y-auto font-sans antialiased"
    : "bg-[#0b101e] text-slate-100 rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden font-sans relative antialiased";

  return (
    <div className={containerClass}>
      
      {/* Student Sign-In Compulsory Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#11192e] border border-blue-500/40 rounded-3xl p-8 max-w-md text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-500/20">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Student Sign-In Required</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Sign in with your student account to attempt the Infosys Mock Test and save your sectional cutoffs.
            </p>
            <button
              onClick={async () => {
                await signInWithGoogle();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all mb-2.5 active:scale-98"
            >
              <LogIn size={18} /> Sign In with Google
            </button>
            <button
              onClick={async () => {
                setShowSignInModal(false);
                await handleStartExam();
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all mb-3"
            >
              <UserCheck size={16} className="text-emerald-400" /> Continue as Guest (Practice Mode)
            </button>
            <button
              onClick={() => setShowSignInModal(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Violation Alert Modal with BOTH Re-Enter and Exit Buttons */}
      {showFullscreenAlert && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#11192e] border-2 border-red-500/80 rounded-3xl p-8 max-w-lg text-center shadow-2xl animate-bounce-short">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40 shadow-lg shadow-red-500/20">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Proctoring Alert: Fullscreen Exited</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Compulsory Full-Screen is enforced for the Infosys Assessment. Your timer is paused. Exiting full-screen during a real placement exam terminates the candidate session.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={requestFullscreen}
                className="flex-1 w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Maximize2 size={16} /> Re-Enter Fullscreen Assessment
              </button>
              <button
                onClick={handleExitTest}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-2xl border border-slate-700 transition-colors text-sm"
              >
                Exit Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Proctored Banner */}
      <div className="bg-[#0b101e] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-sm">
            INF
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-extrabold text-base text-white tracking-wide">
                {activeBundle.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                {activeBundle.tag} • {activeBundle.totalQuestions} Questions • {activeBundle.totalTimeMinutes} Min
              </span>
              {hasStarted && !isTestCompleted && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Proctoring Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Section-by-section timed screening • Negative marking: None
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onBackToMockList && !hasStarted && !isTestCompleted && (
            <button
              onClick={onBackToMockList}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-750 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Mock Tests
            </button>
          )}

          {hasStarted && !isTestCompleted && (
            <button
              onClick={() => setSpeedMode(!speedMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                speedMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {speedMode ? '⚡ Fast Test (60s/sec)' : `Standard Time (${activeBundle.totalTimeMinutes}m)`}
            </button>
          )}

          {hasStarted && !isTestCompleted && (
            <button
              onClick={handleExitTest}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600/15 hover:bg-red-600/30 text-red-300 border border-red-500/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              Exit Assessment
            </button>
          )}

          {hasStarted && !isTestCompleted ? (
            <div className="flex items-center gap-2.5 bg-[#121a2d] px-4 py-2 rounded-xl border border-slate-750 shadow-inner">
              <Clock size={16} className={`text-amber-400 ${sectionTimeLeft < 180 ? 'animate-bounce text-red-400' : ''}`} />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">Section Time</span>
                <span className="font-mono text-base font-extrabold text-white leading-none">
                  {formatTime(sectionTimeLeft)}
                </span>
              </div>
            </div>
          ) : isTestCompleted ? (
            <button
              onClick={handleResetTest}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw size={14} /> Retake Assessment
            </button>
          ) : null}
        </div>
      </div>

      {/* PRE-TEST INSTRUCTIONS & FULLSCREEN LAUNCHER */}
      {!hasStarted && !isTestCompleted ? (
        <div className="p-8 lg:p-14 max-w-3xl mx-auto text-center font-sans">
          {onBackToMockList && (
            <button
              onClick={onBackToMockList}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back to All 4 Mock Tests
            </button>
          )}

          <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-blue-500/20 shadow-xl shadow-blue-500/10">
            <Maximize2 size={36} />
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2">
            Ready to Begin {activeBundle.title}?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            {activeBundle.description} This assessment has <strong>{activeBundle.totalQuestions} questions</strong> across <strong>{sectionsConfig.length} timed sections</strong>.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8 max-w-xl mx-auto text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="font-bold text-slate-100 mb-1 flex items-center gap-1.5">
                <Maximize2 size={14} className="text-blue-400" /> Compulsory Full-Screen:
              </div>
              <div className="text-slate-400">Exiting full screen will pause your timer and trigger a proctoring violation warning.</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="font-bold text-slate-100 mb-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> Section Evaluation:
              </div>
              <div className="text-slate-400">Infosys has section-wise cutoffs, so prepare well for all sections.</div>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 mx-auto text-base active:scale-95"
          >
            <Play size={20} className="fill-white" />
            Enter Fullscreen & Launch {activeBundle.totalQuestions}-Question Assessment
          </button>
        </div>
      ) : !isTestCompleted ? (
        /* TEST IN PROGRESS */
        <div className="flex-1 flex flex-col">
          {/* Section Progress Stepper */}
          <div className="bg-[#0b1120] px-6 py-2.5 border-b border-slate-800/80 flex items-center gap-2.5 overflow-x-auto text-xs">
            {sectionsConfig.map((sec, idx) => {
              const isCurrent = idx === currentSectionIdx;
              const isPast = idx < currentSectionIdx;

              return (
                <div 
                  key={sec.id}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    isCurrent 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/40' 
                      : isPast 
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-medium' 
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800/70'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? 'bg-white text-blue-700 shadow-sm' : isPast ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span>{sec.name}</span>
                  <span className="text-[11px] opacity-75 font-mono">({sec.questionCount}Q • {sec.timeMinutes}m)</span>
                </div>
              );
            })}
          </div>

          <div className="p-6 lg:p-8 flex-1">
            <div className="grid lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto">
              
              {/* Left 8 cols: Active Question Canvas */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                
                {/* Question Card */}
                <div className="bg-[#11192e] rounded-2xl border border-slate-800/90 shadow-2xl p-6 lg:p-8 relative">
                  
                  {/* Question Header Meta */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5 flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                        Section {currentSectionIdx + 1}: {activeSectionConfig.name}
                      </span>
                      <span className="text-slate-300 font-semibold bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700/60">
                        Question {activeQuestionInSecIdx + 1} of {sectionQuestions.length}
                      </span>
                      <span className="text-slate-400 hidden sm:inline">• {currentQ.topic}</span>
                    </div>

                    <button
                      onClick={handleToggleReview}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        markedForReview[currentQ.id]
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Bookmark size={13} className={markedForReview[currentQ.id] ? "fill-amber-400 text-amber-400" : ""} />
                      <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                    </button>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-lg text-white font-medium leading-relaxed whitespace-pre-line mb-4 select-text">
                    {currentQ.question}
                  </p>

                  {/* Code Snippet if present */}
                  {currentQ.codeSnippet && (
                    <div className="bg-[#090d16] text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-4 shadow-inner">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-800/80 mb-2 font-sans font-bold flex items-center justify-between">
                        <span>Code Reference</span>
                        <span className="text-slate-600">Pseudocode</span>
                      </div>
                      <pre className="leading-relaxed">{currentQ.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Section Evaluation Advisory */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-800/70">
                    <span className="font-medium text-blue-400">
                      💡 Infosys has section-wise cutoffs, so prepare well for all sections.
                    </span>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <span className="hidden sm:inline text-slate-400">Topic: <strong className="text-slate-300">{currentQ.topic}</strong></span>
                  </div>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`group w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between text-sm ${
                          isSelected
                            ? 'border-blue-500 bg-gradient-to-r from-blue-950/60 to-indigo-950/40 text-white ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10'
                            : 'border-slate-800/90 bg-[#11192e]/80 hover:bg-[#16213c] hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isSelected 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                              : 'bg-slate-800 border border-slate-700/80 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="font-normal leading-relaxed">{option}</span>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected 
                            ? 'border-blue-400 bg-blue-600 text-white' 
                            : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-2">
                  <button
                    disabled={activeQuestionInSecIdx === 0}
                    onClick={() => setActiveQuestionInSecIdx(prev => prev - 1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 bg-[#11192e] text-slate-300 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <div className="flex items-center gap-3">
                    {selectedAnswers[currentQ.id] !== undefined && (
                      <button
                        onClick={() => {
                          const updated = { ...selectedAnswers };
                          delete updated[currentQ.id];
                          setSelectedAnswers(updated);
                        }}
                        className="text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1"
                      >
                        Clear Selection
                      </button>
                    )}

                    {activeQuestionInSecIdx + 1 < sectionQuestions.length ? (
                      <button
                        onClick={() => setActiveQuestionInSecIdx(prev => prev + 1)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all active:scale-95"
                      >
                        Save & Next Question <ChevronRight size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdvanceSection(false)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
                      >
                        {currentSectionIdx + 1 === sectionsConfig.length ? 'Submit Final Assessment' : 'Submit Section & Move to Next'}
                        <ChevronRight size={15} />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Right 4 cols: Section Question Palette */}
              <div className="lg:col-span-4 bg-[#11192e] p-5 rounded-2xl border border-slate-800/90 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm text-white">
                    {activeSectionConfig.name} Palette
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {sectionQuestions.filter(q => selectedAnswers[q.id] !== undefined).length}/{sectionQuestions.length} Answered
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Questions in this section ({sectionQuestions.length}). You must finish this section before the timer expires.
                </p>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-blue-600" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-500" />
                    <span>Marked Review</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md border-2 border-blue-400 bg-slate-900" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
                    <span>Unanswered</span>
                  </div>
                </div>

                {/* Palette Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
                  {sectionQuestions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isMarked = markedForReview[q.id];
                    const isCurrent = idx === activeQuestionInSecIdx;

                    let btnStyle = 'bg-slate-800/80 text-slate-400 border-slate-750 hover:bg-slate-800 hover:text-white';
                    if (isAnswered) btnStyle = 'bg-blue-600 text-white border-blue-500 font-bold shadow-sm shadow-blue-600/30';
                    if (isMarked) btnStyle = 'bg-amber-500 text-slate-950 border-amber-400 font-bold';
                    if (isCurrent) btnStyle += ' ring-2 ring-blue-400 ring-offset-2 ring-offset-[#11192e]';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionInSecIdx(idx)}
                        className={`h-9 rounded-xl text-xs font-semibold border transition-all ${btnStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-blue-300">
                    <ShieldCheck size={14} className="text-blue-400" /> Section Evaluation Rule:
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    Infosys has section-wise cutoffs, so prepare well for all sections.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* SECTIONAL SCORECARD & CUTOFF EVALUATION */
        <div className="p-6 lg:p-10 font-sans">
          
          <div className={`rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden ${
            allSectionsCleared 
              ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40' 
              : 'bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border border-red-500/40'
          }`}>
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-2">
                  {allSectionsCleared ? (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <ShieldCheck size={14} /> ALL SECTIONAL CUTOFFS CLEARED
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1.5">
                      <ShieldAlert size={14} /> MISSED SECTIONAL CUTOFF ({failedSections.length} Sections)
                    </span>
                  )}
                </div>

                <h3 className="text-3xl font-extrabold text-white mb-2">
                  {allSectionsCleared 
                    ? '🎉 Congratulations! You Qualified for Round 2 (Technical Interview)' 
                    : 'Placement Assessment Screening Result: Not Cleared'}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  {allSectionsCleared
                    ? 'You have successfully met or exceeded the official cutoff benchmarks across Reasoning, Math, Verbal, Pseudocode, and Puzzles. You are ready to enter the Technical Interview panel.'
                    : `In official Infosys screening, candidates must clear every section. You scored ${overallPercentage}%, but missed cutoff in: ${failedSections.map(f => f.name).join(', ')}. Review the solutions below and re-test.`}
                </p>

                {onProceedToTechnicalInterview && (
                  <button
                    onClick={onProceedToTechnicalInterview}
                    className="mt-6 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Video size={18} /> {allSectionsCleared ? 'Proceed to Round 2 (Technical AI Interview)' : 'Continue to Round 2 (Technical AI Interview)'} <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* Overall Score Dial */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 text-center w-full max-w-[260px]">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Total Score</div>
                  <div className="text-5xl font-extrabold text-white">
                    {totalCorrect} <span className="text-2xl text-slate-400 font-normal">/ {totalQuestions}</span>
                  </div>
                  <div className={`text-sm font-bold mt-2 ${allSectionsCleared ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {overallPercentage}% Overall Accuracy
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Attempted: {totalAttempted} of {totalQuestions}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section-Wise Cutoff Breakdown Table */}
          <h4 className="font-extrabold text-lg text-white mb-4 flex items-center gap-2">
            <Award size={20} className="text-blue-400" />
            Official Infosys Section-Wise Evaluation Analysis
          </h4>

          <div className="grid md:grid-cols-5 gap-4 mb-10">
            {sectionalReport.map((sec) => (
              <div 
                key={sec.id}
                className={`p-5 rounded-2xl border transition-all ${
                  sec.cleared 
                    ? 'bg-emerald-950/30 border-emerald-500/40' 
                    : 'bg-red-950/30 border-red-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-200 truncate">{sec.name}</span>
                  {sec.cleared ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CLEARED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      FAILED
                    </span>
                  )}
                </div>

                <div className="text-2xl font-extrabold text-white my-1">
                  {sec.correctCount} / {sec.questionCount}
                </div>

                <div className="text-xs text-slate-300 mb-2">
                  Accuracy: <strong className="text-white">{sec.scorePct}%</strong>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${sec.cleared ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, sec.scorePct)}%` }}
                  />
                </div>

                <div className="text-[10px] text-slate-400 mt-2 font-medium">
                  Section-wise cutoff applies
                </div>
              </div>
            ))}
          </div>

          {/* Complete Solutions List */}
          <div className="pt-6 border-t border-slate-800">
            <h4 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-400" />
              Complete Question Review & Step-by-Step Solutions ({allQuestions.length} Questions)
            </h4>

            <div className="space-y-4">
              {allQuestions.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;
                const isSkipped = userChoice === undefined;

                return (
                  <div 
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect 
                        ? 'bg-[#111c2e] border-emerald-500/30' 
                        : isSkipped 
                          ? 'bg-[#101726] border-slate-800' 
                          : 'bg-[#1a1420] border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Q{idx + 1}</span>
                        <span className="text-blue-300 font-semibold bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 rounded">
                          {q.section}
                        </span>
                        <span className="text-slate-400">• {q.topic}</span>
                      </div>

                      <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : isSkipped ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {isCorrect ? 'Correct (+1)' : isSkipped ? 'Skipped' : 'Incorrect (0)'}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-200 mb-2 leading-relaxed whitespace-pre-line">
                      {q.question}
                    </p>

                    {q.codeSnippet && (
                      <div className="bg-[#090d16] text-emerald-400 p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-3 border border-slate-800">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-2 text-xs my-3">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctAnswer;
                        const isUserPick = optIdx === userChoice;

                        let badgeClass = 'bg-slate-900/80 border-slate-800 text-slate-300';
                        if (isThisCorrect) badgeClass = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-bold';
                        else if (isUserPick) badgeClass = 'bg-red-950/60 border-red-500/60 text-red-200 font-bold';

                        return (
                          <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${badgeClass}`}>
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isThisCorrect && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
                            {isUserPick && !isThisCorrect && <XCircle size={14} className="text-red-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-blue-400 font-bold">Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
