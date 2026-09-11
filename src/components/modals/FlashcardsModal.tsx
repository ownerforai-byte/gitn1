import React, { useState } from 'react';
import {
  X,
  BookmarkCheck,
  RotateCw,
  Plus,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { FlashcardItem } from '../../types';
import { CELL_SPECIMENS } from '../../data/cells';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { calculateNextReview } from '../../lib/spacedRepetition';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardXp: (amount: number) => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  onAwardXp,
}) => {
  useEscapeToClose(isOpen, onClose);

  // Initialize initial flashcards pool from specimens
  const initialCards: FlashcardItem[] = [];
  CELL_SPECIMENS.forEach((cell) => {
    cell.organelles.slice(0, 3).forEach((org) => {
      initialCards.push({
        id: `card-${cell.id}-${org.id}`,
        cellId: cell.id,
        organelleId: org.id,
        front: `What is the primary function of the ${org.name} in the ${cell.name}?`,
        back: `${org.attributes.function}\n\nKey Fact: ${org.fact}`,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: Date.now() - 1000,
      });
    });
  });

  const [cards, setCards] = useLocalStorage<FlashcardItem[]>(
    STORAGE_KEYS.FLASHCARDS,
    initialCards
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Custom card form
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  if (!isOpen) return null;

  const activeCard: FlashcardItem | undefined = cards[currentIndex];

  const handleRate = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!activeCard) return;

    const result = calculateNextReview(
      activeCard.interval ?? activeCard.intervalDays ?? 1,
      activeCard.repetitions ?? activeCard.repetitionCount ?? 0,
      activeCard.easeFactor,
      quality
    );

    setCards((prev) =>
      prev.map((c) =>
        c.id === activeCard.id
          ? {
              ...c,
              interval: result.interval,
              repetitions: result.repetitions,
              easeFactor: result.easeFactor,
              dueDate: result.dueDate,
            }
          : c
      )
    );

    onAwardXp(quality >= 3 ? 20 : 5);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handleCreateCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: FlashcardItem = {
      id: `custom-card-${Date.now()}`,
      cellId: 'animal',
      front: newFront,
      back: newBack,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: Date.now(),
    };

    setCards((prev) => [newCard, ...prev]);
    setNewFront('');
    setNewBack('');
    setIsCreatingCustom(false);
    onAwardXp(25);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Spaced Repetition Flashcards (SM-2)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Card {currentIndex + 1} of {cards.length} • Adaptive memory retention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingCustom((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Card</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between space-y-6">
          {isCreatingCustom ? (
            /* Create Custom Deck Card Form */
            <form onSubmit={handleCreateCustomCard} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Create Cytology Flashcard
              </h4>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Question / Prompt (Front)
                </label>
                <textarea
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. Which enzyme complexes synthesize ATP across the cristae?"
                  className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Answer / Biological Details (Back)
                </label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. ATP Synthase F0F1 rotational motor complexes driven by proton motive force."
                  className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save Card
                </button>
              </div>
            </form>
          ) : activeCard ? (
            /* Flashcard Interactive Flip Card */
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div
                onClick={() => setIsFlipped((prev) => !prev)}
                className="w-full min-h-64 p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:border-emerald-500 transition-all select-none"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-1">
                  <RotateCw className="w-3 h-3 animate-spin" />
                  <span>{isFlipped ? 'Answer (Click to flip)' : 'Prompt (Click to reveal)'}</span>
                </span>

                <p className="text-base font-medium text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed max-w-lg">
                  {isFlipped ? activeCard.back : activeCard.front}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-3">
                  <span>Interval: {activeCard.interval}d</span>
                  <span>Ease: {activeCard.easeFactor.toFixed(2)}</span>
                  <span>Reps: {activeCard.repetitions}</span>
                </div>
              </div>

              {/* SM-2 Quality Rating Feedback Buttons */}
              {isFlipped && (
                <div className="w-full space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 text-center block">
                    Rate Your Memory Recall (SM-2 Quality):
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRate(0)}
                      className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100"
                    >
                      0 • Blackout
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRate(2)}
                      className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100"
                    >
                      2 • Difficult
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRate(4)}
                      className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100"
                    >
                      4 • Good
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRate(5)}
                      className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100"
                    >
                      5 • Perfect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No flashcards in deck. Click "Add Custom Card" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
