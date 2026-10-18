import React from 'react';
import { useRouter, Link } from '../router/Router';
import { getOfferBySlug, offersData } from '../data/offersData';
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
} from 'lucide-react';
import { OfferCard } from '../components/OfferCard';

export const OfferDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const offer = getOfferBySlug(slug);

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

  // Related offers (other offers, excluding current)
  const relatedOffers = offersData
    .filter((o) => o.id !== offer.id)
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
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/offers" className="hover:text-foreground transition-colors">
          AI Deals & Benefits
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
          {offer.title}
        </span>
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span>🇮🇳 India Eligible</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-secondary-foreground border border-border">
              <Globe className="w-3.5 h-3.5 opacity-70" />
              <span>Global Eligibility</span>
            </span>
          )}

          {offer.requiresStudentVerification && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student / Educator Verification Required</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Active ({offer.lastVerifiedAt})</span>
          </span>
        </div>

        {/* Title & Provider */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          {offer.title}
        </h1>
        <p className="text-sm font-medium text-secondary-foreground mb-4">
          Offered by <strong className="text-foreground">{offer.provider}</strong>
        </p>

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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <span>Claim Offer on Official Site</span>
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
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
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
              <span className="font-medium text-emerald-400">{offer.lastVerifiedAt}</span>
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

      {/* Disclaimer */}
      <div className="mt-12 p-4 rounded-xl border border-border bg-card/40 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> This listing is provided strictly for educational and informational purposes. Tech Hacks AI is not affiliated with or endorsed by {offer.provider}. Promotional criteria, billing terms, and validity windows are established by the provider and may change or terminate at their sole discretion.
        </p>
      </div>
    </div>
  );
};
