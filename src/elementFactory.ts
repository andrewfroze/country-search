type ElementAttributes<K extends keyof HTMLElementTagNameMap> = Omit<
  Partial<HTMLElementTagNameMap[K]>,
  'style'
> & {
  style?: Partial<CSSStyleDeclaration>;
};

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes: ElementAttributes<K>,
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  const { style, ...restAttributes } = attributes;

  Object.assign(element, restAttributes);
  Object.assign(element.style, style);

  element.append(...children);

  return element;
}
