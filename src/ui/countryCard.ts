import { CountryResponse, type Country } from '../core/types';
import { openCardModal } from './cardModal';
import { renderCountryDetails } from './countryDetails';
import { createElement } from './utils/elementFactory';

export function renderCard(countryCard: Country, countryDetails: CountryResponse): HTMLElement {
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

  if (countryCard.flag) {
    countryCardTitle.append(
      createElement('img', {
        className: 'country-card__title__flag',
        src: countryCard.flag,
      }),
    );
  }

  if (countryCard.name) {
    countryCardTitle.append(countryCard.name);
  }

  if (countryCard.capital) {
    content.append(
      createElement('label', {
        className: 'country-card__capital',
        textContent: `🏦 ${countryCard.capital}`,
        title: 'Capital',
      }),
    );
  }

  if (countryCard.region) {
    content.append(
      createElement('label', {
        className: 'country-card__region',
        textContent: `🌎 ${countryCard.region}`,
        title: 'Region',
      }),
    );
  }

  if (countryCard.population) {
    content.append(
      createElement('label', {
        className: 'country-card__population',
        textContent: `👥 ${countryCard.population.toLocaleString('en-US')}`,
        title: 'Population',
      }),
    );
  }

  front.append(content);
  inner.append(front);
  card.append(inner);

  card.addEventListener('click', () => {
    const details = renderCountryDetails(countryDetails);
    void openCardModal(card, details);
  });

  return card;
}
