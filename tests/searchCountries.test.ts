import { searchCountries } from '../src/core/searchCountries';
import { createMockResponse } from './createMockResponse';
import { mockCountries } from './mockCountries';

describe('searchCountries', () => {
  const signal = new AbortController().signal;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return countries when response is successful', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(createMockResponse(mockCountries, 200));

    const result = await searchCountries('Spain', signal);

    expect(result).toEqual(mockCountries);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should pass query and abort signal to fetch', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(createMockResponse(mockCountries, 200));

    await searchCountries('Spain', signal);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('Spain'),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  test('should throw HttpError when response code is 4xx', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Country not found',
    } as Response);

    await expect(searchCountries('Spain', signal)).resolves.toMatchObject([]);
  });

  test('should throw HttpError when response code is 5xx', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(searchCountries('Spain', signal)).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    });
  });
});
