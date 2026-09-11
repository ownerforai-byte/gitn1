import React, { useState } from 'react';
import {
  X,
  Calendar,
  Flame,
  CheckCircle2,
  Gift,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { CellId } from '../../types';
import { CELL_SPECIMENS } from '../../data/cells';
import {
  getDailySpecimen,
  getWeeklyChallenge,
  hasCompletedDailyToday,
  markDailyCompleted,
} from '../../lib/daily';
import { useEscapeToClose } from '../../hooks/useEscapeToClose';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyStreak: number;
  onSelectCell: (id: CellId) => void;
  onAwardXp: (amount: number) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  dailyStreak,
  onSelectCell,
  onAwardXp,
}) => {
  useEscapeToClose(isOpen, onClose);

  const [isCompleted, setIsCompleted] = useState(hasCompletedDailyToday());

  if (!isOpen) return null;

  const dailySpecimen = getDailySpecimen();
  const weeklyChallenge = getWeeklyChallenge();

  const handleClaimDaily = () => {
    if (isCompleted) return;
    markDailyCompleted();
    setIsCompleted(true);
    onAwardXp(100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Daily Mission & Streak
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Earn daily bonus XP and master weekly biological objectives
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Streak Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {dailyStreak} Day Learning Streak!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Explore daily to retain spaced cytology mastery
                </p>
              </div>
            </div>

            <span className="text-lg font-mono font-bold text-orange-600 dark:text-orange-400">
              +{dailyStreak * 10} XP
            </span>
          </div>

          {/* Daily Specimen Mission */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Today's Specimen of the Day
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: dailySpecimen.accentColor }}
                >
                  {dailySpecimen.name.slice(0, 1)}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {dailySpecimen.name}
                  </h5>
                  <p className="text-xs text-slate-500 italic">{dailySpecimen.scientificName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectCell(dailySpecimen.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
              >
                <span>Study Specimen</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Reward: 100 XP + Streak Counter
              </span>

              <button
                type="button"
                onClick={handleClaimDaily}
                disabled={isCompleted}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Claimed Today</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-3.5 h-3.5" />
                    <span>Claim 100 XP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Weekly Biological Quest */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Weekly Cellular Quest
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                +{weeklyChallenge.rewardXp} XP
              </span>
            </div>

            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {weeklyChallenge.title}
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {weeklyChallenge.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
