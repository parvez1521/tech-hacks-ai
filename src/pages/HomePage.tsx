import React from 'react';
import { ArrowRight, BookOpen, Bot, Box, Braces, Camera, Clapperboard, Code2, Compass, Disc, FileText, Film, Gift, Headphones, Image as ImageIcon, Layers3, MessageSquare, Mic, Music, Palette, PenLine, PenTool, Play, Radio, Scissors, Search, Server, Shapes, Sparkles, Terminal, Type, Video, Volume2, Workflow, Wrench, Zap } from 'lucide-react';
import { Link } from '../router/Router';
import { UniversalSearch } from '../components/UniversalSearch';
import { HeroSignalVisual } from '../components/HeroSignalVisual';
import { DailyDiscoveriesSection } from '../components/DailyDiscoveriesSection';
import { BrandLogo } from '../components/BrandLogo';
import { SwitchFlow } from '../components/SwitchFlow';
import { getBrandLogo } from '../data/runtimeBrandLogos.ts';
import { aiCategories } from '../data/aiToolsData';
import { aiModels, getCurrentModelAccessRoutes, modelAccessProviders } from '../data/modelAccessCatalog';
import { getActiveOffers, getFeaturedOffers } from '../data/offersData';
import { getAllAiTools, getAiToolsForProprietary, getAiToolsForSearchIntent } from '../services/aiCatalogService';
import { proprietaryTools } from '../data/alternatives.ts';
import { getToolsForProprietary } from '../services/catalogService';
import { publicGitHubProjects } from '../data/githubProjectsData';

const featuredCollections = [
  { title: 'Frontier Models', href: '/frontier-models', description: 'Compare capabilities, official pricing and places to try leading models.', image: '/images/collections/frontier-models.webp', imageAlt: 'Neon model showcase featuring GPT-6 Astra and Claude model cards', samples: [{ slug: 'chatgpt', name: 'GPT-6 Astra' }, { slug: 'claude', name: 'Claude Opus 5.5' }] },
  { title: 'Free AI Video Models', href: '/ai-video-tools', description: 'Explore video generators with free plans, daily credits or limited trials.', image: '/images/collections/free-ai-video-models.webp', imageAlt: 'Neon video generation showcase featuring Seedance and AI video tools', samples: [{ slug: 'dreamina', name: 'Seedance 2.5 · Dreamina' }, { slug: 'runway', name: 'Runway' }, { slug: 'pika', name: 'Pika' }] },
  { title: 'All AI Tools', href: '/ai-tools', description: 'Explore tools for writing, coding, image, video, audio and research.', image: '/images/collections/all-ai-tools.webp', imageAlt: 'Neon showcase of popular AI tools and platforms', samples: [{ slug: 'chatgpt', name: 'ChatGPT' }, { slug: 'claude', name: 'Claude' }, { slug: 'gemini', name: 'Gemini' }] },
  { title: 'GitHub Projects', href: '/github-projects', description: 'Explore useful community and open-source projects with clear review labels.', image: '/images/collections/github-projects.webp', imageAlt: 'Neon GitHub projects directory shown on a laptop and app tile', samples: publicGitHubProjects.slice(0, 3).map((project) => ({ slug: 'github', name: project.name })) },
];

const frontierAccessBanners: Record<string, { src: string; alt: string }> = {
  'astra-rusherai': {
    src: '/images/frontier-access/01-gpt-6-astra-weekly-shared-pool.webp',
    alt: 'OpenAI GPT-6 Astra with a free weekly shared pool of 50 million tokens across 9 listed models.',
  },
  'opus-rusherai': {
    src: '/images/frontier-access/02-claude-opus-5-5-weekly-shared-pool.webp',
    alt: 'Anthropic Claude Opus 5.5 with a free weekly shared pool of 50 million tokens across 9 listed models.',
  },
  'astra-omnirush-daily': {
    src: '/images/frontier-access/03-gpt-6-astra-daily-allowance.webp',
    alt: 'OpenAI GPT-6 Astra with a daily free frontier-model allowance; a fixed token amount is not published.',
  },
  'seedance-dreamina-daily': {
    src: '/images/frontier-access/04-seedance-2-5-daily-credits.webp',
    alt: 'ByteDance Seedance 2.5 with free daily credits; credit cost varies by generation settings.',
  },
};

const frontierAccessRouteOrder = Object.keys(frontierAccessBanners);

