import React from 'react';
import { Link, useRouter, safeScrollTo } from '../router/Router';
import { filterAndSortAiTools } from '../services/aiCatalogService';
import { aiCategories } from '../data/aiToolsData';
import { AiToolCard } from '../components/AiToolCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { CommunityCallout } from '../components/CommunityCallout';
import { AiFilterState, PricingType } from '../types';
import { Sparkles, Search, X, SlidersHorizontal, PlusCircle } from 'lucide-react';

export const AiToolsPage: React.FC = () => {
  const { searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();

  const filterState: AiFilterState = {
    searchQuery: searchParams.get('q') || '',
    category: searchParams.get('category') || null,
    pricingType: (searchParams.get('price') as PricingType) || 'all',
    sortBy: (searchParams.get('sort') as any) || 'popular',
    page: parseInt(searchParams.get('page') || '1', 10) || 1,
  };

  const { tools, totalCount, totalPages, currentPage } = filterAndSortAiTools(filterState);

  const handleSearchChange = (q: string) => {
    setSearchParams({ q: q || null, page: null }, { replace: true });
  };

  const handleCategoryChange = (cat: string | null) => {
    setSearchParams({ category: cat, page: null });
  };

  const handlePriceChange = (price: string) => {
    setSearchParams({ price: price === 'all' ? null : price, page: null });
  };

  const handleSortChange = (sort: string) => {
    setSearchParams({ sort: sort === 'popular' ? null : sort, page: null });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParam('page', newPage.toString());
    safeScrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Curated AI Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Discover Best AI Tools & Generative Platforms
            </h1>
          </div>
          <Link
            to="/submit-tool"
             className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs transition-colors shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a Tool</span>
          </Link>
        </div>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          Explore top generative video, image, voice, coding, and workflow automation models. Filter by pricing tier, features, and user ratings.
        </p>

        {/* Search & Main Controls Bar */}
        <div className="p-3 rounded-lg bg-card/60 border border-border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search AI tools by name, features, or tags..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Pricing & Sort Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Pricing Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Price:</span>
              <select
                value={filterState.pricingType}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Tiers</option>
                <option value="free">100% Free</option>
                <option value="freemium">Freemium</option>
                <option value="free-trial">Free Trial</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Sort:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="latest">Latest Release</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>
            </div>

            {(filterState.searchQuery || filterState.category || filterState.pricingType !== 'all') && (
              <button
                type="button"
                onClick={resetSearchParams}
                className="text-primary hover:underline ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            type="button"
            onClick={() => handleCategoryChange(null)}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
              !filterState.category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
            }`}
          >
            All Categories
          </button>
          {aiCategories.map((cat) => {
            const isSelected = filterState.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(isSelected ? null : cat.id)}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty State */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <AiToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No AI tools found matching "${filterState.searchQuery}".`}
          onReset={resetSearchParams}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Community Contribution Callout */}
      <CommunityCallout type="tool" className="mt-12" />
    </div>
  );
};
