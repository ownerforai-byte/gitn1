import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../lib/storageKeys';

export function useDarkMode(): [boolean, (value?: boolean) => void] {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (err) {
      console.error(err);
    }
  }, [isDark]);

  const toggleDarkMode = (value?: boolean) => {
    setIsDark((prev) => (typeof value === 'boolean' ? value : !prev));
  };

  return [isDark, toggleDarkMode];
}
