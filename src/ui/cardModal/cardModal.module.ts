import { createElement } from '../utils/elementFactory';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  animateFlip,
  animateHeight,
  animateOpacity,
} from './cardModalAnimations.module';

const OVERLAY_DURATION = 500;
const MODAL_VERTICAL_MARGIN = 48;

const dialog = createElement('dialog', {
  className: 'country-dialog',
});

document.body.append(dialog);

let activeCard: HTMLElement | null = null;
let activeDetails: HTMLElement | null = null;
let placeholder: HTMLElement | null = null;
let originalParent: HTMLElement | null = null;
let originalStyle: string | null = null;
let overlay: HTMLElement | null = null;

let modalHeight = 0;
let isAnimating = false;

export async function openCardModal(card: HTMLElement, details: HTMLElement): Promise<void> {
  if (activeCard || isAnimating) return;

  const inner = card.querySelector<HTMLElement>('.country-card__inner');
  const parent = card.parentElement;

  if (!inner || !parent) return;

  const originalWidth = card.offsetWidth;
  const originalHeight = card.offsetHeight;

  if (!originalWidth || !originalHeight) return;

  isAnimating = true;

  activeCard = card;
  activeDetails = details;
  originalParent = parent;
  originalStyle = card.getAttribute('style');

  lockPageScroll();

  placeholder = createElement('div', {
    className: 'country-card-placeholder',
    style: {
      width: `${originalWidth}px`,
      height: `${originalHeight}px`,
      flex: `0 0 ${originalWidth}px`,
    },
  });

  parent.insertBefore(placeholder, card);

  const originalRect = placeholder.getBoundingClientRect();
  const aspectRatio = originalRect.width / originalRect.height;

  card.style.setProperty('--card-aspect-ratio', String(aspectRatio));

  overlay = createElement('div', {
    className: 'country-dialog__overlay',
  });

  dialog.append(overlay);

  inner.append(details);

  dialog.append(card);
  dialog.showModal();

  card.classList.add('is-modal');

  const modalRect = card.getBoundingClientRect();
  modalHeight = modalRect.height;

  const dx = originalRect.left + originalRect.width / 2 - (modalRect.left + modalRect.width / 2);

  const dy = originalRect.top + originalRect.height / 2 - (modalRect.top + modalRect.height / 2);

  try {
    await animateCardOpening(card, inner, overlay, dx, dy, originalRect, modalRect);

    await expandCardIfNeeded(card, details, modalHeight);
  } finally {
    isAnimating = false;
  }
}

export async function closeCardModal(): Promise<void> {
  if (!activeCard || !activeDetails || !placeholder || !originalParent || !overlay || isAnimating) {
    return;
  }

  isAnimating = true;

  const card = activeCard;
  const details = activeDetails;
  const currentPlaceholder = placeholder;
  const currentParent = originalParent;
  const currentOverlay = overlay;

  const inner = card.querySelector<HTMLElement>('.country-card__inner');

  if (!inner) {
    isAnimating = false;
    return;
  }

  try {
    await animateCardClosing(card, inner, currentPlaceholder, currentOverlay);

    currentParent.insertBefore(card, currentPlaceholder);
    currentPlaceholder.remove();

    card.classList.remove('is-modal');

    if (originalStyle === null) {
      card.removeAttribute('style');
    } else {
      card.setAttribute('style', originalStyle);
    }

    details.remove();
    currentOverlay.remove();

    dialog.close();
  } finally {
    unlockPageScroll();
    resetModalState();
  }
}

async function animateCardOpening(
  card: HTMLElement,
  inner: HTMLElement,
  currentOverlay: HTMLElement,
  dx: number,
  dy: number,
  originalRect: DOMRect,
  modalRect: DOMRect,
): Promise<void> {
  const moveAnimation = card.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px)`,
        width: `${originalRect.width}px`,
        height: `${originalRect.height}px`,
      },
      {
        transform: 'translate(0, 0)',
        width: `${modalRect.width}px`,
        height: `${modalRect.height}px`,
      },
    ],
    {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
      fill: 'forwards',
    },
  );

  card.classList.add('is-flipped');

  await Promise.all([
    moveAnimation.finished,
    animateFlip(inner, 0, 180),
    animateOpacity(currentOverlay, 0, 1, OVERLAY_DURATION),
  ]);

  moveAnimation.cancel();
}

async function animateCardClosing(
  card: HTMLElement,
  inner: HTMLElement,
  currentPlaceholder: HTMLElement,
  currentOverlay: HTMLElement,
): Promise<void> {
  const currentHeight = card.getBoundingClientRect().height;

  if (card.classList.contains('is-expanded')) {
    await animateHeight(card, currentHeight, modalHeight);

    card.classList.remove('is-expanded');
    card.style.removeProperty('height');

    void card.offsetHeight;
  }

  const currentRect = card.getBoundingClientRect();
  const targetRect = currentPlaceholder.getBoundingClientRect();

  const dx = targetRect.left + targetRect.width / 2 - (currentRect.left + currentRect.width / 2);

  const dy = targetRect.top + targetRect.height / 2 - (currentRect.top + currentRect.height / 2);

  const moveAnimation = card.animate(
    [
      {
        transform: 'translate(0, 0)',
        width: `${currentRect.width}px`,
        height: `${currentRect.height}px`,
      },
      {
        transform: `translate(${dx}px, ${dy}px)`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
      },
    ],
    {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
      fill: 'forwards',
    },
  );

  card.classList.remove('is-flipped');

  await Promise.all([
    moveAnimation.finished,
    animateFlip(inner, 180, 0),
    animateOpacity(currentOverlay, 1, 0, OVERLAY_DURATION),
  ]);

  moveAnimation.cancel();
}

async function expandCardIfNeeded(
  card: HTMLElement,
  details: HTMLElement,
  initialHeight: number,
): Promise<void> {
  const columns = details.querySelectorAll<HTMLElement>('.country-card__details__column');

  const overflow = Math.max(
    0,
    ...Array.from(columns, (column) => column.scrollHeight - column.clientHeight),
  );

  if (!overflow) return;

  const maxHeight = window.innerHeight - MODAL_VERTICAL_MARGIN;
  const targetHeight = Math.min(initialHeight + overflow, maxHeight);

  if (targetHeight <= initialHeight) return;

  card.classList.add('is-expanded');

  await animateHeight(card, initialHeight, targetHeight);
}

function resetModalState(): void {
  activeCard = null;
  activeDetails = null;
  placeholder = null;
  originalParent = null;
  originalStyle = null;
  overlay = null;
  modalHeight = 0;
  isAnimating = false;
}

function lockPageScroll(): void {
  document.body.classList.add('modal-open');
}

function unlockPageScroll(): void {
  document.body.classList.remove('modal-open');
}

dialog.addEventListener('click', (event: MouseEvent) => {
  if (event.target === overlay || event.target === dialog) {
    void closeCardModal();
  }
});

dialog.addEventListener('cancel', (event: Event) => {
  event.preventDefault();
  void closeCardModal();
});

dialog.addEventListener('close', unlockPageScroll);
