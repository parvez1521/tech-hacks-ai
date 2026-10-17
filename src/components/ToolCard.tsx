import React from 'react';
import { Tool } from '../types';
import { VerifiedBadge, AiNativeBadge } from './Badge';
import { proprietaryTools } from '../data/alternatives';
import { Link } from '../router/Router';
import { Star, Clock, FileCode } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  // Find mapped proprietary tools
  const alternativeItems = proprietaryTools.filter((p) => tool.alternativesTo.includes(p.slug));

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card hover:bg-accent/40 transition-all duration-200 hover:border-border/80 shadow-sm hover:shadow-md min-h-[220px]">
      {/* Primary Card Stretch Link */}
      <Link to={`/tools/${tool.slug}`} className="absolute inset-0 z-10" aria-label={`View details for ${tool.name}`}>
        <span className="sr-only">View {tool.name}</span>
      </Link>

      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Custom App Avatar */}
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-inner"
              style={{ backgroundColor: tool.iconBgColor || '#3b82f6' }}
            >
              {tool.iconLetter || tool.name.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="font-semibold text-foreground text-base tracking-tight truncate">
              {tool.name}
            </h3>
            {tool.isVerified && <VerifiedBadge />}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {tool.isAiNative && <AiNativeBadge />}
          </div>
        </div>

        {/* Dual-State Content Container */}
        <div className="relative min-h-[64px] mb-3">
          {/* Normal State: Short Tagline */}
          <p className="text-sm text-secondary-foreground line-clamp-2 transition-opacity duration-200 group-hover:opacity-0">
            {tool.tagline}
          </p>

          {/* Hover State: Extended Description */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
            <p className="text-sm text-secondary-foreground line-clamp-3">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Dual-State Footer */}
      <div className="relative pt-3 border-t border-border/50">
        {/* Normal State: Stats Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground transition-opacity duration-200 group-hover:opacity-0">
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

        {/* Hover State: "Alternative to" Targets */}
        <div className="absolute inset-x-0 bottom-0 top-3 flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <span className="text-xs text-muted-foreground shrink-0">Alternative to:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {alternativeItems.length > 0 ? (
                alternativeItems.map((alt) => (
                  <Link
                    key={alt.slug}
                    to={`/alternatives/${alt.slug}`}
                    className="relative z-20 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs bg-muted hover:bg-border text-foreground transition-colors border border-border"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white shrink-0"
                      style={{ backgroundColor: alt.iconBgColor }}
                    >
                      {alt.iconLetter}
                    </span>
                    <span className="font-medium truncate max-w-[80px]">{alt.name}</span>
                  </Link>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">Proprietary SaaS</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
