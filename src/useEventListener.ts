import { useRef, useEffect, useCallback } from 'react';

type EventHandler<T extends Element, U extends Event> = (event: U) => void;
type ValidEventTarget = Window | Document | HTMLElement | EventTarget;

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window | null
): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: HTMLElement | null
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document | null
): void;
export function useEventListener<T extends Event>(
  eventName: string,
  handler: (event: T) => void,
  element?: ValidEventTarget | null
): void;

// Implementation
export function useEventListener<T extends HTMLElement = HTMLElement, U extends Event = Event>(
  eventName: string,
  handler: EventHandler<T, U>,
  element: ValidEventTarget | null = window
): void {
  const savedHandler = useRef<EventHandler<T, U> | null>(null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;

    if (!isSupported) return;

    const eventListener = (event: Event) => savedHandler.current?.(event as U);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

export default useEventListener;