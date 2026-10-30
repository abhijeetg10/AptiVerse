import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, Volume2, VolumeX, Play, RotateCcw, 
  ChevronRight, CheckCircle2, Award, Sparkles, BookOpen, Clock, HelpCircle, ArrowRight 
} from 'lucide-react';
import { 
  TECHNICAL_INTERVIEW_PROMPTS, 
  HR_INTERVIEW_PROMPTS, 
  type InterviewPrompt 
} from '../../data/infosysPrepData';

interface AIMockInterviewRoomProps {
  initialRound?: 'technical' | 'hr';
  onClose?: () => void;
  onProceedToHR?: () => void;
}

export const AIMockInterviewRoom: React.FC<AIMockInterviewRoomProps> = ({ 
  initialRound = 'technical', 
  onClose,
  onProceedToHR
}) => {
  const [activeRound, setActiveRound] = useState<'technical' | 'hr'>(initialRound);
  const questions: InterviewPrompt[] = activeRound === 'technical' 
    ? TECHNICAL_INTERVIEW_PROMPTS 
    : HR_INTERVIEW_PROMPTS;

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswerGuide, setShowAnswerGuide] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  const currentQuestion: InterviewPrompt = questions[currentIdx] || questions[0];

  useEffect(() => {
    setActiveRound(initialRound);
    setCurrentIdx(0);
    setIsFinished(false);
    setHasStarted(false);
  }, [initialRound]);

  // Request camera access
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false // keep audio local to avoid feedback
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Webcam is not supported in this browser environment.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access was not granted. You can still practice with simulated audio.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Text-To-Speech Recruiter Voice
  const speakQuestion = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const recruiterVoice = voices.find(v => 
      (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (recruiterVoice) utterance.voice = recruiterVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStartInterview = async () => {
    setHasStarted(true);
    setCurrentIdx(0);
    setElapsedTime(0);
    setIsFinished(false);
    await startCamera();

    const roundTitle = activeRound === 'technical' 
      ? 'Infosys Systems Engineer Technical Interview' 
      : 'Infosys Systems Engineer HR and Behavioral Interview';

    setTimeout(() => {
      speakQuestion(`Welcome to your ${roundTitle}. Let us begin with the first question. ${questions[0].question}`);
    }, 600);
  };

  useEffect(() => {
    if (hasStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isFinished]);

  useEffect(() => {
    return () => {
      stopCamera();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNextQuestion = () => {
    setShowAnswerGuide(false);
    if (currentIdx + 1 < questions.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextQ = questions[nextIdx];
      
      const transitionPhrases = [
        "Thank you. Let's move on to the next question.",
        "Understood. Here is the next technical prompt.",
        "Alright. Let's proceed to the next scenario.",
        "Good. Now please explain this."
      ];
      const phrase = transitionPhrases[nextIdx % transitionPhrases.length];
      
      speakQuestion(`${phrase} ${nextQ.question}`);
    } else {
      setIsFinished(true);
      stopCamera();
      speakQuestion(`Thank you. You have completed the Infosys ${activeRound === 'technical' ? 'Technical' : 'HR'} interview round. Please review your performance feedback.`);
    }
  };

  const handleRepeatQuestion = () => {
    if (currentQuestion) {
      speakQuestion(currentQuestion.question);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl font-sans">
      
      {/* Header Bar */}
      <div className="bg-slate-950 px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-600/30">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">
                {activeRound === 'technical' ? 'Round 2: Technical Interview Panel' : 'Round 3: HR & Behavioral Interview Panel'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live AI Simulation
              </span>
            </div>
            <p className="text-xs text-slate-400">Infosys Systems Engineer • Candidate Evaluation</p>
          </div>
        </div>

        {/* Round Switcher and Mute Controls */}
        <div className="flex items-center gap-3">
          {!hasStarted && (
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveRound('technical')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeRound === 'technical' ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Round 2: Technical ({TECHNICAL_INTERVIEW_PROMPTS.length} Qs)
              </button>
              <button
                onClick={() => setActiveRound('hr')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeRound === 'hr' ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Round 3: HR ({HR_INTERVIEW_PROMPTS.length} Qs)
              </button>
            </div>
          )}

          {hasStarted && !isFinished && (
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
              <Clock size={14} className="text-amber-400 animate-pulse" />
              <span>{formatSeconds(elapsedTime)}</span>
            </div>
          )}

          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isMuted 
                ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice On'}</span>
          </button>
        </div>
      </div>

      {!hasStarted ? (
        /* Pre-Interview Briefing */
        <div className="p-8 lg:p-12 max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-primary-500/20 text-primary-400 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-primary-500/30 shadow-inner">
            <Video size={36} />
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2">
            {activeRound === 'technical' ? 'Infosys Round 2: Technical Interview' : 'Infosys Round 3: HR & Behavioral Interview'}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            {activeRound === 'technical'
              ? 'Face real candidate-reported technical questions on Java, OOP, DBMS/SQL, Operating Systems, DSA, and your resume projects. The AI Recruiter speaks each question aloud while your webcam gives you feedback on posture and eye contact.'
              : 'Face the final Infosys HR round covering self-introduction, relocation willingness to any Infosys Development Center, team conflict resolution, and career ambitions.'}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <div className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-1">Step 1</div>
              <div className="font-semibold text-white text-sm mb-1">Webcam Simulation</div>
              <div className="text-xs text-slate-400">Live preview to practice composure and eye-contact.</div>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <div className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-1">Step 2</div>
              <div className="font-semibold text-white text-sm mb-1">Recruiter Voice</div>
              <div className="text-xs text-slate-400">AI reads questions aloud with natural pacing.</div>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <div className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-1">Step 3</div>
              <div className="font-semibold text-white text-sm mb-1">Ideal Answers</div>
              <div className="text-xs text-slate-400">Review key talking points expected by Infosys interviewers.</div>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-xl shadow-primary-600/30 transition-all flex items-center justify-center gap-3 mx-auto text-base active:scale-95"
          >
            <Play size={20} className="fill-white" />
            Enable Camera & Begin {activeRound === 'technical' ? 'Technical' : 'HR'} Interview
          </button>
        </div>
      ) : isFinished ? (
        /* Evaluation Card */
        <div className="p-8 lg:p-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-emerald-500/30">
              <Award size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {activeRound === 'technical' ? 'Technical Interview Completed!' : 'HR Interview Completed!'}
            </h2>
            <p className="text-slate-400 text-sm">
              Total Duration: {formatSeconds(elapsedTime)} • Questions Covered: {questions.length}
            </p>
          </div>

          <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 mb-8">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Recruiter Evaluation Rubric & Ideal Answering Points
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-primary-400">Question {idx + 1} • {q.category}</span>
                    <span className="text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">{q.tag}</span>
                  </div>
                  <div className="font-medium text-sm text-slate-200 mb-2">"{q.question}"</div>
                  
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <div className="text-xs font-bold text-amber-400 mb-1">Key Talking Points:</div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                      {q.expectedPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {notes[q.id] && (
                    <div className="mt-2 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400">
                      <span className="font-semibold text-slate-300">Your Spoken Notes:</span> {notes[q.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {activeRound === 'technical' ? (
              <button
                onClick={() => {
                  setActiveRound('hr');
                  setHasStarted(false);
                  setIsFinished(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                Proceed to Round 3: HR Interview <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleStartInterview}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg"
              >
                <RotateCcw size={16} /> Retake HR Interview
              </button>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl"
              >
                Return to Overview
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Active Split-Screen Room */
        <div className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 cols: Recruiter Prompt Canvas */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        AI
                      </div>
                      {isSpeaking && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {activeRound === 'technical' ? 'Priya Sharma' : 'Ananya Verma'}
                        <span className="text-[10px] bg-primary-900/60 text-primary-300 px-2 py-0.5 rounded border border-primary-700/50">
                          {activeRound === 'technical' ? 'Technical Panelist' : 'Senior HR Manager'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        {isSpeaking ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Speaking prompt aloud...
                          </span>
                        ) : (
                          <span>Listening to your spoken answer</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800/80 mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-950 text-primary-400 border border-primary-800/50">
                      {currentQuestion.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {currentQuestion.tag}
                    </span>
                  </div>

                  <p className="text-lg font-medium text-white leading-relaxed">
                    "{currentQuestion.question}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleRepeatQuestion}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800"
                  >
                    <Volume2 size={14} /> Repeat Question
                  </button>

                  <button
                    onClick={() => setShowAnswerGuide(!showAnswerGuide)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30"
                  >
                    <HelpCircle size={14} /> {showAnswerGuide ? 'Hide Ideal Points' : 'Show Ideal Points'}
                  </button>
                </div>

                {showAnswerGuide && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-slate-300 animate-fadeIn">
                    <div className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                      <Sparkles size={14} /> Expected Candidate Points:
                    </div>
                    <ul className="list-disc list-inside space-y-1 mb-2 text-slate-200">
                      {currentQuestion.expectedPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-slate-400 italic">
                      💡 Pro-Tip: {currentQuestion.sampleAnswerGuide}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Spoken Talking Points & Scratchpad:
                </span>
                <textarea
                  value={notes[currentQuestion.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [currentQuestion.id]: e.target.value })}
                  placeholder="Record key keywords or points you covered in your response..."
                  rows={3}
                  className="w-full bg-slate-900 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => {
                    if (currentIdx > 0) {
                      setCurrentIdx(currentIdx - 1);
                      setShowAnswerGuide(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
                >
                  Previous Prompt
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-2 shadow-lg shadow-primary-600/30 transition-all active:scale-95"
                >
                  {currentIdx + 1 === questions.length ? 'Complete Round' : 'Next Prompt'}
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>

            {/* Right 5 cols: Live Webcam Stream */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="relative aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                  {isCameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <VideoOff size={40} className="text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Camera Feed Inactive</p>
                      {cameraError && (
                        <p className="text-[11px] text-amber-400 mt-1 max-w-[200px] mx-auto">{cameraError}</p>
                      )}
                      <button
                        onClick={startCamera}
                        className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
                      >
                        Retry Camera
                      </button>
                    </div>
                  )}

                  {isCameraActive && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      PROCTORED INTERVIEW
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 px-1 text-xs">
                  <button
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1.5"
                  >
                    {isCameraActive ? <Video size={14} /> : <VideoOff size={14} />}
                    <span>{isCameraActive ? 'Turn Off Video' : 'Turn On Video'}</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>Microphone Ready</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-primary-400" />
                  {activeRound === 'technical' ? 'Technical Round Focus Areas:' : 'HR Round Focus Areas:'}
                </div>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  {activeRound === 'technical' ? (
                    <>
                      <div>• Clean object-oriented coding terminology.</div>
                      <div>• Ability to explain DB normalization and SQL queries.</div>
                      <div>• Defending individual contribution on college projects.</div>
                    </>
                  ) : (
                    <>
                      <div>• Concise 90-second self-introduction.</div>
                      <div>• Unconditional willingness to relocate to any Infosys DC.</div>
                      <div>• Conflict resolution using STAR framework.</div>
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
