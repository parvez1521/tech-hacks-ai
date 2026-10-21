import React from 'react';
import type { ToolDiscovery } from '../types/discoveries';
import { sanitizeOutboundUrl } from '../services/discoveryService';
import { BrandLogo } from './BrandLogo';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface DailyDiscoveryCardProps {
  discovery: ToolDiscovery;
  compact?: boolean;
}

const LOGO_ALIASES: Record<string, string> = {
  'bolt-new': 'bolt-new',
  'elevenlabs': 'elevenlabs',
  'perplexity-ai': 'perplexity',
  'v0-by-vercel': 'v0-vercel',
};

function getLogoSlug(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return LOGO_ALIASES[slug] || slug;
}

function formatAddedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export const DailyDiscoveryCard: React.FC<DailyDiscoveryCardProps> = ({ discovery, compact = false }) => {
  const safeUrl = sanitizeOutboundUrl(discovery.websiteUrl);
  const addedDate = formatAddedDate(discovery.createdAt);
  const showNew = Boolean(discovery.isNew);
  const showFeatured = Boolean(discovery.isFeatured && !showNew);

  return (
    <article className={`discovery-card group${compact ? ' discovery-card--compact' : ''}`} aria-labelledby={`disc-title-${discovery.id}`}>
      <div className="discovery-card__meta">
        {discovery.category && <span className="discovery-card__category">{discovery.category}</span>}
        <div className="discovery-card__labels">
          {showFeatured && <span className="discovery-card__label">Featured</span>}
          {showNew && <span className="discovery-card__label discovery-card__label--new"><Sparkles size={11} aria-hidden="true" /> New</span>}
        </div>
      </div>

      <div className="discovery-card__identity">
        <BrandLogo
          slug={getLogoSlug(discovery.name)}
          name={discovery.name}
          size="lg"
          className="discovery-card__logo"
        />
        <div className="discovery-card__name-wrap">
          <h2 id={`disc-title-${discovery.id}`} className="discovery-card__title">{discovery.name}</h2>
          {safeUrl && <p className="discovery-card__domain">{new URL(safeUrl).hostname.replace(/^www\./, '')}</p>}
        </div>
      </div>

      <p className="discovery-card__description">{discovery.description}</p>

      <div className="discovery-card__footer">
        {addedDate ? <span className="discovery-card__date">Added {addedDate}</span> : <span />}
        {safeUrl ? (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit website for ${discovery.name} (opens in a new tab)`}
            className="discovery-card__link"
          >
            Visit website <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : (
          <span className="discovery-card__unavailable">Link unavailable</span>
        )}
      </div>
    </article>
  );
};
