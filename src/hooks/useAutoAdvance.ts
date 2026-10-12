import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useAutoAdvance = (
  isCompleted: boolean,
  loadNextLevel: () => void,
  delay: number = 1500,
  isGameOver: boolean = false
) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { user } = useAuth();
  const hasPromptedRef = useRef(false);

  // If user is authenticated, check if they already submitted feedback in Supabase
  useEffect(() => {
    if (!user?.id) return;
    const checkDbFeedback = async () => {
      try {
        const { data } = await supabase
          .from('feedback')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (data && data.length > 0) {
          localStorage.setItem('aptiverse_has_feedback', 'true');
          localStorage.setItem('aptiverse_feedback_submitted', 'true');
          localStorage.setItem('aptiverse_feedback_prompted', 'true');
        }
      } catch (err) {
        // silent fallback
      }
    };
    checkDbFeedback();
  }, [user?.id]);

  const loadNextLevelRef = useRef(loadNextLevel);
  useEffect(() => {
    loadNextLevelRef.current = loadNextLevel;
  });

  // Handle Level Completion: ALWAYS auto-advance smoothly without popping up in the middle of gameplay
  useEffect(() => {
    if (isCompleted) {
      // Increment games played counter
      let gamesPlayed = parseInt(localStorage.getItem('aptiverse_games_played') || '0', 10);
      gamesPlayed += 1;
      localStorage.setItem('aptiverse_games_played', gamesPlayed.toString());

      const timer = setTimeout(() => {
        loadNextLevelRef.current();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isCompleted, delay]);

  // Handle End of Game: ONLY prompted once after 20-25 games played, never if already given feedback
  useEffect(() => {
    if (isGameOver && !hasPromptedRef.current) {
      const hasFeedback = 
        localStorage.getItem('aptiverse_has_feedback') === 'true' ||
        localStorage.getItem('aptiverse_feedback_submitted') === 'true';
      const alreadyPrompted = localStorage.getItem('aptiverse_feedback_prompted') === 'true';

      const gamesPlayed = parseInt(localStorage.getItem('aptiverse_games_played') || '0', 10);

      // Rule: Only show once, only after 20-25 games played, and only at game end (never in the middle)
      if (!hasFeedback && !alreadyPrompted && gamesPlayed >= 20) {
        hasPromptedRef.current = true;
        localStorage.setItem('aptiverse_feedback_prompted', 'true');

        // Delay slightly so game-over / time-up overlay is visible first
        const timer = setTimeout(() => {
          setIsFeedbackOpen(true);
        }, 1200);

        return () => clearTimeout(timer);
      }
    }
  }, [isGameOver]);

  const handleFeedbackClose = () => {
    setIsFeedbackOpen(false);
  };

  const handleFeedbackSubmit = () => {
    localStorage.setItem('aptiverse_has_feedback', 'true');
    localStorage.setItem('aptiverse_feedback_submitted', 'true');
    localStorage.setItem('aptiverse_feedback_prompted', 'true');
    setIsFeedbackOpen(false);
  };

  return {
    isFeedbackOpen,
    handleFeedbackClose,
    handleFeedbackSubmit
  };
};
