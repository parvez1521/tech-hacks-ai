import React from 'react';
import { ArrowRight, BookOpen, Code2, Gift, Layers3, Video, Wrench } from 'lucide-react';
import { Link } from '../router/Router';
import { UniversalSearch } from '../components/UniversalSearch';
import { HeroSignalVisual } from '../components/HeroSignalVisual';
import { DailyDiscoveriesSection } from '../components/DailyDiscoveriesSection';
import { aiCategories } from '../data/aiToolsData';
import { getActiveOffers, getFeaturedOffers } from '../data/offersData';

const featuredCollections = [
  { title: 'Frontier Models', href: '/frontier-models', description: 'Model capabilities, official docs and access routes.', eyebrow: 'Model index', tone: 'model' },
  { title: 'Free Access', href: '/free-ai-sites', description: 'Free tiers, trials and current promotional access.', eyebrow: 'Checked routes', tone: 'access' },
  { title: 'All AI Tools', href: '/ai-tools', description: 'Search platforms, products and services by task.', eyebrow: 'Platform directory', tone: 'catalog' },
  { title: 'GitHub Projects', href: '/github-projects', description: 'Reviewed open-source projects for AI and software workflows.', eyebrow: 'Open source', tone: 'catalog' },
];

const resources = [
  ['Open Source Catalog', '/tools', Layers3],
  ['Utility Tools', '/free-tools', Wrench],
  ['Alternatives & Compare', '/alternatives', Code2],
  ['Guides & Prompt Library', '/guides', BookOpen],
] as const;

export const HomePage: React.FC = () => {
  const activeOffers = getActiveOffers();
  const offers = getFeaturedOffers().filter((offer) => activeOffers.some((active) => active.slug === offer.slug)).slice(0, 2);

  return (
    <main className="pb-12 sm:pb-16">
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-12" aria-labelledby="home-hero-heading">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium text-primary">A practical map to AI</p>
          <h1 id="home-hero-heading" className="max-w-[21ch] text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.5rem]">
            <span className="block">Another AI tool?</span>
            <span className="block">Sure.</span>
            <span className="block">Another Subscription?</span>
            <span className="block">Nope.</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Compare AI tools by task, check current access routes, and find reviewed open-source projects.
          </p>
          <div className="mt-6 max-w-xl">
            <UniversalSearch />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link to="/pick" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Help me pick <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/ai-video-tools" className="inline-flex min-h-11 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Video className="h-4 w-4" aria-hidden="true" /> AI video generators
            </Link>
          </div>
        </div>
        <div className="hidden min-w-0 lg:block">
          <HeroSignalVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="collections-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Start exploring</p>
            <h2 id="collections-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Choose a collection</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCollections.map((item) => (
            <Link
              to={item.href}
              key={item.href}
              className={`group flex min-h-40 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6 ${item.tone === 'model' ? 'border-t-2 border-t-primary' : item.tone === 'access' ? 'border-t-2 border-t-emerald-600 dark:border-t-emerald-400' : ''}`}
            >
              <p className="text-xs font-medium text-muted-foreground">{item.eyebrow}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="categories-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Browse by task</p>
            <h2 id="categories-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">AI categories</h2>
          </div>
          <Link to="/ai-tools" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">All tools <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 sm:grid-cols-3 lg:grid-cols-5">
          {aiCategories.map((category) => (
            <Link key={category.id} to={`/ai-tools?category=${encodeURIComponent(category.id)}`} className="group flex min-h-12 items-center justify-between gap-2 border-b border-border/70 px-2 text-sm text-secondary-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
              <span>{category.name}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="discoveries-heading">
        <div className="mb-5">
          <p className="text-sm text-muted-foreground">Recently reviewed</p>
          <h2 id="discoveries-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Daily discoveries</h2>
        </div>
        <DailyDiscoveriesSection maxItems={3} />
      </section>

      <section className="mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="offers-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Eligibility and terms apply</p>
            <h2 id="offers-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Selected offers</h2>
          </div>
          <Link to="/offers" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">Browse offers <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {offers.map((offer) => (
            <Link key={offer.slug} to={`/offers/${offer.slug}`} className="group flex min-h-28 items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <div>
                <p className="text-xs text-muted-foreground">{offer.provider} · {offer.region}</p>
                <h3 className="mt-1 font-medium text-foreground">{offer.title}</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{offer.benefitSummary}</p>
              </div>
              <Gift className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="resources-heading">
        <p className="text-sm text-muted-foreground">More ways to explore</p>
        <h2 id="resources-heading" className="mb-5 mt-1 text-2xl font-semibold tracking-tight text-foreground">Resources and directories</h2>
        <div className="grid gap-x-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map(([label, href, Icon]) => (
            <Link key={href} to={href} className="group flex min-h-12 items-center gap-3 border-b border-border/70 px-2 text-sm font-medium text-secondary-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
              <span>{label}</span>
              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
