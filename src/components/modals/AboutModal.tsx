import React from 'react';
import { X, HelpCircle, BookOpen, Layers, ShieldCheck, ExternalLink } from 'lucide-react';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTour: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onLaunchTour,
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                About Cell Architecture Studio
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Educational Cytological 3D Atlas & Histology Guide
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed no-scrollbar">
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
              Interactive 3D Cytological Explorer
            </h4>
            <p>
              Cell Architecture Studio is engineered for undergraduate biology students, medical scholars, and cytopathologists to examine cellular architecture in full real-time three dimensions.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Core Scientific Capabilities
            </h5>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>High-fidelity procedural 3D models with ACES tone-mapping & realistic depth</li>
              <li>Focus view mode dimming inactive organelles to emphasize active structures</li>
              <li>Virtual research microscope simulating 4x, 10x, 40x, and 100x oil immersion lenses</li>
              <li>Cell cycle mitosis time-lapse animation spanning Interphase to Telophase</li>
              <li>Cytopathology tabs describing clinical mutations, metabolic errors, and disease states</li>
              <li>Spaced repetition flashcards utilizing the SuperMemo SM-2 interval algorithm</li>
              <li>Adaptive exam testing causal, timed, typed, survival, and spot-the-difference modes</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunchTour();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Launch Studio Guided Tour</span>
            </button>

            <span className="text-[11px] font-mono text-slate-400">
              Cell Architecture Studio v2.5.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
