import React from 'react';
import type { ToolDiscovery } from '../types/discoveries';
import { sanitizeOutboundUrl } from '../services/discoveryService';
import { ExternalLink, Sparkles, Star, Tag, Calendar } from 'lucide-react';

interface DailyDiscoveryCardProps {
  discovery: ToolDiscovery;
  compact?: boolean;
}

export const DailyDiscoveryCard: React.FC<DailyDiscoveryCardProps> = ({ discovery, compact = false }) => {
  const safeUrl = sanitizeOutboundUrl(discovery.websiteUrl);
  const safeImageUrl = discovery.imageUrl ? sanitizeOutboundUrl(discovery.imageUrl) : '';

  // Format date added
  const formattedDate = (() => {
    try {
      const date = new Date(discovery.createdAt);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  })();

  const handleExternalClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!safeUrl) {
      e.preventDefault();
      alert('The link for this tool is currently unavailable or invalid.');
    }
  };

  return (
    <article
      className="group relative flex flex-col justify-between rounded-lg border border-border/80 bg-card/70 p-5 sm:p-6 interactive-card focus-within:ring-2 focus-within:ring-primary/40"
      aria-labelledby={`disc-title-${discovery.id}`}
    >
      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {discovery.category && (
               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border/60">
                <Tag className="w-3 h-3 text-primary/70" />
                <span>{discovery.category}</span>
              </span>
            )}
            {discovery.isFeatured && (
               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Star className="w-3 h-3 fill-emerald-400/40 text-emerald-400" />
                <span>Featured</span>
              </span>
            )}
            {discovery.isNew && (
               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/15 text-primary border border-primary/25 uppercase tracking-wide">
                <Sparkles className="w-2.5 h-2.5" />
                <span>New</span>
              </span>
            )}
          </div>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground" title={`Added on ${formattedDate}`}>
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>

        {/* Card Main: Logo & Title */}
        <div className="flex items-start gap-3.5 mb-3">
           <div className="relative w-12 h-12 rounded-md border border-border/80 bg-background/90 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:border-primary/40 transition-colors">
            {safeImageUrl ? (
              <img
                src={safeImageUrl}
                alt={`${discovery.name} logo`}
                 className="w-full h-full object-contain rounded-md"
                loading="lazy"
                onError={(e) => {
                  // Fallback to letter avatar on broken image
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
               className={`w-full h-full rounded-md bg-muted text-primary font-bold text-lg flex items-center justify-center ${
                safeImageUrl ? 'hidden' : 'flex'
              }`}
              aria-hidden="true"
            >
              {discovery.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3
              id={`disc-title-${discovery.id}`}
              className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight truncate"
            >
              {discovery.name}
            </h3>
            {safeUrl && (
              <p className="text-xs text-muted-foreground truncate">
                {new URL(safeUrl).hostname.replace(/^www\./, '')}
              </p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className={`text-sm text-secondary-foreground leading-relaxed ${compact ? 'line-clamp-2' : 'line-clamp-3'} mb-4`}>
          {discovery.description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted-foreground font-medium">
          Verified Link
        </span>

        {safeUrl ? (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalClick}
            aria-label={`Visit official website for ${discovery.name} (opens in a new tab)`}
             className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors active:scale-95"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : (
          <span className="text-xs text-muted-foreground italic">Link unavailable</span>
        )}
      </div>
    </article>
  );
};
