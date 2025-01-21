import { renderHook, act } from '@testing-library/react';
import useHover from '../src/useHover';

describe('useHover', () => {
    it('should return false initially', () => {
        const { result } = renderHook(() => useHover());

        expect(result.current[1]).toBe(false);
    });

    // it('should return true when the element is hovered', async () => {
    //     const { result } = renderHook(() => useHover<HTMLDivElement>());
    //     const element = document.createElement('div');
    //     document.body.appendChild(element);

    //     await act(async () => {
    //         result.current[0].current = element;
    //     });

    //     // Dispatch a mouseover event
    //     await act(async () => {
    //         const event = new MouseEvent('mouseover', { bubbles: true });
    //         element.dispatchEvent(event);
    //     });

    //     // Check if isHovered state is true
    //     expect(result.current[1]).toBe(true);

    //     document.body.removeChild(element);
    // });

    it('should return false when the mouse leaves the element', async () => {
        const { result } = renderHook(() => useHover<HTMLDivElement>());
        const element = document.createElement('div');
        document.body.appendChild(element);

        await act(async () => {
            result.current[0].current = element;

            element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            element.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
        });

        expect(result.current[1]).toBe(false);

        document.body.removeChild(element);
    });

    // it('should clean up event listeners on unmount', async () => {
    //     const { result, unmount } = renderHook(() => useHover<HTMLDivElement>());
    //     const element = document.createElement('div');
    //     document.body.appendChild(element);

    //     // Set the ref and call the effect
    //     await act(async () => {
    //         result.current[0].current = element;
    //     });

    //     const addEventListenerSpy = jest.spyOn(element, 'addEventListener');
    //     const removeEventListenerSpy = jest.spyOn(element, 'removeEventListener');

    //     // Call the cleanup function
    //     await act(async () => {
    //         unmount();
    //     });

    //     // Check if the event listeners were added
    //     expect(addEventListenerSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    //     expect(addEventListenerSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));

    //     // Check if the event listeners were removed
    //     expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    //     expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));

    //     addEventListenerSpy.mockRestore();
    //     removeEventListenerSpy.mockRestore();
    //     document.body.removeChild(element);
    // });
});