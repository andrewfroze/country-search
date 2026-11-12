import { debounce } from '../core/debounce';
import { mapCountryResponse } from '../core/mapCountryResponse';
import { searchCountries } from '../core/searchCountries';
import { createElement } from './utils/elementFactory';
import { HttpError } from '../core/errors/httpError';
import {
  clearCountryCards,
  fillCountryCards,
  showError,
  showLoader,
  showNoResults,
} from './searchResults';

const DEFAULT_DEBOUNCE_DELAY = 1000;
const DEFAULT_TIMEOUT = 10_000;

let abortController: AbortController | null = null;
let lastQuery = '';
let requestId = 0;

async function runSearch(query: string): Promise<void> {
  const currentRequestId = ++requestId;

  abortController?.abort();

  const controller = new AbortController();
  abortController = controller;

  showLoader(countryCardsContainer);

  try {
    const response = await searchCountries(query, controller.signal, DEFAULT_TIMEOUT);

    if (currentRequestId !== requestId) return;

    const countries = response.map(mapCountryResponse);

    if (countries.length === 0) {
      showNoResults(countryCardsContainer);
      return;
    }

    fillCountryCards(countryCardsContainer, countries);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return;
    }

    if (currentRequestId !== requestId) return;

    if (error instanceof HttpError && error.status === 404) {
      showNoResults(countryCardsContainer);
      return;
    }

    showError(countryCardsContainer, () => {
      if (lastQuery) {
        runSearch(lastQuery);
      }
    });
  } finally {
    if (currentRequestId === requestId) {
      abortController = null;
    }
  }
}

const debouncedSearchCountries = debounce((query: string) => {
  void runSearch(query);
}, DEFAULT_DEBOUNCE_DELAY);

const searchInput = createElement('input', {
  className: 'search-input',
  placeholder: 'Type country name',
});

searchInput.addEventListener('input', () => {
  requestId += 1;
  abortController?.abort();
  abortController = null;

  lastQuery = searchInput.value.trim();

  if (!lastQuery) {
    clearCountryCards(countryCardsContainer);
    return;
  }

  debouncedSearchCountries(searchInput.value);
});

const countryCardsContainer = createElement('section', { className: 'search-result' });

document.body.append(
  createElement('header', {}, [
    createElement('h1', {
      className: 'title',
      textContent: 'Country search',
    }),
  ]),
  createElement('main', {}, [searchInput, countryCardsContainer]),
  createElement('footer', {}),
);
