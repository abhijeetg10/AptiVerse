import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, Volume2, VolumeX, Play, RotateCcw, 
  ChevronRight, CheckCircle2, Award, Sparkles, BookOpen, Clock, 
  HelpCircle, ArrowRight, ShieldCheck, Maximize2, AlertTriangle, Eye, X 
} from 'lucide-react';
import { 
  TECHNICAL_INTERVIEW_PROMPTS, 
  HR_INTERVIEW_PROMPTS, 
  type InterviewPrompt 
} from '../../data/infosysPrepData';
import { TalkingRecruiterAvatar } from './TalkingRecruiterAvatar';

interface AIMockInterviewRoomProps {
  initialRound?: 'technical' | 'hr';
  technicalQuestions?: InterviewPrompt[];
  hrQuestions?: InterviewPrompt[];
  driveTitle?: string;
  onClose?: () => void;
  onProceedToHR?: () => void;
}

export const AIMockInterviewRoom: React.FC<AIMockInterviewRoomProps> = ({ 
  initialRound = 'technical', 
  technicalQuestions = TECHNICAL_INTERVIEW_PROMPTS,
  hrQuestions = HR_INTERVIEW_PROMPTS,
  driveTitle = 'Infosys Systems Engineer',
  onClose,
  onProceedToHR
}) => {
  const [activeRound, setActiveRound] = useState<'technical' | 'hr'>(initialRound);
  const questions: InterviewPrompt[] = activeRound === 'technical' 
    ? technicalQuestions 
    : hrQuestions;

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
  const [showFullscreenAlert, setShowFullscreenAlert] = useState(false);

  // High-Quality Fluent Indian English Speech Synthesis state
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  const currentQuestion: InterviewPrompt = questions[currentIdx] || questions[0];

  // Recruiter personas with properly framed high-resolution portraits
  const recruiter = activeRound === 'technical' ? {
    name: 'Priya Sharma',
    role: 'Lead Technical Architect',
    unit: 'Infosys Cloud & Digital Systems',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    gender: 'female'
  } : {
    name: 'Ananya Verma',
    role: 'Senior Campus Talent Director',
    unit: 'Infosys Global Recruitment',
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    gender: 'female'
  };

  // Fullscreen management
  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setShowFullscreenAlert(false);
    } catch (err) {
      console.warn('Native fullscreen request ignored:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
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

  // Request camera access with callback ref binding
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
      setCameraError('Camera access was not granted. You can still practice with audio.');
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

  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(e => console.warn('Play error:', e));
    }
  }, [isCameraActive, hasStarted]);

  // Load and score system voices, prioritizing fluent, confident Indian English
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const rateVoice = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      let score = 0;

      const isHindi = lang.includes('hi') || name.includes('हिन्दी') || name.includes('hindi');
      const isIndian = isHindi || lang.includes('en-in') || lang.includes('en_in') || name.includes('india');
      const isNatural = name.includes('natural') || name.includes('online') || name.includes('neural');
      const isFemale = name.includes('female') || name.includes('neerja') || name.includes('swara') || name.includes('heera') || name.includes('veena') || name.includes('priya') || name.includes('kavya');

      if (isHindi) score += 200; // Priya Sharma in Hindi / Indian voice prioritized
      if (isIndian) {
        score += 100;
        if (isNatural) score += 60; // e.g. Microsoft Neerja Online (Natural) - English (India)
        if (isFemale) score += 30;  // Matches recruiter persona
        if (name.includes('neerja') || name.includes('swara')) score += 25;
      } else if (lang.startsWith('en')) {
        score += 20;
        if (isNatural) score += 40; // High fidelity neural fallback
        if (isFemale) score += 15;
        if (name.includes('google uk english female') || name.includes('samantha')) score += 20;
        if (name.includes('zira')) score -= 40; // Penalize mechanical legacy voice
      }

      return score;
    };

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const sorted = [...voices]
        .filter(v => v.lang.startsWith('en') || v.lang.includes('IN') || v.lang.includes('in'))
        .sort((a, b) => rateVoice(b) - rateVoice(a));

      setAvailableVoices(sorted);
      setSelectedVoice(prev => {
        if (prev && sorted.some(v => v.voiceURI === prev.voiceURI)) return prev;
        return sorted[0] || null;
      });
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Text sanitization for natural, articulate recruiter speech delivery
  const cleanSpeechText = (rawText: string) => {
    return rawText
      .replace(/["“”'‘’]/g, '')
      .replace(/\bOOP\b/g, 'Object-Oriented Programming')
      .replace(/\bSQL\b/g, 'S-Q-L')
      .replace(/\bDBMS\b/g, 'D-B-M-S')
      .replace(/\bREST API\b/g, 'REST A-P-I')
      .replace(/\bREST APIs\b/g, 'REST A-P-Is')
      .replace(/\bAPI\b/g, 'A-P-I')
      .replace(/\bAPIs\b/g, 'A-P-Is')
      .replace(/\bHR\b/g, 'H-R')
      .replace(/\bSTAR\b/g, 'S-T-A-R')
      .replace(/\bJVM\b/g, 'J-V-M')
      .replace(/\bJDK\b/g, 'J-D-K')
      .replace(/\bJRE\b/g, 'J-R-E')
      .replace(/\bACID\b/g, 'A-C-I-D')
      .replace(/\bHTML\b/g, 'H-T-M-L')
      .replace(/\bCSS\b/g, 'C-S-S')
      .replace(/\bSDLC\b/g, 'S-D-L-C')
      .replace(/\bDC\b/g, 'Development Center')
      .replace(/\bDCs\b/g, 'Development Centers')
      .replace(/\bO\(1\)\b/g, 'Order of 1')
      .replace(/\bO\(n\)\b/g, 'Order of n')
      .replace(/\bO\(log n\)\b/g, 'Order of log n')
      .replace(/\bvs\b/gi, 'versus')
      .trim();
  };

  // Speaks interview questions in confident, articulate Indian English
  const speakQuestion = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // 120ms pause prevents audio buffer truncation
    setTimeout(() => {
      const sanitized = cleanSpeechText(text);
      const utterance = new SpeechSynthesisUtterance(sanitized);
      
      const activeVoice = selectedVoice || availableVoices[0];
      if (activeVoice) {
        utterance.voice = activeVoice;
        utterance.lang = activeVoice.lang;
      }

      // Professional, calm executive cadence
      utterance.rate = 0.93;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn('Speech error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 120);
  };

  const handleTestVoice = (customVoice?: SpeechSynthesisVoice) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const v = customVoice || selectedVoice || availableVoices[0];
    const sample = `Hello, I am ${recruiter.name} from Infosys. I will be your interviewer for today. Are you ready to begin?`;
    
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText(sample));
    if (v) {
      utterance.voice = v;
      utterance.lang = v.lang;
    }
    utterance.rate = 0.93;
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

    await requestFullscreen();
    await startCamera();

    const roundTitle = activeRound === 'technical' 
      ? 'Infosys Systems Engineer Technical Interview' 
      : 'Infosys Systems Engineer HR and Behavioral Interview';

    setTimeout(() => {
      speakQuestion(`Welcome to your ${roundTitle}. I am ${recruiter.name}. Let us begin with your first question. ${questions[0].question}`);
    }, 700);
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
        "Understood. Here is your next prompt.",
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

  const handleExitInterview = () => {
    if (window.confirm("Are you sure you want to exit the interview session?")) {
      stopCamera();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (onClose) onClose();
      else setHasStarted(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Full-screen takeover wrapper
  const containerClass = hasStarted
    ? "fixed inset-0 z-[100] bg-[#070b14] w-screen h-screen flex flex-col overflow-y-auto font-sans"
    : "bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl font-sans relative";

  return (
    <div className={containerClass}>
      
      {/* Fullscreen Proctoring Violation Alert Modal */}
      {showFullscreenAlert && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-red-500 rounded-3xl p-8 max-w-lg text-center shadow-2xl animate-bounce-short">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Proctoring Alert: Fullscreen Exited</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              In an actual Infosys online interview, exiting full screen or tab switching triggers an immediate violation flag. Please re-enter full-screen mode to resume your session.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={requestFullscreen}
                className="flex-1 w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Maximize2 size={16} /> Re-Enter Fullscreen Mode
              </button>
              <button
                onClick={handleExitInterview}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-2xl border border-slate-700 transition-colors text-sm"
              >
                Exit Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-slate-950 px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-800 gap-4 shrink-0">
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
            <p className="text-xs text-slate-400">{driveTitle} • Candidate Evaluation</p>
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
                Round 2: Technical ({technicalQuestions.length} Qs)
              </button>
              <button
                onClick={() => setActiveRound('hr')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeRound === 'hr' ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Round 3: HR ({hrQuestions.length} Qs)
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
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice Active'}</span>
          </button>

          <button
            onClick={handleExitInterview}
            className="p-2 px-3 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Exit Interview Room"
          >
            <X size={15} />
            <span>Exit Interview</span>
          </button>
        </div>
      </div>

      {!hasStarted ? (
        /* Pre-Interview Briefing */
        <div className="p-8 lg:p-12 max-w-3xl mx-auto text-center my-auto">
          
          {/* Futuristic Holographic Silhouette Preview */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-900 border-2 border-primary-500/60 shadow-[0_0_25px_rgba(59,130,246,0.3)] flex items-center justify-center relative">
            <Eye size={42} className="text-primary-400 animate-pulse" />
            <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full shadow">
              <CheckCircle2 size={13} />
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-1.5">
            Infosys Virtual Interviewer: {recruiter.name}
          </h2>
          <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider mb-4">
            {recruiter.role} • {recruiter.unit}
          </p>

          <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xl mx-auto">
            {activeRound === 'technical'
              ? `${recruiter.name} will speak each question aloud in real time with dynamic soundwave indicators. Answer while observing your own live webcam feed for posture and eye contact.`
              : `${recruiter.name} will conduct your behavioral and culture discussion, evaluating your adaptability to Infosys Development Centers and situational teamwork handling.`}
          </p>

          {/* Recruiter Persona Status Badge */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-xs text-left mb-4 max-w-xl mx-auto shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Volume2 size={16} />
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Priya Sharma (AI Recruiter)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Hindi / Indian Accent Locked
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Fluent verbal prompts • Native professional pronunciation
                </div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>

          {/* Privacy Notice Box */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-primary-500/30 text-xs text-left mb-6 flex items-start gap-3 max-w-xl mx-auto">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-slate-300">
              <strong className="text-white block mb-0.5">100% Client-Side Privacy Notice:</strong>
              Your webcam video is processed strictly inside your local browser. AptiVerse <strong>does NOT capture, record, or save</strong> your video or audio to any server. You can turn off the camera at any time.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartInterview}
              className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-xl shadow-primary-600/30 transition-all flex items-center justify-center gap-3 text-base active:scale-95"
            >
              <Play size={20} className="fill-white" />
              Launch Immersive Fullscreen AI Interview
            </button>

            <button
              onClick={handleExitInterview}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-sm transition-colors"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      ) : isFinished ? (
        /* Evaluation Card */
        <div className="p-8 lg:p-12 max-w-4xl mx-auto my-auto">
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

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
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

            <button
              onClick={handleExitInterview}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl"
            >
              Exit to Overview
            </button>
          </div>
        </div>
      ) : (
        /* Active Split-Screen Room: AI Talking Recruiter (Left) & User Webcam (Right) */
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full">
          
          {/* Top Privacy & Status Strip */}
          <div className="mb-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Practice Mode: Camera stream stays 100% on your laptop. No data is stored or transmitted.</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline">
              ● Fullscreen Proctored
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start flex-1">
            
            {/* Left 6 cols: Animated AI Recruiter */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              {/* Talking Avatar Component */}
              <TalkingRecruiterAvatar
                isSpeaking={isSpeaking}
                recruiter={recruiter}
              />

              {/* Spoken Question Statement Card */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-950 text-primary-400 border border-primary-800/50">
                    {currentQuestion.category}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {currentQuestion.tag}
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-white leading-relaxed mb-3">
                  "{currentQuestion.question}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={handleRepeatQuestion}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                  >
                    <Volume2 size={13} /> Repeat Question
                  </button>

                  <button
                    onClick={() => setShowAnswerGuide(!showAnswerGuide)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
                  >
                    <HelpCircle size={13} /> {showAnswerGuide ? 'Hide Answering Tips' : 'Show Answering Tips'}
                  </button>
                </div>

                {showAnswerGuide && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-slate-300 animate-fadeIn">
                    <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                      <Sparkles size={13} /> What Infosys Interviewers Expect:
                    </div>
                    <ul className="list-disc list-inside space-y-1 mb-2 text-slate-200">
                      {currentQuestion.expectedPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-slate-400 italic">
                      💡 Tip: {currentQuestion.sampleAnswerGuide}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleExitInterview}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/50 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <X size={13} /> Exit Interview
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-2 shadow-lg shadow-primary-600/30 transition-all active:scale-95"
                >
                  {currentIdx + 1 === questions.length ? 'Complete Round' : 'Next Question'}
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>

            {/* Right 6 cols: Live Candidate Webcam Stream */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-2xl relative overflow-hidden">
                
                {/* Webcam Container */}
                <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
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
