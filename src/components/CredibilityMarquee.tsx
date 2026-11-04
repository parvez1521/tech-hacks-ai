import React from 'react';
import { Link } from '../router/Router';
import { BrandLogo } from './BrandLogo';

/**
 * CredibilityMarquee — a slow-scrolling row of the biggest names in
 * AI, placed under the SwitchFlow strip in the Alternatives section.
 *
 * Every entry is a real catalogue entry on this site (AI catalogue or
 * a proprietary alternatives target) and links to its own page. The
 * row makes NO free/alternative claim — some of these brands (e.g.
 * ElevenLabs, Midjourney) have no free alternative mapped in the
 * catalogue, which is exactly why they live here and not in the
 * SwitchFlow animation above. Logos render through BrandLogo, the
 * site's own logo system. The track duplicates the list once for a
 * seamless loop, pauses on hover, and stops under reduced motion.
 */
const BRANDS: ReadonlyArray<{ slug: string; name: string; to: string }> = [
  { slug: 'chatgpt', name: 'ChatGPT', to: '/ai-tools/chatgpt' },
  { slug: 'claude', name: 'Claude', to: '/ai-tools/claude' },
  { slug: 'gemini', name: 'Gemini', to: '/ai-tools/gemini' },
  { slug: 'elevenlabs', name: 'ElevenLabs', to: '/ai-tools/elevenlabs' },
  { slug: 'midjourney', name: 'Midjourney', to: '/ai-tools/midjourney' },
  { slug: 'deepseek', name: 'DeepSeek', to: '/ai-tools/deepseek' },
  { slug: 'suno', name: 'Suno', to: '/ai-tools/suno' },
  { slug: 'cursor', name: 'Cursor', to: '/ai-tools/cursor' },
  { slug: 'perplexity', name: 'Perplexity AI', to: '/alternatives/perplexity' },
  { slug: 'runway', name: 'Runway', to: '/alternatives/runway' },
  { slug: 'kling-ai', name: 'Kling AI', to: '/alternatives/kling-ai' },
  { slug: 'synthesia', name: 'Synthesia', to: '/alternatives/synthesia' },
];

const BrandItem: React.FC<{ brand: (typeof BRANDS)[number]; hidden?: boolean }> = ({ brand, hidden }) => (
  <Link
    to={brand.to}
    aria-hidden={hidden || undefined}
    tabIndex={hidden ? -1 : undefined}
    className="flex flex-none items-center gap-2.5 px-2 opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
  >
    <BrandLogo slug={brand.slug} name={brand.name} size="sm" showContainer={false} />
    <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-foreground">{brand.name}</span>
  </Link>
);

export const CredibilityMarquee: React.FC = () => (
  <div className="-mt-4 mb-10">
    <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      The biggest names in AI — all catalogued on SwitchRoute
    </p>
    <div className="cred-marquee overflow-hidden" aria-label="Famous AI brands catalogued on SwitchRoute">
      <div className="cred-marquee__track flex w-max items-center gap-10">
        {BRANDS.map((brand) => (
          <BrandItem key={brand.slug} brand={brand} />
        ))}
        {BRANDS.map((brand) => (
          <BrandItem key={`dup-${brand.slug}`} brand={brand} hidden />
        ))}
      </div>
    </div>
  </div>
);
