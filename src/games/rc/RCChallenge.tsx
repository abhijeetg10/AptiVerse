import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, HelpCircle, Maximize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { RCState, RCAnswer, RCTab } from './types';
import { levels } from './levels';
import { createInitialState, submitAnswer } from './engine';
import { cn } from '../../utils/cn';
import { useGameSession } from '../../hooks/useGameSession';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import FeedbackModal from '../../components/ui/FeedbackModal';

export const RCChallenge: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(() => Math.floor(Math.random() * levels.length));
  const [state, setState] = useState<RCState>(() => createInitialState(levels[levelIndex]));
  const [activeTab, setActiveTab] = useState(0);
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins for RC
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

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const { saveSession } = useGameSession('rc');

  const handleAnswer = (answer: RCAnswer) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    const newState = submitAnswer(state, answer);
    setState(newState);

    if (newState.status === 'completed') {
      const accuracy = Math.round((newState.score / newState.puzzle.questions.length) * 100);
      saveSession(levelIndex + 1, Math.min(10, newState.score * 2), accuracy, 360 - timeLeft, true);
    }
  };

  const handleReset = () => {
    setState(createInitialState(levels[levelIndex]));
    setActiveTab(0);
  };

  const handleNextLevel = () => {
    const nextIdx = (levelIndex + 1) % levels.length;
    setLevelIndex(nextIdx);
    setState(createInitialState(levels[nextIdx]));
    setActiveTab(0);
  };

  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.status === 'completed', handleNextLevel);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = state.puzzle.questions[state.currentQuestionIndex];

  return (
    <div className="game-container min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col fixed inset-0 z-[100]">
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-600/20 text-slate-900">
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
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors" title="Restart">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-4 relative overflow-hidden bg-slate-100">
        
        {/* Left Panel: Text Tabs */}
        <div className="flex-[3] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-white">
            <p className="text-slate-700 leading-relaxed text-lg">
              {state.puzzle.tabs[activeTab].content}
            </p>
          </div>
        </div>

        {/* Right Panel: Question */}
        <div className="flex-[2] flex flex-col h-full gap-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Question {state.currentQuestionIndex + 1} of {state.puzzle.questions.length}
              </span>
              {state.status === 'completed' && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  Score: {state.score}/{state.puzzle.questions.length}
                </span>
              )}
            </div>

            <div className="flex-1">
              {state.status === 'playing' ? (
                <>
                  <h2 className="text-2xl font-semibold text-slate-800 leading-snug mb-10">
                    "{currentQ.statement}"
                  </h2>
                  
                  <div className="flex flex-col gap-4">
                    {currentQ.options?.map((option, idx) => (
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
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Assessment Complete!</h2>
                  <p className="text-slate-500 mb-8">You scored {state.score} out of {state.puzzle.questions.length}.</p>
                  
                  <div className="w-full space-y-4 text-left overflow-y-auto max-h-[400px] pr-2 mb-6">
                    {state.puzzle.questions.map((q, idx) => {
                      const ans = state.answers[q.id];
                      const isCorrect = ans === q.correctAnswer;
                      return (
                        <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex items-start gap-3">
                            {isCorrect ? <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} /> : <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />}
                            <div>
                              <p className="text-sm font-semibold text-slate-800 mb-1">"{q.statement}"</p>
                              <p className="text-xs text-slate-600 mb-2">You answered: <strong>{ans}</strong> | Correct: <strong>{q.correctAnswer}</strong></p>
                              {!isCorrect && (
                                <p className="text-xs text-slate-500 bg-white/50 p-2 rounded border border-slate-200/50">{q.explanation}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Info Card */}
          <div className="bg-slate-800 rounded-2xl p-6 text-slate-900 shrink-0 shadow-lg">
             <div className="flex items-start gap-3">
               <HelpCircle className="text-emerald-400 shrink-0" size={24} />
               <div>
                 <h4 className="font-bold text-emerald-300 mb-2">Instructions</h4>
                 <ul className="text-sm text-slate-300 space-y-2 leading-relaxed">
                   <li><strong>Read carefully:</strong> All answers can be deduced from the provided tabs.</li>
                   <li><strong>Multiple Choice:</strong> Select the option that best answers the question or completes the statement.</li>
                   <li><strong>Time Management:</strong> You have a limited time to complete all questions in this module.</li>
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
