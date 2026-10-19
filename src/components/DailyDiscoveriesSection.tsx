import React, { useState, useEffect } from 'react';
import type { ToolDiscovery } from '../types/discoveries';
import { fetchPublishedDiscoveries } from '../services/discoveryService';
import { DailyDiscoveryCard } from './DailyDiscoveryCard';
import { Link } from '../router/Router';
import { Sparkles, ArrowRight, Compass, RefreshCw } from 'lucide-react';

interface DailyDiscoveriesSectionProps {
  maxItems?: number;
}

export const DailyDiscoveriesSection: React.FC<DailyDiscoveriesSectionProps> = ({ maxItems = 6 }) => {
  const [discoveries, setDiscoveries] = useState<ToolDiscovery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDiscoveries = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchPublishedDiscoveries();
    setIsLoading(false);

    if (result.success) {
      // Sort featured first, then newest
      const sorted = [...result.discoveries].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setDiscoveries(sorted.slice(0, maxItems));
    } else {
      setError(result.error || 'Failed to load discoveries.');
    }
  };

  useEffect(() => {
    loadDiscoveries();
  }, [maxItems]);

  return (
    <section aria-labelledby="daily-discoveries-heading" className="w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 eyebrow mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Daily by Editors</span>
          </div>
          <h2
            id="daily-discoveries-heading"
            className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight"
          >
            Daily Discoveries &amp; Featured AI Tools
          </h2>
          <p className="text-sm text-secondary-foreground max-w-xl mt-1">
            Hand-tested breakthroughs, niche developer utilities, and high-impact generative tools discovered by the Tech Hacks AI editorial team.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/discoveries"
            className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors"
          >
            <span>View All Discoveries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 rounded-lg border border-border/60 bg-card/40 p-6 animate-pulse flex flex-col justify-between"
            >
              <div>
                <div className="w-24 h-4 bg-muted rounded-full mb-4" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-muted rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-4 bg-muted rounded" />
                    <div className="w-20 h-3 bg-muted rounded" />
                  </div>
                </div>
                <div className="w-full h-10 bg-muted/60 rounded mt-2" />
              </div>
              <div className="w-full h-8 bg-muted/40 rounded mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
          <div className="p-8 rounded-lg border border-border/80 bg-card/60 text-center">
          <p className="text-sm text-muted-foreground mb-3">{error}</p>
          <button
            onClick={loadDiscoveries}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && discoveries.length === 0 && (
         <div className="p-10 rounded-lg border border-border/80 bg-card/60 text-center flex flex-col items-center">
           <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">No discoveries featured yet</h3>
          <p className="text-xs text-muted-foreground max-w-md mb-4">
            Our editorial team is testing new AI platforms right now. Check back shortly or submit a new tool to our catalog.
          </p>
          <Link
            to="/submit-tool"
             className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            <span>Submit a Breakthrough Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && !error && discoveries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {discoveries.map((discovery) => (
            <DailyDiscoveryCard key={discovery.id} discovery={discovery} />
          ))}
        </div>
      )}
    </section>
  );
};
