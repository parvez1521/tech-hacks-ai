import React from 'react';
import { AiTool, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { Star, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

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
    if (tool.freeAccessType === 'open-source-local' || tool.isSelfHostable) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Open Source
        </span>
      );
    }

    switch (tool.pricingType) {
      case 'free':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Free
          </span>
        );
      case 'freemium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Freemium
          </span>
        );
      case 'free-credits':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            Credits
          </span>
        );
      case 'free-trial':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Free Trial
          </span>
        );
      case 'paid':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Paid
          </span>
        );
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-[#DFE7F3] bg-white hover:border-cyan-500/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 ease-out min-h-[250px] focus-within:ring-2 focus-within:ring-[#2563EB]/40"
    >
      {/* Decorative Interactive Spotlight Inner Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(280px circle at var(--card-x, 50%) var(--card-y, 50%), rgba(6, 182, 212, 0.08), transparent 80%)',
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
                  to={`/ai-tools/${tool.slug}`}
                  className="font-bold text-[#0F172A] text-base tracking-tight truncate hover:text-[#2563EB] transition-colors focus:outline-none focus:underline"
                >
                  {tool.name}
                </Link>
                {tool.isFeatured && (
                  <span
                    className="text-amber-500 cursor-help"
                    title="Featured AI Platform"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-amber-400/30" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#64748B] capitalize block truncate">
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
        <p className="text-sm text-[#64748B] line-clamp-2 mb-3 leading-relaxed">
          {tool.tagline}
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-slate-700 border border-slate-200/80"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Area */}
      <div className="relative z-10 pt-3 border-t border-[#DFE7F3] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#64748B] font-mono">
          {tool.rating && (
            <div className="flex items-center gap-1 text-[#0F172A] font-medium">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{tool.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="truncate max-w-[140px] text-[11px] text-[#64748B]">
            {tool.pricingDetails.split(';')[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/ai-tools/${tool.slug}`}
            className="inline-flex items-center gap-1 text-[#2563EB] font-semibold hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-transform"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            title={`Visit ${tool.name} website`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
