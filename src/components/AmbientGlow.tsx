import React, { useEffect, useRef } from 'react';

/**
 * AmbientGlow Component
 *
 * Provides a lightweight, pointer-following ambient lighting effect.
 * Uses requestAnimationFrame with linear interpolation (lerp) for smooth trailing motion.
 * Updates CSS custom properties (--mouse-x, --mouse-y) directly on the container element
 * without triggering React re-renders.
 *
 * Accessibility & Safety:
 * - pointer-events: none ensures decorative glow never intercepts clicks or inputs.
 * - Disabled on touch devices and coarse pointers via matchMedia('(hover: hover) and (pointer: fine)').
 * - Respects prefers-reduced-motion: reduce by maintaining a static default position.
 * - Cleans up all listeners and animation frames on unmount.
 */
export const AmbientGlow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for fine pointer (mouse/trackpad) support
    const finePointerMedia = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    if (finePointerMedia && !finePointerMedia.matches) {
      return;
    }

    // Check for prefers-reduced-motion
    const reducedMotionMedia = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reducedMotionMedia && reducedMotionMedia.matches) {
      return;
    }

    let rafId: number | null = null;
    let targetX = window.innerWidth / 2;
    let targetY = 250;
    let currentX = targetX;
    let currentY = targetY;
    let isMoving = false;

    const updatePosition = () => {
      // Smooth interpolation (lerp factor 0.12 for fluid, lag-free motion)
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${Math.round(currentX)}px`);
        containerRef.current.style.setProperty('--mouse-y', `${Math.round(currentY)}px`);
      }

      // Continue animating while moving toward target
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = window.requestAnimationFrame(updatePosition);
      } else {
        isMoving = false;
        rafId = null;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isMoving) {
        isMoving = true;
        rafId = window.requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden ambient-glow-container select-none"
      aria-hidden="true"
    >
      {/* Dynamic Cursor Spotlight (follows pointer with soft radial gradient) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x, 50%) var(--mouse-y, 240px), rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.03), transparent 70%)`,
        }}
      />

      {/* Static Ambient Light Backdrop for Top Hero Accent */}
      <div className="pointer-events-none absolute top-[-100px] left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl opacity-40 -z-20" />
    </div>
  );
};
