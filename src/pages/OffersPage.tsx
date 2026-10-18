import React, { useState } from 'react';
import { offersData } from '../data/offersData';
import { OfferCard } from '../components/OfferCard';
import { EmptyState } from '../components/EmptyState';
import {
  Tag,
  Search,
  X,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Radio,
  Globe,
  Info,
  Gift,
  ExternalLink,
} from 'lucide-react';
import type { OfferType } from '../types';

export const OffersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<OfferType | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'India' | 'Global'>('all');

  const filteredOffers = offersData.filter((offer) => {
    // Type filter
    if (selectedType !== 'all' && offer.offerType !== selectedType) {
      return false;
    }

    // Region filter
    if (selectedRegion !== 'all' && offer.region !== selectedRegion) {
      return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = offer.title.toLowerCase().includes(q);
      const matchProvider = offer.provider.toLowerCase().includes(q);
      const matchDesc = offer.description.toLowerCase().includes(q);
      const matchBenefit = offer.benefitSummary.toLowerCase().includes(q);
      const matchTags = offer.tags.some((t) => t.toLowerCase().includes(q));
      const matchEligibility = offer.eligibility.toLowerCase().includes(q);
      return matchTitle || matchProvider || matchDesc || matchBenefit || matchTags || matchEligibility;
    }

    return true;
  });

  const studentCount = offersData.filter((o) => o.requiresStudentVerification).length;
  const indiaCount = offersData.filter((o) => o.region === 'India').length;
  const globalCount = offersData.filter((o) => o.region === 'Global').length;

  const hasActiveFilters = search.trim() !== '' || selectedType !== 'all' || selectedRegion !== 'all';

  const resetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedRegion('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Tag className="w-3.5 h-3.5" />
          <span>Independently Verified Deals & Student Perks</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          AI Deals, Student Plans & Exclusive Discounts
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-3xl leading-relaxed mb-6">
          Discover verified promotional benefits, carrier bundles (like Reliance Jio + Google Gemini Advanced), 
          free student developer packs, and startup cloud credits. All deals include honest claim instructions, 
          renewal caveats, and direct links to official terms.
        </p>

        {/* Informational Callout Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-card/60 border border-border/80 text-xs text-secondary-foreground mb-6">
          <div className="flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold block mb-0.5">Telecom 5G Bundles</strong>
              <span>Complimentary high-tier subscriptions (e.g. Jio 18-month Gemini Advanced) tied to qualifying mobile plans.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold block mb-0.5">Verified Student Plans</strong>
              <span>100% free Copilot, JetBrains, and education discounts verified via academic email or SheerID.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold block mb-0.5">Zero Fabricated Codes</strong>
              <span>Every listing links directly to official provider URLs with clear expiration and renewal terms.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals (e.g. 'Jio', 'student', 'Copilot', 'credits', 'India')..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 hidden sm:inline">
              Region:
            </span>
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedRegion === 'all'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Regions
              </button>
              <button
                onClick={() => setSelectedRegion('India')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedRegion === 'India'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🇮🇳 India ({indiaCount})
              </button>
              <button
                onClick={() => setSelectedRegion('Global')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedRegion === 'Global'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🌐 Global ({globalCount})
              </button>
            </div>
          </div>
        </div>

        {/* Offer Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1 hidden sm:inline">
            Offer Type:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-foreground text-background font-semibold shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            All Offers ({offersData.length})
          </button>
          <button
            onClick={() => setSelectedType('student-plan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedType === 'student-plan'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Student Plans
          </button>
          <button
            onClick={() => setSelectedType('telecom-bundle')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedType === 'telecom-bundle'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Telecom Bundles
          </button>
          <button
            onClick={() => setSelectedType('developer-pack')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedType === 'developer-pack'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            Developer Packs
          </button>
          <button
            onClick={() => setSelectedType('startup-credits')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedType === 'startup-credits'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Startup Cloud Credits
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 py-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredOffers.length}</strong> of {offersData.length} verified deals
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          All links verified active
        </span>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No deals found matching your criteria"
          description="Try clearing your search filters or browse all global and student plans."
          actionText="Reset Filters"
          onAction={resetFilters}
        />
      )}

      {/* Transparency & Verification Policy Disclaimer */}
      <div className="mt-14 p-5 rounded-xl border border-border bg-card/40 text-xs text-muted-foreground leading-relaxed">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="font-semibold text-foreground text-sm">
              Tech Hacks AI Deal Verification & Transparency Policy
            </h4>
            <p>
              All promotional benefits, telecom bundles, student programs, and cloud credit initiatives listed above are independently curated from official provider websites, press releases, and student verification platforms (such as SheerID and GitHub Education).
            </p>
            <p>
              Tech Hacks AI does not sell coupons, fabricate promotional codes, or earn hidden commissions from unlisted intermediaries. Third-party terms, academic eligibility verification, geographic restrictions, and automatic subscription renewal terms apply directly with the respective service providers (Reliance Jio, Google, GitHub/Microsoft, Perplexity, AWS, JetBrains, and Notion). Always verify current terms on the official provider portal prior to sharing academic credentials or payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
