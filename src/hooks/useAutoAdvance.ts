import { useState, useEffect, useRef, useCallback } from 'react';
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
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAdvancedThisLevelRef = useRef(false);

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
          try {
            localStorage.setItem('aptiverse_has_feedback', 'true');
            localStorage.setItem('aptiverse_feedback_submitted', 'true');
            localStorage.setItem('aptiverse_feedback_prompted', 'true');
          } catch {}
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

  // Cancel any pending advancement timeout
  const cancelAdvance = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  // Safe manual advance function: cancels the auto-advance timer and advances immediately once
  const advanceNow = useCallback(() => {
    cancelAdvance();
    if (!hasAdvancedThisLevelRef.current) {
      hasAdvancedThisLevelRef.current = true;
      loadNextLevelRef.current();
    }
  }, [cancelAdvance]);

  // Handle Level Completion: ALWAYS auto-advance smoothly without popping up in the middle of gameplay
  useEffect(() => {
    if (isCompleted) {
      hasAdvancedThisLevelRef.current = false;
      // Increment games played counter
      try {
        let gamesPlayed = parseInt(localStorage.getItem('aptiverse_games_played') || '0', 10);
        gamesPlayed += 1;
        localStorage.setItem('aptiverse_games_played', gamesPlayed.toString());
      } catch {}

      advanceTimerRef.current = setTimeout(() => {
        if (!hasAdvancedThisLevelRef.current) {
          hasAdvancedThisLevelRef.current = true;
          loadNextLevelRef.current();
        }
      }, delay);

      return () => {
        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current);
          advanceTimerRef.current = null;
        }
      };
    } else {
      hasAdvancedThisLevelRef.current = false;
      cancelAdvance();
    }
  }, [isCompleted, delay, cancelAdvance]);

  // Handle End of Game: ONLY prompted once after 20-25 games played, never if already given feedback
  useEffect(() => {
    if (isGameOver && !hasPromptedRef.current) {
      let hasFeedback = false;
      let alreadyPrompted = false;
      let gamesPlayed = 0;
      try {
        hasFeedback = 
          localStorage.getItem('aptiverse_has_feedback') === 'true' ||
          localStorage.getItem('aptiverse_feedback_submitted') === 'true';
        alreadyPrompted = localStorage.getItem('aptiverse_feedback_prompted') === 'true';
        gamesPlayed = parseInt(localStorage.getItem('aptiverse_games_played') || '0', 10);
      } catch {}

      // Rule: Only show once, only after 20-25 games played, and only at game end (never in the middle)
      if (!hasFeedback && !alreadyPrompted && gamesPlayed >= 20) {
        hasPromptedRef.current = true;
        try {
          localStorage.setItem('aptiverse_feedback_prompted', 'true');
        } catch {}

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
    try {
      localStorage.setItem('aptiverse_has_feedback', 'true');
      localStorage.setItem('aptiverse_feedback_submitted', 'true');
    } catch {}
    setIsFeedbackOpen(false);
  };

  return {
    isFeedbackOpen,
    handleFeedbackClose,
    handleFeedbackSubmit,
    advanceNow,
    cancelAdvance
  };
};
