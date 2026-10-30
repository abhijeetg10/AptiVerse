import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, Volume2, VolumeX, Play, RotateCcw, 
  ChevronRight, CheckCircle2, Award, Sparkles, BookOpen, Clock, 
  HelpCircle, ArrowRight, ShieldCheck, Maximize2, AlertTriangle, Eye 
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenAlert, setShowFullscreenAlert] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  const currentQuestion: InterviewPrompt = questions[currentIdx] || questions[0];

  // Fullscreen management
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
      if (!isFull && hasStarted && !isFinished) {
        setShowFullscreenAlert(true);
      } else {
        setShowFullscreenAlert(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [hasStarted, isFinished]);

  useEffect(() => {
    setActiveRound(initialRound);
    setCurrentIdx(0);
    setIsFinished(false);
    setHasStarted(false);
  }, [initialRound]);

  // Request camera access with reliable element attachment
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // If stream already exists and is active, reuse it
        if (streamRef.current && streamRef.current.active) {
          if (videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(e => console.warn('Play error:', e));
          }
          setIsCameraActive(true);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280, min: 640 }, 
            height: { ideal: 720, min: 480 }, 
            facingMode: 'user' 
          },
          audio: false
        });
        
        streamRef.current = stream;
        setIsCameraActive(true);

        // Immediate assignment if videoRef is mounted
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.warn('Play error:', e));
          };
        }
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
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Robustly bind video stream whenever active or mounted
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(e => console.warn('Play error:', e));
    }
  }, [isCameraActive, hasStarted]);

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

    // Enforce fullscreen on starting test
    requestFullscreen();

    // Start user's camera
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
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
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
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
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

  // Recruiter persona details
  const recruiter = activeRound === 'technical' ? {
    name: 'Priya Sharma',
    role: 'Lead Technical Architect',
    unit: 'Infosys Cloud & Enterprise Engineering',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    experience: '8+ Years at Infosys'
  } : {
    name: 'Rajesh Nair',
    role: 'Senior Campus Talent Acquisition Lead',
    unit: 'Infosys Global Talent Development',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    experience: '12+ Years at Infosys'
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl font-sans relative">
      
      {/* Fullscreen Proctoring Warning Modal */}
      {showFullscreenAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-red-500 rounded-3xl p-8 max-w-lg text-center shadow-2xl animate-bounce-short">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Proctoring Alert: Fullscreen Exited</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              In an actual Infosys assessment & interview, exiting full screen or tab switching triggers an immediate test violation flag. Please re-enter full-screen mode to resume your session.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Maximize2 size={16} /> Re-Enter Fullscreen Mode
            </button>
          </div>
        </div>
      )}

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

        {/* Controls */}
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
            onClick={requestFullscreen}
            className="p-2 rounded-xl text-xs font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1.5"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={15} />
            <span className="hidden sm:inline">Full Screen</span>
          </button>

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
          
          {/* Recruiter Preview Profile */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <img 
              src={recruiter.img} 
              alt={recruiter.name}
              className="w-full h-full object-cover rounded-3xl border-2 border-primary-500 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
              <CheckCircle2 size={16} />
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2">
            Meet Your Interviewer: {recruiter.name}
          </h2>
          <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider mb-3">
            {recruiter.role} • {recruiter.unit}
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {activeRound === 'technical'
              ? 'Priya will conduct your 1-on-1 technical evaluation. She will speak questions on Java, OOP principles, SQL queries, DBMS normalization, operating systems, and your project architecture.'
              : 'Rajesh will conduct your behavioral and culture-fit discussion, evaluating your communication, willingness to relocate to any Infosys Development Center, and handling teamwork setbacks.'}
          </p>

          {/* Privacy & Camera Notice Box */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-primary-500/30 text-xs text-left mb-6 flex items-start gap-3">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-slate-300">
              <strong className="text-white block mb-0.5">100% Client-Side Privacy Notice:</strong>
              Your webcam video is processed strictly on your local browser for self-composure and posture practice. AptiVerse <strong>does NOT capture, record, or save</strong> your video or audio to any server. You may also disable the camera at any moment.
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-xl shadow-primary-600/30 transition-all flex items-center justify-center gap-3 mx-auto text-base active:scale-95"
          >
            <Play size={20} className="fill-white" />
            Enter Fullscreen & Start Live AI Interview
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
        /* Active Split-Screen Room: Recruiter Video Feed (Left) & Candidate Video Feed (Right) */
        <div className="p-6 lg:p-8">
          
          {/* Privacy Disclaimer Bar */}
          <div className="mb-6 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Practice Mode: Video stays 100% on your laptop. No data or stream is recorded or uploaded.</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
              Proctored Fullscreen Active
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 6 cols: AI Recruiter Virtual Room */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              {/* Recruiter Simulated Video Conference Box */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
                
                {/* Simulated Recruiter Video Stream */}
                <div className="relative aspect-[16/10] bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                  <img 
                    src={recruiter.img} 
                    alt={recruiter.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isSpeaking ? 'scale-105 filter brightness-110' : 'scale-100'
                    }`}
                  />

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

                  {/* Top Bar on Recruiter Feed */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow">
                      Infosys Panelist
                    </span>
                    {isSpeaking && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span> SPEAKING
                      </span>
                    )}
                  </div>

                  {/* Equalizer Audio Waves when speaking */}
                  {isSpeaking && (
                    <div className="absolute top-3 right-3 flex items-end gap-1 h-5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
                      <span className="w-1 bg-emerald-400 h-3 animate-pulse"></span>
                      <span className="w-1 bg-emerald-400 h-5 animate-bounce"></span>
                      <span className="w-1 bg-emerald-400 h-2 animate-pulse"></span>
                      <span className="w-1 bg-emerald-400 h-4 animate-bounce"></span>
                    </div>
                  )}

                  {/* Recruiter Subtitle / Nameplate */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <div className="font-extrabold text-sm">{recruiter.name}</div>
                      <div className="text-[11px] text-slate-300">{recruiter.role}</div>
                    </div>

                    <div className="text-[11px] bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                      Question {currentIdx + 1} of {questions.length}
                    </div>
                  </div>
                </div>

                {/* Question Statement Box */}
                <div className="p-5 bg-slate-900 border-t border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-950 text-primary-400 border border-primary-800/50">
                      {currentQuestion.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {currentQuestion.tag}
                    </span>
                  </div>

                  <p className="text-base font-bold text-white leading-relaxed mb-3">
                    "{currentQuestion.question}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleRepeatQuestion}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                    >
                      <Volume2 size={13} /> Repeat Prompt
                    </button>

                    <button
                      onClick={() => setShowAnswerGuide(!showAnswerGuide)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
                    >
                      <HelpCircle size={13} /> {showAnswerGuide ? 'Hide Talking Points' : 'Show Talking Points'}
                    </button>
                  </div>

                  {showAnswerGuide && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-slate-300 animate-fadeIn">
                      <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                        <Sparkles size={13} /> Interviewer Evaluation Expectations:
                      </div>
                      <ul className="list-disc list-inside space-y-1 mb-2 text-slate-200">
                        {currentQuestion.expectedPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                      <div className="text-[11px] text-slate-400 italic">
                        💡 Strategy: {currentQuestion.sampleAnswerGuide}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Navigation Button */}
              <div className="flex items-center justify-between pt-1">
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

            {/* Right 6 cols: Live Candidate Webcam Video Feed */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-2xl relative overflow-hidden">
                
                {/* Webcam Video Container with Callback Ref and Direct Play Binding */}
                <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      if (el && streamRef.current && el.srcObject !== streamRef.current) {
                        el.srcObject = streamRef.current;
                        el.play().catch(e => console.warn('Play error:', e));
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={() => videoRef.current?.play()}
                    className={`w-full h-full object-cover transform -scale-x-100 ${
                      isCameraActive ? 'block' : 'hidden'
                    }`}
                  />

                  {!isCameraActive && (
                    <div className="text-center p-6">
                      <VideoOff size={40} className="text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-300 font-medium">Camera Feed Off</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto">
                        Camera is optional for practice. Turn it on to monitor your eye contact and posture.
                      </p>
                      {cameraError && (
                        <p className="text-[11px] text-amber-400 mt-2 max-w-[200px] mx-auto">{cameraError}</p>
                      )}
                      <button
                        onClick={startCamera}
                        className="mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
                      >
                        Turn On Camera
                      </button>
                    </div>
                  )}

                  {isCameraActive && (
                    <>
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        LIVE CANDIDATE
                      </div>

                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] text-slate-200 flex items-center gap-1.5">
                        <Eye size={12} className="text-emerald-400" />
                        <span>Maintain direct eye contact with camera</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Video controls */}
                <div className="flex items-center justify-between pt-3 px-1 text-xs">
                  <button
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1.5 font-medium transition-colors"
                  >
                    {isCameraActive ? <Video size={14} /> : <VideoOff size={14} />}
                    <span>{isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 size={13} />
                    <span>Microphone Ready</span>
                  </div>
                </div>
              </div>

              {/* Candidate Scratchpad */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Spoken Talking Points & Scratchpad:
                </span>
                <textarea
                  value={notes[currentQuestion.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [currentQuestion.id]: e.target.value })}
                  placeholder="Record your answer keywords or main points covered while speaking..."
                  rows={3}
                  className="w-full bg-slate-900 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-primary-500"
                />
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
