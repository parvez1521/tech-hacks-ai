import React from 'react';
import type { AiOffer } from '../types/index.ts';
import { Link } from '../router/Router.tsx';
import { ExternalLink, ArrowRight, ShieldCheck, GraduationCap, Gift, CheckCircle2, Globe } from 'lucide-react';

interface OfferCardProps {
  offer: AiOffer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

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
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between p-5 rounded-xl border border-border bg-card/90 hover:bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20 focus-within:ring-2 focus-within:ring-primary/60 cursor-pointer"
    >
      {/* Decorative Subtle Inner Spotlight on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(280px circle at var(--card-x, 50%) var(--card-y, 30%), rgba(59, 130, 246, 0.12), transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Primary Card Stretch Link for whole-card navigation */}
      <Link
        to={`/offers/${offer.slug}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none"
        aria-label={`View details for ${offer.title}`}
      >
        <span className="sr-only">View details for {offer.title}</span>
      </Link>

      {/* Card Content with pointer-events-none so body clicks hit the stretch link */}
      <div className="relative z-20 pointer-events-none">
        {/* Top Badges Row: Offer Type, Region & Student Verification */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Gift className="w-3 h-3" />
              <span>{formatOfferType(offer.offerType)}</span>
            </span>

            {offer.region === 'India' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span>🇮🇳 India</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-secondary-foreground border border-border/60">
                <Globe className="w-3 h-3 opacity-70" />
                <span>Global</span>
              </span>
            )}
          </div>

          {offer.requiresStudentVerification && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <GraduationCap className="w-3 h-3" />
              <span>Student ID Req.</span>
            </span>
          )}
        </div>

        {/* Title & Provider */}
        <div className="mb-2.5">
          <Link
            to={`/offers/${offer.slug}`}
            className="pointer-events-auto font-bold text-foreground text-base tracking-tight hover:text-primary transition-colors block line-clamp-1 focus:outline-none focus:underline"
          >
            {offer.title}
          </Link>
          <span className="text-xs text-muted-foreground block mt-0.5 font-medium">
            By <strong className="text-secondary-foreground">{offer.provider}</strong>
          </span>
        </div>

        {/* Highlighted Benefit Summary Box */}
        <div className="p-2.5 rounded-lg bg-muted/60 border border-border/60 mb-3 text-xs leading-relaxed text-secondary-foreground">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="font-medium text-foreground">{offer.benefitSummary}</span>
          </div>
        </div>

        {/* Short Eligibility / Context */}
        <p className="text-xs text-secondary-foreground line-clamp-2 mb-3">
          {offer.eligibility}
        </p>
      </div>

      {/* Footer bar with explicit interactive action links */}
      <div className="relative z-20 pt-3 border-t border-border/50 flex items-center justify-between text-xs pointer-events-none">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Oct 2026</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            to={`/offers/${offer.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors group-hover:translate-x-0.5 focus:outline-none focus:underline"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={offer.claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-border text-foreground text-xs font-medium transition-colors border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary"
            title={`Claim ${offer.title} on official website`}
          >
            <span>Claim</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
