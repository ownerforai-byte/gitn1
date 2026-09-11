import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CellId, MaterialMode, ViewMode, LanguageCode, QuizMode, AchievementItem } from './types';
import { CELL_SPECIMENS } from './data/cells';
import { STORAGE_KEYS } from './lib/storageKeys';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { useProgression } from './hooks/useProgression';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ACHIEVEMENTS_LIST } from './lib/progression';
import { generateTutorResponse } from './lib/tutor';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Stage } from './components/Stage';
import { RightPanel } from './components/RightPanel';
import { SpecimenStrip } from './components/SpecimenStrip';
import { WelcomeTour } from './components/WelcomeTour';

// Modals
import { SpecimenQuiz } from './components/modals/SpecimenQuiz';
import { ComparisonModal } from './components/modals/ComparisonModal';
import { NotebooksModal } from './components/modals/NotebooksModal';
import { FlashcardsModal } from './components/modals/FlashcardsModal';
import { AchievementsPanel } from './components/modals/AchievementsPanel';
import { DailyChallengeModal } from './components/modals/DailyChallengeModal';
import { MicroscopePanel } from './components/modals/MicroscopePanel';
import { GalleryModal } from './components/modals/GalleryModal';
import { LibraryModal } from './components/modals/LibraryModal';
import { AboutModal } from './components/modals/AboutModal';
import { SettingsModal } from './components/modals/SettingsModal';

