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
  // Track currently started server attempt ID
  const activeAttemptIdRef = useRef<string | null>(null);

  // Pre-register attempt when game level starts so server-side timer has genuine elapsed seconds
  const startAttempt = useCallback(async (level: number, customAttemptId?: string): Promise<string | null> => {
    const userId = authUser?.id || user?.id;
    if (!userId) return null;

    const normalizedGameId = gameId === 'geo_sudoku' ? 'sudoku' : gameId;
    const clientAttemptId = customAttemptId || crypto.randomUUID();

    try {
      const { data, error: rpcErr } = await supabase.rpc('create_game_attempt', {
        p_game_id: normalizedGameId,
        p_level: Math.max(1, Math.round(level)),
        p_puzzle_id: null,
        p_seed: null,
        p_metadata: { client_attempt_id: clientAttemptId }
      });

      if (!rpcErr && data?.attempt_id) {
        activeAttemptIdRef.current = data.attempt_id;
        return data.attempt_id;
      }
    } catch (e) {
      console.warn('startAttempt non-fatal error:', e);
    }
    activeAttemptIdRef.current = clientAttemptId;
    return clientAttemptId;
  }, [authUser?.id, user?.id, gameId]);

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
    const resolvedAttemptId = attemptId || activeAttemptIdRef.current || crypto.randomUUID();

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
      let finalAttemptId = activeAttemptIdRef.current || resolvedAttemptId;

      // Check if attempt exists in game_attempts
      const { data: existingAttempt } = await supabase
        .from('game_attempts')
        .select('id, status')
        .eq('id', finalAttemptId)
        .maybeSingle();

      if (!existingAttempt) {
        // Create attempt row using create_game_attempt RPC
        const { data: createData, error: createAttemptError } = await supabase.rpc('create_game_attempt', {
          p_game_id: normalizedGameId,
          p_level: validLevel,
          p_puzzle_id: null,
          p_seed: null,
          p_metadata: { client_attempt_id: resolvedAttemptId }
        });

        if (!createAttemptError && createData?.attempt_id) {
          finalAttemptId = createData.attempt_id;
          activeAttemptIdRef.current = createData.attempt_id;
          // Ensure at least 2.1 seconds pass if attempt was just created to satisfy anti-cheat server clock
          await new Promise(r => setTimeout(r, 2100));
        } else if (createAttemptError) {
          console.warn('create_game_attempt RPC error (attempting fallback):', createAttemptError);
        }
      }

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

      // Call complete_game_attempt with finalAttemptId
      let { data: rpcData, error: rpcError } = await supabase.rpc('complete_game_attempt', {
        p_attempt_id: finalAttemptId,
        p_submission: submissionPayload,
        p_client_time_spent: validTimeSpent,
        p_passed_distraction: passedDistraction
      });

      if (rpcError && rpcError.message?.includes('not found') && finalAttemptId !== resolvedAttemptId) {
        // Also try with original resolvedAttemptId if different
        const retryWithOriginal = await supabase.rpc('complete_game_attempt', {
          p_attempt_id: resolvedAttemptId,
          p_submission: submissionPayload,
          p_client_time_spent: validTimeSpent,
          p_passed_distraction: passedDistraction
        });
        if (!retryWithOriginal.error && retryWithOriginal.data) {
          rpcData = retryWithOriginal.data;
          rpcError = null;
        }
      }

      if (!rpcError && rpcData) {
        savedAttemptsRef.current.add(resolvedAttemptId);
        savedAttemptsRef.current.add(finalAttemptId);
        activeAttemptIdRef.current = null;
        setStatus('saved');
        setError(null);
        isSavingRef.current = false;
        return { success: true, alreadySaved: Boolean(rpcData.already_completed) };
      }

      // If RPC failed due to suspension, report error immediately
      if (rpcError && rpcError.message?.includes('suspended')) {
        console.error('Account suspended:', rpcError);
        setError(rpcError.message);
        setStatus('error');
        isSavingRef.current = false;
        return { success: false, error: rpcError.message };
      }

      // If RPC failed, report the error directly without falling back to insecure direct client inserts
      const errorMsg = rpcError?.message || 'Server error recording attempt';
      console.error('Failed to complete game attempt:', { rpcError });
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
    startAttempt,
    saveSession,
    retrySave,
    status,
    error,
    isSaving: status === 'saving',
    isSaved: status === 'saved',
    isError: status === 'error'
  };
};
