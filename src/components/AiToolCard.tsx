import React from 'react';
import { AiTool, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { Star, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AiToolCardProps {
  tool: AiTool;
  routePrefix?: '/ai-tools' | '/community-tools';
}

export const AiToolCard: React.FC<AiToolCardProps> = ({ tool, routePrefix = '/ai-tools' }) => {
  const detailUrl = `${routePrefix}/${tool.slug}`;
  const bookmarkItem: BookmarkItem = {
    id: `ai-${tool.id}`,
    type: 'ai-tool',
    slug: tool.slug,
    title: tool.name,
    subtitle: tool.tagline,
    url: detailUrl,
    iconBgColor: tool.iconBgColor,
    iconLetter: tool.iconLetter,
    savedAt: new Date().toISOString(),
  };

  const getPricingBadge = () => {
    if (tool.freeAccessType === 'open-source-local' || tool.isSelfHostable) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
          Open Source
        </span>
      );
    }

    switch (tool.pricingType) {
      case 'free':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
            Free
          </span>
        );
      case 'freemium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
            Freemium
          </span>
        );
      case 'free-credits':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-900 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20">
            Credits
          </span>
        );
      case 'free-trial':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20">
            Free Trial
          </span>
        );
      case 'paid':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20">
            Paid
          </span>
        );
    }
  };

  return (
    <div
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 interactive-card hover:-translate-y-1.5 hover:border-cyan-500/40 min-h-[250px] focus-within:ring-2 focus-within:ring-cyan-500/60 focus-within:border-cyan-500/60"
    >
      {/* A quiet accent wash keeps the hover state legible without turning the card into a light source. */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(280px circle at 50% 0%, rgba(6, 182, 212, 0.03), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo
              slug={tool.slug}
              name={tool.name}
              size="md"
              iconBgColor={tool.iconBgColor}
              iconLetter={tool.iconLetter}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Link
                   to={detailUrl}
                  className="font-bold text-foreground text-base tracking-tight truncate hover:text-primary transition-colors focus:outline-none focus:underline"
                >
                  {tool.name}
                </Link>
                {tool.isFeatured && (
                  <span
                    className="text-amber-400 cursor-help"
                    title="Featured AI Platform"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-amber-400/20" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-secondary-foreground capitalize block truncate">
                {tool.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {getPricingBadge()}
            <BookmarkButton item={bookmarkItem} size="sm" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-secondary-foreground line-clamp-2 mb-3">
          {tool.tagline}
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted/70 text-secondary-foreground border border-border/50"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Area */}
      <div className="relative z-10 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-secondary-foreground font-mono">
          {tool.rating && (
            <div className="flex items-center gap-1 text-foreground font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{tool.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="truncate max-w-[140px] text-[11px] text-secondary-foreground">
            {tool.pricingDetails.split(';')[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
             to={detailUrl}
            className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-hover group-hover:translate-x-0.5 transition-transform"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={`Visit ${tool.name} website`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
