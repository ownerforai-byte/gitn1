import { useEffect } from 'react';
import { KeyBindingConfig } from '../types';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { useLocalStorage } from './useLocalStorage';

export const DEFAULT_KEY_BINDINGS: KeyBindingConfig = {
  rotate: 'r',
  focus: 'f',
  crossSection: 'x',
  zoomIn: '+',
  zoomOut: '-',
  resetView: '0',
  quiz: 'q',
  search: '/',
};

export interface ShortcutHandlers {
  onToggleRotate?: () => void;
  onToggleFocus?: () => void;
  onToggleCrossSection?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onOpenQuiz?: () => void;
  onFocusSearch?: () => void;
  onSelectSpecimenIndex?: (index: number) => void;
  onCycleMaterialMode?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const [bindings, setBindings] = useLocalStorage<KeyBindingConfig>(
    STORAGE_KEYS.KEYBINDINGS,
    DEFAULT_KEY_BINDINGS
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea or select
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      const key = e.key.toLowerCase();

      // Specimen 1-7 numbers
      if (['1', '2', '3', '4', '5', '6', '7'].includes(key) && handlers.onSelectSpecimenIndex) {
        handlers.onSelectSpecimenIndex(parseInt(key, 10) - 1);
        return;
      }

      if (key === 'm' && handlers.onCycleMaterialMode) {
        handlers.onCycleMaterialMode();
        return;
      }

      if (key === bindings.rotate.toLowerCase() && handlers.onToggleRotate) {
        e.preventDefault();
        handlers.onToggleRotate();
      } else if (key === bindings.focus.toLowerCase() && handlers.onToggleFocus) {
        e.preventDefault();
        handlers.onToggleFocus();
      } else if (key === bindings.crossSection.toLowerCase() && handlers.onToggleCrossSection) {
        e.preventDefault();
        handlers.onToggleCrossSection();
      } else if ((key === bindings.zoomIn || key === '=') && handlers.onZoomIn) {
        e.preventDefault();
        handlers.onZoomIn();
      } else if (key === bindings.zoomOut && handlers.onZoomOut) {
        e.preventDefault();
        handlers.onZoomOut();
      } else if (key === bindings.resetView && handlers.onResetView) {
        e.preventDefault();
        handlers.onResetView();
      } else if (key === bindings.quiz.toLowerCase() && handlers.onOpenQuiz) {
        e.preventDefault();
        handlers.onOpenQuiz();
      } else if (key === bindings.search && handlers.onFocusSearch) {
        e.preventDefault();
        handlers.onFocusSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bindings, handlers]);

  return {
    bindings,
    setBindings,
    resetToDefaults: () => setBindings(DEFAULT_KEY_BINDINGS),
  };
}
