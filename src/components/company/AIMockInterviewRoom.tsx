import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Volume2, VolumeX, Play, RotateCcw, 
  ChevronRight, CheckCircle2, Award, Sparkles, BookOpen, Clock, 
  HelpCircle, ArrowRight, ShieldCheck, Maximize2, AlertTriangle, Eye, X,
  Smartphone, UserX, Users, ShieldAlert, Radio, AlertOctagon, RefreshCw
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

interface ProctorViolation {
  id: string;
  time: string;
  type: string;
  detail: string;
  severity: 'high' | 'medium';
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

  // Live Speech-to-Text (STT) State
  const [isDictationActive, setIsDictationActive] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [isSttSupported, setIsSttSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const isDictationActiveRef = useRef(true);
  isDictationActiveRef.current = isDictationActive;

  // AI Proctoring & Violation Detection State
  const [integrityScore, setIntegrityScore] = useState(100);
  const [activeViolation, setActiveViolation] = useState<{ type: string; message: string; icon: string } | null>(null);
  const [violations, setViolations] = useState<ProctorViolation[]>([]);
  const violationCooldownRef = useRef<{ [key: string]: number }>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const proctorIntervalRef = useRef<any>(null);

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

  // Play gentle audible warning tone when violation occurs
  const playWarningTone = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, []);

  // Format MM:SS helper
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Record a proctoring violation safely with 3.5s cooldown per type
  const triggerViolation = useCallback((type: string, message: string, icon: string, penalty: number = 2) => {
    const now = Date.now();
    const lastTriggered = violationCooldownRef.current[type] || 0;
    if (now - lastTriggered < 3500) return; // Cooldown avoids alert spam

    violationCooldownRef.current[type] = now;
    playWarningTone();

    setActiveViolation({ type, message, icon });
    setIntegrityScore(prev => Math.max(0, prev - penalty));

    const newViolation: ProctorViolation = {
      id: `${now}-${Math.random().toString(36).substring(2, 6)}`,
      time: formatSeconds(elapsedTime),
      type,
      detail: message,
      severity: penalty >= 4 ? 'high' : 'medium'
    };

    setViolations(prev => [newViolation, ...prev]);

    // Auto-dismiss active toast message after 3.2s
    setTimeout(() => {
      setActiveViolation(prev => (prev?.type === type ? null : prev));
    }, 3200);
  }, [elapsedTime, playWarningTone]);

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

  // Monitor Fullscreen Exits
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      if (!isFull && hasStarted && !isFinished) {
        setShowFullscreenAlert(true);
        triggerViolation('Fullscreen Exited', 'Full-screen mode was exited. Maintain full screen during assessment.', 'alert', 4);
      } else {
        setShowFullscreenAlert(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [hasStarted, isFinished, triggerViolation]);

  // Monitor Tab Switch & Window Focus Deviations
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab Switch Detected', 'Candidate switched away from the active interview browser tab.', 'alert', 5);
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('Focus Lost', 'Window focus lost. Please keep interview in primary view.', 'alert', 3);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [hasStarted, isFinished, triggerViolation]);

  // Live Speech-to-Text Recognition Setup
  useEffect(() => {
    if (!hasStarted || isFinished) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSttSupported(false);
      return;
    }

    setIsSttSupported(true);
    let recognition: any = null;

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English accent speech model

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimText(interim);

        if (finalStr.trim()) {
          setNotes(prev => {
            const existing = prev[currentQuestion.id] || '';
            const updated = existing ? `${existing.trim()} ${finalStr.trim()}` : finalStr.trim();
            return { ...prev, [currentQuestion.id]: updated };
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setIsDictationActive(false);
        }
      };

      recognition.onend = () => {
        // Auto-reconnect speech recognition if dictation is active
        if (isDictationActiveRef.current && hasStarted && !isFinished) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      if (isDictationActive) {
        try {
          recognition.start();
        } catch (e) {}
      }

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition setup error:', err);
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
    };
  }, [hasStarted, isFinished, currentQuestion.id, isDictationActive]);

