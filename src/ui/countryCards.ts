import { Country } from '../core/types';
import { renderCard } from './countryCard';

export function renderCountryCards(countries: Country[]): HTMLElement[] {
  return countries.map((country) => renderCard(country));
}
