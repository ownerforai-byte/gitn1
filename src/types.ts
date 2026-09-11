export type CellId = 'plant' | 'whiteBlood' | 'neuron' | 'epithelial' | 'bacteria' | 'animal' | 'muscle';

export type CellCategory =
  | 'Cells'
  | 'Organs'
  | 'Body Systems'
  | 'Bones & Joints'
  | 'Macromolecules'
  | 'Viruses'
  | 'Botanical Specimens';

export type MeshOrganelleType =
  | 'nucleus'
  | 'nucleolus'
  | 'mitochondria'
  | 'chloroplast'
  | 'golgi'
  | 'er'
  | 'membrane'
  | 'vacuole'
  | 'cytoskeleton'
  | 'ribosome'
  | 'lysosome'
  | 'flagellum'
  | 'centriole'
  | 'sarcomere'
  | 'myelin'
  | 'cilia'
  | 'capsule';

export interface OrganelleAttributes {
  function: string;
  diameter: string;
  composition: string;
  membrane: string;
  evolutionaryOrigin?: string;
  energyDemand?: string;
  phLevel?: string;
}

export interface OrganelleItem {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  meshType: MeshOrganelleType;
  attributes: OrganelleAttributes;
  note: string;
  fact: string;
  location3d: [number, number, number];
}

export interface DiseaseStateItem {
  organelleId: string;
  diseaseName: string;
  pathology: string;
  visualChange: string;
  clinicalImpact: string;
}

export interface OccurrenceInfo {
  distribution: string;
  abundance: string;
  lifespan: string;
  tissueType: string;
}

export interface MicroscopeModes {
  brightfield: string;
  fluorescence: string;
  electron: string;
}

export interface CellItem {
  id: CellId;
  name: string;
  scientificName: string;
  type: string;
  category: CellCategory;
  accentColor: string;
  accentSecondary: string;
  modelKind: string;
  defaultOrganelle: string;
  comparisonCellId: CellId;
  clinicalContext: string;
  occurrence: OccurrenceInfo;
  microscopeModes: MicroscopeModes;
  organelles: OrganelleItem[];
  diseaseStates: DiseaseStateItem[];
  summary: string;
}

export type ViewMode = 'mesh' | 'focus';
export type MaterialMode = 'native' | 'studio' | 'solid';
export type ScreenshotQuality = 'web' | 'print' | 'ultra';

export type ZoomPreset = '1x' | '10x' | '40x' | '100x';

export type CellCyclePhase = 'interphase' | 'prophase' | 'metaphase' | 'anaphase' | 'telophase';

export type QuizMode = 'casual' | 'timed' | 'type' | 'survival' | 'difference';

export interface QuizQuestion {
  id: string;
  type: 'identify' | 'function' | 'clinical' | 'difference';
  cellId: CellId;
  organelleId?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  comparisonPair?: { cellA: CellId; cellB: CellId; diffOrganelle: string };
}

export interface Flashcard {
  id: string;
  cellId: CellId;
  organelleId?: string;
  question?: string;
  answer?: string;
  front?: string;
  back?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  intervalDays?: number;
  repetitionCount?: number;
  interval?: number;
  repetitions?: number;
  easeFactor: number;
  nextReviewDate?: number;
  dueDate?: number;
  isCustom?: boolean;
}

export type FlashcardItem = Flashcard;

export interface NotebookEntry {
  cellId: CellId;
  title: string;
  content: string;
  updatedAt: number;
  tags: string[];
}

export interface AchievementItem {
  id: string;
  name: string;
  title?: string;
  description: string;
  icon: string;
  category: 'exploration' | 'quiz' | 'scholar' | 'secret';
  rewardXp: number;
  unlockedAt: number | null;
  unlocked?: boolean;
  progress: number;
  maxProgress: number;
}

export type StainingTechnique =
  | 'brightfield'
  | 'he'
  | 'dapi'
  | 'tem'
  | 'phase_contrast'
  | 'fluorescence'
  | 'darkfield'
  | 'electron_tem';

export interface MicroscopePreset {
  id: string;
  name: string;
  objective: 4 | 10 | 40 | 100;
  technique: StainingTechnique;
  description: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  unlockedAchievements: string[];
  streakDays: number;
  lastVisitDate: string;
  favorites: CellId[];
  completedQuizCount: number;
  bestQuizScore: Record<QuizMode, number>;
  masteryPerOrganelle: Record<string, number>;
  claimedDailyDates: string[];
  weeklyProgress: {
    weekId: string;
    completedDays: number;
    claimedReward: boolean;
  };
}

export type LanguageCode = 'en' | 'es' | 'fr';

export interface KeyBindingConfig {
  rotate: string;
  focus: string;
  crossSection: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  quiz: string;
  search: string;
}
