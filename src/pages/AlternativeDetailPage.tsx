import React from 'react';
import { useRouter, Link, safeScrollTo } from '../router/Router';
import { getProprietaryToolBySlug, filterAndSortTools } from '../services/catalogService';
import { FilterBar } from '../components/FilterBar';
import { ToolCard } from '../components/ToolCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { FilterState, SortOption } from '../types';
import { Replace, ExternalLink, ArrowLeft } from 'lucide-react';

export const AlternativeDetailPage: React.FC = () => {
  const { params, searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();
  const slug = params.slug;
  const proprietary = getProprietaryToolBySlug(slug);

  if (!proprietary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Software Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a proprietary software target matching "{slug}".
        </p>
        <Link
          to="/alternatives"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Alternatives</span>
        </Link>
      </div>
    );
  }

  // Filter scoped to this proprietary tool
  const filterState: FilterState = {
    searchQuery: searchParams.get('q') || '',
    sortBy: (searchParams.get('sort') as SortOption) || 'popular',
    category: searchParams.get('category') || null,
    alternativeTo: proprietary.slug,
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
    safeScrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link to="/alternatives" className="hover:text-foreground">
          Alternatives
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{proprietary.name}</span>
      </nav>

      {/* Hero Header with Proprietary Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
        {/* Left Headline */}
        <div className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Replace className="w-4 h-4" />
            <span>Open Source Replacements</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Open Source {proprietary.name} Alternatives
          </h1>
          <p className="text-sm sm:text-base text-secondary-foreground leading-relaxed">
            Discover community-maintained, privacy-focused open source software tools that can replace {proprietary.name}. Save subscription costs and gain total ownership over your data.
          </p>
        </div>

        {/* Right Sticky Proprietary Profile Card */}
        <div className="p-5 rounded-xl border border-border bg-card/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ backgroundColor: proprietary.iconBgColor }}
              >
                {proprietary.iconLetter}
              </div>
              <h2 className="font-bold text-foreground text-base">
                {proprietary.name}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {proprietary.description}
            </p>
          </div>

          <a
            href={proprietary.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted hover:bg-border text-foreground text-xs font-medium transition-colors"
          >
            <span>Visit {proprietary.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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

      {/* Matching Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No open source alternatives found matching your search for ${proprietary.name}.`}
          onReset={resetSearchParams}
        />
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
