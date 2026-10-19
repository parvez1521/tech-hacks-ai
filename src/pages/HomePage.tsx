import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

import { Link } from '../router/Router';
import { UniversalSearch } from '../components/UniversalSearch';
import { AlternativeCard } from '../components/AlternativeCard';
import { AiToolCard } from '../components/AiToolCard';
import { GuideCard } from '../components/GuideCard';
import { PromptCard } from '../components/PromptCard';
import { Pagination } from '../components/Pagination';
import { OfferCard } from '../components/OfferCard';
import { BrandLogo } from '../components/BrandLogo';
import { DailyDiscoveriesSection } from '../components/DailyDiscoveriesSection';
import { proprietaryTools } from '../data/alternatives';
import { aiCategories } from '../data/aiToolsData';
import { getFeaturedOffers } from '../data/offersData';
import { getAllAiTools, getAllGuides, getAllPrompts, getAllFreeTools } from '../services/aiCatalogService';
import {
  Sparkles,
  Replace,
  Bot,
  Compass,
  Wrench,
  BookOpen,
  MessageSquareCode,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Mail,
  Check,
  SlidersHorizontal,
  Tag,
  Gift,
  Code2,
  Image as ImageIcon,
  Video,
  FileText,
  Volume2,
  Layers,
  Scale,
  GraduationCap,
  Star,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedAiCategory, setSelectedAiCategory] = useState<string>('all');
  const [aiPage, setAiPage] = useState(1);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const allAiTools = getAllAiTools();

  // 1. Curated Editor's Picks (Section 3)
  const editorsPicks = [
    {
      tool: allAiTools.find((t) => t.slug === 'claude') || allAiTools[0],
      badge: "Editor's Choice",
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      highlight: 'Frontier reasoning, artifacts, and multi-turn prompt intelligence.',
    },
    {
      tool: allAiTools.find((t) => t.slug === 'runway') || allAiTools[1],
      badge: 'Best Video Model',
      badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      highlight: 'Cinematic Gen-3 Alpha video generation with camera controls.',
    },
    {
      tool: allAiTools.find((t) => t.slug === 'cursor') || allAiTools[2],
      badge: 'Best AI Code Editor',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      highlight: 'Deep codebase indexing, Composer agent, and instant code edits.',
    },
    {
      tool: allAiTools.find((t) => t.slug === 'ollama') || allAiTools[3],
      badge: 'Top Open Source & Local',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      highlight: 'Run Llama 3, DeepSeek-R1, and Qwen locally on your machine for free.',
    },
  ];

  // 2. Browse by Goal (Section 2)
  const goals = [
    {
      id: 'coding',
      title: 'Coding & Dev',
      desc: 'AI code editors, terminal agents & git copilots',
      examples: 'Cursor, Claude Code, Aider, Ollama',
      icon: Code2,
      href: '/ai-tools?category=coding',
      iconBg: 'text-blue-400 bg-blue-500/10',
    },
    {
      id: 'images',
      title: 'Images & Art',
      desc: 'Photorealistic generation, styles & image editing',
      examples: 'Midjourney, FLUX.1, Krea, Recraft',
      icon: ImageIcon,
      href: '/ai-tools?category=image',
      iconBg: 'text-purple-400 bg-purple-500/10',
    },
    {
      id: 'video',
      title: 'Video & Motion',
      desc: 'Text-to-video, image-to-video & camera control',
      examples: 'Kling, Runway, Luma, Wan 2.1',
      icon: Video,
      href: '/ai-tools?category=video',
      iconBg: 'text-pink-400 bg-pink-500/10',
    },
    {
      id: 'writing',
      title: 'Writing & Research',
      desc: 'Deep research, citations & multimodal reasoning',
      examples: 'Perplexity, Claude 3.5, Gemini 1.5, Khoj',
      icon: FileText,
      href: '/ai-tools?category=assistants',
      iconBg: 'text-amber-400 bg-amber-500/10',
    },
    {
      id: 'audio',
      title: 'Audio & Voice',
      desc: 'Voice cloning, studio speech & music creation',
      examples: 'ElevenLabs, Suno, Udio, Kokoro TTS',
      icon: Volume2,
      href: '/ai-tools?category=voice',
      iconBg: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'automation',
      title: 'Automation & Agents',
      desc: 'Visual workflow builders & multi-agent systems',
      examples: 'n8n, Dify, Langflow, Typebot',
      icon: Zap,
      href: '/ai-tools?category=automation',
      iconBg: 'text-cyan-400 bg-cyan-500/10',
    },
  ];

  // 3. AI tools filtered by category and paginated for Section 4
  const allFilteredAi = allAiTools.filter(
    (t) => (selectedAiCategory === 'all' ? true : t.category === selectedAiCategory)
  );
  const aiPageSize = 6;
  const aiTotalPages = Math.max(2, Math.ceil(allFilteredAi.length / aiPageSize));
  const filteredAiTools = allFilteredAi.slice((aiPage - 1) * aiPageSize, aiPage * aiPageSize);

  // 4. Free AI Tools (Section 5)
  const freeAiTools = allAiTools.filter((t) => t.hasFreePlan).slice(0, 4);

  // 5. Proprietary targets for Section 9 (Figma, Notion, Firebase, Airtable, Zapier, Google Analytics)
  const featuredProprietary = proprietaryTools.slice(0, 6);

  // 6. Featured Guides & Prompts (Section 8)
  const previewGuides = getAllGuides().slice(0, 2);
  const previewPrompts = getAllPrompts().slice(0, 2);

  // 7. Client-side utilities preview (Section 5)
  const previewUtilities = getAllFreeTools().slice(0, 3);

  // 8. Featured AI Deals & Student Benefits (Section 7)
  const previewOffers = getFeaturedOffers().slice(0, 3);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput('');
    }
  };

  // Scroll-reveal refs for below-fold sections (Section 1 / hero is above the fold)
  const reveal2 = useScrollReveal<HTMLElement>();
  const reveal3 = useScrollReveal<HTMLElement>();
  const revealDiscoveries = useScrollReveal<HTMLElement>();
  const reveal4 = useScrollReveal<HTMLElement>();
  const reveal5 = useScrollReveal<HTMLElement>();
  const reveal6 = useScrollReveal<HTMLElement>();
  const reveal7 = useScrollReveal<HTMLElement>();
  const reveal8 = useScrollReveal<HTMLElement>();
  const reveal9 = useScrollReveal<HTMLElement>();
  const reveal10 = useScrollReveal<HTMLElement>();

  return (

    <div className="flex flex-col gap-14 sm:gap-16 pb-20">
      {/* =========================================================================
          SECTION 1: HERO & UNIVERSAL SEARCH
      ========================================================================= */}
      <section className="relative pt-14 pb-8 sm:pt-16 sm:pb-10 text-center max-w-6xl mx-auto px-4 w-full">
        {/* A small context line keeps the hero useful without competing with search. */}
        <div className="animate-fade-in-up [animation-delay:0ms]">
          <div className="inline-flex items-center gap-2 eyebrow mb-5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Independent software directory</span>
          </div>
        </div>

        {/* H1 Headline */}
        <h1 className="animate-fade-in-up [animation-delay:60ms] text-4xl sm:text-5xl lg:text-[4.25rem] font-bold text-foreground tracking-[-0.035em] max-w-4xl mx-auto leading-[1.04] text-balance mb-5">
          Discover the Best AI Tools & Open Source Alternatives
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up [animation-delay:120ms] text-sm sm:text-base text-secondary-foreground max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Tech Hacks AI is a practical directory for finding AI products, open-source software, and browser utilities without wading through hype. Search by what you need to make, replace, or learn.
        </p>

        {/* Universal Search Bar with Intent Chips */}
        <div className="animate-fade-in-up [animation-delay:180ms] mb-8">
          <UniversalSearch />
        </div>

        {/* Quick Route Shortcuts Ribbon */}
        <div className="animate-fade-in-up [animation-delay:240ms] flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs pt-4 border-t border-border/50 max-w-2xl mx-auto">
          <Link
            to="/ai-tools"
            className="flex items-center gap-1.5 py-1 text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>AI Directory</span>
          </Link>
          <Link
            to="/free-ai-sites"
            className="flex items-center gap-1.5 py-1 text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free AI Tools</span>
          </Link>
          <Link
            to="/alternatives"
            className="flex items-center gap-1.5 py-1 text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            <Replace className="w-3.5 h-3.5 text-primary" />
            <span>SaaS Alternatives</span>
          </Link>
          <Link
            to="/offers"
            className="flex items-center gap-1.5 py-1 text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Deals</span>
          </Link>
          <Link
            to="/pick"
            className="flex items-center gap-1.5 py-1 text-primary font-medium hover:text-primary-hover transition-colors duration-150"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Help Me Pick</span>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: BROWSE BY GOAL (INTENT-DRIVEN DIRECTORY TILES)
      ========================================================================= */}
      <section
        ref={reveal2.ref}
        className={`max-w-6xl mx-auto px-4 sm:px-6 w-full reveal-section${reveal2.isVisible ? ' in-view' : ''}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Goal-Driven Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              What do you want to build or replace today?
            </h2>
            <p className="text-sm text-secondary-foreground max-w-xl mt-1">
              Jump straight into curated workflows and hand-tested platforms categorized by immediate creative or engineering goals.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors shrink-0"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.id}
                to={goal.href}
               className="group p-5 rounded-lg border border-border bg-card/80 interactive-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${goal.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-secondary-foreground leading-relaxed mb-3">
                    {goal.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground truncate">
                  <span className="font-semibold text-foreground/80">Includes:</span> {goal.examples}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: EDITOR'S PICKS (CURATED SHOWCASE)
      ========================================================================= */}
      <section
        ref={reveal3.ref}
        className={`max-w-6xl mx-auto px-4 sm:px-6 w-full reveal-section${reveal3.isVisible ? ' in-view' : ''}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Star className="w-4 h-4" />
              <span>Handpicked by Tech Hacks AI Editorial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Editor's Picks
            </h2>
            <p className="text-sm text-secondary-foreground max-w-xl mt-1">
              A small editorial shortlist of tools worth a closer look, with the reason each one is here made explicit.
            </p>
          </div>

          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors shrink-0"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {editorsPicks.map((item) => (
            <Link
              key={item.tool.id}
              to={`/ai-tools/${item.tool.slug}`}
               className="group p-5 rounded-lg border border-border bg-card/90 interactive-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <BrandLogo slug={item.tool.slug} name={item.tool.name} size="sm" />
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.tool.name}
                </h3>
                <p className="text-xs text-secondary-foreground line-clamp-2 leading-relaxed mb-3">
                  {item.highlight}
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground capitalize font-medium">{item.tool.pricingType}</span>
                <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3.5: DAILY DISCOVERIES (ADMIN-CURATED FEATURED BREAKTHROUGHS)
      ========================================================================= */}
      <section
        ref={revealDiscoveries.ref}
        className={`max-w-6xl mx-auto px-4 sm:px-6 w-full reveal-section${revealDiscoveries.isVisible ? ' in-view' : ''}`}
      >
        <DailyDiscoveriesSection maxItems={6} />
      </section>

      {/* =========================================================================
          SECTION 4: TRENDING AI TOOLS & DISCOVERY CATALOG
      ========================================================================= */}
      <section
        ref={reveal4.ref}
        className={`max-w-6xl mx-auto px-4 sm:px-6 w-full reveal-section${reveal4.isVisible ? ' in-view' : ''}`}
      >

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Tools Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Explore Top Generative AI Platforms
            </h2>
            <p className="text-sm text-secondary-foreground max-w-xl mt-1">
              Curated foundation models and applications for video generation, image creation, coding assistants, voice synthesis, and automation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/ai-tools"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Filters</span>
            </Link>

            <span className="text-xs text-muted-foreground hidden sm:inline">
              Order by: <strong className="text-foreground">Most Popular</strong>
            </span>

            <Link
              to="/ai-tools"
              className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors"
            >
              <span>View All AI Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Spotlight Showcase Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
               <Video className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <div>
                <span className="font-bold text-foreground block">Verified AI Video Generators</span>
                <span className="text-[11px] text-muted-foreground">Kling (66 daily credits), Vidu, Hailuo, Wan 2.1 (Apache 2.0)</span>
              </div>
            </div>
            <Link
              to="/ai-tools?category=video"
              className="px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-[11px] shrink-0"
            >
              Explore Video →
            </Link>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
               <Bot className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <div>
                <span className="font-bold text-foreground block">Flagship Chatbot &amp; LLM Alternatives</span>
                <span className="text-[11px] text-muted-foreground">Mistral Le Chat (free Canvas), Qwen Chat, DeepSeek-R1</span>
              </div>
            </div>
            <Link
              to="/ai-tools?category=assistants"
              className="px-2.5 py-1 rounded-md bg-muted hover:bg-border text-foreground font-semibold text-[11px] shrink-0"
            >
              Explore Chatbots →
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setSelectedAiCategory('all');
              setAiPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
              selectedAiCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
            }`}
          >
            All AI Tools
          </button>
          {aiCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedAiCategory(cat.id);
                setAiPage(1);
              }}
               className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                selectedAiCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAiTools.map((tool) => (
            <AiToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* AI Tools Pagination */}
        <Pagination
          currentPage={aiPage}
          totalPages={aiTotalPages}
          onPageChange={setAiPage}
        />
      </section>

      {/* =========================================================================
          SECTION 5: FREE AI TOOLS (GENUINELY FREE / NO CC REQUIRED) & CLIENT UTILITIES
      ========================================================================= */}
      <section
        ref={reveal5.ref}
        className={`max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10 reveal-section${reveal5.isVisible ? ' in-view' : ''}`}
      >
        {/* Free AI Platforms Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Gift className="w-4 h-4" />
                <span>100% Free Tiers & Open Source Models</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Free AI Tools (No Credit Card Required)
              </h2>
              <p className="text-sm text-secondary-foreground max-w-xl mt-1">
                Zero paywalls to get started. Verified open-source weights, free recurring web allowances, and local models.
              </p>
            </div>

            <Link
              to="/free-ai-sites"
              className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors shrink-0"
            >
              <span>Explore All Verified Free AI Sites</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {freeAiTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/ai-tools/${tool.slug}`}
                 className="group p-5 rounded-lg border border-border bg-card/90 interactive-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <BrandLogo slug={tool.slug} name={tool.name} size="sm" />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {tool.pricingType === 'free' ? '100% Free' : 'Free Tier'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-secondary-foreground line-clamp-2 leading-relaxed mb-3">
                    {tool.tagline}
                  </p>
                </div>
                <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span className="capitalize">{tool.category}</span>
                  <span className="text-emerald-400 font-semibold">Verified Free</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Client-Side Browser Utilities Sub-block */}
           <div className="p-6 sm:p-8 rounded-lg border border-border bg-card/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4" />
                <span>100% Client-Side Processing</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Free Browser-Based Utilities
              </h3>
              <p className="text-sm text-secondary-foreground max-w-xl mt-1">
                Practical utilities running directly in your browser memory. Zero server uploads, zero accounts, and complete privacy.
              </p>
            </div>

            <Link
              to="/free-tools"
              className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors shrink-0"
            >
              <span>Browse All Utilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {previewUtilities.map((util) => (
              <Link
                key={util.id}
                to={`/free-tools/${util.slug}`}
                 className="group p-5 rounded-lg border border-border bg-card/80 interactive-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted text-secondary-foreground capitalize">
                      {util.category}
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px]">100% Local</span>
                  </div>
                  <h4 className="font-bold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {util.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {util.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground truncate">{util.outputFormat.split('&')[0]}</span>
                  <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: EXPLORE BY CATEGORY (VISUAL CATEGORY GRID)
      ========================================================================= */}
      <section ref={reveal6.ref} className={`max-w-6xl mx-auto px-4 sm:px-6 w-full reveal-section${reveal6.isVisible ? ' in-view' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Taxonomy &amp; Classification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Explore by Tech Category
            </h2>
            <p className="text-sm text-secondary-foreground max-w-xl mt-1">
              Dive into our curated taxonomy spanning cloud databases, generative models, developer tooling, and self-hosted infrastructure.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'LLMs & Chat', icon: Bot, count: '30+ Models', href: '/ai-tools?category=assistants' },
            { name: 'AI Video', icon: Video, count: '14+ Engines', href: '/ai-tools?category=video' },
            { name: 'Code Agents', icon: Code2, count: '22+ Tools', href: '/ai-tools?category=coding' },
            { name: 'Image & Art', icon: ImageIcon, count: '18+ Suites', href: '/ai-tools?category=image' },
            { name: 'Voice & Audio', icon: Volume2, count: '12+ Tools', href: '/ai-tools?category=voice' },
            { name: 'SaaS Alts', icon: Replace, count: '28+ Stacks', href: '/alternatives' },
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={cat.href}
                 className="group p-4 rounded-lg border border-border bg-card/80 interactive-card text-center flex flex-col items-center justify-center gap-2"
              >
                   <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-foreground block group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: VERIFIED AI DEALS & STUDENT BENEFITS
      ========================================================================= */}
      <section ref={reveal7.ref} className={`max-w-6xl mx-auto px-4 sm:px-6 w-full reveal-section${reveal7.isVisible ? ' in-view' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Tag className="w-4 h-4" />
              <span>Verified AI Perks &amp; Partnerships</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              AI Deals, Student Plans &amp; Bundles
            </h2>
            <p className="text-sm text-secondary-foreground max-w-xl mt-1">
              Save hundreds of dollars on premium AI access through verified carrier bundles (like Jio + Gemini), student developer packs, and startup cloud credits.
            </p>
          </div>

          <Link
            to="/offers"
            className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors shrink-0"
          >
            <span>Explore All {getFeaturedOffers().length}+ Verified Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: STEP-BY-STEP GUIDES & PROMPT LIBRARY PREVIEW
      ========================================================================= */}
      <section ref={reveal8.ref} className={`max-w-6xl mx-auto px-4 sm:px-6 w-full reveal-section${reveal8.isVisible ? ' in-view' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Guides Preview Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Step-by-Step AI Guides</h2>
              </div>
              <Link to="/guides" className="text-xs text-primary hover:underline font-semibold">
                View all guides →
              </Link>
            </div>
            <div className="space-y-4">
              {previewGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>

          {/* Prompts Preview Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquareCode className="w-4 h-4 text-purple-400" />
                <h2 className="text-xl font-bold text-foreground">Curated Prompt Recipes</h2>
              </div>
              <Link to="/prompt-library" className="text-xs text-primary hover:underline font-semibold">
                Browse prompt library →
              </Link>
            </div>
            <div className="space-y-4">
              {previewPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: OPEN SOURCE ALTERNATIVES TO POPULAR SAAS & GUIDED BENTO
      ========================================================================= */}
      <section ref={reveal9.ref} className={`max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10 reveal-section${reveal9.isVisible ? ' in-view' : ''}`}>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                <Replace className="w-4 h-4" />
                <span>Find an open-source alternative</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Open Source Alternatives to Popular Software
              </h2>
              <p className="text-sm text-secondary-foreground max-w-xl mt-1">
                Replace closed-source SaaS with community-maintained open source tools. Gain total control over your data and avoid vendor lock-in.
              </p>
            </div>

            <Link
              to="/alternatives"
              className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:text-primary-hover transition-colors shrink-0"
            >
              <span>Browse All {proprietaryTools.length} Proprietary Software Targets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Responsive Grid of Proprietary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProprietary.map((proprietary) => (
              <AlternativeCard key={proprietary.id} alternative={proprietary} />
            ))}
          </div>
        </div>

        {/* Guided Discovery Bento (Help Me Pick & Compare) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Help Me Pick */}
           <div className="p-6 sm:p-8 rounded-lg border border-primary/30 bg-card flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
               <div className="inline-flex items-center gap-2 text-xs font-medium text-primary border-b border-primary/30 pb-2 mb-4">
                <Compass className="w-3.5 h-3.5" />
                <span>Interactive Recommendation Wizard</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mb-2">
                Need Help Choosing the Right Tool?
              </h3>
              <p className="text-sm text-secondary-foreground leading-relaxed mb-6">
                Answer 3 quick questions about your project goals, budget, and hosting preferences. Our rule-based matching engine will recommend the perfect open-source and AI tools for you.
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-border/40">
              <Link
                to="/pick"
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary-hover transition-colors active:scale-98"
              >
                <span>Start "Help Me Pick" Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Compare Any Software */}
           <div className="p-6 sm:p-8 rounded-lg border border-border bg-card flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
               <div className="inline-flex items-center gap-2 text-xs font-medium text-secondary-foreground border-b border-border pb-2 mb-4">
                 <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Side-by-Side Analysis</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mb-2">
                Compare Any Two Platforms
              </h3>
              <p className="text-sm text-secondary-foreground leading-relaxed mb-6">
                Evaluate open-source tools against cloud AI platforms side by side. Inspect licenses, self-hostability, pricing models, verified repository metrics, and tech stacks.
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-border/40 flex items-center justify-between">
              <Link
                to="/compare?tools=supabase,firebase,cursor"
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs sm:text-sm transition-colors active:scale-98"
              >
                <span>Compare Supabase vs Firebase vs Cursor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: ABOUT PLATFORM & COMMUNITY NEWSLETTER
      ========================================================================= */}
      <section ref={reveal10.ref} className={`max-w-4xl mx-auto px-4 sm:px-6 w-full reveal-section${reveal10.isVisible ? ' in-view' : ''}`}>
         <div className="p-8 sm:p-10 rounded-lg border border-border bg-card/70 text-center space-y-6">
           <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <Mail className="w-6 h-6" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Stay Ahead of the Open Source &amp; AI Wave
            </h2>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Receive a weekly digest of newly indexed open-source software, generative AI models, verified self-hosting benchmarks, and prompt recipes. No spam, unsubscribe anytime.
            </p>
          </div>

          {emailSubscribed ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span>Thanks — your interest is saved for this session.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-md transition-colors shrink-0"
              >
                Subscribe Free
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Privacy Respecting</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Independent Editorial Standards</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
               <span>Curated and updated regularly</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
