import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getOfferBySlug, offersData, isOfferActive } from '../data/offersData';
import {
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Gift,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info,
  Radio,
  Sparkles,
  Globe,
  Share2,
  Check,
  BookOpen,
} from 'lucide-react';
import { OfferCard } from '../components/OfferCard';
import { siteConfig } from '../config/siteConfig';

export const OfferDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const offer = getOfferBySlug(slug);

  const [copiedShare, setCopiedShare] = useState(false);

  if (!offer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Offer Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find an AI deal or benefit matching &quot;{slug}&quot;. It may have expired or been moved.
        </p>
        <Link
          to="/offers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All AI Deals</span>
        </Link>
      </div>
    );
  }

  const active = isOfferActive(offer);

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${siteConfig.url}/offers/${offer.slug}`;
      navigator.clipboard.writeText(canonicalUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Structured Data (Offer / SpecialAnnouncement)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: offer.title,
    description: offer.description,
    url: `${siteConfig.url}/offers/${offer.slug}`,
    offeredBy: {
      '@type': 'Organization',
      name: offer.provider,
    },
    eligibleRegion: offer.region,
    validThrough: offer.expiresAt || undefined,
  };

  // Related offers (other active offers, excluding current)
  const relatedOffers = offersData
    .filter((o) => o.id !== offer.id && isOfferActive(o))
    .slice(0, 3);

  const formatOfferType = (type: string) => {
    switch (type) {
      case 'telecom-bundle':
        return 'Telecom 5G Bundle';
      case 'student-plan':
        return 'Student & Educator Plan';
      case 'developer-pack':
        return 'Developer Student Pack';
      case 'startup-credits':
        return 'Startup Cloud Credits';
      case 'free-subscription':
        return 'Free Subscription';
      case 'discount':
        return 'Educational Discount';
      default:
        return 'Verified Benefit';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Embedded JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center justify-between text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <Link to="/offers" className="hover:text-slate-900 transition-colors">
            AI Deals & Benefits
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-blue-600 font-medium truncate max-w-[200px] sm:max-w-none">
            {offer.title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFE7F3] bg-white hover:bg-slate-50 text-slate-700 transition-colors shrink-0 shadow-xs cursor-pointer"
          aria-label={copiedShare ? 'Copied!' : 'Share'}
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium">Share</span>
            </>
          )}
        </button>
      </nav>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card mb-8 relative overflow-hidden">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
            <Gift className="w-3.5 h-3.5 text-blue-600" />
            <span>{formatOfferType(offer.offerType)}</span>
          </span>

          {offer.region === 'India' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              <span>🇮🇳 India Eligible</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              <Globe className="w-3.5 h-3.5 opacity-70" />
              <span>Global Eligibility</span>
            </span>
          )}

          {offer.requiresStudentVerification && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student / Educator Verification Required</span>
            </span>
          )}

          {active ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ml-auto font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Active ({offer.lastVerifiedAt})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 ml-auto font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Expired / Archived</span>
            </span>
          )}
        </div>

        {/* Title & Provider with Brand Logo */}
        <div className="flex items-start gap-4 mb-4">
          {offer.logoAssetPath && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden bg-[#F5F8FF] border border-[#DFE7F3] shadow-xs p-2 mt-1">
              <img
                src={offer.logoAssetPath}
                alt={`${offer.provider} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              {offer.title}
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Offered by <strong className="text-slate-800">{offer.provider}</strong>
            </p>
          </div>
        </div>

        {!active && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <strong className="block font-semibold mb-0.5">Offer Expired or Archived</strong>
              <span>This promotional deal or program deadline has passed. Details are preserved for historical reference and documentation. Official terms and benefits may no longer be honored by the provider.</span>
            </div>
          </div>
        )}

        <p className="text-base text-slate-600 leading-relaxed mb-6 max-w-3xl">
          {offer.description}
        </p>

        {/* Primary Benefit Highlight Box */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 mb-6 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1 font-mono">
              Core Benefit Included
            </span>
            <p className="text-sm font-semibold text-blue-950">
              {offer.benefitSummary}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={offer.claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 ${
              active
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:ring-blue-500/30'
                : 'bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200'
            }`}
          >
            <span>{active ? 'Claim Offer on Official Site' : 'View Archived Offer Site'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={offer.officialTermsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 border border-[#DFE7F3] transition-colors"
          >
            <span>Official Terms & Conditions</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Two-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column (2 Cols): Eligibility & Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Eligibility Section */}
          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Eligibility Requirements</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {offer.eligibility}
            </p>
            {offer.requiresStudentVerification && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <GraduationCap className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>Academic Proof Needed:</strong> You will be required to submit documentation (e.g. an official school-issued email, university registration ID, or student proof via SheerID/GitHub Education) to claim this benefit.
                </span>
              </div>
            )}
          </div>

          {/* Step-by-Step Claim Instructions */}
          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              How to Claim This Offer (Step-by-Step)
            </h2>
            <div className="space-y-4">
              {offer.claimSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-0.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal & Cancellation Terms Notice */}
          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Subscription Renewal & Cancellation Terms</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {offer.renewalTerms}
            </p>
          </div>
        </div>

        {/* Right Column (1 Col): Offer Summary & Meta Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white text-xs space-y-4 shadow-invary-card">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-mono">
              Offer Snapshot
            </h3>

            <div>
              <span className="text-slate-500 block mb-0.5">Provider:</span>
              <span className="font-semibold text-slate-900">{offer.provider}</span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Category:</span>
              <span className="font-medium text-slate-700">{formatOfferType(offer.offerType)}</span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Applicable Region:</span>
              <span className="font-medium text-slate-700">{offer.region}</span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Student Proof:</span>
              <span className="font-medium text-slate-700">
                {offer.requiresStudentVerification ? 'Required (SheerID / .edu)' : 'Not Required'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Last Verified:</span>
              <span className="font-medium text-emerald-700 font-mono">{offer.lastVerifiedAt}</span>
            </div>

            {offer.couponCode && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs text-slate-500 block mb-1">Coupon / Promo Code:</span>
                <span className="font-mono text-sm font-bold text-blue-700 tracking-wider">
                  {offer.couponCode}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-[#DFE7F3]">
              <a
                href={offer.claimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <span>Go to Official Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 font-mono">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {offer.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Deals Section */}
      {relatedOffers.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[#DFE7F3]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              More Verified AI Deals & Perks
            </h2>
            <Link
              to="/offers"
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View all deals</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedOffers.map((rel) => (
              <OfferCard key={rel.id} offer={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Related Educational Guides */}
      <div className="mt-12 p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Related Guides & Benefit Tutorials</h3>
          </div>
          <Link to="/guides" className="text-xs text-blue-600 hover:underline font-medium">
            Browse All Guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/guides/free-ai-student-benefits-guide"
            className="p-4 rounded-xl border border-[#DFE7F3] bg-[#F5F8FF] hover:bg-white hover:border-blue-300 transition-all group"
          >
            <span className="text-[10px] uppercase font-mono font-bold text-blue-600 mb-1 block">Student & Cloud Credits</span>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block mb-1">
              The Definitive Guide to Free AI & Cloud Credits for Students in 2026
            </span>
            <p className="text-[11px] text-slate-600 line-clamp-2">
              Step-by-step verification blueprints for GitHub Student Pack, Azure $100 no-card, AWS Educate, and carrier bundles.
            </p>
          </Link>

          <Link
            to="/guides/evaluating-free-ai-plans"
            className="p-4 rounded-xl border border-[#DFE7F3] bg-[#F5F8FF] hover:bg-white hover:border-blue-300 transition-all group"
          >
            <span className="text-[10px] uppercase font-mono font-bold text-blue-600 mb-1 block">Plan Evaluation</span>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block mb-1">
              How to Evaluate Free AI Tool Plans: Recurring Free vs Starter Trial Credits
            </span>
            <p className="text-[11px] text-slate-600 line-clamp-2">
              Avoid fake free trials. Discover daily resets, watermark rules, and commercial license terms before registering.
            </p>
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-4 rounded-xl border border-[#DFE7F3] bg-slate-50 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-700">Disclaimer:</strong> This listing is provided strictly for educational and informational purposes. Tech Hacks AI is not affiliated with or endorsed by {offer.provider}. Promotional criteria, billing terms, and validity windows are established by the provider and may change or terminate at their sole discretion.
        </p>
      </div>
    </div>
  );
};
