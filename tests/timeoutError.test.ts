import { searchCountries } from '../src/core/searchCountries';

describe('TimeoutError', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should propagate TimeoutError when request times out', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), {
            once: true,
          });
        }),
    );

    await expect(searchCountries('Spain', new AbortController().signal, 100)).rejects.toMatchObject(
      {
        name: 'TimeoutError',
      },
    );
  });
});
