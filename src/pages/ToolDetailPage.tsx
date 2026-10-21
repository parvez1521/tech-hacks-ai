import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getToolBySlug, getSimilarTools } from '../services/catalogService';
import { getAllGuides } from '../services/aiCatalogService';
import { proprietaryTools } from '../data/alternatives';
import { categories } from '../data/categories';
import { ToolCard } from '../components/ToolCard';
import { GuideCard } from '../components/GuideCard';
import { VerifiedBadge, AiNativeBadge } from '../components/Badge';
import { BrandLogo } from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';
import {
  ExternalLink,
  Github,
  Star,
  GitFork,
  FileCode,
  Clock,
  Calendar,
  Layers,
  Server,
  ArrowLeft,
  Terminal,
  Sparkles,
  BadgeCheck,
  Scale,
  Share2,
  Check,
  BookOpen,
} from 'lucide-react';

export const ToolDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const tool = getToolBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Tool Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find an open-source tool matching the slug "{slug}".
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools Directory</span>
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${siteConfig.url}/tools/${tool.slug}`;
      navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const alternativeItems = proprietaryTools.filter((p) => tool.alternativesTo.includes(p.slug));
  const categoryItems = categories.filter((c) => tool.categories.includes(c.slug));
  const similarTools = getSimilarTools(tool, 3);

  // Find related guides mentioning this tool or category
  const allGuides = getAllGuides();
  const relatedGuides = allGuides.filter(
    (g) =>
      g.relatedToolSlugs.includes(tool.slug) ||
      (tool.categories.includes('developer-tools') && g.category === 'coding') ||
      (tool.categories.includes('productivity') && g.category === 'productivity')
  ).slice(0, 2);

  // SoftwareApplication JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    applicationCategory: tool.categories[0] || 'DeveloperApplication',
    operatingSystem: 'Cross-platform, Docker, Self-hosted',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: `Free and open-source under ${tool.license} license`,
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Embedded JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center justify-between text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/tools" className="hover:text-foreground transition-colors">
            Tools
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{tool.name}</span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-xs"
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

      {/* Main Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <BrandLogo
              slug={tool.slug}
              name={tool.name}
              size="xl"
              iconBgColor={tool.iconBgColor}
              iconLetter={tool.iconLetter}
              className="w-14 h-14 rounded-xl shadow-xs border border-border bg-muted"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {tool.name}
                </h1>
                {tool.isVerified && <VerifiedBadge />}
                {tool.isAiNative && <AiNativeBadge />}
              </div>
              <p className="text-sm sm:text-base text-secondary-foreground">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/20 active:translate-y-0 text-white font-semibold text-sm transition-all duration-150 shadow-sm cursor-pointer"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>

            <a
              href={tool.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted hover:bg-accent hover:border-primary/30 hover:-translate-y-0.5 active:translate-y-0 text-foreground font-semibold text-sm transition-all duration-150 cursor-pointer"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 text-foreground" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Alternative to Chips & Comparison Link */}
        {alternativeItems.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-secondary-foreground font-medium">Open source alternative to:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {alternativeItems.map((alt) => (
                  <Link
                    key={alt.slug}
                    to={`/alternatives/${alt.slug}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border hover:border-[#2563EB]/50 hover:bg-accent hover:text-primary active:scale-95 text-foreground transition-all duration-150 shadow-xs"
                  >
                    <BrandLogo
                      slug={alt.slug}
                      name={alt.name}
                      size="xs"
                      iconBgColor={alt.iconBgColor}
                      iconLetter={alt.iconLetter}
                      className="w-3.5 h-3.5 rounded-full overflow-hidden p-0"
                    />
                    <span className="font-semibold">{alt.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to={`/compare?tools=${tool.slug},${alternativeItems[0].slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-primary border border-primary/30 font-medium hover:bg-blue-100 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-primary" />
              <span>Compare Side-by-Side</span>
            </Link>
          </div>
        )}
      </div>

      {/* Grid: Left Technical Specs & Right Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column: Key Specifications */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Project Metrics
            </h2>

            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-secondary-foreground flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-primary" />
                  GitHub Stars
                </span>
                <span className="font-mono font-medium text-foreground">
                  {tool.stars.toLocaleString()}
                  {tool.starGrowthDelta > 0 && (
                    <span className="text-emerald-700 dark:text-emerald-400 ml-1 text-[10px]">
                      ↑+{tool.starGrowthDelta}
                    </span>
                  )}
                </span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-secondary-foreground flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-primary" />
                  Forks
                </span>
                <span className="font-mono font-medium text-foreground">
                  {tool.forks.toLocaleString()}
                </span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-secondary-foreground flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-primary" />
                  License
                </span>
                <span className="font-mono font-medium px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#17243A] text-foreground dark:text-[#F1F5F9] border border-slate-200 dark:border-[#29384F]">
                  {tool.license}
                </span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-secondary-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Last Commit
                </span>
                <span className="text-foreground">{tool.lastCommitFormatted}</span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-secondary-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Repository Age
                </span>
                <span className="text-foreground">{tool.repositoryAge}</span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-secondary-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Release Version
                </span>
                <span className="font-mono text-foreground font-medium">v{tool.version}</span>
              </li>

              <li className="flex items-center justify-between">
                <span className="text-secondary-foreground flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-primary" />
                  Self-Hostable
                </span>
                <span
                  className={`font-medium ${
                    tool.isSelfHostable ? 'text-emerald-700 dark:text-emerald-400' : 'text-secondary-foreground'
                  }`}
                >
                  {tool.isSelfHostable ? 'Yes (Docker / Bare Metal)' : 'Cloud Managed'}
                </span>
              </li>
            </ul>

            {/* Provenance and Verification Note */}
            <div className="mt-4 pt-3 border-t border-border text-[11px] text-secondary-foreground flex flex-col gap-1">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Verified Snapshot ({tool.verifiedAt || 'October 2026'})</span>
              </span>
              <p>
                Metrics verified via independent GitHub snapshot. Monthly velocity (+{tool.starGrowthDelta}) is an estimated projection based on recent 30-day repository activity.
              </p>
            </div>
          </div>

          {/* Tech Stack Box */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Technology Stack</span>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {tool.techStack.map((stack) => (
                <span
                  key={stack}
                  className="px-2.5 py-1 rounded-md text-xs bg-muted text-foreground border border-border font-medium"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>

          {/* Categories Box */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
              Categories
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {categoryItems.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.slug}`}
                  className="px-3 py-1 rounded-full text-xs bg-[#EAF2FF] text-primary border border-primary/30 hover:bg-blue-100 transition-colors font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deep-Dive Description & Self-Hosting Guide */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* About Section */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-3">
              About {tool.name}
            </h2>
            <p className="text-secondary-foreground text-sm leading-relaxed mb-4">
              {tool.longDescription}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md text-xs bg-muted text-secondary-foreground border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Self-Hosting Instructions (if available) */}
          {tool.selfHostingSteps && tool.selfHostingSteps.length > 0 && (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Quick Self-Host Guide
                </h2>
              </div>

              <div className="space-y-4">
                {tool.selfHostingSteps.map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#EAF2FF] text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {s.title}
                      </h3>
                      <pre tabIndex={0} className="p-3 rounded-xl bg-[#0F172A] border border-slate-700 text-xs font-mono text-emerald-400 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <code>{s.detail}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Open Source Projects */}
      {similarTools.length > 0 && (
        <section className="pt-8 border-t border-border mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Similar Open Source Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {similarTools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* Related Step-by-Step Guides Section */}
      {relatedGuides.length > 0 && (
        <div className="pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Related Tutorials</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Step-by-Step Guides for {tool.name}
              </h2>
            </div>
            <Link to="/guides" className="text-xs text-blue-600 hover:text-blue-700 hover:underline">
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
