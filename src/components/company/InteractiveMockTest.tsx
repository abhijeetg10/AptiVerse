import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, XCircle, RotateCcw, AlertTriangle, 
  HelpCircle, ChevronRight, ChevronLeft, Bookmark, Award, BookOpen, Filter, Zap 
} from 'lucide-react';
import { MOCK_TEST_QUESTIONS, type InfosysQuestion } from '../../data/infosysPrepData';

interface InteractiveMockTestProps {
  testMode?: 'full' | 'diagnostic';
}

export const InteractiveMockTest: React.FC<InteractiveMockTestProps> = ({ testMode = 'full' }) => {
  // Mock Test 1 (Full): all 34 questions
  // Mock Test 2 (Diagnostic): 15 questions
  const allQuestions: InfosysQuestion[] = testMode === 'diagnostic' 
    ? MOCK_TEST_QUESTIONS.filter((_, idx) => idx % 2 === 0).slice(0, 15)
    : MOCK_TEST_QUESTIONS;

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(testMode === 'diagnostic' ? 25 * 60 : 60 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTimed, setIsTimed] = useState(true);
  const [activeFilterSection, setActiveFilterSection] = useState<string>('All');

  const currentQ = allQuestions[activeQuestionIdx];

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || !isTimed) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, isTimed]);

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
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

  const handleResetTest = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setTimeLeft(testMode === 'diagnostic' ? 25 * 60 : 60 * 60);
    setIsSubmitted(false);
    setActiveQuestionIdx(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Score Calculation
  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = allQuestions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
  const incorrectCount = answeredCount - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Section Breakdown
  const sections = Array.from(new Set(allQuestions.map(q => q.section)));
  const sectionStats = sections.map(sec => {
    const secQuestions = allQuestions.filter(q => q.section === sec);
    const secCorrect = secQuestions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
    return {
      section: sec,
      total: secQuestions.length,
      correct: secCorrect,
      pct: Math.round((secCorrect / secQuestions.length) * 100)
    };
  });

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xl overflow-hidden font-sans">
      
      {/* Top Test Banner */}
      <div className="bg-neutral-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">
              {testMode === 'full' ? 'Infosys Systems Engineer Full Practice Mock (Set A)' : 'Infosys Rapid Diagnostic Logic Assessment'}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30">
              Exam Simulation
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-0.5">
            {totalQuestions} Questions • Pattern-accurate quantitative, reasoning, verbal, pseudocode & puzzles
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isSubmitted && (
            <div className="flex items-center gap-2 bg-neutral-800 px-3.5 py-1.5 rounded-xl border border-neutral-700">
              <Clock size={16} className={`text-amber-400 ${timeLeft < 300 ? 'animate-bounce text-red-400' : ''}`} />
              <span className="font-mono text-sm font-bold text-white">
                {isTimed ? formatTime(timeLeft) : 'Untimed Practice'}
              </span>
            </div>
          )}

          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Submit Mock Test
            </button>
          ) : (
            <button
              onClick={handleResetTest}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} /> Retake Test
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      {!isSubmitted ? (
        <div className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 cols: Question Canvas */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Question Header & Meta */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg">
                    Question {activeQuestionIdx + 1} of {totalQuestions}
                  </span>
                  <span className="text-primary-600 font-semibold bg-primary-50 px-2.5 py-1 rounded-lg">
                    {currentQ.section}
                  </span>
                  <span className="text-neutral-500 hidden sm:inline">• {currentQ.topic}</span>
                </div>

                <button
                  onClick={handleToggleReview}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    markedForReview[currentQ.id]
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Bookmark size={13} />
                  <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Statement */}
              <div className="bg-neutral-50/80 p-6 rounded-2xl border border-neutral-200/70">
                <p className="text-base text-neutral-900 font-medium leading-relaxed whitespace-pre-line mb-4">
                  {currentQ.question}
                </p>

                {currentQ.codeSnippet && (
                  <div className="bg-[#0f172a] text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-neutral-800 my-3 leading-relaxed shadow-inner">
                    <pre>{currentQ.codeSnippet}</pre>
                  </div>
                )}

                <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-2">
                  <span>Difficulty: <strong className="text-neutral-700">{currentQ.difficulty}</strong></span>
                  <span>•</span>
                  <span>Source: <strong className="text-neutral-700">{currentQ.evidence}</strong></span>
                </div>
              </div>

              {/* Options List */}
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

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <button
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
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
                      className="text-xs text-neutral-500 hover:text-red-500 transition-colors"
                    >
                      Clear Response
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (activeQuestionIdx + 1 < totalQuestions) {
                        setActiveQuestionIdx(prev => prev + 1);
                      } else {
                        setIsSubmitted(true);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary-600/20 transition-all active:scale-95"
                  >
                    {activeQuestionIdx + 1 === totalQuestions ? 'Submit Exam' : 'Save & Next'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>

            {/* Right 4 cols: Question Palette */}
            <div className="lg:col-span-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200/80">
              <div className="font-bold text-sm text-neutral-900 mb-3 flex items-center justify-between">
                <span>Question Palette</span>
                <span className="text-xs text-neutral-500 font-normal">
                  {answeredCount}/{totalQuestions} Answered
                </span>
              </div>

              {/* Palette Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 mb-4 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary-600"></span>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-neutral-200"></span>
                  <span>Unanswered ({totalQuestions - answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span>Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
              </div>

              {/* Grid of question buttons */}
              <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {allQuestions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isMarked = markedForReview[q.id];
                  const isCurrent = idx === activeQuestionIdx;

                  let btnStyle = 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100';
                  if (isAnswered) {
                    btnStyle = 'bg-primary-600 text-white border-primary-600 font-bold';
                  }
                  if (isMarked) {
                    btnStyle = 'bg-amber-400 text-neutral-900 border-amber-500 font-bold';
                  }
                  if (isCurrent) {
                    btnStyle += ' ring-2 ring-primary-500 ring-offset-2';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionIdx(idx)}
                      className={`h-9 rounded-xl text-xs font-semibold border transition-all ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Test summary info */}
              <div className="mt-4 pt-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
                <div>• Sectional cutoffs are typical in Infosys drives.</div>
                <div>• Review all marked questions before submitting.</div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Results & In-Depth Solution Review */
        <div className="p-6 lg:p-10">
          
          {/* Score Header Card */}
          <div className="bg-gradient-to-r from-neutral-900 to-primary-950 text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                  Test Performance Summary
                </span>
                <h3 className="text-3xl font-extrabold mt-1 mb-2">
                  {percentage >= 70 ? '🎉 Excellent! Drive Ready' : percentage >= 50 ? '👍 Good Effort! Minor Review Needed' : '📚 Needs Practice & Focus'}
                </h3>
                <p className="text-xs text-neutral-300">
                  {percentage >= 65 ? 'Score safely clears historical Infosys Systems Engineer sectional thresholds.' : 'Focus on Pseudocode logic and Numerical speed to clear campus cutoffs.'}
                </p>
              </div>

              {/* Big Score Dial */}
              <div className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 text-center">
                  <div className="text-4xl font-extrabold text-white">
                    {correctCount} <span className="text-xl text-neutral-400 font-normal">/ {totalQuestions}</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-1">{percentage}% Accuracy</div>
                </div>
              </div>

              {/* Quick breakdown metrics */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-neutral-400">Correct Answers:</span>
                  <span className="font-bold text-emerald-400">{correctCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-neutral-400">Incorrect Answers:</span>
                  <span className="font-bold text-red-400">{incorrectCount}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Unanswered Questions:</span>
                  <span className="font-bold text-amber-300">{totalQuestions - answeredCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sectional Performance Grid */}
          <h4 className="font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
            <Award size={18} className="text-primary-600" />
            Section-Wise Performance Breakdown
          </h4>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {sectionStats.map(stat => (
              <div key={stat.section} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div className="text-xs text-neutral-500 font-medium truncate">{stat.section}</div>
                <div className="text-xl font-extrabold text-neutral-900 mt-1">
                  {stat.correct} / {stat.total}
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${stat.pct >= 70 ? 'bg-emerald-500' : stat.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 font-semibold">{stat.pct}% Score</div>
              </div>
            ))}
          </div>

          {/* Section Filter for Review */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h4 className="font-bold text-base text-neutral-900 flex items-center gap-2">
              <BookOpen size={18} className="text-primary-600" />
              Detailed Solutions & Explanations ({allQuestions.length} Questions)
            </h4>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveFilterSection('All')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeFilterSection === 'All' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All Sections
              </button>
              {sections.map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveFilterSection(sec)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    activeFilterSection === sec ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-6">
            {allQuestions
              .filter(q => activeFilterSection === 'All' || q.section === activeFilterSection)
              .map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;
                const isSkipped = userChoice === undefined;

                return (
                  <div 
                    key={q.id} 
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      isCorrect 
                        ? 'bg-emerald-50/30 border-emerald-200/80' 
                        : isSkipped 
                          ? 'bg-neutral-50 border-neutral-200' 
                          : 'bg-red-50/30 border-red-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">Q{idx + 1}</span>
                        <span className="text-primary-700 bg-primary-100/60 px-2 py-0.5 rounded font-medium">
                          {q.section}
                        </span>
                        <span className="text-neutral-500">• {q.topic}</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {isCorrect && (
                          <span className="text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 size={14} /> Correct (+1)
                          </span>
                        )}
                        {!isCorrect && !isSkipped && (
                          <span className="text-red-700 flex items-center gap-1 bg-red-100 px-2.5 py-0.5 rounded-full">
                            <XCircle size={14} /> Incorrect (0)
                          </span>
                        )}
                        {isSkipped && (
                          <span className="text-neutral-600 flex items-center gap-1 bg-neutral-200 px-2.5 py-0.5 rounded-full">
                            Skipped
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-neutral-900 font-medium text-sm mb-3 leading-relaxed whitespace-pre-line">
                      {q.question}
                    </p>

                    {q.codeSnippet && (
                      <div className="bg-[#0f172a] text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto mb-3 shadow-inner">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Options Review */}
                    <div className="grid sm:grid-cols-2 gap-2 my-3">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctAnswer;
                        const isThisUserChoice = optIdx === userChoice;

                        let optClass = 'bg-white border-neutral-200 text-neutral-700';
                        if (isThisCorrect) {
                          optClass = 'bg-emerald-100 border-emerald-300 text-emerald-950 font-semibold';
                        } else if (isThisUserChoice && !isThisCorrect) {
                          optClass = 'bg-red-100 border-red-300 text-red-950 font-semibold';
                        }

                        return (
                          <div 
                            key={optIdx} 
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optClass}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </span>
                            {isThisCorrect && <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />}
                            {isThisUserChoice && !isThisCorrect && <XCircle size={14} className="text-red-700 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-step Solution */}
                    <div className="mt-4 p-4 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800">
                      <div className="font-bold text-primary-700 mb-1 flex items-center gap-1.5">
                        <HelpCircle size={14} /> Step-by-Step Explanation:
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

    </div>
  );
};
