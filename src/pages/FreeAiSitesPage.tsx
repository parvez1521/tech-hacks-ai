import React, { useState } from 'react';
import { getFreeAiTools } from '../services/aiCatalogService';
import { aiCategories } from '../data/aiToolsData';
import { AiToolCard } from '../components/AiToolCard';
import { EmptyState } from '../components/EmptyState';
import { Gift, Search, X, Server, CheckCircle2, SlidersHorizontal, Sparkles, Unlock } from 'lucide-react';
import type { FreeAccessType } from '../types';

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
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Gift className="w-3.5 h-3.5" />
          <span>Independently Verified • Zero Upfront Cost</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Free AI Sites & Generative Tools
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-3xl leading-relaxed mb-6">
          Explore {allFreeTools.length} tested and verified AI platforms you can use at zero cost. Clearly partitioned between self-hosted open-source software and commercial SaaS with recurring free tiers.
        </p>

        {/* Informational Callout: Open Source vs Hosted Commercial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-card/60 border border-border/80 mb-6 text-xs text-secondary-foreground">
          <div className="flex items-start gap-2.5">
            <Server className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold block mb-0.5">100% Free & Open Source Local AI</strong>
              <span>Tools like Ollama, Open WebUI, and ComfyUI run on your own hardware with no cloud fees, data logging, or subscriptions.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold block mb-0.5">Hosted Freemium & Free-Plan SaaS</strong>
              <span>Cloud services like Claude, ChatGPT, and Perplexity offer permanent free quotas with no credit card required.</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="space-y-4">
          {/* Access Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedAccessType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedAccessType === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border/60'
              }`}
            >
              All Free Access ({allFreeTools.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedAccessType('open-source-local')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedAccessType === 'open-source-local'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-card text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>100% Open Source & Local ({openSourceCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedAccessType('recurring-free')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedAccessType === 'recurring-free'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-card text-blue-400 hover:bg-blue-500/10 border border-blue-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recurring Free Plan ({recurringCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedAccessType('no-account')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedAccessType === 'no-account'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-card text-purple-400 hover:bg-purple-500/10 border border-purple-500/20'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>No Account Required ({noAccountCount})</span>
            </button>
          </div>

          {/* Quick Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, features, or tags..."
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              >
              </input>
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-1.5 px-2.5 rounded-lg bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="latest">Latest Released</option>
                  <option value="name_asc">Name A-Z</option>
                </select>
              </div>

              <span className="text-xs text-muted-foreground">
                Showing <strong className="text-foreground">{filteredTools.length}</strong> tools
              </span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedCat(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                !selectedCat
                  ? 'bg-muted text-foreground border border-primary/40 font-semibold'
                  : 'text-muted-foreground hover:text-foreground border border-border/50'
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
                  className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-muted text-foreground border border-primary/40 font-semibold'
                      : 'text-muted-foreground hover:text-foreground border border-border/50'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
