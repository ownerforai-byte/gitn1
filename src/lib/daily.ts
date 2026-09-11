import { CellId } from '../types';
import { CELL_SPECIMENS } from '../data/cells';

// FNV-1a 32-bit hash function for deterministic specimen calculation
export function fnv1aHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailySpecimen(dateString: string = getTodayDateString()): {
  id: CellId;
  cellId: CellId;
  name: string;
  cellName: string;
  scientificName: string;
  accentColor: string;
  theme: string;
  bonusXp: number;
} {
  const hash = fnv1aHash(`cas-daily-${dateString}`);
  const cellIndex = hash % CELL_SPECIMENS.length;
  const cell = CELL_SPECIMENS[cellIndex];

  const themes = [
    'Energy Transduction & Metabolism',
    'Immune Defense & Phagocytosis',
    'Neurotransmission & Action Potentials',
    'Cytoskeletal Motility & Motors',
    'Cellular Ultrastructure & Electron Microscopy',
    'Genomic Compartmentalization & Transcription',
    'Excitation-Contraction Coupling',
  ];
  const theme = themes[hash % themes.length];

  return {
    id: cell.id,
    cellId: cell.id,
    name: cell.name,
    cellName: cell.name,
    scientificName: cell.scientificName,
    accentColor: cell.accentColor,
    theme,
    bonusXp: 120,
  };
}

export function getWeeklyChallengeInfo(): {
  weekId: string;
  title: string;
  description: string;
  targetDays: number;
  bonusXp: number;
  rewardXp: number;
} {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDays = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  const weekId = `${now.getFullYear()}-W${weekNumber}`;

  return {
    weekId,
    title: 'The Great Organelle Expedition',
    description: 'Inspect specimens and review cellular architecture on at least 5 distinct days this week.',
    targetDays: 5,
    bonusXp: 400,
    rewardXp: 400,
  };
}

export const getWeeklyChallenge = getWeeklyChallengeInfo;

export function hasCompletedDailyToday(): boolean {
  try {
    const today = getTodayDateString();
    const stored = localStorage.getItem(`cas-daily-completed-${today}`);
    return stored === 'true';
  } catch {
    return false;
  }
}

export function markDailyCompleted(): void {
  try {
    const today = getTodayDateString();
    localStorage.setItem(`cas-daily-completed-${today}`, 'true');
  } catch {
    // safe fallback
  }
}
