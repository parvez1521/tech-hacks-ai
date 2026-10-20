import React, { useState } from 'react';
import { useRouter, Link, safeScrollTo } from '../router/Router';
import { getCategoryBySlug, filterAndSortTools } from '../services/catalogService';
import { getAllGuides } from '../services/aiCatalogService';
import { FilterBar } from '../components/FilterBar';
import { ToolCard } from '../components/ToolCard';
import { GuideCard } from '../components/GuideCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { FilterState, SortOption } from '../types';
import { Layers, ArrowLeft, CheckCircle2, Compass, BookOpen, Share2, Check, Scale } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const CategoryDetailPage: React.FC = () => {
  const { params, searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();
  const slug = params.slug;
  const category = getCategoryBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Category Not Found</h1>
        <p className="text-slate-600 mb-6">
          We couldn't find a category matching &quot;{slug}&quot;.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20"
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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${siteConfig.url}/categories/${category.slug}`;
      navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Find relevant guides for this category
  const allGuides = getAllGuides();
  const relatedGuides = allGuides.filter(
    (g) =>
      g.category.toLowerCase().includes(category.slug.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(category.slug.toLowerCase())) ||
      (category.slug === 'developer-tools' && g.category === 'coding') ||
      (category.slug === 'ai-machine-learning' && (g.category === 'coding' || g.category === 'prompting')) ||
      (category.slug === 'productivity' && g.category === 'productivity')
  ).slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-slate-900 transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{category.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Category Discovery &amp; Buyer Guide</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Open Source {category.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer shadow-xs"
              aria-label={copied ? 'Link Copied!' : 'Share Category'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Category</span>
                </>
              )}
            </button>
            <Link
              to="/compare"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>Compare Tools</span>
            </Link>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed mb-4">
          {category.editorialOverview || category.description}
        </p>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 mb-6">
          <span className="text-xs text-slate-500 font-semibold">Subcategories:</span>
          {category.subcategories.map((sub) => (
            <span
              key={sub.slug}
              className="px-2.5 py-1 rounded-md text-xs bg-slate-50 text-slate-700 border border-slate-200 font-medium"
            >
              {sub.name}
            </span>
          ))}
        </div>

        {/* Editorial Guidance Grid: Audience & Selection Criteria */}
        {(category.targetAudience || category.selectionCriteria || category.keyDifferences) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl border border-[#DFE7F3] bg-white text-xs mb-8 shadow-xs">
            {/* Target Audience & Key Differences */}
            <div className="space-y-4">
              {category.targetAudience && (
                <div>
                  <div className="flex items-center gap-1.5 text-blue-700 font-semibold uppercase text-[11px] tracking-wider mb-1">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span>Who Benefits Most</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {category.targetAudience}
                  </p>
                </div>
              )}

              {category.keyDifferences && category.keyDifferences.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px] mb-2">
                    Key Architectural Trade-Offs
                  </span>
                  <div className="space-y-2">
                    {category.keyDifferences.map((diff) => (
                      <div key={diff.title} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block mb-0.5">{diff.title}</span>
                        <span className="text-slate-600 leading-relaxed block">{diff.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selection Criteria */}
            {category.selectionCriteria && category.selectionCriteria.length > 0 && (
              <div>
                <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px] mb-2">
                  How to Choose Between Options
                </span>
                <ul className="space-y-2">
                  {category.selectionCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-relaxed">{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
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

      {/* Related Step-by-Step Guides Section */}
      {relatedGuides.length > 0 && (
        <div className="mt-16 pt-8 border-t border-[#DFE7F3]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practical Workflows</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Step-by-Step Guides for {category.name}
              </h2>
            </div>
            <Link to="/guides" className="text-xs text-blue-600 font-semibold hover:text-blue-700 hover:underline">
              Browse all guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
