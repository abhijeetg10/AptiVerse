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
    const { data, error } = await supabase.rpc('get_or_create_daily_challenge', {
      p_target_date: istDateStr
    });

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
      const { data, error } = await supabase.rpc('start_daily_challenge', {
        p_challenge_id: challengeId
      });

      if (!error && data && data.attempt_id) {
        return data as DailyAttemptRecord;
      }
    } catch (err) {
      console.warn('start_daily_challenge RPC error:', err);
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
 */
export const submitOfficialDailyChallenge = async (
  attemptId: string,
  isCorrect: boolean,
  score: number,
  accuracy: number,
  metadata: Record<string, any> = {}
): Promise<DailyAttemptRecord> => {
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

  // Fallback local update
  return {
    attempt_id: attemptId,
    daily_challenge_id: metadata.challenge_id || '',
    started_at: metadata.started_at || new Date().toISOString(),
    submitted_at: new Date().toISOString(),
    completion_time_ms: metadata.completion_time_ms || 15000,
    completion_time_seconds: Math.round(((metadata.completion_time_ms || 15000) / 1000) * 10) / 10,
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
 */
export const fetchDailyLeaderboard = async (
  challengeId: string,
  limit: number = 50,
  offset: number = 0
): Promise<DailyLeaderboardData> => {
  try {
    const { data, error } = await supabase.rpc('get_daily_challenge_leaderboard', {
      p_challenge_id: challengeId,
      p_limit: limit,
      p_offset: offset
    });

    if (!error && data) {
      return {
        total_participants: data.total_participants || 0,
        entries: Array.isArray(data.entries) ? data.entries : [],
        my_entry: data.my_entry || null
      };
    }
  } catch (err) {
    console.warn('get_daily_challenge_leaderboard RPC error:', err);
  }

  return {
    total_participants: 0,
    entries: [],
    my_entry: null
  };
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

