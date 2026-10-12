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
    
    // Anti-Cheat & Client-Side Sanity Bounds
    if (level < 1 || level > 50) return;
    if (score < 0 || score > 10) return;
    if (accuracy < 0 || accuracy > 100) return;
    if (timeSpent < 3) return; // Ignore impossible bot completions under 3 seconds

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
