import React, { useState } from 'react';
import { getFreeAiTools } from '../services/aiCatalogService';
import { aiCategories } from '../data/aiToolsData';
import { AiToolCard } from '../components/AiToolCard';
import { EmptyState } from '../components/EmptyState';
import { Gift, Search, X } from 'lucide-react';

export const FreeAiSitesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const allFreeTools = getFreeAiTools();

  const filteredTools = allFreeTools.filter((tool) => {
    if (selectedCat && tool.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = tool.name.toLowerCase().includes(q);
      const matchTagline = tool.tagline.toLowerCase().includes(q);
      const matchTags = tool.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchTagline || matchTags;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Gift className="w-4 h-4" />
          <span>Zero Upfront Cost</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Free AI Sites & Generative Tools
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          A hand-picked collection of AI platforms offering completely free tiers, generous monthly trial credits, or open-weight models you can run without paying.
        </p>

        {/* Quick Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search free AI tools by name or capabilities..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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

          <span className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredTools.length}</strong> free & freemium AI sites
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            type="button"
            onClick={() => setSelectedCat(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
              !selectedCat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
            }`}
          >
            All Free Tools ({allFreeTools.length})
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
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
          }}
        />
      )}
    </div>
  );
};
