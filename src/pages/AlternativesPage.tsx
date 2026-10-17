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
  const relevantCategories = categories.filter((c) => availableCategorySlugs.includes(c.slug));

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
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Replace className="w-4 h-4" />
          <span>Proprietary Replacements</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Browse Open Source Software Alternatives
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          Find self-hostable and community-maintained open-source replacements for everyday proprietary SaaS tools like Figma, Notion, Airtable, and Firebase.
        </p>

        {/* Search & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search proprietary software (e.g. Notion, Figma, Airtable)..."
              className="w-full pl-9 pr-9 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="text-xs text-muted-foreground self-center">
            Showing <strong className="text-foreground">{filteredAlternatives.length}</strong> proprietary {filteredAlternatives.length === 1 ? 'target' : 'targets'}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            type="button"
            onClick={() => handleCategorySelect(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
              !selectedCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
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
                onClick={() => handleCategorySelect(isSelected ? null : cat.slug)}
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
