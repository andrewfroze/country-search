import { HttpError } from './errors/httpError';
import { CountryResponse } from './types';

const API_URL = 'https://countries.dev/api/countries/name/';
const TIMEOUT = 10_000;

export async function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<CountryResponse[]> {
  const timeoutSignal = AbortSignal.timeout(TIMEOUT);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

  const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, {
    signal: combinedSignal,
  });

  if (!response.ok) {
    throw new HttpError(response.status, `Http error: ${response.statusText}`);
  }

  return response.json() as Promise<CountryResponse[]>;
}
