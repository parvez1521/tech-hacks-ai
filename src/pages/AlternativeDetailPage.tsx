import React, { useState } from 'react';
import { useRouter, Link, safeScrollTo } from '../router/Router';
import { getProprietaryToolBySlug, getToolsForProprietary, getCategoryBySlug } from '../services/catalogService';
import { getAllGuides } from '../services/aiCatalogService';
import { ReplacementCard } from '../components/ReplacementCard';
import { GuideCard } from '../components/GuideCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { SortOption } from '../types';
import { Replace, ExternalLink, ArrowLeft, Search, X, SlidersHorizontal, CheckCircle2, AlertTriangle, Scale, BookOpen, Share2, Check } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';

const PAGE_SIZE = 12;

export const AlternativeDetailPage: React.FC = () => {
  const { params, searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();
  const slug = params.slug;
  const proprietary = getProprietaryToolBySlug(slug);
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${siteConfig.url}/alternatives/${proprietary.slug}`;
      navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Find related guides for this alternative
  const allGuides = getAllGuides();
  const relatedGuides = allGuides.filter(
    (g) =>
      g.relatedToolSlugs.some((s) => allReplacements.some((r) => r.slug === s)) ||
      (proprietary.slug === 'claude-code' && (g.slug === 'how-to-choose-ai-coding-assistant' || g.category === 'coding')) ||
      (proprietary.slug === 'perplexity' && (g.slug === 'automating-research-perplexity-n8n' || g.category === 'productivity')) ||
      (proprietary.slug === 'firebase' && g.slug === 'building-apps-with-cursor-supabase') ||
      g.category === proprietary.category
  ).slice(0, 2);

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
              <Link
                to={`/categories/${category.slug}`}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-secondary-foreground border border-border hover:bg-border transition-colors"
              >
                Category: {category.name}
              </Link>
            )}
            {allReplacements.length >= 2 && (
              <Link
                to={`/compare?tools=${allReplacements.slice(0, 3).map((r) => r.slug).join(',')}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium hover:bg-purple-500/20 transition-colors"
              >
                <Scale className="w-3 h-3" />
                <span>Compare Top Replacements</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Sticky Proprietary Profile Card */}
        <div className="p-5 rounded-xl border border-border bg-card/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
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

              <button
                type="button"
                onClick={handleCopyLink}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-xs inline-flex items-center gap-1"
                aria-label="Share alternative"
                title="Copy canonical share link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
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

      {/* Migration Analysis & Honest Cost Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl border border-border bg-card/60 text-xs mb-8">
        <div>
          <span className="font-semibold text-foreground uppercase tracking-wider block text-[11px] mb-2">
            Why Teams Look for {proprietary.name} Alternatives
          </span>
          <ul className="space-y-2">
            {(proprietary.migrationDrivers || [
              'High recurring monthly subscription costs scaling per team seat',
              'Proprietary data formats creating vendor lock-in',
              'Compliance and sovereignty requirements for self-hosting on private clouds',
            ]).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-card/80 border border-border/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-secondary-foreground leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-foreground">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase text-[11px] tracking-wider mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Hosting & Inference Reality</span>
            </div>
            <p className="text-secondary-foreground leading-relaxed text-[11px]">
              {proprietary.hostedCostNote ||
                'Open-source software is free to inspect, modify, and self-host on your own infrastructure. Note that cloud API tokens (such as external LLM inference) or managed cloud hosting tiers may carry separate server or usage costs.'}
            </p>
          </div>

          {proprietary.selectionCriteria && proprietary.selectionCriteria.length > 0 && (
            <div className="p-3 rounded-lg bg-card/80 border border-border/80">
              <span className="font-semibold text-foreground uppercase tracking-wider block text-[11px] mb-1.5">
                Key Selection Factors
              </span>
              <ul className="space-y-1 text-muted-foreground text-[11px]">
                {proprietary.selectionCriteria.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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

      {/* Related Step-by-Step Guides Section */}
      {relatedGuides.length > 0 && (
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Migration & Workflow Tutorials</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Step-by-Step Guides for {proprietary.name} Replacements
              </h2>
            </div>
            <Link to="/guides" className="text-xs text-primary hover:underline">
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
