import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getPromptBySlug, getAllPrompts } from '../services/aiCatalogService';
import { getPromptFeedPromptBySlug } from '../data/promptfeedPrompts';
import { BookmarkButton } from '../components/BookmarkButton';
import { PromptCard } from '../components/PromptCard';
import { BrandLogo } from '../components/BrandLogo';
import { PromptPreviewImage } from '../components/PromptPreviewImage';
import { getPromptProviderLogoSlug } from '../data/promptProviderLogos.ts';
import { BookmarkItem } from '../types';
import type { PromptItem } from '../types';
import { fetchPromptCopyStats, fetchPublishedPrompts, recordPromptCopy, recordPromptView } from '../services/promptLibraryService';
import { copyText } from '../lib/copyText';
import { formatPageTitle, siteConfig } from '../config/site';
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
  const [remotePrompt, setRemotePrompt] = useState<PromptItem | undefined>();
  const [feedPrompt, setFeedPrompt] = useState<PromptItem | undefined>();
  const prompt = remotePrompt?.slug === slug ? remotePrompt : feedPrompt?.slug === slug ? feedPrompt : getPromptBySlug(slug);
  const [recordedCopyCount, setRecordedCopyCount] = useState<number>();

  useEffect(() => {
    let active = true;
    setRemotePrompt(undefined);
    fetchPublishedPrompts(slug).then((prompts) => {
      if (active && prompts[0]) setRemotePrompt(prompts[0]);
    });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    let active = true;
    setFeedPrompt(undefined);
    if (!slug.startsWith('promptfeed-')) return () => { active = false; };
    getPromptFeedPromptBySlug(slug).then((result) => { if (active) setFeedPrompt(result); }).catch(() => { if (active) setFeedPrompt(undefined); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!prompt || typeof document === 'undefined') return;
    setRecordedCopyCount(undefined);
    recordPromptView(prompt);
    let active = true;
    fetchPromptCopyStats().then((stats) => { if (active) setRecordedCopyCount(stats.find((item) => item.slug === prompt.slug)?.copyCount); });
    const title = formatPageTitle(`${prompt.title} — AI Prompt Recipe`);
    const description = `${prompt.title} for ${prompt.targetModel}: ${prompt.description}`.slice(0, 300);
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${siteConfig.url}/prompt-library/${prompt.slug}`);
    return () => { active = false; };
  }, [prompt]);

  const [copied, setCopied] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});

  if (!prompt && slug.startsWith('promptfeed-')) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center" role="status"><div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" /><p className="text-sm text-muted-foreground">Loading prompt and matching preview…</p></div>;
  }

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

  const handleCopyCustomized = async () => {
    if (await copyText(customizedText)) {
      recordPromptCopy(prompt.slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyOriginal = async () => {
    if (await copyText(prompt.promptText)) {
      recordPromptCopy(prompt.slug);
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    }
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
                  slug={getPromptProviderLogoSlug(prompt.provider, prompt.targetModel)}
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

        <figure className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted">
          <PromptPreviewImage src={prompt.previewImage} alt={prompt.previewImageAlt || `${prompt.title} prompt preview`} priority className="block max-h-[500px] w-full bg-slate-100 object-contain dark:bg-slate-800" />
          <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-xs text-muted-foreground">
            <span><strong className="text-foreground">Visual style</strong> {prompt.visualStyle || 'Conceptual'}</span>
            <span><strong className="text-foreground">Aspect ratio</strong> {prompt.aspectRatio || '1:1'}</span>
            <span><strong className="text-foreground">Model</strong> {prompt.targetModel}</span>
            {prompt.createdAt && <span><strong className="text-foreground">Added</strong> {new Date(prompt.createdAt).toLocaleDateString()}</span>}
            <span>{prompt.rightsStatus === 'original' ? 'Original SwitchRoute preview.' : `${prompt.rightsStatus || 'Source'} content with attribution.`}</span>
          </figcaption>
        </figure>

        {(prompt.authorOrSource || prompt.sourceCreator || prompt.sourceUrl || prompt.attributionUrl) && <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-secondary-foreground"><span><strong className="text-foreground">Creator</strong> {prompt.sourceCreator || prompt.authorOrSource}</span>{(prompt.sourceUrl || prompt.attributionUrl) && <a href={prompt.sourceUrl || prompt.attributionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">View source / attribution <ExternalLink size={13} /></a>}{prompt.rightsLicense && <span><strong className="text-foreground">Rights</strong> {prompt.rightsLicense}</span>}</div>}

        {prompt.mediaType === 'video' && prompt.videoDetails && (
          <section className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 text-sm dark:border-indigo-900 dark:bg-indigo-950/30" aria-labelledby="video-source-title">
            <h2 id="video-source-title" className="font-semibold text-foreground">Suggested video recreation</h2>
            <p className="mt-1 text-xs leading-5 text-secondary-foreground">This is an original SwitchRoute prompt and locally generated poster. It is not an original prompt or video from the linked provider.</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span><strong>Preview:</strong> local poster image</span>
              <span><strong>Rights:</strong> {prompt.videoDetails.permissionStatus || 'Original SwitchRoute artwork'}</span>
              {prompt.videoDetails.sourcePageUrl && <a href={prompt.videoDetails.sourcePageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">Open official provider <ExternalLink size={13} /></a>}
            </div>
          </section>
        )}

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
            <span className="font-mono text-[11px] text-muted-foreground">{recordedCopyCount !== undefined ? `${recordedCopyCount.toLocaleString()} copies` : 'Copy count not available'}</span>
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
          {prompt.rightsStatus && <span className="rounded-full border border-border px-2 py-0.5 capitalize">{prompt.rightsStatus.replace(/-/g, ' ')}</span>}
          {(prompt.sourceUrl || prompt.attributionUrl) && <a href={prompt.sourceUrl || prompt.attributionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">Source <ExternalLink size={12} /></a>}
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
