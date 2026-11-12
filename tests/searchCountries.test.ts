import { searchCountries } from '../src/core/searchCountries';
import { CountryResponse } from '../src/core/types';
import { createMockResponse } from './createMockResponse';

describe('searchCountries', () => {
  const mockCountries: CountryResponse[] = [
    {
      area: 505992,
      cioc: 'ESP',
      flag: '🇪🇸',
      gini: 34.7,
      name: 'Spain',
      flags: {
        png: 'https://flagcdn.com/w320/es.png',
        svg: 'https://flagcdn.com/es.svg',
      },
      latlng: [40, -4],
      region: 'Europe',
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      capital: 'Madrid',
      demonym: 'Spanish',
      languages: [
        {
          name: 'Spanish',
          iso639_1: 'es',
          iso639_2: 'spa',
          nativeName: 'Español',
        },
      ],
      subregion: 'Southern Europe',
      timezones: ['UTC', 'UTC+01:00'],
      alpha2Code: 'ES',
      alpha3Code: 'ESP',
      currencies: [
        {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
        },
      ],
      nativeName: 'España',
      population: 47351567,
      independent: true,
      numericCode: '724',
      callingCodes: ['34'],
      topLevelDomain: ['.es'],
      populationDensity: 93.58,
    },
  ];

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

    await expect(searchCountries('Spain', signal)).rejects.toMatchObject({
      name: 'HttpError',
      status: 404,
    });
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
