import { renderHook, act } from '@testing-library/react';
import useMediaQuery from '../src/useMediaQuery';

describe('useMediaQuery', () => {
    const mockMatchMedia = (matches: boolean) => {
        return {
            matches,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
    };

    it('should return true if the media query matches', () => {
        window.matchMedia = jest.fn().mockImplementation(() => mockMatchMedia(true));
        const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));

        expect(result.current).toBe(true);
    });

    it('should return false if the media query does not match', () => {
        window.matchMedia = jest.fn().mockImplementation(() => mockMatchMedia(false));
        const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));

        expect(result.current).toBe(false);
    });

    it('should update the state when the media query changes', () => {
        const mediaQueryList = mockMatchMedia(false);
        window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);
        const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));

        expect(result.current).toBe(false);

        act(() => {
            mediaQueryList.matches = true;
            // @ts-ignore
            mediaQueryList.addEventListener.mock.calls[0][1](); // Call the event listener
        });

        expect(result.current).toBe(true);
    });

    it('should remove the event listener on unmount', () => {
        const mediaQueryList = mockMatchMedia(false);
        window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);
        const { unmount } = renderHook(() => useMediaQuery('(min-width: 600px)'));

        unmount();

        // @ts-ignore
        expect(mediaQueryList.removeEventListener).toHaveBeenCalled();
    });
});