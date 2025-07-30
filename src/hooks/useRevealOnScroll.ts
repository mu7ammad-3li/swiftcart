// src/hooks/useRevealOnScroll.ts
import { useEffect, useRef, useCallback } from "react";

export function useRevealOnScroll(
  selector: string = ".reveal",
  threshold: number = 0.1,
  readyToObserve: boolean = true // New parameter: true when elements are ready
): void {
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Store elements that this specific observer instance is watching.
  // This helps in targeted cleanup.
  const currentObservedElements = useRef<Set<Element>>(new Set()).current;

  const initObserver = useCallback(() => {
    // Disconnect and clear previous observer for this hook instance
    if (observerRef.current) {
      currentObservedElements.forEach((el) =>
        observerRef.current!.unobserve(el)
      );
      observerRef.current.disconnect();
      currentObservedElements.clear();
      observerRef.current = null;
      console.log(
        `useRevealOnScroll: Cleaned up previous observer for selector "${selector}"`
      );
    }

    const elementsToReveal = document.querySelectorAll(selector);
    console.log(
      `useRevealOnScroll: Attempting to observe. Selector "${selector}", Found elements:`,
      elementsToReveal.length,
      elementsToReveal
    );

    if (elementsToReveal.length === 0) {
      console.log(
        `useRevealOnScroll: No elements found for selector "${selector}". Will retry if 'readyToObserve' changes.`
      );
      return; // Don't create an observer if no elements are found
    }

    const newObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(
              `useRevealOnScroll: Element IS intersecting for selector "${selector}":`,
              entry.target
            );
            entry.target.classList.add("active");
            newObserver.unobserve(entry.target);
            currentObservedElements.delete(entry.target); // Remove from this instance's tracking
          }
        });
      },
      {
        threshold: threshold,
      }
    );

    elementsToReveal.forEach((el) => {
      // Only observe elements that are not already active
      // This handles cases where `readyToObserve` might toggle multiple times
      // or if elements were somehow activated by another mechanism.
      if (!el.classList.contains("active")) {
        newObserver.observe(el);
        currentObservedElements.add(el);
      }
    });
    observerRef.current = newObserver;
    console.log(
      `useRevealOnScroll: New observer created and observing ${currentObservedElements.size} elements for selector "${selector}".`
    );
  }, [selector, threshold]); // currentObservedElements is stable

  useEffect(() => {
    console.log(
      `useRevealOnScroll useEffect triggered. Selector: "${selector}", ReadyToObserve:`,
      readyToObserve
    );

    if (readyToObserve) {
      // If elements are supposed to be ready, attempt to initialize the observer.
      // A small delay can sometimes help ensure the DOM has fully updated after React's render.
      const timeoutId = setTimeout(initObserver, 50); // 50ms delay, adjust if needed
      return () => clearTimeout(timeoutId);
    } else {
      // If not ready to observe (e.g., still loading), clean up any existing observer.
      if (observerRef.current) {
        console.log(
          `useRevealOnScroll: Not ready to observe. Cleaning up observer for selector "${selector}".`
        );
        currentObservedElements.forEach((el) =>
          observerRef.current!.unobserve(el)
        );
        observerRef.current.disconnect();
        currentObservedElements.clear();
        observerRef.current = null;
      }
    }

    // Cleanup function for when the component unmounts or dependencies change
    return () => {
      console.log(
        `useRevealOnScroll: Full cleanup for selector "${selector}" (unmount or dep change).`
      );
      if (observerRef.current) {
        currentObservedElements.forEach((el) =>
          observerRef.current!.unobserve(el)
        );
        observerRef.current.disconnect();
      }
      currentObservedElements.clear(); // Clear the set
      observerRef.current = null; // Nullify the ref
    };
  }, [selector, threshold, readyToObserve, initObserver]); // Add initObserver
}
