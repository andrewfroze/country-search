import { mapCountryResponse } from '../src/core/mapCountryResponse';
import type { CountryResponse, Country } from '../src/core/types';

const mockCountryResponse: CountryResponse = {
  area: 505990,
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
  borders: ['AND', 'FRA', 'GIB', 'PRT'],
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
  populationDensity: 93.5,
};

describe('mapCountryResponse', () => {
  test('should map all required fields from API response', () => {
    const expected: Country = {
      name: 'Spain',
      flag: 'https://flagcdn.com/es.svg',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: [
        {
          name: 'Spanish',
          iso639_1: 'es',
          iso639_2: 'spa',
          nativeName: 'Español',
        },
      ],
    };

    expect(mapCountryResponse(mockCountryResponse)).toEqual(expected);
  });

  test('should preserve multiple languages', () => {
    const raw: CountryResponse = {
      ...mockCountryResponse,
      languages: [
        {
          name: 'German',
          iso639_1: 'de',
          iso639_2: 'deu',
          nativeName: 'Deutsch',
        },
        {
          name: 'French',
          iso639_1: 'fr',
          iso639_2: 'fra',
          nativeName: 'Français',
        },
      ],
    };

    const result = mapCountryResponse(raw);

    expect(result.languages).toEqual(raw.languages);
    expect(result.languages).toHaveLength(2);
  });

  test('should handle an empty languages array', () => {
    const raw: CountryResponse = {
      ...mockCountryResponse,
      languages: [],
    };

    expect(mapCountryResponse(raw).languages).toEqual([]);
  });

  test('should not mutate the original API response', () => {
    const raw = structuredClone(mockCountryResponse);
    const original = structuredClone(raw);

    mapCountryResponse(raw);

    expect(raw).toEqual(original);
  });

  test('should return only fields required by Country interface', () => {
    const result = mapCountryResponse(mockCountryResponse);

    expect(Object.keys(result).sort()).toEqual(
      ['name', 'flag', 'capital', 'region', 'population', 'languages'].sort(),
    );
  });

  it('should return a new object instead of the original response', () => {
    const result = mapCountryResponse(mockCountryResponse);

    expect(result).not.toBe(mockCountryResponse);
  });
});
