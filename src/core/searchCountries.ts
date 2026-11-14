import { Country } from './types';

const API_URL = 'https://countries.dev/api/countries/name/';

export async function searchCountries(query: string, signal: AbortSignal): Promise<Country[]> {
  const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, {
    signal,
  });

  return response.json() as Promise<Country[]>;
}
