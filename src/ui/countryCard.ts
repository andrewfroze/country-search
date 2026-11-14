import { type Country } from '../core/types';
import { openCardModal } from './cardModal';
import { renderCountryDetails } from './countryDetails';
import { createElement } from './utils/elementFactory';

export function renderCard(country: Country): HTMLElement {
  const card = createElement('article', {
    className: 'country-card',
  });

  const inner = createElement('div', {
    className: 'country-card__inner',
  });

  const front = createElement('div', {
    className: 'country-card__face country-card__front',
  });

  const content = createElement('div', {
    className: 'country-card__content',
  });

  const countryCardTitle = createElement('h2', {
    className: 'country-card__title',
  });

  content.append(countryCardTitle);

  if (country.flag) {
    countryCardTitle.append(
      createElement('img', {
        className: 'country-card__title__flag',
        src: country.flag,
      }),
    );
  }

  if (country.name) {
    countryCardTitle.append(country.name);
  }

  if (country.capital) {
    content.append(
      createElement('label', {
        className: 'country-card__capital',
        textContent: `🏦 ${country.capital}`,
        title: 'Capital',
      }),
    );
  }

  if (country.region) {
    content.append(
      createElement('label', {
        className: 'country-card__region',
        textContent: `🌎 ${country.region}`,
        title: 'Region',
      }),
    );
  }

  if (country.population) {
    content.append(
      createElement('label', {
        className: 'country-card__population',
        textContent: `👥 ${country.population.toLocaleString('en-US')}`,
        title: 'Population',
      }),
    );
  }

  front.append(content);
  inner.append(front);
  card.append(inner);

  card.addEventListener('click', () => {
    const details = renderCountryDetails(country);
    void openCardModal(card, details);
  });

  return card;
}
