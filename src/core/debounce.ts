export function debounce<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
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