const categoryArt: Record<string, { icons: typeof Bot[]; label: string }> = {
  assistants: { icons: [MessageSquare, Sparkles, Bot], label: 'AI assistants and reasoning tools.' },
  writing: { icons: [PenLine, FileText, Type], label: 'Writing and content tools.' },
  image: { icons: [ImageIcon, Palette, Camera], label: 'Image generation tools.' },
  video: { icons: [Clapperboard, Play, Scissors], label: 'Video generation and editing tools.' },
  voice: { icons: [Mic, Radio, Volume2], label: 'Audio and voice tools.' },
  music: { icons: [Music, Headphones, Disc], label: 'Music tools.' },
  coding: { icons: [Code2, Terminal, Braces], label: 'Coding and development tools.' },
  productivity: { icons: [Search, BookOpen, Compass], label: 'Productivity and research tools.' },
  automation: { icons: [Workflow, Zap, Bot], label: 'Automation and agent tools.' },
  '3d': { icons: [Box, Shapes, PenTool], label: 'Design and 3D tools.' },
};

const resources = [
  { label: 'Open Source Catalog', href: '/tools', Icon: Layers3, blurb: 'Reviewed open-source AI projects — what they do, what they cost to run, and where they fit.', meta: 'Project directory' },
  { label: 'Utility Tools', href: '/free-tools', Icon: Wrench, blurb: 'Small utilities for files, text, images and media that run right in your browser.', meta: 'Browser utilities' },
  { label: 'Alternatives & Compare', href: '/alternatives', Icon: Code2, blurb: 'Paid tools matched with free and open-source replacements, compared side by side.', meta: 'Head-to-head' },
  { label: 'Guides & Prompt Library', href: '/guides', Icon: BookOpen, blurb: 'Step-by-step guides and a copy-ready prompt library for everyday AI work.', meta: 'Guides & prompts' },
] as const;

