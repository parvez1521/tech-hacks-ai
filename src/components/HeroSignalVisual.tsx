import React, { useEffect, useRef } from 'react';

/**
 * Lightweight CSS/DOM 3D accent for the homepage hero. It deliberately avoids
 * WebGL: the directory gets a sense of depth without shipping a second render
 * loop or making catalog routes pay for a 3D dependency.
 */
export const HeroSignalVisual: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual || typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    if (reducedMotion?.matches) return;

    let frame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = window.scrollY;

    const paint = () => {
      frame = null;
      visual.style.setProperty('--hero-tilt-x', `${pointerX.toFixed(2)}deg`);
      visual.style.setProperty('--hero-tilt-y', `${pointerY.toFixed(2)}deg`);
      visual.style.setProperty('--hero-scroll', `${scrollY}`);
    };

    const requestPaint = () => {
      if (frame === null) frame = window.requestAnimationFrame(paint);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = visual.getBoundingClientRect();
      const normalizedX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const normalizedY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      pointerX = Math.max(-6, Math.min(6, normalizedX * 8));
      pointerY = Math.max(-5, Math.min(5, normalizedY * -6));
      requestPaint();
    };

    const handlePointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      requestPaint();
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      requestPaint();
    };

    if (finePointer?.matches) {
      // Listen on the window because the visual itself is intentionally
      // pointer-transparent and must never intercept search or navigation.
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('blur', handlePointerLeave, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    requestPaint();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
      <div ref={visualRef} className="hero-visual hidden lg:block" aria-hidden="true">
      <div className="hero-visual__stage">
        <div className="hero-visual__halo" />
        <div className="hero-visual__prism" />
        <span className="hero-visual__node node-a" />
        <span className="hero-visual__node node-b" />
        <span className="hero-visual__node node-c" />
        <span className="hero-visual__node node-d" />
        <div className="hero-visual__label">signal / discovery</div>
      </div>
    </div>
  );
};
