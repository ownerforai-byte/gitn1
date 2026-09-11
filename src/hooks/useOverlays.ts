import { useState, useCallback } from 'react';

export type OverlayType =
  | 'quiz'
  | 'about'
  | 'gallery'
  | 'library'
  | 'notebooks'
  | 'flashcards'
  | 'achievements'
  | 'comparison'
  | 'shortcuts'
  | 'welcome'
  | 'microscope'
  | 'daily'
  | 'settings'
  | null;

export function useOverlays() {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

  const openOverlay = useCallback((type: OverlayType) => {
    setActiveOverlay(type);
  }, []);

  const closeOverlay = useCallback(() => {
    setActiveOverlay(null);
  }, []);

  const toggleOverlay = useCallback((type: OverlayType) => {
    setActiveOverlay((prev) => (prev === type ? null : type));
  }, []);

  return {
    activeOverlay,
    openOverlay,
    closeOverlay,
    toggleOverlay,
    isOpen: (type: OverlayType) => activeOverlay === type,
  };
}
