import React from 'react';
import { useRouter, Link, safeScrollTo } from '../router/Router';
import { getCollectionBySlug } from '../services/catalogService';
import { toolsData } from '../data/seedData';
import { FilterBar } from '../components/FilterBar';
import { ToolCard } from '../components/ToolCard';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { FilterState, SortOption, Tool } from '../types';
import { Flame, HardDrive, Bot, Clock, Sparkles, ArrowLeft } from 'lucide-react';

const collectionIcons: Record<string, React.FC<{ className?: string }>> = {
  trending: Flame,
  'self-hosted': HardDrive,
  'ai-native': Bot,
  latest: Clock,
};

export const CollectionDetailPage: React.FC = () => {
  const { params, searchParams, setSearchParam, setSearchParams, resetSearchParams } = useRouter();
  const slug = params.slug;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Collection Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a curated collection matching "{slug}".
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const IconComponent = collectionIcons[collection.slug] || Sparkles;

  // Filter tools based on collection criteria
  let baseList: Tool[] = [...toolsData];
  if (collection.filterKey === 'self-hosted') {
    baseList = baseList.filter((t) => t.isSelfHostable);
  } else if (collection.filterKey === 'ai-native') {
    baseList = baseList.filter((t) => t.isAiNative);
  } else if (collection.filterKey === 'trending') {
    baseList = baseList.sort((a, b) => b.starGrowthDelta - a.starGrowthDelta);
  } else if (collection.filterKey === 'latest') {
    baseList = baseList.sort(
      (a, b) => new Date(b.lastCommitDate).getTime() - new Date(a.lastCommitDate).getTime()
    );
  }

  // Next, apply user search/filter overrides
  const filterState: FilterState = {
    searchQuery: searchParams.get('q') || '',
    sortBy: (searchParams.get('sort') as SortOption) || (collection.filterKey === 'trending' ? 'trending' : 'popular'),
    category: searchParams.get('category') || null,
    alternativeTo: searchParams.get('alt') || null,
    techStack: searchParams.get('stack') || null,
    license: searchParams.get('license') || null,
    page: parseInt(searchParams.get('page') || '1', 10) || 1,
  };

  if (filterState.searchQuery.trim()) {
    const q = filterState.searchQuery.toLowerCase().trim();
    baseList = baseList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filterState.category) {
    baseList = baseList.filter((t) => t.categories.includes(filterState.category!));
  }

  if (filterState.alternativeTo) {
    baseList = baseList.filter((t) => t.alternativesTo.includes(filterState.alternativeTo!));
  }

  if (filterState.techStack) {
    baseList = baseList.filter((t) =>
      t.techStack.map((s) => s.toLowerCase()).includes(filterState.techStack!.toLowerCase())
    );
  }

  if (filterState.license) {
    baseList = baseList.filter((t) => t.license.toLowerCase() === filterState.license!.toLowerCase());
  }

  // Sorting
  baseList.sort((a, b) => {
    switch (filterState.sortBy) {
      case 'stars':
        return b.stars - a.stars;
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
      case 'popular':
      default:
        return b.stars - a.stars;
    }
  });

  const pageSize = 12;
  const totalCount = baseList.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, filterState.page), totalPages);
  const paginatedTools = baseList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400 dark:text-slate-500">Collections</span>
        <span>/</span>
        <span className="text-[#0F172A] dark:text-white font-medium">{collection.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <IconComponent className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Curated Collection</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight mb-2">
          {collection.headline}
        </h1>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-2xl">
          {collection.description}
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

      {/* Tools Grid */}
      {paginatedTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {paginatedTools.map((tool) => (
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
