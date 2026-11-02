import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Flame, Clock, Trophy, CheckCircle2, 
  ArrowRight, Zap, X, RefreshCw, Calendar, Play, Award, 
  ChevronRight, Sparkles, Gamepad2, ShieldCheck, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchTodayGlobalChallenge, 
  startOfficialDailyChallenge, 
  submitOfficialDailyChallenge, 
  fetchDailyLeaderboard, 
  fetchDailyChallengeHistory, 
  getISTMidnightCountdown, 
  getISTDateString,
  type DailyChallengeRecord, 
  type DailyAttemptRecord, 
  type DailyLeaderboardData, 
  type HistoricalChallengeRecord 
} from '../../services/dailyChallengeService';
import { DailyPlayableGame } from './DailyPlayableGame';
import { cn } from '../../utils/cn';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Active Tab: 'challenge' | 'leaderboard' | 'history'
  const [activeTab, setActiveTab] = useState<'challenge' | 'leaderboard' | 'history'>('challenge');

  // Today's Server-Authoritative Global Challenge
  const [challenge, setChallenge] = useState<DailyChallengeRecord | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);

  // Active User Attempt State
  const [attempt, setAttempt] = useState<DailyAttemptRecord | null>(null);
  const [isStartingAttempt, setIsStartingAttempt] = useState(false);

  // Live Timer State (Calculated from server started_at)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef<any>(null);

  // Midnight IST Countdown
  const [countdownStr, setCountdownStr] = useState(() => getISTMidnightCountdown().formatted);

  // Leaderboard Data
  const [leaderboardData, setLeaderboardData] = useState<DailyLeaderboardData>({
    total_participants: 0,
    entries: [],
    my_entry: null
  });
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // History Data
  const [historyList, setHistoryList] = useState<HistoricalChallengeRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Streak state
  const [userStreak, setUserStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('aptiverse_daily_streak');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Candidate Name
  const candidateName = user?.name || localStorage.getItem('aptiverse_interview_candidate_name') || 'AptiVerse Scholar';

  // 1. Load today's global challenge (Single source of truth)
  const loadTodayChallenge = useCallback(async () => {
    setIsLoadingChallenge(true);
    try {
      const globalChallenge = await fetchTodayGlobalChallenge();
      setChallenge(globalChallenge);

      // Check if user already has an existing attempt in local storage or session
      if (globalChallenge?.id) {
        const localKey = `aptiverse_daily_attempt_${globalChallenge.id}`;
        const saved = localStorage.getItem(localKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setAttempt(parsed);
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Daily challenge load error:', err);
    } finally {
      setIsLoadingChallenge(false);
    }
  }, []);

  // 2. Fetch Leaderboard
  const loadLeaderboard = useCallback(async () => {
    if (!challenge?.id) return;
    setIsLoadingLeaderboard(true);
    try {
      const data = await fetchDailyLeaderboard(challenge.id);

      if (attempt?.is_completed && (!data.my_entry || data.entries.length === 0)) {
        const myEntry = {
          rank: 1,
          attempt_id: attempt.attempt_id,
          user_id: user?.id || 'me',
          player_name: candidateName,
          college: user?.college || 'Candidate',
          completion_time_ms: attempt.completion_time_ms || 15000,
          completion_time_seconds: attempt.completion_time_seconds || Number(((attempt.completion_time_ms || 15000) / 1000).toFixed(1)),
          score: attempt.score ?? 100,
          accuracy: attempt.accuracy ?? 100,
          is_correct: attempt.is_correct ?? true,
          submitted_at: attempt.submitted_at || new Date().toISOString()
        };

        const existingIdx = data.entries.findIndex(e => e.attempt_id === attempt.attempt_id);
        const newEntries = existingIdx >= 0 ? data.entries : [myEntry, ...data.entries];

        setLeaderboardData({
          total_participants: Math.max(data.total_participants, newEntries.length),
          entries: newEntries,
          my_entry: data.my_entry || myEntry
        });
      } else {
        setLeaderboardData(data);
      }
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, [challenge?.id, attempt, user, candidateName]);

  // 3. Fetch History
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const list = await fetchDailyChallengeHistory();
      setHistoryList(list);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Initial load when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTodayChallenge();
    }
  }, [isOpen, loadTodayChallenge]);

  // Tab switch triggers
  useEffect(() => {
    if (isOpen && activeTab === 'leaderboard') {
      loadLeaderboard();
    } else if (isOpen && activeTab === 'history') {
      loadHistory();
    }
  }, [isOpen, activeTab, loadLeaderboard, loadHistory]);

  // Midnight IST Countdown Ticker
  useEffect(() => {
    const tick = () => {
      const { formatted, diffMs } = getISTMidnightCountdown();
      setCountdownStr(formatted);

      // Day rolled over at midnight IST (00:00:00 IST)
      if (diffMs <= 1000) {
        loadTodayChallenge();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [loadTodayChallenge]);

  // Live Timer based on genuine started_at timestamp
  useEffect(() => {
    if (!attempt || attempt.is_completed || attempt.status !== 'in_progress') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    const startMs = new Date(attempt.started_at).getTime();

    const updateTimer = () => {
      const nowMs = Date.now();
      const diffSecs = Math.max(0, (nowMs - startMs) / 1000);
      setElapsedSeconds(diffSecs);
    };

    updateTimer();
    timerIntervalRef.current = setInterval(updateTimer, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [attempt]);

  // Prevent background scrolling when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Start Official Attempt Handler
  const handleStartAttempt = async () => {
    if (!challenge || isStartingAttempt) return;
    setIsStartingAttempt(true);

    try {
      const newAttempt = await startOfficialDailyChallenge(challenge.id, user?.id);
      setAttempt(newAttempt);

      // Persist attempt locally so page refreshes never reset the timer
      localStorage.setItem(`aptiverse_daily_attempt_${challenge.id}`, JSON.stringify(newAttempt));
    } catch (err) {
      console.warn('Start attempt error:', err);
    } finally {
      setIsStartingAttempt(false);
    }
  };

  // Submit Official Solution Handler
  const handleSolveChallenge = async (isCorrect: boolean, score: number, accuracy: number) => {
    if (!attempt || attempt.is_completed || !challenge) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const calculatedTimeMs = Math.round(elapsedSeconds * 1000);

    const updatedStreak = userStreak + 1;
    setUserStreak(updatedStreak);
    localStorage.setItem('aptiverse_daily_streak', String(updatedStreak));
    localStorage.setItem('aptiverse_daily_last_solved_date', challenge.challenge_date);

    try {
      const result = await submitOfficialDailyChallenge(
        attempt.attempt_id,
        isCorrect,
        score,
        accuracy,
        {
          challenge_id: challenge.id,
          candidate_name: candidateName,
          college: user?.college,
          started_at: attempt.started_at,
          completion_time_ms: calculatedTimeMs,
          streak: updatedStreak
        }
      );

      setAttempt(result);
      localStorage.setItem(`aptiverse_daily_attempt_${challenge.id}`, JSON.stringify(result));
      loadLeaderboard();
    } catch (err) {
      console.warn('Submit solution error:', err);
    }
  };

  if (!isOpen) return null;

  const isChallengeStarted = Boolean(attempt && attempt.started_at);
  const isChallengeCompleted = Boolean(attempt?.is_completed);

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-neutral-200/80 rounded-3xl max-w-3xl w-full text-neutral-800 shadow-2xl shadow-primary-950/20 relative my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-primary-50/90 via-white to-amber-50/50 px-6 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 font-black shrink-0">
              <Flame size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-neutral-900 tracking-tight">Daily Hard Challenge</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Flame size={12} className="fill-orange-500 text-orange-500" /> {userStreak} Day Streak
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                1 Day = 1 Global Challenge • Resets Daily at 12:00 AM IST
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live IST Countdown to 12:00 AM Midnight */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 shadow-xs text-xs text-neutral-700 font-mono font-semibold">
              <Clock size={13} className="text-amber-500" />
              <span>Next in {countdownStr}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
              title="Close Challenge"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50/90 px-6 py-2.5 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 bg-neutral-200/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('challenge')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'challenge'
                  ? "bg-white text-primary-700 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900 font-semibold"
              )}
            >
              <Zap size={13} />
              <span>Today's Challenge</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'leaderboard'
                  ? "bg-white text-primary-700 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900 font-semibold"
              )}
            >
              <Trophy size={13} className="text-amber-500" />
              <span>Global Leaderboard</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'history'
                  ? "bg-white text-primary-700 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900 font-semibold"
              )}
            >
              <Calendar size={13} />
              <span>Previous Challenges</span>
            </button>
          </div>

          {/* Precision Running Stopwatch for Active Attempt */}
          {activeTab === 'challenge' && isChallengeStarted && !isChallengeCompleted && (
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-700 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-xs animate-fadeIn">
              <Clock size={13} className="text-emerald-600 animate-spin" />
              <span className="font-bold text-emerald-700">{elapsedSeconds.toFixed(1)}s</span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          
          {/* =========================================================
              TAB 1: TODAY'S CHALLENGE
             ========================================================= */}
          {activeTab === 'challenge' && (
            <div className="space-y-6">
              {isLoadingChallenge ? (
                <div className="p-16 text-center text-xs text-neutral-500 space-y-3">
                  <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Fetching today's official global daily challenge from server...</p>
                </div>
              ) : challenge ? (
                <>
                  {/* Challenge Overview Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-50/50 via-white to-slate-50 border border-primary-100/70 shadow-xs relative">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 uppercase tracking-wider">
                          {challenge.difficulty} Mode
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-primary-50 text-primary-700 border border-primary-200/60">
                          {challenge.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1">
                          <Gamepad2 size={11} /> {challenge.game_type.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                        <span>Date: <strong>{challenge.challenge_date}</strong></span>
                      </div>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-neutral-900 mb-1 leading-snug">
                      {challenge.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                      Today's official competitive puzzle assigned globally to all AptiVerse users. One scored attempt per candidate.
                    </p>

                    {/* Pre-Start Preview & Action */}
                    {!isChallengeStarted ? (
                      <div className="mt-5 p-5 bg-white rounded-2xl border border-primary-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                          <div className="flex items-center gap-2 justify-center sm:justify-start font-bold text-xs text-slate-800">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            <span>Server Timer Starts Upon Clicking</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Your completion time will be recorded on the global speed leaderboard.
                          </p>
                        </div>

                        <button
                          onClick={handleStartAttempt}
                          disabled={isStartingAttempt}
                          className="px-6 py-3 bg-primary-600 hover:bg-primary-500 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-primary-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Play size={14} className="fill-white" />
                          <span>{isStartingAttempt ? 'Preparing Board...' : 'Start Official Challenge'}</span>
                        </button>
                      </div>
                    ) : (
                      /* Live Playable Game Board */
                      <div className="mt-4 bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs flex justify-center">
                        <DailyPlayableGame
                          gameType={challenge.game_type}
                          challengeConfig={challenge.challenge_config}
                          onSolve={handleSolveChallenge}
                          isSolved={isChallengeCompleted}
                          disabled={isChallengeCompleted}
                        />
                      </div>
                    )}
                  </div>

                  {/* Solved Performance Celebration Banner */}
                  {isChallengeCompleted && attempt && (
                    <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left animate-fadeIn shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                            <CheckCircle2 size={22} />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-emerald-950">Challenge Solved Correctly!</h4>
                            <p className="text-xs text-neutral-600">
                              Official Time: <strong>{attempt.completion_time_seconds || ((attempt.completion_time_ms || 0) / 1000).toFixed(1)}s</strong> • +100 Daily AptiPoints
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Flame size={12} className="fill-orange-500 text-orange-500" /> Streak: {userStreak} Days
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
                        <span className="text-[11px] text-emerald-800 font-medium">
                          Your attempt is permanently stored and officially ranked.
                        </span>
                        <button
                          onClick={() => setActiveTab('leaderboard')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                        >
                          <Trophy size={13} className="text-amber-200" />
                          <span>View Global Rankings</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-10 text-center text-xs text-neutral-500">
                  Could not load today's challenge. Please refresh.
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 2: GLOBAL DAILY LEADERBOARD
             ========================================================= */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h4 className="font-extrabold text-neutral-900 text-base flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    <span>Today's Global Speed Leaderboard</span>
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Official rankings for {challenge?.challenge_date || getISTDateString()} • Ranked by Correctness, Accuracy &amp; Speed.
                  </p>
                </div>

                <button
                  onClick={loadLeaderboard}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 border border-neutral-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={isLoadingLeaderboard ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* User's Current Rank Card */}
              {leaderboardData.my_entry && (
                <div className="p-4 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-between text-xs animate-fadeIn shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      #{leaderboardData.my_entry.rank}
                    </div>
                    <div>
                      <div className="font-bold text-primary-950">Your Official Performance</div>
                      <div className="text-[11px] text-primary-700">
                        {leaderboardData.my_entry.player_name} • {leaderboardData.my_entry.college}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono font-bold">
                    <span className="text-emerald-700">{leaderboardData.my_entry.completion_time_seconds}s</span>
                    <span className="text-primary-800">{leaderboardData.my_entry.score} pts</span>
                  </div>
                </div>
              )}

              {/* Leaderboard Table */}
              {isLoadingLeaderboard ? (
                <div className="p-12 text-center text-xs text-neutral-500">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading speed rankings...
                </div>
              ) : leaderboardData.entries.length === 0 ? (
                <div className="p-10 text-center text-xs text-neutral-500 bg-slate-50 rounded-2xl border border-neutral-200">
                  <Flame size={32} className="mx-auto text-amber-500 mb-2 opacity-80" />
                  <p className="font-bold text-neutral-800 text-sm">No one has completed today's challenge yet!</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Be the first candidate to solve it and take Rank #1 globally.</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                  {leaderboardData.entries.map((entry) => {
                    const isTop1 = entry.rank === 1;
                    const isTop2 = entry.rank === 2;
                    const isTop3 = entry.rank === 3;
                    const isMe = user?.id && entry.user_id === user.id;

                    return (
                      <div
                        key={entry.attempt_id}
                        className={cn(
                          "p-3.5 px-5 flex items-center justify-between text-xs transition-colors",
                          isMe
                            ? "bg-primary-50/70 font-semibold"
                            : isTop1
                              ? "bg-amber-50/60"
                              : isTop2
                                ? "bg-slate-50/80"
                                : isTop3
                                  ? "bg-orange-50/30"
                                  : "hover:bg-neutral-50/70"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank Badge */}
                          <div className={cn(
                            "w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0",
                            isTop1 
                              ? "bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 shadow-xs" 
                              : isTop2 
                                ? "bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-800" 
                                : isTop3 
                                  ? "bg-gradient-to-tr from-amber-600 to-amber-700 text-white" 
                                  : "bg-neutral-100 text-neutral-700"
                          )}>
                            {entry.rank}
                          </div>

                          <div>
                            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                              <span>{entry.player_name}</span>
                              {isMe && (
                                <span className="px-1.5 py-0.2 rounded bg-primary-200 text-primary-900 text-[9px] font-bold">
                                  YOU
                                </span>
                              )}
                              {isTop1 && <Award size={13} className="text-amber-500" />}
                            </div>
                            <div className="text-[11px] text-neutral-400">
                              {entry.college || 'Engineering Institute'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right font-mono">
                          <div>
                            <div className="font-extrabold text-emerald-700">{entry.completion_time_seconds}s</div>
                            <div className="text-[10px] text-neutral-400">{entry.accuracy}% acc</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 3: PREVIOUS CHALLENGES HISTORY
             ========================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-neutral-900 text-base flex items-center gap-2">
                  <Calendar size={18} className="text-primary-600" />
                  <span>Previous Daily Challenges</span>
                </h4>
                <p className="text-xs text-neutral-500">
                  Review historical daily challenges and your past completion times.
                </p>
              </div>

              {isLoadingHistory ? (
                <div className="p-12 text-center text-xs text-neutral-500">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading past challenges...
                </div>
              ) : historyList.length === 0 ? (
                <div className="p-10 text-center text-xs text-neutral-500 bg-slate-50 rounded-2xl border border-neutral-200">
                  <Calendar size={32} className="mx-auto text-neutral-400 mb-2" />
                  <p className="font-bold text-neutral-800 text-sm">No historical challenges recorded yet.</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Past challenges will automatically archive here every midnight IST.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {historyList.map((item) => (
                    <div
                      key={item.challenge_id}
                      className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-500 text-[11px]">
                            {item.challenge_date}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-bold uppercase text-[9px]">
                            {item.game_type}
                          </span>
                          <span className="text-neutral-400 text-[10px]">
                            • {item.total_solvers} solvers
                          </span>
                        </div>
                        <div className="font-extrabold text-neutral-900 text-sm">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {item.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.my_is_completed ? (
                          <div className="text-right font-mono bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <div className="text-emerald-800 font-bold flex items-center gap-1 justify-end">
                              <CheckCircle2 size={12} className="text-emerald-600" /> Solved in {item.my_time_seconds}s
                            </div>
                            <div className="text-[10px] text-emerald-700">Rank #{item.my_rank || '-'}</div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">
                            Unattempted
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};
