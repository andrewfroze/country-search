import { searchCountries } from '../src/core/searchCountries';

it('should propagate AbortError when request is aborted', async () => {
  const controller = new AbortController();

  jest.spyOn(global, 'fetch').mockImplementation(
    (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;

        if (!signal) return;

        signal.addEventListener('abort', () => reject(signal.reason), { once: true });
      }),
  );

  const promise = searchCountries('Spain', controller.signal);

  controller.abort();

  await expect(promise).rejects.toMatchObject({
    name: 'AbortError',
  });
});
