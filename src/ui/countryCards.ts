import { mapCountryResponse } from '../core/mapCountryResponse';
import { CountryResponse } from '../core/types';
import { renderCard } from './countryCard';

export function renderCountryCards(countries: CountryResponse[]): HTMLElement[] {
  return countries.map((country) => renderCard(mapCountryResponse(country), country));
}
