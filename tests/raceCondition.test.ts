import { searchCountries } from '../src/core/searchCountries';
import { createMockResponse } from './createMockResponse';
import { mockCountries } from './mockCountries';

test('should handle race condition when newer request resolves first', async () => {
  const firstController = new AbortController();
  const secondController = new AbortController();

  const fetchMock = jest.spyOn(global, 'fetch');

  fetchMock
    .mockImplementationOnce(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal;

          if (!signal) return;

          signal.addEventListener('abort', () => reject(signal.reason), { once: true });
        }),
    )
    .mockResolvedValueOnce(createMockResponse(mockCountries, 200));

  const firstRequest = searchCountries('Spa', firstController.signal);
  const secondRequest = searchCountries('Spain', secondController.signal);

  firstController.abort();

  const secondResult = await secondRequest;

  await expect(firstRequest).rejects.toMatchObject({
    name: 'AbortError',
  });

  expect(secondResult).toEqual(mockCountries);
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
