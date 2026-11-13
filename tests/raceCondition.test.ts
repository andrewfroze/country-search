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

test('should ignore outdated response when newer request resolves first', async () => {
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
