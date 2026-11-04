import React, { useEffect, useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { TechHacksLogo } from './TechHacksLogo';

/**
 * SwitchFlow — the Alternatives section's signature animation, modelled
 * on the owner's reference: streams flow along dotted trails into a
 * centre point and emerge transformed on the other side.
 *
 * Paid tools travel in from the left along curved dotted trails,
 * shrink into the SwitchRoute hub, and come out on the right as their
 * real free / open-source alternatives (emerald FREE badge). Each of
 * the three lanes rotates through a queue of pairs — fifteen famous
 * paid tools in total — one pair per cycle.
 *
 * The pair queues hold every proprietary target in the catalogue that
 * has a real open-source replacement, first-listed per the same
 * service the detail pages use (getToolsForProprietary). Targets whose
 * only matches are other hosted AI tools (Runway, Kling, …) are NOT
 * here: nothing emerges marked FREE unless the catalogue backs it.
 *
 * Motion is driven in JS from the trails' own SVG geometry
 * (getPointAtLength), so chip positions are mathematically exact:
 * chips stay upright, travel is eased (gentle arrival at the hub,
 * gentle release), and the paid→free handoff crossfades at the hub
 * with no jumps. Pair swaps happen at the cycle wrap, when both chips
 * are invisible. The loop pauses off-screen; prefers-reduced-motion
 * parks each lane's first pair mid-path as a still.
 */
const LANE_PATHS = [
  {
    inPath: 'M -140,42 C 240,38 380,94 594,114',
    outPath: 'M 606,114 C 820,94 960,38 1340,42',
  },
  {
    inPath: 'M -140,120 C 240,120 400,120 594,120',
    outPath: 'M 606,120 C 800,120 960,120 1340,120',
  },
  {
    inPath: 'M -140,198 C 240,202 380,146 594,126',
    outPath: 'M 606,126 C 820,146 960,202 1340,198',
  },
] as const;

const LANE_PAIRS: ReadonlyArray<
  ReadonlyArray<{ paid: { slug: string; name: string }; free: { slug: string; name: string } }>
> = [
  [
    { paid: { slug: 'figma', name: 'Figma' }, free: { slug: 'penpot', name: 'Penpot' } },
    { paid: { slug: 'notion', name: 'Notion' }, free: { slug: 'appflowy', name: 'AppFlowy' } },
    { paid: { slug: 'zapier', name: 'Zapier' }, free: { slug: 'n8n', name: 'n8n' } },
    { paid: { slug: 'perplexity', name: 'Perplexity AI' }, free: { slug: 'perplexica', name: 'Perplexica' } },
    { paid: { slug: 'google-photos', name: 'Google Photos' }, free: { slug: 'immich', name: 'Immich' } },
  ],
  [
    { paid: { slug: 'google-analytics', name: 'Google Analytics' }, free: { slug: 'plausible', name: 'Plausible Analytics' } },
    { paid: { slug: 'github-copilot', name: 'GitHub Copilot' }, free: { slug: 'cline', name: 'Cline' } },
    { paid: { slug: 'firebase', name: 'Firebase' }, free: { slug: 'supabase', name: 'Supabase' } },
    { paid: { slug: 'calendly', name: 'Calendly' }, free: { slug: 'cal-com', name: 'Cal.com' } },
    { paid: { slug: 'airtable', name: 'Airtable' }, free: { slug: 'baserow', name: 'Baserow' } },
  ],
  [
    { paid: { slug: 'claude-code', name: 'Claude Code' }, free: { slug: 'aider', name: 'Aider' } },
    { paid: { slug: 'postman', name: 'Postman' }, free: { slug: 'hoppscotch', name: 'Hoppscotch' } },
    { paid: { slug: 'buffer', name: 'Buffer' }, free: { slug: 'postiz', name: 'Postiz' } },
    { paid: { slug: 'algolia', name: 'Algolia' }, free: { slug: 'firecrawl', name: 'Firecrawl' } },
    { paid: { slug: 'typeform', name: 'Typeform' }, free: { slug: 'typebot', name: 'Typebot' } },
  ],
];

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
    const trails = new Map<string, { path: SVGPathElement; len: number }>();
    root.querySelectorAll<SVGPathElement>('path[data-trail]').forEach((p) => {
      trails.set(p.dataset.trail || '', { path: p, len: p.getTotalLength() });
    });
    const chips = new Map<string, HTMLElement>();
    root.querySelectorAll<HTMLElement>('[data-chip]').forEach((el) => {
      chips.set(`${el.dataset.lane}:${el.dataset.queue}:${el.dataset.chip}`, el);
    });
    if (trails.size === 0 || chips.size === 0) return;

    const place = (el: HTMLElement, trailKey: string, eased: number, opacity: number, scale: number) => {
      const trail = trails.get(trailKey);
      if (!trail) return;
      const pt = trail.path.getPointAtLength(eased * trail.len);
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let lane = 0; lane < LANE_PAIRS.length; lane += 1) {
        const inChip = chips.get(`${lane}:0:in`);
        const outChip = chips.get(`${lane}:0:out`);
        if (inChip) place(inChip, `in-${lane}`, 0.38, 1, 1);
        if (outChip) place(outChip, `out-${lane}`, 0.34, 1, 1);
      }
      return;
    }

    const activeQueue = [-1, -1, -1];
    let raf = 0;
    let inView = true;
    const loop = (now: number) => {
      if (inView) {
        for (let lane = 0; lane < LANE_PAIRS.length; lane += 1) {
          const queue = LANE_PAIRS[lane];
          const shifted = now / CYCLE_MS + lane / LANE_PAIRS.length;
          const cycle = Math.floor(shifted);
          const p = shifted - cycle;
          const queueIdx = cycle % queue.length;
          if (activeQueue[lane] !== queueIdx) {
            if (activeQueue[lane] >= 0) {
              const oldIn = chips.get(`${lane}:${activeQueue[lane]}:in`);
              const oldOut = chips.get(`${lane}:${activeQueue[lane]}:out`);
              if (oldIn) oldIn.style.opacity = '0';
              if (oldOut) oldOut.style.opacity = '0';
            }
            activeQueue[lane] = queueIdx;
          }
          const eased = seg(p, 0, 1);
          const inChip = chips.get(`${lane}:${queueIdx}:in`);
          const outChip = chips.get(`${lane}:${queueIdx}:out`);
          if (inChip) {
            place(inChip, `in-${lane}`, eased, seg(p, 0.02, 0.1) * (1 - seg(p, 0.9, 1)), 1 - 0.45 * seg(p, 0.85, 1));
          }
          if (outChip) {
            place(outChip, `out-${lane}`, eased, seg(p, 0, 0.1) * (1 - seg(p, 0.9, 1)), 0.55 + 0.45 * seg(p, 0, 0.16));
          }
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
      aria-label="Animation: fifteen famous paid tools — Figma, Notion, Zapier, Perplexity AI, Google Analytics, GitHub Copilot, Firebase, Claude Code, Postman and more — flow into SwitchRoute one after another and come out as their free alternatives, including Penpot, AppFlowy, n8n, Perplexica, Plausible Analytics, Cline, Supabase and Aider."
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
            {LANE_PATHS.map((lane, i) => (
              <path key={`in-${i}`} data-trail={`in-${i}`} d={lane.inPath} fill="none" stroke="rgb(var(--brand-cyan) / 0.28)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            ))}
            {LANE_PATHS.map((lane, i) => (
              <path key={`out-${i}`} data-trail={`out-${i}`} d={lane.outPath} fill="none" stroke="rgb(52 211 153 / 0.32)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            ))}
          </svg>

          {LANE_PAIRS.map((queue, laneIdx) =>
            queue.map((pair, queueIdx) => (
              <span key={`in-${laneIdx}-${queueIdx}`} data-chip="in" data-lane={laneIdx} data-queue={queueIdx} className={chipClass} aria-hidden="true">
                <BrandLogo slug={pair.paid.slug} name={pair.paid.name} size="xs" showContainer={false} />
                {pair.paid.name}
              </span>
            )),
          )}
          {LANE_PAIRS.map((queue, laneIdx) =>
            queue.map((pair, queueIdx) => (
              <span key={`out-${laneIdx}-${queueIdx}`} data-chip="out" data-lane={laneIdx} data-queue={queueIdx} className={chipClass} aria-hidden="true">
                <BrandLogo slug={pair.free.slug} name={pair.free.name} size="xs" showContainer={false} />
                {pair.free.name}
                <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-500 dark:text-emerald-400">FREE</span>
              </span>
            )),
          )}

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
