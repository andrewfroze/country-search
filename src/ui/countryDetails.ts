import { Country } from '../core/types';
import { closeCardModal } from './cardModal';
import { createElement } from './utils/elementFactory';

export function renderCountryDetails(country: Country): HTMLElement {
  const detailsContainer = createElement('div', {
    className: 'country-card__face country-card__back country-card__details',
  });

  const details = createElement('div', {
    className: 'country-card__details__column',
  });

  const detailsContent = createElement('div', {
    className: 'country-card__details__content',
  });

  const closeButton = createElement('button', {
    className: 'country-card__details__close',
    type: 'button',
  });

  closeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    closeCardModal();
  });

  detailsContainer.append(
    closeButton,
    createElement('h2', {
      className: 'country-card__details__title',
      textContent: country.name,
    }),
    detailsContent,
  );

  if (country.flag) {
    detailsContent.append(
      createElement('img', {
        className: 'country-card__details__flag',
        src: country.flag,
      }),
    );
  }

  detailsContent.append(details);

  if (country.capital) {
    details.append(
      createElement(
        'p',
        {
          className: 'country-card__details__capital',
          textContent: 'Capital: ',
          title: 'Capital',
        },
        [
          createElement('b', {
            textContent: country.capital,
          }),
        ],
      ),
    );
  }

  if (country.region) {
    details.append(
      createElement(
        'p',
        {
          className: 'country-card__details__region',
          textContent: 'Region: ',
          title: 'Region',
        },
        [
          createElement('b', {
            textContent: country.region,
          }),
        ],
      ),
    );
  }

  if (country.area) {
    details.append(
      createElement(
        'p',
        {
          className: 'country-card__details__area',
          textContent: 'Area: ',
          title: 'Area',
        },
        [
          createElement('b', {
            textContent: country.area.toLocaleString('en-US'),
          }),
        ],
      ),
    );
  }

  if (country.population) {
    details.append(
      createElement(
        'p',
        {
          className: 'country-card__details__population',
          textContent: 'Population: ',
          title: 'Population',
        },
        [
          createElement('b', {
            textContent: country.population.toLocaleString('en-US'),
          }),
        ],
      ),
    );
  }

  if (country.borders?.length) {
    details.append(
      createElement(
        'ul',
        {
          className: 'country-card__details__borders',
          textContent: 'Borders:',
          title: 'Borders',
        },
        country.borders.map((border) =>
          createElement('li', {
            className: 'country-card__details__borders__item',
            textContent: border,
          }),
        ),
      ),
    );
  }

  if (country.languages?.length) {
    details.append(
      createElement(
        'ul',
        {
          className: 'country-card__details__languages',
          textContent: 'Languages:',
          title: 'Languages',
        },
        country.languages.map((language) =>
          createElement('li', {
            className: 'country-card__details__languages__item',
            textContent: language.name,
          }),
        ),
      ),
    );
  }

  if (country.currencies?.length) {
    details.append(
      createElement(
        'ul',
        {
          className: 'country-card__details__currencies',
          textContent: 'Currencies:',
          title: 'Currencies',
        },
        country.currencies.map((currency) =>
          createElement('li', {
            className: 'country-card__details__currencies__item',
            textContent: currency,
          }),
        ),
      ),
    );
  }

  detailsContainer.classList.add(
    'country-card__face',
    'country-card__back',
    'country-card__details',
  );

  return detailsContainer;
}
