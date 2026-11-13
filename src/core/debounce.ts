export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): DebouncedFunction<Args> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, delay);
  };

  debounced.cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

export type DebouncedFunction<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
};
