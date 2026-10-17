import React from 'react';
import { Tool } from '../types';
import { Link } from '../router/Router';
import { getCategoryBySlug } from '../services/catalogService';
import { VerifiedBadge, AiNativeBadge } from './Badge';
import { Star, FileCode, ExternalLink, Github, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ReplacementCardProps {
  tool: Tool;
  proprietaryName?: string;
}

export const ReplacementCard: React.FC<ReplacementCardProps> = ({ tool, proprietaryName }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

  const primaryCategory = tool.categories[0] ? getCategoryBySlug(tool.categories[0]) : undefined;

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
        {/* Top Header: Logo, Name, Badges, Category */}
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
                  to={`/tools/${tool.slug}`}
                  className="font-bold text-foreground text-base tracking-tight truncate hover:text-primary transition-colors focus:outline-none focus:underline"
                >
                  {tool.name}
                </Link>
                {tool.isVerified && <VerifiedBadge />}
              </div>
              {primaryCategory && (
                <span className="text-[11px] text-muted-foreground block truncate">
                  {primaryCategory.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {tool.isAiNative && <AiNativeBadge />}
          </div>
        </div>

        {/* Short Description / Tagline */}
        <p className="text-sm text-secondary-foreground line-clamp-2 mb-3">
          {tool.tagline}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.techStack.slice(0, 3).map((stack) => (
            <span
              key={stack}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted/80 text-secondary-foreground border border-border/60"
            >
              {stack}
            </span>
          ))}
          {tool.techStack.length > 3 && (
            <span className="text-[10px] text-muted-foreground self-center">
              +{tool.techStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Area: Stats Row & Action Affordances */}
      <div className="relative z-10 pt-3 border-t border-border/50">
        {/* Stats Row: Stars, Velocity, License */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 font-mono">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span className="font-medium text-foreground">{tool.stars.toLocaleString()}</span>
            {tool.starGrowthDelta > 0 && (
              <span
                className="text-emerald-400 text-[10px] cursor-help font-sans"
                title="Estimated 30-day star velocity (Oct 2026 snapshot)"
              >
                ↑+{tool.starGrowthDelta}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted/60 text-secondary-foreground border border-border/40">
              {tool.license}
            </span>
          </div>
        </div>

        {/* Links Row: Clear Internal Navigation vs External Links */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Primary Internal Navigation */}
          <Link
            to={`/tools/${tool.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors group-hover:translate-x-0.5 focus:outline-none focus:underline"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Explicit External Links */}
          <div className="flex items-center gap-2">
            {tool.websiteUrl && (
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/50 transition-colors"
                title={`Visit ${tool.name} official website`}
              >
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {tool.repositoryUrl && (
              <a
                href={tool.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/50 transition-colors"
                title={`View ${tool.name} repository on GitHub`}
              >
                <Github className="w-3 h-3" />
                <span>Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
