import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import { aiModels, getCurrentModelAccessRoutes, modelAccessProviders } from '../data/modelAccessCatalog';

const accessTypeLabels: Record<string, string> = {
  'free-weekly-shared': 'Free weekly · shared pool',
  'free-daily-allowance': 'Free daily allowance',
  'free-daily-credits': 'Free daily credits',
  'paid-api': 'Paid API',
  'browser-plan': 'Subscription plan',
};

export const FrontierModelsPage: React.FC = () => {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const models = useMemo(() => aiModels.filter((model) =>
    (category === 'all' || model.category === category) &&
    `${model.name} ${model.organization} ${model.capabilities.join(' ')}`.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);

  useEffect(() => {
    const id = 'frontier-models-jsonld';
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Frontier AI Models',
      description: 'Model capabilities, official documentation, and current access routes.',
      url: 'https://switchroute.in/frontier-models',
      mainEntity: { '@type': 'ItemList', itemListElement: aiModels.map((model, index) => ({ '@type': 'ListItem', position: index + 1, name: model.name, url: model.documentationUrl })) },
    });
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <header className="max-w-3xl mb-10 sm:mb-12">
      <p className="text-xs font-semibold tracking-[.16em] uppercase text-primary mb-3">Model index · reviewed 3 Nov 2026</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">Frontier models</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">A model-first guide to leading releases, what they are good at, official API pricing, and current ways to try them. Community routes are separate from official provider access and may have shared limits.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Reasoning & work</p><p className="mt-1 font-semibold text-foreground">GPT-6 Astra</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Coding, computer use, research and complex tasks</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Agentic coding</p><p className="mt-1 font-semibold text-foreground">Claude Opus 5.5</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Long-running codebase work and analysis</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Video & storytelling</p><p className="mt-1 font-semibold text-foreground">Seedance 2.5</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Native audio-video generation and reference control</p></div>
      </div>
    </header>
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-y border-border py-4 mb-6">
      <div className="flex flex-wrap gap-2" aria-label="Filter models by category">
        {[['all', 'All models'], ['assistants', 'Reasoning'], ['video', 'Video']].map(([id, label]) => <button key={id} onClick={() => setCategory(id)} aria-pressed={category === id} className={`min-h-11 rounded-md border px-3 text-sm transition-colors ${category === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{label}</button>)}
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search models" placeholder="Search models or capabilities" className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm sm:w-72" />
    </div>
    <div className="space-y-5">
      {models.map((model) => {
        const routes = getCurrentModelAccessRoutes(model.id);
        return <article key={model.id} className="rounded-lg border border-border bg-card p-5 sm:p-7">
          <div className="flex flex-col md:flex-row md:justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs tracking-wide text-muted-foreground">{model.family} · {model.category === 'video' ? 'Video generation' : 'AI assistants & reasoning'}</p>
              <h2 className="text-2xl font-semibold mt-2">{model.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Model owner: <strong className="text-foreground font-medium">{model.organization}</strong></p>
              <p className="mt-3 text-sm leading-6 text-secondary-foreground">{model.summary}</p>
              <div className="flex flex-wrap gap-2 mt-4">{model.capabilities.map((capability) => <span key={capability} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">{capability}</span>)}</div>
              <p className="mt-5 text-sm"><span className="font-medium">Official API:</span> {model.officialApi.available ? 'Available' : 'Not listed'}{model.officialApi.pricing ? ` · ${model.officialApi.pricing}` : ''}</p>
              <p className="text-xs text-muted-foreground mt-2">Last checked {model.lastVerifiedAt}</p>
            </div>
            <a href={model.documentationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline shrink-0">Official model documentation <ExternalLink className="w-4 h-4" /></a>
          </div>
          <div className="mt-6 pt-5 border-t border-border">
            <h3 className="text-sm font-semibold mb-3">Where to try it · access routes and pricing</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {routes.map((route) => {
                const provider = modelAccessProviders.find((item) => item.id === route.providerId)!;
                const relationship = provider.mode === 'official' ? 'Official provider access' : provider.mode === 'third-party-api' ? 'Third-party API route' : 'Community / promotional access';
                return <div key={route.id} className="relative overflow-hidden rounded-lg p-5 [background:var(--brand-route-gradient)] [color:rgb(var(--brand-midnight))] shadow-[0_14px_28px_-12px_rgb(var(--color-primary)/0.55)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgb(var(--color-primary)/0.38),0_12px_38px_-8px_rgb(var(--brand-cyan)/0.48),0_28px_64px_-12px_rgb(var(--brand-violet)/0.42),0_4px_16px_-4px_rgb(var(--color-primary)/0.3)] has-[:focus-visible]:[outline:2px_solid_rgb(var(--color-primary)/0.85)] has-[:focus-visible]:[outline-offset:2px]">
                  <div className="flex justify-between items-start gap-3"><div><p className="font-medium text-sm">{provider.name}</p><p className="text-xs text-[rgb(var(--brand-midnight)/0.72)] mt-1">{relationship}</p></div><a href={route.claimUrl} target="_blank" rel="noreferrer" aria-label={`Open ${provider.name}`} className="shrink-0 text-[rgb(var(--brand-midnight))] after:absolute after:inset-0 after:content-['']"><ArrowUpRight className="w-4 h-4" /></a></div>
                  <span className={`inline-flex mt-3 rounded-md border px-2 py-1 text-[10px] font-semibold ${route.accessType.startsWith('free-') ? 'border-[rgb(var(--brand-midnight)/0.55)] bg-[rgb(var(--brand-midnight)/0.12)] text-[rgb(var(--brand-midnight))]' : 'border-[rgb(var(--brand-midnight)/0.35)] bg-transparent text-[rgb(var(--brand-midnight)/0.85)]'}`}>{accessTypeLabels[route.accessType] || 'Access route'}</span>
                  <p className="text-sm mt-2">{route.allowance || (route.accessType === 'paid-api' ? 'Paid usage; account billing required.' : 'Requires a paid subscription plan.')}</p>
                  {route.quickNote && <p className="text-xs font-medium leading-5 text-[rgb(var(--brand-midnight)/0.85)] mt-2">{route.quickNote}</p>}
                  <p className="text-xs text-[rgb(var(--brand-midnight)/0.72)] mt-2">{route.conditions}</p>
                  <p className="text-xs text-[rgb(var(--brand-midnight)/0.72)] mt-2">Region: {route.region} · Account required: {route.requiresAccount ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-[rgb(var(--brand-midnight)/0.72)] mt-1">Verified {route.lastVerifiedAt}{route.expiryDate ? ` · Expires ${route.expiryDate}` : ''} · <a className="relative z-10 underline" href={route.sourceUrl} target="_blank" rel="noreferrer">Source and terms</a></p>
                </div>;
              })}
            </div>
          </div>
        </article>;
      })}
      {models.length === 0 && <p className="py-12 text-center text-muted-foreground">No models match those filters.</p>}
    </div>
    <p className="mt-8 text-xs text-muted-foreground flex gap-2 items-start"><Check className="w-4 h-4 shrink-0" />Access and pricing can change. Community route allowances are provider-published and may be shared across models; check linked terms before relying on them.</p>
  </main>;
};
