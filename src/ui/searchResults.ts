import { Country } from '../core/types';
import { createElement } from './utils/elementFactory';
import { renderCountryCards } from './countryCards';
import { renderLoader } from './loader';

export function showLoader(countryCardsContainer: HTMLElement): void {
  countryCardsContainer.replaceChildren(renderLoader());
}

export function fillCountryCards(countryCardsContainer: HTMLElement, countries: Country[]): void {
  countryCardsContainer.replaceChildren(...renderCountryCards(countries));
}

export function showNoResults(countryCardsContainer: HTMLElement): void {
  countryCardsContainer.replaceChildren(
    createElement('p', {
      className: 'empty-message',
      textContent: 'No countries found. Try another search.',
    }),
  );
}

export function showError(countryCardsContainer: HTMLElement, runSearch: () => void): void {
  const message = createElement('p', {
    className: 'error-message',
    textContent: 'Something went wrong. Please try again.',
  });

  const retryButton = createElement('button', {
    className: 'retry-button',
    textContent: 'Retry',
  });

  retryButton.addEventListener('click', runSearch);

  countryCardsContainer.replaceChildren(
    createElement(
      'div',
      {
        className: 'error-container',
      },
      [message, retryButton],
    ),
  );
}

export function clearCountryCards(countryCardsContainer: HTMLElement): void {
  countryCardsContainer.replaceChildren();
}
