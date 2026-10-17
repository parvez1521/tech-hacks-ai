import React, { useState } from 'react';
import { Link } from '../router/Router';
import { UniversalSearch } from '../components/UniversalSearch';
import { AlternativeCard } from '../components/AlternativeCard';
import { AiToolCard } from '../components/AiToolCard';
import { GuideCard } from '../components/GuideCard';
import { PromptCard } from '../components/PromptCard';
import { Pagination } from '../components/Pagination';
import { proprietaryTools } from '../data/alternatives';
import { aiToolsData, aiCategories } from '../data/aiToolsData';
import { getAllGuides, getAllPrompts, getAllFreeTools } from '../services/aiCatalogService';
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
  Flame,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedAiCategory, setSelectedAiCategory] = useState<string>('all');
  const [aiPage, setAiPage] = useState(1);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // 1. Proprietary targets for Section 2 (Figma, Notion, Firebase, Airtable, Zapier, Google Analytics)
  const featuredProprietary = proprietaryTools.slice(0, 6);

  // 2. AI tools filtered by category and paginated for Section 3
  const allFilteredAi = aiToolsData.filter(
    (t) => (selectedAiCategory === 'all' ? true : t.category === selectedAiCategory)
  );
  const aiPageSize = 6;
  const aiTotalPages = Math.max(2, Math.ceil(allFilteredAi.length / aiPageSize));
  const filteredAiTools = allFilteredAi.slice((aiPage - 1) * aiPageSize, aiPage * aiPageSize);

  // 3. Featured Guides & Prompts
  const previewGuides = getAllGuides().slice(0, 2);
  const previewPrompts = getAllPrompts().slice(0, 2);

  // 4. Client-side utilities preview
  const previewUtilities = getAllFreeTools().slice(0, 3);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* =========================================================================
          SECTION 1: HERO & UNIVERSAL SEARCH
      ========================================================================= */}
      <section className="relative pt-12 pb-6 sm:pt-16 sm:pb-10 text-center max-w-5xl mx-auto px-4 w-full">
        {/* Background Dot Texture */}
        <div
          className="absolute inset-0 bg-dot-pattern opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Ambient Gradient Bloom */}
        <div
          className="absolute inset-0 -top-20 -z-10 flex items-center justify-center pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          <div className="w-[580px] h-[340px] bg-primary/15 rounded-full blur-3xl opacity-60 animate-ambient-drift" />
        </div>

        {/* Pill Badge */}
        <div className="animate-fade-in-up [animation-delay:0ms]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:border-primary/40 hover:bg-primary/15 transition-all duration-200 cursor-default mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-subtle" />
            <span>Curated Open Source Software Directory & AI Discovery Platform</span>
          </div>
        </div>

        {/* H1 Headline */}
        <h1 className="animate-fade-in-up [animation-delay:60ms] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto leading-tight sm:leading-none mb-4">
          Discover the Best AI Tools & Open Source Alternatives
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up [animation-delay:120ms] text-sm sm:text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Over 1 million developers, creators, and businesses use Tech Hacks AI to replace expensive proprietary SaaS, explore top generative AI models, follow step-by-step guides, and run free browser utilities.
        </p>

        {/* Universal Search Bar with Intent Chips */}
        <div className="animate-fade-in-up [animation-delay:180ms] mb-8">
          <UniversalSearch />
        </div>

        {/* Quick Route Shortcuts Ribbon */}
        <div className="animate-fade-in-up [animation-delay:240ms] flex flex-wrap items-center justify-center gap-3 text-xs pt-4 border-t border-border/50 max-w-2xl mx-auto">
          <Link
            to="/ai-tools"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-primary/40 text-foreground transition-all duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>AI Directory</span>
          </Link>
          <Link
            to="/alternatives"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-primary/40 text-foreground transition-all duration-150"
          >
            <Replace className="w-3.5 h-3.5 text-primary" />
            <span>SaaS Alternatives</span>
          </Link>
          <Link
            to="/tools"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-primary/40 text-foreground transition-all duration-150"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Source Catalog</span>
          </Link>
          <Link
            to="/free-tools"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-primary/40 text-foreground transition-all duration-150"
          >
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span>Free Utilities</span>
          </Link>
          <Link
            to="/pick"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-primary/40 text-foreground transition-all duration-150 font-medium"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Help Me Pick</span>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: OPEN SOURCE ALTERNATIVES (PROPRIETARY PRIMARY CARDS)
      ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
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
      </section>

      {/* =========================================================================
          SECTION 3: AI TOOLS DISCOVERY (HANDLYTECH-INSPIRED CATALOG)
      ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
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
            {/* Filter drawer trigger affordance for compatibility */}
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
              <span>View All {aiToolsData.length}+ AI Tools</span>
              <ArrowRight className="w-4 h-4" />
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
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
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
          SECTION 4: GUIDED DISCOVERY BENTO (HELP ME PICK & COMPARE)
      ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Help Me Pick */}
          <div className="p-6 sm:p-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-primary/5 flex flex-col justify-between shadow-xl shadow-black/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 mb-4">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary-hover shadow-md transition-all active:scale-98 group-hover:translate-x-1"
              >
                <span>Start "Help Me Pick" Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Compare Any Software */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-gradient-to-br from-card to-card/60 flex flex-col justify-between shadow-xl shadow-black/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-muted text-secondary-foreground border border-border mb-4">
                <span className="text-xs">⚖️</span>
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-98"
              >
                <span>Compare Supabase vs Firebase vs Cursor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FREE BROWSER-BASED UTILITIES
      ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>100% Client-Side Processing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Free Browser-Based Utilities
            </h2>
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
              className="group p-5 rounded-xl border border-border bg-card/80 hover:bg-card hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted text-secondary-foreground capitalize">
                    {util.category}
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">100% Local</span>
                </div>
                <h3 className="font-bold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {util.name}
                </h3>
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
      </section>

      {/* =========================================================================
          SECTION 6: STEP-BY-STEP GUIDES & PROMPT LIBRARY PREVIEW
      ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Guides Preview Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Step-by-Step AI Guides</h2>
              </div>
              <Link to="/guides" className="text-xs text-primary hover:underline">
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
              <Link to="/prompt-library" className="text-xs text-primary hover:underline">
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
          SECTION 7: ABOUT PLATFORM & COMMUNITY NEWSLETTER
      ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-8 sm:p-10 rounded-2xl border border-border bg-card/70 shadow-xl text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-inner">
            <Mail className="w-6 h-6" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Stay Ahead of the Open Source & AI Wave
            </h2>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Receive a weekly digest of newly indexed open-source software, generative AI models, verified self-hosting benchmarks, and prompt recipes. No spam, unsubscribe anytime.
            </p>
          </div>

          {emailSubscribed ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span>Thank you! You're subscribed to weekly platform digests.</span>
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
              <span>Over 1,000+ Tools Indexed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
