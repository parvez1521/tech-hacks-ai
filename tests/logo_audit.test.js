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
      
      const fileName = path.basename(logoEntry.assetPath);
      const filePath = path.join(LOGOS_DIR, fileName);
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

      const fileName = path.basename(logoEntry.assetPath);
      const filePath = path.join(LOGOS_DIR, fileName);
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

      const fileName = path.basename(logoEntry.assetPath);
      const filePath = path.join(LOGOS_DIR, fileName);
      assert.ok(
        fs.existsSync(filePath),
        `Logo asset for proprietary target "${propTool.name}" must exist on disk: ${filePath}`
      );
    }
  });

  test('all AI offers in offersData.ts have valid logo assets on disk', () => {
    for (const offer of offersData) {
      assert.ok(offer.logoAssetPath, `Offer "${offer.title}" must define logoAssetPath`);
      const fileName = path.basename(offer.logoAssetPath);
      const filePath = path.join(LOGOS_DIR, fileName);
      assert.ok(
        fs.existsSync(filePath),
        `Logo asset for offer "${offer.title}" must exist on disk: ${filePath}`
      );
    }
  });

  test('brandLogos manifest entries point exclusively to existing files', () => {
    for (const [slug, entry] of Object.entries(brandLogos)) {
      const fileName = path.basename(entry.assetPath);
      const filePath = path.join(LOGOS_DIR, fileName);
      assert.ok(
        fs.existsSync(filePath),
        `Brand entry for "${slug}" references missing file ${entry.assetPath}`
      );
    }
  });
});
