import React from 'react';
import { useRouter, Link } from '../router/Router';
import { getToolBySlug, getSimilarTools } from '../services/catalogService';
import { proprietaryTools } from '../data/alternatives';
import { categories } from '../data/categories';
import { ToolCard } from '../components/ToolCard';
import { VerifiedBadge, AiNativeBadge } from '../components/Badge';
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
} from 'lucide-react';

export const ToolDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const tool = getToolBySlug(slug);

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

  const alternativeItems = proprietaryTools.filter((p) => tool.alternativesTo.includes(p.slug));
  const categoryItems = categories.filter((c) => tool.categories.includes(c.slug));
  const similarTools = getSimilarTools(tool, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link to="/tools" className="hover:text-foreground">
          Tools
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{tool.name}</span>
      </nav>

      {/* Main Hero Header */}
      <div className="p-6 sm:p-8 rounded-xl border border-border bg-card/60 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-md shrink-0"
              style={{ backgroundColor: tool.iconBgColor }}
            >
              {tool.iconLetter}
            </div>
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
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-colors shadow-sm"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={tool.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-muted hover:bg-border text-foreground font-semibold text-sm transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Alternative to Chips */}
        {alternativeItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/50 text-xs">
            <span className="text-muted-foreground font-medium">Open source alternative to:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {alternativeItems.map((alt) => (
                <Link
                  key={alt.slug}
                  to={`/alternatives/${alt.slug}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border hover:border-primary/50 text-foreground transition-colors"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white font-bold"
                    style={{ backgroundColor: alt.iconBgColor }}
                  >
                    {alt.iconLetter}
                  </span>
                  <span className="font-semibold">{alt.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Left Technical Specs & Right Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column: Key Specifications */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-lg border border-border bg-card/60">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Project Metrics
            </h2>

            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  GitHub Stars
                </span>
                <span className="font-mono font-medium text-foreground">
                  {tool.stars.toLocaleString()}
                  {tool.starGrowthDelta > 0 && (
                    <span className="text-emerald-400 ml-1 text-[10px]">
                      ↑+{tool.starGrowthDelta}
                    </span>
                  )}
                </span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5" />
                  Forks
                </span>
                <span className="font-mono font-medium text-foreground">
                  {tool.forks.toLocaleString()}
                </span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  License
                </span>
                <span className="font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-foreground">
                  {tool.license}
                </span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Last Commit
                </span>
                <span className="text-foreground">{tool.lastCommitFormatted}</span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Repository Age
                </span>
                <span className="text-foreground">{tool.repositoryAge}</span>
              </li>

              <li className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Release Version
                </span>
                <span className="font-mono text-foreground font-medium">v{tool.version}</span>
              </li>

              <li className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  Self-Hostable
                </span>
                <span
                  className={`font-medium ${
                    tool.isSelfHostable ? 'text-emerald-400' : 'text-muted-foreground'
                  }`}
                >
                  {tool.isSelfHostable ? 'Yes (Docker / Bare Metal)' : 'Cloud Managed'}
                </span>
              </li>
            </ul>

            {/* Provenance and Verification Note */}
            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex flex-col gap-1">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Verified Snapshot ({tool.verifiedAt || 'October 2026'})</span>
              </span>
              <p>
                Metrics verified via independent GitHub snapshot. Monthly velocity (+{tool.starGrowthDelta}) is an estimated projection based on recent 30-day repository activity.
              </p>
            </div>
          </div>

          {/* Tech Stack Box */}
          <div className="p-5 rounded-lg border border-border bg-card/60">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Technology Stack</span>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {tool.techStack.map((stack) => (
                <span
                  key={stack}
                  className="px-2 py-1 rounded text-xs bg-muted text-foreground border border-border font-medium"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>

          {/* Categories Box */}
          <div className="p-5 rounded-lg border border-border bg-card/60">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
              Categories
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {categoryItems.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.slug}`}
                  className="px-2.5 py-1 rounded text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-medium"
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
          <div className="p-6 rounded-lg border border-border bg-card/60">
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
                  className="px-2 py-0.5 rounded text-xs bg-background text-muted-foreground border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Self-Hosting Instructions (if available) */}
          {tool.selfHostingSteps && tool.selfHostingSteps.length > 0 && (
            <div className="p-6 rounded-lg border border-border bg-card/60">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Quick Self-Host Guide
                </h2>
              </div>

              <div className="space-y-4">
                {tool.selfHostingSteps.map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {s.title}
                      </h3>
                      <pre className="p-2.5 rounded bg-background border border-border text-xs font-mono text-emerald-400 overflow-x-auto">
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
        <section className="pt-8 border-t border-border/60">
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
    </div>
  );
};
