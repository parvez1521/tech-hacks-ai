import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { toolsData } from '../src/data/seedData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { offersData } from '../src/data/offersData.ts';
import { brandLogos, getBrandLogo, SLUG_ALIASES } from '../src/data/brandLogos.ts';
import { getBrandLogo as getRuntimeBrandLogo } from '../src/data/runtimeBrandLogos.ts';

const LOGOS_DIR = path.resolve(process.cwd(), 'public/logos');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const logoManifest = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'logo-manifest.json'), 'utf8'));
const runtimeLogoManifest = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/data/generated/brandLogos.runtime.json'), 'utf8'));
const logoAuditReport = fs.readFileSync(path.resolve(process.cwd(), 'docs/logo-audit.md'), 'utf8');

function resolvePublicAsset(assetPath) {
  return path.resolve(PUBLIC_DIR, assetPath.replace(/^\//, ''));
}

describe('Phase 13: Global Brand Logo Audit & Verification', () => {
  test('generated runtime logo registry preserves canonical records and aliases with only UI fields', () => {
    const runtimeFields = ['slug', 'name', 'assetPath', 'sourceType', 'sourceUrl', 'pngAssetPath'];
    assert.deepEqual(Object.keys(runtimeLogoManifest.entries).sort(), Object.keys(brandLogos).sort());
    assert.deepEqual(runtimeLogoManifest.aliases, SLUG_ALIASES);

    for (const entry of logoManifest) {
      const expected = Object.fromEntries(runtimeFields.filter((field) => entry[field] !== undefined).map((field) => [field, entry[field]]));
      const runtimeEntry = getRuntimeBrandLogo(entry.slug);
      const generatedEntry = runtimeLogoManifest.entries[entry.slug];
      assert.deepEqual(generatedEntry, expected, `Generated logo record for ${entry.slug} must match its canonical UI fields`);
      assert.deepEqual(Object.keys(generatedEntry).sort(), Object.keys(expected).sort(), `Generated logo record for ${entry.slug} must exclude audit metadata`);
      assert.deepEqual(runtimeEntry, getBrandLogo(entry.slug) && Object.fromEntries(runtimeFields.filter((field) => getBrandLogo(entry.slug)[field] !== undefined).map((field) => [field, getBrandLogo(entry.slug)[field]])), `Runtime lookup for ${entry.slug} must preserve existing alias behavior`);
      assert.equal(fs.existsSync(resolvePublicAsset(runtimeEntry.assetPath)), true, `Runtime asset for ${entry.slug} must exist`);
    }

    for (const [alias, target] of Object.entries(SLUG_ALIASES)) {
      assert.deepEqual(getRuntimeBrandLogo(alias), getRuntimeBrandLogo(target), `Runtime alias ${alias} must resolve to ${target}`);
    }
    assert.equal(getRuntimeBrandLogo('  Supabase  ')?.slug, getBrandLogo('supabase')?.slug);
    assert.equal(getRuntimeBrandLogo('near-match-not-a-logo'), undefined);
  });

  test('all logo files in public/logos are valid SVG files', () => {
    assert.ok(fs.existsSync(LOGOS_DIR), 'public/logos directory exists');
    const files = fs.readdirSync(LOGOS_DIR).filter((f) => f.endsWith('.svg'));
    assert.ok(files.length >= 100, `Found ${files.length} SVG logos (expected >= 100)`);

    for (const file of files) {
      const filePath = path.join(LOGOS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8').trim();
      assert.ok(
        content.includes('<svg') && content.includes('</svg>'),
        `Logo ${file} must contain valid SVG root markup`
      );
      assert.ok(
        content.includes('viewBox') || (content.includes('width') && content.includes('height')),
        `Logo ${file} must define viewport dimensions`
      );
    }
  });

  test('all open-source tools in seedData.ts have valid logo assets on disk', () => {
    for (const tool of toolsData) {
      const logoEntry = getBrandLogo(tool.slug);
      assert.ok(logoEntry, `Tool "${tool.name}" (${tool.slug}) must have an entry in brandLogos.ts`);
      assert.ok(logoEntry.assetPath, `Tool "${tool.name}" must define an assetPath`);
      
      const filePath = resolvePublicAsset(logoEntry.assetPath);
      assert.ok(
        fs.existsSync(filePath),
        `Logo asset for tool "${tool.name}" must exist on disk: ${filePath}`
      );
    }
  });

  test('all AI tools in aiToolsData.ts have valid logo assets on disk', () => {
    for (const aiTool of aiToolsData) {
      const logoEntry = getBrandLogo(aiTool.slug);
      assert.ok(logoEntry, `AI Tool "${aiTool.name}" (${aiTool.slug}) must have an entry in brandLogos.ts`);
      assert.ok(logoEntry.assetPath, `AI Tool "${aiTool.name}" must define an assetPath`);

      const filePath = resolvePublicAsset(logoEntry.assetPath);
      assert.ok(
        fs.existsSync(filePath),
        `Logo asset for AI Tool "${aiTool.name}" must exist on disk: ${filePath}`
      );
    }
  });

  test('all proprietary software targets in alternatives.ts have valid logo assets on disk', () => {
    for (const propTool of proprietaryTools) {
      const logoEntry = getBrandLogo(propTool.slug);
      assert.ok(logoEntry, `Proprietary target "${propTool.name}" (${propTool.slug}) must have an entry in brandLogos.ts`);
      assert.ok(logoEntry.assetPath, `Proprietary target "${propTool.name}" must define an assetPath`);

      const filePath = resolvePublicAsset(logoEntry.assetPath);
      assert.ok(
        fs.existsSync(filePath),
        `Logo asset for proprietary target "${propTool.name}" must exist on disk: ${filePath}`
      );
    }
  });

  test('all AI offers in offersData.ts have valid logo assets on disk', () => {
    for (const offer of offersData) {
      assert.ok(offer.logoAssetPath, `Offer "${offer.title}" must define logoAssetPath`);
      const filePath = resolvePublicAsset(offer.logoAssetPath);
      assert.ok(
        fs.existsSync(filePath),
        `Logo asset for offer "${offer.title}" must exist on disk: ${filePath}`
      );
    }
  });

  test('brandLogos manifest entries point exclusively to existing files', () => {
    for (const [slug, entry] of Object.entries(brandLogos)) {
      const filePath = resolvePublicAsset(entry.assetPath);
      assert.ok(
        fs.existsSync(filePath),
        `Brand entry for "${slug}" references missing file ${entry.assetPath}`
      );

      if (entry.pngAssetPath) {
        const pngPath = resolvePublicAsset(entry.pngAssetPath);
        assert.ok(fs.existsSync(pngPath), `PNG fallback for "${slug}" must exist: ${pngPath}`);
      }
    }
  });

  test('TypeScript registry and public manifest have exact slug and asset parity', () => {
    assert.ok(Array.isArray(logoManifest), 'public/logo-manifest.json must remain an array');
    const manifestSlugs = logoManifest.map((entry) => entry.slug);
    assert.equal(new Set(manifestSlugs).size, manifestSlugs.length, 'Manifest slugs must be unique');
    assert.deepEqual(
      [...manifestSlugs].sort(),
      Object.keys(brandLogos).sort(),
      'Manifest and TypeScript registry must contain the same canonical slugs'
    );

    const seenAssets = new Map();
    for (const manifestEntry of logoManifest) {
      const registryEntry = brandLogos[manifestEntry.slug];
      assert.deepEqual(
        { slug: registryEntry.slug, assetPath: registryEntry.assetPath, sourceType: registryEntry.sourceType },
        { slug: manifestEntry.slug, assetPath: manifestEntry.assetPath, sourceType: manifestEntry.sourceType },
        `Manifest entry for ${manifestEntry.slug} must match the runtime registry`
      );

      const assetPath = resolvePublicAsset(manifestEntry.assetPath);
      assert.ok(fs.existsSync(assetPath), `Manifest asset must exist: ${manifestEntry.assetPath}`);
      const previousOwner = seenAssets.get(manifestEntry.assetPath);
      assert.ok(
        !previousOwner || previousOwner === manifestEntry.slug,
        `Conflicting logo mapping: ${manifestEntry.assetPath} is used by ${previousOwner} and ${manifestEntry.slug}`
      );
      seenAssets.set(manifestEntry.assetPath, manifestEntry.slug);

      if (manifestEntry.format === 'svg') {
        assert.match(manifestEntry.assetPath, /\.svg$/i, `${manifestEntry.slug} format must match its SVG asset`);
      }
      if (manifestEntry.pngAssetPath) {
        const png = fs.readFileSync(resolvePublicAsset(manifestEntry.pngAssetPath));
        assert.deepEqual(
          [...png.subarray(0, 8)],
          [137, 80, 78, 71, 13, 10, 26, 10],
          `${manifestEntry.slug} PNG fallback must have a valid PNG signature`
        );
      }
      if (manifestEntry.sourceType === 'fallback') {
        assert.ok(manifestEntry.notes, `${manifestEntry.slug} fallback mapping must explain its unresolved status`);
      }
    }
  });

  test('all active catalog identities resolve to their own explicit logo mapping', () => {
    const activeRecords = [
      ...toolsData.map((tool) => ({ kind: 'open-source', slug: tool.slug, name: tool.name })),
      ...aiToolsData.map((tool) => ({ kind: 'ai', slug: tool.slug, name: tool.name })),
      ...proprietaryTools.map((tool) => ({ kind: 'alternative', slug: tool.slug, name: tool.name })),
    ];

    for (const record of activeRecords) {
      const entry = getBrandLogo(record.slug);
      assert.ok(entry, `${record.kind} catalog identity "${record.name}" must resolve a logo entry`);
      assert.ok(
        entry.slug === record.slug || entry.slug === record.slug.replace(/-/g, ''),
        `${record.slug} must resolve through an explicit canonical mapping, not a nearby brand`
      );
      assert.ok(fs.existsSync(resolvePublicAsset(entry.assetPath)), `${record.slug} asset must exist on disk`);
    }
  });

  test('logo audit report records every active catalog identity', () => {
    const activeSlugs = new Set([
      ...toolsData.map((tool) => tool.slug),
      ...aiToolsData.map((tool) => tool.slug),
      ...proprietaryTools.map((tool) => tool.slug),
    ]);

    for (const slug of activeSlugs) {
      assert.match(logoAuditReport, new RegExp(`\\| \\x60${slug}\\x60 \\|`), `Audit report must record ${slug}`);
    }
  });

  test('fallback and alias resolution never borrow a nearby brand logo', () => {
    const xai = getBrandLogo('xai');
    assert.ok(xai, 'xAI/Grok must have a safe resolver entry');
    assert.strictEqual(xai.sourceType, 'fallback', 'xAI remains an explicit unverified fallback');
    assert.notStrictEqual(xai.assetPath, '/logos/x.svg', 'xAI must not point at the X logo');

    const xLogo = fs.readFileSync(path.join(LOGOS_DIR, 'x.svg'), 'utf8');
    const xaiLogo = fs.readFileSync(path.join(LOGOS_DIR, 'xai.svg'), 'utf8');
    assert.notStrictEqual(xaiLogo, xLogo, 'xAI fallback asset must not be a byte-identical X mark');
    assert.strictEqual(getBrandLogo('x-ai'), undefined, 'Near-match slugs require an explicit alias');
    assert.strictEqual(getBrandLogo('not-a-real-brand'), undefined, 'Unknown brands use the component fallback');
  });

  test('named audit identities use traceable official assets or an intentional neutral fallback', () => {
    const slugs = ['omnirush','google-ai-studio','vllm','claude','invideo-ai','runway','cursor','chatgpt','pictory','agnes-video-generator','automated-video-generator','vuza','pika','kling-ai','luma-dream-machine','copilot','aider'];
    for (const slug of slugs) {
      const entry = getBrandLogo(slug);
      assert.ok(entry, `${slug} has a canonical brand record`);
      assert.equal(entry.slug, slug, `${slug} resolves to itself`);
      assert.ok(entry.sourceType === 'fallback' || (entry.sourceUrl && /^https:\/\//.test(entry.sourceUrl)), `${slug} must be traceable or fallback`);
    }
    for (const slug of ['invideo-ai','pictory','agnes-video-generator','automated-video-generator','vuza','kling-ai','luma-dream-machine']) {
      assert.equal(getBrandLogo(slug).sourceType, 'fallback', `${slug} uses the neutral fallback until its mark is verified`);
    }
  });

  test('shared logo variants keep compact square frames without hover scaling', () => {
    const component = fs.readFileSync(path.resolve(process.cwd(), 'src/components/BrandLogo.tsx'), 'utf8');
    const home = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/HomePage.tsx'), 'utf8');
    const alternatives = fs.readFileSync(path.resolve(process.cwd(), 'src/components/AiAlternativesShowcase.tsx'), 'utf8');
    assert.match(component, /case 'xs':[\s\S]*?container: 'w-6 h-6'/);
    assert.match(component, /case 'sm':[\s\S]*?container: 'w-8 h-8'/);
    assert.match(component, /case 'md':[\s\S]*?container: 'w-10 h-10'/);
    assert.match(component, /case 'lg':[\s\S]*?container: 'w-12 h-12'/);
    assert.match(component, /object-contain/);
    assert.doesNotMatch(component, /group-hover:scale/);
    assert.match(home, /<BrandLogo[^>]*size="sm"/);
    assert.match(alternatives, /<BrandLogo[^>]*size="xs" showContainer=\{false\}/);
  });
});
