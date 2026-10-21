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

    // Keep the global field restrained: it paints behind content, listens only
    // on fine pointers, and stops its frame loop as soon as the pointer settles.
    const ENABLE_AMBIENT_GLOW = true;
    if (!ENABLE_AMBIENT_GLOW) return;

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

    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${Math.round(currentX)}px`);
      containerRef.current.style.setProperty('--mouse-y', `${Math.round(currentY)}px`);
    }

    const updatePosition = () => {
      // Smooth interpolation (lerp factor 0.14 for fluid, reactive trailing motion)
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden ambient-glow-container select-none opacity-100"
      aria-hidden="true"
    >
      {/* Outer Holographic Cursor Aura (Cyan to Electric Blue to Subtle Violet) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x, 50vw) var(--mouse-y, 250px), rgba(6, 182, 212, 0.14) 0%, rgba(59, 130, 246, 0.09) 35%, rgba(147, 51, 234, 0.04) 65%, transparent 80%)`,
        }}
      />

      {/* Focused Inner Core Glow for Cybernetic Illumination */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-300"
        style={{
          background: `radial-gradient(320px circle at var(--mouse-x, 50vw) var(--mouse-y, 250px), rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.06) 50%, transparent 75%)`,
        }}
      />

      {/* Static Ambient Light Backdrop for Top Hero Accent */}
      <div className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-gradient-to-b from-cyan-500/10 via-primary/5 to-transparent rounded-full blur-3xl opacity-50 -z-20" />
    </div>
  );
};
