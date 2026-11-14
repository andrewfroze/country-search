import { Country, CountryResponse } from './types';

export function mapCountryResponse(countryResponse: CountryResponse): Country {
  return {
    name: countryResponse.name,
    flag: countryResponse.flags?.svg,
    capital: countryResponse.capital,
    region: countryResponse.region,
    population: countryResponse.population,
    area: countryResponse.area,
    borders: countryResponse.borders,
    languages: countryResponse.languages,
    currencies: countryResponse.currencies?.map((currency) => currency.name),
  };
}
