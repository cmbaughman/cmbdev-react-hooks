import { renderHook, act } from '@testing-library/react';
import useClickOutside from '../src/useClickOutside';

describe('useClickOutside', () => {
  it('should call the handler when clicking outside the referenced element', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    const dummyDiv = document.createElement('div');
    document.body.appendChild(dummyDiv);

    act(() => {
      result.current.current = dummyDiv;
    });

    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(dummyDiv);
  });

  it('should not call the handler when clicking inside the referenced element', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    const div = document.createElement('div');
    document.body.appendChild(div);

    act(() => {
      result.current.current = div;
    });

    act(() => {
      div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it('should not call the handler after unmounting', () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() => useClickOutside(handler));

    unmount();

    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should use the updated handler when the handler changes', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const { result, rerender } = renderHook(
      (handler: () => void) => useClickOutside(handler),
      { initialProps: handler1 }
    );

    const div = document.createElement('div');
    document.body.appendChild(div);

    act(() => {
      result.current.current = div;
    })

    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    rerender(handler2);

    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    document.body.removeChild(div);
  });
});