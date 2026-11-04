import React from 'react';
import { AiTool, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AffiliateDisclosure } from './AffiliateDisclosure';

interface AiToolCardProps {
  tool: AiTool;
}

export const AiToolCard: React.FC<AiToolCardProps> = ({ tool }) => {
  const detailUrl = `/ai-tools/${tool.slug}`;
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
    if (tool.videoDiscoverySections?.includes('open-weights')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20">
          Open Weights
        </span>
      );
    }

    if (tool.freeAccessType === 'open-source-local' || tool.isSelfHostable) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
          Open Source
        </span>
      );
    }

    switch (tool.pricingType) {
      case 'free':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
            Free
          </span>
        );
      case 'freemium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
            Freemium
          </span>
        );
      case 'free-credits':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-900 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20">
            Credits
          </span>
        );
      case 'free-trial':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20">
            Free Trial
          </span>
        );
      case 'paid':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20">
            Paid
          </span>
        );
    }
  };

  return (
    <div
      className="group relative flex flex-col justify-between p-4 rounded-2xl border border-border interactive-card hover:border-primary/50 min-h-[250px] focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/60"
    >
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
              className="rounded-lg ring-1 ring-border/50"
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
              <span className="meta-label block truncate">
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

        {tool.accessLabel && (
          <p className="mb-3 rounded-xl border border-primary/15 bg-primary/5 px-2.5 py-1.5 text-[11px] font-medium leading-snug text-secondary-foreground">
            {tool.accessLabel}
          </p>
        )}

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/70 text-secondary-foreground border border-border/50"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Area */}
      <div className="relative z-10 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-secondary-foreground font-mono">
          <span className="max-w-[180px] whitespace-normal break-words text-[11px] leading-snug text-secondary-foreground">
            {tool.pricingDetails.split(';')[0]}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Link
             to={detailUrl}
            className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-hover group-hover:translate-x-0.5 transition-transform focus-visible:outline-none focus-visible:underline"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex flex-col items-end gap-1">
            <a
              href={tool.affiliateUrl || tool.websiteUrl}
              target="_blank"
              rel={tool.affiliateUrl ? 'noopener noreferrer sponsored nofollow' : 'noopener noreferrer'}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Open ${tool.name} ${tool.affiliateUrl ? 'affiliate link' : tool.websiteUrl.includes('github.com') ? 'official repository' : 'official website'}`}
            >
              <span>{tool.affiliateUrl ? `Try ${tool.name}` : tool.websiteUrl.includes('github.com') ? 'Source' : 'Website'}</span>
            </a>
            {tool.affiliateUrl && <AffiliateDisclosure />}
          </div>
          {tool.openSourceRepoUrl && tool.openSourceRepoUrl !== tool.websiteUrl && <a href={tool.openSourceRepoUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-2.5 py-1 text-[11px] text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`${tool.name} source repository`}>Source</a>}
          {tool.modelWeightsUrl && <a href={tool.modelWeightsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-2.5 py-1 text-[11px] text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`${tool.name} model weights`}>Weights</a>}
          {tool.relatedDemoUrl && <a href={tool.relatedDemoUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-2.5 py-1 text-[11px] text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Open ${tool.relatedDemoName || `${tool.name} related browser demo`} in a new tab`}>Demo</a>}
        </div>
      </div>
    </div>
  );
};
