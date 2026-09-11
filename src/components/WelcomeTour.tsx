import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { useEscapeToClose } from '../hooks/useEscapeToClose';

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ isOpen, onClose }) => {
  useEscapeToClose(isOpen, onClose);
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to Cell Architecture Studio',
      description:
        'An interactive real-time 3D cytological browser and histology research laboratory. Examine seven biologically precise cell architectures across animal, plant, neural, immune, and bacterial kingdoms.',
      tag: 'Interactive Cytology',
    },
    {
      title: 'Interactive 3D Stage & Optics',
      description:
        'Click and drag to rotate the specimen in three dimensions. Scroll to zoom, and right-click or two-finger drag to pan. Use Focus View (F) to isolate individual organelles with emissive glows and dim the surrounding cytoplasm.',
      tag: '3D Navigation',
    },
    {
      title: 'Real-Time Cross-Section & Mitosis',
      description:
        'Engage Cross-Section (C) to slice the cell open with dynamic mathematical clipping planes. Toggle the Mitosis Cycle button to animate live cell division across Interphase, Prophase, Metaphase, Anaphase, and Telophase.',
      tag: 'Sectioning & Dynamics',
    },
    {
      title: 'Cytopathology & Clinical Mutations',
      description:
        'Switch between Structure & Bio, Pathology, and Distribution tabs on the right panel. Inspect real-world genetic mutations like Tay-Sachs, Leigh Syndrome, and Pompe Disease with ultrastructural changes.',
      tag: 'Medical Pathology',
    },
    {
      title: 'Microscope, Quizzes & Research Notebooks',
      description:
        'Use the top navigation bar to open the Virtual Microscope Station with 4x-100x lenses, Spaced Repetition Flashcards (SM-2), Comparative Analysis Matrix, and rich Laboratory Notebooks that can be exported as formatted PDF reports.',
      tag: 'Research Tools',
    },
  ];

  const currentStep = tourSteps[step];

  const handleNext = () => {
    if (step + 1 >= tourSteps.length) {
      onClose();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">
              {currentStep.tag}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === step
                    ? 'w-6 bg-blue-600'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-blue-500/20"
            >
              <span>{step + 1 >= tourSteps.length ? 'Get Started' : 'Next'}</span>
              {step + 1 >= tourSteps.length ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
