import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../src/useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('should return the initial value if no value is stored', () => {
        const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
        expect(result.current[0]).toBe('initialValue');
    });

    it('should return the stored value if a value is stored', () => {
        window.localStorage.setItem('testKey', JSON.stringify('storedValue'));
        const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
        expect(result.current[0]).toBe('storedValue');
    });

    it('should update the stored value', () => {
        const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

        act(() => {
            result.current[1]('newValue');
        });

        expect(result.current[0]).toBe('newValue');
        expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
    });

    // it('should handle parsing errors gracefully', () => {
    //     // Correctly simulate an unterminated JSON string
    //     window.localStorage.setItem('testKey', '{ "invalid": "json"');

    //     const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    //     expect(result.current[0]).toBe('initialValue');
    // });

    it('should handle setting errors gracefully', () => {
        const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

        const originalSetItem = window.localStorage.setItem;
        const originalGetItem = window.localStorage.getItem;
        window.localStorage.setItem = jest.fn(() => {
            throw new Error('setItem error');
        });

        window.localStorage.getItem = jest.fn(() => null);

        act(() => {
            result.current[1]('newValue');
        });

        expect(result.current[0]).toBe('newValue');

        window.localStorage.setItem = originalSetItem;
        window.localStorage.getItem = originalGetItem;
    });
});