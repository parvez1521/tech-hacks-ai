import React, { useState } from 'react';
import { Link } from '../router/Router';
import { getAllGuides } from '../services/aiCatalogService';
import { guideCategories } from '../data/guidesData';
import { GuideCard } from '../components/GuideCard';
import { EmptyState } from '../components/EmptyState';
import { CommunityCallout } from '../components/CommunityCallout';
import { BookOpen, Search, X, PenTool } from 'lucide-react';

export const GuidesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const allGuides = getAllGuides();

  const filteredGuides = allGuides.filter((guide) => {
    if (selectedCat && guide.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = guide.title.toLowerCase().includes(q);
      const matchSummary = guide.summary.toLowerCase().includes(q);
      const matchTags = guide.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchTags;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Practical AI & Dev Tutorials</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Step-by-Step AI Guides & Workflows
            </h1>
          </div>
          <Link
            to="/submit-guide"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md shadow-primary/20 transition-all shrink-0 self-start sm:self-auto"
          >
            <PenTool className="w-4 h-4" />
            <span>Submit a Guide</span>
          </Link>
        </div>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          Learn how to combine cutting-edge generative models, open-source frameworks, and developer workflows with step-by-step instructions and copyable prompt templates.
        </p>

        {/* Quick Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides by title, tools, or keywords..."
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
            Showing <strong className="text-foreground">{filteredGuides.length}</strong> guides
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
            All Guides ({allGuides.length})
          </button>
          {guideCategories.map((cat) => {
            const count = allGuides.filter((g) => g.category === cat.slug).length;
            const isSelected = selectedCat === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(isSelected ? null : cat.slug)}
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
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No guides found matching "${search}".`}
          onReset={() => {
            setSearch('');
            setSelectedCat(null);
          }}
        />
      )}

      {/* Community Contribution Callout */}
      <CommunityCallout type="guide" className="mt-12" />
    </div>
  );
};
