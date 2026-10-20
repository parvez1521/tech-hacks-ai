import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getAiToolBySlug, filterAndSortAiTools, getAllGuides } from '../services/aiCatalogService';
import { BookmarkButton } from '../components/BookmarkButton';
import { AiToolCard } from '../components/AiToolCard';
import { GuideCard } from '../components/GuideCard';
import { BookmarkItem } from '../types';
import { Sparkles, Star, ExternalLink, ArrowLeft, CheckCircle2, ShieldCheck, Tag, Info, Calendar, Lock, Unlock, Server, Scale, Share2, Check, BookOpen, Users, Cpu } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';

export const AiToolDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const tool = getAiToolBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">AI Tool Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find an AI tool record matching "{slug}".
        </p>
        <Link
          to="/ai-tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All AI Tools</span>
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${siteConfig.url}/ai-tools/${tool.slug}`;
      navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
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

  // Find related tools in same category
  const { tools: relatedTools } = filterAndSortAiTools({
    searchQuery: '',
    category: tool.category,
    pricingType: 'all',
    sortBy: 'popular',
    page: 1,
  });
  const similarTools = relatedTools.filter((t) => t.id !== tool.id).slice(0, 3);

  // Find related guides mentioning this tool or category
  const allGuides = getAllGuides();
  const relatedGuides = allGuides.filter(
    (g) =>
      g.relatedToolSlugs.includes(tool.slug) ||
      (tool.category === 'coding' && g.category === 'coding') ||
      (tool.category === 'video' && g.category === 'video-creation') ||
      (tool.category === 'assistants' && (g.category === 'prompting' || g.category === 'productivity'))
  ).slice(0, 2);

  // Comparison slugs
  const comparisonSlugs = [
    tool.slug,
    ...(tool.alternativesTo || similarTools.map((s) => s.slug)),
  ].slice(0, 3);

  // SoftwareApplication JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${siteConfig.url}/ai-tools/${tool.slug}`,
    applicationCategory: tool.category,
    operatingSystem: tool.isSelfHostable ? 'Cross-platform, Docker, Local' : 'Cloud / Web Browser',
    offers: {
      '@type': 'Offer',
      price: tool.pricingType === 'free' ? '0' : undefined,
      priceCurrency: 'USD',
      description: tool.freeTierSummary,
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Embedded JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center justify-between text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/ai-tools" className="hover:text-[#0F172A] transition-colors">AI Tools</Link>
          <span>/</span>
          <span className="text-[#0F172A] font-medium">{tool.name}</span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-xs"
          aria-label={copied ? 'Link Copied!' : 'Share'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share</span>
            </>
          )}
        </button>
      </nav>

      {/* Hero Overview */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#DFE7F3] bg-white shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <BrandLogo
              slug={tool.slug}
              name={tool.name}
              size="xl"
              iconBgColor={tool.iconBgColor}
              iconLetter={tool.iconLetter}
              className="w-14 h-14 rounded-xl shadow-xs border border-[#DFE7F3] bg-[#F5F8FF]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {tool.name}
                </h1>
                {tool.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Featured</span>
                  </span>
                )}
                {tool.isSelfHostable && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    <Server className="w-3 h-3 text-emerald-600" />
                    <span>Self-Hostable</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-[#64748B] mt-1 capitalize">
                Category: {tool.category} • Released {tool.releaseYear || 2024}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BookmarkButton item={bookmarkItem} size="md" />
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] shadow-md shadow-blue-500/20 transition-all active:scale-98 cursor-pointer"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <p className="text-base sm:text-lg text-[#0F172A] font-medium leading-relaxed mb-4">
          {tool.tagline}
        </p>

        <p className="text-sm text-[#64748B] leading-relaxed mb-6">
          {tool.longDescription || tool.description}
        </p>

        {/* Verified Free Access & Pricing Specifications */}
        <div className="p-5 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] text-xs space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DFE7F3] pb-3">
            <div>
              <span className="font-semibold text-[#0F172A] uppercase tracking-wider block text-[11px] mb-0.5">
                Pricing Structure & Model Access
              </span>
              <span className="text-[#64748B]">{tool.pricingDetails}</span>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-mono px-3 py-1 rounded-lg bg-white text-[#0F172A] border border-[#DFE7F3] font-medium capitalize">
                {tool.pricingType}
              </span>
              <a
                href={tool.pricingSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#EAF2FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-blue-100 transition-colors font-medium"
              >
                <span>Official Pricing</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Granular Free Tier Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-white border border-[#DFE7F3]">
              <span className="text-[#64748B] block text-[11px] mb-1 font-medium">Free Access Quota</span>
              <span className="text-[#0F172A] font-medium leading-tight block">{tool.freeTierSummary}</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#DFE7F3]">
              <span className="text-[#64748B] block text-[11px] mb-1 font-medium">Free Tier Limits</span>
              <span className="text-[#64748B] leading-tight block">{tool.freeTierLimits}</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#DFE7F3]">
              <span className="text-[#64748B] block text-[11px] mb-1 font-medium">Requirements & Verification</span>
              <div className="flex flex-col gap-1 text-[11px]">
                <span className="flex items-center gap-1.5 text-[#0F172A]">
                  {tool.requiresAccount ? (
                    <>
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span>Account Required</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-emerald-600" />
                      <span>No Account Required (Instant)</span>
                    </>
                  )}
                </span>
                <span className="flex items-center gap-1.5 text-[#64748B] font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>Verified: {tool.pricingVerifiedAt}</span>
                </span>
              </div>
            </div>
          </div>

          {tool.openSourceRepoUrl && (
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#64748B]">
              <span>Open-Source Repository & Local Deployment:</span>
              <a
                href={tool.openSourceRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-mono inline-flex items-center gap-1"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Features, Persona & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Core Capabilities & Features</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {tool.features.map((feat) => (
              <div key={feat} className="flex items-start gap-2.5 text-xs text-[#0F172A]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Persona & Execution Environment */}
          <div className="pt-4 border-t border-[#DFE7F3] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-[#2563EB] font-semibold uppercase text-[11px] tracking-wider mb-1">
                <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Who It's Best Suited For</span>
              </div>
              <p className="text-[#64748B] leading-relaxed">
                {tool.bestFor ||
                  (tool.useCases && tool.useCases.length > 0
                    ? `Ideal for practitioners focused on ${tool.useCases.join(', ')}.`
                    : `Professionals, developers, and creators requiring high-reliability ${tool.category} workflows.`)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#2563EB] font-semibold uppercase text-[11px] tracking-wider mb-1">
                <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Execution Environment</span>
              </div>
              <p className="text-[#64748B] leading-relaxed">
                {tool.isSelfHostable
                  ? 'Self-hostable via Docker or local GPU (macOS, Linux, Windows).'
                  : tool.requiresInstallation
                  ? 'Desktop/CLI installation required for local workflow execution.'
                  : 'Web browser cloud SaaS. No local GPU or installation required.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#2563EB]" />
              <span>Tags & Keywords</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/ai-tools?q=${tag}`}
                  className="px-2.5 py-1 rounded-md text-xs bg-[#F5F8FF] text-[#2563EB] hover:bg-[#EAF2FF] border border-[#BFDBFE] transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Comparison CTA Box */}
          <div className="p-5 rounded-2xl border border-[#BFDBFE] bg-[#EAF2FF] text-xs shadow-xs">
            <div className="flex items-center gap-1.5 text-[#2563EB] font-semibold uppercase text-[11px] tracking-wider mb-1.5">
              <Scale className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Side-by-Side Comparison</span>
            </div>
            <p className="text-[#0F172A] mb-3 leading-relaxed">
              Evaluate licensing, rate limits, and pricing models directly against similar platforms.
            </p>
            <Link
              to={`/compare?tools=${comparisonSlugs.join(',')}`}
              className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-98"
            >
              <span>Compare {tool.name}</span>
              <Scale className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Tools in same category */}
      {similarTools.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Similar {tool.category} AI Platforms
            </h2>
            <Link to={`/ai-tools?category=${tool.category}`} className="text-xs text-blue-600 hover:text-blue-700 hover:underline">
              View all {tool.category} tools →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarTools.map((t) => (
              <AiToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* Related Step-by-Step Guides Section */}
      {relatedGuides.length > 0 && (
        <div className="pt-8 border-t border-[#DFE7F3]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Related Workflows</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Step-by-Step Guides for {tool.name}
              </h2>
            </div>
            <Link to="/guides" className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold">
              Browse all guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
