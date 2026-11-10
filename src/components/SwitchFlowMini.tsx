import React from 'react';
import { BrandLogo } from './BrandLogo';
import { TechHacksLogo } from './TechHacksLogo';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * SwitchFlowMini — a compact, one-shot echo of the Alternatives
 * section's SwitchFlow (owner-chosen concept 4, Nov 2026), placed
 * between the category grids lower on the homepage. It deliberately
 * does NOT loop or rotate pairs like the full SwitchFlow: three
 * catalogue-backed pairs (the same first-listed matches SwitchFlow
 * uses) stream into the hub once when the strip scrolls into view and
 * emerge as free alternatives, then the strip settles.
 *
 * Pairs: Figma → Penpot, Notion → AppFlowy, Zapier → n8n.
 * Reduced motion: no travel — the settled state (free chips out) is
 * shown immediately.
 */
const MINI_PAIRS = [
  { paid: { slug: 'figma', name: 'Figma' }, free: { slug: 'penpot', name: 'Penpot' } },
  { paid: { slug: 'notion', name: 'Notion' }, free: { slug: 'appflowy', name: 'AppFlowy' } },
  { paid: { slug: 'zapier', name: 'Zapier' }, free: { slug: 'n8n', name: 'n8n' } },
] as const;

const LANE_TOPS = ['16%', '50%', '84%'] as const;

const chipBase =
  'pointer-events-none absolute flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card py-1 pl-1 pr-2.5 text-xs font-medium text-secondary-foreground opacity-0 shadow-lg';

export const SwitchFlowMini: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20" aria-label="Paid tools switching to free alternatives, in brief">
      <div
        ref={ref}
        className={`flow-mini${isVisible ? ' is-played' : ''} relative overflow-hidden rounded-2xl border border-border/70 bg-card/40`}
        role="img"
        aria-label="Animation: Figma, Notion and Zapier flow into SwitchRoute and come out as their free alternatives Penpot, AppFlowy and n8n."
      >
        <span className="absolute left-4 top-3 z-10 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" aria-hidden="true" /> Paid tools
        </span>
        <span className="absolute right-4 top-3 z-10 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-500 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Free alternatives
        </span>

        <div className="flow-mini__stage" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 168" preserveAspectRatio="none">
            <path d="M -20,28 C 300,28 420,84 594,84" fill="none" stroke="rgb(var(--brand-cyan) / 0.28)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            <path d="M -20,84 C 300,84 420,84 594,84" fill="none" stroke="rgb(var(--brand-cyan) / 0.28)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            <path d="M -20,140 C 300,140 420,84 594,84" fill="none" stroke="rgb(var(--brand-cyan) / 0.28)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            <path d="M 606,84 C 780,84 900,28 1220,28" fill="none" stroke="rgb(52 211 153 / 0.32)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            <path d="M 606,84 C 780,84 900,84 1220,84" fill="none" stroke="rgb(52 211 153 / 0.32)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            <path d="M 606,84 C 780,84 900,140 1220,140" fill="none" stroke="rgb(52 211 153 / 0.32)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
          </svg>

          {MINI_PAIRS.map((pair, i) => (
            <span key={`in-${pair.paid.slug}`} className={`${chipBase} flow-mini__chip flow-mini__chip--in flow-mini__chip--lane-${i}`} style={{ top: LANE_TOPS[i] }}>
              <BrandLogo slug={pair.paid.slug} name={pair.paid.name} size="xs" showContainer={false} />
              {pair.paid.name}
            </span>
          ))}
          {MINI_PAIRS.map((pair, i) => (
            <span key={`out-${pair.free.slug}`} className={`${chipBase} flow-mini__chip flow-mini__chip--out flow-mini__chip--lane-${i}`} style={{ top: LANE_TOPS[i] }}>
              <BrandLogo slug={pair.free.slug} name={pair.free.name} size="xs" showContainer={false} />
              {pair.free.name}
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-500 dark:text-emerald-400">FREE</span>
            </span>
          ))}

          <div className="flow-mini__hub">
            <span className="flow-mini__ring" />
            <span className="flow-mini__core">
              <TechHacksLogo size="md" showWordmark={false} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
