import { createElement } from './utils/elementFactory';

export function renderSearchHistory(
  queries: string[],
  onSelect: (query: string) => void,
  onClear: () => void,
): HTMLElement {
  const title = createElement('span', {
    className: 'search-history__title',
    textContent: 'Recent searches',
  });

  const items = createElement('div', {
    className: 'search-history__items',
  });

  for (const query of queries) {
    const button = createElement('button', {
      className: 'search-history__item',
      type: 'button',
      textContent: query,
    });

    button.setAttribute('aria-label', 'Search history');

    button.addEventListener('click', () => {
      onSelect(query);
    });

    items.append(button);
  }

  const clearButton = createElement('button', {
    className: 'search-history__clear',
    type: 'button',
    textContent: 'Clear history',
  });

  clearButton.addEventListener('click', onClear);

  return createElement(
    'div',
    {
      className: 'search-history__content',
    },
    [title, items, clearButton],
  );
}
