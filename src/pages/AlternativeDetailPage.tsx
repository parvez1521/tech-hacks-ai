import React from 'react';
import { useRouter, Link, safeScrollTo } from '../router/Router';
import { getProprietaryToolBySlug, getToolsForProprietary, getCategoryBySlug } from '../services/catalogService';
import { ReplacementCard } from '../components/ReplacementCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { SortOption } from '../types';
import { Replace, ExternalLink, ArrowLeft, Search, X, SlidersHorizontal } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

const PAGE_SIZE = 12;

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Alternatives</span>
        </Link>
      </div>
    );
  }

  // All open source tools mapped to this proprietary target
  const allReplacements = getToolsForProprietary(proprietary.slug);
  const category = getCategoryBySlug(proprietary.category);

  // Distinct licenses among mapped replacements
  const availableLicenses = Array.from(new Set(allReplacements.map((t) => t.license))).sort();

  // Local filter parameters from URL
  const searchQuery = searchParams.get('q') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'stars';
  const selectedLicense = searchParams.get('license') || null;
  const currentPage = parseInt(searchParams.get('page') || '1', 10) || 1;

  // Filter and sort replacements
  let filteredReplacements = [...allReplacements];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredReplacements = filteredReplacements.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchTagline = tool.tagline.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchStack = tool.techStack.some((s) => s.toLowerCase().includes(q));
      const matchLicense = tool.license.toLowerCase().includes(q);
      return matchName || matchTagline || matchDesc || matchStack || matchLicense;
    });
  }

  if (selectedLicense) {
    filteredReplacements = filteredReplacements.filter(
      (t) => t.license.toLowerCase() === selectedLicense.toLowerCase()
    );
  }

  filteredReplacements.sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.starGrowthDelta - a.starGrowthDelta;
      case 'forks':
        return b.forks - a.forks;
      case 'last_commit':
        return new Date(b.lastCommitDate).getTime() - new Date(a.lastCommitDate).getTime();
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'stars':
      default:
        return b.stars - a.stars;
    }
  });

  const totalCount = filteredReplacements.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedTools = filteredReplacements.slice((validPage - 1) * PAGE_SIZE, validPage * PAGE_SIZE);

  const handleSearchChange = (q: string) => {
    setSearchParams({ q: q || null, page: null }, { replace: true });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams({ sort: newSort === 'stars' ? null : newSort, page: null });
  };

  const handleLicenseChange = (license: string | null) => {
    setSearchParams({ license, page: null });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParam('page', newPage.toString());
    safeScrollTo({ top: 350, behavior: 'smooth' });
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
          <p className="text-sm sm:text-base text-secondary-foreground leading-relaxed mb-4">
            Discover community-maintained, privacy-focused open source software tools that can replace {proprietary.name}. Save subscription costs and gain total ownership over your data.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              {allReplacements.length} {allReplacements.length === 1 ? 'verified replacement' : 'verified replacements'}
            </span>
            {category && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-secondary-foreground border border-border">
                {category.name}
              </span>
            )}
          </div>
        </div>

        {/* Right Sticky Proprietary Profile Card */}
        <div className="p-5 rounded-xl border border-border bg-card/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <BrandLogo
                slug={proprietary.slug}
                name={proprietary.name}
                size="lg"
                iconBgColor={proprietary.iconBgColor}
                iconLetter={proprietary.iconLetter}
              />
              <div>
                <h2 className="font-bold text-foreground text-base">
                  {proprietary.name}
                </h2>
                <span className="text-xs text-muted-foreground block">
                  Proprietary Software
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {proprietary.description}
            </p>
          </div>

          <a
            href={proprietary.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted hover:bg-border text-foreground text-xs font-medium transition-colors"
          >
            <span>Visit {proprietary.name} Official Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Local Search and Filter Controls (only if this app has mapped replacements) */}
      {allReplacements.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-card/60 border border-border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search replacements */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${proprietary.name} alternatives...`}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Sort and License filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Sort select */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-card border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="stars">Most Starred</option>
                <option value="trending">Trending Velocity</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="last_commit">Recently Updated</option>
              </select>
            </div>

            {/* License filter */}
            {availableLicenses.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">License:</span>
                <select
                  value={selectedLicense || ''}
                  onChange={(e) => handleLicenseChange(e.target.value || null)}
                  className="bg-card border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Licenses</option>
                  {availableLicenses.map((lic) => (
                    <option key={lic} value={lic}>
                      {lic}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(searchQuery || selectedLicense || sortBy !== 'stars') && (
              <button
                type="button"
                onClick={resetSearchParams}
                className="text-primary hover:underline ml-1"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid or Empty States */}
      {allReplacements.length === 0 ? (
        <div className="p-8 rounded-lg border border-border bg-card/60 text-center max-w-xl mx-auto my-8">
          <Replace className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-foreground mb-2">
            No Alternatives Mapped Yet
          </h3>
          <p className="text-xs text-secondary-foreground mb-4">
            We haven't indexed any verified open source software replacements for {proprietary.name} yet.
          </p>
          <Link
            to="/alternatives"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Other Alternatives</span>
          </Link>
        </div>
      ) : paginatedTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {paginatedTools.map((tool) => (
            <ReplacementCard
              key={tool.id}
              tool={tool}
              proprietaryName={proprietary.name}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No open source alternatives matching "${searchQuery}" found for ${proprietary.name}.`}
          onReset={resetSearchParams}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={validPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
