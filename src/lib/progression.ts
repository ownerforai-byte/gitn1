import { AchievementItem, UserProgress } from '../types';

export const BASE_LEVEL_XP = 100;
export const LEVEL_SCALING_FACTOR = 1.35;

export function getXpForLevel(level: number): number {
  if (level <= 1) return BASE_LEVEL_XP;
  return Math.round(BASE_LEVEL_XP * Math.pow(LEVEL_SCALING_FACTOR, level - 1));
}

export function calculateLevelInfo(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  percentage: number;
} {
  let level = 1;
  let remainingXp = Math.max(0, totalXp);

  while (true) {
    const needed = getXpForLevel(level);
    if (remainingXp < needed) {
      return {
        level,
        currentLevelXp: remainingXp,
        xpToNextLevel: needed,
        percentage: Math.min(100, Math.round((remainingXp / needed) * 100)),
      };
    }
    remainingXp -= needed;
    level++;
  }
}

export const ACHIEVEMENTS_LIST: AchievementItem[] = [
  {
    id: 'first_contact',
    name: 'First Contact',
    description: 'Inspect your very first organelle in 3D space.',
    icon: 'Eye',
    category: 'exploration',
    rewardXp: 30,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Examine at least 3 distinct cell specimens.',
    icon: 'Compass',
    category: 'exploration',
    rewardXp: 60,
    unlockedAt: null,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'Add your favorite cell architecture to the favorites vault.',
    icon: 'Bookmark',
    category: 'exploration',
    rewardXp: 25,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'collector',
    name: 'Microscopy Collector',
    description: 'Switch between all three microscope observation modes.',
    icon: 'Scan',
    category: 'exploration',
    rewardXp: 50,
    unlockedAt: null,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'quizzer',
    name: 'Quizzer',
    description: 'Test your cytological knowledge by completing a quiz.',
    icon: 'HelpCircle',
    category: 'quiz',
    rewardXp: 50,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Attain a 100% perfect score in any cytological quiz session.',
    icon: 'Target',
    category: 'quiz',
    rewardXp: 100,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'flawless',
    name: 'Flawless Survivor',
    description: 'Survive the 3-lives survival quiz mode without taking lethal damage.',
    icon: 'ShieldCheck',
    category: 'quiz',
    rewardXp: 120,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Document your findings by drafting a laboratory notebook entry.',
    icon: 'BookOpen',
    category: 'scholar',
    rewardXp: 40,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Study cellular architecture past midnight (00:00 - 05:00).',
    icon: 'Moon',
    category: 'secret',
    rewardXp: 75,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Successfully complete a timed quiz mode round in under 30 seconds.',
    icon: 'Zap',
    category: 'quiz',
    rewardXp: 90,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'spotter',
    name: 'Master Spotter',
    description: 'Identify the structural difference in a Spot the Difference round.',
    icon: 'GitCompare',
    category: 'quiz',
    rewardXp: 80,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Attain complete mastery across all 7 cell specimen types.',
    icon: 'Award',
    category: 'scholar',
    rewardXp: 250,
    unlockedAt: null,
    progress: 0,
    maxProgress: 7,
  },
];

export const INITIAL_USER_PROGRESS: UserProgress = {
  xp: 40,
  level: 1,
  unlockedAchievements: [],
  streakDays: 1,
  lastVisitDate: new Date().toISOString().slice(0, 10),
  favorites: ['animal'],
  completedQuizCount: 0,
  bestQuizScore: {
    casual: 0,
    timed: 0,
    type: 0,
    survival: 0,
    difference: 0,
  },
  masteryPerOrganelle: {
    'animal:nucleus': 1,
  },
  claimedDailyDates: [],
  weeklyProgress: {
    weekId: 'week-current',
    completedDays: 1,
    claimedReward: false,
  },
};
