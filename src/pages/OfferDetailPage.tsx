import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getOfferBySlug, offersData, isOfferActive, isOfferPendingVerification } from '../data/offersData';
import { getBrandLogo } from '../data/runtimeBrandLogos';
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
import { BrandLogo } from '../components/BrandLogo';
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
      <nav className="mb-6 flex flex-col items-start gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between" aria-label="Breadcrumb">
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/offers" className="hover:text-foreground transition-colors">
            AI Deals & Benefits
          </Link>
          <span>/</span>
          <span className="min-w-0 max-w-[160px] truncate text-foreground font-medium sm:max-w-none">
            {offer.title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyShare}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-card hover:bg-muted text-foreground transition-colors shrink-0"
          aria-label="Share deal"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px]">Share</span>
            </>
          )}
        </button>
      </nav>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/90 shadow-xl mb-8 relative overflow-hidden">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Gift className="w-3.5 h-3.5" />
            <span>{formatOfferType(offer.offerType)}</span>
          </span>

          {offer.region === 'India' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
              <span>🇮🇳 India Eligible</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-secondary-foreground border border-border">
              <Globe className="w-3.5 h-3.5 opacity-70" />
              <span>Global Eligibility</span>
            </span>
          )}

          {offer.requiresStudentVerification && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student / Educator Verification Required</span>
            </span>
          )}

          {active ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 ml-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Active ({offer.lastVerifiedAt})</span>
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ml-auto ${isOfferPendingVerification(offer) ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isOfferPendingVerification(offer) ? 'Pending Verification' : 'Expired / Archived'}</span>
            </span>
          )}
        </div>

        {/* Title & Provider with Brand Logo */}
        <div className="flex items-start gap-4 mb-4">
          <BrandLogo slug={offer.logoSlug} name={getBrandLogo(offer.logoSlug)?.name || offer.provider} size="xl" className="mt-1 rounded-xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              {offer.title}
            </h1>
            <p className="text-sm font-medium text-secondary-foreground">
              Offered by <strong className="text-foreground">{offer.provider}</strong>
            </p>
          </div>
        </div>

        {!active && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <strong className="block font-semibold mb-0.5">Offer Expired or Archived</strong>
              <span>This promotional deal or program deadline has passed. Details are preserved for historical reference and documentation. Official terms and benefits may no longer be honored by the provider.</span>
            </div>
          </div>
        )}

        <p className="text-base text-secondary-foreground leading-relaxed mb-6 max-w-3xl">
          {offer.description}
        </p>

        {/* Primary Benefit Highlight Box */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
              Core Benefit Included
            </span>
            <p className="text-sm font-semibold text-foreground">
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
                ? 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 focus:ring-primary/50'
                : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <span>{active ? 'Claim Offer on Official Site' : 'View Archived Offer Site'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={offer.officialTermsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 border border-border transition-colors"
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
          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Eligibility Requirements</span>
            </h2>
            <p className="text-sm text-secondary-foreground leading-relaxed mb-4">
              {offer.eligibility}
            </p>
            {offer.requiresStudentVerification && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300 flex items-start gap-2">
                <GraduationCap className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Academic Proof Needed:</strong> You will be required to submit documentation (e.g. an official school-issued email, university registration ID, or student proof via SheerID/GitHub Education) to claim this benefit.
                </span>
              </div>
            )}
          </div>

          {/* Step-by-Step Claim Instructions */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-lg font-bold text-foreground mb-4">
              How to Claim This Offer (Step-by-Step)
            </h2>
            <div className="space-y-4">
              {offer.claimSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-0.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-secondary-foreground leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal & Cancellation Terms Notice */}
          <div className="p-6 rounded-xl border border-border bg-card/60">
            <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Subscription Renewal & Cancellation Terms</span>
            </h2>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              {offer.renewalTerms}
            </p>
          </div>
        </div>

        {/* Right Column (1 Col): Offer Summary & Meta Sidebar */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-border bg-card text-xs space-y-4">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Offer Snapshot
            </h3>

            <div>
              <span className="text-muted-foreground block mb-0.5">Provider:</span>
              <span className="font-semibold text-foreground">{offer.provider}</span>
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">Category:</span>
              <span className="font-medium text-foreground">{formatOfferType(offer.offerType)}</span>
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">Applicable Region:</span>
              <span className="font-medium text-foreground">{offer.region}</span>
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">Student Proof:</span>
              <span className="font-medium text-foreground">
                {offer.requiresStudentVerification ? 'Required (SheerID / .edu)' : 'Not Required'}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">Last Verified:</span>
              <span className="font-medium text-emerald-700 dark:text-emerald-400">{offer.lastVerifiedAt}</span>
            </div>

            {offer.couponCode && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <span className="text-xs text-muted-foreground block mb-1">Coupon / Promo Code:</span>
                <span className="font-mono text-sm font-bold text-primary tracking-wider">
                  {offer.couponCode}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-border">
              <a
                href={offer.claimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors"
              >
                <span>Go to Official Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {offer.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted text-secondary-foreground"
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
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              More Verified AI Deals & Perks
            </h2>
            <Link
              to="/offers"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
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
      <div className="mt-12 p-6 rounded-xl border border-border bg-card/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Related Guides & Benefit Tutorials</h3>
          </div>
          <Link to="/guides" className="text-xs text-primary hover:underline font-medium">
            Browse All Guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/guides/free-ai-student-benefits-guide"
            className="p-4 rounded-lg border border-border bg-muted/40 hover:bg-muted/80 transition-colors group"
          >
            <span className="text-[10px] uppercase font-mono font-bold text-primary mb-1 block">Student & Cloud Credits</span>
            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block mb-1">
              How Students Can Evaluate AI and Cloud Benefits in 2026
            </span>
            <p className="text-[11px] text-secondary-foreground line-clamp-2">
              Step-by-step verification blueprints for GitHub Student Pack, Azure $100 no-card, AWS Educate, and carrier bundles.
            </p>
          </Link>

          <Link
            to="/guides/evaluating-free-ai-plans"
            className="p-4 rounded-lg border border-border bg-muted/40 hover:bg-muted/80 transition-colors group"
          >
            <span className="text-[10px] uppercase font-mono font-bold text-primary mb-1 block">Plan Evaluation</span>
            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block mb-1">
              How to Evaluate Free AI Tool Plans: Recurring Free vs Starter Trial Credits
            </span>
            <p className="text-[11px] text-secondary-foreground line-clamp-2">
              Avoid fake free trials. Discover daily resets, watermark rules, and commercial license terms before registering.
            </p>
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-4 rounded-xl border border-border bg-card/40 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> This listing is provided strictly for educational and informational purposes. SwitchRoute is not affiliated with or endorsed by {offer.provider}. Promotional criteria, billing terms, and validity windows are established by the provider and may change or terminate at their sole discretion.
        </p>
      </div>
    </div>
  );
};
