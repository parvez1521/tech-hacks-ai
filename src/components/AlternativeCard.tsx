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
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card hover:bg-accent/40 hover:border-border/80 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner"
            style={{ backgroundColor: alternative.iconBgColor || '#3b82f6' }}
          >
            {alternative.iconLetter || alternative.name.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-base tracking-tight truncate group-hover:text-primary transition-colors">
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

      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted font-medium text-secondary-foreground border border-border">
          {count} {count === 1 ? 'open alternative' : 'open alternatives'}
        </span>
        <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform">
          Explore →
        </span>
      </div>
    </Link>
  );
};
