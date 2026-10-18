import React from 'react';
import { Link } from '../router/Router';
import {
  Sparkles,
  ShieldCheck,
  Scale,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Award,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const DisclosurePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Affiliate &amp; Advertising Disclosure</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Editorial Transparency &amp; FTC Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
          Affiliate &amp; Advertising Disclosure
        </h1>
        <p className="text-xs text-muted-foreground">
          Last Updated: October 18, 2026 • Compliant with FTC 16 CFR § 255.5 Guidelines
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-secondary-foreground">
        {/* Overview Box */}
        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
          <h2 className="text-base font-bold text-foreground">
            Our Commitment to Editorial Transparency
          </h2>
          <p>
            At Tech Hacks AI (<strong className="text-foreground">{siteConfig.url}</strong>), trust is our most valuable asset. We believe in complete transparency regarding how our research, verification infrastructure, and independent publication are funded. This disclosure explains our advertising policies and affiliate relationships in full compliance with U.S. Federal Trade Commission (FTC) guidelines and international advertising standards.
          </p>
        </div>

        {/* 1. Display Advertising (Google AdSense) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            1. Programmatic &amp; Contextual Display Advertising
          </h2>
          <p>
            Tech Hacks AI may display third-party advertisements served by advertising networks, including Google AdSense. These ads help support server hosting, automated repository verification scrapers, and editorial research.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs pl-2">
            <li>
              <strong>Clear Identification:</strong> All advertising banners, sponsored slots, and commercial promotions on our site are clearly designated with labels such as &quot;Advertisement&quot; or &quot;Sponsored&quot;.
            </li>
            <li>
              <strong>No Endorsement:</strong> The appearance of an advertisement on Tech Hacks AI does not constitute an endorsement, guarantee, or recommendation of the advertised product or service by our editorial team.
            </li>
            <li>
              <strong>Ad Standards:</strong> We do not allow deceptive, adult, malicious, or intrusive pop-under advertisements that interfere with software exploration.
            </li>
          </ul>
        </section>

        {/* 2. Affiliate Links Policy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            2. Affiliate Partnerships &amp; Referral Links
          </h2>
          <p>
            Some of the external links to third-party software tools, developer platforms, cloud hosting providers, and educational resources on Tech Hacks AI may be affiliate links.
          </p>
          <p>
            If you click on an affiliate link and subsequently purchase a subscription, license, or cloud credit package, Tech Hacks AI may receive a small referral commission from the merchant. <strong className="text-foreground">This commission comes at zero additional cost to you.</strong> In many instances, our partnership listings and AI Deals directory provide exclusive educational discounts, starter credits, or extended trials that benefit our readers directly.
          </p>
        </section>

        {/* 3. Strict Separation of Editorial and Commercial Interests */}
        <section className="p-6 rounded-2xl border border-border bg-card/70 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Scale className="w-5 h-5 text-primary" />
            <h2>3. Strict Editorial Independence Guarantee</h2>
          </div>
          <p>
            Our commercial relationships have <strong className="text-foreground">zero influence</strong> over our editorial ratings, benchmarks, tool rankings, or recommendation algorithms:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <span className="font-semibold text-foreground text-xs block">
                Objective Evaluation Metrics
              </span>
              <p className="text-[11px] text-secondary-foreground leading-relaxed">
                All software profiles are assessed against verified criteria: license transparency, self-hostability, active repository commits, genuine free quota allowances, and data privacy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <span className="font-semibold text-foreground text-xs block">
                Zero Pay-to-Rank Placement
              </span>
              <p className="text-[11px] text-secondary-foreground leading-relaxed">
                Companies cannot pay to alter their rating, climb to the top of category lists, or manipulate the &quot;Help Me Pick&quot; matching engine.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <span className="font-semibold text-foreground text-xs block">
                Equal Prominence for Free &amp; Open Source
              </span>
              <p className="text-[11px] text-secondary-foreground leading-relaxed">
                Self-hosted, copyleft, and non-commercial open-source software (which provides zero referral revenue) receives equal or superior placement compared to paid SaaS platforms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <span className="font-semibold text-foreground text-xs block">
                Critical Honest Reviews
              </span>
              <p className="text-[11px] text-secondary-foreground leading-relaxed">
                If a platform limits its free plan, introduces vendor lock-in, or changes licensing terms, we explicitly flag these migration drivers regardless of whether an affiliate program exists.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Questions & Feedback */}
        <section className="pt-6 border-t border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            4. Questions &amp; Feedback
          </h2>
          <p>
            If you have questions about our affiliate relationships, advertising policies, or editorial guidelines, please contact our team:
          </p>
          <p className="font-mono text-xs text-primary">
            Email: editorial@techhacksai.com
          </p>
          <p className="text-xs text-muted-foreground">
            You can also submit questions directly via our <Link to="/contact" className="text-primary hover:underline">Contact Form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};
