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
      className="group relative flex flex-col justify-between rounded-2xl border border-[#DFE7F3] bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-xl hover:shadow-blue-500/5 focus-within:ring-2 focus-within:ring-[#2563EB]/40"
      aria-labelledby={`disc-title-${discovery.id}`}
    >
      {/* Ambient hover glow overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {discovery.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-slate-700 border border-slate-200/80">
                <Tag className="w-3 h-3 text-[#2563EB]" />
                <span>{discovery.category}</span>
              </span>
            )}
            {discovery.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                <Star className="w-3 h-3 fill-emerald-500 text-emerald-600" />
                <span>Featured</span>
              </span>
            )}
            {discovery.isNew && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FF] text-[#2563EB] border border-[#BFDBFE] uppercase tracking-wide">
                <Sparkles className="w-2.5 h-2.5" />
                <span>New</span>
              </span>
            )}
          </div>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]" title={`Added on ${formattedDate}`}>
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>

        {/* Card Main: Logo & Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs group-hover:border-[#2563EB]/40 transition-colors">
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
              className={`w-full h-full rounded-lg bg-[#EAF2FF] text-[#2563EB] font-bold text-lg flex items-center justify-center ${
                safeImageUrl ? 'hidden' : 'flex'
              }`}
              aria-hidden="true"
            >
              {discovery.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id={`disc-title-${discovery.id}`}
              className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors tracking-tight truncate"
            >
              {discovery.name}
            </h2>
            {safeUrl && (
              <p className="text-xs text-[#64748B] truncate">
                {new URL(safeUrl).hostname.replace(/^www\./, '')}
              </p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className={`text-sm text-[#64748B] leading-relaxed ${compact ? 'line-clamp-2' : 'line-clamp-3'} mb-4`}>
          {discovery.description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-3 border-t border-[#DFE7F3] flex items-center justify-between gap-3">
        <span className="text-[11px] text-[#64748B] font-medium">
          Verified Link
        </span>

        {safeUrl ? (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalClick}
            aria-label={`Visit Website for ${discovery.name} (opens in a new tab)`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">Link unavailable</span>
        )}
      </div>
    </article>
  );
};
