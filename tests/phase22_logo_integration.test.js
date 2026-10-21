import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { brandLogos, getBrandLogo, getAllBrandLogos, SLUG_ALIASES } from '../src/data/brandLogos.ts';
import { toolsData } from '../src/data/seedData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { offersData } from '../src/data/offersData.ts';
import { promptsData, promptProviders } from '../src/data/promptsData.ts';
import { updatesData } from '../src/data/updatesData.ts';

const LOGOS_DIR = path.resolve(process.cwd(), 'public/logos');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const PNG_DIR = path.resolve(process.cwd(), 'public/logos/png');
const MANIFEST_PATH = path.resolve(process.cwd(), 'public/logo-manifest.json');

let ssrModule;

function setupMockBrowser(url = 'https://techhacksai.com/') {
  const parsed = new URL(url);
  global.window = {
    location: {
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      href: url,
      origin: parsed.origin,
    },
    history: {
      pushState: () => {},
      replaceState: () => {},
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
  };
  global.document = {
    title: '',
    head: { appendChild: () => {} },
    body: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
    documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} }, setAttribute: () => {} },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
  };
}

function renderClean(element) {
  return renderToString(element).replace(/<!--.*?-->/g, '');
}

describe('Phase 22: Authentic Brand Logo Integration & Catalog Mapping', () => {
  before(async () => {
    ssrModule = await import('../dist/test-ssr.js');
  });

  // -------------------------------------------------------------------------
  // 1. Manifest Structure & Integrity
  // -------------------------------------------------------------------------
  describe('1. Manifest Structure & Integrity', () => {
    test('public/logo-manifest.json exists and contains at least 218 entries', () => {
      assert.ok(fs.existsSync(MANIFEST_PATH), 'public/logo-manifest.json must exist');
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      assert.ok(Array.isArray(manifest), 'manifest must be an array');
      assert.ok(manifest.length >= 218, `manifest has ${manifest.length} entries (expected >= 218)`);
    });

    test('no duplicate slugs exist in logo-manifest.json', () => {
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      const slugs = manifest.map((m) => m.slug);
      const uniqueSlugs = new Set(slugs);
      assert.strictEqual(slugs.length, uniqueSlugs.size, 'All manifest slugs must be unique');
    });

    test('every manifest entry has required metadata fields', () => {
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      for (const entry of manifest) {
        assert.ok(entry.slug && typeof entry.slug === 'string', `Entry missing slug: ${JSON.stringify(entry)}`);
        assert.ok(entry.name && typeof entry.name === 'string', `Entry ${entry.slug} missing name`);
        assert.ok(entry.assetPath && entry.assetPath.startsWith('/logos/'), `Entry ${entry.slug} invalid assetPath`);
        assert.ok(entry.verifiedAt && /^\d{4}-\d{2}-\d{2}/.test(entry.verifiedAt), `Entry ${entry.slug} invalid verifiedAt`);
         assert.ok(['official', 'provided', 'simple-icons', 'vector', 'fallback'].includes(entry.sourceType), `Entry ${entry.slug} invalid sourceType`);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 2. Vector Files on Disk & SVG Validation
  // -------------------------------------------------------------------------
  describe('2. Vector Files on Disk & SVG Validation', () => {
    test('every manifest entry has an existing asset on disk with a valid image container', () => {
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      for (const entry of manifest) {
        const filePath = path.join(PUBLIC_DIR, entry.assetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(filePath), `Vector file missing for slug "${entry.slug}": ${filePath}`);
        const content = fs.readFileSync(filePath);
        if (/\.svg$/i.test(filePath)) {
          const text = content.toString('utf8');
          assert.ok(text.includes('<svg') && text.includes('</svg>'), `Vector file for "${entry.slug}" must have SVG tags`);
          assert.ok(text.length > 50, `Vector file for "${entry.slug}" is suspiciously small`);
        } else {
          assert.ok(content.length > 32, `Raster file for "${entry.slug}" is suspiciously small`);
        }
      }
    });

    test('new critical assets (play-ht, capcut, cohere, stabilityai) have valid vector files', () => {
      const required = ['play-ht.svg', 'capcut.svg', 'cohere.svg', 'stabilityai.svg', 'runpod.svg', 'weaviate.svg'];
      for (const file of required) {
        const filePath = path.join(LOGOS_DIR, file);
        assert.ok(fs.existsSync(filePath), `Required logo ${file} must exist on disk`);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. High-Resolution 512px PNG Assets
  // -------------------------------------------------------------------------
  describe('3. High-Resolution 512px PNG Assets', () => {
    test('PNG assets directory contains generated raster images with valid PNG magic bytes', () => {
      assert.ok(fs.existsSync(PNG_DIR), 'public/logos/png directory must exist');
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      const entriesWithPng = manifest.filter((m) => m.pngAssetPath);
      assert.ok(entriesWithPng.length >= 108, `Expected at least 108 PNG entries, got ${entriesWithPng.length}`);

      for (const entry of entriesWithPng.slice(0, 30)) {
        const filePath = path.join(process.cwd(), 'public', entry.pngAssetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(filePath), `PNG file must exist for ${entry.slug}: ${filePath}`);
        const buf = fs.readFileSync(filePath);
        // PNG magic bytes: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
        assert.strictEqual(buf[0], 0x89, `${entry.slug} PNG header byte 0`);
        assert.strictEqual(buf[1], 0x50, `${entry.slug} PNG header byte 1 (P)`);
        assert.strictEqual(buf[2], 0x4e, `${entry.slug} PNG header byte 2 (N)`);
        assert.strictEqual(buf[3], 0x47, `${entry.slug} PNG header byte 3 (G)`);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Module Functions & Alias Normalization
  // -------------------------------------------------------------------------
  describe('4. brandLogos.ts Functions & Alias Resolution', () => {
    test('brandLogos dictionary exports all 218 brands', () => {
      const count = Object.keys(brandLogos).length;
      assert.ok(count >= 218, `brandLogos count is ${count} (expected >= 218)`);
    });

    test('getAllBrandLogos returns all entries as an array', () => {
      const list = getAllBrandLogos();
      assert.ok(Array.isArray(list), 'getAllBrandLogos must return an array');
      assert.strictEqual(list.length, Object.keys(brandLogos).length);
    });

    test('getBrandLogo resolves exact slugs accurately', () => {
      const sb = getBrandLogo('supabase');
      assert.ok(sb, 'supabase must resolve');
      assert.strictEqual(sb.slug, 'supabase');
      assert.strictEqual(sb.name, 'Supabase');

      const fc = getBrandLogo('firecrawl');
      assert.ok(fc, 'firecrawl must resolve');
      assert.strictEqual(fc.slug, 'firecrawl');
    });

    test('getBrandLogo resolves aliases accurately', () => {
      assert.strictEqual(getBrandLogo('amazonaws')?.slug, 'aws', 'amazonaws -> aws');
      assert.strictEqual(getBrandLogo('amazon-web-services')?.slug, 'aws', 'amazon-web-services -> aws');
      assert.strictEqual(getBrandLogo('microsoftazure')?.slug, 'azure', 'microsoftazure -> azure');
       assert.strictEqual(getBrandLogo('githubcopilot')?.slug, 'githubcopilot', 'githubcopilot keeps its canonical identity');
       assert.strictEqual(getBrandLogo('github-copilot')?.slug, 'githubcopilot', 'github-copilot -> githubcopilot');
       assert.strictEqual(getBrandLogo('googlegemini')?.slug, 'googlegemini', 'googlegemini keeps its canonical identity');
       assert.strictEqual(getBrandLogo('google-gemini')?.slug, 'googlegemini', 'google-gemini -> googlegemini');
      assert.strictEqual(getBrandLogo('black-forest-labs')?.slug, 'flux-1', 'black-forest-labs -> flux-1');
      assert.strictEqual(getBrandLogo('nextjs')?.slug, 'nextdotjs', 'nextjs -> nextdotjs');
      assert.strictEqual(getBrandLogo('photoshop')?.slug, 'adobephotoshop', 'photoshop -> adobephotoshop');
      assert.strictEqual(getBrandLogo('playht')?.slug, 'play-ht', 'playht -> play-ht');
    });

    test('getBrandLogo handles case insensitivity and whitespace', () => {
      assert.strictEqual(getBrandLogo('  Supabase  ')?.slug, 'supabase');
      assert.strictEqual(getBrandLogo('FIREcrawl')?.slug, 'firecrawl');
    });

    test('getBrandLogo returns undefined for unknown slugs', () => {
      assert.strictEqual(getBrandLogo('nonexistent-unknown-brand-xyz'), undefined);
    });
  });

  // -------------------------------------------------------------------------
  // 5. Complete Website Catalog Coverage
  // -------------------------------------------------------------------------
  describe('5. Complete Website Catalog Coverage', () => {
    test('100% of open-source tools in seedData.ts have mapped logos', () => {
      for (const tool of toolsData) {
        const logo = getBrandLogo(tool.slug);
        assert.ok(logo, `Open source tool "${tool.name}" (${tool.slug}) must have mapped brand logo`);
      }
    });

    test('100% of AI tools in aiToolsData.ts have mapped logos', () => {
      for (const tool of aiToolsData) {
        const logo = getBrandLogo(tool.slug);
        assert.ok(logo, `AI tool "${tool.name}" (${tool.slug}) must have mapped brand logo`);
      }
    });

    test('100% of proprietary software targets in alternatives.ts have mapped logos', () => {
      for (const tool of proprietaryTools) {
        const logo = getBrandLogo(tool.slug);
        assert.ok(logo, `Proprietary tool "${tool.name}" (${tool.slug}) must have mapped brand logo`);
      }
    });

    test('100% of offers in offersData.ts have valid logoAssetPath on disk', () => {
      for (const offer of offersData) {
        assert.ok(offer.logoAssetPath, `Offer "${offer.title}" must define logoAssetPath`);
        const filePath = path.join(process.cwd(), 'public', offer.logoAssetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(filePath), `Offer logo asset for "${offer.title}" must exist on disk: ${filePath}`);
      }
    });

    test('Offers resolve through canonical registry identities instead of raw image paths', () => {
      const offerCard = fs.readFileSync(path.resolve(process.cwd(), 'src/components/OfferCard.tsx'), 'utf8');
      const offerDetail = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/OfferDetailPage.tsx'), 'utf8');

      assert.ok(!offerCard.includes('src={offer.logoAssetPath}'), 'Offer cards do not bypass BrandLogo with raw paths');
      assert.ok(!offerDetail.includes('src={offer.logoAssetPath}'), 'Offer details do not bypass BrandLogo with raw paths');

      for (const offer of offersData) {
        assert.ok(offer.logoSlug, `Offer "${offer.title}" must define a canonical logoSlug`);
        const entry = getBrandLogo(offer.logoSlug);
        assert.ok(entry, `Offer "${offer.title}" logoSlug must resolve in brandLogos`);
        assert.strictEqual(offer.logoAssetPath, entry.assetPath, `Offer "${offer.title}" asset path must match its canonical registry entry`);
      }
    });

    test('100% of prompt providers in promptsData.ts resolve to brand logos', () => {
      const distinctProviders = [...new Set(promptsData.map((p) => p.provider).filter(Boolean))];
      for (const provider of distinctProviders) {
        const slug = provider.toLowerCase().replace(/\s+/g, '-');
        const logo = getBrandLogo(slug);
        assert.ok(logo, `Prompt provider "${provider}" (slug: ${slug}) must resolve to brand logo`);
      }
    });

    test('100% of updates with toolSlug in updatesData.ts resolve to brand logos', () => {
      for (const item of updatesData) {
        if (item.toolSlug) {
          const logo = getBrandLogo(item.toolSlug);
          assert.ok(logo, `Changelog item "${item.title}" toolSlug "${item.toolSlug}" must resolve to brand logo`);
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. SSR Route & Component UI Integration
  // -------------------------------------------------------------------------
  describe('6. SSR Route & Component UI Integration', () => {
    test('/offers directory renders authentic brand logos on offer cards', () => {
      setupMockBrowser('https://techhacksai.com/offers');
      const { App } = ssrModule;
      const html = renderClean(React.createElement(App));
       assert.ok(html.includes('/logos/googlegemini.svg'), 'Offers directory must render the canonical Google Gemini logo');
       assert.ok(html.includes('/logos/githubcopilot.svg'), 'Offers directory must render the canonical GitHub Copilot logo');
    });

    test('/offers/:slug detail page renders hero provider logo', () => {
      setupMockBrowser('https://techhacksai.com/offers/jio-google-gemini-offer');
      const { App } = ssrModule;
      const html = renderClean(React.createElement(App));
       assert.ok(html.includes('/logos/googlegemini.svg'), 'Offer detail page must render hero Gemini logo');
       assert.ok(html.includes('Google Gemini logo'), 'Offer detail page must use the canonical asset name for its logo alt text');
    });

    test('/prompt-library directory renders provider brand logo badges', () => {
      setupMockBrowser('https://techhacksai.com/prompt-library');
      const { App } = ssrModule;
      const html = renderClean(React.createElement(App));
       assert.ok(html.includes('/logos/google.svg') || html.includes('/logos/anthropic.svg') || html.includes('Google'), 'Prompt library must render provider brand logo or name');
    });

    test('/prompt-library/:slug renders provider brand logo in header badge', () => {
      setupMockBrowser('https://techhacksai.com/prompt-library/gemini-commercial-product-photography');
      const { App } = ssrModule;
      const html = renderClean(React.createElement(App));
      assert.ok(html.includes('/logos/googlegemini.svg'), 'Gemini prompt detail must render the Google Gemini product logo in the header badge');
    });

    test('/updates changelog renders brand logos for tool releases', () => {
      setupMockBrowser('https://techhacksai.com/updates');
      const { App } = ssrModule;
      const html = renderClean(React.createElement(App));
      assert.ok(html.includes('/logos/flux-1.svg') || html.includes('/logos/supabase.svg'), 'Updates page must render tool logo');
    });
  });
});
