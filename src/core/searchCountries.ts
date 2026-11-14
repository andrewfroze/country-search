import { HttpError } from './errors/httpError';
import { CountryResponse } from './types';

const API_URL = 'https://countries.dev/api/countries/name/';

export async function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<CountryResponse[]> {
  const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, {
    signal,
  });

  if (!response.ok) {
    throw new HttpError(response.status, `Http error: ${response.statusText}`);
  }

  return response.json() as Promise<CountryResponse[]>;
}
