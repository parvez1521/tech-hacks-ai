import React from 'react';
import { ArrowRight, BookOpen, Code2, Gift, Layers3, Search, Video, Wrench } from 'lucide-react';
import { Link } from '../router/Router';
import { UniversalSearch } from '../components/UniversalSearch';
import { HeroSignalVisual } from '../components/HeroSignalVisual';
import { DailyDiscoveriesSection } from '../components/DailyDiscoveriesSection';
import { aiCategories } from '../data/aiToolsData';
import { getActiveOffers, getFeaturedOffers } from '../data/offersData';

const featuredCollections = [
  { title: 'Frontier Models', href: '/frontier-models', description: 'Model capabilities, official docs and access routes.', eyebrow: 'Model index' },
  { title: 'Free Access', href: '/free-ai-sites', description: 'Free tiers, trials and current promotional access.', eyebrow: 'Checked routes' },
  { title: 'All AI Tools', href: '/ai-tools', description: 'Search platforms, products and services by task.', eyebrow: 'Platform directory' },
  { title: 'GitHub Projects', href: '/github-projects', description: 'Reviewed open-source projects for AI and software workflows.', eyebrow: 'Open source' },
];

export const HomePage: React.FC = () => {
  const offers = getFeaturedOffers().filter((offer) => getActiveOffers().some((active) => active.slug === offer.slug)).slice(0, 2);
  return <main className="pb-16">
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 grid lg:grid-cols-[1fr_.9fr] gap-10 items-center" aria-labelledby="home-hero-heading">
      <div><p className="text-xs tracking-wide text-primary font-semibold mb-4">A practical map to AI</p><h1 id="home-hero-heading" className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground">Find the right AI route for the work.</h1><p className="text-base sm:text-lg text-muted-foreground leading-7 mt-5 max-w-xl">Compare tools, models, and ways to access them. Start with what you need to do.</p><div className="mt-7 max-w-2xl"><UniversalSearch /></div><div className="mt-5 flex gap-4 text-sm"><Link to="/pick" className="text-primary hover:underline">Help me pick <ArrowRight className="inline w-4 h-4" /></Link><Link to="/ai-video-tools" className="text-muted-foreground hover:text-foreground">Explore AI video generators</Link></div></div>
      <div className="hidden lg:block"><HeroSignalVisual /></div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8" aria-labelledby="collections-heading">
      <div className="flex justify-between items-end mb-5"><div><p className="text-xs tracking-wide text-muted-foreground">Start exploring</p><h2 id="collections-heading" className="text-2xl font-semibold mt-1">Choose a collection</h2></div></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">{featuredCollections.map((item) => <Link to={item.href} key={item.href} className="group p-5 sm:p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"><p className="text-[11px] tracking-[.14em] font-semibold text-muted-foreground">{item.eyebrow}</p><div className="flex justify-between items-center mt-3"><h3 className="text-xl font-semibold">{item.title}</h3><ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" /></div><p className="text-sm text-muted-foreground mt-2 leading-6">{item.description}</p></Link>)}</div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-labelledby="categories-heading">
      <div className="flex justify-between items-end mb-5"><div><p className="text-xs tracking-wide text-muted-foreground">Browse by task</p><h2 id="categories-heading" className="text-2xl font-semibold mt-1">AI categories</h2></div><Link to="/ai-tools" className="text-sm text-primary hover:underline">All tools <ArrowRight className="inline w-4 h-4" /></Link></div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">{aiCategories.map((category) => <Link key={category.id} to={`/ai-tools?category=${encodeURIComponent(category.id)}`} className="rounded-lg border border-border px-4 py-4 text-sm font-medium hover:bg-muted/60 hover:border-primary/40">{category.name}</Link>)}</div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-labelledby="discoveries-heading">
      <div className="mb-3"><p className="text-xs tracking-wide text-muted-foreground">Recently reviewed</p><h2 id="discoveries-heading" className="text-2xl font-semibold mt-1">Daily discoveries</h2></div>
      <DailyDiscoveriesSection maxItems={3} />
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-labelledby="offers-heading">
      <div className="flex justify-between items-end mb-5"><div><p className="text-xs tracking-wide text-muted-foreground">Eligibility and terms apply</p><h2 id="offers-heading" className="text-2xl font-semibold mt-1">Selected offers</h2></div><Link to="/offers" className="text-sm text-primary hover:underline">Browse offers <ArrowRight className="inline w-4 h-4" /></Link></div>
      <div className="grid md:grid-cols-2 gap-3">{offers.map((offer) => <Link key={offer.slug} to={`/offers/${offer.slug}`} className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card"><div><p className="text-xs text-muted-foreground">{offer.provider} · {offer.region}</p><h3 className="font-medium mt-1">{offer.title}</h3><p className="text-sm text-muted-foreground mt-1">{offer.benefitSummary}</p></div><Gift className="w-5 h-5 shrink-0 text-primary" /></Link>)}</div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-labelledby="resources-heading">
      <p className="text-xs tracking-wide text-muted-foreground">More ways to explore</p><h2 id="resources-heading" className="text-2xl font-semibold mt-1 mb-5">Resources and directories</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{[
        ['Open Source Catalog', '/tools', Layers3], ['Utility Tools', '/free-tools', Wrench], ['Alternatives & Compare', '/alternatives', Code2], ['Guides & Prompt Library', '/guides', BookOpen],
      ].map(([label, href, Icon]) => { const IconComponent = Icon as React.ElementType; return <Link to={href as string} key={href as string} className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50"><IconComponent className="w-5 h-5 text-primary" /><span className="text-sm font-medium">{label as string}</span><ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" /></Link>; })}</div>
    </section>
  </main>;
};
