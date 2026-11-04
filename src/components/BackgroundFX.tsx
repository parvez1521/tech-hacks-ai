import React, { useEffect, useRef } from 'react';

/**
 * PREVIEW-ONLY background motion switcher, round 2.
 *
 * Ten continuous-motion variants, selected with the `bgfx` query param:
 * mesh | ribbons | beams | waves | dotwave | flow | rings | rays |
 * meteors | floor. Techniques follow what's trending on premium SaaS /
 * award sites in 2026 (Stripe-style mesh gradients, aurora ribbons,
 * beam networks, dot-wave fields, flow-field streams, HUD rings,
 * god rays, meteors, infinite grid floors) — all implemented here in
 * the site's own brand tokens. Once the owner picks a winner, the
 * switcher goes away and the winner becomes the static default.
 *
 * Decorative only: fixed layer below content, pointer-events-none,
 * aria-hidden, and prefers-reduced-motion stops the motion.
 */
const VARIANTS = ['mesh', 'ribbons', 'beams', 'waves', 'dotwave', 'flow', 'rings', 'rays', 'meteors', 'floor'] as const;
type BgfxVariant = (typeof VARIANTS)[number];

const resolveVariant = (): BgfxVariant => {
  if (typeof window === 'undefined') return 'mesh';
  const value = new URLSearchParams(window.location.search).get('bgfx');
  return (VARIANTS as readonly string[]).includes(value || '') ? (value as BgfxVariant) : 'mesh';
};

const useCanvas = (draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const loop = (t: number) => {
      if (!running) return;
      draw(ctx, w, h, t / 1000);
      raf = window.requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = window.requestAnimationFrame(loop);
      }
    };
    resize();
    draw(ctx, w, h, 0);
    if (!reduced) raf = window.requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [draw]);
  return ref;
};

const DotWave: React.FC = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const gap = 26;
    for (let x = gap / 2; x < w; x += gap) {
      for (let y = gap / 2; y < h; y += gap) {
        const wave = Math.sin(x * 0.021 + t * 1.6) + Math.cos(y * 0.017 + t * 1.25);
        const p = (wave + 2) / 4; // 0..1
        ctx.beginPath();
        ctx.arc(x, y, 0.7 + p * 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${0.08 + p * 0.4})`;
        ctx.fill();
      }
    }
  });
  return <canvas ref={ref} className="absolute inset-0" aria-hidden="true" />;
};

const FlowField: React.FC = () => {
  const state = useRef<{ x: number; y: number; age: number; life: number; hue: number }[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.fillStyle = 'rgba(6, 10, 20, 0.075)';
    ctx.fillRect(0, 0, w, h);
    const colours = ['34,211,238', '96,165,250', '139,92,246'];
    if (state.current.length === 0) {
      state.current = Array.from({ length: 110 }, () => ({
        x: Math.random() * w, y: Math.random() * h, age: 0, life: 260 + Math.random() * 300, hue: Math.floor(Math.random() * 3),
      }));
    }
    for (const p of state.current) {
      const angle = Math.sin(p.x * 0.0021 + t * 0.25) * 1.9 + Math.cos(p.y * 0.0026 - t * 0.18) * 1.9;
      const nx = p.x + Math.cos(angle) * 1.6;
      const ny = p.y + Math.sin(angle) * 1.6;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = `rgba(${colours[p.hue]},0.5)`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      p.x = nx;
      p.y = ny;
      p.age += 1;
      if (p.age > p.life || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.age = 0;
      }
    }
  });
  return <canvas ref={ref} className="absolute inset-0" aria-hidden="true" />;
};

const WAVE_PATH = 'M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 L1440,120 L0,120 Z';

export const BackgroundFX: React.FC = () => {
  const variant = resolveVariant();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {variant === 'mesh' && (
        <div className="absolute inset-0">
          <div className="bgfx2-mesh-a" />
          <div className="bgfx2-mesh-b" />
          <div className="bgfx2-mesh-c" />
          <div className="bgfx2-mesh-d" />
        </div>
      )}
      {variant === 'ribbons' && (
        <div className="absolute inset-0">
          <div className="bgfx2-ribbon bgfx2-ribbon-a" />
          <div className="bgfx2-ribbon bgfx2-ribbon-b" />
          <div className="bgfx2-ribbon bgfx2-ribbon-c" />
        </div>
      )}
      {variant === 'beams' && (
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
          {[120, 340, 560, 780, 1000, 1220].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x - 260} y2="900" stroke="rgba(96,165,250,0.10)" strokeWidth="1" />
          ))}
          {[160, 420, 680].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="1440" y2={y - 120} stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
          ))}
          {[120, 560, 1000].map((x, i) => (
            <line key={`p${x}`} x1={x} y1="0" x2={x - 260} y2="900" stroke="rgba(34,211,238,0.75)" strokeWidth="2" strokeDasharray="46 1254" className="bgfx2-beam-pulse" style={{ animationDelay: `${i * 1.7}s` }} />
          ))}
          {[160, 680].map((y, i) => (
            <line key={`q${y}`} x1="0" y1={y} x2="1440" y2={y - 120} stroke="rgba(167,139,250,0.6)" strokeWidth="2" strokeDasharray="40 1410" className="bgfx2-beam-pulse-h" style={{ animationDelay: `${0.9 + i * 2.3}s` }} />
          ))}
        </svg>
      )}
      {variant === 'waves' && (
        <div className="absolute inset-x-0 bottom-0 h-[46vh]">
          <div className="bgfx2-wave bgfx2-wave-a"><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={WAVE_PATH} fill="rgba(34,211,238,0.10)" /></svg><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={WAVE_PATH} fill="rgba(34,211,238,0.10)" /></svg></div>
          <div className="bgfx2-wave bgfx2-wave-b"><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={WAVE_PATH} fill="rgba(96,165,250,0.10)" /></svg><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={WAVE_PATH} fill="rgba(96,165,250,0.10)" /></svg></div>
          <div className="bgfx2-wave bgfx2-wave-c"><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={WAVE_PATH} fill="rgba(139,92,246,0.12)" /></svg><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={WAVE_PATH} fill="rgba(139,92,246,0.12)" /></svg></div>
        </div>
      )}
      {variant === 'dotwave' && <DotWave />}
      {variant === 'flow' && <FlowField />}
      {variant === 'rings' && (
        <div className="bgfx2-rings">
          <div className="bgfx2-ring bgfx2-ring-a" />
          <div className="bgfx2-ring bgfx2-ring-b" />
          <div className="bgfx2-ring bgfx2-ring-c" />
          <div className="bgfx2-orbit bgfx2-orbit-a"><span /></div>
          <div className="bgfx2-orbit bgfx2-orbit-b"><span /></div>
        </div>
      )}
      {variant === 'rays' && <div className="bgfx2-rays" />}
      {variant === 'meteors' && (
        <div className="absolute inset-0">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="bgfx2-meteor" style={{ left: `${8 + i * 16}%`, top: `${-4 + (i % 3) * 9}%`, animationDelay: `${i * 1.45}s`, animationDuration: `${6.5 + (i % 3)}s` }} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={`s${i}`} className="bgfx2-star" style={{ left: `${(i * 131) % 100}%`, top: `${(i * 67) % 60}%`, animationDelay: `${i * 0.7}s` }} />
          ))}
        </div>
      )}
      {variant === 'floor' && (
        <div className="bgfx2-floor-wrap">
          <div className="bgfx2-floor" />
          <div className="bgfx2-horizon" />
        </div>
      )}
    </div>
  );
};
