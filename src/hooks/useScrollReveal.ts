import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — lightweight IntersectionObserver-based scroll reveal hook.
 *
 * Returns a ref to attach to the element you want to reveal, and a boolean
 * `isVisible` that becomes true once the element enters the viewport.
 *
 * Accessibility: Honours prefers-reduced-motion by treating the element as
 * immediately visible so no opacity/transform transitions are applied.
 *
 * @param options - IntersectionObserver options (threshold, rootMargin)
 * @param once - If true (default) the observer disconnects after first reveal
 */
export function useScrollReveal<T extends Element = Element>(
  options: IntersectionObserverInit = {},
  once = true
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Immediately visible for users who prefer reduced motion
    if (typeof window !== 'undefined') {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      if (reducedMotion?.matches) {
        setIsVisible(true);
        return;
      }
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
        ...options,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return { ref, isVisible };
}
