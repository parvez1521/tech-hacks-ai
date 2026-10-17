import React, { useState } from 'react';
import { PromptItem, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
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
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 hover:bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/30 min-h-[260px] focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary/60"
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
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {prompt.targetModel}
            </span>
            <span className="text-[11px] text-muted-foreground capitalize">
              {prompt.category.replace('-', ' ')}
            </span>
          </div>

          <BookmarkButton item={bookmarkItem} size="sm" />
        </div>

        <h3 className="font-bold text-foreground text-base tracking-tight mb-1.5 group-hover:text-primary transition-colors">
          <Link to={`/prompt-library/${prompt.slug}`} className="focus:outline-none focus:underline">
            {prompt.title}
          </Link>
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {prompt.description}
        </p>

        {/* Prompt Container */}
        <div className="relative p-3 rounded-md bg-muted/60 border border-border/80 font-mono text-xs text-secondary-foreground line-clamp-3 mb-3 leading-relaxed selection:bg-primary/20">
          "{prompt.promptText}"
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-150 active:scale-95 cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm'
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
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
