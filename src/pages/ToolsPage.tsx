import React from 'react';
import { FilterBar } from '../components/FilterBar';
import { ToolCard } from '../components/ToolCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { useRouter, safeScrollTo } from '../router/Router';
import { filterAndSortTools } from '../services/catalogService';
import { FilterState, SortOption } from '../types';
import { FolderKanban } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const { searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();

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
    safeScrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
          <span>Full Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">
          All Open Source Software Tools
        </h1>
        <p className="text-sm sm:text-base text-[#475569] max-w-2xl">
          Search and filter the complete index of hand-picked open-source software, developer tools, and privacy-respecting platforms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        filterState={filterState}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onResetFilters={resetSearchParams}
        totalResults={totalCount}
      />

      {/* Results Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} headingLevel={2} />
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
    </div>
  );
};
