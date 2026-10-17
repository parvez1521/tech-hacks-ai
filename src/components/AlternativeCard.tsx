import React from 'react';
import { ProprietaryTool } from '../types';
import { Link } from '../router/Router';
import { getToolsForProprietary } from '../services/catalogService';

interface AlternativeCardProps {
  alternative: ProprietaryTool;
}

export const AlternativeCard: React.FC<AlternativeCardProps> = ({ alternative }) => {
  const alternativesList = getToolsForProprietary(alternative.slug);
  const count = alternativesList.length;

  return (
    <Link
      to={`/alternatives/${alternative.slug}`}
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 hover:bg-card hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:-translate-y-1"
    >
      {/* Decorative Subtle Inner Spotlight on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at 50% 30%, rgba(59, 130, 246, 0.08), transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: alternative.iconBgColor || '#3b82f6' }}
          >
            {alternative.iconLetter || alternative.name.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-base tracking-tight truncate group-hover:text-primary transition-colors duration-200">
              {alternative.name}
            </h3>
            <span className="text-xs text-muted-foreground block truncate">
              {alternative.tagline}
            </span>
          </div>
        </div>

        <p className="text-sm text-secondary-foreground line-clamp-3 mb-4">
          {alternative.description}
        </p>
      </div>

      <div className="relative z-10 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted font-medium text-secondary-foreground border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
          {count} {count === 1 ? 'open alternative' : 'open alternatives'}
        </span>
        <span className="text-primary font-medium group-hover:translate-x-1 transition-transform duration-200">
          Explore →
        </span>
      </div>
    </Link>
  );
};