export default function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [language, setLanguage] = useLocalStorage<LanguageCode>(STORAGE_KEYS.LANGUAGE, 'en');

  // Specimen selection
  const [selectedCellId, setSelectedCellId] = useLocalStorage<CellId>(
    STORAGE_KEYS.SELECTED_CELL_ID,
    'plant'
  );
  const currentCell =
    CELL_SPECIMENS.find((c) => c.id === selectedCellId) || CELL_SPECIMENS[0];

  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string>(
    currentCell.organelles[0]?.id || 'cellWall'
  );

  // When specimen changes, ensure valid organelle is selected
  useEffect(() => {
    if (!currentCell.organelles.some((o) => o.id === selectedOrganelleId)) {
      setSelectedOrganelleId(currentCell.organelles[0]?.id || '');
    }
  }, [selectedCellId, currentCell, selectedOrganelleId]);

  // Visual controls
  const [viewMode, setViewMode] = useState<ViewMode>('mesh');
  const [materialMode, setMaterialMode] = useLocalStorage<MaterialMode>(
    STORAGE_KEYS.MATERIAL_MODE,
    'studio'
  );
  const [crossSection, setCrossSection] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [hiddenOrganelleIds, setHiddenOrganelleIds] = useState<string[]>([]);

  // User progression and storage
  const {
    progress,
    awardXp,
    registerOrganelleInspection,
    recordQuizResult,
  } = useProgression();

  // Record exploration whenever specimen or organelle changes
  useEffect(() => {
    if (selectedOrganelleId) {
      registerOrganelleInspection(selectedCellId, selectedOrganelleId);
    }
  }, [selectedCellId, selectedOrganelleId, registerOrganelleInspection]);

  // Favorites
  const [favorites, setFavorites] = useLocalStorage<CellId[]>(
    STORAGE_KEYS.FAVORITES,
    ['plant', 'neuron']
  );
  const handleToggleFavorite = (id: CellId) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modals state
  type ModalType =
    | 'quiz'
    | 'about'
    | 'gallery'
    | 'library'
    | 'notebooks'
    | 'flashcards'
    | 'achievements'
    | 'microscope'
    | 'daily'
    | 'settings'
    | 'comparison';

  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  // Guided onboarding tour
  const [tourCompleted, setTourCompleted] = useLocalStorage<boolean>(
    STORAGE_KEYS.TOUR_COMPLETED,
    false
  );
  const [showTour, setShowTour] = useState<boolean>(!tourCompleted);

  // AI Tutor state
  const [aiTutorAnswer, setAiTutorAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleAskAiTutor = useCallback(
    (question: string) => {
      const activeOrganelle =
        currentCell.organelles.find((o) => o.id === selectedOrganelleId) ||
        currentCell.organelles[0];

      setIsAiLoading(true);
      setAiTutorAnswer(null);

      setTimeout(() => {
        const answer = generateTutorResponse(question, currentCell, activeOrganelle);
        setAiTutorAnswer(answer);
        setIsAiLoading(false);
        awardXp(15);
      }, 500);
    },
    [currentCell, selectedOrganelleId, awardXp]
  );

  // Organelle visibility toggles
  const handleToggleOrganelleVisibility = (id: string) => {
    setHiddenOrganelleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShowAllOrganelles = () => {
    setHiddenOrganelleIds([]);
  };

  const handleHideAllOrganelles = () => {
    setHiddenOrganelleIds(
      currentCell.organelles.filter((o) => o.id !== selectedOrganelleId).map((o) => o.id)
    );
  };

  const handleIsolateOrganelle = (id: string) => {
    setHiddenOrganelleIds(currentCell.organelles.filter((o) => o.id !== id).map((o) => o.id));
    setViewMode('focus');
  };

  const handleResetView = () => {
    setHiddenOrganelleIds([]);
    setViewMode('mesh');
    setCrossSection(false);
    setAutoRotate(false);
  };

  // Keyboard Shortcuts
  useKeyboardShortcuts({
    onToggleRotate: () => setAutoRotate((prev) => !prev),
    onToggleFocus: () => setViewMode((prev) => (prev === 'mesh' ? 'focus' : 'mesh')),
    onToggleCrossSection: () => setCrossSection((prev) => !prev),
    onResetView: handleResetView,
    onOpenQuiz: () => setActiveModal('quiz'),
    onSelectSpecimenIndex: (index: number) => {
      if (CELL_SPECIMENS[index]) {
        setSelectedCellId(CELL_SPECIMENS[index].id);
      }
    },
    onCycleMaterialMode: () => {
      setMaterialMode((prev) =>
        prev === 'native' ? 'studio' : prev === 'studio' ? 'solid' : 'native'
      );
    },
  });

  const handleResetAllData = () => {
    try {
      localStorage.clear();
      setSelectedCellId('plant');
      setFavorites(['plant', 'neuron']);
      setTourCompleted(false);
      setShowTour(true);
      window.location.reload();
    } catch {
      // safe fallback
    }
  };

  // Calculate achievements with unlocked status
  const mappedAchievements: AchievementItem[] = useMemo(() => {
    return ACHIEVEMENTS_LIST.map((ach) => {
      const isUnlocked = progress.unlockedAchievements.includes(ach.id);
      return {
        ...ach,
        unlocked: isUnlocked,
        unlockedAt: isUnlocked ? Date.now() : null,
      };
    });
  }, [progress.unlockedAchievements]);

  // Calculate mastery score for active organelle (1 to 5)
  const organelleKey = `${selectedCellId}:${selectedOrganelleId}`;
  const masteryScore = progress.masteryPerOrganelle[organelleKey] || 1;

  return (
    <div
      id="app-root-layout"
      className="w-screen h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans select-none antialiased"
    >
      {/* 1. Header with brand, XP, navigation, user menu */}
      <Header
        totalXp={progress.xp}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        language={language}
        onChangeLanguage={setLanguage}
        onOpenModal={(modal) => setActiveModal(modal)}
        onResetAllData={handleResetAllData}
      />

      {/* 2. Main Center Body: Left Sidebar + Center Stage + Right Panel */}
      <main id="cytology-workspace" className="flex-1 flex overflow-hidden relative">
        {/* Left: Organelle Directory Sidebar */}
        <Sidebar
          cell={currentCell}
          selectedOrganelleId={selectedOrganelleId}
          onSelectOrganelle={setSelectedOrganelleId}
          hiddenOrganelleIds={hiddenOrganelleIds}
          onToggleOrganelleVisibility={handleToggleOrganelleVisibility}
          onShowAllOrganelles={handleShowAllOrganelles}
          onHideAllOrganelles={handleHideAllOrganelles}
        />

        {/* Center: 3D Three.js Viewport & Floating Toolbars */}
        <Stage
          cell={currentCell}
          selectedOrganelleId={selectedOrganelleId}
          onSelectOrganelle={setSelectedOrganelleId}
          viewMode={viewMode}
          onToggleViewMode={() =>
            setViewMode((prev) => (prev === 'mesh' ? 'focus' : 'mesh'))
          }
          materialMode={materialMode}
          onChangeMaterialMode={setMaterialMode}
          crossSection={crossSection}
          onToggleCrossSection={() => setCrossSection((prev) => !prev)}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
          hiddenOrganelleIds={hiddenOrganelleIds}
          onIsolateOrganelle={handleIsolateOrganelle}
          onResetView={handleResetView}
          onOpenModal={(type) => setActiveModal(type)}
        />

        {/* Right: Organelle Attribute Details, Pathology Tab & AI Tutor */}
        <RightPanel
          cell={currentCell}
          selectedOrganelleId={selectedOrganelleId}
          masteryScore={masteryScore}
          onAskAiTutor={handleAskAiTutor}
          aiTutorAnswer={aiTutorAnswer}
          isAiLoading={isAiLoading}
        />
      </main>

      {/* 3. Bottom: Specimen Strip Carousel */}
      <SpecimenStrip
        selectedCellId={selectedCellId}
        onSelectCell={(id) => {
          setSelectedCellId(id);
          const nextCell = CELL_SPECIMENS.find((c) => c.id === id);
          if (nextCell) {
            setSelectedOrganelleId(nextCell.organelles[0]?.id || '');
          }
        }}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Modals & Overlays */}
      <SpecimenQuiz
        isOpen={activeModal === 'quiz'}
        onClose={() => setActiveModal(null)}
        currentCellId={selectedCellId}
        onQuizCompleted={(mode: QuizMode, score: number, durationSeconds: number, perfect: boolean) => {
          recordQuizResult(mode, score, durationSeconds, perfect);
        }}
      />

      <ComparisonModal
        isOpen={activeModal === 'comparison'}
        onClose={() => setActiveModal(null)}
        currentCellId={selectedCellId}
        onSelectCell={(id) => setSelectedCellId(id)}
      />

      <NotebooksModal
        isOpen={activeModal === 'notebooks'}
        onClose={() => setActiveModal(null)}
        currentCellId={selectedCellId}
        onAwardXp={awardXp}
      />

      <FlashcardsModal
        isOpen={activeModal === 'flashcards'}
        onClose={() => setActiveModal(null)}
        onAwardXp={awardXp}
      />

      <AchievementsPanel
        isOpen={activeModal === 'achievements'}
        onClose={() => setActiveModal(null)}
        achievements={mappedAchievements}
      />

      <DailyChallengeModal
        isOpen={activeModal === 'daily'}
        onClose={() => setActiveModal(null)}
        dailyStreak={progress.streakDays}
        onSelectCell={(id) => setSelectedCellId(id)}
        onAwardXp={awardXp}
      />

      <MicroscopePanel
        isOpen={activeModal === 'microscope'}
        onClose={() => setActiveModal(null)}
        currentCellId={selectedCellId}
        onSelectCell={(id) => setSelectedCellId(id)}
      />

      <GalleryModal
        isOpen={activeModal === 'gallery'}
        onClose={() => setActiveModal(null)}
        selectedCellId={selectedCellId}
        onSelectCell={(id) => setSelectedCellId(id)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <LibraryModal
        isOpen={activeModal === 'library'}
        onClose={() => setActiveModal(null)}
        onSelectOrganelleAndCell={(cellId, organelleId) => {
          setSelectedCellId(cellId as CellId);
          setSelectedOrganelleId(organelleId);
        }}
      />

      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={() => setActiveModal(null)}
        onLaunchTour={() => setShowTour(true)}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        onResetAllData={handleResetAllData}
      />

      {/* Guided Onboarding Tour */}
      <WelcomeTour
        isOpen={showTour}
        onClose={() => {
          setShowTour(false);
          setTourCompleted(true);
        }}
      />
    </div>
  );
}
