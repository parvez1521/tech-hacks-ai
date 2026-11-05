import React, { useEffect, useRef } from 'react';

/**
 * RouteFlow — a Lusion-style interactive flow-field band for the
 * homepage, sitting in its OWN dedicated full-width band between the
 * hero and the Collections section. Nothing else lives in the band:
 * no text, no chips, no cards — so by construction nothing overlaps
 * anything. The band is a single canvas of glowing particle streams.
 *
 * The motion borrows the technique award sites like Lusion are known
 * for: hundreds of particles advected through a slowly evolving
 * noise flow-field (organic, never repeating), leaving fading silk
 * trails, and — the signature — reacting to the visitor's cursor:
 * streams bend, swirl and brighten around pointer movement, scaled
 * by pointer velocity. Brand colours only (cyan / blue / violet).
 *
 * Canvas 2D with pre-rendered glow sprites and additive compositing
 * on dark (normal on light), DPR capped, particle count scaled to
 * area, paused off-screen and on hidden tabs. prefers-reduced-motion
 * renders one static painted frame instead of the loop.
 */
const COLOURS = ['34,211,238', '96,165,250', '139,92,246', '34,211,238', '96,165,250'];

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  life: number;
  maxLife: number;
  speed: number;
  colour: string;
}

export const RouteFlow: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Deliberately a dark cinematic interlude in BOTH themes (like the
    // site's dark artwork cards on light pages), so the band never
    // depends on the active theme's background token.
    const bgTriplet = '8,13,24';
    const isDark = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let inView = true;
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

    const spawn = (p: Particle) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.px = p.x;
      p.py = p.y;
      p.life = 0;
      p.maxLife = 140 + Math.random() * 220;
      p.speed = 0.55 + Math.random() * 0.95;
      p.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(280, Math.floor(rect.width));
      h = Math.max(180, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${bgTriplet})`;
      ctx.fillRect(0, 0, w, h);
      const target = Math.round(Math.min(1100, Math.max(520, (w * h) / 1500)));
      particles = Array.from({ length: target }, () => {
        const p = {} as Particle;
        spawn(p);
        p.life = Math.random() * p.maxLife;
        return p;
      });
    };

    const fieldAngle = (x: number, y: number, t: number) =>
      (Math.sin(x * 0.0011 + t * 0.1) + 0.7 * Math.cos(y * 0.0014 - t * 0.08) + 0.45 * Math.sin((x + y) * 0.00045 + t * 0.045)) * 0.62;

    const step = (t: number) => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(${bgTriplet},0.07)`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';
      const R = 160;
      for (const p of particles) {
        // Two half-steps per frame: the mid-point sample bends each
        // segment into a curve instead of a jagged polyline.
        p.px = p.x;
        p.py = p.y;
        let midx = p.x;
        let midy = p.y;
        for (let sub = 0; sub < 2; sub += 1) {
          const angle = fieldAngle(p.x, p.y, t);
          let mx = Math.cos(angle) * p.speed * 0.85;
          let my = Math.sin(angle) * p.speed * 0.85;
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 1;
              const fall = (1 - d / R) ** 2;
              // Cursor velocity drags the stream; a tangential swirl bends it around the pointer.
              mx += pointer.vx * fall * 0.45 + (-dy / d) * fall * 0.5;
              my += pointer.vy * fall * 0.45 + (dx / d) * fall * 0.5;
            }
          }
          p.x += mx;
          p.y += my;
          if (sub === 0) { midx = p.x; midy = p.y; }
        }
        p.life += 1;
        const env = Math.min(1, p.life / 26) * Math.min(1, (p.maxLife - p.life) / 30);
        if (env > 0.02) {
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(midx, midy);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${p.colour},${(0.5 * env).toFixed(3)})`;
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }
        if (p.life > p.maxLife || p.x < -24 || p.x > w + 24 || p.y < -24 || p.y > h + 24) spawn(p);
      }
      // Pointer velocity decays so a still cursor stops stirring the field.
      pointer.vx *= 0.9;
      pointer.vy *= 0.9;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      if (pointer.active) {
        pointer.vx = pointer.vx * 0.55 + (nx - pointer.x) * 0.45;
        pointer.vy = pointer.vy * 0.55 + (ny - pointer.y) * 0.45;
      }
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    if (reduced) {
      // One static painted frame: run the simulation forward silently.
      for (let i = 0; i < 110; i += 1) step(i / 60);
    } else {
      const loop = (now: number) => {
        if (inView) step(now / 1000);
        raf = window.requestAnimationFrame(loop);
      };
      raf = window.requestAnimationFrame(loop);
      section.addEventListener('pointermove', onPointerMove);
      section.addEventListener('pointerleave', onPointerLeave);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '120px' },
    );
    observer.observe(section);
    window.addEventListener('resize', resize);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="route-flow" aria-label="Interactive animation: glowing streams that react to your cursor">
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
    </section>
  );
};
