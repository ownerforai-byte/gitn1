import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  BookOpen,
  HelpCircle,
  Sun,
  Moon,
  Globe,
  Award,
  Calendar,
  Settings,
  RotateCcw,
  Compass,
  BookmarkCheck,
  Microscope,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../lib/i18n';
import { calculateLevelInfo } from '../lib/progression';

interface HeaderProps {
  totalXp: number;
  isDark: boolean;
  onToggleDarkMode: () => void;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onOpenModal: (
    type:
      | 'quiz'
      | 'about'
      | 'gallery'
      | 'library'
      | 'notebooks'
      | 'flashcards'
      | 'achievements'
      | 'microscope'
      | 'daily'
      | 'settings'
  ) => void;
  onResetAllData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalXp,
  isDark,
  onToggleDarkMode,
  language,
  onChangeLanguage,
  onOpenModal,
  onResetAllData,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const levelInfo = calculateLevelInfo(totalXp);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="main-app-header"
      className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-30 transition-colors"
    >
      {/* Brand orb + App title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-300">
              <Microscope className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
        </div>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
              {getTranslation(language, 'appTitle')}
            </h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              v2.5
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getTranslation(language, 'tagline')}
          </p>
        </div>
      </div>

      {/* Center: XP Bar & Level */}
      <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[10px]">
            {levelInfo.level}
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            LVL {levelInfo.level}
          </span>
        </div>

        <div className="w-28 sm:w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${levelInfo.percentage}%` }}
          />
        </div>

        <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
          {levelInfo.currentLevelXp} / {levelInfo.xpToNextLevel} XP
        </span>
      </div>

      {/* Right Navigation & Tools */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Navigation Buttons */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            type="button"
            onClick={() => onOpenModal('gallery')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'gallery')}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('library')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'library')}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('flashcards')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'flashcards')}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('notebooks')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'notebooks')}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('microscope')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors flex items-center gap-1.5"
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'microscope')}</span>
          </button>
        </nav>

        {/* Start Quiz Action */}
        <button
          type="button"
          id="header-quiz-btn"
          onClick={() => onOpenModal('quiz')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{getTranslation(language, 'quiz')}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          title={isDark ? getTranslation(language, 'lightMode') : getTranslation(language, 'darkMode')}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1"
            title="Language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">{language}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-28 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50">
              {(['en', 'es', 'fr'] as LanguageCode[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    onChangeLanguage(l);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    language === l ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{l === 'en' ? 'English' : l === 'es' ? 'Español' : 'Français'}</span>
                  {language === l && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1 text-slate-700 dark:text-slate-200"
            title="User Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
              CA
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 text-slate-700 dark:text-slate-200">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold">Cytology Scholar</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Total XP: {totalXp}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onOpenModal('achievements');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Achievements</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenModal('daily');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Daily & Weekly Challenge</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenModal('about');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  <span>About & Histology Guides</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenModal('settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Keybindings & Preferences</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all progress, notes, and favorites?')) {
                      onResetAllData();
                      setUserMenuOpen(false);
                    }
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All App Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
