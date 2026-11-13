/**
 * @jest-environment jsdom
 */

import { createSearchController } from '../src/core/searchController';
import type { Country } from '../src/core/types';
import { mockCountriesDto } from './mockCountries';

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function createAbortError(): DOMException {
  return new DOMException('The operation was aborted', 'AbortError');
}

describe('search controller race condition', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    if (originalFetch) {
      Object.defineProperty(globalThis, 'fetch', {
        configurable: true,
        writable: true,
        value: originalFetch,
      });
    } else {
      delete (globalThis as { fetch?: typeof fetch }).fetch;
    }

    jest.restoreAllMocks();
  });

  test('should abort outdated request and render only the latest response', async () => {
    const secondResponse = createDeferred<Response>();

    let firstSignal: AbortSignal | undefined;

    const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(
      (_input, init) => {
        const signal = init?.signal as AbortSignal;

        if (fetchMock.mock.calls.length === 1) {
          firstSignal = signal;

          return new Promise<Response>((_, reject) => {
            const rejectOnAbort = () => {
              reject(createAbortError());
            };

            if (signal.aborted) {
              rejectOnAbort();
              return;
            }

            signal.addEventListener('abort', rejectOnAbort, {
              once: true,
            });
          });
        }

        return secondResponse.promise;
      },
    );

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

    const container = document.createElement('section');
    document.body.append(container);

    const onSuccess = jest.fn((countries: Country[]) => {
      container.replaceChildren(
        ...countries.map((country) => {
          const card = document.createElement('article');

          card.className = 'country-card';
          card.textContent = country.name;

          return card;
        }),
      );
    });

    const onError = jest.fn();

    const controller = createSearchController({
      search: async (query, signal) => {
        const response = await fetch(`/countries/${query}`, {
          signal,
        });

        return response.json() as Promise<Country[]>;
      },
      onLoading: jest.fn(),
      onSuccess,
      onError,
    });

    const firstRequest = controller.run('Spa');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(firstSignal).toBeDefined();
    expect(firstSignal?.aborted).toBe(false);

    const secondRequest = controller.run('Spain');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(firstSignal?.aborted).toBe(true);

    secondResponse.resolve({
      ok: true,
      json: async () => mockCountriesDto,
    } as Response);

    await Promise.all([firstRequest, secondRequest]);

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(mockCountriesDto);

    expect(onError).not.toHaveBeenCalled();

    const renderedCards = container.querySelectorAll('.country-card');

    expect(renderedCards).toHaveLength(1);
    expect(renderedCards[0].textContent).toBe('Spain');
  });

  test('should ignore outdated response even when the request cannot be aborted', async () => {
    const firstResponse = createDeferred<Country[]>();
    const secondResponse = createDeferred<Country[]>();

    const searchMock = jest.fn((query: string) => {
      return query === 'Spa' ? firstResponse.promise : secondResponse.promise;
    });

    const onSuccess = jest.fn();
    const onLoading = jest.fn();
    const onError = jest.fn();

    const controller = createSearchController({
      search: searchMock,
      onLoading,
      onSuccess,
      onError,
    });

    const firstRequest = controller.run('Spa');
    const secondRequest = controller.run('Spain');

    secondResponse.resolve(mockCountriesDto);
    await secondRequest;

    firstResponse.resolve([]);

    await firstRequest;

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(mockCountriesDto);

    expect(onError).not.toHaveBeenCalled();
    expect(onLoading).toHaveBeenCalledTimes(2);
  });
});
