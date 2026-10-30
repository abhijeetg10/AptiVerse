import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, XCircle, RotateCcw, AlertTriangle, 
  HelpCircle, ChevronRight, ChevronLeft, Bookmark, Award, BookOpen, 
  ArrowRight, ShieldCheck, ShieldAlert, Sparkles, Video, Maximize2, Play 
} from 'lucide-react';
import { 
  OFFICIAL_54_QUESTIONS, 
  INFOSYS_SECTIONS_CONFIG, 
  type InfosysQuestion, 
  type SectionConfig 
} from '../../data/infosysPrepData';

interface InteractiveMockTestProps {
  onProceedToTechnicalInterview?: () => void;
}

export const InteractiveMockTest: React.FC<InteractiveMockTestProps> = ({ 
  onProceedToTechnicalInterview 
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const activeSectionConfig = INFOSYS_SECTIONS_CONFIG[currentSectionIdx];

  const sectionQuestions = OFFICIAL_54_QUESTIONS.filter(
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
  }, [currentSectionIdx, speedMode, hasStarted]);

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

  const handleAdvanceSection = (isAuto: boolean = false) => {
    if (currentSectionIdx + 1 < INFOSYS_SECTIONS_CONFIG.length) {
      if (!isAuto) {
        const confirmMsg = `Are you sure you want to submit "${activeSectionConfig.name}"? You will NOT be able to return to this section once submitted.`;
        if (!window.confirm(confirmMsg)) return;
      }
      setCurrentSectionIdx(prev => prev + 1);
    } else {
      if (!isAuto) {
        if (!window.confirm("This is the final section. Submit entire Infosys Round 1 assessment?")) return;
      }
      setIsTestCompleted(true);
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
    setSectionTimeLeft(INFOSYS_SECTIONS_CONFIG[0].timeMinutes * 60);
    setIsTestCompleted(false);
    setHasStarted(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sectional Cutoff Evaluation
  const sectionalReport = INFOSYS_SECTIONS_CONFIG.map(sec => {
    const questions = OFFICIAL_54_QUESTIONS.filter(q => q.section === sec.name);
    const correctCount = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
    const answeredCount = questions.filter(q => selectedAnswers[q.id] !== undefined).length;
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const cleared = scorePct >= sec.cutoffPercentage;

    return {
      ...sec,
      correctCount,
      answeredCount,
      scorePct,
      cleared
    };
  });

  const totalQuestions = OFFICIAL_54_QUESTIONS.length;
  const totalCorrect = sectionalReport.reduce((acc, curr) => acc + curr.correctCount, 0);
  const totalAttempted = Object.keys(selectedAnswers).length;
  const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);
  const allSectionsCleared = sectionalReport.every(sec => sec.cleared);
  const failedSections = sectionalReport.filter(sec => !sec.cleared);

  const handleExitTest = () => {
    if (window.confirm("Are you sure you want to exit the assessment? Your progress in this attempt will be discarded.")) {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      setHasStarted(false);
      setIsTestCompleted(false);
    }
  };

  const containerClass = hasStarted && !isTestCompleted
    ? "fixed inset-0 z-[100] bg-[#070b14] w-screen h-screen flex flex-col overflow-y-auto font-sans"
    : "bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden font-sans relative";

  return (
    <div className={containerClass}>
      
      {/* Fullscreen Violation Alert Modal */}
      {showFullscreenAlert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white border-2 border-red-500 rounded-3xl p-8 max-w-lg text-center shadow-2xl animate-bounce-short">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 mb-2">Proctoring Alert: Fullscreen Exited</h3>
            <p className="text-neutral-600 text-sm leading-relaxed mb-6">
              Compulsory Full-Screen is enforced for the Infosys Assessment. Your timer is paused. Exiting full-screen during a real placement exam terminates the session.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Maximize2 size={16} /> Re-Enter Fullscreen Assessment
            </button>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-white">
              Infosys Systems Engineer Assessment (Round 1)
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary-600/30 text-primary-300 border border-primary-500/30">
              Format A • 54 Questions • 100 Minutes
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Section-by-section timed screening with strict sectional cutoff thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasStarted && !isTestCompleted && (
            <button
              onClick={() => setSpeedMode(!speedMode)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                speedMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {speedMode ? '⚡ Fast Test (60s/sec)' : 'Normal Timers (100m)'}
            </button>
          )}

          {hasStarted && !isTestCompleted && (
            <button
              onClick={handleExitTest}
              className="p-2 rounded-xl text-xs font-semibold bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 flex items-center gap-1.5 transition-colors"
            >
              Exit Assessment
            </button>
          )}

          {hasStarted && !isTestCompleted ? (
            <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <Clock size={16} className={`text-amber-400 ${sectionTimeLeft < 180 ? 'animate-bounce text-red-400' : ''}`} />
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px] leading-none">Section Time Left</span>
                <span className="font-mono text-sm font-bold text-white leading-none">
                  {formatTime(sectionTimeLeft)}
                </span>
              </div>
            </div>
          ) : isTestCompleted ? (
            <button
              onClick={handleResetTest}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} /> Retake Assessment
            </button>
          ) : null}
        </div>
      </div>

      {/* PRE-TEST INSTRUCTIONS & FULLSCREEN LAUNCHER */}
      {!hasStarted && !isTestCompleted ? (
        <div className="p-8 lg:p-12 max-w-3xl mx-auto text-center font-sans">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-primary-100 shadow-inner">
            <Maximize2 size={36} />
          </div>

          <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
            Ready to Begin Official Infosys Assessment?
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-xl mx-auto">
            This test follows the authentic <strong>Format A blueprint</strong>: 54 questions, 100 minutes, and strict sectional cutoffs across all 5 sections.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8 max-w-xl mx-auto text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                <Maximize2 size={14} className="text-primary-600" /> Compulsory Full-Screen:
              </div>
              <div className="text-neutral-500">Exiting full screen will trigger a proctoring violation warning.</div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" /> Sectional Cutoffs:
              </div>
              <div className="text-neutral-500">You must pass ALL 5 sections independently to qualify for the interview.</div>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-xl shadow-primary-600/30 transition-all flex items-center justify-center gap-3 mx-auto text-base active:scale-95"
          >
            <Play size={20} className="fill-white" />
            Enter Fullscreen & Launch 54-Question Assessment
          </button>
        </div>
      ) : !isTestCompleted ? (
        /* TEST IN PROGRESS */
        <div>
          {/* Section Progress Stepper */}
          <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            {INFOSYS_SECTIONS_CONFIG.map((sec, idx) => {
              const isCurrent = idx === currentSectionIdx;
              const isPast = idx < currentSectionIdx;

              return (
                <div 
                  key={sec.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    isCurrent 
                      ? 'bg-primary-600 text-white font-bold shadow-md' 
                      : isPast 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? 'bg-white text-primary-700' : isPast ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span>{sec.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({sec.questionCount} Qs / {sec.timeMinutes}m)</span>
                </div>
              );
            })}
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left 8 cols: Active Question Canvas */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Question Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-lg">
                      Section {currentSectionIdx + 1}: {activeSectionConfig.name}
                    </span>
                    <span className="text-primary-700 font-semibold bg-primary-50 px-2.5 py-1 rounded-lg">
                      Question {activeQuestionInSecIdx + 1} of {sectionQuestions.length}
                    </span>
                    <span className="text-neutral-500 hidden sm:inline">• {currentQ.topic}</span>
                  </div>

                  <button
                    onClick={handleToggleReview}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      markedForReview[currentQ.id]
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <Bookmark size={13} />
                    <span>{markedForReview[currentQ.id] ? 'Marked' : 'Mark for Review'}</span>
                  </button>
                </div>

                {/* Question Box */}
                <div className="bg-neutral-50/80 p-6 rounded-2xl border border-neutral-200/80">
                  <p className="text-base text-neutral-900 font-medium leading-relaxed whitespace-pre-line mb-3">
                    {currentQ.question}
                  </p>

                  {currentQ.codeSnippet && (
                    <div className="bg-[#0f172a] text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-neutral-800 my-3 shadow-inner">
                      <pre>{currentQ.codeSnippet}</pre>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/60">
                    <span>Section Cutoff: <strong className="text-neutral-700">{activeSectionConfig.cutoffPercentage}% (≥{activeSectionConfig.minCorrectRequired} correct)</strong></span>
                    <span>•</span>
                    <span>Source: <strong className="text-neutral-700">{currentQ.evidence}</strong></span>
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
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-sm ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50/70 text-primary-950 font-medium shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-primary-600' : 'border-neutral-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <button
                    disabled={activeQuestionInSecIdx === 0}
                    onClick={() => setActiveQuestionInSecIdx(prev => prev - 1)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
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
                        className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        Clear
                      </button>
                    )}

                    {activeQuestionInSecIdx + 1 < sectionQuestions.length ? (
                      <button
                        onClick={() => setActiveQuestionInSecIdx(prev => prev + 1)}
                        className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary-600/20 transition-all active:scale-95"
                      >
                        Save & Next Question <ChevronRight size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdvanceSection(false)}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                      >
                        {currentSectionIdx + 1 === INFOSYS_SECTIONS_CONFIG.length ? 'Submit Final Assessment' : 'Submit Section & Move to Next'}
                        <ChevronRight size={15} />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Right 4 cols: Section Question Palette */}
              <div className="lg:col-span-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200/80">
                <div className="font-bold text-sm text-neutral-900 mb-2">
                  {activeSectionConfig.name} Palette
                </div>
                <p className="text-xs text-neutral-500 mb-4">
                  Questions in this section ({sectionQuestions.length}). You must finish this section before the timer expires.
                </p>

                <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {sectionQuestions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isMarked = markedForReview[q.id];
                    const isCurrent = idx === activeQuestionInSecIdx;

                    let style = 'bg-white text-neutral-700 border-neutral-200';
                    if (isAnswered) style = 'bg-primary-600 text-white border-primary-600 font-bold';
                    if (isMarked) style = 'bg-amber-400 text-neutral-900 border-amber-500 font-bold';
                    if (isCurrent) style += ' ring-2 ring-primary-500 ring-offset-2';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionInSecIdx(idx)}
                        className={`h-9 rounded-xl text-xs font-semibold border transition-all ${style}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-primary-50 border border-primary-100 text-xs text-primary-950">
                  <div className="font-bold mb-0.5 flex items-center gap-1.5 text-primary-800">
                    <ShieldCheck size={14} /> Strict Cutoff Rule:
                  </div>
                  <div>
                    Infosys requires passing <strong>ALL 5 sections</strong> independently. Scoring high in Math will not compensate for failing Pseudocode or Verbal cutoffs.
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

                {allSectionsCleared && onProceedToTechnicalInterview && (
                  <button
                    onClick={onProceedToTechnicalInterview}
                    className="mt-6 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Video size={18} /> Proceed to Round 2 (Technical AI Interview) <ArrowRight size={16} />
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
          <h4 className="font-extrabold text-lg text-neutral-900 mb-4 flex items-center gap-2">
            <Award size={20} className="text-primary-600" />
            Official Infosys Section-Wise Cutoff Analysis
          </h4>

          <div className="grid md:grid-cols-5 gap-4 mb-10">
            {sectionalReport.map((sec) => (
              <div 
                key={sec.id}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  sec.cleared 
                    ? 'bg-emerald-50/50 border-emerald-300/80' 
                    : 'bg-red-50/50 border-red-300/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-neutral-900 truncate">{sec.name}</span>
                  {sec.cleared ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      CLEARED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                      FAILED
                    </span>
                  )}
                </div>

                <div className="text-2xl font-extrabold text-neutral-900 my-1">
                  {sec.correctCount} / {sec.questionCount}
                </div>

                <div className="text-xs text-neutral-600 mb-2">
                  Score: <strong>{sec.scorePct}%</strong> (Req: {sec.cutoffPercentage}%)
                </div>

                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${sec.cleared ? 'bg-emerald-600' : 'bg-red-600'}`}
                    style={{ width: `${Math.min(100, sec.scorePct)}%` }}
                  />
                </div>

                <div className="text-[10px] text-neutral-500 mt-2">
                  Min to pass: {sec.minCorrectRequired} of {sec.questionCount} Qs
                </div>
              </div>
            ))}
          </div>

          {/* Complete Solutions List */}
          <div className="pt-6 border-t border-neutral-200">
            <h4 className="font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-primary-600" />
              Complete Question Review & Step-by-Step Solutions (54 Questions)
            </h4>

            <div className="space-y-4">
              {OFFICIAL_54_QUESTIONS.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;
                const isSkipped = userChoice === undefined;

                return (
                  <div 
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : isSkipped 
                          ? 'bg-neutral-50 border-neutral-200' 
                          : 'bg-red-50/20 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">Q{idx + 1}</span>
                        <span className="text-primary-700 font-semibold bg-primary-100/60 px-2 py-0.5 rounded">
                          {q.section}
                        </span>
                        <span className="text-neutral-500">• {q.topic}</span>
                      </div>

                      <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : isSkipped ? 'bg-neutral-200 text-neutral-700' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct (+1)' : isSkipped ? 'Skipped' : 'Incorrect (0)'}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-neutral-900 mb-2 leading-relaxed whitespace-pre-line">
                      {q.question}
                    </p>

                    {q.codeSnippet && (
                      <div className="bg-[#0f172a] text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto my-2">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-2 text-xs my-3">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctAnswer;
                        const isUserPick = optIdx === userChoice;

                        let badgeClass = 'bg-white border-neutral-200 text-neutral-700';
                        if (isThisCorrect) badgeClass = 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold';
                        else if (isUserPick) badgeClass = 'bg-red-100 border-red-300 text-red-950 font-bold';

                        return (
                          <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center justify-between ${badgeClass}`}>
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isThisCorrect && <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />}
                            {isUserPick && !isThisCorrect && <XCircle size={13} className="text-red-700 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-700">
                      <strong className="text-primary-700">Explanation: </strong>
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
