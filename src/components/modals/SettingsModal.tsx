import React from 'react';
import { X, Settings, Keyboard, ShieldAlert } from 'lucide-react';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetAllData,
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '1 - 7', desc: 'Select specimen 1 through 7 directly' },
    { key: 'F', desc: 'Toggle between Focus and Mesh view mode' },
    { key: 'C', desc: 'Toggle real-time cross-section clipping plane' },
    { key: 'R', desc: 'Toggle auto-rotation on/off' },
    { key: 'M', desc: 'Cycle material mode (native / studio / solid)' },
    { key: 'Q', desc: 'Launch cellular knowledge quiz examination' },
    { key: '0', desc: 'Reset 3D camera to default orientation' },
    { key: 'Esc', desc: 'Close any active overlay or modal dialog' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Keybindings & System Preferences
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Keyboard navigation map and local data management
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs no-scrollbar">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-blue-500" />
              <span>Studio Keyboard Shortcuts</span>
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {shortcuts.map((sc) => (
                <div
                  key={sc.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                >
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {sc.desc}
                  </span>
                  <kbd className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone: reset all */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <h5 className="font-bold">Reset Stored Data</h5>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Resetting will wipe all earned XP, saved flashcard reviews, custom notes, and favorited specimens stored in your browser's local cache.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you certain you want to wipe all cytology progress?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
            >
              Reset All Progress & Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
