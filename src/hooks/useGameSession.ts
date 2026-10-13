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
      // Pass resolvedAttemptId as primary key 'id' to guarantee DB-level uniqueness
      const { error: insertError } = await supabase.from('game_sessions').insert({
        id: resolvedAttemptId,
        user_id: userId,
        game_id: normalizedGameId,
        level: validLevel,
        score: validScore,
        accuracy: validAccuracy,
        time_spent: validTimeSpent,
        passed_distraction: passedDistraction
      });

      if (insertError) {
        // Primary key or attempt_id duplicate violation (code 23505) means already recorded!
        if (insertError.code === '23505' || insertError.message?.includes('duplicate key')) {
          // Verify matching record actually exists in the database for this attempt and user
          const { data: existingRecord } = await supabase
            .from('game_sessions')
            .select('id, user_id, score')
            .eq('id', resolvedAttemptId)
            .maybeSingle();

          if (existingRecord && existingRecord.user_id === userId) {
            savedAttemptsRef.current.add(resolvedAttemptId);
            setStatus('saved');
            isSavingRef.current = false;
            return { success: true, alreadySaved: true };
          } else {
            const collisionMsg = 'Attempt ID collision or unauthorized replay detected.';
            console.error(collisionMsg, insertError);
            setError(collisionMsg);
            setStatus('error');
            isSavingRef.current = false;
            return { success: false, error: collisionMsg };
          }
        }

        console.error('Failed to save game session:', insertError);
        setError(insertError.message || 'Failed to save session');
        setStatus('error');
        isSavingRef.current = false;
        return { success: false, error: insertError.message };
      }

      savedAttemptsRef.current.add(resolvedAttemptId);
      setStatus('saved');
      setError(null);
      isSavingRef.current = false;
      return { success: true };
    } catch (err: any) {
      console.error('Network or unexpected error saving game session:', err);
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