export const HomePage: React.FC = () => {
  const activeOffers = getActiveOffers();
  const offers = getFeaturedOffers().filter((offer) => activeOffers.some((active) => active.slug === offer.slug)).slice(0, 2);
  const freeModelRoutes = getCurrentModelAccessRoutes()
    .filter((route) => ['free-weekly-shared', 'free-daily-allowance', 'free-daily-credits'].includes(route.accessType) && frontierAccessBanners[route.id])
    .sort((a, b) => frontierAccessRouteOrder.indexOf(a.id) - frontierAccessRouteOrder.indexOf(b.id));
  const allCatalogTools = getAllAiTools();
  const alternativeEntries = proprietaryTools.map((target) => {
    const replacements = getToolsForProprietary(target.slug);
    const aiPicks = getAiToolsForProprietary(target.slug);
    return { target, count: replacements.length + aiPicks.length, samples: [...replacements, ...aiPicks].slice(0, 3) };
  }).filter((entry) => entry.count > 0);
  // One showcase card per category (the most-matched target in it), so the
  // grid stays diverse instead of filling with near-identical video tools
  // that all recommend each other; backfill by count if categories run out.
  const bestByCategory = new Map<string, (typeof alternativeEntries)[number]>();
  for (const entry of alternativeEntries) {
    const current = bestByCategory.get(entry.target.category);
    if (!current || entry.count > current.count) bestByCategory.set(entry.target.category, entry);
  }
  const popularAlternatives = [...bestByCategory.values()].sort((a, b) => b.count - a.count);
  if (popularAlternatives.length < 6) {
    const chosen = new Set(popularAlternatives.map((entry) => entry.target.slug));
    for (const entry of [...alternativeEntries].sort((a, b) => b.count - a.count)) {
      if (popularAlternatives.length >= 6) break;
      if (!chosen.has(entry.target.slug)) {
        popularAlternatives.push(entry);
        chosen.add(entry.target.slug);
      }
    }
  }
  const popularAlternativeCards = popularAlternatives.slice(0, 6);
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCollections.map((item) => (
            <Link
              to={item.href}
              key={item.href}
              className="home-collection-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-[#071126]">
                <img src={item.image} alt={item.imageAlt} width={1536} height={1024} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#071126]/35 to-transparent" aria-hidden="true" />
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.samples.map((sample) => <span key={sample.name} className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-border/80 bg-muted/35 py-1 pl-1 pr-2.5 text-xs font-medium text-secondary-foreground"><BrandLogo slug={sample.slug} name={sample.name} size="xs" showContainer={false} /><span className="truncate">{sample.name}</span></span>)}
                </div>
              </div>
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
            const banner = frontierAccessBanners[route.id];
            const providerTool = allCatalogTools.find((tool) => tool.slug === (provider.existingToolSlug || provider.id));
            const providerLogo = providerTool ? getBrandLogo(providerTool.slug) : undefined;
            const hasVerifiedProviderLogo = Boolean(providerLogo?.assetPath && (providerLogo.sourceType === 'provided' || (providerLogo.sourceUrl && providerLogo.sourceType !== 'fallback')));
            return <article key={route.id} aria-labelledby={`frontier-access-${route.id}`} className="frontier-access-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors motion-reduce:transition-none">
              <h3 id={`frontier-access-${route.id}`} className="sr-only">{model.organization} {model.name} · {accessLabel}</h3>
              <img src={banner.src} alt={banner.alt} width={808} height={444} loading="lazy" decoding="async" className="frontier-access-card__image aspect-[1.82/1] w-full bg-[#071126] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none" />
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  {hasVerifiedProviderLogo && <BrandLogo slug={providerTool!.slug} name={provider.name} size="xs" />}
                  <span>Access via {provider.name}</span>
                </div>
                <p className="mt-3 text-sm font-medium leading-5 text-foreground">{route.allowance}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{route.quickNote || route.conditions}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="text-[11px] text-muted-foreground">Checked {route.lastVerifiedAt}</span>
                  <a href={route.claimUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">Try route ↗</a>
                </div>
              </div>
            </article>;
          })}
        </div>
       </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="alternatives-heading">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Alternatives</p>
            <h2 id="alternatives-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Free alternatives to paid tools</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">The paid tools people switch away from most, each matched with free and open-source alternatives from the live catalogue of {proprietaryTools.length} paid tools.</p>
          </div>
          <Link to="/alternatives" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline">Browse all alternatives <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <SwitchFlow />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {popularAlternativeCards.map(({ target, count, samples }) => (
            <Link
              to={`/alternatives/${target.slug}`}
              key={target.slug}
              className="card-glow group flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="flex items-start gap-3">
                <BrandLogo slug={target.slug} name={target.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold tracking-tight text-foreground">{target.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-muted-foreground">{target.tagline}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border/80 bg-muted/35 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{count} alternatives</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {samples.map((sample) => <span key={sample.slug} className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-border/80 bg-muted/35 py-1 pl-1 pr-2.5 text-xs font-medium text-secondary-foreground"><BrandLogo slug={sample.slug} name={sample.name} size="xs" showContainer={false} /><span className="truncate">{sample.name}</span></span>)}
                {count > samples.length && <span className="text-xs font-medium text-muted-foreground">+{count - samples.length} more</span>}
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
              </div>
            </Link>
          ))}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiCategories.map((category) => {
            const art = categoryArt[category.id];
            return <Link key={category.id} to={`/ai-tools?category=${encodeURIComponent(category.id)}`} className="home-category-card group flex min-h-40 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <div className="category-art" role="img" aria-label={art.label}>
                <div className="category-art__tiles">
                  {art.icons.map((Icon, i) => (
                    <span key={i} className="category-art__tile">
                      <Icon className="h-7 w-7 text-[#8a2e0e]" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none" aria-hidden="true" />
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{category.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {category.subcategories.map((subcategory) => <span key={subcategory} className="rounded-md border border-border/80 bg-muted/50 px-2 py-1 text-[10px] font-medium text-secondary-foreground">{subcategory}</span>)}
                </div>
              </div>
            </Link>;
          })}
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
            <Link key={title} to={href} className="card-glow group glass flex min-h-52 flex-col rounded-2xl border border-border p-4 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-muted/30 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5">
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
            <Link key={offer.slug} to={`/offers/${offer.slug}`} className="card-glow group glass flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-border p-4 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-muted/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map(({ label, href, Icon, blurb, meta }) => (
            <Link key={href} to={href} className="card-glow glass group relative flex flex-col rounded-2xl border border-border p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[image:var(--brand-route-gradient)] text-[rgb(var(--brand-midnight))] shadow-[0_10px_20px_-8px_rgb(var(--color-primary)/0.55)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{label}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{blurb}</p>
              <p className="meta-label mt-auto pt-4">{meta}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
