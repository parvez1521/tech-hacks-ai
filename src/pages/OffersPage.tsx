import React, { useState } from 'react';
import { offersData, isOfferActive } from '../data/offersData';
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
  Archive,
} from 'lucide-react';
import type { OfferType } from '../types';

export const OffersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<OfferType | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'India' | 'Global'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'archived' | 'all'>('active');

  const filteredOffers = offersData.filter((offer) => {
    // Expiration / status filter
    if (statusFilter === 'active' && !isOfferActive(offer)) {
      return false;
    }
    if (statusFilter === 'archived' && isOfferActive(offer)) {
      return false;
    }

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

  const activeCount = offersData.filter((o) => isOfferActive(o)).length;
  const archivedCount = offersData.filter((o) => !isOfferActive(o)).length;
  const studentCount = offersData.filter((o) => o.requiresStudentVerification && isOfferActive(o)).length;
  const indiaCount = offersData.filter((o) => o.region === 'India' && isOfferActive(o)).length;
  const globalCount = offersData.filter((o) => o.region === 'Global' && isOfferActive(o)).length;

  const hasActiveFilters = search.trim() !== '' || selectedType !== 'all' || selectedRegion !== 'all' || statusFilter !== 'active';

  const resetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedRegion('all');
    setStatusFilter('active');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Tag className="w-3.5 h-3.5 text-blue-600" />
          <span>Independently Verified Deals & Student Perks</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
          AI Deals, Student Plans & Exclusive Discounts
        </h1>
        <p className="text-sm sm:text-base text-[#475569] max-w-3xl leading-relaxed mb-6">
          Discover verified promotional benefits, carrier bundles (like Reliance Jio + Google Gemini Advanced), 
          free student developer packs, and startup cloud credits. All deals include honest claim instructions, 
          renewal caveats, and direct links to official terms.
        </p>

        {/* Informational Callout Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE7F3] shadow-invary-card text-xs text-slate-600 mb-6">
          <div className="flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold block mb-0.5">Telecom 5G Bundles</strong>
              <span className="text-slate-500">Complimentary high-tier subscriptions (e.g. Jio 18-month Gemini Advanced) tied to qualifying mobile plans.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold block mb-0.5">Verified Student Plans</strong>
              <span className="text-slate-500">100% free Copilot, JetBrains, and education discounts verified via academic email or SheerID.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold block mb-0.5">Zero Fabricated Codes</strong>
              <span className="text-slate-500">Every listing links directly to official provider URLs with clear expiration and renewal terms.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals (e.g. 'Jio', 'student', 'Copilot', 'credits', 'India')..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#DFE7F3] text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">
              Status:
            </span>
            <div className="inline-flex rounded-xl border border-[#DFE7F3] bg-[#F5F8FF] p-1">
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'active'
                    ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('archived')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'archived'
                    ? 'bg-rose-100 text-rose-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Archived ({archivedCount})
              </button>
            </div>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">
              Region:
            </span>
            <div className="inline-flex rounded-xl border border-[#DFE7F3] bg-[#F5F8FF] p-1">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Regions
              </button>
              <button
                onClick={() => setSelectedRegion('India')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedRegion === 'India'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇮🇳 India ({indiaCount})
              </button>
              <button
                onClick={() => setSelectedRegion('Global')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedRegion === 'Global'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌐 Global ({globalCount})
              </button>
            </div>
          </div>
        </div>

        {/* Offer Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#DFE7F3]">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Offer Type:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-[#DFE7F3] hover:bg-slate-50'
            }`}
          >
            All Offers ({offersData.length})
          </button>
          <button
            onClick={() => setSelectedType('student-plan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedType === 'student-plan'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-[#DFE7F3] hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Student Plans
          </button>
          <button
            onClick={() => setSelectedType('telecom-bundle')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedType === 'telecom-bundle'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-[#DFE7F3] hover:bg-slate-50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Telecom Bundles
          </button>
          <button
            onClick={() => setSelectedType('developer-pack')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedType === 'developer-pack'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-[#DFE7F3] hover:bg-slate-50'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            Developer Packs
          </button>
          <button
            onClick={() => setSelectedType('startup-credits')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedType === 'startup-credits'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-[#DFE7F3] hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Startup Cloud Credits
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 py-1 cursor-pointer font-medium"
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
      <div className="mt-14 p-6 rounded-2xl border border-[#DFE7F3] bg-white text-xs text-slate-600 leading-relaxed shadow-invary-card">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 text-sm">
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
