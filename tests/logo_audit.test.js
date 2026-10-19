import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { toolsData } from '../src/data/seedData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { offersData } from '../src/data/offersData.ts';
import { brandLogos, getBrandLogo } from '../src/data/brandLogos.ts';

const LOGOS_DIR = path.resolve(process.cwd(), 'public/logos');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const logoManifest = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'logo-manifest.json'), 'utf8'));
const logoAuditReport = fs.readFileSync(path.resolve(process.cwd(), 'docs/logo-audit.md'), 'utf8');

function resolvePublicAsset(assetPath) {
  return path.resolve(PUBLIC_DIR, assetPath.replace(/^\//, ''));
}

describe('Phase 13: Global Brand Logo Audit & Verification', () => {
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
});
