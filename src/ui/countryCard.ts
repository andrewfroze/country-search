import { type Country } from '../core/types';
import { createElement } from './utils/elementFactory';

export function renderCard(country: Country): HTMLElement {
  const card = createElement('article', {
    className: 'country-card',
  });

  card.style.setProperty('--country-flag', `url("${country.flag}")`);

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
        className: 'county-card__title__flag',
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
        title: `Capital`,
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

  if (country.languages && country.languages.length > 0) {
    content.append(
      createElement(
        'ul',
        {
          className: 'country-card__languages',
          textContent: '🗣️',
          title: 'Languages',
        },
        [
          ...country.languages.map((language) =>
            createElement('li', {
              className: 'country-card__languages__item',
              textContent: language.name,
            }),
          ),
        ],
      ),
    );
  }

  card.append(content);

  return card;
}
