import React from 'react';
import { useRouter, Link, safeScrollTo } from '../router/Router';
import { getCategoryBySlug, filterAndSortTools } from '../services/catalogService';
import { FilterBar } from '../components/FilterBar';
import { ToolCard } from '../components/ToolCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { FilterState, SortOption } from '../types';
import { Layers, ArrowLeft } from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { params, searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();
  const slug = params.slug;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Category Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a category matching "{slug}".
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </div>
    );
  }

  // Pre-scope category in filter state
  const filterState: FilterState = {
    searchQuery: searchParams.get('q') || '',
    sortBy: (searchParams.get('sort') as SortOption) || 'popular',
    category: category.slug,
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
    safeScrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-foreground">
          Categories
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>Category Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Open Source {category.name}
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-4">
          {category.description}
        </p>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground font-medium">Subcategories:</span>
          {category.subcategories.map((sub) => (
            <span
              key={sub.slug}
              className="px-2.5 py-1 rounded-full text-xs bg-muted text-secondary-foreground border border-border"
            >
              {sub.name}
            </span>
          ))}
        </div>
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
    </div>
  );
};
