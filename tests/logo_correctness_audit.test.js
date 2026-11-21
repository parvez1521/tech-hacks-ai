import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { brandLogos, getBrandLogo } from '../src/data/brandLogos.ts';
import { getLogoTileTone } from '../src/data/logoTileTones.ts';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const LOGOS_DIR = path.join(PUBLIC_DIR, 'logos');
const logoManifest = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'logo-manifest.json'), 'utf8'));

function readLogo(assetPath) {
  return fs.readFileSync(path.join(PUBLIC_DIR, assetPath.replace(/^\//, '')), 'utf8');
}

function manifestEntry(slug) {
  return logoManifest.find((entry) => entry.slug === slug);
}

describe('Logo correctness audit 2026-11-21: wrong marks replaced with the real brand mark', () => {
  test('pika shows the official pika.art mark, not the invented pink play glyph', () => {
    const entry = getBrandLogo('pika');
    assert.equal(entry.sourceUrl, 'https://pika.art/icon.svg');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('M7.15608 5.18217'), 'pika.svg must be the official pika.art icon path');
    assert.ok(!svg.includes('#ec4899'), 'pika.svg must not contain the invented pink glyph');
    // The official file carries a prefers-color-scheme rule, but the site themes
    // app-level (html.dark), which an <img> SVG cannot see — so the rule is
    // stripped and the black mark reads on the light tile in both themes.
    assert.ok(!svg.includes('prefers-color-scheme'), 'pika.svg must not rely on the OS colour scheme');
    assert.equal(getLogoTileTone('pika'), 'light', 'pika’s black mark needs the light tile');
  });

  test('claude shows the Claude starburst, not the Anthropic corporate A', () => {
    const entry = getBrandLogo('claude');
    const svg = readLogo(entry.assetPath);
    assert.ok(!svg.includes('<title>Anthropic</title>'), 'claude.svg must not be the Anthropic mark');
    assert.ok(svg.includes('<title>Claude</title>'), 'claude.svg must be the Claude mark');
    assert.ok(svg.includes('#D97757'), 'claude.svg keeps Claude’s official brand colour');
    assert.ok(svg.includes('m4.7144 15.9555'), 'claude.svg must carry the starburst path');
  });

  test('claude-code shows the Claude starburst, not the traced pixel-robot', () => {
    const entry = getBrandLogo('claude-code');
    assert.equal(entry.sourceType, 'simple-icons');
    assert.equal(entry.sourceUrl, 'https://cdn.jsdelivr.net/npm/simple-icons/icons/claude.svg');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('<title>Claude Code</title>'), 'claude-code.svg must be the Claude Code mark');
    assert.ok(svg.includes('m4.7144 15.9555'), 'claude-code.svg must carry the starburst path');
    assert.ok(!svg.includes('M0.0,58.0'), 'claude-code.svg must not contain the pixel-robot path');
  });

  test('adobe shows the current 2020 geometric A from the last Simple Icons version carrying it', () => {
    const entry = getBrandLogo('adobe');
    assert.equal(entry.sourceUrl, 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/adobe.svg');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('M13.966 22.624'), 'adobe.svg must be the 2020 geometric A');
    assert.ok(!svg.includes('#FA0F00'), 'adobe.svg must not be the pre-2020 A');
  });

  test('n8n shows the current node mark in the official brand pink', () => {
    const entry = getBrandLogo('n8n');
    assert.equal(entry.badgeBg, '#FF91AC');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('M4.8 16.8'), 'n8n.svg must be the current node mark');
    assert.ok(svg.includes('#FF91AC'), 'n8n.svg must use the official brand pink');
    assert.ok(!svg.includes('#ea4b71'), 'n8n.svg must not use the old brand pink');
  });

  test('canva shows the Canva script wordmark, not a fabricated gradient C', () => {
    const entry = getBrandLogo('canva');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('<title>Canva</title>'), 'canva.svg must be the Canva wordmark');
    assert.ok(!svg.includes('canva-grad'), 'canva.svg must not contain the fabricated gradient glyph');
    assert.equal(getLogoTileTone('canva'), 'light', 'canva’s black wordmark needs the light tile');
  });

  test('groq shows the official orange bolt from groq.com', () => {
    const entry = getBrandLogo('groq');
    assert.equal(entry.sourceUrl, 'https://groq.com/favicon.svg');
    assert.equal(entry.badgeBg, '#F43E01');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('#F43E01'), 'groq.svg must be the official orange bolt mark');
    assert.ok(!svg.includes('#f43f5e'), 'groq.svg must not be the fabricated pink G');
  });

  test('huggingface shows the real face in official yellow, not a fabricated smiley', () => {
    const entry = getBrandLogo('huggingface');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('#FFD21E'), 'huggingface.svg must use the official yellow');
    assert.ok(svg.includes('M12.025 1.13'), 'huggingface.svg must carry the real face path');
    assert.ok(!svg.includes('<!-- Eyes -->'), 'huggingface.svg must not be the hand-drawn smiley');
  });

  test('ideogram shows the official brain mark from ideogram.ai', () => {
    const entry = getBrandLogo('ideogram');
    assert.equal(entry.sourceUrl, 'https://ideogram.ai/favicon.svg?v=new-brand-20261020');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('#232425'), 'ideogram.svg must be the official dark mark');
    assert.ok(!svg.includes('<rect x="10" y="5" width="4" height="14"'), 'ideogram.svg must not be the fabricated i-bar');
  });

  test('jetbrains shows the Simple Icons mark, not fabricated parallelograms', () => {
    const entry = getBrandLogo('jetbrains');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('M2.345 23.997'), 'jetbrains.svg must be the JetBrains mark');
    assert.ok(!svg.includes('#F43F5E') && !svg.includes('#38BDF8'), 'jetbrains.svg must not contain the fabricated parallelograms');
    assert.equal(getLogoTileTone('jetbrains'), 'light', 'jetbrains’ black mark needs the light tile');
  });

  test('suno shows Suno’s own wordmark, not Billboard’s logo', () => {
    const entry = getBrandLogo('suno');
    assert.equal(entry.sourceUrl, 'https://cdn-o.suno.com/Logo-7.svg');
    assert.equal(entry.assetPath, '/logos/official-ai/suno.svg');
    const svg = readLogo(entry.assetPath);
    assert.ok(!svg.includes('clip0_274_4048'), 'suno.svg must not be the Billboard wordmark');
    assert.ok(svg.includes('viewBox="0 0 607 149"'), 'suno.svg must be Suno’s wordmark asset');
  });

  test('luma resolves to the Luma event platform’s own domain, not Luma Labs', () => {
    const entry = getBrandLogo('luma');
    assert.equal(entry.name, 'Luma');
    assert.ok(entry.sourceUrl.includes('domain=luma.com'), 'luma must use the luma.com favicon');
    assert.ok(!entry.sourceUrl.includes('lumalabs.ai'), 'luma must not borrow the Dream Machine favicon');
  });

  test('codev shows the official co.dev mark, not the opaque white favicon', () => {
    const entry = getBrandLogo('codev');
    assert.equal(entry.sourceType, 'official');
    assert.equal(entry.assetPath, '/logos/codev.svg');
    assert.equal(entry.sourceUrl, 'https://co.dev/codev-mark.svg');
    const svg = readLogo(entry.assetPath);
    assert.ok(svg.includes('viewBox="0 0 196 110"'), 'codev.svg must be the official co.dev mark');
    assert.equal(getLogoTileTone('codev'), 'dark', 'codev’s white mark needs the dark tile');
  });

  test('aws serves the verified AWS mark through the canonical entry', () => {
    const entry = getBrandLogo('aws');
    assert.equal(entry.assetPath, '/logos/aws.svg');
    assert.equal(entry.sourceType, 'simple-icons');
    assert.equal(entry.sourceUrl, 'https://cdn.jsdelivr.net/npm/simple-icons/icons/amazonaws.svg');
    // The canonical aws file now holds the verified Simple Icons mark
    // (byte-identical to amazonaws.svg); the old unverified variant is gone.
    assert.equal(readLogo('/logos/aws.svg'), readLogo('/logos/amazonaws.svg'));
    assert.equal(getBrandLogo('amazonaws').slug, 'aws', 'amazonaws alias still resolves to the canonical aws entry');
    assert.equal(getLogoTileTone('aws'), 'light', 'aws’ black mark needs the light tile');
  });

  test('registry parity holds for every corrected entry', () => {
    for (const slug of ['pika', 'claude', 'claude-code', 'adobe', 'n8n', 'canva', 'groq', 'huggingface', 'ideogram', 'jetbrains', 'suno', 'luma', 'codev', 'aws']) {
      assert.deepEqual(brandLogos[slug], manifestEntry(slug), `${slug} must match in both registries`);
      assert.ok(fs.existsSync(path.join(PUBLIC_DIR, brandLogos[slug].assetPath.replace(/^\//, ''))), `${slug} asset must exist on disk`);
    }
  });
});
