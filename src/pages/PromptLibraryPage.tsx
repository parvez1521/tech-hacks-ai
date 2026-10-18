import React, { useState } from 'react';
import { getAllPrompts } from '../services/aiCatalogService';
import { promptCategories, promptProviders } from '../data/promptsData';
import { PromptCard } from '../components/PromptCard';
import { EmptyState } from '../components/EmptyState';
import { MessageSquareCode, Search, X, Sparkles, Filter } from 'lucide-react';

export const PromptLibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const allPrompts = getAllPrompts();

  const filteredPrompts = allPrompts.filter((p) => {
    if (selectedCat && p.category !== selectedCat) return false;
    
    if (selectedProvider) {
      const q = selectedProvider.toLowerCase();
      const matchProvider = p.provider && p.provider.toLowerCase().includes(q);
      const matchModel = p.targetModel.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchProvider && !matchModel && !matchTags) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchPrompt = p.promptText.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchModel = p.targetModel.toLowerCase().includes(q);
      const matchProvider = p.provider ? p.provider.toLowerCase().includes(q) : false;
      const matchPlaceholders = p.placeholders ? p.placeholders.some((ph) => ph.toLowerCase().includes(q)) : false;
      return matchTitle || matchDesc || matchPrompt || matchTags || matchModel || matchProvider || matchPlaceholders;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquareCode className="w-4 h-4" />
          <span>Curated Prompt Recipes & Workflows</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          AI Prompt Library & Creative Recipes
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          High-performance prompt recipes engineered for Gemini Nano Banana, Claude 3.5 Sonnet, Higgsfield AI, FLUX.1, and Cursor with customizable placeholders and verified developer workflows.
        </p>

        {/* Quick Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, placeholder, provider, or model..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredPrompts.length}</strong> of {allPrompts.length} prompt recipes
          </span>
        </div>

        {/* Provider Filter Tabs */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Filter by Provider / Engine:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {promptProviders.map((prov) => {
              const isSelected = (!prov.filterValue && !selectedProvider) || (selectedProvider === prov.filterValue);
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setSelectedProvider(prov.filterValue)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                      : 'bg-muted/70 text-secondary-foreground hover:bg-muted border border-border/60 hover:text-foreground'
                  }`}
                >
                  {prov.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 14 Category Pills */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Filter by Category (14 Curated Domains):</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              type="button"
              onClick={() => setSelectedCat(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                !selectedCat
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
              }`}
            >
              All Categories ({allPrompts.length})
            </button>
            {promptCategories.map((cat) => {
              const count = allPrompts.filter((p) => p.category === cat.slug).length;
              const isSelected = selectedCat === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(isSelected ? null : cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
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
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No prompts found matching your criteria.`}
          onReset={() => {
            setSearch('');
            setSelectedCat(null);
            setSelectedProvider(null);
          }}
        />
      )}
    </div>
  );
};
