import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, HelpCircle, Maximize, Clock, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { RCState, RCAnswer } from './types';
import { levels, getLevelPuzzle } from './levels';
import { createInitialState, submitAnswer } from './engine';
import { cn } from '../../utils/cn';
import { useGameSession } from '../../hooks/useGameSession';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import FeedbackModal from '../../components/ui/FeedbackModal';
import { getNextUnseenAssessmentIndex, createAttemptId } from '../../utils/puzzlePool';
import { useAuth } from '../../context/AuthContext';

const RC_LEVEL_KEY = 'aptiverse_rc_level';

export const RCChallenge: React.FC = () => {
  const { user } = useAuth();
  const [levelIndex, setLevelIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(RC_LEVEL_KEY);
      if (saved) return Math.max(0, parseInt(saved, 10));
    } catch {}
    return getNextUnseenAssessmentIndex('rc', user?.id, 0, levels.length);
  });

  const [attemptId, setAttemptId] = useState<string>(() => createAttemptId());
  const [state, setState] = useState<RCState>(() => createInitialState(getLevelPuzzle(levelIndex)));
  const [activeTab, setActiveTab] = useState(0);
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins for RC assessment
  const hasSavedTimeoutRef = useRef(false);

  const { saveSession, startAttempt, retrySave, status: saveStatus } = useGameSession('rc');

  // Register attempt on server when assessment begins
  useEffect(() => {
    startAttempt(levelIndex + 1, attemptId);
  }, [levelIndex, attemptId, startAttempt]);

  // Fullscreen logic
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || state.status === 'completed') return;
    const timer = setInterval(() => {
      setTimeLeft(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, state.status]);

  // Handle timeout session save
  useEffect(() => {
    if (timeLeft <= 0 && state.status === 'playing' && !hasSavedTimeoutRef.current) {
      hasSavedTimeoutRef.current = true;
      const qCount = state.puzzle.questions.length || 24;
      const score = Math.round(((state.score / qCount) * 10) * 100) / 100;
      const answeredCount = Object.keys(state.answers).length;
      const accuracy = answeredCount > 0 ? Math.round((state.score / answeredCount) * 100) : 0;
      saveSession(levelIndex + 1, score, accuracy, 360, false, attemptId);
    }
  }, [timeLeft, state, levelIndex, attemptId, saveSession]);

  const handleAnswer = (answer: RCAnswer) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    const newState = submitAnswer(state, answer);
    setState(newState);

    if (newState.status === 'completed') {
      const qCount = newState.puzzle.questions.length || 24;
      // Normalized score to 0-10: (correct / totalQuestions) * 10
      const score = Math.round(((newState.score / qCount) * 10) * 100) / 100;
      const accuracy = Math.round((newState.score / qCount) * 100);
      saveSession(levelIndex + 1, score, accuracy, 360 - timeLeft, true, attemptId);
    }
  };

  // Reset current attempt
  const handleReset = () => {
    setState(createInitialState(getLevelPuzzle(levelIndex)));
    setActiveTab(0);
  };

  // Start a fresh unseen assessment
  const handleNextLevel = () => {
    const nextIdx = getNextUnseenAssessmentIndex('rc', user?.id, 0, levels.length);
    setLevelIndex(nextIdx);
    setAttemptId(createAttemptId());
    setTimeLeft(360);
    hasSavedTimeoutRef.current = false;
    try {
      localStorage.setItem(RC_LEVEL_KEY, String(nextIdx));
    } catch {}
    setState(createInitialState(getLevelPuzzle(nextIdx)));
    setActiveTab(0);
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit, advanceNow } = useAutoAdvance(
    state.status === 'completed', 
    handleNextLevel, 
    8000, 
    timeLeft <= 0
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = state.puzzle.questions[state.currentQuestionIndex];
  const qCount = state.puzzle.questions.length;
  const normalizedScore = Math.round(((state.score / qCount) * 10) * 100) / 100;

  return (
    <div className="game-container min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col fixed inset-0 z-[100]">
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-600/20 text-white">
              RC
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Reading Comprehension</h1>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">{state.puzzle.title}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Time Left</span>
            <span className={`font-mono text-xl font-bold tracking-tight ${timeLeft < 60 ? 'text-red-500' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleFullScreen} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors" title="Toggle Fullscreen">
              <Maximize size={18} />
            </button>
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors" title="Restart Attempt">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-4 relative overflow-hidden bg-slate-100">
        
        {/* Left Panel: Text Tabs */}
        <div className="flex-[3] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
          <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
            {state.puzzle.tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "px-6 py-4 text-sm font-bold border-b-2 transition-colors flex-1 text-center",
                  activeTab === i 
                    ? "border-emerald-600 text-emerald-700 bg-white" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                )}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-white">
            <p className="text-slate-700 leading-relaxed text-lg">
              {state.puzzle.tabs[activeTab].content}
            </p>
          </div>
        </div>

        {/* Right Panel: Question */}
        <div className="flex-[2] flex flex-col h-full gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col flex-1 relative">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Question {state.currentQuestionIndex + 1} of {qCount}
              </span>
              {state.status === 'completed' && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  Score: {normalizedScore} / 10 pts
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              {timeLeft <= 0 ? (
                // Explicit Assessment-Ended Timeout Recovery Screen
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                    <Clock size={32} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Time Expired</h2>
                  <p className="text-slate-500 text-sm mb-6 max-w-xs">
                    The 6-minute assessment period has ended. Your completed answers have been recorded.
                  </p>

                  <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center mb-6">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Answered</span>
                      <span className="text-lg font-bold text-slate-800">{Object.keys(state.answers).length} / {qCount}</span>
                    </div>
                    <div className="border-x border-slate-200">
                      <span className="text-xs text-slate-400 font-semibold block">Correct</span>
                      <span className="text-lg font-bold text-emerald-600">{state.score}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Score</span>
                      <span className="text-lg font-bold text-indigo-600">{normalizedScore} pts</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button 
                      onClick={handleNextLevel}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
                    >
                      New Assessment
                    </Button>
                    <Button
                      onClick={() => {
                        setTimeLeft(360);
                        hasSavedTimeoutRef.current = false;
                        handleReset();
                      }}
                      variant="secondary"
                      className="flex-1 border-slate-200"
                    >
                      <RotateCcw size={14} className="mr-1" /> Retry
                    </Button>
                  </div>
                </div>
              ) : state.status === 'playing' ? (
                <>
                  <h2 className="text-2xl font-semibold text-slate-800 leading-snug mb-10">
                    "{currentQ?.statement}"
                  </h2>
                  
                  <div className="flex flex-col gap-4">
                    {currentQ?.options?.map((option, idx) => (
                      <Button 
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="w-full h-auto min-h-[4rem] py-4 text-left whitespace-normal leading-tight text-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border-2 border-slate-200 hover:border-slate-300 font-bold justify-start px-6 shadow-none"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Assessment Complete!</h2>
                  <p className="text-slate-500 mb-6">
                    You scored {state.score} of {qCount} correct ({normalizedScore} / 10 pts).
                  </p>
                  
                  <div className="w-full space-y-4 text-left overflow-y-auto max-h-[350px] pr-2 mb-6">
                    {state.puzzle.questions.map((q) => {
                      const ans = state.answers[q.id];
                      const isCorrect = ans === q.correctAnswer;
                      return (
                        <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex items-start gap-3">
                            {isCorrect ? <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} /> : <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />}
                            <div>
                              <p className="text-sm font-semibold text-slate-800 mb-1">"{q.statement}"</p>
                              <p className="text-xs text-slate-600 mb-1">You answered: <strong>{ans || 'Skipped'}</strong> | Correct: <strong>{q.correctAnswer}</strong></p>
                              {!isCorrect && (
                                <p className="text-xs text-slate-500 bg-white/50 p-2 rounded border border-slate-200/50">{q.explanation}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                    <button
                      onClick={advanceNow}
                      className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Next Passage →
                    </button>
                    <Link
                      to="/games"
                      className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-center transition-colors"
                    >
                      All Games
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-slate-800 rounded-2xl p-6 text-white shrink-0 shadow-lg">
             <div className="flex items-start gap-3">
               <HelpCircle className="text-emerald-400 shrink-0" size={24} />
               <div>
                 <h4 className="font-bold text-emerald-300 mb-2">Instructions</h4>
                 <ul className="text-sm text-slate-300 space-y-2 leading-relaxed">
                   <li><strong>Read carefully:</strong> All answers can be deduced from the provided tabs.</li>
                   <li><strong>Normalized Scoring:</strong> Scores are consistently normalized to 0–10 based on total questions.</li>
                   <li><strong>Shared Timer:</strong> 6 minutes is provided for the entire passage assessment.</li>
                 </ul>
               </div>
             </div>
          </div>
        </div>
      </main>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={handleFeedbackClose} 
        onSubmit={handleFeedbackSubmit} 
      />
    </div>
  );
};

export default RCChallenge;
