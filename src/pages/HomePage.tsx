import React from 'react';
import { Hero } from '../components/Hero';
import { FilterBar } from '../components/FilterBar';
import { ToolCard } from '../components/ToolCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { useRouter, safeScrollTo } from '../router/Router';
import { filterAndSortTools } from '../services/catalogService';
import { FilterState, SortOption } from '../types';

export const HomePage: React.FC = () => {
  const { searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();

  // Read filter state from URL search params
  const filterState: FilterState = {
    searchQuery: searchParams.get('q') || '',
    sortBy: (searchParams.get('sort') as SortOption) || 'popular',
    category: searchParams.get('category') || null,
    alternativeTo: searchParams.get('alt') || null,
    techStack: searchParams.get('stack') || null,
    license: searchParams.get('license') || null,
    page: parseInt(searchParams.get('page') || '1', 10) || 1,
  };

  const { tools, totalCount, totalPages, currentPage } = filterAndSortTools(filterState);

  const handleSearchChange = (q: string) => {
    setSearchParams({ q: q || null, page: null }, { replace: true });
  };

  const handleSortChange = (sort: SortOption) => {
    setSearchParams({ sort: sort === 'popular' ? null : sort, page: null });
  };

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    const paramKey =
      key === 'alternativeTo'
        ? 'alt'
        : key === 'techStack'
        ? 'stack'
        : (key as string);
    setSearchParams({ [paramKey]: value, page: null });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParam('page', newPage.toString());
    safeScrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Header */}
      <Hero />

      {/* Main Software Discovery Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Filter & Search Bar */}
        <FilterBar
          filterState={filterState}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          onResetFilters={resetSearchParams}
          totalResults={totalCount}
        />

        {/* Tools Grid or Empty State */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState onReset={resetSearchParams} />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
};
