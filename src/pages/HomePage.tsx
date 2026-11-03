import React from 'react';
import { ArrowRight, AudioLines, BookOpen, Bot, Code2, Film, Gift, Image as ImageIcon, Layers3, Mic, Music2, Palette, PenTool, Search, Server, Video, Wrench } from 'lucide-react';
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
  { title: 'Frontier Models', href: '/frontier-models', description: 'Compare capabilities, official pricing and places to try leading models.', eyebrow: 'Model index', tone: 'model', art: '/images/generated-ui/automation.webp', Icon: Layers3, highlights: ['GPT-6 Astra', 'Claude Opus 5.5', 'Seedance 2.5'] },
  { title: 'Free Access', href: '/free-ai-sites', description: 'Find daily credits, weekly shared allowances, free plans and local software.', eyebrow: 'Checked routes', tone: 'access', art: null, Icon: Gift, highlights: ['Daily allowances', 'Weekly token pools', 'Free local tools'] },
  { title: 'All AI Tools', href: '/ai-tools', description: 'Explore tools for writing, coding, image, video, audio and research.', eyebrow: 'Platform directory', tone: 'catalog', art: '/images/generated-ui/image.webp', Icon: ImageIcon, highlights: ['By task', 'By category', 'By pricing'] },
  { title: 'GitHub Projects', href: '/github-projects', description: 'Explore useful community and open-source projects with clear review labels.', eyebrow: 'Open source', tone: 'catalog', art: '/images/generated-ui/coding.webp', Icon: Code2, highlights: ['Self-hosted apps', 'Developer tools', 'AI projects'] },
];

const resources = [
  ['Open Source Catalog', '/tools', Layers3],
  ['Utility Tools', '/free-tools', Wrench],
  ['Alternatives & Compare', '/alternatives', Code2],
  ['Guides & Prompt Library', '/guides', BookOpen],
] as const;

const categoryVisuals = {
  assistants: { art: '/images/generated-ui/automation.webp', Icon: Bot },
  writing: { art: '/images/generated-ui/writing.webp', Icon: PenTool },
  image: { art: '/images/generated-ui/image.webp', Icon: ImageIcon },
  video: { art: '/images/generated-ui/video.webp', Icon: Film },
  voice: { art: '/images/generated-ui/voice.webp', Icon: AudioLines },
  music: { art: '/images/generated-ui/music.webp', Icon: Music2 },
  coding: { art: '/images/generated-ui/coding.webp', Icon: Code2 },
  productivity: { art: '/images/generated-ui/research.webp', Icon: Search },
  automation: { art: '/images/generated-ui/automation.webp', Icon: Bot },
  '3d': { art: '/images/generated-ui/image.webp', Icon: Palette },
} as const;