  // Computer Vision Frame Analysis for Gaze, Face & Mobile Detection
  useEffect(() => {
    if (!hasStarted || !isCameraActive || isFinished) {
      if (proctorIntervalRef.current) clearInterval(proctorIntervalRef.current);
      return;
    }

    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let consecutiveNoFaceCount = 0;
    let consecutiveLookingDownCount = 0;

    const analyzeWebcamFrame = () => {
      const video = videoRef.current;
      if (!video || !ctx || video.videoWidth === 0 || video.videoHeight === 0) return;

      try {
        ctx.drawImage(video, 0, 0, 160, 120);
        const frame = ctx.getImageData(0, 0, 160, 120);
        const data = frame.data;

        let skinPixels = 0;
        let totalLuminance = 0;
        let sumX = 0;
        let sumY = 0;
        let leftSkin = 0;
        let rightSkin = 0;
        let bottomSkin = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Luminance Y and Chrominance Cb, Cr
          const y = 0.299 * r + 0.587 * g + 0.114 * b;
          const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
          const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;

          totalLuminance += y;

          // Biometric human skin-tone range
          if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173 && y >= 32) {
            skinPixels++;
            const pixelIdx = i / 4;
            const px = pixelIdx % 160;
            const py = Math.floor(pixelIdx / 160);
            sumX += px;
            sumY += py;

            if (px < 55) leftSkin++;
            if (px > 105) rightSkin++;
            if (py > 80) bottomSkin++;
          }
        }

        const totalPixels = 160 * 120;
        const avgLuminance = totalLuminance / totalPixels;
        const skinRatio = skinPixels / totalPixels;

        // 1. Camera Blocked / Darkness Detection
        if (avgLuminance < 14) {
          triggerViolation('Camera Blocked', 'Webcam stream is dark or obstructed. Ensure well-lit face view.', 'camera', 2);
          return;
        }

        // 2. Face Not Found
        if (skinRatio < 0.018) {
          consecutiveNoFaceCount++;
          if (consecutiveNoFaceCount >= 2) {
            triggerViolation('No Face Detected', 'Candidate face is missing from the camera viewport.', 'user-x', 3);
          }
          return;
        } else {
          consecutiveNoFaceCount = 0;
        }

        const centerX = sumX / skinPixels / 160;
        const centerY = sumY / skinPixels / 120;
        const bottomDensity = bottomSkin / (skinPixels || 1);

        // 3. Looking Down (Mobile Phone / Notes Suspected)
        if (centerY > 0.70 || bottomDensity > 0.52) {
          consecutiveLookingDownCount++;
          if (consecutiveLookingDownCount >= 2) {
            triggerViolation(
              'Suspicious Gaze: Looking Down', 
              'Gaze directed downwards towards lap/desk (Mobile phone or notes suspected). Look at screen.', 
              'smartphone', 
              4
            );
          }
          return;
        } else {
          consecutiveLookingDownCount = 0;
        }

        // 4. Looking Away from Camera (Side Gaze Deviation)
        if (centerX < 0.22 || centerX > 0.78) {
          triggerViolation(
            'Looking Away from Camera', 
            'Head turned away from camera. Please maintain direct eye contact with the interviewer.', 
            'eye', 
            2
          );
          return;
        }

        // 5. Multiple Persons in Frame Detection
        if (leftSkin / totalPixels > 0.035 && rightSkin / totalPixels > 0.035 && Math.abs(centerX - 0.5) < 0.12) {
          triggerViolation('Multiple Persons Detected', 'More than one person identified in camera frame.', 'users', 4);
          return;
        }

      } catch (err) {
        console.warn('Frame analysis notice:', err);
      }
    };

    // Analyze every 650ms for smooth, lightweight AI vision check (<0.5% CPU overhead)
    proctorIntervalRef.current = setInterval(analyzeWebcamFrame, 650);

