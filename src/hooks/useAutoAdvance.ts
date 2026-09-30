import { useState, useEffect } from 'react';

export const useAutoAdvance = (
  isCompleted: boolean,
  loadNextLevel: () => void,
  delay: number = 1500
) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      // Increment games played counter
      let gamesPlayed = parseInt(localStorage.getItem('aptiverse_games_played') || '0');
      gamesPlayed += 1;
      localStorage.setItem('aptiverse_games_played', gamesPlayed.toString());

      const hasLeftFeedback = localStorage.getItem('aptiverse_has_feedback') === 'true';

      const timer = setTimeout(() => {
        // Pop up feedback every 4 games if they haven't left feedback yet
        if (!hasLeftFeedback && gamesPlayed % 4 === 0) {
          setIsFeedbackOpen(true);
        } else {
          loadNextLevel();
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const handleFeedbackClose = () => {
    setIsFeedbackOpen(false);
    loadNextLevel();
  };

  const handleFeedbackSubmit = () => {
    localStorage.setItem('aptiverse_has_feedback', 'true');
  };

  return {
    isFeedbackOpen,
    handleFeedbackClose,
    handleFeedbackSubmit
  };
};
