import React from 'react';
import { Link } from '../router/Router';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  BookOpen,
  CheckCircle2,
  Lock,
  Scale,
  GraduationCap,
  Mail,
  ArrowRight,
  HardDrive,
  Users,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">About Us</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Our Mission & Editorial Principles</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
          About Tech Hacks AI
        </h1>
        <p className="text-base sm:text-lg text-secondary-foreground leading-relaxed max-w-3xl">
          Tech Hacks AI is an independent software discovery directory and educational publication dedicated to helping developers, creators, students, and technology teams navigate the rapidly evolving generative AI and open-source landscape.
        </p>
      </div>

      {/* Why We Built Tech Hacks AI */}
      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Why Tech Hacks AI Exists
        </h2>
        <div className="prose prose-neutral dark:prose-invert text-secondary-foreground text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            The software industry has reached a turning point. Proprietary SaaS products increasingly rely on per-seat subscription lock-in, aggressive price increases, and opaque telemetry. Meanwhile, the generative AI boom has created thousands of new wrappers, many advertising "free" access that quietly expires after a 24-hour trial or demands immediate credit card details.
          </p>
          <p>
            We built Tech Hacks AI to cut through this noise. Our directory independently categorizes, tests, and documents open-source software alternatives, genuine recurring free generative tools, side-by-side architecture comparisons, and practical step-by-step engineering workflows.
          </p>
        </div>
      </section>

      {/* Core Editorial Pillars */}
      <section className="mb-12 space-y-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Our Four Core Pillars
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              1. Verified Pricing Provenance
            </h3>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              Every indexed AI tool is manually checked to determine its genuine pricing tier: recurring daily/monthly free allowances, one-time starter credits, or strictly paid models. We clearly distinguish between free-forever tools and introductory trials.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              2. Open-Source First
            </h3>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              We champion self-hostable, local-first, and copyleft/permissive open-source software. When proprietary tools like Figma, Notion, or Firebase raise prices or limit access, we map community-maintained alternatives that give you complete data ownership.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              3. Practical Engineering Workflows
            </h3>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              We author substantive, code-level tutorials covering IDE vs. terminal coding agents (Cursor, Claude Code, Aider, Cline), context-window management, local LLMs with Ollama, and cost-effective prompt engineering recipes.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              4. Verified Student & Developer Perks
            </h3>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              We research and verify legitimate cloud credits, student packs (GitHub, Azure, AWS Educate), and carrier telecom bundles (such as Reliance Jio's 18-month Gemini offer in India) so learners can build without upfront capital.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Independence */}
      <section className="mb-12 p-6 rounded-2xl border border-border bg-card/80 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Editorial Independence & Review Standards</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">
          How We Review Software
        </h3>
        <ul className="space-y-3 text-xs sm:text-sm text-secondary-foreground">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Paid Rankings:</strong> Software vendors cannot purchase placement, artificially boost star ratings, or influence our recommendation algorithms.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Regular Price & Repository Audits:</strong> Pricing models and repository activity (commits, license changes, GitHub stars) are verified periodically to keep catalog entries accurate.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Honest Cost Disclosures:</strong> We explicitly warn users about self-hosting infrastructure overhead and API token consumption for tools that appear "free" on the surface.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy-First Architecture:</strong> Tech Hacks AI does not track visitors across the web, does not sell personal information, and maintains 100% open client-side browser utilities.
            </span>
          </li>
        </ul>
      </section>

      {/* Contact CTA */}
      <section className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground mb-1">
            Have a Question, Correction, or Tool Suggestion?
          </h3>
          <p className="text-xs text-secondary-foreground">
            Our editorial team responds to community inquiries, pricing updates, and feedback.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover shadow-sm transition-colors shrink-0"
        >
          <span>Contact Our Team</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
};
