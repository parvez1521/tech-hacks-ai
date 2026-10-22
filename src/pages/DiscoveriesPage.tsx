import React, { useState, useEffect, useMemo } from 'react';
import type { ToolDiscovery } from '../types/discoveries';
import { fetchPublishedDiscoveries } from '../services/discoveryService';
import { DailyDiscoveryCard } from '../components/DailyDiscoveryCard';
import { Link } from '../router/Router';
import {
  Sparkles,
  Search,
  Filter,
  Star,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';

export const DiscoveriesPage: React.FC = () => {
  const [discoveries, setDiscoveries] = useState<ToolDiscovery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'featured' | 'name'>('newest');

  const loadDiscoveries = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchPublishedDiscoveries();
    setIsLoading(false);

    if (result.success) {
      setDiscoveries(result.discoveries);
    } else {
      setError(result.error || 'Failed to load discoveries.');
    }
  };

  useEffect(() => {
    loadDiscoveries();
  }, []);

  // Compute available categories from loaded data
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    discoveries.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set).sort();
  }, [discoveries]);

  // Filter & sort discoveries
  const filteredDiscoveries = useMemo(() => {
    let result = [...discoveries];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.category || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (d) => (d.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Featured only
    if (featuredOnly) {
      result = result.filter((d) => Boolean(d.isFeatured));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // default 'newest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [discoveries, searchQuery, selectedCategory, featuredOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setFeaturedOnly(false);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF2FF] text-[#2563EB] border border-[#BFDBFE] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Curated Daily Editorial Archive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
          Daily Discoveries &amp; Featured AI Tools
        </h1>
        <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
          Explore breakthrough AI utilities, developer sandboxes, frontier models, and creative tools vetted daily by SwitchRoute.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white border border-[#DFE7F3] rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discoveries by name, category, or keyword..."
              aria-label="Search discoveries"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DFE7F3] bg-white text-[#0F172A] placeholder:text-[#64748B] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0F172A]"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Featured Only Toggle */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                featuredOnly
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                  : 'bg-white border-[#DFE7F3] text-[#64748B] hover:text-[#2563EB] hover:bg-[#EAF2FF]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-white text-white' : ''}`} />
              <span>Featured Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort discoveries"
                className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[#DFE7F3] bg-white text-[#0F172A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="newest">Sort: Newest Added</option>
                <option value="featured">Sort: Featured First</option>
                <option value="name">Sort: Alphabetical (A-Z)</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Refresh */}
            <button
              onClick={loadDiscoveries}
              disabled={isLoading}
              title="Refresh discoveries"
              className="p-2.5 rounded-xl border border-[#DFE7F3] bg-white text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Refresh discoveries list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        {availableCategories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-[#DFE7F3] scrollbar-none">
            <span className="text-[11px] font-semibold text-[#64748B] mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#2563EB]" />
              <span>Category:</span>
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-[#64748B] hover:text-[#2563EB] hover:bg-[#EAF2FF] border border-[#DFE7F3]'
              }`}
            >
              All Categories
            </button>

            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-white text-[#64748B] hover:text-[#2563EB] hover:bg-[#EAF2FF] border border-[#DFE7F3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredDiscoveries.length}</strong> {filteredDiscoveries.length === 1 ? 'discovery' : 'discoveries'}
          {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          {featuredOnly && ' (featured only)'}
        </span>

        {(searchQuery || selectedCategory !== 'all' || featuredOnly || sortBy !== 'newest') && (
          <button
            onClick={handleResetFilters}
            className="text-primary hover:underline font-medium"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-60 rounded-2xl border border-border/60 bg-card/40 p-6 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-24 h-4 bg-muted rounded-full" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-4 bg-muted rounded" />
                    <div className="w-20 h-3 bg-muted rounded" />
                  </div>
                </div>
                <div className="w-full h-12 bg-muted/60 rounded" />
              </div>
              <div className="w-full h-8 bg-muted/40 rounded mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-10 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-center">
          <p className="text-sm text-rose-400 font-medium mb-3">{error}</p>
          <button
            onClick={loadDiscoveries}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty Filter State */}
      {!isLoading && !error && filteredDiscoveries.length === 0 && (
        <div className="p-12 rounded-2xl border border-border/80 bg-card/60 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-muted/70 flex items-center justify-center text-muted-foreground mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">No discoveries match your criteria</h2>
          <p className="text-xs text-muted-foreground max-w-md mb-5 leading-relaxed">
            We couldn't find any tool discoveries matching your active filters. Try adjusting your search query or reset your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Discoveries Grid */}
      {!isLoading && !error && filteredDiscoveries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscoveries.map((discovery) => (
            <DailyDiscoveryCard key={discovery.id} discovery={discovery} />
          ))}
        </div>
      )}

      {/* Submit CTA Banner */}
      <div className="mt-16 p-8 rounded-2xl border border-blue-200 bg-blue-50/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Community Contributions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            Know a breakthrough tool that belongs here?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Submit your own AI tool or open-source software for community review and feature consideration in our Daily Discoveries.
          </p>
        </div>

        <Link
          to="/submit-tool"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-500 shadow-md shadow-blue-600/30 shrink-0 transition-all active:scale-95 cursor-pointer"
        >
          <span>Submit a Tool</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
