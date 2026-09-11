import { Flashcard } from '../types';
import { CELL_SPECIMENS } from '../data/cells';

// SM-2 Spaced Repetition Algorithm implementation
export function calculateSM2(
  card: Flashcard,
  quality: number // 0 to 5 (0: complete blank, 3: pass with effort, 5: perfect instant recall)
): {
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: number;
} {
  let repetitionCount = card.repetitionCount ?? card.repetitions ?? 0;
  let intervalDays = card.intervalDays ?? card.interval ?? 1;
  let easeFactor = card.easeFactor;

  if (quality >= 3) {
    if (repetitionCount === 0) {
      intervalDays = 1;
    } else if (repetitionCount === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitionCount++;
  } else {
    repetitionCount = 0;
    intervalDays = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const oneDayMs = 24 * 60 * 60 * 1000;
  const nextReviewDate = Date.now() + intervalDays * oneDayMs;

  return {
    repetitionCount,
    intervalDays,
    easeFactor,
    nextReviewDate,
  };
}

export function calculateNextReview(
  interval: number,
  repetitions: number,
  easeFactor: number,
  quality: number
): {
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueDate: number;
} {
  const dummyCard: Flashcard = {
    id: 'temp',
    cellId: 'animal',
    organelleId: 'temp',
    question: '',
    answer: '',
    intervalDays: interval,
    repetitionCount: repetitions,
    easeFactor: easeFactor,
    nextReviewDate: Date.now(),
  };

  const result = calculateSM2(dummyCard, quality);
  return {
    interval: result.intervalDays,
    repetitions: result.repetitionCount,
    easeFactor: result.easeFactor,
    dueDate: result.nextReviewDate,
  };
}

export function generateDefaultFlashcards(): Flashcard[] {
  const cards: Flashcard[] = [];

  CELL_SPECIMENS.forEach((cell) => {
    cell.organelles.forEach((org) => {
      cards.push({
        id: `card-${cell.id}-${org.id}-func`,
        cellId: cell.id,
        organelleId: org.id,
        question: `What is the primary function and composition of the ${org.name} in ${cell.name}?`,
        answer: `${org.attributes.function} It is composed of ${org.attributes.composition}. Membrane: ${org.attributes.membrane}.`,
        difficulty: 'medium',
        intervalDays: 1,
        repetitionCount: 0,
        easeFactor: 2.5,
        nextReviewDate: Date.now(),
      });

      cards.push({
        id: `card-${cell.id}-${org.id}-fact`,
        cellId: cell.id,
        organelleId: org.id,
        question: `Clinical or biological significance of ${org.name}?`,
        answer: `${org.note} Fun fact: ${org.fact}`,
        difficulty: 'hard',
        intervalDays: 1,
        repetitionCount: 0,
        easeFactor: 2.5,
        nextReviewDate: Date.now() + 3600000,
      });
    });
  });

  return cards;
}
