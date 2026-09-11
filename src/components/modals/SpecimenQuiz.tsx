import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  RotateCcw,
  Clock,
  Heart,
  HelpCircle,
  Volume2,
  VolumeX,
  GitCompare,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CellId, QuizMode, QuizQuestion } from '../../types';
import { CELL_SPECIMENS } from '../../data/cells';
import { soundEffects } from '../../lib/quizSound';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface SpecimenQuizProps {
  isOpen: boolean;
  onClose: () => void;
  currentCellId: CellId;
  onQuizCompleted: (mode: QuizMode, score: number, durationSeconds: number, perfect: boolean) => void;
}

export const SpecimenQuiz: React.FC<SpecimenQuizProps> = ({
  isOpen,
  onClose,
  currentCellId,
  onQuizCompleted,
}) => {
  useEscapeToClose(isOpen, onClose);

  const [mode, setMode] = useState<QuizMode>('casual');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(12);
  const [quizFinished, setQuizFinished] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [soundMuted, setSoundMuted] = useState(soundEffects.isMuted());

  // Generate question bank dynamically
  const questions: QuizQuestion[] = useMemo(() => {
    const list: QuizQuestion[] = [];

    // Spot the difference questions
    list.push({
      id: 'q-diff-1',
      type: 'difference',
      cellId: 'animal',
      question: 'Compare an Animal Cell vs a Plant Cell. Which organelle is present in the Plant Cell but absent in typical somatic Animal Cells?',
      options: ['Chloroplast', 'Mitochondria', 'Rough Endoplasmic Reticulum', 'Golgi Apparatus'],
      correctAnswer: 'Chloroplast',
      explanation: 'Chloroplasts and cellulose cell walls are distinctive features of plant cells, whereas animal cells rely on dietary nutrients and mitochondrial respiration.',
      comparisonPair: { cellA: 'animal', cellB: 'plant', diffOrganelle: 'chloroplast' },
    });

    list.push({
      id: 'q-diff-2',
      type: 'difference',
      cellId: 'bacteria',
      question: 'Compare a Bacterium (E. coli) vs an Animal Cell. Which core structural hallmark distinguishes the prokaryotic bacterium?',
      options: ['Absence of a membrane-bound nuclear envelope', 'Absence of ribosomes', 'Lack of a plasma membrane', 'Absence of genetic DNA'],
      correctAnswer: 'Absence of a membrane-bound nuclear envelope',
      explanation: 'Prokaryotes lack membrane-enclosed organelles; their DNA is housed in an open nucleoid rather than a membrane-bound nucleus.',
      comparisonPair: { cellA: 'bacteria', cellB: 'animal', diffOrganelle: 'nucleoid' },
    });

    list.push({
      id: 'q-diff-3',
      type: 'difference',
      cellId: 'neuron',
      question: 'Compare a Motor Neuron vs a Skeletal Muscle Fiber. Which structure is specialized for myelin-accelerated saltatory conduction in the neuron?',
      options: ['Nodes of Ranvier', 'Sarcomeres', 'T-Tubules', 'Sarcoplasmic Reticulum'],
      correctAnswer: 'Nodes of Ranvier',
      explanation: 'Nodes of Ranvier are unmyelinated gaps along the axon rich in Nav1.6 channels that allow action potentials to jump via saltatory conduction.',
      comparisonPair: { cellA: 'neuron', cellB: 'muscle', diffOrganelle: 'myelin' },
    });

    // Subject questions from all cells
    CELL_SPECIMENS.forEach((cell) => {
      cell.organelles.forEach((org) => {
        // Function identification question
        list.push({
          id: `q-func-${cell.id}-${org.id}`,
          type: 'function',
          cellId: cell.id,
          organelleId: org.id,
          question: `In the ${cell.name}, which organelle performs the following: "${org.attributes.function.slice(0, 100)}..."?`,
          options: shuffleArray([
            org.name,
            ...cell.organelles
              .filter((o) => o.id !== org.id)
              .slice(0, 3)
              .map((o) => o.name),
          ]),
          correctAnswer: org.name,
          explanation: `${org.name} (${org.subtitle}): ${org.attributes.function}`,
        });

        // Clinical / disease question if available
        const disease = cell.diseaseStates.find((d) => d.organelleId === org.id);
        if (disease) {
          list.push({
            id: `q-clin-${cell.id}-${org.id}`,
            type: 'clinical',
            cellId: cell.id,
            organelleId: org.id,
            question: `Defects in the ${org.name} are directly associated with which clinical condition: "${disease.diseaseName}"?`,
            options: shuffleArray([
              disease.diseaseName,
              'Influenza Type B',
              'Acute Appendicitis',
              'Benign Lipoma',
            ]),
            correctAnswer: disease.diseaseName,
            explanation: `${disease.diseaseName}: ${disease.pathology}`,
          });
        }
      });
    });

    return shuffleArray(list).slice(0, 12);
  }, []);

  const currentQ = questions[questionIndex] || questions[0];

  // Reset state when opening quiz or switching modes
  const handleStartMode = (newMode: QuizMode) => {
    setMode(newMode);
    setQuestionIndex(0);
    setScore(0);
    setLives(3);
    setTimeLeft(12);
    setQuizFinished(false);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswerRevealed(false);
    setStartTime(Date.now());
  };

  // Timed mode countdown timer
  useEffect(() => {
    if (!isOpen || quizFinished || isAnswerRevealed || mode !== 'timed') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        if (prev <= 4) {
          soundEffects.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, quizFinished, isAnswerRevealed, mode, questionIndex]);

  const handleTimeout = () => {
    soundEffects.playWrong();
    setIsAnswerRevealed(true);
    setSelectedOption('TIMEOUT');
  };

  const checkAnswer = (answer: string) => {
    if (isAnswerRevealed) return;

    setSelectedOption(answer);
    setIsAnswerRevealed(true);

    const isCorrect =
      mode === 'type'
        ? answer.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase()
        : answer === currentQ.correctAnswer;

    if (isCorrect) {
      soundEffects.playCorrect();
      setScore((prev) => prev + 1);
    } else {
      soundEffects.playWrong();
      if (mode === 'survival') {
        const remaining = lives - 1;
        setLives(remaining);
        if (remaining <= 0) {
          setTimeout(() => finishQuiz(score), 1000);
          return;
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= questions.length) {
      finishQuiz(score);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTypedAnswer('');
      setIsAnswerRevealed(false);
      setTimeLeft(12);
    }
  };

  const finishQuiz = (finalScore: number) => {
    setQuizFinished(true);
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);
    const isPerfect = finalScore === questions.length;

    soundEffects.playLevelUp();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    onQuizCompleted(mode, finalScore, durationSeconds, isPerfect);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cellular Knowledge Exam
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                Mode: {mode} • Question {questionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                soundEffects.setMuted(!soundMuted);
                setSoundMuted(!soundMuted);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Chips */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Modes:</span>
          {(['casual', 'timed', 'type', 'survival', 'difference'] as QuizMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleStartMode(m)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                mode === m
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {m === 'difference' ? 'Spot Difference' : m}
            </button>
          ))}
        </div>

        {/* Status Bar: Score / Timer / Lives */}
        <div className="px-6 py-2 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800/60 font-mono">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Score: {score}
            </span>
          </div>

          {mode === 'timed' && (
            <div className={`flex items-center gap-1.5 ${timeLeft <= 3 ? 'text-rose-500 animate-pulse font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s remaining</span>
            </div>
          )}

          {mode === 'survival' && (
            <div className="flex items-center gap-1 text-rose-500">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Heart
                  key={idx}
                  className={`w-4 h-4 ${idx < lives ? 'fill-rose-500' : 'opacity-20'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quiz Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!quizFinished ? (
            <div className="space-y-6">
              {/* Question card */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  {currentQ.type === 'difference'
                    ? 'Comparative Spot-The-Difference'
                    : currentQ.type === 'clinical'
                    ? 'Clinical Correlation'
                    : 'Anatomical Function'}
                </span>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Type mode vs Options mode */}
              {mode === 'type' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    disabled={isAnswerRevealed}
                    placeholder="Type the exact organelle name..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {!isAnswerRevealed && (
                    <button
                      type="button"
                      onClick={() => checkAnswer(typedAnswer)}
                      disabled={!typedAnswer.trim()}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isChosen = selectedOption === opt;
                    const isCorrect = opt === currentQ.correctAnswer;

                    let btnStyle =
                      'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800';

                    if (isAnswerRevealed) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-200';
                      } else {
                        btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => checkAnswer(opt)}
                        disabled={isAnswerRevealed}
                        className={`p-3.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswerRevealed && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                        {isAnswerRevealed && isChosen && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation & Next button */}
              {isAnswerRevealed && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      Cytological Insight:
                    </span>
                    <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                    >
                      <span>{questionIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Examination Complete!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You scored {score} out of {questions.length} questions correctly.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStartMode(mode)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Return to Studio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
