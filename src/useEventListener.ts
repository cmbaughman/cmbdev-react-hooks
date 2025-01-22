import { useRef, useEffect, useCallback } from 'react';

type EventHandler<T extends Event> = (event: T) => void;
type ValidEventTarget = Window | Document | HTMLElement | EventTarget;

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

// Main Implementation
export default function useEventListener(
  eventName: string,
  handler: EventHandler<any>,
  element: ValidEventTarget | undefined = window
) {

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