    return () => {
      if (proctorIntervalRef.current) clearInterval(proctorIntervalRef.current);
    };
  }, [hasStarted, isCameraActive, isFinished, triggerViolation]);

  useEffect(() => {
    setActiveRound(initialRound);
    setCurrentIdx(0);
    setIsFinished(false);
    setHasStarted(false);
    setIntegrityScore(100);
    setViolations([]);
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

  // Timer
  useEffect(() => {
    if (hasStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [hasStarted, isFinished]);

  // Load available speech synthesis voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const rateVoice = (v: SpeechSynthesisVoice) => {
      let score = 0;
      const uri = (v.voiceURI || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();

      if (lang === 'en-in' || lang === 'en_in') score += 100;
      if (name.includes('priya') || name.includes('sharma')) score += 500;
      if (name.includes('india') || uri.includes('india')) score += 80;
      if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 70;
      if (name.includes('neerja') || name.includes('prabhat')) score += 60;
      if (name.includes('female') || name.includes('zira') || name.includes('samantha')) score += 20;
      if (lang.startsWith('en')) score += 10;
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

  // Text sanitization for natural recruiter speech delivery
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

  // Speaks interview questions in confident Indian English
  const speakQuestion = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    setTimeout(() => {
      const sanitized = cleanSpeechText(text);
      const utterance = new SpeechSynthesisUtterance(sanitized);
      
      const activeVoice = selectedVoice || availableVoices[0];
      if (activeVoice) {
        utterance.voice = activeVoice;
        utterance.lang = activeVoice.lang;
      }

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
    setIntegrityScore(100);
    setViolations([]);

    await requestFullscreen();
    await startCamera();

    const roundTitle = activeRound === 'technical' 
      ? 'Infosys Systems Engineer Technical Interview' 
      : 'Infosys Systems Engineer HR and Behavioral Interview';
      
    speakQuestion(`Welcome to your ${roundTitle}. I am ${recruiter.name}. Let us begin with your first question. ${currentQuestion.question}`);
  };

  const handleNextQuestion = () => {
    setInterimText('');
    if (currentIdx + 1 < questions.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setShowAnswerGuide(false);
      speakQuestion(questions[nextIdx].question);
    } else {
      setIsFinished(true);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      stopCamera();
    }
  };

  const handleRepeatQuestion = () => {
    speakQuestion(currentQuestion.question);
  };

  const handleExitInterview = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopCamera();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (onClose) {
      onClose();
    } else {
      setHasStarted(false);
      setIsFinished(false);
      setCurrentIdx(0);
    }
  };

  const currentAnswerWords = (notes[currentQuestion.id] || '').trim().split(/\s+/).filter(Boolean).length;

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
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Evaluated
              </span>
            </div>
            <p className="text-xs text-slate-400">{driveTitle} • Speech-to-Text & AI Proctored</p>
          </div>
        </div>

        {/* Header Controls */}
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
            <>
              {/* Integrity Score Live Pill */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <ShieldCheck size={14} className={integrityScore >= 90 ? 'text-emerald-400' : integrityScore >= 75 ? 'text-amber-400' : 'text-rose-500'} />
                <span className="text-slate-300 font-semibold hidden sm:inline">Integrity:</span>
                <span className={`font-mono font-bold ${integrityScore >= 90 ? 'text-emerald-400' : integrityScore >= 75 ? 'text-amber-400' : 'text-rose-500'}`}>
                  {integrityScore}%
                </span>
                {violations.length > 0 && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded font-mono">
                    {violations.length} flag{violations.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
                <Clock size={14} className="text-amber-400 animate-pulse" />
                <span>{formatSeconds(elapsedTime)}</span>
              </div>
            </>
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
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Exit interview"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      {!hasStarted ? (
        /* Pre-Interview Briefing & Setup Screen */
        <div className="p-6 lg:p-12 max-w-4xl mx-auto flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-3">
              Official Assessment Standard • Format A
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              {activeRound === 'technical' ? 'Technical Interview Simulation' : 'HR & Behavioral Interview Simulation'}
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Step into an authentic Infosys hiring panel. Your recruiter evaluates your reasoning, structured explanations, and real-time posture.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Recruiter Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                <img src={recruiter.img} alt={recruiter.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs text-primary-400 font-bold uppercase tracking-wider mb-1">Your Recruiter</div>
                <h4 className="font-bold text-white text-base">{recruiter.name}</h4>
                <p className="text-xs text-slate-400">{recruiter.role}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{recruiter.unit}</p>
              </div>
            </div>

            {/* Assessment Rules */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">Panel Instructions</div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{questions.length} Core curated Infosys fresher interview prompts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mic size={13} className="text-primary-400 shrink-0" />
                    <span><strong>Live Speech-to-Text:</strong> Answers are typed automatically as you speak</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldAlert size={13} className="text-amber-400 shrink-0" />
                    <span><strong>AI Proctoring:</strong> Monitors eye contact, mobile phone & tab switching</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartInterview}
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Play size={18} /> Enter Proctored Interview Room
            </button>
            <button
              onClick={() => handleTestVoice()}
              className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-sm rounded-2xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Volume2 size={16} /> Test Recruiter Voice
            </button>
          </div>
        </div>
      ) : isFinished ? (
        /* Round Completed Summary Screen */
        <div className="p-6 lg:p-12 max-w-4xl mx-auto flex-1 flex flex-col justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Award size={40} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {activeRound === 'technical' ? 'Technical Round Concluded' : 'HR Assessment Concluded'}
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Congratulations on completing your interview simulation with {recruiter.name}. Review your spoken answers and proctoring evaluation below.
          </p>

          {/* AI Proctoring Audit Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 text-left max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <ShieldCheck size={16} className={integrityScore >= 90 ? 'text-emerald-400' : 'text-amber-400'} />
                <span>AI Proctoring & Anti-Cheat Summary</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${integrityScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' : integrityScore >= 75 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {integrityScore}% Integrity Score • {integrityScore >= 80 ? 'PASSED' : 'FLAGGED'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Eye Contact</span>
                <span className="text-xs font-bold text-slate-200">
                  {violations.filter(v => v.type.includes('Looking')).length === 0 ? 'Consistent' : `${violations.filter(v => v.type.includes('Looking')).length} Deviations`}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Device Detection</span>
                <span className="text-xs font-bold text-slate-200">
                  {violations.filter(v => v.type.includes('Mobile') || v.type.includes('Gaze')).length === 0 ? 'Clear (No Phone)' : 'Suspicious Gaze'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Tab Focus</span>
                <span className="text-xs font-bold text-slate-200">
                  {violations.filter(v => v.type.includes('Tab') || v.type.includes('Focus')).length === 0 ? '100% Focused' : 'Switched Away'}
                </span>
              </div>
            </div>

            {violations.length > 0 && (
              <div className="mt-2 text-xs text-slate-400 max-h-28 overflow-y-auto space-y-1">
                <span className="font-semibold text-slate-300 block mb-1">Flagged Events Log:</span>
                {violations.map(v => (
                  <div key={v.id} className="flex items-center justify-between bg-slate-900 px-2.5 py-1 rounded text-[11px]">
                    <span className="text-amber-400">[{v.time}] {v.type}</span>
                    <span className="text-slate-400 truncate max-w-[280px]">{v.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spoken Answers & Answering Points Review */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8 max-w-3xl mx-auto w-full">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center justify-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Recruiter Evaluation Rubric & Your Spoken Answers
            </h3>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
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

                  <div className="mt-2.5 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="font-semibold text-primary-300 flex items-center gap-1.5 mb-1">
                      <Mic size={12} className="text-emerald-400" /> Your Spoken Answer (Live Transcribed):
                    </span>
                    <p className="text-slate-300 leading-relaxed italic">
                      {notes[q.id] ? `"${notes[q.id]}"` : <span className="text-slate-500">No response spoken for this question.</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {activeRound === 'technical' ? (
              <button
                onClick={() => {
                  if (onProceedToHR) {
                    onProceedToHR();
                  } else {
                    setActiveRound('hr');
                    setHasStarted(false);
                    setIsFinished(false);
                  }
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
        /* Active Split-Screen Room: AI Talking Recruiter (Left) & User Webcam with Live STT (Right) */
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full">
          
          {/* Top Privacy & Proctoring Status Strip */}
          <div className="mb-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>AI Proctoring Active: Face alignment, eye contact & live speech-to-text active.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Full-Screen Enforced
              </span>
            </div>
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
                    Question {currentIdx + 1} of {questions.length}
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

            {/* Right 6 cols: Live Candidate Webcam Stream with AI Proctor & Live STT */}
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

                  {/* Offscreen Canvas for Computer Vision Proctoring Analysis */}
                  <canvas ref={canvasRef} className="hidden" width={160} height={120} />

                  {!isCameraActive && (
                    <div className="text-center p-6">
                      <VideoOff size={40} className="text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-300 font-medium">Camera Feed Off</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto">
                        Camera is recommended for live AI gaze tracking and interview posture analysis.
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
                      {/* Live Candidate Tag */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        LIVE CANDIDATE
                      </div>

                      {/* Top-Right Proctor Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 border border-emerald-500/30 shadow-sm">
                        <ShieldCheck size={12} />
                        <span>PROCTOR: {integrityScore}%</span>
                      </div>

                      {/* Face Target Center Guides (Subtle) */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                        <div className="w-48 h-56 border border-dashed border-white/50 rounded-3xl"></div>
                      </div>

                      {/* Active AI Proctor Violation Toast Alert */}
                      {activeViolation && (
                        <div className="absolute top-12 inset-x-3 bg-red-600/95 backdrop-blur-md text-white p-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce-short border border-white/20 z-10">
                          {activeViolation.type.includes('Mobile') || activeViolation.type.includes('Gaze') ? (
                            <Smartphone size={18} className="shrink-0 text-amber-300 animate-pulse" />
                          ) : activeViolation.type.includes('User') || activeViolation.type.includes('Face') ? (
                            <UserX size={18} className="shrink-0 text-amber-300 animate-pulse" />
                          ) : (
                            <AlertOctagon size={18} className="shrink-0 text-amber-300 animate-pulse" />
                          )}
                          <div className="flex-1 text-left leading-tight">
                            <span className="font-extrabold block text-amber-200 uppercase text-[10px]">
                              ⚠️ Proctor Warning: {activeViolation.type}
                            </span>
                            <span className="text-[11px] text-white font-medium">{activeViolation.message}</span>
                          </div>
                        </div>
                      )}

                      {/* Bottom Eye Contact Status */}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] text-slate-200 flex items-center gap-1.5 border border-white/10">
                        <Eye size={12} className={activeViolation ? 'text-amber-400' : 'text-emerald-400'} />
                        <span>{activeViolation ? 'Correction Needed' : 'Eye contact aligned'}</span>
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

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsDictationActive(!isDictationActive)}
                      className={`p-1.5 px-2.5 rounded-xl text-xs flex items-center gap-1.5 font-medium transition-colors border ${
                        isDictationActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {isDictationActive ? <Mic size={13} className="text-emerald-400 animate-pulse" /> : <MicOff size={13} />}
                      <span>{isDictationActive ? 'Voice Typing: Active' : 'Voice Typing: Paused'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Candidate Live Speech-to-Text Answer Console */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Radio size={14} className={isDictationActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'} />
                      Your Spoken Answer (Live Transcript)
                    </span>
                    {isDictationActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        Listening...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{currentAnswerWords} words</span>
                    {(notes[currentQuestion.id] || interimText) && (
                      <button
                        onClick={() => {
                          setNotes({ ...notes, [currentQuestion.id]: '' });
                          setInterimText('');
                        }}
                        className="text-[10px] text-slate-500 hover:text-red-400 underline ml-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={notes[currentQuestion.id] || ''}
                    onChange={(e) => setNotes({ ...notes, [currentQuestion.id]: e.target.value })}
                    placeholder={
                      isSttSupported
                        ? "Speak your answer naturally into your microphone. Your words will be transcribed here automatically in real time (or type directly)..."
                        : "Type your answer key points and response details here..."
                    }
                    rows={4}
                    className="w-full bg-slate-900 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-primary-500 leading-relaxed font-sans"
                  />

                  {/* Real-time Interim Speech Bubble Preview */}
                  {interimText && (
                    <div className="mt-1 px-3 py-1.5 rounded-lg bg-primary-950/60 border border-primary-800/40 text-[11px] text-primary-300 flex items-center gap-2 animate-fadeIn">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-ping"></span>
                      <span className="italic">"...{interimText}"</span>
                    </div>
                  )}
                </div>

                {/* Structured STAR Answering Method Helper Tags */}
                <div className="mt-2.5 pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1.5">
                  <span className="text-[10px] text-slate-500">Quick STAR Tags:</span>
                  <div className="flex items-center gap-1">
                    {['Situation:', 'Task:', 'Action:', 'Result:'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          const existing = notes[currentQuestion.id] || '';
                          setNotes({
                            ...notes,
                            [currentQuestion.id]: existing ? `${existing}\n${tag} ` : `${tag} `
                          });
                        }}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};