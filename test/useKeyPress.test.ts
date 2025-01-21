import { renderHook, act } from '@testing-library/react';
import useKeyPress from '../src/useKeyPress';

describe('useKeyPress', () => {
  it('should return true when the target key is pressed', () => {
    const { result } = renderHook(() => useKeyPress('a'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });

    expect(result.current).toBe(true);
  });

  it('should return false when a different key is pressed', () => {
    const { result } = renderHook(() => useKeyPress('a'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    });

    expect(result.current).toBe(false);
  });

  it('should return false when the target key is released', () => {
    const { result } = renderHook(() => useKeyPress('a'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    });

    expect(result.current).toBe(false);
  });

  it('should return false after unmounting', () => {
    let keyPressed = false;
    const { unmount } = renderHook(() => {
      keyPressed = useKeyPress('a');
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });

    expect(keyPressed).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    });

    unmount();

    expect(keyPressed).toBe(false);
  });

  it('should work correctly with different target keys', () => {
    const { result: resultA } = renderHook(() => useKeyPress('a'));
    const { result: resultB } = renderHook(() => useKeyPress('b'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });

    expect(resultA.current).toBe(true);
    expect(resultB.current).toBe(false);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    });

    expect(resultA.current).toBe(true);
    expect(resultB.current).toBe(true);
  });
});