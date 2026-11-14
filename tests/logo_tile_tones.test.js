import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { LOGO_TILE_TONES, getLogoTileTone } from '../src/data/logoTileTones.ts';
import { getBrandLogo as getRuntimeBrandLogo } from '../src/data/runtimeBrandLogos.ts';

const indexCss = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf8');
const brandLogo = fs.readFileSync(path.resolve(process.cwd(), 'src/components/BrandLogo.tsx'), 'utf8');

describe('Logo contrast tiles (measured 2026-11-14)', () => {
  test('tone map covers the 770 measured failing logos with valid tones only', () => {
    const entries = Object.entries(LOGO_TILE_TONES);
    assert.equal(entries.length, 770);
    const counts = { light: 0, dark: 0 };
    for (const [slug, tone] of entries) {
      assert.ok(tone === 'light' || tone === 'dark', `${slug} has invalid tone ${tone}`);
      counts[tone] += 1;
    }
    assert.equal(counts.light, 603);
    assert.equal(counts.dark, 167);
  });

  test('every mapped slug exists in the runtime logo registry', () => {
    for (const slug of Object.keys(LOGO_TILE_TONES)) {
      assert.ok(getRuntimeBrandLogo(slug), `tone-mapped slug ${slug} is not in the registry`);
    }
  });

  test('tone lookup normalizes case/whitespace and returns undefined for unknown slugs', () => {
    assert.equal(getLogoTileTone('  AFFINE '), 'light');
    assert.equal(getLogoTileTone('Microsoft'), 'dark');
    assert.equal(getLogoTileTone(''), undefined);
    assert.equal(getLogoTileTone('near-match-not-a-logo'), undefined);
  });

  test('spot checks: known dark marks get a white tile, known light marks a dark tile', () => {
    assert.equal(getLogoTileTone('affine'), 'light');
    assert.equal(getLogoTileTone('1password'), 'light');
    assert.equal(getLogoTileTone('dify'), 'light');
    assert.equal(getLogoTileTone('microsoft'), 'dark');
    assert.equal(getLogoTileTone('ollama'), 'dark');
    assert.equal(getLogoTileTone('zo-computer'), 'dark');
    // suno is a white mark whose old white CSS tile made it invisible everywhere.
    assert.equal(getLogoTileTone('suno'), 'dark');
  });

  test('no tone-mapped slug keeps a per-slug CSS tile (no specificity fight)', () => {
    const perSlugTiles = new Set([...indexCss.matchAll(/\.brand-logo-image--([a-z0-9-]+)/g)].map((m) => m[1]));
    const overlap = Object.keys(LOGO_TILE_TONES).filter((slug) => perSlugTiles.has(slug));
    assert.deepEqual(overlap, []);
    // suno's old white-tile rule is gone; the tone map governs it now.
    assert.doesNotMatch(indexCss, /\.brand-logo-image--suno/);
  });

  test('generic tile classes use raw CSS backgrounds, not Tailwind utilities', () => {
    // A plain bg-white tile would be rewritten to the dark card colour by the
    // .dark [class~="bg-white"] override in index.css, so the tile must be a
    // raw background on the <img> itself, like the existing per-slug rules.
    assert.match(indexCss, /\.brand-logo-image--tile-light\s*\{\s*background: #ffffff;/);
    assert.match(indexCss, /\.brand-logo-image--tile-dark\s*\{\s*background: #111c2f;/);
  });

  test('BrandLogo applies the tone class to the img in container and bare modes', () => {
    assert.match(brandLogo, /getLogoTileTone/);
    assert.match(brandLogo, /brand-logo-image--tile-light/);
    assert.match(brandLogo, /brand-logo-image--tile-dark/);
    // Both <img> branches (bare showContainer={false} and container) carry the
    // computed tileClass in their className.
    const occurrences = (brandLogo.match(/\$\{tileClass\}/g) || []).length;
    assert.ok(occurrences >= 2, `tileClass should appear in both img branches, found ${occurrences}`);
  });

  test('bare logo spots are untouched (contrast is fixed by the tile, not by removing them)', () => {
    const alternatives = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/AiAlternativesShowcase.tsx'),
      'utf8',
    );
    const promptCard = fs.readFileSync(path.resolve(process.cwd(), 'src/components/PromptCard.tsx'), 'utf8');
    assert.match(alternatives, /<BrandLogo[^>]*size="xs" showContainer=\{false\}/);
    assert.match(promptCard, /showContainer=\{false\}/);
  });
});
