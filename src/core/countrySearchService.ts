import type { Country } from './types';

type SearchFunction = (query: string, signal: AbortSignal) => Promise<Country[]>;

interface CacheEntry {
  countries: Country[];
  expiresAt: number;
}

interface InFlightRequest {
  controller: AbortController;
  consumers: number;
  promise: Promise<Country[]>;
}

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 50;

function createAbortError(): DOMException {
  return new DOMException('The operation was aborted', 'AbortError');
}

export function createCountrySearchService(
  search: SearchFunction,
  cacheTtl: number = DEFAULT_CACHE_TTL,
  now: () => number = Date.now,
) {
  const cache = new Map<string, CacheEntry>();
  const inFlight = new Map<string, InFlightRequest>();

  function getCachedResult(key: string): Country[] | null {
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= now()) {
      cache.delete(key);
      return null;
    }

    cache.delete(key);
    cache.set(key, entry);

    return entry.countries;
  }

  function saveToCache(key: string, countries: Country[]): void {
    if (cache.has(key)) {
      cache.delete(key);
    }

    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = cache.keys().next().value;

      if (oldestKey !== undefined) {
        cache.delete(oldestKey);
      }
    }

    cache.set(key, {
      countries,
      expiresAt: now() + cacheTtl,
    });
  }

  function subscribe(
    key: string,
    request: InFlightRequest,
    signal: AbortSignal,
  ): Promise<Country[]> {
    if (signal.aborted) {
      return Promise.reject(createAbortError());
    }

    request.consumers += 1;

    return new Promise((resolve, reject) => {
      let settled = false;

      function release(): void {
        signal.removeEventListener('abort', onAbort);

        request.consumers -= 1;

        if (request.consumers === 0 && inFlight.get(key) === request) {
          inFlight.delete(key);
          request.controller.abort();
        }
      }

      function onAbort(): void {
        if (settled) {
          return;
        }

        settled = true;
        release();
        reject(createAbortError());
      }

      signal.addEventListener('abort', onAbort, { once: true });

      request.promise.then(
        (countries) => {
          if (settled) {
            return;
          }

          settled = true;
          release();
          resolve(countries);
        },
        (error: unknown) => {
          if (settled) {
            return;
          }

          settled = true;
          release();
          reject(error);
        },
      );
    });
  }

  function searchCountries(query: string, signal: AbortSignal): Promise<Country[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return Promise.resolve([]);
    }

    if (signal.aborted) {
      return Promise.reject(createAbortError());
    }

    const key = normalizedQuery.toLocaleLowerCase();

    const cachedResult = getCachedResult(key);

    if (cachedResult !== null) {
      return Promise.resolve(cachedResult);
    }

    let request = inFlight.get(key);

    if (!request) {
      const controller = new AbortController();

      const newRequest: InFlightRequest = {
        controller,
        consumers: 0,
        promise: Promise.resolve([]),
      };

      newRequest.promise = Promise.resolve()
        .then(() => search(normalizedQuery, controller.signal))
        .then((countries) => {
          if (!controller.signal.aborted) {
            saveToCache(key, countries);
          }

          return countries;
        })
        .finally(() => {
          if (inFlight.get(key) === newRequest) {
            inFlight.delete(key);
          }
        });

      inFlight.set(key, newRequest);
      request = newRequest;
    }

    return subscribe(key, request, signal);
  }

  function clearCache(): void {
    cache.clear();
  }

  return {
    search: searchCountries,
    clearCache,
  };
}
