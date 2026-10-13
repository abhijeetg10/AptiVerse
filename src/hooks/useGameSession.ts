import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type SessionSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface GameSessionPayload {
  level: number;
  score: number; // Normalized 0-10
  accuracy: number; // 0-100%
  timeSpent: number; // in seconds
  passedDistraction?: boolean;
  attemptId?: string; // Unique UUID for the attempt
  puzzleId?: string;
}

export const useGameSession = (gameId: string) => {
  const { authUser, user } = useAuth();
  const [status, setStatus] = useState<SessionSaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Track last payload for retry capabilities
  const lastPayloadRef = useRef<GameSessionPayload | null>(null);
  // Track saved attempt IDs to prevent client-side duplicates
  const savedAttemptsRef = useRef<Set<string>>(new Set());
  // Debounce lock
  const isSavingRef = useRef(false);

  const saveSession = useCallback(async (
    level: number,
    score: number,
    accuracy: number,
    timeSpent: number,
    passedDistraction: boolean = true,
    attemptId?: string
  ): Promise<{ success: boolean; alreadySaved?: boolean; error?: string }> => {
    const userId = authUser?.id || user?.id;
    if (!userId) {
      setError('User not authenticated');
      setStatus('error');
      return { success: false, error: 'User not authenticated' };
    }

    // Standardize game ID (geo_sudoku -> sudoku)
    const normalizedGameId = gameId === 'geo_sudoku' ? 'sudoku' : gameId;

    // Generate or use provided unique attemptId
    const resolvedAttemptId = attemptId || crypto.randomUUID();

    // Check if this attempt was already recorded in this session
    if (savedAttemptsRef.current.has(resolvedAttemptId)) {
      setStatus('saved');
      return { success: true, alreadySaved: true };
    }

    if (isSavingRef.current) {
      return { success: false, error: 'Save already in progress' };
    }

    // Store payload for retry if network fails
    lastPayloadRef.current = {
      level,
      score,
      accuracy,
      timeSpent,
      passedDistraction,
      attemptId: resolvedAttemptId
    };

    isSavingRef.current = true;
    setStatus('saving');
    setError(null);

    // Normalize values
    const validLevel = Math.max(1, Math.round(level));
    // Support fractional scores up to 2 decimal places (0.00 to 10.00)
    const validScore = Math.max(0, Math.min(10, Math.round(score * 100) / 100));
    const validAccuracy = Math.max(0, Math.min(100, Math.round(accuracy)));
    const validTimeSpent = Math.max(2, Math.round(timeSpent));

    try {
      // 1. Primary Trusted Path: Server-side validation & completion RPC
      const submissionPayload = {
        level: validLevel,
        score: validScore,
        accuracy: validAccuracy,
        time_spent: validTimeSpent,
        passed_distraction: passedDistraction,
        solved: validScore > 0,
        correct_count: normalizedGameId === 'di' || normalizedGameId === 'rc' 
          ? Math.round((validScore / 10) * 24) 
          : undefined
      };

      const { data: rpcData, error: rpcError } = await supabase.rpc('complete_game_attempt', {
        p_attempt_id: resolvedAttemptId,
        p_submission: submissionPayload,
        p_client_time_spent: validTimeSpent,
        p_passed_distraction: passedDistraction
      });

      if (!rpcError && rpcData) {
        savedAttemptsRef.current.add(resolvedAttemptId);
        setStatus('saved');
        setError(null);
        isSavingRef.current = false;
        return { success: true, alreadySaved: Boolean(rpcData.already_completed) };
      }

      // If RPC failed, handle error without insecure client-side table fallback
      const errorMsg = rpcError?.message || 'Server error recording attempt';
      console.error('Failed to complete game attempt via trusted RPC:', rpcError);
      setError(errorMsg);
      setStatus('error');
      isSavingRef.current = false;
      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error('Network error during attempt completion:', err);
      const msg = err?.message || 'Network error saving score';
      setError(msg);
      setStatus('error');
      isSavingRef.current = false;
      return { success: false, error: msg };
    }
  }, [authUser?.id, user?.id, gameId]);

  const retrySave = useCallback(async () => {
    if (!lastPayloadRef.current) return { success: false, error: 'No pending session' };
    const p = lastPayloadRef.current;
    return saveSession(p.level, p.score, p.accuracy, p.timeSpent, p.passedDistraction, p.attemptId);
  }, [saveSession]);

  return {
    saveSession,
    retrySave,
    status,
    error,
    isSaving: status === 'saving',
    isSaved: status === 'saved',
    isError: status === 'error'
  };
};
