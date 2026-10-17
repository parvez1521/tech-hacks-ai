import React from 'react';
import { useRouter, Link } from '../router/Router';
import { getAiToolBySlug, filterAndSortAiTools } from '../services/aiCatalogService';
import { BookmarkButton } from '../components/BookmarkButton';
import { AiToolCard } from '../components/AiToolCard';
import { BookmarkItem } from '../types';
import { Sparkles, Star, ExternalLink, ArrowLeft, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

export const AiToolDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const tool = getAiToolBySlug(slug);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/ai-tools" className="hover:text-foreground">AI Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{tool.name}</span>
      </nav>

      {/* Hero Overview */}
      <div className="p-6 sm:p-8 rounded-xl border border-border bg-card/80 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-md shrink-0"
              style={{ backgroundColor: tool.iconBgColor }}
            >
              {tool.iconLetter}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {tool.name}
                </h1>
                {tool.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-md transition-all active:scale-98"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed mb-4">
          {tool.tagline}
        </p>

        <p className="text-sm text-secondary-foreground leading-relaxed mb-6">
          {tool.longDescription || tool.description}
        </p>

        {/* Pricing Box */}
        <div className="p-4 rounded-lg bg-muted/60 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-foreground uppercase tracking-wider block text-[11px] mb-0.5">
              Pricing Structure
            </span>
            <span className="text-secondary-foreground">{tool.pricingDetails}</span>
          </div>
          <span className="font-mono px-2.5 py-1 rounded bg-card text-foreground border border-border font-medium self-start sm:self-auto capitalize">
            {tool.pricingType}
          </span>
        </div>
      </div>

      {/* Features & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 p-6 rounded-xl border border-border bg-card/60">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Core Capabilities & Features</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tool.features.map((feat) => (
              <div key={feat} className="flex items-start gap-2.5 text-xs text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card/60 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <span>Tags & Keywords</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tool.tags.map((tag) => (
              <Link
                key={tag}
                to={`/ai-tools?q=${tag}`}
                className="px-2 py-1 rounded text-xs bg-muted text-secondary-foreground hover:bg-border transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Tools in same category */}
      {similarTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">
              Similar {tool.category} AI Platforms
            </h2>
            <Link to={`/ai-tools?category=${tool.category}`} className="text-xs text-primary hover:underline">
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
    </div>
  );
};
