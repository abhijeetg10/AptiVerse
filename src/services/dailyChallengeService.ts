import { supabase } from '../lib/supabase';

export type DailyGameType = 'motion' | 'queens' | 'sudoku' | 'grid' | 'inductive';

export interface DailyChallengeRecord {
  id: string;
  challenge_date: string; // YYYY-MM-DD (Asia/Kolkata)
  game_type: DailyGameType;
  game_id: string;
  title: string;
  category: string;
  difficulty: string;
  challenge_seed: number;
  challenge_config: any;
  status: string;
  starts_at: string;
  expires_at: string;
  server_time?: string;
  participants_count?: number;
}

export interface DailyAttemptRecord {
  attempt_id: string;
  daily_challenge_id: string;
  started_at: string;
  submitted_at: string | null;
  completion_time_ms: number | null;
  completion_time_seconds?: number | null;
  score: number | null;
  accuracy: number | null;
  is_completed: boolean;
  is_correct: boolean;
  status: 'in_progress' | 'completed' | 'abandoned';
  rank?: number | null;
  already_existed?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  attempt_id: string;
  user_id: string;
  player_name: string;
  college: string;
  avatar_url?: string;
  score: number;
  accuracy: number;
  completion_time_ms: number;
  completion_time_seconds: number;
  is_correct: boolean;
  submitted_at: string;
}

export interface DailyLeaderboardData {
  total_participants: number;
  entries: LeaderboardEntry[];
  my_entry: LeaderboardEntry | null;
}

export interface HistoricalChallengeRecord {
  challenge_id: string;
  challenge_date: string;
  game_type: DailyGameType;
  title: string;
  category: string;
  difficulty: string;
  starts_at: string;
  expires_at: string;
  total_solvers: number;
  my_attempt_id: string | null;
  my_is_completed: boolean | null;
  my_is_correct: boolean | null;
  my_score: number | null;
  my_accuracy: number | null;
  my_time_seconds: number | null;
  my_rank: number | null;
}

/**
 * Returns the current calendar date in Asia/Kolkata (IST) as YYYY-MM-DD
 */
export const getISTDateString = (date: Date = new Date()): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
};

/**
 * Calculates countdown remaining until next 12:00:00 AM IST (Midnight)
 */
