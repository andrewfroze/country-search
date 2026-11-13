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
  languages: CountryLanguage[];
  subregion: string;
  timezones: string[];
  alpha2Code: string;
  alpha3Code: string;
  currencies: Currency[];
  nativeName: string;
  population: number;
  independent: boolean;
  numericCode: string;
  callingCodes: string[];
  topLevelDomain: string[];
  populationDensity: number;
}

export interface Country {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  area: number;
  borders: string[];
  languages: CountryLanguage[];
  currencies: string[];
}

export interface CountryLanguage {
  name: string;
  iso639_1: string;
  iso639_2: string;
  nativeName: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}
