import { useState, useEffect } from 'react';
import { loadStorage, saveStorage } from '../lib/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => loadStorage<T>(key, initialValue));

  useEffect(() => {
    saveStorage(key, storedValue);
  }, [key, storedValue]);

  const setValue = (val: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const next = typeof val === 'function' ? (val as (prev: T) => T)(prev) : val;
      return next;
    });
  };

  return [storedValue, setValue];
}
