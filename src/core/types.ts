export interface CountryResponse {
  area: number;
  cioc: string;
  flag: string;
  gini: number;
  name: string;
  flags: {
    png: string;
    svg: string;
  };
  latlng: [number, number];
  region: string;
  borders: string[];
  capital: string;
  demonym: string;
  languages: {
    name: string;
    iso639_1: string;
    iso639_2: string;
    nativeName: string;
  }[];
  subregion: string;
  timezones: string[];
  alpha2Code: string;
  alpha3Code: string;
  currencies: {
    code: string;
    name: string;
    symbol: string;
  }[];
  nativeName: string;
  population: number;
  independent: boolean;
  numericCode: string;
  callingCodes: string[];
  topLevelDomain: string[];
  populationDensity: number;
}
