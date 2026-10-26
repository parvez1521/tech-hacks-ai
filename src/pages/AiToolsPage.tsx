import React from 'react';
import { Link, useRouter, safeScrollTo } from '../router/Router';
import { filterAndSortAiTools, getAiToolBySlug, getAllAiTools, getVideoDiscoveryTools, isCommunityTool } from '../services/aiCatalogService';
import { aiCategories } from '../data/aiToolsData';
import { proprietaryTools } from '../data/alternatives';
import { AiToolCard } from '../components/AiToolCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { CommunityCallout } from '../components/CommunityCallout';
import { AiFilterState, PricingType, FreeAccessType } from '../types';
import { Sparkles, Search, X, SlidersHorizontal, PlusCircle, Video, ArrowRight } from 'lucide-react';

export const AiToolsPage: React.FC = () => {
  const { searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();

  const filterState: AiFilterState = {
    searchQuery: searchParams.get('q') || '',
    category: searchParams.get('category') || null,
    alternativesTo: searchParams.get('alternativesTo') || null,
    pricingType: (searchParams.get('price') as PricingType) || 'all',
    freeAccessType: (searchParams.get('access') as FreeAccessType) || 'all',
    sortBy: (searchParams.get('sort') as any) || 'popular',
    page: parseInt(searchParams.get('page') || '1', 10) || 1,
    videoDiscoverySection: (['self-hosted', 'open-weights', 'browser-demos'].includes(searchParams.get('video') || '')
      ? searchParams.get('video') : 'all') as any,
  };

  const { tools, totalCount, totalPages, currentPage } = filterAndSortAiTools(filterState);
  const availableCategories = aiCategories.filter((cat) => getAllAiTools().some((tool) => !isCommunityTool(tool) && tool.category === cat.id));
  const alternativeTargetName = filterState.alternativesTo
    ? getAiToolBySlug(filterState.alternativesTo)?.name
      || proprietaryTools.find((tool) => tool.slug === filterState.alternativesTo)?.name
      || filterState.alternativesTo
    : null;

  const handleSearchChange = (q: string) => {
    setSearchParams({ q: q || null, page: null }, { replace: true });
  };

  const handleCategoryChange = (cat: string | null) => {
    setSearchParams({ category: cat, page: null, video: null });
  };

  const handleVideoSectionChange = (section: string | null) => {
    setSearchParams({ category: 'video', video: section, page: null });
  };

  const videoCollections = [
    { id: 'self-hosted', title: 'Truly free & self-hosted', description: 'Run the application locally. Check whether inference uses local hardware, a free API key or an optional paid provider.', count: getVideoDiscoveryTools('self-hosted').length },
    { id: 'open-weights', title: 'Open-weight models', description: 'Model checkpoints for developers and GPU users, with version-specific licenses and documented hardware needs.', count: getVideoDiscoveryTools('open-weights').length },
    { id: 'browser-demos', title: 'Browser-based demos', description: 'Try hosted workflows without installing full model weights. Accounts, quotas and queue times vary.', count: getVideoDiscoveryTools('browser-demos').length },
  ];
  const selectedVideoCollection = filterState.videoDiscoverySection !== 'all' ? filterState.videoDiscoverySection : null;
  const visibleVideoCount = selectedVideoCollection
    ? filterAndSortAiTools({ ...filterState, videoDiscoverySection: selectedVideoCollection, page: 1 }).totalCount
    : totalCount;

  const handlePriceChange = (price: string) => {
    setSearchParams({ price: price === 'all' ? null : price, page: null });
  };

  const handleAccessChange = (access: string) => {
    setSearchParams({ access: access === 'all' ? null : access, page: null });
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Curated AI Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              AI Tools Directory: Discover & Compare AI Platforms
            </h1>
          </div>
          <Link
            to="/submit-tool"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a Tool</span>
          </Link>
        </div>
        <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mb-6">
          Search and compare AI tools for video, images, voice, coding, research, and automation. Review each tool's use case, free-access model, features, and official source before choosing a platform.
        </p>

        <Link
          to="/ai-video-tools"
          className="mb-6 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm transition-colors hover:border-primary/50 hover:bg-primary/10"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Video className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-foreground">Looking specifically for AI video generators?</span>
            <span className="mt-1 block text-xs leading-relaxed text-secondary-foreground">Compare text-to-video, image-to-video, free-entry, and open-model options on our focused video tools page.</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </Link>

        {/* Search & Main Controls Bar */}
        <div className="p-4 rounded-xl bg-white border border-[#DFE7F3] shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search AI tools by name, features, or tags..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-white border border-[#DFE7F3] text-[#0F172A] placeholder:text-[#64748B] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
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
              <span className="text-[#64748B]">Price:</span>
              <select
                aria-label="Filter by pricing tier"
                value={filterState.pricingType}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="bg-white border border-[#DFE7F3] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
              >
                <option value="all">All Tiers</option>
                <option value="free">100% Free</option>
                <option value="freemium">Freemium</option>
                <option value="free-trial">Free Trial</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>

            {/* Access model filter keeps recurring hosted plans distinct from open-source software. */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748B]">Access:</span>
              <select
                aria-label="Filter by access model"
                value={filterState.freeAccessType || 'all'}
                onChange={(e) => handleAccessChange(e.target.value)}
                className="bg-white border border-[#DFE7F3] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
              >
                <option value="all">All Access Models</option>
                <option value="open-source-local">Open Source / Local</option>
                <option value="recurring-free">Recurring Free</option>
                <option value="free-credits">Free Credits</option>
                <option value="limited-free">Limited Free</option>
                <option value="none">Paid / No Free Access</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748B]">Sort:</span>
              <select
                aria-label="Sort AI tools"
                value={filterState.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-[#DFE7F3] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Editorial Picks</option>
                <option value="latest">Latest Release</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>
            </div>

            {(filterState.searchQuery || filterState.category || filterState.alternativesTo || filterState.pricingType !== 'all' || (filterState.freeAccessType && filterState.freeAccessType !== 'all')) && (
              <button
                type="button"
                onClick={resetSearchParams}
                className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline ml-1 cursor-pointer font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {filterState.alternativesTo && (
          <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-secondary-foreground">
            <span>Showing catalog relationships for <strong className="text-foreground">{alternativeTargetName}</strong>.</span>
            <button
              type="button"
              onClick={() => setSearchParams({ alternativesTo: null, page: null })}
              className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Clear relationship filter
            </button>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            type="button"
            onClick={() => handleCategoryChange(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
              !filterState.category
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-[#EAF2FF] hover:text-[#2563EB] border border-[#DFE7F3]'
            }`}
          >
            All Categories
          </button>
           {availableCategories.map((cat) => {
            const isSelected = filterState.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(isSelected ? null : cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-white text-[#64748B] hover:bg-[#EAF2FF] hover:text-[#2563EB] border border-[#DFE7F3]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {filterState.category === 'video' && (
          <section className="mt-5 mb-7" aria-labelledby="video-discovery-heading">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="video-discovery-heading" className="text-lg font-bold text-foreground">Free video generation, clearly sorted</h2>
                <p className="mt-1 max-w-3xl text-xs leading-relaxed text-secondary-foreground">Choose a workflow first. Local apps, downloadable weights and hosted demos have different costs, requirements and licenses.</p>
              </div>
              {selectedVideoCollection && <button type="button" onClick={() => handleVideoSectionChange(null)} className="self-start rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Show all video tools</button>}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {videoCollections.filter((collection) => collection.count > 0).map((collection) => {
                const selected = selectedVideoCollection === collection.id;
                const matchingCount = filterAndSortAiTools({ ...filterState, videoDiscoverySection: collection.id as any, page: 1 }).totalCount;
                return (
                  <button key={collection.id} type="button" aria-pressed={selected} onClick={() => handleVideoSectionChange(selected ? null : collection.id)} className={`rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-accent/40'}`}>
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-foreground">{collection.title}</span>
                      <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">{matchingCount}</span>
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-secondary-foreground">{collection.description}</span>
                  </button>
                );
              })}
            </div>
            {selectedVideoCollection === 'browser-demos' && <p className="mt-3 rounded-lg border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">Hugging Face Spaces is a collection, not one generator. Individual demos may need sign-in and may have queues, account quotas or limited availability.</p>}
          </section>
        )}

        <p className="mb-3 text-xs text-secondary-foreground" aria-live="polite">Showing {tools.length} of {visibleVideoCount} matching tools</p>
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

      <section className="mt-14 grid gap-5 lg:grid-cols-2" aria-labelledby="ai-tool-selection-heading">
        <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
          <h2 id="ai-tool-selection-heading" className="text-xl font-bold text-foreground">How to choose the right AI tool</h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary-foreground">
            Start with the task, not the brand name. Compare what the tool actually does, the inputs and outputs it supports, and whether it runs in a browser, through an API, or on your own hardware.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-secondary-foreground marker:text-primary">
            <li><strong className="text-foreground">Check access carefully:</strong> a free plan, one-time trial credits, open weights, and paid-only access are different things.</li>
            <li><strong className="text-foreground">Read the constraints:</strong> review usage limits, account requirements, license terms, hardware needs, and privacy policies before relying on a tool.</li>
            <li><strong className="text-foreground">Verify at the source:</strong> plans and features change. Follow the official product or pricing link on each listing for current terms.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground">Browse AI tools by task</h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary-foreground">
            If you already know what you want to make, use a focused directory instead of searching every category.
          </p>
          <div className="mt-4 grid gap-2">
            <Link to="/ai-video-tools" className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40">
              <span>AI video generators and text-to-video tools</span><span className="text-primary" aria-hidden="true">→</span>
            </Link>
            <Link to="/free-ai-sites" className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40">
              <span>Free AI sites and free-access options</span><span className="text-primary" aria-hidden="true">→</span>
            </Link>
            <Link to="/alternatives" className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40">
              <span>Alternatives to popular software</span><span className="text-primary" aria-hidden="true">→</span>
            </Link>
            <Link to="/guides" className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40">
              <span>Practical AI guides and workflows</span><span className="text-primary" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Contribution Callout */}
      <CommunityCallout type="tool" className="mt-12" />
    </div>
  );
};
