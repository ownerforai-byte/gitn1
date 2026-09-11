import { useCallback } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, CellId, QuizMode } from '../types';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { useLocalStorage } from './useLocalStorage';
import {
  INITIAL_USER_PROGRESS,
  calculateLevelInfo,
  ACHIEVEMENTS_LIST,
} from '../lib/progression';
import { soundEffects } from '../lib/quizSound';

export function useProgression() {
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    STORAGE_KEYS.PROGRESSION,
    INITIAL_USER_PROGRESS
  );

  const levelInfo = calculateLevelInfo(progress.xp);

  const fireConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // safe fallback if confetti fails
    }
  }, []);

  const awardXp = useCallback(
    (amount: number, reason?: string) => {
      setProgress((prev) => {
        const oldLevelInfo = calculateLevelInfo(prev.xp);
        const newXp = prev.xp + amount;
        const newLevelInfo = calculateLevelInfo(newXp);

        if (newLevelInfo.level > oldLevelInfo.level) {
          soundEffects.playLevelUp();
          fireConfetti();
        }

        return {
          ...prev,
          xp: newXp,
          level: newLevelInfo.level,
        };
      });
    },
    [setProgress, fireConfetti]
  );

  const unlockAchievement = useCallback(
    (achievementId: string) => {
      setProgress((prev) => {
        if (prev.unlockedAchievements.includes(achievementId)) return prev;

        const achievement = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId);
        soundEffects.playLevelUp();
        fireConfetti();

        const reward = achievement ? achievement.rewardXp : 30;
        const newXp = prev.xp + reward;
        const newLevelInfo = calculateLevelInfo(newXp);

        return {
          ...prev,
          xp: newXp,
          level: newLevelInfo.level,
          unlockedAchievements: [...prev.unlockedAchievements, achievementId],
        };
      });
    },
    [setProgress, fireConfetti]
  );

  const registerOrganelleInspection = useCallback(
    (cellId: CellId, organelleId: string) => {
      unlockAchievement('first_contact');

      // Check night owl (between 00:00 and 05:00)
      const currentHour = new Date().getHours();
      if (currentHour >= 0 && currentHour < 5) {
        unlockAchievement('night_owl');
      }

      setProgress((prev) => {
        const key = `${cellId}:${organelleId}`;
        const currentMastery = prev.masteryPerOrganelle[key] || 0;
        const newMastery = Math.min(5, currentMastery + 1);

        const newMasteryMap = {
          ...prev.masteryPerOrganelle,
          [key]: newMastery,
        };

        return {
          ...prev,
          masteryPerOrganelle: newMasteryMap,
        };
      });
    },
    [unlockAchievement, setProgress]
  );

  const toggleFavorite = useCallback(
    (cellId: CellId) => {
      setProgress((prev) => {
        const exists = prev.favorites.includes(cellId);
        const nextFavs = exists
          ? prev.favorites.filter((id) => id !== cellId)
          : [...prev.favorites, cellId];

        if (!exists) {
          unlockAchievement('curator');
        }

        return {
          ...prev,
          favorites: nextFavs,
        };
      });
    },
    [setProgress, unlockAchievement]
  );

  const recordQuizResult = useCallback(
    (mode: QuizMode, score: number, durationSeconds: number, perfect: boolean) => {
      unlockAchievement('quizzer');
      if (perfect) {
        unlockAchievement('sharpshooter');
      }
      if (mode === 'survival' && score >= 5) {
        unlockAchievement('flawless');
      }
      if (mode === 'timed' && durationSeconds < 30 && score >= 3) {
        unlockAchievement('speed_demon');
      }
      if (mode === 'difference' && score >= 1) {
        unlockAchievement('spotter');
      }

      const earnedXp = score * 20 + (perfect ? 50 : 0);
      awardXp(earnedXp);

      setProgress((prev) => ({
        ...prev,
        completedQuizCount: prev.completedQuizCount + 1,
        bestQuizScore: {
          ...prev.bestQuizScore,
          [mode]: Math.max(prev.bestQuizScore[mode] || 0, score),
        },
      }));
    },
    [awardXp, unlockAchievement, setProgress]
  );

  return {
    progress,
    levelInfo,
    awardXp,
    unlockAchievement,
    registerOrganelleInspection,
    toggleFavorite,
    recordQuizResult,
    fireConfetti,
  };
}
