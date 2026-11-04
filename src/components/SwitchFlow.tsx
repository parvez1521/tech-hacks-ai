import React from 'react';
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
 * Claude Code → Aider. Pure CSS offset-path animation on a fixed
 * 1200×240 stage that centre-crops on narrow screens; the global
 * reduced-motion rules park the chips mid-path so the composition
 * still reads as a still.
 */
const LANES = [
  {
    paid: { slug: 'figma', name: 'Figma' },
    free: { slug: 'penpot', name: 'Penpot' },
    inPath: 'M -140,42 C 240,38 380,94 594,114',
    outPath: 'M 606,114 C 820,94 960,38 1340,42',
    delay: '0s',
  },
  {
    paid: { slug: 'google-analytics', name: 'Google Analytics' },
    free: { slug: 'plausible', name: 'Plausible' },
    inPath: 'M -140,120 C 240,120 400,120 594,120',
    outPath: 'M 606,120 C 800,120 960,120 1340,120',
    delay: '-1.53s',
  },
  {
    paid: { slug: 'claude-code', name: 'Claude Code' },
    free: { slug: 'aider', name: 'Aider' },
    inPath: 'M -140,198 C 240,202 380,146 594,126',
    outPath: 'M 606,126 C 820,146 960,202 1340,198',
    delay: '-3.06s',
  },
] as const;

const chipClass =
  'pointer-events-none absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card py-1 pl-1 pr-2.5 text-xs font-medium text-secondary-foreground shadow-lg';

export const SwitchFlow: React.FC = () => (
  <div
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
          {LANES.map((lane) => (
            <path key={`in-${lane.paid.slug}`} d={lane.inPath} fill="none" stroke="rgb(var(--brand-cyan) / 0.28)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
          ))}
          {LANES.map((lane) => (
            <path key={`out-${lane.free.slug}`} d={lane.outPath} fill="none" stroke="rgb(52 211 153 / 0.32)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
          ))}
        </svg>

        {LANES.map((lane) => (
          <span
            key={`chip-in-${lane.paid.slug}`}
            className={`${chipClass} switch-flow__chip-in`}
            style={{ offsetPath: `path('${lane.inPath}')`, animationDelay: lane.delay }}
            aria-hidden="true"
          >
            <BrandLogo slug={lane.paid.slug} name={lane.paid.name} size="xs" showContainer={false} />
            {lane.paid.name}
          </span>
        ))}
        {LANES.map((lane) => (
          <span
            key={`chip-out-${lane.free.slug}`}
            className={`${chipClass} switch-flow__chip-out`}
            style={{ offsetPath: `path('${lane.outPath}')`, animationDelay: lane.delay }}
            aria-hidden="true"
          >
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
