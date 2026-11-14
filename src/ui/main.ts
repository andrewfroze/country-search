import { debounce } from '../core/debounce';
import { searchCountries } from '../core/searchCountries';
import { createCountrySearchService } from '../core/countrySearchService';
import { createSearchController } from '../core/searchController';
import { addSearchHistory, clearSearchHistory, getSearchHistory } from '../core/searchHistory';
import { createElement } from './utils/elementFactory';
import { renderSearchHistory } from './searchHistory';
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

const searchInput = createElement('input', {
  className: 'search-input',
  placeholder: 'Type country name',
  type: 'search',
});

const historyContainer = createElement('nav', {
  className: 'search-history',
});

historyContainer.setAttribute('aria-label', 'Search history');

const countrySearchService = createCountrySearchService(searchCountries);

const searchController = createSearchController({
  search: countrySearchService.search,

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

function updateSearchHistory(): void {
  const history = getSearchHistory();

  historyContainer.replaceChildren();

  if (history.length === 0) {
    return;
  }

  historyContainer.append(
    renderSearchHistory(
      history,
      (query) => {
        debouncedSearchCountries.cancel();
        searchController.cancel();

        searchInput.value = query;
        lastQuery = query;

        runSearch(query);
      },
      () => {
        clearSearchHistory();
        updateSearchHistory();
      },
    ),
  );
}

function runSearch(query: string): void {
  lastQuery = query;

  addSearchHistory(query);
  updateSearchHistory();

  void searchController.run(query);
}

const debouncedSearchCountries = debounce((query: string) => {
  runSearch(query);
}, DEFAULT_DEBOUNCE_DELAY);

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
updateSearchHistory();

document.body.append(
  createElement('header', {}, [
    createElement('h1', {
      className: 'title',
      textContent: 'Country search',
    }),
  ]),
  createElement('main', {}, [searchInput, historyContainer, countryCardsContainer]),
  createElement('footer', {}),
);
