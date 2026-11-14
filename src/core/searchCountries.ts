import { HttpError } from './errors/httpError';
import { mapCountryResponse } from './mapCountryResponse';
import { Country, CountryResponse } from './types';

const API_URL = 'https://countries.dev/name/';
const DEFAULT_TIMEOUT = 10_000;

export async function searchCountries(
  query: string,
  signal: AbortSignal,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Country[]> {
  const timeoutSignal = AbortSignal.timeout(timeout);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

  const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, {
    signal: combinedSignal,
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }

    throw new HttpError(response.status, `Http error: ${response.statusText}`);
  }

  return (response.json() as Promise<CountryResponse[]>).then((resolve) =>
    resolve.map(mapCountryResponse),
  );
}
