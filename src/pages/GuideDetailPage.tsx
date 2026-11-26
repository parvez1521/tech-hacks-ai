import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getGuideBySlug, getAllGuides, getAiToolBySlug, getAllPrompts } from '../services/aiCatalogService';
import { getToolBySlug, getToolDetailUrl } from '../services/catalogService';
import { BookmarkButton } from '../components/BookmarkButton';
import { BookmarkItem } from '../types';
import { BookOpen, Clock, Calendar, Copy, Check, ArrowLeft, ArrowRight, ExternalLink, Wrench, Share2, Terminal } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';
import { serializeJsonLd } from '../lib/jsonLd';

export const GuideDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const guide = getGuideBySlug(slug);

  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<number | null>(null);
  const [copiedAgentPrompt, setCopiedAgentPrompt] = useState<string | null>(null);
  const [setupMode, setSetupMode] = useState<'manual' | 'agent'>('manual');
  const [activeAgentId, setActiveAgentId] = useState<'claude-code' | 'codex' | 'antigravity'>('claude-code');
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

  const activeAgentPrompt = guide.agentPrompts?.find((item) => item.id === activeAgentId) || guide.agentPrompts?.[0];

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

  const handleCopyCommand = (command: string, stepNumber: number) => {
    navigator.clipboard.writeText(command).catch(() => {});
    setCopiedCommand(stepNumber);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleCopyAgentPrompt = (promptText: string, agentId: string) => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopiedAgentPrompt(agentId);
      setTimeout(() => setCopiedAgentPrompt(null), 2500);
    }).catch(() => setCopiedAgentPrompt(null));
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
      '@type': 'Organization',
      name: guide.author,
      url: `${siteConfig.url}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="mb-6 flex flex-col items-start gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between" aria-label="Breadcrumb">
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span className="text-muted-foreground">/</span>
          <span className="min-w-0 max-w-[160px] truncate text-blue-600 font-medium sm:max-w-md">{guide.title}</span>
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

      {guide.agentPrompts && guide.agentPrompts.length > 0 && (
        <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-invary-card" aria-labelledby="guide-setup-method-title">
          <div className="mb-4">
            <h2 id="guide-setup-method-title" className="text-lg font-bold text-foreground">Choose Your Setup Method</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Follow the commands yourself, or let a coding agent guide the installation on this computer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="tablist" aria-label="Setup method">
            <button
              type="button"
              role="tab"
              aria-selected={setupMode === 'manual'}
              onClick={() => setSetupMode('manual')}
              className={`flex min-h-12 items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${setupMode === 'manual' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-muted'}`}
            >
              <Terminal className="mr-2 h-4 w-4" aria-hidden="true" />
              Manual Setup
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={setupMode === 'agent'}
              onClick={() => setSetupMode('agent')}
              className={`flex min-h-12 items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${setupMode === 'agent' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-muted'}`}
            >
              <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
              AI Agent Setup
            </button>
          </div>

          {setupMode === 'agent' && activeAgentPrompt && (
            <div className="mt-5 border-t border-border pt-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-foreground">Choose Your AI Coding Agent</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Open the selected agent on this same computer with terminal access, then copy and paste the prompt below.
                </p>
              </div>

              <div className="flex flex-wrap gap-2" role="tablist" aria-label="AI coding agent">
                {guide.agentPrompts.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    role="tab"
                    aria-selected={activeAgentPrompt.id === agent.id}
                    onClick={() => setActiveAgentId(agent.id)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeAgentPrompt.id === agent.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-secondary-foreground hover:bg-muted'}`}
                  >
                    {agent.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/30">
                <div className="flex flex-col gap-3 border-b border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground">{activeAgentPrompt.name} Setup Prompt</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{activeAgentPrompt.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAgentPrompt(activeAgentPrompt.prompt, activeAgentPrompt.id)}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-live="polite"
                    aria-label={copiedAgentPrompt === activeAgentPrompt.id ? 'Setup prompt copied' : `Copy ${activeAgentPrompt.name} setup prompt`}
                  >
                    {copiedAgentPrompt === activeAgentPrompt.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-xs leading-relaxed text-foreground"><code>{activeAgentPrompt.prompt}</code></pre>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                The agent will inspect your system first and ask before installing. Keep its terminal access enabled so it can run approved setup and verification commands.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Step by Step Walkthrough */}
      {(!guide.agentPrompts?.length || setupMode === 'manual') && (
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

            {step.command && (
              <div className="ml-0 sm:ml-11 mt-4 rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                      <Terminal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Command · {step.commandTarget || 'Terminal'}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-secondary-foreground">
                      {step.commandInstruction || `Copy this command and paste it into ${step.commandTarget || 'your terminal'}.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(step.command!, step.stepNumber)}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-live="polite"
                    aria-label={copiedCommand === step.stepNumber ? 'Command copied' : `Copy command for step ${step.stepNumber}`}
                  >
                    {copiedCommand === step.stepNumber ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border/70 bg-background px-3 py-3 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap"><code>{step.command}</code></pre>
              </div>
            )}

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
      )}

      {guide.references && guide.references.length > 0 && (
        <section className="mb-12 rounded-2xl border border-border bg-card p-6 shadow-invary-card" aria-labelledby="guide-references-title">
          <div className="mb-4">
            <h2 id="guide-references-title" className="text-lg font-bold text-foreground">
              Official documentation &amp; further reading
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              These first-party resources help verify product workflows, eligibility, privacy terms, and plan details. Providers can change features and limits, so check the current source before making a purchase or production decision.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {guide.references.map((reference) => (
              <li key={reference.url}>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-start justify-between gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{reference.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{reference.publisher} · Official source</span>
                  </span>
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedPromptMedia.length > 0 && <section className="mb-12 rounded-2xl border border-border bg-card p-5" aria-labelledby="guide-media-title"><h2 id="guide-media-title" className="text-lg font-bold text-foreground">Related image-to-video studies</h2><p className="mt-1 text-sm text-muted-foreground">Original SwitchRoute prompt recipes and still posters. No third-party video clips are embedded.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{relatedPromptMedia.map((item) => <Link key={item.slug} to={`/prompt-library/${item.slug}`} className="group overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><img src={item.videoDetails?.previewUrl || item.previewImage} alt={item.previewImageAlt || `${item.title} video prompt poster`} loading="lazy" decoding="async" className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]" /><span className="block p-3 text-sm font-semibold text-foreground group-hover:text-primary">{item.title}</span></Link>)}</div></section>}

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
              // Only featured open-source tools have a live /tools/:slug page;
              // the rest link out to the tool's own site instead of a 404.
              const detailUrl = aiTool ? `/ai-tools/${tool.slug}` : getToolDetailUrl(tool.slug);
              if (!detailUrl) {
                return (
                  <a
                    key={tool.id}
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    <span className="text-xs text-blue-600 font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">Visit Website →</span>
                  </a>
                );
              }

              return (
                <Link
                  key={tool.id}
                  to={detailUrl}
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
