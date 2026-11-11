export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
