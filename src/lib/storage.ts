export function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[Cell Architecture Studio] Failed to parse storage for key "${key}":`, err);
    return defaultValue;
  }
}

export function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[Cell Architecture Studio] Failed to save storage for key "${key}":`, err);
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`[Cell Architecture Studio] Failed to remove storage for key "${key}":`, err);
  }
}

export function resetAllAppData(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('cas-')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('[Cell Architecture Studio] Failed to reset app data:', err);
  }
}
