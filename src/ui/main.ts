import { debounce } from '../core/debounce';
import { searchCountries } from '../core/searchCountries';
import { createSearchController } from '../core/searchController';
import { createElement } from './utils/elementFactory';
import {
  fillCountryCards,
  showError,
  showLoader,
  showNoResults,
  showStartMessage,
} from './searchResults';

const DEFAULT_DEBOUNCE_DELAY = 500;

let lastQuery = '';

const countryCardsContainer = createElement('section', {
  className: 'search-result',
});

const searchController = createSearchController({
  search: searchCountries,

  onLoading: () => {
    showLoader(countryCardsContainer);
  },

  onSuccess: (countries) => {
    if (countries.length === 0) {
      showNoResults(countryCardsContainer);
      return;
    }

    fillCountryCards(countryCardsContainer, countries);
  },

  onError: () => {
    showError(countryCardsContainer, () => {
      if (lastQuery) {
        void searchController.run(lastQuery);
      }
    });
  },
});

const debouncedSearchCountries = debounce((query: string) => {
  void searchController.run(query);
}, DEFAULT_DEBOUNCE_DELAY);

const searchInput = createElement('input', {
  className: 'search-input',
  placeholder: 'Type country name',
});

searchInput.addEventListener('input', () => {
  searchController.cancel();

  lastQuery = searchInput.value.trim();

  if (!lastQuery) {
    debouncedSearchCountries.cancel();
    showStartMessage(countryCardsContainer);
    return;
  }

  debouncedSearchCountries(lastQuery);
});

showStartMessage(countryCardsContainer);

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
