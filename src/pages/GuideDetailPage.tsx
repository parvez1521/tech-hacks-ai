import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getGuideBySlug, getAllGuides, getAiToolBySlug, getAllPrompts } from '../services/aiCatalogService';
import { getToolBySlug } from '../services/catalogService';
import { BookmarkButton } from '../components/BookmarkButton';
import { BookmarkItem } from '../types';
import { BookOpen, Clock, Calendar, Copy, Check, ArrowLeft, ArrowRight, ExternalLink, Wrench, Share2 } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';

export const GuideDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const guide = getGuideBySlug(slug);

  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Guide Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a tutorial or workflow guide matching "{slug}".
        </p>
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </Link>
      </div>
    );
  }

  const allGuides = getAllGuides();
  const relatedPromptMedia = getAllPrompts().filter((item) => item.videoDetails?.guideSlugs?.includes(guide.slug));
  const currentIndex = allGuides.findIndex((g) => g.id === guide.id);
  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  const bookmarkItem: BookmarkItem = {
    id: `guide-${guide.id}`,
    type: 'guide',
    slug: guide.slug,
    title: guide.title,
    subtitle: guide.summary,
    url: `/guides/${guide.slug}`,
    savedAt: new Date().toISOString(),
  };

  const handleCopyPrompt = (promptText: string, stepNumber: number) => {
    navigator.clipboard.writeText(promptText).catch(() => {});
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${siteConfig.url}/guides/${guide.slug}`;
      navigator.clipboard.writeText(canonicalUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Structured Data (HowTo schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.summary,
    url: `${siteConfig.url}/guides/${guide.slug}`,
    datePublished: guide.publishedDate,
    author: {
      '@type': 'Person',
      name: guide.author,
    },
    step: guide.steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.stepNumber,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Embedded JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="mb-6 flex flex-col items-start gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between" aria-label="Breadcrumb">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-blue-600 font-medium truncate max-w-[200px] sm:max-w-md">{guide.title}</span>
        </div>

        <button
          type="button"
          onClick={handleCopyShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-secondary-foreground transition-colors shrink-0 shadow-xs cursor-pointer"
          aria-label={copiedShare ? 'Copied!' : 'Share'}
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium">Share</span>
            </>
          )}
        </button>
      </nav>

      {/* Guide Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize font-mono">
            {guide.category.replace('-', ' ')}
          </span>
          <BookmarkButton item={bookmarkItem} size="md" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
          {guide.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
          <span>By <strong className="text-secondary-foreground font-medium">{guide.author}</strong></span>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{guide.readTime}</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{guide.publishedDate}</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-secondary-foreground leading-relaxed bg-card p-5 rounded-2xl border border-border shadow-invary-card">
          {guide.summary}
        </p>
      </div>

      {/* Step by Step Walkthrough */}
      <div className="space-y-6 mb-12">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span>Step-by-Step Instructions</span>
        </h2>

        {guide.steps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-6 rounded-2xl border border-border bg-card shadow-invary-card space-y-3 relative hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 font-mono">
                {step.stepNumber}
              </span>
              <h3 className="font-bold text-foreground text-base tracking-tight">
                {step.title}
              </h3>
            </div>

            <p className="text-sm text-secondary-foreground leading-relaxed pl-11">
              {step.description}
            </p>

            {step.media?.type === 'image' && <figure className="ml-11 mt-4 max-w-2xl overflow-hidden rounded-xl border border-border bg-muted"><img src={step.media.src} alt={step.media.alt} loading="lazy" decoding="async" className="block max-h-[420px] w-full object-contain" /><figcaption className="px-3 py-2 text-xs leading-5 text-muted-foreground">{step.media.caption}</figcaption></figure>}

            {step.promptTemplate && (
              <div className="ml-11 mt-4 p-4 rounded-xl bg-[#F5F8FF] border border-border space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-blue-700 font-mono">
                    Recommended Prompt Template
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(step.promptTemplate!, step.stepNumber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card hover:bg-muted text-secondary-foreground border border-border transition-colors font-medium text-[11px] shadow-xs cursor-pointer"
                  >
                    {copiedStep === step.stepNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed select-all">
                  "{step.promptTemplate}"
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {relatedPromptMedia.length > 0 && <section className="mb-12 rounded-2xl border border-border bg-card p-5" aria-labelledby="guide-media-title"><h2 id="guide-media-title" className="text-lg font-bold text-foreground">Related image-to-video studies</h2><p className="mt-1 text-sm text-muted-foreground">Original Tech Hacks AI prompt recipes and still posters. No third-party video clips are embedded.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{relatedPromptMedia.map((item) => <Link key={item.slug} to={`/prompt-library/${item.slug}`} className="group overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><img src={item.videoDetails?.previewUrl || item.previewImage} alt={item.previewImageAlt || `${item.title} video prompt poster`} loading="lazy" decoding="async" className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]" /><span className="block p-3 text-sm font-semibold text-foreground group-hover:text-primary">{item.title}</span></Link>)}</div></section>}

      {/* Featured / Mentioned Tools */}
      {guide.relatedToolSlugs.length > 0 && (
        <div className="mb-12 p-6 rounded-2xl border border-border bg-card shadow-invary-card">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>Tools & Models Used in this Guide</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.relatedToolSlugs.map((slug) => {
              const aiTool = getAiToolBySlug(slug);
              const osTool = getToolBySlug(slug);
              const tool = aiTool || osTool;
              if (!tool) return null;
              const link = aiTool ? `/ai-tools/${tool.slug}` : `/tools/${tool.slug}`;

              return (
                <Link
                  key={tool.id}
                  to={link}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-[#F5F8FF] hover:bg-card hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BrandLogo
                      slug={tool.slug}
                      name={tool.name}
                      size="xs"
                      iconBgColor={tool.iconBgColor}
                      iconLetter={tool.iconLetter}
                      className="w-7 h-7"
                    />
                    <span className="font-semibold text-sm text-foreground group-hover:text-blue-600 transition-colors truncate">{tool.name}</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">View Tool →</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Previous / Next Navigation */}
      <div className="pt-6 border-t border-border flex items-center justify-between gap-4 text-xs">
        {prevGuide ? (
          <Link
            to={`/guides/${prevGuide.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors max-w-[45%]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-blue-600" />
            <div className="text-left truncate">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Previous Guide</span>
              <span className="font-medium text-secondary-foreground hover:text-blue-600 truncate block">{prevGuide.title}</span>
            </div>
          </Link>
        ) : <div />}

        {nextGuide ? (
          <Link
            to={`/guides/${nextGuide.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors max-w-[45%] text-right"
          >
            <div className="text-right truncate">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Next Guide</span>
              <span className="font-medium text-secondary-foreground hover:text-blue-600 truncate block">{nextGuide.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 text-blue-600" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};
