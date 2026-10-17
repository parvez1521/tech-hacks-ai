import React, { useState } from 'react';
import { Search, X, ListFilter, ChevronDown, RotateCcw } from 'lucide-react';
import { FilterState, SortOption } from '../types';
import { categories } from '../data/categories';
import { proprietaryTools } from '../data/alternatives';
import { getDistinctTechStacks, getDistinctLicenses } from '../services/catalogService';

interface FilterBarProps {
  filterState: FilterState;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (key: keyof FilterState, value: string | null) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onSearchChange,
  onSortChange,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const distinctStacks = getDistinctTechStacks();
  const distinctLicenses = getDistinctLicenses();

  // Active filter count (excluding default sort and page)
  const activeFilterCount = [
    filterState.searchQuery ? 1 : 0,
    filterState.category ? 1 : 0,
    filterState.alternativeTo ? 1 : 0,
    filterState.techStack ? 1 : 0,
    filterState.license ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="w-full flex flex-col gap-3 mb-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input Container */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tools by name, description, stack, or tag..."
            aria-label="Search software catalog"
            className="w-full pl-9 pr-9 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          {filterState.searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Action Controls: Filters Toggle + Sort Select */}
        <div className="flex items-center gap-2">
          {/* Filters Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-expanded={isDrawerOpen}
            aria-label="Toggle filter drawer"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
              isDrawerOpen || activeFilterCount > 0
                ? 'bg-accent border-primary/40 text-primary'
                : 'bg-card border-border text-foreground hover:bg-accent'
            }`}
          >
            <ListFilter className="w-4 h-4" aria-hidden="true" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isDrawerOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {/* Sort Combobox */}
          <div className="relative">
            <select
              value={filterState.sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Order tools by"
              className="appearance-none bg-card border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
            >
              <option value="popular">Order by: Most Popular</option>
              <option value="latest">Order by: Latest</option>
              <option value="stars">Order by: Most Stars</option>
              <option value="trending">Order by: Trending</option>
              <option value="forks">Order by: Most Forks</option>
              <option value="last_commit">Order by: Last Commit</option>
              <option value="name_asc">Order by: Name (A to Z)</option>
              <option value="name_desc">Order by: Name (Z to A)</option>
              <option value="oldest">Order by: Oldest</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Expandable Filter Drawer */}
      {isDrawerOpen && (
        <div className="p-4 rounded-lg bg-card/60 border border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
          {/* 1. Alternative To Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-alternative" className="text-xs font-medium text-muted-foreground">Alternative to</label>
            <select
              id="filter-alternative"
              aria-label="Filter by proprietary alternative"
              value={filterState.alternativeTo || ''}
              onChange={(e) => onFilterChange('alternativeTo', e.target.value || null)}
              className="bg-background border border-border text-foreground text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">All Proprietary Apps</option>
              {proprietaryTools.map((alt) => (
                <option key={alt.slug} value={alt.slug}>
                  {alt.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Category Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-category" className="text-xs font-medium text-muted-foreground">Category</label>
            <select
              id="filter-category"
              aria-label="Filter by software category"
              value={filterState.category || ''}
              onChange={(e) => onFilterChange('category', e.target.value || null)}
              className="bg-background border border-border text-foreground text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Tech Stack Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-stack" className="text-xs font-medium text-muted-foreground">Tech Stack</label>
            <select
              id="filter-stack"
              aria-label="Filter by technology stack"
              value={filterState.techStack || ''}
              onChange={(e) => onFilterChange('techStack', e.target.value || null)}
              className="bg-background border border-border text-foreground text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">All Stacks</option>
              {distinctStacks.map((stk) => (
                <option key={stk} value={stk}>
                  {stk}
                </option>
              ))}
            </select>
          </div>

          {/* 4. License Filter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-license" className="text-xs font-medium text-muted-foreground">License</label>
            <select
              id="filter-license"
              aria-label="Filter by open source license"
              value={filterState.license || ''}
              onChange={(e) => onFilterChange('license', e.target.value || null)}
              className="bg-background border border-border text-foreground text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">All Licenses</option>
              {distinctLicenses.map((lic) => (
                <option key={lic} value={lic}>
                  {lic}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filter Badges Row & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-muted-foreground font-medium">
            Showing <strong className="text-foreground">{totalResults}</strong> tools
          </span>

          {filterState.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
              Search: "{filterState.searchQuery}"
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-primary ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.alternativeTo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
              Alternative to: {filterState.alternativeTo}
              <button
                type="button"
                onClick={() => onFilterChange('alternativeTo', null)}
                className="hover:text-primary ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
              Category: {filterState.category}
              <button
                type="button"
                onClick={() => onFilterChange('category', null)}
                className="hover:text-primary ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.techStack && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
              Stack: {filterState.techStack}
              <button
                type="button"
                onClick={() => onFilterChange('techStack', null)}
                className="hover:text-primary ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.license && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
              License: {filterState.license}
              <button
                type="button"
                onClick={() => onFilterChange('license', null)}
                className="hover:text-primary ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
