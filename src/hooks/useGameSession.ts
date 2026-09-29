import { useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useGameSession = (gameId: string) => {
  const { authUser } = useAuth();
  const lastSavedLevel = useRef<number | null>(null);

  const saveSession = async (level: number, score: number, accuracy: number, timeSpent: number, passedDistraction: boolean = true) => {
    if (!authUser) return;
    
    // Prevent duplicate saves for the same level (e.g. from React Strict Mode)
    if (lastSavedLevel.current === level) return;
    lastSavedLevel.current = level;
    
    const { error } = await supabase.from('game_sessions').insert({
      user_id: authUser.id,
      game_id: gameId,
      level,
      score,
      accuracy,
      time_spent: timeSpent,
      passed_distraction: passedDistraction
    });
    
    if (error) {
      console.error('Failed to save game session:', error);
      lastSavedLevel.current = null; // reset on error so they can try again
    }
  };

  return { saveSession };
};
