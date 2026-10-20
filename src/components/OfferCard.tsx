import React from 'react';
import type { AiOffer } from '../types/index.ts';
import { Link } from '../router/Router.tsx';
import { isOfferActive } from '../data/offersData.ts';
import { ExternalLink, ArrowRight, ShieldCheck, GraduationCap, Gift, CheckCircle2, Globe, AlertTriangle } from 'lucide-react';

interface OfferCardProps {
  offer: AiOffer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const active = isOfferActive(offer);
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
      className={`group relative flex flex-col justify-between h-full p-5 rounded-2xl border border-[#DFE7F3] bg-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-invary-card-hover shadow-invary-card focus-within:ring-2 focus-within:ring-blue-500/40 cursor-pointer ${
        !active ? 'opacity-80 border-dashed' : ''
      }`}
    >
      {/* Decorative Subtle Inner Spotlight on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(280px circle at var(--card-x, 50%) var(--card-y, 30%), rgba(37, 99, 235, 0.06), transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Primary Card Stretch Link for whole-card navigation */}
      <Link
        to={`/offers/${offer.slug}`}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none"
        aria-label={`View details for ${offer.title}`}
      >
        <span className="sr-only">View details for {offer.title}</span>
      </Link>

      {/* Card Content with pointer-events-none so body clicks hit the stretch link */}
      <div className="relative z-20 pointer-events-none">
        {/* Top Badges Row: Offer Type, Region & Student Verification */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Gift className="w-3 h-3 text-blue-600" />
              <span>{formatOfferType(offer.offerType)}</span>
            </span>

            {offer.region === 'India' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span>🇮🇳 India</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Globe className="w-3 h-3 opacity-70" />
                <span>Global</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {!active && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-3 h-3" />
                <span>Expired / Archived</span>
              </span>
            )}
            {offer.requiresStudentVerification && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <GraduationCap className="w-3 h-3" />
                <span>Student ID Req.</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Provider with Brand Logo */}
        <div className="flex items-start gap-3 mb-2.5">
          {offer.logoAssetPath && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-[#F5F8FF] border border-[#DFE7F3] shadow-xs p-1.5 mt-0.5">
              <img
                src={offer.logoAssetPath}
                alt={`${offer.provider} logo`}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Link
              to={`/offers/${offer.slug}`}
              className="pointer-events-auto font-bold text-slate-900 text-base tracking-tight hover:text-blue-600 transition-colors block line-clamp-1 focus:outline-none focus:underline"
            >
              {offer.title}
            </Link>
            <span className="text-xs text-slate-500 block mt-0.5 font-medium">
              By <strong className="text-slate-700">{offer.provider}</strong>
            </span>
          </div>
        </div>

        {/* Highlighted Benefit Summary Box */}
        <div className="p-2.5 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] mb-3 text-xs leading-relaxed text-slate-700">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium text-slate-900">{offer.benefitSummary}</span>
          </div>
        </div>

        {/* Short Eligibility / Context */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
          {offer.eligibility}
        </p>
      </div>

      {/* Footer bar with explicit interactive action links */}
      <div className="relative z-20 pt-3 border-t border-[#DFE7F3] flex items-center justify-between text-xs pointer-events-none">
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Oct 2026</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            to={`/offers/${offer.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-0.5 focus:outline-none focus:underline cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={offer.claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            title={`Claim ${offer.title} on official website`}
          >
            <span>Claim</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
