import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getPromptBySlug, getAllPrompts } from '../services/aiCatalogService';
import { BookmarkButton } from '../components/BookmarkButton';
import { PromptCard } from '../components/PromptCard';
import { BrandLogo } from '../components/BrandLogo';
import { BookmarkItem } from '../types';
import {
  Copy,
  Check,
  ArrowLeft,
  Lightbulb,
  Tag,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  FileCode2,
  Workflow,
  CheckCircle2,
} from 'lucide-react';

export const PromptDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const prompt = getPromptBySlug(slug);

  const [copied, setCopied] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});

  if (!prompt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Prompt Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a prompt template matching "{slug}".
        </p>
        <Link
          to="/prompt-library"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Prompt Library</span>
        </Link>
      </div>
    );
  }

  const bookmarkItem: BookmarkItem = {
    id: `prompt-${prompt.id}`,
    type: 'prompt',
    slug: prompt.slug,
    title: prompt.title,
    subtitle: prompt.description,
    url: `/prompt-library/${prompt.slug}`,
    savedAt: new Date().toISOString(),
  };

  // Compute customized prompt text by replacing placeholders
  const computeCustomizedText = () => {
    let result = prompt.promptText;
    if (prompt.placeholders) {
      prompt.placeholders.forEach((ph) => {
        const userVal = placeholderValues[ph];
        if (userVal && userVal.trim()) {
          result = result.split(ph).join(userVal.trim());
        }
      });
    }
    return result;
  };

  const customizedText = computeCustomizedText();
  const hasPlaceholders = prompt.placeholders && prompt.placeholders.length > 0;
  const hasCustomizedValues = Object.values(placeholderValues).some((v) => v.trim().length > 0);

  const handleCopyCustomized = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(customizedText).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOriginal = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(prompt.promptText).catch(() => {});
    }
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const handlePlaceholderChange = (ph: string, val: string) => {
    setPlaceholderValues((prev) => ({
      ...prev,
      [ph]: val,
    }));
  };

  const handleResetPlaceholders = () => {
    setPlaceholderValues({});
  };

  const relatedPrompts = getAllPrompts()
    .filter((p) => p.id !== prompt.id && p.category === prompt.category)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground">/</span>
        <Link to="/prompt-library" className="hover:text-foreground transition-colors">Prompt Library</Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-md">{prompt.title}</span>
      </nav>

      {/* Header Container */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-invary-card mb-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {prompt.provider && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-primary/30">
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
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              {prompt.targetModel}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-secondary-foreground border border-slate-200 capitalize">
              {prompt.category.replace(/-/g, ' ')}
            </span>
            {hasPlaceholders && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                {prompt.placeholders!.length} Customizable Placeholders
              </span>
            )}
          </div>

          <BookmarkButton item={bookmarkItem} size="md" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-3">
          {prompt.title}
        </h1>

        <p className="text-sm text-secondary-foreground leading-relaxed mb-6">
          {prompt.description}
        </p>

        {/* Expected Output & Use Case Badges */}
        {(prompt.expectedOutputType || prompt.exampleUseCase || prompt.officialToolUrl) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-muted border border-border text-xs">
            {prompt.expectedOutputType && (
              <div>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <FileCode2 className="w-3.5 h-3.5 text-primary" />
                  <span>Expected Output Format:</span>
                </span>
                <span className="text-secondary-foreground">{prompt.expectedOutputType}</span>
              </div>
            )}
            {prompt.exampleUseCase && (
              <div>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <Workflow className="w-3.5 h-3.5 text-purple-600" />
                  <span>Primary Use Case:</span>
                </span>
                <span className="text-secondary-foreground">{prompt.exampleUseCase}</span>
              </div>
            )}
            {prompt.officialToolUrl && (
              <div className="sm:col-span-2 pt-2 border-t border-border flex items-center justify-between">
                <span className="text-muted-foreground">Official Tool Documentation:</span>
                <a
                  href={prompt.officialToolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-hover hover:underline font-medium"
                >
                  <span>Open Official Platform / Docs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Interactive Placeholder Customizer */}
        {hasPlaceholders && (
          <div className="mb-6 p-5 rounded-xl bg-muted border border-border">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Customize Placeholders in Real-Time</span>
              </h2>
              {hasCustomizedValues && (
                <button
                  type="button"
                  onClick={handleResetPlaceholders}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            {prompt.customizationInstructions && (
              <p className="text-xs text-secondary-foreground mb-4">
                {prompt.customizationInstructions}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {prompt.placeholders!.map((ph) => (
                <div key={ph} className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-secondary-foreground font-semibold">
                    {ph}
                  </label>
                  <input
                    type="text"
                    value={placeholderValues[ph] || ''}
                    onChange={(e) => handlePlaceholderChange(ph, e.target.value)}
                    placeholder={`e.g. customized ${ph.replace(/[\[\]]/g, '').toLowerCase()}...`}
                    className="px-3 py-1.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              ))}
            </div>

            {hasCustomizedValues && (
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Placeholders populated! See customized prompt below.</span>
              </div>
            )}
          </div>
        )}

        {/* Prompt Container with Copy Button */}
        <div className="relative rounded-xl bg-muted border border-border p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{hasCustomizedValues ? 'Customized Output Prompt' : 'Prompt Instructions'}</span>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">{prompt.copyCount || 1000}+ copies</span>
          </div>

          <pre className="font-mono text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed select-all selection:bg-blue-100 bg-card p-4 rounded-xl border border-border overflow-x-auto shadow-sm">
            {customizedText}
          </pre>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleCopyCustomized}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-150 active:scale-98 cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{hasCustomizedValues ? 'Customized Prompt Copied!' : 'Prompt Copied to Clipboard!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{hasCustomizedValues ? 'Copy Customized Prompt' : 'Copy Full Prompt'}</span>
                </>
              )}
            </button>

            {hasCustomizedValues && (
              <button
                type="button"
                onClick={handleCopyOriginal}
                className="px-4 py-2.5 rounded-xl font-medium text-xs text-secondary-foreground hover:text-foreground bg-card border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                {copiedOriginal ? 'Copied Template!' : 'Copy Original Template'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pro Tips & Parameters */}
      {prompt.tips && (
        <div className="p-5 rounded-2xl border border-amber-200/80 bg-amber-50/70 mb-8 flex items-start gap-3 text-xs leading-relaxed">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-950 mb-1 text-sm">Optimization Tips & Parameters</h3>
            <p className="text-amber-900/90">{prompt.tips}</p>
          </div>
        </div>
      )}

      {/* Author & Source Provenance */}
      {prompt.authorOrSource && (
        <div className="text-xs text-muted-foreground mb-8 px-2 flex items-center gap-2">
          <span>Author / Provenance:</span>
          <span className="font-semibold text-secondary-foreground">{prompt.authorOrSource}</span>
        </div>
      )}

      {/* Tags & Keywords */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-invary-card mb-12">
        <h3 className="font-bold text-foreground mb-3 text-xs flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          <span>Associated Tags & Use Cases</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((t) => (
            <Link
              key={t}
              to={`/prompt-library?q=${t}`}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-secondary-foreground border border-slate-200 hover:bg-blue-50 hover:text-primary-hover hover:border-primary/30 transition-colors"
            >
              #{t}
            </Link>
          ))}
        </div>
      </div>

      {/* Related Prompts */}
      {relatedPrompts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">
              More {prompt.category.replace(/-/g, ' ')} Prompts
            </h2>
            <Link to="/prompt-library" className="text-xs text-primary hover:text-primary-hover hover:underline">
              View full library →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedPrompts.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
