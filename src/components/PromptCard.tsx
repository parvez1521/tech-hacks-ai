import React, { useState } from 'react';
import { PromptItem, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { BrandLogo } from './BrandLogo';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface PromptCardProps {
  prompt: PromptItem;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(prompt.promptText).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bookmarkItem: BookmarkItem = {
    id: `prompt-${prompt.id}`,
    type: 'prompt',
    slug: prompt.slug,
    title: prompt.title,
    subtitle: prompt.description,
    url: `/prompt-library/${prompt.slug}`,
    savedAt: new Date().toISOString(),
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-[#DFE7F3] bg-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-invary-card-hover min-h-[260px] focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 shadow-invary-card"
    >
      {/* Decorative Interactive Spotlight Inner Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(280px circle at var(--card-x, 50%) var(--card-y, 50%), rgba(37, 99, 235, 0.06), transparent 80%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {prompt.provider && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <BrandLogo
                  slug={prompt.provider.toLowerCase().replace(/\s+/g, '-')}
                  name={prompt.provider}
                  size="xs"
                  showContainer={false}
                  className="w-3.5 h-3.5"
                />
                <span>{prompt.provider}</span>
              </span>
            )}
            <span className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-purple-50 text-purple-700 border border-purple-200">
              {prompt.targetModel}
            </span>
            {prompt.placeholders && prompt.placeholders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                {prompt.placeholders.length} Placeholders
              </span>
            )}
            <span className="text-[11px] text-slate-500 capitalize">
              {prompt.category.replace(/-/g, ' ')}
            </span>
          </div>

          <BookmarkButton item={bookmarkItem} size="sm" />
        </div>

        <h3 className="font-bold text-slate-900 text-base tracking-tight mb-1.5 group-hover:text-blue-600 transition-colors">
          <Link to={`/prompt-library/${prompt.slug}`} className="focus:outline-none focus:underline">
            {prompt.title}
          </Link>
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
          {prompt.description}
        </p>

        {/* Prompt Container */}
        <div className="relative p-3 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] font-mono text-xs text-slate-800 line-clamp-3 mb-3 leading-relaxed selection:bg-blue-100">
          "{prompt.promptText}"
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-[#DFE7F3] flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-150 active:scale-95 cursor-pointer ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
          aria-label={copied ? 'Copied prompt to clipboard' : 'Copy prompt to clipboard'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>

        <Link
          to={`/prompt-library/${prompt.slug}`}
          className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
