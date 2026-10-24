import React from 'react';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from '../router/Router';
import { BrandLogo } from './BrandLogo';
import { getAiAlternativesForTarget, getAiToolBySlug } from '../services/aiCatalogService';
import { proprietaryTools } from '../data/alternatives';

interface ShowcaseTarget {
  slug: string;
  name: string;
  category: string;
  relationshipSource: 'catalog' | 'proprietary';
}

const showcaseTargets: ShowcaseTarget[] = [
  { slug: 'claude', name: 'Claude', category: 'assistants', relationshipSource: 'catalog' },
  { slug: 'invideo-ai', name: 'InVideo AI', category: 'video', relationshipSource: 'proprietary' },
  { slug: 'runway', name: 'Runway', category: 'video', relationshipSource: 'catalog' },
  { slug: 'cursor', name: 'Cursor', category: 'coding', relationshipSource: 'catalog' },
  { slug: 'chatgpt', name: 'ChatGPT', category: 'assistants', relationshipSource: 'catalog' },
  { slug: 'pictory', name: 'Pictory', category: 'video', relationshipSource: 'proprietary' },
];

function getTargetDetails(target: ShowcaseTarget) {
  if (target.relationshipSource === 'catalog') {
    const tool = getAiToolBySlug(target.slug);
    return tool ? { slug: tool.slug, name: target.name, websiteUrl: tool.websiteUrl, detailUrl: `/ai-tools/${tool.slug}` } : null;
  }

  const tool = proprietaryTools.find((item) => item.slug === target.slug);
  return tool ? { slug: tool.slug, name: target.name, websiteUrl: tool.websiteUrl, detailUrl: `/alternatives/${tool.slug}` } : null;
}

export const AiAlternativesShowcase: React.FC = () => {
  const cards = showcaseTargets.flatMap((target) => {
    const original = getTargetDetails(target);
    const alternatives = getAiAlternativesForTarget(target.slug).slice(0, 3);
    if (!original || alternatives.length === 0) return [];

    return [{
      target,
      original,
      alternatives,
      alternativesUrl: `/ai-tools?category=${target.category}&alternativesTo=${target.slug}`,
    }];
  });

  return (
    <div className="ai-alternatives-showcase rounded-2xl border border-border bg-gradient-to-br from-primary/[0.08] via-card to-cyan-500/[0.04] p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-primary text-[11px] sm:text-xs font-semibold tracking-[0.12em] mb-3">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>FIND YOUR BETTER ALTERNATIVE</span>
          </p>
          <h2 id="ai-alternatives-heading" className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Love the tool. Not the price?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary-foreground max-w-xl">
            Discover AI alternatives that fit your budget, workflow, and privacy needs. Compare free options, open-source projects, and hosted tools.
          </p>
        </div>
        <Link
          to="/alternatives"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
        >
          <span>Browse all alternatives</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 auto-rows-fr sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {cards.map(({ target, original, alternatives, alternativesUrl }) => (
          <article data-testid="ai-alternatives-card" key={target.slug} className="group flex min-w-0 flex-col rounded-xl border border-border/80 bg-card/90 p-4 sm:p-5 transition-colors hover:border-primary/40 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
            <div className="flex min-w-0 items-center gap-3">
              <BrandLogo slug={original.slug} name={original.name} size="md" />
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Original tool</span>
                {target.relationshipSource === 'catalog' ? (
                  <Link to={original.detailUrl} className="block break-words text-base font-bold leading-tight text-foreground hover:text-primary focus-visible:outline-none focus-visible:underline">
                    {original.name}
                  </Link>
                ) : (
                  <a href={original.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-base font-bold leading-tight text-foreground hover:text-primary focus-visible:outline-none focus-visible:underline">
                    <span className="break-words">{original.name}</span><ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            <ul className="mt-4 flex flex-wrap content-start gap-2" aria-label={`AI alternatives to ${original.name}`}>
              {alternatives.map((tool) => (
                <li key={tool.slug} className="min-w-0 max-w-full">
                  <Link
                    to={`/ai-tools/${tool.slug}`}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-background/70 px-2 py-1 text-[11px] leading-tight text-secondary-foreground hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`${tool.name}, an AI alternative to ${original.name}`}
                  >
                    <BrandLogo slug={tool.slug} name={tool.name} size="xs" showContainer={false} />
                    <span className="break-words">{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              <Link
                to={alternativesUrl}
                className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:underline"
                aria-label={`Explore alternatives to ${original.name}`}
              >
                <span>Explore alternatives</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
