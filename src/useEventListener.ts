import { useRef, useEffect, useCallback } from 'react';

// Define a generic type for the event handler function
type EventHandler<T extends Event> = (event: T) => void;

// Define a generic type for valid event targets
type ValidEventTarget = Window | Document | HTMLElement | EventTarget;

// Overloads for improved type inference
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window
): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: HTMLElement
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document
): void;

export function useEventListener<T extends Event>(
  eventName: string,
  handler: (event: T) => void,
  element?: ValidEventTarget
): void;

// Implementation
export function useEventListener(
  eventName: string,
  handler: EventHandler<any>,
  element: ValidEventTarget | undefined = window
) {
  // Create a ref that stores the handler
  const savedHandler = useRef<EventHandler<any>>(null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: Event) => savedHandler.current?.(event);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}