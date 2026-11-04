import React from 'react';
import { ArrowRight, BookOpen, Code2, Film, Gift, Image as ImageIcon, Layers3, Mic, Search, Server, Video, Wrench } from 'lucide-react';
import { Link } from '../router/Router';
import { UniversalSearch } from '../components/UniversalSearch';
import { HeroSignalVisual } from '../components/HeroSignalVisual';
import { DailyDiscoveriesSection } from '../components/DailyDiscoveriesSection';
import { BrandLogo } from '../components/BrandLogo';
import { aiCategories } from '../data/aiToolsData';
import { aiModels, getCurrentModelAccessRoutes, modelAccessProviders } from '../data/modelAccessCatalog';
import { getActiveOffers, getFeaturedOffers } from '../data/offersData';
import { getAllAiTools, getAiToolsForSearchIntent } from '../services/aiCatalogService';

const featuredCollections = [
  { title: 'Frontier Models', href: '/frontier-models', description: 'Compare capabilities, official pricing and places to try leading models.', eyebrow: 'Model index', tone: 'model', highlights: ['GPT-6 Astra', 'Claude Opus 5.5', 'Seedance 2.5'] },
  { title: 'Free Access', href: '/free-ai-sites', description: 'Find daily credits, weekly shared allowances, free plans and local software.', eyebrow: 'Checked routes', tone: 'access', highlights: ['Daily allowances', 'Weekly token pools', 'Free local tools'] },
  { title: 'All AI Tools', href: '/ai-tools', description: 'Explore tools for writing, coding, image, video, audio and research.', eyebrow: 'Platform directory', tone: 'catalog', highlights: ['By task', 'By category', 'By pricing'] },
  { title: 'GitHub Projects', href: '/github-projects', description: 'Explore useful community and open-source projects with clear review labels.', eyebrow: 'Open source', tone: 'catalog', highlights: ['Self-hosted apps', 'Developer tools', 'AI projects'] },
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
  const freeModelRoutes = getCurrentModelAccessRoutes().filter((route) => ['free-weekly-shared', 'free-daily-allowance', 'free-daily-credits'].includes(route.accessType));
  const allCatalogTools = getAllAiTools();
  const videoGenerators = getAiToolsForSearchIntent('AI video generator');
  const freeVideoGeneratorCount = videoGenerators.filter((tool) =>
    tool.hasFreePlan ||
    ['free', 'freemium', 'free-credits', 'free-trial'].includes(tool.pricingType) ||
    ['recurring-free', 'limited-free', 'free-credits', 'open-source-local'].includes(tool.freeAccessType)
  ).length;
  const categoryCount = (category: string) => allCatalogTools.filter((tool) => tool.category === category).length;
  const openSourceAiCount = allCatalogTools.filter((tool) => tool.isSelfHostable || tool.freeAccessType === 'open-source-local').length;
  const taskCategories = [
    {
      title: 'Free & Trial AI Video Generators',
      description: 'Text-to-video, image-to-video and creator workflows with a free plan, credits or a trial listed.',
      href: '/ai-video-tools?filter=free-entry',
      count: freeVideoGeneratorCount,
      countLabel: 'free or trial entries',
      accessLabel: 'Credits and limits vary',
      Icon: Film,
      logos: [{ slug: 'runway', name: 'Runway' }, { slug: 'dreamina', name: 'Dreamina' }, { slug: 'pika', name: 'Pika' }, { slug: 'hailuo-ai', name: 'Hailuo' }],
    },
    {
      title: 'AI Image Generators',
      description: 'Create visuals, edit images, build product shots and explore open image models.',
      href: '/ai-tools?category=image',
      count: categoryCount('image'),
      countLabel: 'tools listed',
      accessLabel: 'Hosted and local options',
      Icon: ImageIcon,
      logos: [{ slug: 'ideogram', name: 'Ideogram' }, { slug: 'leonardo-ai', name: 'Leonardo AI' }, { slug: 'comfyui', name: 'ComfyUI' }],
    },
    {
      title: 'AI Voice & Speech',
      description: 'Text-to-speech, voice cloning, transcription and local speech models.',
      href: '/ai-tools?category=voice',
      count: categoryCount('voice'),
      countLabel: 'tools listed',
      accessLabel: 'Free and paid plans',
      Icon: Mic,
      logos: [{ slug: 'elevenlabs', name: 'ElevenLabs' }, { slug: 'whisper', name: 'Whisper' }, { slug: 'kokoro-tts', name: 'Kokoro TTS' }],
    },
    {
      title: 'AI Coding Agents',
      description: 'Code editors, terminal agents, app builders and coding assistants.',
      href: '/ai-tools?category=coding',
      count: categoryCount('coding'),
      countLabel: 'tools listed',
      accessLabel: 'Free tiers and open source',
      Icon: Code2,
      logos: [{ slug: 'cursor', name: 'Cursor' }, { slug: 'aider', name: 'Aider' }, { slug: 'google-ai-studio', name: 'Google AI Studio' }],
    },
    {
      title: 'AI Research & Search',
      description: 'Search the web, research sources, summarize documents and organize knowledge.',
      href: '/ai-tools?category=productivity',
      count: categoryCount('productivity'),
      countLabel: 'tools listed',
      accessLabel: 'Research and knowledge tools',
      Icon: Search,
      logos: [{ slug: 'perplexity', name: 'Perplexity' }, { slug: 'notebooklm', name: 'NotebookLM' }, { slug: 'anythingllm', name: 'AnythingLLM' }],
    },
    {
      title: 'Free & Open-source AI',
      description: 'Self-hostable apps, open models and local workflows without a hosted subscription.',
      href: '/ai-tools?access=open-source-local',
      count: openSourceAiCount,
      countLabel: 'open-source / local options',
      accessLabel: 'Check model and code licenses',
      Icon: Server,
      logos: [{ slug: 'comfyui', name: 'ComfyUI' }, { slug: 'vllm', name: 'vLLM' }, { slug: 'aider', name: 'Aider' }],
    },
  ];

  return (
    <main className="pb-12 sm:pb-16">
      <section className="hero-aurora mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-12" aria-labelledby="home-hero-heading">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-stagger max-w-2xl">
          <p className="eyebrow mb-5">A practical map to AI</p>
          <h1 id="home-hero-heading" className="text-balance text-[2.6rem] font-bold leading-[1.03] tracking-[-0.04em] text-foreground sm:text-6xl sm:leading-[1.02] lg:text-[4rem]">
            <span className="block">Another AI tool?</span>
            <span className="block">Sure.</span>
            <span className="text-brand-gradient block">Another Subscription?</span>
            <span className="text-brand-gradient block">Nope.</span>
          </h1>
          <p className="mt-6 max-w-[36rem] text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
            Compare AI tools by task, check current access routes, and find reviewed open-source projects.
          </p>
          <div className="search-panel mt-8 max-w-xl">
            <UniversalSearch />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link to="/pick" className="btn-primary inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Help me pick <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/ai-video-tools" className="inline-flex min-h-11 items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Video className="h-4 w-4" aria-hidden="true" /> AI video generators
            </Link>
          </div>
        </div>
        <div className="hidden min-w-0 lg:block">
          <HeroSignalVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="collections-heading">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Start exploring</p>
            <h2 id="collections-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Choose a collection</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCollections.map((item, index) => (
            <Link
              to={item.href}
              key={item.href}
              className={`group glass flex min-h-40 flex-col rounded-[1.25rem] border border-border p-5 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-muted/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6 ${index === 0 ? 'sm:col-span-2 lg:row-span-2' : index === 3 ? 'sm:col-span-2 lg:col-span-3' : ''} ${item.tone === 'model' ? 'border-t-2 border-t-primary' : item.tone === 'access' ? 'border-t-2 border-t-emerald-600 dark:border-t-emerald-400' : ''}`}
            >
              <p className="meta-label">{item.eyebrow}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className={index === 0 ? 'text-2xl font-semibold tracking-tight text-foreground' : 'text-lg font-semibold tracking-tight text-foreground'}>{item.title}</h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <p className={index === 0 ? 'mt-2 max-w-md text-base leading-7 text-muted-foreground' : 'mt-2 text-sm leading-6 text-muted-foreground'}>{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{item.highlights.map((highlight) => <span key={highlight} className="glass-chip px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">{highlight}</span>)}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-band" aria-labelledby="frontier-access-heading">
       <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Frontier access highlights · checked 3 Nov 2026</p>
            <h2 id="frontier-access-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Try frontier models without starting with a subscription</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">These are provider-specific routes, not unlimited model access. Check the quota, account rules and region before you begin.</p>
          </div>
          <Link to="/frontier-models" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">Compare all models <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {freeModelRoutes.map((route) => {
            const model = aiModels.find((item) => item.id === route.modelId);
            const provider = modelAccessProviders.find((item) => item.id === route.providerId);
            if (!model || !provider) return null;
            const accessLabel = route.accessType === 'free-weekly-shared' ? 'Free weekly · shared pool' : route.accessType === 'free-daily-allowance' ? 'Free daily allowance' : 'Free daily credits';
            return <article key={route.id} className="glass flex min-h-40 flex-col rounded-[1.25rem] border border-border p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div><p className="meta-label">{model.organization}</p><h3 className="mt-1 text-base font-semibold text-foreground">{model.name}</h3></div>
                <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{accessLabel}</span>
              </div>
              <p className="mt-3 text-sm font-medium leading-5 text-foreground">{route.allowance}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{provider.name} · {route.quickNote || route.conditions}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                <span className="meta-label">Checked {route.lastVerifiedAt}</span>
                <a href={route.claimUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">Try route ↗</a>
              </div>
            </article>;
          })}
        </div>
       </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="categories-heading">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Browse by task</p>
            <h2 id="categories-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">AI categories</h2>
          </div>
          <Link to="/ai-tools" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">All tools <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="glass overflow-hidden rounded-[1.25rem] border border-border">
          {aiCategories.map((category, index) => (
            <Link key={category.id} to={`/ai-tools?category=${encodeURIComponent(category.id)}`} className={`group flex min-h-12 items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:px-5 ${index > 0 ? 'border-t border-border/70' : ''}`}>
              <h3 className="shrink-0 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{category.name}</h3>
              <p className="hidden min-w-0 flex-1 truncate text-xs text-muted-foreground md:block">{category.description}</p>
              <span className="meta-label hidden max-w-64 truncate lg:block">{category.subcategories.map((subcategory) => subcategory).join(' · ')}</span>
              <span className="meta-label ml-auto shrink-0 tabular-nums md:ml-0">{categoryCount(category.id)} tools</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-border/70 px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="task-categories-heading">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Popular starting points</p>
            <h2 id="task-categories-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Explore AI by what you want to do</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Jump straight into focused collections, from free-entry video generators to image, voice, coding and research tools.</p>
          </div>
          <Link to="/ai-tools" className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">Browse full directory <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {taskCategories.map(({ title, description, href, count, countLabel, accessLabel, Icon, logos }) => (
            <Link key={title} to={href} className="group glass flex min-h-52 flex-col rounded-[1.25rem] border border-border p-4 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-muted/30 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground">{accessLabel}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                <div className="flex items-center -space-x-1.5" aria-label={"Example tools: " + logos.map((logo) => logo.name).join(", ")}>
                  {logos.map((logo) => <BrandLogo key={logo.slug} slug={logo.slug} name={logo.name} size="sm" className="ring-2 ring-card" />)}
                </div>
                <span className="text-right text-[11px] font-medium tabular-nums text-muted-foreground"><strong className="text-foreground">{count}</strong> {countLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-band" aria-labelledby="discoveries-heading">
       <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10">
          <p className="eyebrow">Recently reviewed</p>
          <h2 id="discoveries-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Daily discoveries</h2>
        </div>
        <DailyDiscoveriesSection maxItems={3} />
       </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="offers-heading">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Eligibility and terms apply</p>
            <h2 id="offers-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Selected offers</h2>
          </div>
          <Link to="/offers" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">Browse offers <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <Link key={offer.slug} to={`/offers/${offer.slug}`} className="group glass flex min-h-28 items-center justify-between gap-4 rounded-[1.25rem] border border-border p-4 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-muted/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5">
              <div>
                <p className="meta-label">{offer.provider} · {offer.region}</p>
                <h3 className="mt-1 font-medium text-foreground">{offer.title}</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{offer.benefitSummary}</p>
              </div>
              <Gift className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-border/70 px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="resources-heading">
        <p className="eyebrow">More ways to explore</p>
        <h2 id="resources-heading" className="mb-10 mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Resources and directories</h2>
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
