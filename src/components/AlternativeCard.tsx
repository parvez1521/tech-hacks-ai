import React from 'react';
import { ProprietaryTool } from '../types';
import { Link } from '../router/Router';
import { getToolsForProprietary, getCategoryBySlug } from '../services/catalogService';
import { ArrowRight } from 'lucide-react';

interface AlternativeCardProps {
  alternative: ProprietaryTool;
}

export const AlternativeCard: React.FC<AlternativeCardProps> = ({ alternative }) => {
  const alternativesList = getToolsForProprietary(alternative.slug);
  const count = alternativesList.length;
  const category = getCategoryBySlug(alternative.category);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 hover:bg-card hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary/60"
    >
      {/* Decorative Subtle Inner Spotlight on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(260px circle at var(--card-x, 50%) var(--card-y, 30%), rgba(59, 130, 246, 0.1), transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Primary Card Stretch Link for accessible navigation */}
      <Link
        to={`/alternatives/${alternative.slug}`}
        className="absolute inset-0 z-10 rounded-lg focus:outline-none"
        aria-label={`View open source alternatives to ${alternative.name}`}
      >
        <span className="sr-only">View alternatives to {alternative.name}</span>
      </Link>

      <div className="relative z-10">
        {/* Header: Logo, Name, Category, Alternative Count */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: alternative.iconBgColor || '#3b82f6' }}
            >
              {alternative.iconLetter || alternative.name.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-base tracking-tight truncate group-hover:text-primary transition-colors duration-200">
                {alternative.name}
              </h3>
              {category && (
                <span className="text-xs text-muted-foreground block truncate">
                  {category.name}
                </span>
              )}
            </div>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted font-medium text-xs text-secondary-foreground border border-border shrink-0 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
            {count} {count === 1 ? 'alternative' : 'alternatives'}
          </span>
        </div>

        <p className="text-sm text-secondary-foreground line-clamp-2 mb-3">
          {alternative.description}
        </p>

        {/* Preview of top mapped replacements */}
        {count > 0 && (
          <div className="mb-4 pt-2 border-t border-border/40">
            <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">
              Popular replacements:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {alternativesList.slice(0, 3).map((tool) => (
                <span
                  key={tool.slug}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-muted/60 text-foreground border border-border/50"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tool.iconBgColor || '#3b82f6' }}
                  />
                  <span className="truncate max-w-[90px]">{tool.name}</span>
                </span>
              ))}
              {count > 3 && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  +{count - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <span className="text-muted-foreground truncate mr-2">
          {alternative.tagline}
        </span>
        <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200 shrink-0">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
