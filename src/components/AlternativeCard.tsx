import React from 'react';
import { ProprietaryTool } from '../types';
import { Link } from '../router/Router';
import { getToolsForProprietary, getCategoryBySlug } from '../services/catalogService';
import { getAiToolsForProprietary } from '../services/aiCatalogService';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AlternativeCardProps {
  alternative: ProprietaryTool;
}

export const AlternativeCard: React.FC<AlternativeCardProps> = ({ alternative }) => {
  const alternativesList = getToolsForProprietary(alternative.slug);
  const aiAlternatives = getAiToolsForProprietary(alternative.slug);
  const count = alternativesList.length + aiAlternatives.length;
  const previewLinks = [
    ...alternativesList.map((tool) => ({ slug: tool.slug, name: tool.name, color: tool.iconBgColor, url: `/tools/${tool.slug}` })),
    ...aiAlternatives.map((tool) => ({ slug: tool.slug, name: tool.name, color: tool.iconBgColor, url: `/ai-tools/${tool.slug}` })),
  ];
  const category = getCategoryBySlug(alternative.category);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
       className="group interactive-card relative flex flex-col justify-between h-full p-5 rounded-2xl border border-border bg-card hover:border-cyan-500/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-primary/40 cursor-pointer"
    >
      {/* Decorative Subtle Inner Spotlight on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(260px circle at var(--card-x, 50%) var(--card-y, 30%), rgba(6, 182, 212, 0.08), transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Primary Card Stretch Link for accessible navigation */}
      <Link
        to={`/alternatives/${alternative.slug}`}
        className="absolute inset-0 z-10 rounded-lg focus:outline-none"
        aria-label={`View alternatives to ${alternative.name}`}
      >
        <span className="sr-only">View alternatives to {alternative.name}</span>
      </Link>

      <div className="relative z-20 pointer-events-none">
        {/* Header: Logo, Name, Category, Alternative Count */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="pointer-events-auto">
              <Link to={`/alternatives/${alternative.slug}`} tabIndex={-1}>
                <BrandLogo
                  slug={alternative.slug}
                  name={alternative.name}
                  size="lg"
                  iconBgColor={alternative.iconBgColor}
                  iconLetter={alternative.iconLetter}
                />
              </Link>
            </div>
            <div className="min-w-0 pointer-events-auto">
              <Link
                to={`/alternatives/${alternative.slug}`}
                className="font-bold text-foreground text-base tracking-tight truncate block group-hover:text-primary transition-colors duration-200 focus:outline-none focus:underline"
              >
                {alternative.name}
              </Link>
              {category ? (
                <Link
                  to={`/categories/${alternative.category}`}
                  className="text-xs text-secondary-foreground hover:text-foreground block truncate transition-colors focus:outline-none focus:underline"
                >
                  {category.name}
                </Link>
              ) : alternative.category === 'video-creation' ? <span className="text-xs text-secondary-foreground">Video creation</span> : null}
            </div>
          </div>

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent font-semibold text-xs text-primary border border-primary/30 shrink-0 transition-colors">
            {count} {count === 1 ? 'alternative' : 'alternatives'}
          </span>
        </div>

        <p className="text-sm text-secondary-foreground line-clamp-2 mb-3 leading-relaxed">
          {alternative.description}
        </p>

        {/* Preview of top mapped replacements */}
        {count > 0 && (
          <div className="mb-4 pt-2.5 border-t border-border">
            <span className="text-[11px] text-secondary-foreground block mb-1.5 font-medium">
              Popular replacements:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {previewLinks.slice(0, 3).map((tool) => (
                <Link
                  key={tool.slug}
                  to={tool.url}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted hover:bg-accent text-secondary-foreground hover:text-primary border border-border hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title={`View ${tool.name} open source tool`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tool.color || '#3b82f6' }}
                  />
                  <span className="truncate max-w-[90px]">{tool.name}</span>
                </Link>
              ))}
              {count > 3 && (
                <span className="text-[10px] text-secondary-foreground font-mono">
                  +{count - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-20 pt-3 border-t border-border flex items-center justify-between text-xs pointer-events-none">
        <span className="text-secondary-foreground truncate mr-2">
          {alternative.tagline}
        </span>
        <Link
          to={`/alternatives/${alternative.slug}`}
          className="pointer-events-auto text-primary hover:text-primary-hover font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-all duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:underline"
          aria-label={`Explore open source alternatives to ${alternative.name}`}
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
