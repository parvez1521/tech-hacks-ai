import React from 'react';
import { ArrowUpRight, BadgeCheck, Bolt, Gift, Sparkles, Zap } from 'lucide-react';

const accessCards = [
  {
    name: 'OmniRush',
    label: 'DAILY BONUS',
    allowance: 'Daily free token allowance',
    detail: 'GPT-6 Astra and other frontier models. Allowance can vary by account and linked-account bonuses.',
    models: ['GPT-6 Astra', 'GPT-6.1 Sol', 'Claude Opus 5.5'],
    href: 'https://omnirush.ai/console?ref=XCTNVXA4',
    cta: 'Claim daily access',
    accent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    border: 'border-cyan-400/30',
    icon: Bolt,
  },
  {
    name: 'RusherAI',
    label: 'WEEKLY BONUS',
    allowance: '50 million tokens / week',
    detail: 'Free, ad-supported AI chat workspace with a weekly allowance. Limits and available models may change.',
    models: ['GPT-6 Astra', 'Claude Opus 5.5', 'Claude Fable 5.1'],
    href: 'https://rusherai.com/signup?ref=RUSHQM4N7E',
    cta: 'Claim 50M weekly tokens',
    accent: 'from-violet-500/25 via-fuchsia-500/10 to-transparent',
    border: 'border-violet-400/35',
    icon: Gift,
  },
  {
    name: 'Kie.ai',
    label: 'MODEL ACCESS',
    allowance: 'Frontier models via API',
    detail: 'Access GPT-6 Astra and Claude Opus 5.5 through a model API. Check current pricing and credits before use; this is not presented as a free-token offer.',
    models: ['GPT-6 Astra', 'Claude Opus 5.5'],
    href: 'https://kie.ai?ref=db7baff2ed7877243971150d4ea6ade2',
    cta: 'Explore model access',
    accent: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'border-amber-400/30',
    icon: Zap,
  },
];

export const FrontierBonusSection: React.FC = () => (
  <section
    aria-labelledby="frontier-bonus-heading"
    className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-primary/30 bg-card/80 px-4 py-7 shadow-[0_0_60px_rgba(99,102,241,0.08)] sm:px-6 sm:py-9"
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.13),transparent_48%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.09),transparent_45%)]" />
    <div className="relative">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> SwitchRoute bonus drop
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
          <BadgeCheck className="h-3 w-3" /> Access details checked against provider pages
        </span>
      </div>

      <div className="mb-7 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">The AI Black Card</p>
          <h2 id="frontier-bonus-heading" className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Frontier AI. <span className="bg-gradient-to-r from-cyan-400 via-primary to-violet-400 bg-clip-text text-transparent">Bonus unlocked.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-secondary-foreground sm:text-base">
            Find ways to try powerful AI models without starting with an expensive subscription. Compare the allowance, model access and terms before you jump in.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
          <Gift className="h-4 w-4 text-primary" /> Hand-picked access routes
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {accessCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.name} className={`group relative flex min-w-0 flex-col overflow-hidden rounded-xl border ${card.border} bg-background/75 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>
              <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-80 transition-opacity group-hover:opacity-100`} />
              <div className="relative flex h-full flex-col">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background/80 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-border/80 bg-background/70 px-2.5 py-1 text-[9px] font-bold tracking-[0.13em] text-muted-foreground">{card.label}</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">{card.name}</h3>
                <p className="mt-2 text-lg font-bold leading-snug text-foreground">{card.allowance}</p>
                <p className="mt-2 min-h-[60px] text-xs leading-5 text-secondary-foreground">{card.detail}</p>
                <div className="my-4 flex flex-wrap gap-1.5">
                  {card.models.map((model) => (
                    <span key={model} className="rounded-md border border-border/80 bg-background/70 px-2 py-1 text-[10px] font-medium text-muted-foreground">{model}</span>
                  ))}
                </div>
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-bold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {card.cta} <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-5 text-[11px] leading-5 text-muted-foreground">
        Allowances, supported models, account eligibility and prices can change. Tokens are usage limits, not cash value. Provider names belong to their respective owners; SwitchRoute is an independent directory and does not guarantee uninterrupted free access.
      </p>
    </div>
  </section>
);
