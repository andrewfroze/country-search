import { createElement } from './utils/elementFactory';

export function renderLoader(): HTMLElement {
  return createElement(
    'div',
    {
      className: 'loader',
      role: 'status',
      ariaLabel: 'Loading countries',
    },
    [
      createElement('span', {
        className: 'loader__spinner',
      }),
      createElement('span', {
        className: 'loader__text',
        textContent: 'Loading countries...',
      }),
    ],
  );
}
