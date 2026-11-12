import { Country, CountryResponse } from './types';

export function mapCountryResponse(countryResponse: CountryResponse): Country {
  return {
    name: countryResponse.name,
    flag: countryResponse.flag,
    capital: countryResponse.capital,
    region: countryResponse.region,
    population: countryResponse.population,
    languages: countryResponse.languages,
  };
}
