import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Fingerprint,
  Layers3,
  Palette,
  ShieldCheck,
  Sparkles,
  Type,
} from 'lucide-react';
import { Link } from '../router/Router';
import { TechHacksLogo } from '../components/TechHacksLogo';

const brandColors = [
  { name: 'Midnight', hex: '#080D18', rgb: '8, 13, 24', role: 'Primary canvas', guidance: 'Use for the dark-mode page background and high-contrast brand moments.' },
  { name: 'Deep Navy', hex: '#13294A', rgb: '19, 41, 74', role: 'Depth & surfaces', guidance: 'Use in hero gradients and large background surfaces, not for small text.' },
  { name: 'Route Blue', hex: '#60A5FA', rgb: '96, 165, 250', role: 'Primary accent · dark UI', guidance: 'Use for primary links, focus rings, active states, and key actions on dark surfaces.' },
  { name: 'Route Cyan', hex: '#22D3EE', rgb: '34, 211, 238', role: 'Route gradient start', guidance: 'Use as a supporting accent in the route mark, data visuals, and subtle highlights.' },
  { name: 'Route Violet', hex: '#8B5CF6', rgb: '139, 92, 246', role: 'Route gradient end', guidance: 'Use sparingly as the gradient endpoint for distinctive brand artwork.' },
  { name: 'Mist', hex: '#F1F5F9', rgb: '241, 245, 249', role: 'Primary text · dark UI', guidance: 'Use for important headings and body text against dark surfaces.' },
  { name: 'Slate', hex: '#94A3B8', rgb: '148, 163, 184', role: 'Supporting text · dark UI', guidance: 'Use for descriptions, metadata, secondary labels, and quiet interface text.' },
  { name: 'Border', hex: '#29384F', rgb: '41, 56, 79', role: 'Dark UI structure', guidance: 'Use for card outlines, dividers, input borders, and low-emphasis separation.' },
] as const;

const lightColors = [
  { name: 'Light canvas', hex: '#F8FAFC', role: 'Page background' },
  { name: 'White surface', hex: '#FFFFFF', role: 'Cards and inputs' },
  { name: 'Ink', hex: '#0F172A', role: 'Headings and main text' },
  { name: 'Accessible blue', hex: '#1D4ED8', role: 'Primary actions and links' },
  { name: 'Light border', hex: '#DAE2EB', role: 'Borders and dividers' },
] as const;

const spacing = [
  { label: '4', value: '4px', width: 'w-1' },
  { label: '8', value: '8px', width: 'w-2' },
  { label: '12', value: '12px', width: 'w-3' },
  { label: '16', value: '16px', width: 'w-4' },
  { label: '24', value: '24px', width: 'w-6' },
  { label: '32', value: '32px', width: 'w-8' },
  { label: '48', value: '48px', width: 'w-12' },
  { label: '64', value: '64px', width: 'w-16' },
] as const;

