import { debounce } from './core/debounce';
import { mapCountryResponse } from './core/mapCountryResponse';
import { searchCountries } from './core/searchCountries';
import { createElement } from './elementFactory';
import { renderCountryCards } from './ui/countryCards';
import { type Country } from './core/types';

const DEFAULT_DEBOUNCE_DELAY = 1000;
const DEFAULT_TIMEOUT = 10_000;
let abortController: AbortController | null = null;

const debouncedSearchCountries = debounce(async (query: string) => {
  abortController?.abort();

  abortController = new AbortController();

  try {
    const response = await searchCountries(query, abortController.signal, DEFAULT_TIMEOUT);

    const countries = response.map(mapCountryResponse);

    fillCountryCards(countries);

    return countries;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return;
    }

    throw error;
  }
}, DEFAULT_DEBOUNCE_DELAY);

const searchInput = createElement('input', {
  className: 'search-input',
  placeholder: 'Type country name',
});

searchInput.addEventListener('input', () => {
  if (searchInput.value === '') {
    clearCountryCards();
    return;
  }

  debouncedSearchCountries(searchInput.value);
});

const countryCardsContainer = createElement('section', { className: 'country-cards' });

function fillCountryCards(countries: Country[]) {
  countryCardsContainer.replaceChildren(...renderCountryCards(countries));
}

function clearCountryCards() {
  countryCardsContainer.replaceChildren();
}

document.body.append(searchInput, countryCardsContainer);
