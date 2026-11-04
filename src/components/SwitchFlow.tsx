import React, { useEffect, useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { TechHacksLogo } from './TechHacksLogo';

/**
 * SwitchFlow — the Alternatives section's signature animation, modelled
 * on the owner's reference: streams flow along dotted trails into a
 * centre point and emerge transformed on the other side.
 *
 * Paid tools travel in from the left along curved dotted trails, shrink
 * into the SwitchRoute hub, and come out on the right as their real
 * free / open-source alternatives (emerald FREE badge), paired from the
 * live catalogue: Figma → Penpot, Google Analytics → Plausible,
 * Claude Code → Aider.
 *
 * Motion is driven in JS from the trails' own SVG geometry
 * (getPointAtLength), so chip positions are mathematically exact:
 * chips stay upright, travel is eased (gentle arrival at the hub,
 * gentle release), and the paid→free handoff crossfades at the hub
 * with no jumps. The loop pauses off-screen; prefers-reduced-motion
 * parks the chips mid-path so the composition still reads as a still.
 */
const LANES = [
  {
    paid: { slug: 'figma', name: 'Figma' },
    free: { slug: 'penpot', name: 'Penpot' },
    inPath: 'M -140,42 C 240,38 380,94 594,114',
    outPath: 'M 606,114 C 820,94 960,38 1340,42',
  },
  {
    paid: { slug: 'google-analytics', name: 'Google Analytics' },
    free: { slug: 'plausible', name: 'Plausible' },
    inPath: 'M -140,120 C 240,120 400,120 594,120',
    outPath: 'M 606,120 C 800,120 960,120 1340,120',
  },
  {
    paid: { slug: 'claude-code', name: 'Claude Code' },
    free: { slug: 'aider', name: 'Aider' },
    inPath: 'M -140,198 C 240,202 380,146 594,126',
    outPath: 'M 606,126 C 820,146 960,202 1340,198',
  },
] as const;

const CYCLE_MS = 5200;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Smooth 0→1 ramp of x between a and b. */
const seg = (x: number, a: number, b: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const chipClass =
  'pointer-events-none absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card py-1 pl-1 pr-2.5 text-xs font-medium text-secondary-foreground opacity-0 shadow-lg will-change-transform';

export const SwitchFlow: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const trails = new Map<string, SVGPathElement>();
    root.querySelectorAll<SVGPathElement>('path[data-trail]').forEach((p) => {
      trails.set(p.dataset.trail || '', p);
    });
    const chips = [...root.querySelectorAll<HTMLElement>('[data-chip]')].map((el) => ({
      el,
      lane: Number(el.dataset.lane || 0),
      dir: el.dataset.chip || 'in',
    }));
    if (trails.size === 0 || chips.length === 0) return;
    const lengths = new Map<string, number>();
    trails.forEach((p, key) => lengths.set(key, p.getTotalLength()));

    const place = (
      chip: (typeof chips)[number],
      p: number,
      eased: number,
      opacity: number,
      scale: number,
    ) => {
      const path = trails.get(`${chip.dir}-${chip.lane}`);
      const len = lengths.get(`${chip.dir}-${chip.lane}`);
      if (!path || !len) return;
      const pt = path.getPointAtLength(eased * len);
      chip.el.style.opacity = opacity.toFixed(3);
      chip.el.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    };

    const frame = (pIn: number, lane: number) => {
      const eased = seg(pIn, 0, 1);
      place(
        chips.find((c) => c.dir === 'in' && c.lane === lane)!,
        pIn,
        eased,
        seg(pIn, 0.02, 0.1) * (1 - seg(pIn, 0.9, 1)),
        1 - 0.45 * seg(pIn, 0.85, 1),
      );
      place(
        chips.find((c) => c.dir === 'out' && c.lane === lane)!,
        pIn,
        eased,
        seg(pIn, 0, 0.1) * (1 - seg(pIn, 0.9, 1)),
        0.55 + 0.45 * seg(pIn, 0, 0.16),
      );
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let lane = 0; lane < LANES.length; lane += 1) {
        const inChip = chips.find((c) => c.dir === 'in' && c.lane === lane)!;
        const outChip = chips.find((c) => c.dir === 'out' && c.lane === lane)!;
        const inPath = trails.get(`in-${lane}`);
        const outPath = trails.get(`out-${lane}`);
        if (inPath) {
          const pt = inPath.getPointAtLength(0.38 * (lengths.get(`in-${lane}`) || 0));
          inChip.el.style.opacity = '1';
          inChip.el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
        }
        if (outPath) {
          const pt = outPath.getPointAtLength(0.34 * (lengths.get(`out-${lane}`) || 0));
          outChip.el.style.opacity = '1';
          outChip.el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
        }
      }
      return;
    }

    let raf = 0;
    let inView = true;
    const loop = (now: number) => {
      if (inView) {
        for (let lane = 0; lane < LANES.length; lane += 1) {
          const p = ((now % CYCLE_MS) / CYCLE_MS + lane / LANES.length) % 1;
          frame(p, lane);
        }
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '80px' },
    );
    observer.observe(root);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative mb-10 overflow-hidden rounded-2xl border border-border/70 bg-card/40"
      role="img"
      aria-label="Animation: paid tools Figma, Google Analytics and Claude Code flow into SwitchRoute and come out as their free alternatives Penpot, Plausible and Aider."
    >
      <span className="absolute left-4 top-3 z-10 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" aria-hidden="true" /> Paid tools
      </span>
      <span className="absolute right-4 top-3 z-10 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-500 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Free alternatives
      </span>

      <div className="flex justify-center">
        <div className="switch-flow__stage">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
            {LANES.map((lane, i) => (
              <path key={`in-${lane.paid.slug}`} data-trail={`in-${i}`} d={lane.inPath} fill="none" stroke="rgb(var(--brand-cyan) / 0.28)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            ))}
            {LANES.map((lane, i) => (
              <path key={`out-${lane.free.slug}`} data-trail={`out-${i}`} d={lane.outPath} fill="none" stroke="rgb(52 211 153 / 0.32)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            ))}
          </svg>

          {LANES.map((lane, i) => (
            <span key={`chip-in-${lane.paid.slug}`} data-chip="in" data-lane={i} className={chipClass} aria-hidden="true">
              <BrandLogo slug={lane.paid.slug} name={lane.paid.name} size="xs" showContainer={false} />
              {lane.paid.name}
            </span>
          ))}
          {LANES.map((lane, i) => (
            <span key={`chip-out-${lane.free.slug}`} data-chip="out" data-lane={i} className={chipClass} aria-hidden="true">
              <BrandLogo slug={lane.free.slug} name={lane.free.name} size="xs" showContainer={false} />
              {lane.free.name}
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-500 dark:text-emerald-400">FREE</span>
            </span>
          ))}

          <div className="switch-flow__hub" aria-hidden="true">
            <span className="switch-flow__ring" />
            <span className="switch-flow__ring switch-flow__ring--late" />
            <span className="switch-flow__core">
              <TechHacksLogo size="lg" showWordmark={false} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
