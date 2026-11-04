import React, { useEffect, useRef } from 'react';

/**
 * PREVIEW-ONLY background motion switcher.
 *
 * Renders one of three ambient background-motion variants behind the app,
 * selected with the `bgfx` query parameter (?bgfx=aurora | grid |
 * particles). Default is `aurora`. Once the owner picks a winner, the
 * switcher goes away and the chosen variant becomes the static default.
 *
 * All variants are decorative: pointer-events-none, aria-hidden, painted
 * on a fixed layer below the content, and they honour
 * prefers-reduced-motion (CSS variants are collapsed by the global
 * reduced-motion block; the canvas variant checks matchMedia itself).
 */
type BgfxVariant = 'aurora' | 'grid' | 'particles';

const resolveVariant = (): BgfxVariant => {
  if (typeof window === 'undefined') return 'aurora';
  const value = new URLSearchParams(window.location.search).get('bgfx');
  return value === 'grid' || value === 'particles' ? value : 'aurora';
};

const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    type Dot = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let dots: Dot[] = [];
    // Brand palette: cyan, sky blue, violet (dark-theme friendly alphas).
    const colours = ['rgba(34, 211, 238,', 'rgba(96, 165, 250,', 'rgba(139, 92, 246,'];

    const seed = () => {
      const count = Math.min(70, Math.floor((width * height) / 42000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 1 + Math.random() * 1.4,
        hue: Math.floor(Math.random() * colours.length),
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `${colours[dot.hue]}0.5)`;
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const a = dots[i];
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(96, 165, 250,${(1 - dist / 110) * 0.14})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const tick = () => {
      if (!running) return;
      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < -10) dot.x = width + 10;
        if (dot.x > width + 10) dot.x = -10;
        if (dot.y < -10) dot.y = height + 10;
        if (dot.y > height + 10) dot.y = -10;
      }
      draw();
      raf = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = window.requestAnimationFrame(tick);
      }
    };

    resize();
    draw();
    if (!reduced) raf = window.requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
};

export const BackgroundFX: React.FC = () => {
  const variant = resolveVariant();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {variant === 'aurora' && (
        <>
          <div className="bgfx-blob bgfx-drift-a" style={{ width: '54rem', height: '54rem', left: '-14rem', top: '-18rem', background: 'radial-gradient(circle, rgb(var(--brand-cyan) / 0.13) 0%, transparent 65%)' }} />
          <div className="bgfx-blob bgfx-drift-b" style={{ width: '48rem', height: '48rem', right: '-12rem', top: '22%', background: 'radial-gradient(circle, rgb(var(--brand-violet) / 0.11) 0%, transparent 65%)' }} />
          <div className="bgfx-blob bgfx-drift-c" style={{ width: '44rem', height: '44rem', left: '28%', bottom: '-20rem', background: 'radial-gradient(circle, rgb(var(--color-primary) / 0.10) 0%, transparent 65%)' }} />
        </>
      )}
      {variant === 'grid' && (
        <div className="bgfx-grid absolute inset-0">
          <div className="bgfx-sweep" />
        </div>
      )}
      {variant === 'particles' && <ParticleField />}
    </div>
  );
};
