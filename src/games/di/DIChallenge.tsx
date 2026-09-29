import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { DIState, DIAnswer, DataTab } from './types';
import { levels } from './levels';
import { createInitialState, submitAnswer } from './engine';
import { cn } from '../../utils/cn';
import { useGameSession } from '../../hooks/useGameSession';

const TabContent = ({ tab }: { tab: DataTab }) => {
  if (tab.type === 'table') {
    const { headers, rows } = tab.content;
    return (
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              {headers.map((h: string, i: number) => (
                <th key={i} className="p-3 font-bold text-slate-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: string[], i: number) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                {row.map((cell: string, j: number) => (
                  <td key={j} className="p-3 text-slate-600">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  if (tab.type === 'list') {
    return (
      <ul className="list-disc list-inside space-y-3 p-4">
        {tab.content.map((item: string, i: number) => (
          <li key={i} className="text-slate-600 text-sm leading-relaxed">{item}</li>
        ))}
      </ul>
    );
  }

  return null;
};

export const DIChallenge: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [state, setState] = useState<DIState>(() => createInitialState(levels[0]));
  const [activeTab, setActiveTab] = useState(0);
  const [timeLeft, setTimeLeft] = useState(720); // 12 mins for DI

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const { saveSession } = useGameSession('di');

  const handleAnswer = (answer: DIAnswer) => {
    if (state.status !== 'playing' || timeLeft <= 0) return;
    const newState = submitAnswer(state, answer);
    setState(newState);
    
    // Check if the game just completed
    if (newState.status === 'completed') {
      const accuracy = Math.round((newState.score / newState.puzzle.questions.length) * 100);
      saveSession(levelIndex + 1, newState.score * 100, accuracy, 720 - timeLeft, true);
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
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm font-bold shadow-md shadow-blue-600/20 text-slate-900">
              DI
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Data Interpretation</h1>
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
            <button onClick={handleReset} className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6 relative overflow-hidden bg-slate-100">
        
        {/* Left Panel: Data Tabs */}
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
                    ? "border-blue-600 text-blue-700 bg-white" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                )}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <TabContent tab={state.puzzle.tabs[activeTab]} />
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
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
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
                    <Button 
                      onClick={() => handleAnswer('True')}
                      className="w-full py-4 text-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:border-emerald-300 font-bold justify-start px-6 shadow-none"
                    >
                      True
                    </Button>
                    <Button 
                      onClick={() => handleAnswer('False')}
                      className="w-full py-4 text-lg bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-200 hover:border-red-300 font-bold justify-start px-6 shadow-none"
                    >
                      False
                    </Button>
                    <Button 
                      onClick={() => handleAnswer('Cannot Say')}
                      className="w-full py-4 text-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border-2 border-slate-200 hover:border-slate-300 font-bold justify-start px-6 shadow-none"
                    >
                      Cannot Say
                    </Button>
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
                  <Button 
                    onClick={handleNextLevel}
                    className="w-full py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 transition-all"
                  >
                    Next Level
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* Info Card */}
          <div className="bg-slate-800 rounded-2xl p-6 text-slate-900 shrink-0 shadow-lg">
             <div className="flex items-start gap-3">
               <HelpCircle className="text-blue-400 shrink-0" size={24} />
               <div>
                 <h4 className="font-bold text-blue-300 mb-2">Instructions</h4>
                 <ul className="text-sm text-slate-300 space-y-2 leading-relaxed">
                   <li><strong>True:</strong> The statement logically follows from the information provided.</li>
                   <li><strong>False:</strong> The statement is logically false based on the information.</li>
                   <li><strong>Cannot Say:</strong> It is impossible to determine whether the statement is true or false without further information.</li>
                 </ul>
               </div>
             </div>
          </div>
          
        </div>

      </main>
    </div>
  );
};

export default DIChallenge;
