import React from 'react';
import { AiTool, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { Star, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

interface AiToolCardProps {
  tool: AiTool;
}

export const AiToolCard: React.FC<AiToolCardProps> = ({ tool }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

  const bookmarkItem: BookmarkItem = {
    id: `ai-${tool.id}`,
    type: 'ai-tool',
    slug: tool.slug,
    title: tool.name,
    subtitle: tool.tagline,
    url: `/ai-tools/${tool.slug}`,
    iconBgColor: tool.iconBgColor,
    iconLetter: tool.iconLetter,
    savedAt: new Date().toISOString(),
  };

  const getPricingBadge = () => {
    switch (tool.pricingType) {
      case 'free':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Free
          </span>
        );
      case 'freemium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Freemium
          </span>
        );
      case 'free-trial':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Free Trial
          </span>
        );
      case 'paid':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Paid
          </span>
        );
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 hover:bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/30 min-h-[250px] focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary/60"
    >
      {/* Decorative Interactive Spotlight Inner Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(280px circle at var(--card-x, 50%) var(--card-y, 50%), rgba(59, 130, 246, 0.12), transparent 80%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: tool.iconBgColor || '#6366f1' }}
            >
              {tool.iconLetter || tool.name.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/ai-tools/${tool.slug}`}
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
              <span className="text-[11px] text-muted-foreground capitalize block truncate">
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
        <div className="flex items-center gap-2 text-muted-foreground font-mono">
          {tool.rating && (
            <div className="flex items-center gap-1 text-foreground font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{tool.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="truncate max-w-[140px] text-[11px] text-muted-foreground">
            {tool.pricingDetails.split(';')[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/ai-tools/${tool.slug}`}
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
