import React, { useState } from 'react';
import { PromptItem, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { BrandLogo } from './BrandLogo';
import { PromptPreviewImage } from './PromptPreviewImage';
import { getPromptProviderLogoSlug } from '../data/promptProviderLogos.ts';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { copyText } from '../lib/copyText';
import { recordPromptCopy } from '../services/promptLibraryService';

interface PromptCardProps {
  prompt: PromptItem;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await copyText(prompt.promptText);
    setCopyFailed(!success);
    if (success) { recordPromptCopy(prompt.slug); setCopied(true); setTimeout(() => setCopied(false), 2000); }
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
      className="prompt-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:shadow-xl min-h-[350px] focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="relative z-10">
        <Link to={`/prompt-library/${prompt.slug}`} className="prompt-card__image-link" aria-label={`Open ${prompt.title}`} tabIndex={-1}>
          <PromptPreviewImage className={`prompt-card__image${prompt.previewImageWidth && prompt.previewImageHeight && prompt.previewImageWidth / prompt.previewImageHeight > 1.2 ? ' prompt-card__image--landscape' : ''}`} src={prompt.previewImage} alt={prompt.previewImageAlt || `${prompt.title} prompt preview`} width={prompt.previewImageWidth} height={prompt.previewImageHeight} />
          <span className="prompt-card__ratio">{prompt.aspectRatio || '1:1'}</span>
        </Link>
        <div className="px-5 pt-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {prompt.provider && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <BrandLogo
                  slug={getPromptProviderLogoSlug(prompt.provider, prompt.targetModel)}
                  name={prompt.provider}
                  size="xs"
                  showContainer={false}
                  className="w-3.5 h-3.5"
                />
                <span>{prompt.provider}</span>
              </span>
            )}
              <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
              {prompt.targetModel}
            </span>
            {prompt.placeholders && prompt.placeholders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                {prompt.placeholders.length} Placeholders
              </span>
            )}
            {prompt.featured && <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Featured</span>}
            {prompt.slug.startsWith('promptfeed-') && <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">PromptFeed · MIT</span>}
            {prompt.mediaType === 'video' && <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Video prompt</span>}
            <span className="text-[11px] text-slate-500 capitalize dark:text-slate-400">
              {prompt.category.replace(/-/g, ' ')}
            </span>
          </div>

          <BookmarkButton item={bookmarkItem} size="sm" />
        </div>

        <h2 className="font-bold text-slate-900 dark:text-white text-base tracking-tight mb-1.5 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
          <Link to={`/prompt-library/${prompt.slug}`} className="focus:outline-none focus:underline">
            {prompt.title}
          </Link>
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {prompt.description}
        </p>

        <p className="prompt-card__excerpt mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">{prompt.promptText}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {[prompt.visualStyle, ...(prompt.tags || []).slice(0, 2)].filter(Boolean).map((tag) => <span key={tag} className="rounded-md bg-teal-50 px-2 py-1 text-[10px] font-medium text-teal-900 dark:bg-teal-950 dark:text-teal-200">{tag}</span>)}
          {prompt.aspectRatio && <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Aspect {prompt.aspectRatio}</span>}
        </div>
        </div>
      </div>

      <div className="relative z-10 mx-5 mt-3 mb-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-150 active:scale-95 cursor-pointer ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-teal-800 hover:bg-teal-900 text-white shadow-sm dark:bg-teal-300 dark:hover:bg-teal-200 dark:text-slate-950'
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
              <span>{copyFailed ? 'Try again' : 'Copy Prompt'}</span>
            </>
          )}
        </button>
        <span role="status" aria-live="polite" className={copyFailed ? 'ml-2 text-[11px] text-rose-700 dark:text-rose-300' : 'sr-only'}>
          {copyFailed ? 'Clipboard unavailable. Open details to copy.' : ''}
        </span>

        <Link
          to={`/prompt-library/${prompt.slug}`}
          className="inline-flex items-center gap-1 text-teal-800 dark:text-teal-300 font-semibold hover:underline"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
