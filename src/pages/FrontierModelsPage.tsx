import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import { aiModels, getCurrentModelAccessRoutes, modelAccessProviders } from '../data/modelAccessCatalog';

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
    <header className="max-w-3xl mb-9">
      <p className="text-xs font-semibold tracking-[.16em] uppercase text-primary mb-3">Model index · reviewed 3 Nov 2026</p>
      <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">Frontier models</h1>
      <p className="mt-4 text-muted-foreground leading-7">A model-first guide to leading releases, what they do, and where they can be accessed. Provider routes are labeled by relationship; listing a route does not imply affiliation.</p>
    </header>
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-y border-border py-4 mb-6">
      <div className="flex flex-wrap gap-2" aria-label="Filter models by category">
        {[['all', 'All models'], ['assistants', 'Reasoning'], ['video', 'Video']].map(([id, label]) => <button key={id} onClick={() => setCategory(id)} aria-pressed={category === id} className={`px-3 py-2 rounded-md text-sm border ${category === id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>{label}</button>)}
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search models" placeholder="Search models or capabilities" className="w-full sm:w-72 rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
    <div className="space-y-5">
      {models.map((model) => {
        const routes = getCurrentModelAccessRoutes(model.id);
        return <article key={model.id} className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <div className="flex flex-col md:flex-row md:justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs tracking-wide text-muted-foreground">{model.family} · {model.category === 'video' ? 'Video generation' : 'AI assistants & reasoning'}</p>
              <h2 className="text-2xl font-semibold mt-2">{model.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Model owner: <strong className="text-foreground font-medium">{model.organization}</strong></p>
              <div className="flex flex-wrap gap-2 mt-4">{model.capabilities.map((capability) => <span key={capability} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">{capability}</span>)}</div>
              <p className="mt-5 text-sm"><span className="font-medium">Official API:</span> {model.officialApi.available ? 'Available' : 'Not listed'}{model.officialApi.pricing ? ` · ${model.officialApi.pricing}` : ''}</p>
              <p className="text-xs text-muted-foreground mt-2">Last checked {model.lastVerifiedAt}</p>
            </div>
            <a href={model.documentationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline shrink-0">Official model documentation <ExternalLink className="w-4 h-4" /></a>
          </div>
          <div className="mt-6 pt-5 border-t border-border">
            <h3 className="text-sm font-semibold mb-3">Access routes</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {routes.map((route) => {
                const provider = modelAccessProviders.find((item) => item.id === route.providerId)!;
                const relationship = provider.mode === 'official' ? 'Official provider access' : provider.mode === 'third-party-api' ? 'Third-party API route' : 'Community / promotional access';
                return <div key={route.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start gap-3"><div><p className="font-medium text-sm">{provider.name}</p><p className="text-xs text-muted-foreground mt-1">{relationship}</p></div><a href={route.claimUrl} target="_blank" rel="noreferrer" aria-label={`Open ${provider.name}`} className="text-primary"><ArrowUpRight className="w-4 h-4" /></a></div>
                  <p className="text-sm mt-3">{route.accessType === 'free-weekly-shared' ? route.allowance : route.accessType === 'paid-api' ? 'Paid access' : 'Subscription plan'}</p>
                  <p className="text-xs text-muted-foreground mt-2">{route.conditions}</p>
                  <p className="text-xs text-muted-foreground mt-2">Region: {route.region} · Account required: {route.requiresAccount ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Verified {route.lastVerifiedAt}{route.expiryDate ? ` · Expires ${route.expiryDate}` : ''} · <a className="underline" href={route.sourceUrl} target="_blank" rel="noreferrer">Source and terms</a></p>
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
