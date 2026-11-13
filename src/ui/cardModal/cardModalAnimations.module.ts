export const ANIMATION_DURATION = 500;
export const FLIP_DURATION = 700;

export const ANIMATION_EASING = 'linear';
export const FLIP_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

export function animateHeight(element: HTMLElement, from: number, to: number): Promise<void> {
  const animation = element.animate([{ height: `${from}px` }, { height: `${to}px` }], {
    duration: ANIMATION_DURATION,
    easing: ANIMATION_EASING,
    fill: 'forwards',
  });

  return animation.finished.then(() => {
    element.style.height = `${to}px`;
    animation.cancel();
  });
}

export function animateFlip(inner: HTMLElement, from: number, to: number): Promise<void> {
  const animation = inner.animate(
    [{ transform: `rotateY(${from}deg)` }, { transform: `rotateY(${to}deg)` }],
    {
      duration: FLIP_DURATION,
      easing: FLIP_EASING,
      fill: 'forwards',
    },
  );

  return animation.finished.then(() => {
    animation.cancel();
  });
}

export function animateOpacity(
  element: HTMLElement,
  from: number,
  to: number,
  duration: number,
): Promise<void> {
  element.style.opacity = String(from);

  const animation = element.animate([{ opacity: from }, { opacity: to }], {
    duration,
    easing: ANIMATION_EASING,
    fill: 'forwards',
  });

  return animation.finished.then(() => {
    element.style.opacity = String(to);
    animation.cancel();
  });
}
