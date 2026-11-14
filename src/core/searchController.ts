import type { Country } from './types';

type SearchFunction = (query: string, signal: AbortSignal, timeout?: number) => Promise<Country[]>;

interface SearchControllerOptions {
  search: SearchFunction;
  onLoading: () => void;
  onSuccess: (countries: Country[]) => void;
  onError: (error: unknown) => void;
}

export function createSearchController({
  search,
  onLoading,
  onSuccess,
  onError,
}: SearchControllerOptions) {
  let requestId = 0;
  let abortController: AbortController | null = null;

  async function run(query: string): Promise<void> {
    const currentRequestId = ++requestId;

    abortController?.abort();

    const controller = new AbortController();
    abortController = controller;

    onLoading();

    try {
      const countries = await search(query, controller.signal);

      if (currentRequestId !== requestId) return;

      onSuccess(countries);
    } catch (error) {
      if (currentRequestId !== requestId) return;

      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      onError(error);
    } finally {
      if (currentRequestId === requestId) {
        abortController = null;
      }
    }
  }

  function cancel(): void {
    requestId += 1;
    abortController?.abort();
    abortController = null;
  }

  return { run, cancel };
}
