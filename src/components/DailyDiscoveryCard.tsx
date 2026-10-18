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
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/90 hover:shadow-xl hover:shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/40"
      aria-labelledby={`disc-title-${discovery.id}`}
    >
      {/* Ambient hover glow overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {discovery.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border/60">
                <Tag className="w-3 h-3 text-primary/70" />
                <span>{discovery.category}</span>
              </span>
            )}
            {discovery.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                <Star className="w-3 h-3 fill-emerald-400/40 text-emerald-400" />
                <span>Featured</span>
              </span>
            )}
            {discovery.isNew && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25 uppercase tracking-wide">
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
          <div className="relative w-12 h-12 rounded-xl border border-border/80 bg-background/90 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-primary/40 transition-colors">
            {safeImageUrl ? (
              <img
                src={safeImageUrl}
                alt={`${discovery.name} logo`}
                className="w-full h-full object-cover rounded-lg"
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
              className={`w-full h-full rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-bold text-lg flex items-center justify-center ${
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20 transition-all duration-200 active:scale-95 group-hover:shadow-primary/30"
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
