import React from 'react';
import { Tool } from '../types';
import { VerifiedBadge, AiNativeBadge } from './Badge';
import { proprietaryTools } from '../data/alternatives';
import { Link } from '../router/Router';
import { Star, Clock, FileCode } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  // Find mapped proprietary tools
  const alternativeItems = proprietaryTools.filter((p) => tool.alternativesTo.includes(p.slug));

  return (
    <div
      className="group relative flex flex-col justify-between h-full p-5 rounded-lg border border-border bg-card/90 interactive-card min-h-[224px] focus-within:ring-2 focus-within:ring-primary/50"
    >
      {/* Primary Card Stretch Link */}
      <Link
        to={`/tools/${tool.slug}`}
        className="absolute inset-0 z-10 rounded-lg focus:outline-none"
        aria-label={`View details for ${tool.name}`}
      >
        <span className="sr-only">View {tool.name}</span>
      </Link>

      {/* Top Header Row */}
      <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
            {/* Brand Logo with vector support and fallback */}
            <BrandLogo
              slug={tool.slug}
              name={tool.name}
              size="sm"
              iconBgColor={tool.iconBgColor}
              iconLetter={tool.iconLetter}
            />
            <h3 className="font-semibold text-foreground text-base tracking-tight truncate group-hover:text-primary transition-colors duration-200">
              {tool.name}
            </h3>
            {tool.isVerified && <VerifiedBadge />}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {tool.isAiNative && <AiNativeBadge />}
          </div>
        </div>

        <div className="min-h-[72px] mb-3">
          <p className="text-xs text-primary/90 font-medium mb-1.5 line-clamp-1">{tool.tagline}</p>
          <p className="text-sm text-secondary-foreground leading-relaxed line-clamp-3">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Metadata stays visible; cards should not require hover to reveal useful facts. */}
      <div className="relative z-10 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-mono">
            <Star className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span className="font-medium text-foreground">{tool.stars.toLocaleString()}</span>
            {tool.starGrowthDelta > 0 && (
              <span
                className="text-emerald-400 text-[10px] cursor-help"
                title="Estimated 30-day star velocity (Oct 2026 snapshot)"
              >
                ↑+{tool.starGrowthDelta}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 opacity-60" />
            <span>{tool.lastCommitFormatted}</span>
          </div>

          <div className="flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5 opacity-60" />
            <span className="font-mono text-[11px] px-1 py-0.5 rounded bg-muted/60 text-secondary-foreground">
              {tool.license}
            </span>
          </div>
        </div>

        {alternativeItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-2 min-w-0">
            <span className="text-[11px] text-muted-foreground shrink-0">Alternative to</span>
            <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto no-scrollbar">
              {alternativeItems.slice(0, 2).map((alt) => (
                <Link
                  key={alt.slug}
                  to={`/alternatives/${alt.slug}`}
                  className="relative z-20 inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-[11px] bg-muted hover:bg-primary/10 hover:text-primary text-foreground transition-colors border border-border shrink-0"
                >
                  <BrandLogo
                    slug={alt.slug}
                    name={alt.name}
                    size="xs"
                    iconBgColor={alt.iconBgColor}
                    iconLetter={alt.iconLetter}
                    className="w-3.5 h-3.5 rounded-sm overflow-hidden p-0"
                  />
                  <span className="font-medium truncate max-w-[76px]">{alt.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
