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
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Affiliate &amp; Advertising Disclosure</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#DFE7F3]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Editorial Transparency &amp; FTC Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Affiliate &amp; Advertising Disclosure
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: October 18, 2026 • Compliant with FTC 16 CFR § 255.5 Guidelines
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-slate-600">
        {/* Overview Box */}
        <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/70 space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            Our Commitment to Editorial Transparency
          </h2>
          <p className="text-slate-700 leading-relaxed">
            At Tech Hacks AI (<strong className="text-slate-900 font-semibold">{siteConfig.url}</strong>), trust is our most valuable asset. We believe in complete transparency regarding how our research, verification infrastructure, and independent publication are funded. This disclosure explains our advertising policies and affiliate relationships in full compliance with U.S. Federal Trade Commission (FTC) guidelines and international advertising standards.
          </p>
        </div>

        {/* 1. Display Advertising (Google AdSense) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            1. Programmatic &amp; Contextual Display Advertising
          </h2>
          <p>
            Tech Hacks AI may display third-party advertisements served by advertising networks, including Google AdSense. These ads help support server hosting, automated repository verification scrapers, and editorial research.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs pl-2 text-slate-600">
            <li>
              <strong className="text-slate-900 font-semibold">Clear Identification:</strong> All advertising banners, sponsored slots, and commercial promotions on our site are clearly designated with labels such as &quot;Advertisement&quot; or &quot;Sponsored&quot;.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">No Endorsement:</strong> The appearance of an advertisement on Tech Hacks AI does not constitute an endorsement, guarantee, or recommendation of the advertised product or service by our editorial team.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Ad Standards:</strong> We do not allow deceptive, adult, malicious, or intrusive pop-under advertisements that interfere with software exploration.
            </li>
          </ul>
        </section>

        {/* 2. Affiliate Links Policy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            2. Affiliate Partnerships &amp; Referral Links
          </h2>
          <p>
            Some of the external links to third-party software tools, developer platforms, cloud hosting providers, and educational resources on Tech Hacks AI may be affiliate links.
          </p>
          <p>
            If you click on an affiliate link and subsequently purchase a subscription, license, or cloud credit package, Tech Hacks AI may receive a small referral commission from the merchant. <strong className="text-slate-900 font-semibold">This commission comes at zero additional cost to you.</strong> In many instances, our partnership listings and AI Deals directory provide exclusive educational discounts, starter credits, or extended trials that benefit our readers directly.
          </p>
        </section>

        {/* 3. Strict Separation of Editorial and Commercial Interests */}
        <section className="p-6 rounded-2xl border border-[#DFE7F3] bg-white space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Scale className="w-5 h-5 text-blue-600" />
            <h2>3. Strict Editorial Independence Guarantee</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Our commercial relationships have <strong className="text-slate-900 font-semibold">zero influence</strong> over our editorial ratings, benchmarks, tool rankings, or recommendation algorithms:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-900 text-xs block">
                Objective Evaluation Metrics
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All software profiles are assessed against verified criteria: license transparency, self-hostability, active repository commits, genuine free quota allowances, and data privacy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-900 text-xs block">
                Zero Pay-to-Rank Placement
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Companies cannot pay to alter their rating, climb to the top of category lists, or manipulate the &quot;Help Me Pick&quot; matching engine.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-900 text-xs block">
                Equal Prominence for Free &amp; Open Source
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Self-hosted, copyleft, and non-commercial open-source software (which provides zero referral revenue) receives equal or superior placement compared to paid SaaS platforms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-900 text-xs block">
                Critical Honest Reviews
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                If a platform limits its free plan, introduces vendor lock-in, or changes licensing terms, we explicitly flag these migration drivers regardless of whether an affiliate program exists.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Questions & Feedback */}
        <section className="pt-6 border-t border-[#DFE7F3] space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            4. Questions &amp; Feedback
          </h2>
          <p>
            If you have questions about our affiliate relationships, advertising policies, or editorial guidelines, please contact our team:
          </p>
          <p className="font-mono text-xs text-blue-600 font-semibold">
            Email: editorial@techhacksai.com
          </p>
          <p className="text-xs text-slate-500">
            You can also submit questions directly via our <Link to="/contact" className="text-blue-600 hover:text-blue-700 underline font-medium">Contact Form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};