const modelBrandSlugs: Record<string, string> = {
  'gpt-6-astra': 'openai',
  'claude-opus-5-5': 'anthropic',
  'seedance-2-5': 'dreamina',
};

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
      art: '/images/generated-ui/video.webp',
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
      art: '/images/generated-ui/image.webp',
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
      art: '/images/generated-ui/voice.webp',
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
      art: '/images/generated-ui/coding.webp',
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
      art: '/images/generated-ui/research.webp',
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
      art: '/images/generated-ui/automation.webp',
      logos: [{ slug: 'comfyui', name: 'ComfyUI' }, { slug: 'vllm', name: 'vLLM' }, { slug: 'aider', name: 'Aider' }],
    },
  ];

  return (
    <main className="pb-12 sm:pb-16">
      <section className="home-hero mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-10" aria-labelledby="home-hero-heading">
        <div className="max-w-2xl">
          <p className="home-hero__context mb-3 text-sm font-medium text-primary">A practical map to AI</p>
          <h1 id="home-hero-heading" className="max-w-[24ch] text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.5rem]">
            <span className="block">Another AI tool? Sure.</span>
            <span className="block">Another Subscription? Nope.</span>
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
        <div className="home-hero__preview min-w-0">
          <HeroSignalVisual />
        </div>
      </section>

      <section className="home-section mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="collections-heading">
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
              className={`home-collection-card group flex min-h-56 flex-col overflow-hidden rounded-xl border border-border bg-card p-0 transition-colors hover:border-primary/45 hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-0 ${item.tone === 'model' ? 'border-t-2 border-t-primary' : item.tone === 'access' ? 'border-t-2 border-t-emerald-600 dark:border-t-emerald-400' : ''}`}
            >
              <div className="home-collection-card__visual" aria-hidden="true">
                {item.art ? <img src={item.art} alt="" loading="lazy" decoding="async" /> : <div className="home-collection-card__visual-icon"><item.Icon className="h-10 w-10" /></div>}
                <span className="home-collection-card__eyebrow">{item.eyebrow}</span>
              </div>
              <div className="home-collection-card__body">
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{item.highlights.map((highlight) => <span key={highlight} className="rounded-md border border-border/80 bg-muted/50 px-2 py-1 text-[11px] font-medium text-secondary-foreground">{highlight}</span>)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="frontier-access-heading">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Frontier access highlights · checked 3 Nov 2026</p>
            <h2 id="frontier-access-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Try frontier models without starting with a subscription</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">These are provider-specific routes, not unlimited model access. Check the quota, account rules and region before you begin.</p>
          </div>
          <Link to="/frontier-models" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">Compare all models <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {freeModelRoutes.map((route) => {
            const model = aiModels.find((item) => item.id === route.modelId);
            const provider = modelAccessProviders.find((item) => item.id === route.providerId);
            if (!model || !provider) return null;
            const accessLabel = route.accessType === 'free-weekly-shared' ? 'Free weekly · shared pool' : route.accessType === 'free-daily-allowance' ? 'Free daily allowance' : 'Free daily credits';
            return <article key={route.id} className="flex min-h-40 flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3"><BrandLogo slug={modelBrandSlugs[model.id] || 'openai'} name={model.organization} size="lg" /><div className="min-w-0"><p className="text-xs text-muted-foreground">{model.organization}</p><h3 className="mt-1 text-base font-semibold text-foreground">{model.name}</h3></div></div>
                <span className="shrink-0 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{accessLabel}</span>
              </div>
              <p className="mt-3 text-sm font-medium leading-5 text-foreground">{route.allowance}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{provider.name} · {route.quickNote || route.conditions}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                <span className="text-[11px] text-muted-foreground">Checked {route.lastVerifiedAt}</span>
                <a href={route.claimUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">Try route ↗</a>
              </div>
            </article>;
          })}
        </div>
      </section>

      <section className="home-section mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="categories-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Browse by task</p>
            <h2 id="categories-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">AI categories</h2>
          </div>
          <Link to="/ai-tools" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">All tools <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiCategories.map((category) => (
            <Link key={category.id} to={`/ai-tools?category=${encodeURIComponent(category.id)}`} className="home-category-card group flex min-h-56 flex-col overflow-hidden rounded-xl border border-border bg-card p-0 transition-colors hover:border-primary/45 hover:bg-muted/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <div className="home-category-card__art">
                <img src={categoryVisuals[category.id as keyof typeof categoryVisuals]?.art || '/images/generated-ui/image.webp'} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                {(() => { const CategoryIcon = categoryVisuals[category.id as keyof typeof categoryVisuals]?.Icon || ImageIcon; return <span className="home-category-card__icon"><CategoryIcon className="h-5 w-5" aria-hidden="true" /></span>; })()}
              </div>
              <div className="home-category-card__body">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{category.description}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                {category.subcategories.map((subcategory) => <span key={subcategory} className="rounded-md border border-border/80 bg-muted/50 px-2 py-1 text-[10px] font-medium text-secondary-foreground">{subcategory}</span>)}
              </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="task-categories-heading">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Popular starting points</p>
            <h2 id="task-categories-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Explore AI by what you want to do</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Jump straight into focused collections, from free-entry video generators to image, voice, coding and research tools.</p>
          </div>
          <Link to="/ai-tools" className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">Browse full directory <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {taskCategories.map(({ title, description, href, count, countLabel, accessLabel, Icon, logos, art }) => (
            <Link key={title} to={href} className="home-task-card group flex min-h-72 flex-col rounded-xl border border-border bg-card transition-colors hover:border-primary/45 hover:bg-muted/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <div className="home-task-card__art"><img src={art} alt="" aria-hidden="true" loading="lazy" decoding="async" /></div>
              <div className="home-task-card__body">
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
                <span className="text-right text-[11px] font-medium text-muted-foreground"><strong className="text-foreground">{count}</strong> {countLabel}</span>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="discoveries-heading">
        <div className="mb-5">
          <p className="text-sm text-muted-foreground">Recently reviewed</p>
          <h2 id="discoveries-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Daily discoveries</h2>
        </div>
        <DailyDiscoveriesSection maxItems={3} />
      </section>

      <section className="home-section mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="offers-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Eligibility and terms apply</p>
            <h2 id="offers-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Selected offers</h2>
          </div>
          <Link to="/offers" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">Browse offers <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {offers.map((offer) => (
            <Link key={offer.slug} to={`/offers/${offer.slug}`} className="home-offer-card group flex min-h-36 items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <BrandLogo slug={offer.logoSlug} name={offer.provider} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{offer.provider} · {offer.region}</p>
                <h3 className="mt-1 font-medium text-foreground">{offer.title}</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{offer.benefitSummary}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section mx-auto max-w-7xl border-t border-border/70 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="resources-heading">
        <p className="text-sm text-muted-foreground">More ways to explore</p>
        <h2 id="resources-heading" className="mb-5 mt-1 text-2xl font-semibold tracking-tight text-foreground">Resources and directories</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map(([label, href, Icon]) => (
            <Link key={href} to={href} className="home-resource-card group flex min-h-28 items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-semibold text-secondary-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span className="home-resource-card__icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">{label}</span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
