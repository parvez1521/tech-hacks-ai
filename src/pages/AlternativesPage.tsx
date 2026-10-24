import React from 'react';
import { proprietaryTools } from '../data/alternatives';
import { categories } from '../data/categories';
import { AlternativeCard } from '../components/AlternativeCard';
import { EmptyState } from '../components/EmptyState';
import { useRouter } from '../router/Router';
import { Replace, Search, X } from 'lucide-react';

export const AlternativesPage: React.FC = () => {
  const { searchParams, setSearchParams, resetSearchParams } = useRouter();

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || null;

  // Categories present in proprietary tools
  const availableCategorySlugs = Array.from(new Set(proprietaryTools.map((p) => p.category)));
  const relevantCategories = [
    ...categories.filter((c) => availableCategorySlugs.includes(c.slug)),
    ...(availableCategorySlugs.includes('video-creation') && !categories.some((c) => c.slug === 'video-creation')
      ? [{ id: 'video-creation', slug: 'video-creation', name: 'Video creation' }]
      : []),
  ];

  const handleSearchChange = (val: string) => {
    setSearchParams({ q: val ? val : null }, { replace: true });
  };

  const handleCategorySelect = (catSlug: string | null) => {
    setSearchParams({ category: catSlug });
  };

  const filteredAlternatives = proprietaryTools.filter((p) => {
    // 1. Category filter
    if (selectedCategory && p.category !== selectedCategory) {
      return false;
    }

    // 2. Text query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTagline = p.tagline.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      return matchName || matchTagline || matchDesc || matchCat;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Replace className="w-3.5 h-3.5 text-primary" />
          <span>Proprietary Replacements</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Browse Open Source Alternatives
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          Browse Open Source Software Alternatives and related AI tools for proprietary products. Video recommendations include partial alternatives, local apps and model workflows.
        </p>

        {/* Search & Filter Controls Bar */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="alternatives-search" className="sr-only">Search proprietary software alternatives</label>
            <input
              id="alternatives-search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search proprietary software (e.g. Notion, Figma, Airtable)..."
              className="w-full min-h-11 pl-9 pr-9 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 min-h-11 min-w-11 inline-flex items-center justify-center text-muted-foreground hover:text-foreground rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="text-xs text-muted-foreground self-center">
            Showing <strong className="text-foreground font-mono">{filteredAlternatives.length}</strong> proprietary {filteredAlternatives.length === 1 ? 'target' : 'targets'}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2" role="group" aria-label="Filter alternatives by category">
          <button
            type="button"
            aria-pressed={!selectedCategory}
            onClick={() => handleCategorySelect(null)}
            className={`min-h-11 px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              !selectedCategory
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-accent hover:text-primary border border-border'
            }`}
          >
            All Categories ({proprietaryTools.length})
          </button>
          {relevantCategories.map((cat) => {
            const count = proprietaryTools.filter((p) => p.category === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleCategorySelect(isSelected ? null : cat.slug)}
                className={`min-h-11 px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-primary border border-border'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredAlternatives.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlternatives.map((alt) => (
            <AlternativeCard key={alt.id} alternative={alt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No proprietary software found matching "${searchQuery}".`}
          onReset={resetSearchParams}
        />
      )}
    </div>
  );
};