export const getISTMidnightCountdown = (now: Date = new Date()): {
  formatted: string;
  diffMs: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const istDateStr = getISTDateString(now);
  const [y, m, d] = istDateStr.split('-').map(Number);
  
  // Tomorrow 00:00:00 IST is Date.UTC(y, m-1, d+1, 0, 0, 0) minus 5h30m (330 mins)
  const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
  const tomorrowMidnightIstUtc = Date.UTC(y, m - 1, d + 1, 0, 0, 0) - istOffsetMs;
  
  const diffMs = Math.max(0, tomorrowMidnightIstUtc - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  const formatted = `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  return { formatted, diffMs, hours, minutes, seconds };
};

/**
 * Deterministic fallback generator if Supabase is offline or starting up
 */
export const getDeterministicFallbackChallenge = (dateKey: string): DailyChallengeRecord => {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const dateHash = Math.abs(hash);
  const rotationIdx = dateHash % 5;

  const startsAt = `${dateKey}T00:00:00+05:30`;
  const expiresAt = `${dateKey}T23:59:59+05:30`;

  switch (rotationIdx) {
    case 0:
      return {
        id: `dc-motion-${dateKey}`,
        challenge_date: dateKey,
        game_type: 'motion',
        game_id: 'motion',
        title: 'Obstacle Clearance Optimization',
        category: 'Spatial Reasoning & Pathfinding',
        difficulty: 'Hard',
        challenge_seed: dateHash,
        status: 'active',
        starts_at: startsAt,
        expires_at: expiresAt,
        challenge_config: {
          gameType: 'motion',
          levelId: 'motion_h_01',
          puzzle: {
            id: 'motion_h_01',
            difficulty: 'hard',
            rows: 6,
            cols: 6,
            ball: { row: 2, col: 4 },
            target: { row: 0, col: 1 },
            walls: [{ row: 0, col: 3 }, { row: 0, col: 5 }],
            blocks: [
              { id: 'A', orientation: 'vertical', length: 2, row: 1, col: 1 },
              { id: 'B', orientation: 'horizontal', length: 2, row: 4, col: 2 },
              { id: 'C', orientation: 'vertical', length: 2, row: 4, col: 0 },
              { id: 'D', orientation: 'horizontal', length: 3, row: 1, col: 2 },
              { id: 'E', orientation: 'horizontal', length: 3, row: 3, col: 0 },
              { id: 'F', orientation: 'horizontal', length: 2, row: 2, col: 2 },
              { id: 'G', orientation: 'vertical', length: 3, row: 0, col: 0 },
              { id: 'H', orientation: 'vertical', length: 3, row: 2, col: 5 },
              { id: 'I', orientation: 'vertical', length: 2, row: 3, col: 4 }
            ],
            optimalMoves: 10
          }
        }
      };

    case 1:
      return {
        id: `dc-queens-${dateKey}`,
        challenge_date: dateKey,
        game_type: 'queens',
        game_id: 'queens',
        title: 'Corner Constraint Deduction (7×7)',
        category: 'Spatial & Constraint Reasoning',
        difficulty: 'Hard',
        challenge_seed: dateHash,
        status: 'active',
        starts_at: startsAt,
        expires_at: expiresAt,
        challenge_config: {
          gameType: 'queens',
          levelId: 'queens_easy_1',
          puzzle: {
            id: 'queens_easy_1',
            size: 7,
            difficulty: 'easy',
            solution: [2, 0, 4, 1, 6, 3, 5],
            regions: [
              [0, 0, 0, 0, 0, 0, 0],
              [1, 0, 0, 0, 0, 0, 0],
              [1, 3, 2, 2, 2, 0, 0],
              [3, 3, 3, 2, 2, 2, 0],
              [3, 3, 3, 2, 2, 4, 4],
              [3, 3, 3, 5, 5, 5, 4],
              [3, 3, 3, 5, 6, 6, 4]
            ]
          }
        }
      };

    case 2:
      return {
        id: `dc-sudoku-${dateKey}`,
        challenge_date: dateKey,
        game_type: 'sudoku',
        game_id: 'sudoku',
        title: 'Intersecting Geometric Symbol Logic (4×4)',
        category: 'Pattern & Grid Deduction',
        difficulty: 'Hard',
        challenge_seed: dateHash,
        status: 'active',
        starts_at: startsAt,
        expires_at: expiresAt,
        challenge_config: {
          gameType: 'sudoku',
          levelId: 'geo_sudoku_hard_1',
          puzzle: {
            id: 'geo_sudoku_hard_1',
            size: 4,
            symbols: ['circle', 'square', 'triangle', 'star'],
            target: { row: 1, col: 1 },
            difficulty: 'hard',
            board: [
              ['circle', 'square', 'triangle', 'star'],
              ['triangle', null, 'circle', 'square'],
              ['square', 'triangle', 'star', 'circle'],
              ['star', 'circle', 'square', 'triangle']
            ]
          }
        }
      };

    case 3:
      return {
        id: `dc-grid-${dateKey}`,
        challenge_date: dateKey,
        game_type: 'grid',
        game_id: 'grid',
        title: '6-Dot Spatial Pattern Recall',
        category: 'Working Memory & Attention',
        difficulty: 'Hard',
        challenge_seed: dateHash,
        status: 'active',
        starts_at: startsAt,
        expires_at: expiresAt,
        challenge_config: {
          gameType: 'grid',
          levelId: 'grid_hard_1',
          puzzle: {
            id: 'grid_hard_1',
            gridSize: 25,
            dotsCount: 6,
            sequence: [2, 6, 12, 14, 18, 22],
            distraction: {
              type: 'symmetry',
              grid1: [
                true, false, false, true,
                false, true, true, false,
                false, true, true, false,
                true, false, false, true
              ],
              isTrue: true
            }
          }
        }
      };

    default:
      return {
        id: `dc-inductive-${dateKey}`,
        challenge_date: dateKey,
        game_type: 'inductive',
        game_id: 'inductive',
        title: 'Set A Pattern Rule Classification',
        category: 'Pattern Recognition & Induction',
        difficulty: 'Hard',
        challenge_seed: dateHash,
        status: 'active',
        starts_at: startsAt,
        expires_at: expiresAt,
        challenge_config: {
          gameType: 'inductive',
          levelId: 'inductive_hard_1',
          puzzle: {
            id: 'inductive_hard_1',
            difficulty: 'hard',
            setAGrids: [
              ['yc', 'yc', 'yc', null, null, null, null, null, null],
              [null, null, null, 'yc', 'yc', 'yc', null, null, null],
              [null, null, null, null, null, null, 'yc', 'yc', 'yc']
            ],
            setBGrids: [
              ['rs', null, null, 'rs', null, null, 'rs', null, null],
              [null, 'rs', null, null, 'rs', null, null, 'rs', null],
              [null, null, 'rs', null, null, 'rs', null, null, 'rs']
            ],
            testGrids: [
              ['yc', 'yc', 'yc', null, 'rs', null, null, null, null],
              [null, null, 'rs', null, 'rs', null, null, 'rs', null],
              ['rs', 'rs', 'rs', null, null, null, null, null, null],
              [null, null, null, 'yc', 'yc', 'yc', 'rs', null, null]
            ],
            correctOptionIndices: [0, 3]
          }
        }
      };
  }
};

/**
 * 1. Fetch or create today's global challenge from Supabase (Server Single Source of Truth)
 */
export const fetchTodayGlobalChallenge = async (targetDate?: string): Promise<DailyChallengeRecord> => {
  const istDateStr = targetDate || getISTDateString();

  try {
    const rpcPromise = supabase.rpc('get_or_create_daily_challenge', {
      p_target_date: istDateStr
    });
    // 3.5s timeout prevents any hung network request from locking the UI spinner
    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error('RPC Timeout')), 3500)
    );

    const { data, error } = (await Promise.race([rpcPromise, timeoutPromise])) as any;

    if (!error && data && data.id) {
      return data as DailyChallengeRecord;
    }
  } catch (err) {
    console.warn('Daily challenge RPC note, using deterministic global backup:', err);
  }

  // Deterministic fallback matching backend logic
  return getDeterministicFallbackChallenge(istDateStr);
};

/**
 * 2. Start an official daily challenge attempt on the server
 */
export const startOfficialDailyChallenge = async (
  challengeId: string,
  userId?: string
): Promise<DailyAttemptRecord> => {
  if (userId) {
    try {
      const rpcPromise = supabase.rpc('start_daily_challenge', {
        p_challenge_id: challengeId
      });
      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('RPC Timeout')), 3000)
      );

      const { data, error } = (await Promise.race([rpcPromise, timeoutPromise])) as any;

      if (!error && data && data.attempt_id) {
        return data as DailyAttemptRecord;
      }
    } catch (err) {
      console.warn('start_daily_challenge RPC error:', err);
    }

    // Direct game_sessions fallback: check if user already solved today's challenge in database
    try {
      const istToday = getISTDateString();
      const startOfDayISO = new Date(`${istToday}T00:00:00+05:30`).toISOString();

      const { data: existingSession } = await supabase
        .from('game_sessions')
        .select('id, score, accuracy, time_spent, created_at')
        .eq('user_id', userId)
        .eq('game_id', 'daily_challenge')
        .gte('created_at', startOfDayISO)
        .maybeSingle();

      if (existingSession) {
        const completedAttempt: DailyAttemptRecord = {
          attempt_id: existingSession.id,
          daily_challenge_id: challengeId,
          started_at: existingSession.created_at,
          submitted_at: existingSession.created_at,
          completion_time_ms: existingSession.time_spent * 1000,
          completion_time_seconds: existingSession.time_spent,
          score: existingSession.score,
          accuracy: existingSession.accuracy,
          is_completed: true,
          is_correct: true,
          status: 'completed',
          already_existed: true
        };
        const localKey = `aptiverse_daily_attempt_${challengeId}`;
        localStorage.setItem(localKey, JSON.stringify(completedAttempt));
        return completedAttempt;
      }
    } catch (checkErr) {
      console.warn('Database check existing attempt error:', checkErr);
    }
  }

  // Local storage fallback for anonymous / guest mode
  const localKey = `aptiverse_daily_attempt_${challengeId}`;
  const existing = localStorage.getItem(localKey);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {}
  }

  const newAttempt: DailyAttemptRecord = {
    attempt_id: crypto.randomUUID(),
    daily_challenge_id: challengeId,
    started_at: new Date().toISOString(),
    submitted_at: null,
    completion_time_ms: null,
    score: null,
    accuracy: null,
    is_completed: false,
    is_correct: false,
    status: 'in_progress',
    already_existed: false
  };

  localStorage.setItem(localKey, JSON.stringify(newAttempt));
  return newAttempt;
};

/**
 * 3. Submit official daily challenge solution with server-authoritative timestamps
 * Supports both dedicated RPCs and production game_sessions table directly.
 */
export const submitOfficialDailyChallenge = async (
  attemptId: string,
  isCorrect: boolean,
  score: number,
  accuracy: number,
  metadata: Record<string, any> = {},
  userId?: string
): Promise<DailyAttemptRecord> => {
  // Try Layer 1: Dedicated RPC if present
  try {
    const { data, error } = await supabase.rpc('submit_daily_challenge', {
      p_attempt_id: attemptId,
      p_is_correct: isCorrect,
      p_score: score,
      p_accuracy: accuracy,
      p_metadata: metadata
    });

    if (!error && data && data.attempt_id) {
      return data as DailyAttemptRecord;
    }
  } catch (err) {
    console.warn('submit_daily_challenge RPC note:', err);
  }

  const completionTimeMs = metadata.completion_time_ms || 15000;
  const timeSpentSecs = Math.max(1, Math.round(completionTimeMs / 1000));
  const validAttemptId = attemptId && attemptId.length === 36 ? attemptId : crypto.randomUUID();

  // Try Layer 2: Direct Supabase tables if authenticated
  if (userId) {
    // 2A. daily_challenge_attempts table upsert
    if (metadata.challenge_id) {
      try {
        await supabase.from('daily_challenge_attempts').upsert({
          id: validAttemptId,
          daily_challenge_id: metadata.challenge_id,
          user_id: userId,
          candidate_name: metadata.candidate_name || 'AptiVerse Scholar',
          college: metadata.college || 'Engineering Institute',
          completion_time_ms: completionTimeMs,
          score: score,
          accuracy: accuracy,
          is_completed: true,
          is_correct: isCorrect,
          status: 'completed',
          submitted_at: new Date().toISOString(),
          attempt_metadata: metadata
        }, { onConflict: 'daily_challenge_id,user_id' });
      } catch (attErr) {
        console.warn('daily_challenge_attempts direct upsert note:', attErr);
      }
    }

    // 2B. Direct Supabase game_sessions table insertion
    try {
      const istToday = getISTDateString();
      const startOfDayISO = new Date(`${istToday}T00:00:00+05:30`).toISOString();

      // Check if attempt already exists in game_sessions to avoid duplicate insertions
      const { data: existing } = await supabase
        .from('game_sessions')
        .select('id, score, accuracy, time_spent, created_at')
        .eq('user_id', userId)
        .eq('game_id', 'daily_challenge')
        .gte('created_at', startOfDayISO)
        .maybeSingle();

      if (!existing && isCorrect) {
        const { error: insertErr } = await supabase.from('game_sessions').insert({
          id: validAttemptId,
          user_id: userId,
          game_id: 'daily_challenge',
          level: 1,
          score: score,
          accuracy: accuracy,
          time_spent: timeSpentSecs,
          passed_distraction: true,
          attempt_id: `dc_${istToday}_${userId}`
        });

        if (insertErr) {
          console.warn('Failed to insert into game_sessions:', insertErr);
        } else {
          console.log('✅ Daily challenge officially saved to Supabase game_sessions!');
        }
      }
    } catch (dbErr) {
      console.warn('Database save attempt error:', dbErr);
    }
  }

  // Fallback local update
  return {
    attempt_id: validAttemptId,
    daily_challenge_id: metadata.challenge_id || '',
    started_at: metadata.started_at || new Date().toISOString(),
    submitted_at: new Date().toISOString(),
    completion_time_ms: completionTimeMs,
    completion_time_seconds: Math.round((completionTimeMs / 1000) * 10) / 10,
    score: score,
    accuracy: accuracy,
    is_completed: true,
    is_correct: isCorrect,
    status: 'completed',
    rank: 1
  };
};

/**
 * 4. Fetch daily challenge leaderboard for the given challenge ID
 * Queries dedicated RPCs or direct Supabase game_sessions table.
 */
export const fetchDailyLeaderboard = async (
  challengeId: string,
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string
): Promise<DailyLeaderboardData> => {
  let serverData: DailyLeaderboardData | null = null;

  // 1. Try dedicated RPC
  try {
    const { data, error } = await supabase.rpc('get_daily_challenge_leaderboard', {
      p_challenge_id: challengeId,
      p_limit: limit,
      p_offset: offset
    });

    if (!error && data && Array.isArray(data.entries) && data.entries.length > 0) {
      serverData = {
        total_participants: data.total_participants || data.entries.length,
        entries: data.entries,
        my_entry: data.my_entry || null
      };
    }
  } catch (err) {
    console.warn('get_daily_challenge_leaderboard RPC error:', err);
  }

  // 2. Direct daily_challenge_attempts table fallback
  if (!serverData || serverData.entries.length === 0) {
    try {
      const { data: attempts, error: attError } = await supabase
        .from('daily_challenge_attempts')
        .select(`
          id,
          user_id,
          candidate_name,
          college,
          avatar_url,
          score,
          accuracy,
          completion_time_ms,
          is_correct,
          submitted_at
        `)
        .eq('daily_challenge_id', challengeId)
        .eq('is_completed', true)
        .order('is_correct', { ascending: false })
        .order('score', { ascending: false })
        .order('accuracy', { ascending: false })
        .order('completion_time_ms', { ascending: true })
        .limit(limit);

      if (!attError && attempts && attempts.length > 0) {
        const mappedEntries: LeaderboardEntry[] = attempts.map((a: any, idx: number) => ({
          rank: idx + 1,
          attempt_id: a.id,
          user_id: a.user_id,
          player_name: a.candidate_name || 'AptiVerse Scholar',
          college: a.college || 'Engineering Institute',
          avatar_url: a.avatar_url,
          completion_time_ms: a.completion_time_ms || 15000,
          completion_time_seconds: Number(((a.completion_time_ms || 15000) / 1000).toFixed(1)),
          score: a.score ?? 100,
          accuracy: a.accuracy ?? 100,
          is_correct: a.is_correct ?? true,
          submitted_at: a.submitted_at || new Date().toISOString()
        }));

        const myEntry = currentUserId
          ? mappedEntries.find(e => e.user_id === currentUserId) || null
          : null;

        serverData = {
          total_participants: mappedEntries.length,
          entries: mappedEntries,
          my_entry: myEntry
        };
      }
    } catch (err) {
      console.warn('Direct daily_challenge_attempts query note:', err);
    }
  }

  // 3. Direct Supabase game_sessions table fallback
  if (!serverData || serverData.entries.length === 0) {
    try {
      const istToday = getISTDateString();
      const startOfDayISO = new Date(`${istToday}T00:00:00+05:30`).toISOString();

      const { data: sessions, error } = await supabase
        .from('game_sessions')
        .select(`
          id,
          user_id,
          score,
          accuracy,
          time_spent,
          created_at,
          profiles:user_id (
            name,
            college,
            avatar_url
          )
        `)
        .eq('game_id', 'daily_challenge')
        .gte('created_at', startOfDayISO)
        .order('score', { ascending: false })
        .order('time_spent', { ascending: true })
        .limit(limit);

      if (!error && sessions && sessions.length > 0) {
        const mappedEntries: LeaderboardEntry[] = sessions.map((s: any, idx: number) => {
          const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
          return {
            rank: idx + 1,
            attempt_id: s.id,
            user_id: s.user_id,
            player_name: profile?.name || 'AptiVerse Scholar',
            college: profile?.college || 'Engineering Institute',
            completion_time_ms: s.time_spent * 1000,
            completion_time_seconds: s.time_spent,
            score: s.score,
            accuracy: s.accuracy,
            is_correct: true,
            submitted_at: s.created_at
          };
        });

        const myEntry = currentUserId 
          ? mappedEntries.find(e => e.user_id === currentUserId) || null
          : null;

        serverData = {
          total_participants: mappedEntries.length,
          entries: mappedEntries,
          my_entry: myEntry
        };
      }
    } catch (err) {
      console.warn('Direct game_sessions leaderboard fetch error:', err);
    }
  }

  const result: DailyLeaderboardData = serverData || {
    total_participants: 0,
    entries: [],
    my_entry: null
  };

  // Check if current user has a completed local attempt for this challenge
  try {
    const localKey = `aptiverse_daily_attempt_${challengeId}`;
    const raw = typeof window !== 'undefined' ? localStorage.getItem(localKey) : null;
    if (raw) {
      const localAttempt: DailyAttemptRecord = JSON.parse(raw);
      if (localAttempt && localAttempt.is_completed) {
        const candidateName = typeof window !== 'undefined'
          ? localStorage.getItem('aptiverse_interview_candidate_name') || 'You'
          : 'You';

        const myEntry: LeaderboardEntry = result.my_entry || {
          rank: 1,
          attempt_id: localAttempt.attempt_id,
          user_id: currentUserId || 'local_current_user',
          player_name: candidateName,
          college: 'Candidate',
          completion_time_ms: localAttempt.completion_time_ms || 15000,
          completion_time_seconds: localAttempt.completion_time_seconds || Number(((localAttempt.completion_time_ms || 15000) / 1000).toFixed(1)),
          score: localAttempt.score ?? 100,
          accuracy: localAttempt.accuracy ?? 100,
          is_correct: localAttempt.is_correct ?? true,
          submitted_at: localAttempt.submitted_at || new Date().toISOString()
        };

        result.my_entry = myEntry;

        const alreadyInList = result.entries.some(
          e => e.attempt_id === localAttempt.attempt_id || (e.user_id && currentUserId && e.user_id === currentUserId)
        );

        if (!alreadyInList) {
          result.entries = [myEntry, ...result.entries].sort((a, b) => {
            if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
            return (a.completion_time_ms || 0) - (b.completion_time_ms || 0);
          }).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

          result.total_participants = Math.max(result.total_participants, result.entries.length);
        }
      }
    }
  } catch (err) {
    console.warn('Local attempt leaderboard merge note:', err);
  }

  return result;
};

/**
 * 5. Fetch previous daily challenges history
 */
export const fetchDailyChallengeHistory = async (limit: number = 14): Promise<HistoricalChallengeRecord[]> => {
  try {
    const { data, error } = await supabase.rpc('get_daily_challenge_history', {
      p_limit: limit
    });

    if (!error && Array.isArray(data)) {
      return data as HistoricalChallengeRecord[];
    }
  } catch (err) {
    console.warn('get_daily_challenge_history RPC error:', err);
  }

  return [];
};

