import runtimeManifest from './generated/brandLogos.runtime.json' with { type: 'json' };

export interface RuntimeBrandLogoEntry {
  slug: string;
  name: string;
  assetPath: string;
  sourceType: 'official' | 'provided' | 'simple-icons' | 'vector' | 'fallback';
  sourceUrl?: string;
  pngAssetPath?: string;
}

const entries = runtimeManifest.entries as Record<string, RuntimeBrandLogoEntry>;
const aliases = runtimeManifest.aliases as Record<string, string>;

/** Synchronous runtime lookup backed by the generated, browser-safe logo projection. */
export function getBrandLogo(slug: string): RuntimeBrandLogoEntry | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  const aliased = aliases[normalized];
  if (aliased && entries[aliased]) return entries[aliased];
  return entries[normalized];
}
