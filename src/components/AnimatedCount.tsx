import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

import { formatCount, getAnimatedCountValue } from '../lib/counter.ts';


export const AnimatedCount: React.FC<{ value: number; className?: string; durationMs?: number }> = ({
  value, className = '', durationMs = 900,
}) => {
  const reducedMotion = useReducedMotion();
  const elementRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);
  const [displayValue, setDisplayValue] = useState(() => (reducedMotion ? value : 0));

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      animatedRef.current = true;
      return;
    }
    const element = elementRef.current;
    if (!element || animatedRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setDisplayValue(value);
      animatedRef.current = true;
      return;
    }
    let frame = 0;
    let observer: IntersectionObserver;
    observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || animatedRef.current) return;
      animatedRef.current = true;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        setDisplayValue(getAnimatedCountValue(value, progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [durationMs, reducedMotion, value]);

  useEffect(() => {
    if (animatedRef.current && !reducedMotion) setDisplayValue(value);
  }, [value, reducedMotion]);

  return <strong ref={elementRef} className={className} aria-label={formatCount(value)}>{formatCount(displayValue)}</strong>;
};
