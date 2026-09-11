import React from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { AchievementItem } from '../../types';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: AchievementItem[];
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null || a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cytology Achievements & Milestones
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} badges
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
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 no-scrollbar">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlockedAt !== null || Boolean(ach.unlocked);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-70'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-bold shadow-xs ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Sparkles className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {ach.name || ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