export const BrandKitPage: React.FC = () => {
  const [copied, setCopied] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const copyColor = async (hex: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setCopyMessage(`${hex} copied to clipboard`);
    } catch {
      setCopied('');
      setCopyMessage(`Copy unavailable. Select and copy ${hex} manually.`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-foreground">Brand Kit</span>
      </nav>

      <header className="relative isolate overflow-hidden rounded-3xl border border-brand-blue/25 bg-gradient-to-br from-brand-midnight via-brand-navy to-background px-6 py-8 shadow-[0_24px_80px_rgba(37,99,235,0.12)] sm:px-10 sm:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-brand-blue/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl" />
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          SwitchRoute visual identity
        </div>
        <div className="mb-6">
          <TechHacksLogo size="lg" showWordmark />
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-brand-ice sm:text-6xl">
          Brand Kit<span className="text-brand-cyan">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          The visual system behind SwitchRoute: a clear route through software choices, expressed with midnight surfaces, a cyan-to-blue-to-violet route mark, readable type, and practical, honest content.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/brand-kit.json" download className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-midnight transition hover:bg-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download brand tokens
          </a>
          <a href="/favicon.svg" download className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-ice/20 bg-brand-ice/5 px-4 py-2.5 text-sm font-semibold text-brand-ice transition hover:border-brand-cyan/60 hover:bg-brand-ice/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download route mark SVG
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-400">Digital brand reference · Updated October 2026</p>
      </header>

      <section className="mt-12" aria-labelledby="brand-principles-heading">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-blue/25 bg-brand-blue/10 text-brand-blue">
            <Fingerprint className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">01 / Identity</p>
            <h2 id="brand-principles-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">One brand, one clear route</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-secondary-foreground">
              SwitchRoute helps people discover AI tools, compare software alternatives, find useful browser utilities, and understand access models before committing to a product.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <p className="eyebrow">Brand promise</p>
            <h3 className="mt-3 text-xl font-bold text-foreground">Find a smarter route to your tools.</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Make software choices easier with clear comparisons, source links, and practical context—not hype.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <p className="eyebrow">Brand attributes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Useful', 'Clear', 'Curious', 'Independent', 'Transparent', 'Modern'].map((attribute) => (
                <span key={attribute} className="rounded-full border border-brand-blue/25 bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-blue">{attribute}</span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Confident without exaggeration. Technical without being intimidating.</p>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="logo-heading">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-blue/25 bg-brand-blue/10 text-brand-blue">
            <Layers3 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">02 / Logo</p>
            <h2 id="logo-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">The route mark</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-secondary-foreground">Two opposing routes represent comparison and a better path forward. Keep the mark crisp, proportional, and surrounded by breathing room.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex min-h-44 flex-col justify-between rounded-2xl border border-brand-blue/30 bg-brand-midnight p-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Preferred / dark</span>
            <TechHacksLogo size="lg" showWordmark />
            <p className="text-xs leading-relaxed text-slate-400">Primary placement for dark surfaces and the default website theme.</p>
          </div>
          <div className="flex min-h-44 flex-col justify-between rounded-2xl border border-border bg-brand-light-bg p-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Reverse / light</span>
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="SwitchRoute route mark" width="48" height="48" className="h-12 w-12" />
              <span className="text-2xl font-extrabold tracking-tight text-brand-light-ink">Switch<span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet bg-clip-text text-transparent">Route</span></span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">Use a dark wordmark on light backgrounds; never place white text on a white surface.</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground">Logo rules</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-secondary-foreground sm:grid-cols-2">
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" /> Preserve proportions and the full gradient.</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" /> Keep clear space around the mark.</li>
            <li className="flex gap-2"><span className="mt-0.5 text-rose-400" aria-hidden="true">×</span> Do not stretch, redraw, or add effects to static logo files.</li>
            <li className="flex gap-2"><span className="mt-0.5 text-rose-400" aria-hidden="true">×</span> Do not use the obsolete “Tech Hacks AI” name as the current wordmark.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
            <a href="/favicon.svg" download className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"><Download className="h-4 w-4" aria-hidden="true" /> Route mark / favicon SVG</a>
            <a href="/social-card.svg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"><ExternalLink className="h-4 w-4" aria-hidden="true" /> Social card artwork</a>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="color-palette-heading">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-blue/25 bg-brand-blue/10 text-brand-blue">
            <Palette className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">03 / Colour</p>
            <h2 id="color-palette-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">A focused route gradient</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-secondary-foreground">Midnight and navy provide calm structure; cyan, blue, and violet distinguish the route mark. Use colour to guide attention, not decorate every element.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {brandColors.map((color) => (
            <article key={color.hex} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="h-20 border-b border-border/70" style={{ backgroundColor: color.hex }} aria-hidden="true" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{color.name}</h3>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground">{color.role}</p>
                  </div>
                  <button type="button" onClick={() => void copyColor(color.hex)} aria-label={`Copy ${color.name} hex ${color.hex}`} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-border px-2 text-[11px] font-semibold text-secondary-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {copied === color.hex ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                    {copied === color.hex ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code className="mt-3 block rounded-md bg-muted px-2 py-1.5 font-mono text-xs text-foreground">{color.hex}</code>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{color.guidance}</p>
              </div>
            </article>
          ))}
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-xs text-muted-foreground">{copyMessage}</p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground">Light-theme companions</h3>
              <p className="mt-1 text-xs text-muted-foreground">These values protect readability when the user switches to light mode.</p>
            </div>
            <div className="h-3 w-32 rounded-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet" aria-label="SwitchRoute cyan-to-blue-to-violet gradient" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {lightColors.map((color) => (
              <button key={color.hex} type="button" onClick={() => void copyColor(color.hex)} className="group min-w-0 rounded-xl border border-border bg-background p-2 text-left transition hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Copy light theme color ${color.name}, ${color.hex}`}>
                <span className="mb-2 block h-12 rounded-lg border border-black/10" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <span className="block text-xs font-semibold text-foreground">{color.name}</span>
                <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{color.hex} · copy</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="type-heading">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-blue/25 bg-brand-blue/10 text-brand-blue">
            <Type className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">04 / Typography</p>
            <h2 id="type-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Inter, with room to breathe</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-secondary-foreground">Use Inter across the product. Strong headings guide scanning; regular-weight body text keeps technical detail easy to read.</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5 sm:p-7">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span>Display / H1</span><span>48–60px · 800 · tight tracking</span></div>
            <p className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">Find a smarter route.</p>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-border p-5 md:border-b-0 md:border-r sm:p-7">
              <div className="mb-2 text-xs text-muted-foreground">Section / H2 · 24–32px · 700</div>
              <p className="text-2xl font-bold tracking-tight text-foreground">Compare before you commit.</p>
            </div>
            <div className="border-b border-border p-5 sm:p-7 md:border-b-0">
              <div className="mb-2 text-xs text-muted-foreground">Body · 14–18px · 400</div>
              <p className="max-w-xl text-base leading-relaxed text-secondary-foreground">Help people choose useful software with source-backed facts, clear limits, and a straightforward explanation of trade-offs.</p>
            </div>
          </div>
          <div className="border-t border-border p-5 sm:p-7">
            <div className="mb-2 text-xs text-muted-foreground">Metadata / Eyebrow · 11px · 600 · uppercase</div>
            <p className="eyebrow">Free-first software discovery</p>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="eyebrow">05 / Layout</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Spacing & surfaces</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">Use a consistent 4px spacing base. Prefer calm surfaces, one-pixel borders, and a clear hierarchy over heavy shadows.</p>
          <div className="mt-5 space-y-3">
            {spacing.map((item) => (
              <div key={item.label} className="grid grid-cols-[3.5rem_1fr_3rem] items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{item.value}</span>
                <div className="h-3 rounded-full bg-muted">
                  <div className={`h-3 rounded-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet ${item.width}`} />
                </div>
                <span className="text-right text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-secondary-foreground">Control · 8–10px radius</span>
            <span className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-secondary-foreground">Card · 16px radius</span>
            <span className="rounded-2xl border border-border bg-background px-3 py-2 text-xs text-secondary-foreground">Feature · 24px radius</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="eyebrow">06 / Components</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Interface in practice</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">Actions use the semantic primary token; secondary actions remain outlined. Selected states should be clear without relying on colour alone.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/ai-tools" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Explore AI tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/alternatives" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Compare alternatives
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="interactive-card surface-card rounded-2xl p-4">
              <span className="inline-flex rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-brand-cyan">FREE ACCESS</span>
              <h3 className="mt-3 font-semibold text-foreground">Clear, not over-promising</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Explain whether access means a free tier, trial credits, or self-hosted weights.</p>
            </div>
            <div className="interactive-card surface-card rounded-2xl p-4">
              <span className="inline-flex rounded-full border border-brand-violet/25 bg-brand-violet/10 px-2.5 py-1 text-[11px] font-semibold text-brand-violet">SOURCE-LINKED</span>
              <h3 className="mt-3 font-semibold text-foreground">Trust over hype</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Send visitors to official product, pricing, and licensing sources.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-2" aria-labelledby="voice-heading">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="eyebrow">07 / Voice</p>
          <h2 id="voice-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">Helpful, specific, honest</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Prefer</p>
              <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">“Compare tools by use case, access limits, and official pricing.”</p>
            </div>
            <div className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-400">Avoid</p>
              <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">“The world’s #1 tool, unlimited and totally free.”</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-secondary-foreground">
            <li>• Be direct; define technical terms when needed.</li>
            <li>• Verify pricing, access, licensing, and time-sensitive claims.</li>
            <li>• Label estimates and limitations clearly.</li>
            <li>• Never imply a tool is free or endorsed without evidence.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="eyebrow">08 / Accessibility</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Clarity is part of the brand</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-secondary-foreground">
            <p>Meet WCAG contrast guidance for text and controls; don’t use muted slate for essential small text on complex gradients.</p>
            <p>Keep keyboard focus visible, buttons comfortably tappable, form controls labelled, and icons paired with accessible names when their meaning isn’t obvious.</p>
            <p>Keep transitions subtle and honour reduced-motion preferences. Never use colour alone to communicate status.</p>
          </div>
          <div className="mt-5 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-brand-cyan" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">Target: readable, consistent, calm</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Primary text, links, and focus indicators should remain identifiable in both themes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-brand-blue/25 bg-gradient-to-br from-brand-blue/10 via-card to-brand-cyan/5 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
        <div>
          <p className="eyebrow">Brand system files</p>
          <h2 className="mt-2 text-xl font-bold text-foreground">Use the same system across every surface.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary-foreground">Download the machine-readable colour and typography tokens, then use the same palette in the website, social graphics, presentations, and product imagery.</p>
        </div>
        <a href="/brand-kit.json" download className="mt-5 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:mt-0">
          <Download className="h-4 w-4" aria-hidden="true" />
          Download JSON
        </a>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
        <span>SwitchRoute · Digital brand reference</span>
        <Link to="/" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">Back to SwitchRoute <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
      </div>
    </div>
  );
};
