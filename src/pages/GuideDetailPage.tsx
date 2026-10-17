import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getGuideBySlug, getAllGuides, getAiToolBySlug } from '../services/aiCatalogService';
import { getToolBySlug } from '../services/catalogService';
import { BookmarkButton } from '../components/BookmarkButton';
import { BookmarkItem } from '../types';
import { BookOpen, Clock, Calendar, Copy, Check, ArrowLeft, ArrowRight, ExternalLink, Wrench } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const GuideDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const guide = getGuideBySlug(slug);

  const [copiedStep, setCopiedStep] = useState<number | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/guides" className="hover:text-foreground">Guides</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{guide.title}</span>
      </nav>

      {/* Guide Header */}
      <div className="mb-8 pb-6 border-b border-border/60">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize">
            {guide.category.replace('-', ' ')}
          </span>
          <BookmarkButton item={bookmarkItem} size="md" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
          {guide.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
          <span>By {guide.author}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{guide.readTime}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{guide.publishedDate}</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-secondary-foreground leading-relaxed bg-card/60 p-4 rounded-xl border border-border">
          {guide.summary}
        </p>
      </div>

      {/* Step by Step Walkthrough */}
      <div className="space-y-8 mb-12">
        <h2 className="text-lg font-bold text-foreground">Step-by-Step Instructions</h2>

        {guide.steps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-5 sm:p-6 rounded-xl border border-border bg-card/70 space-y-3 relative"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/30">
                {step.stepNumber}
              </span>
              <h3 className="font-bold text-foreground text-base tracking-tight">
                {step.title}
              </h3>
            </div>

            <p className="text-sm text-secondary-foreground leading-relaxed pl-10">
              {step.description}
            </p>

            {step.promptTemplate && (
              <div className="ml-10 mt-3 p-4 rounded-lg bg-muted/80 border border-border space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-purple-400">
                    Recommended Prompt Template
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(step.promptTemplate!, step.stepNumber)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-card hover:bg-border text-foreground transition-colors font-medium text-[11px]"
                  >
                    {copiedStep === step.stepNumber ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
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

      {/* Featured / Mentioned Tools */}
      {guide.relatedToolSlugs.length > 0 && (
        <div className="mb-12 p-6 rounded-xl border border-border bg-card/60">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
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
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BrandLogo
                      slug={tool.slug}
                      name={tool.name}
                      size="xs"
                      iconBgColor={tool.iconBgColor}
                      iconLetter={tool.iconLetter}
                      className="w-7 h-7"
                    />
                    <span className="font-semibold text-sm text-foreground truncate">{tool.name}</span>
                  </div>
                  <span className="text-xs text-primary font-medium shrink-0">View Tool →</span>
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
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <div className="text-left truncate">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Previous Guide</span>
              <span className="font-medium text-foreground truncate block">{prevGuide.title}</span>
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
              <span className="font-medium text-foreground truncate block">{nextGuide.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};
