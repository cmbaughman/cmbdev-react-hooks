import { renderHook, act } from '@testing-library/react';
import useDebounce from '../src/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce the value by the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('updated');
  });

  it('should only return the latest value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'update1', delay: 500 });
    rerender({ value: 'update2', delay: 500 });
    rerender({ value: 'update3', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('update3');
  });

    it('should properly clear timeout on unmount', () => {
        const { result, rerender, unmount } = renderHook(
          ({ value, delay }) => useDebounce(value, delay),
          { initialProps: { value: 'initial', delay: 500 } }
        );

        rerender({ value: 'update1', delay: 500 });

        unmount()

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current).toBe('initial');
      });
});