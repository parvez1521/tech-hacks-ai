import React from 'react';
import { AiTool, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { BrandLogo } from './BrandLogo';
import { AffiliateDisclosure } from './AffiliateDisclosure';
import { aiCategories } from '../data/aiToolsData';
import { ExternalLink, Star } from 'lucide-react';

interface FeaturedToolCardProps {
  tool: AiTool;
}

/* Pricing/access label for the card's top meta row, using the same data
   precedence and labels as AiToolCard's badge — rendered as colour-coded
   text in the AIxploria manner (Free green, Freemium amber, Paid rose,
   Free Trial purple) rather than as a filled badge. */
const getPricingMeta = (tool: AiTool): { label: string; className: string } => {
  if (tool.videoDiscoverySections?.includes('open-weights')) {
    return { label: 'Open Weights', className: 'text-sky-600 dark:text-sky-400' };
  }
  if (tool.freeAccessType === 'open-source-local' || tool.isSelfHostable) {
    return { label: 'Open Source', className: 'text-emerald-600 dark:text-emerald-400' };
  }
  switch (tool.pricingType) {
    case 'free':
      return { label: 'Free', className: 'text-emerald-600 dark:text-emerald-400' };
    case 'freemium':
      return { label: 'Freemium', className: 'text-amber-600 dark:text-amber-400' };
    case 'free-credits':
      return { label: 'Free credits', className: 'text-cyan-600 dark:text-cyan-400' };
    case 'free-trial':
      return { label: 'Free Trial', className: 'text-purple-600 dark:text-purple-400' };
    case 'paid':
    default:
      return { label: 'Paid', className: 'text-rose-600 dark:text-rose-400' };
  }
};

/* Centred featured-tool card in the AIxploria anatomy, built only from
   real catalog fields: pricing/access label, the catalog's own featured
   flag, brand mark, tagline, and the existing external destination with
   the same rel/aria semantics as AiToolCard. The catalog has no upvote,
   rating, or verified-badge field, so those reference elements are not
   reproduced. */
export const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  const detailUrl = `/ai-tools/${tool.slug}`;
  const bookmarkItem: BookmarkItem = {
    id: `ai-${tool.id}`,
    type: 'ai-tool',
    slug: tool.slug,
    title: tool.name,
    subtitle: tool.tagline,
    url: detailUrl,
    iconBgColor: tool.iconBgColor,
    iconLetter: tool.iconLetter,
    savedAt: new Date().toISOString(),
  };
  const pricing = getPricingMeta(tool);
  const categoryName = aiCategories.find((category) => category.id === tool.category)?.name || tool.category;

  return (
    <article className="surface-card group relative flex flex-col items-center rounded-[1.25rem] p-5 text-center">
      {/* Top meta row: pricing label · FEATURED · bookmark */}
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className={`justify-self-start text-[11px] font-bold uppercase tracking-wider ${pricing.className}`}>
          {pricing.label}
        </span>
        {tool.isFeatured ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-pink-500">
            <Star className="h-3.5 w-3.5 fill-pink-500" aria-hidden="true" />
            Featured
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <span className="justify-self-end">
          <BookmarkButton item={bookmarkItem} size="sm" />
        </span>
      </div>

      <BrandLogo
        slug={tool.slug}
        name={tool.name}
        size={36}
        iconBgColor={tool.iconBgColor}
        iconLetter={tool.iconLetter}
        className="mt-5 rounded-[10px] ring-1 ring-border/50"
      />
      <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">
        <Link
          to={detailUrl}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="gradient-underline">{tool.name}</span>
        </Link>
      </h3>
      <p className="meta-label mt-2">{categoryName}</p>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
        &laquo;&nbsp;{tool.tagline}&nbsp;&raquo;
      </p>

      <div className="mt-auto flex flex-col items-center pt-5">
        <a
          href={tool.affiliateUrl || tool.websiteUrl}
          target="_blank"
          rel={tool.affiliateUrl ? 'noopener noreferrer sponsored nofollow' : 'noopener noreferrer'}
          aria-label={`Open ${tool.name} ${tool.affiliateUrl ? 'affiliate link' : tool.websiteUrl.includes('github.com') ? 'official repository' : 'official website'}`}
          className="btn-primary inline-flex min-h-11 items-center gap-2 px-6 text-sm font-bold uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Visit
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        {tool.affiliateUrl && (
          <span className="mt-2">
            <AffiliateDisclosure />
          </span>
        )}
      </div>
    </article>
  );
};
