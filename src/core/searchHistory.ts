const STORAGE_KEY = 'country-search-history';
const MAX_HISTORY_ITEMS = 5;

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getSearchHistory(storage: StorageLike | null = getStorage()): string[] {
  if (!storage) {
    return [];
  }

  try {
    const storedValue = storage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const uniqueQueries = new Map<string, string>();

    for (const item of parsedValue) {
      if (typeof item !== 'string') {
        continue;
      }

      const query = item.trim();

      if (!query) {
        continue;
      }

      const key = query.toLocaleLowerCase();

      if (!uniqueQueries.has(key)) {
        uniqueQueries.set(key, query);
      }
    }

    return [...uniqueQueries.values()].slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function addSearchHistory(
  query: string,
  storage: StorageLike | null = getStorage(),
): string[] {
  const normalizedQuery = query.trim();

  if (!normalizedQuery || !storage) {
    return getSearchHistory(storage);
  }

  const history = getSearchHistory(storage);

  const updatedHistory = [
    normalizedQuery,
    ...history.filter((item) => item.toLocaleLowerCase() !== normalizedQuery.toLocaleLowerCase()),
  ].slice(0, MAX_HISTORY_ITEMS);

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch {
    // just skip
  }

  return updatedHistory;
}

export function clearSearchHistory(storage: StorageLike | null = getStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // just skip
  }
}
