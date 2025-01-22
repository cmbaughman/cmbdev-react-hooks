import { renderHook, act } from '@testing-library/react';
import { useEventListener } from '../src/useEventListener';

describe('useEventListener', () => {
    it('should add an event listener to the element', () => {
        const handler = jest.fn();
        const element = document.createElement('div');
        renderHook(() => useEventListener('click', handler, element));

        act(() => {
            element.dispatchEvent(new Event('click'));
        });

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should use the window as the default element', () => {
        const handler = jest.fn();
        renderHook(() => useEventListener('click', handler));

        act(() => {
            window.dispatchEvent(new Event('click'));
        });

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should remove the event listener on unmount', () => {
        const handler = jest.fn();
        const element = document.createElement('div');
        const { unmount } = renderHook(() => useEventListener('click', handler, element));

        unmount();

        act(() => {
            element.dispatchEvent(new Event('click'));
        });

        expect(handler).not.toHaveBeenCalled();
    });

    it('should use the latest handler', () => {
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        const element = document.createElement('div');
        const { rerender } = renderHook(
            (handler: (event: Event) => void) => useEventListener('click', handler, element),
            { initialProps: handler1 }
        );

        act(() => {
            element.dispatchEvent(new Event('click'));
        });
        expect(handler1).toHaveBeenCalledTimes(1);

        rerender(handler2);

        act(() => {
            element.dispatchEvent(new Event('click'));
        });
        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should not add an event listener if the element does not support it', () => {
        const handler = jest.fn();
        // Simulate an unsupported element by passing an empty object
        const unsupportedElement = {};
        renderHook(() =>
            useEventListener('click', handler, unsupportedElement as any)
        );

        act(() => {
            window.dispatchEvent(new Event('click'));
        });

        expect(handler).not.toHaveBeenCalled();
    });

    it('should re-add the listener if event name changes', () => {
        const handler = jest.fn();
        const element = document.createElement('div');
        const { rerender } = renderHook(
            ({ eventName }: { eventName: string }) => useEventListener(eventName, handler, element),
            { initialProps: { eventName: 'click' } }
        );

        act(() => {
            element.dispatchEvent(new Event('click'));
        });
        expect(handler).toHaveBeenCalledTimes(1);

        act(() => {
            element.dispatchEvent(new Event('mouseover'));
        });

        expect(handler).toHaveBeenCalledTimes(1);

        rerender({ eventName: 'mouseover' });

        act(() => {
            element.dispatchEvent(new Event('mouseover'));
        });
        expect(handler).toHaveBeenCalledTimes(2);
    });
});