import { debounce } from '../src/core/debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('does not call the function immediately', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('does not call the function immediately', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced();
    expect(mockFn).not.toHaveBeenCalled();
  });

  test('call the function after delay', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced();

    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('does not call the function before delay passed', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced();
    jest.advanceTimersByTime(299);
    expect(mockFn).not.toHaveBeenCalled();
  });

  test('reset timer on every call', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('callse function with last arguments', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced('s');
    debounced('sp');
    debounced('spain');

    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('spain');
  });
});
