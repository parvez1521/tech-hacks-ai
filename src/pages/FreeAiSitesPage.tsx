import React, { useState } from 'react';
import { getFreeAiTools } from '../services/aiCatalogService';
import { aiCategories } from '../data/aiToolsData';
import { AiToolCard } from '../components/AiToolCard';
import { EmptyState } from '../components/EmptyState';
import { Gift, Search, X, Server, CheckCircle2, SlidersHorizontal, Sparkles, Unlock } from 'lucide-react';
import type { FreeAccessType } from '../types';
import { aiModels, getCurrentModelAccessRoutes, modelAccessProviders } from '../data/modelAccessCatalog';

export const FreeAiSitesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedAccessType, setSelectedAccessType] = useState<FreeAccessType | 'all' | 'no-account'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'latest' | 'name_asc'>('popular');

  const allFreeTools = getFreeAiTools();

  const filteredTools = allFreeTools.filter((tool) => {
    // Category filter
    if (selectedCat && tool.category !== selectedCat) return false;

    // Access Type filter
    if (selectedAccessType === 'open-source-local') {
      if (tool.freeAccessType !== 'open-source-local' && !tool.isSelfHostable) return false;
    } else if (selectedAccessType === 'recurring-free') {
      if (tool.freeAccessType !== 'recurring-free') return false;
    } else if (selectedAccessType === 'free-credits') {
      if (tool.freeAccessType !== 'free-credits') return false;
    } else if (selectedAccessType === 'no-account') {
      if (tool.requiresAccount) return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = tool.name.toLowerCase().includes(q);
      const matchTagline = tool.tagline.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchTags = tool.tags.some((t) => t.toLowerCase().includes(q));
      const matchFeatures = tool.features.some((f) => f.toLowerCase().includes(q));
      return matchName || matchTagline || matchDesc || matchTags || matchFeatures;
    }
    return true;
  });

  // Sort
  filteredTools.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'latest':
        return (b.releaseYear || 2024) - (a.releaseYear || 2024);
      case 'popular':
      default:
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  const openSourceCount = allFreeTools.filter((t) => t.freeAccessType === 'open-source-local' || t.isSelfHostable).length;
  const recurringCount = allFreeTools.filter((t) => t.freeAccessType === 'recurring-free').length;
  const noAccountCount = allFreeTools.filter((t) => !t.requiresAccount).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex min-h-9 items-center gap-2 border-l-2 border-emerald-600 pl-3 text-xs font-semibold tracking-wide text-muted-foreground mb-3 dark:border-emerald-400">
          <Gift className="w-3.5 h-3.5 text-emerald-600" />
          <span>Free access routes · checked 3 Nov 2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold text-foreground tracking-tight mb-3">
          Free AI Access
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed mb-6">
          Find current free model access, trials, credits and free plans. Quotas and eligibility vary; each route includes its source and verification date. Catalog free-plan listings below are platform-level records, not a promise of unlimited access.
        </p>

        {/* Informational Callout: Open Source vs Hosted Commercial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 p-4 sm:p-5 rounded-lg bg-muted/30 border border-border mb-6 text-sm text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <Server className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold block mb-0.5">Local and open-source software</strong>
              <span className="text-muted-foreground">Tools like Ollama, Open WebUI, and ComfyUI run on your own hardware with no cloud fees, data logging, or subscriptions.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold block mb-0.5">Hosted Freemium & Free-Plan SaaS</strong>
              <span className="text-muted-foreground">Hosted plans may have usage caps, account requirements, changing model availability, or renewal terms. Check each provider before use.</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="space-y-4">
          {/* Access Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedAccessType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                selectedAccessType === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground hover:text-primary border border-border hover:bg-muted'
              }`}
            >
              All Free Access ({allFreeTools.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedAccessType('open-source-local')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                selectedAccessType === 'open-source-local'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-card text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>100% Open Source & Local ({openSourceCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedAccessType('recurring-free')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                selectedAccessType === 'recurring-free'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-primary hover:bg-muted border border-[#BFDBFE]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recurring Free Plan ({recurringCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedAccessType('no-account')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                selectedAccessType === 'no-account'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-card text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>No Account Required ({noAccountCount})</span>
            </button>
          </div>

          {/* Quick Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3.5 sm:p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, features, or tags..."
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-primary shadow-xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  aria-label="Sort free AI tools"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-1.5 px-2.5 rounded-lg bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-primary cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="latest">Latest Released</option>
                  <option value="name_asc">Name A-Z</option>
                </select>
              </div>

              <span className="text-xs text-muted-foreground">
                Showing <strong className="text-foreground font-mono">{filteredTools.length}</strong> tools
              </span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedCat(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                !selectedCat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-muted hover:text-primary border border-border'
              }`}
            >
              All Categories
            </button>
            {aiCategories.map((cat) => {
              const count = allFreeTools.filter((t) => t.category === cat.id).length;
              if (count === 0) return null;
              const isSelected = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(isSelected ? null : cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card text-muted-foreground hover:bg-muted hover:text-primary border border-border'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mb-10" aria-labelledby="verified-routes-heading">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div><p className="text-xs tracking-wide text-muted-foreground">Model access · provider-published quota</p><h2 id="verified-routes-heading" className="text-xl font-semibold text-foreground mt-1">Verified free model routes</h2></div>
          <a href="/frontier-models" className="text-sm text-primary hover:underline">Browse frontier models</a>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {getCurrentModelAccessRoutes().filter((route) => route.accessType === 'free-weekly-shared').map((route) => {
            const model = aiModels.find((item) => item.id === route.modelId)!;
            const provider = modelAccessProviders.find((item) => item.id === route.providerId)!;
            return <article key={route.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex justify-between gap-3"><div><p className="text-xs text-muted-foreground">{model.organization} model</p><h3 className="font-semibold text-foreground">{model.name}</h3></div><span className="text-xs text-emerald-700 dark:text-emerald-300">Verified active</span></div>
              <p className="text-sm mt-3">{route.allowance}; refreshes weekly.</p>
              <p className="text-xs text-muted-foreground mt-2">Via {provider.name} · third-party community access, not affiliated with {model.organization}. Account required. Region not published.</p>
              <p className="text-xs text-muted-foreground mt-2">{route.conditions}</p>
              <div className="flex gap-4 text-xs mt-3"><a className="underline" href={route.claimUrl} target="_blank" rel="noreferrer">Claim at provider</a><a className="underline" href={route.sourceUrl} target="_blank" rel="noreferrer">Source and terms</a><span>Checked {route.lastVerifiedAt}</span></div>
            </article>;
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">The provider describes the quota as shared across its listed models. No expiry date is published; continued availability is not guaranteed. Seedance 2.5 is not included because a qualifying free route was not verified.</p>
      </section>

      {/* Grid or Empty State */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <AiToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No free AI tools found matching "${search}".`}
          onReset={() => {
            setSearch('');
            setSelectedCat(null);
            setSelectedAccessType('all');
          }}
        />
      )}
    </div>
  );
};
