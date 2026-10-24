import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildAudit, inspectImage } from '../scripts/audit-prompt-assets.mjs';
import { promptsData, promptProviders } from '../src/data/promptsData.ts';
import { getPromptProviderLogoSlug } from '../src/data/promptProviderLogos.ts';
import { getBrandLogo } from '../src/data/brandLogos.ts';

test('prompt artwork audit validates all distinct generated WebP images and provenance', async () => {
  const audit = await buildAudit();
  assert.equal(audit.summary.originalGeneratedImages, promptsData.length);
  assert.equal(audit.summary.licensedPromptFeedImages, 534);
  assert.equal(audit.summary.uniqueUsablePromptCount, 582);
  assert.equal(audit.summary.missingPromptImages, 0);
  assert.equal(audit.summary.duplicatePromptRecords, 0);
  assert.equal(audit.summary.duplicatePromptImages, 0);
  assert.equal(audit.summary.meigenAssetsUsed, false);
  assert.equal(audit.issues.filter((issue) => issue.type.startsWith('missing-prompt')).length, 0);
  for (const image of audit.prompts.filter((record) => record.provenance.sourceType === 'original-ai-generated')) {
    assert.equal(image.actualFileType, 'webp', image.slug);
    assert.equal(image.extensionMatchesContent, true, image.slug);
    assert.ok(image.dimensions.width >= 900, `${image.slug} width is high enough for a responsive preview`);
    assert.ok(image.dimensions.height >= 900, `${image.slug} height is high enough for a responsive preview`);
    assert.ok(image.sizeBytes < 1_500_000, `${image.slug} is optimized for gallery use`);
    assert.match(image.provenance.rightsStatus, /generated for this project/i);
    assert.ok(image.altText.length > 20);
  }
  assert.equal(audit.summary.imagesFlaggedForDetailResolutionReview, 0, 'prompt previews are at least as large as their maximum rendered detail width');
  assert.ok(audit.promptAssetInventory.length >= 582);
  assert.equal(audit.prompts.filter((record) => !record.imageAvailable).length, 0);
});

test('image inspection rejects extension-only claims and reads actual file signatures', () => {
  const pngHeader = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(pngHeader, 0);
  pngHeader.writeUInt32BE(640, 16);
  pngHeader.writeUInt32BE(480, 20);
  assert.deepEqual(inspectImage(pngHeader, '.svg'), { format: 'png', width: 640, height: 480 });
});

test('every prompt provider and model resolves through explicit canonical logo mappings', () => {
  const expected = {
    Google: 'googlegemini',
    Anthropic: 'anthropic',
    Higgsfield: 'higgsfield',
    PixVerse: 'pixverse',
    'Black Forest Labs': 'flux-1',
    Runway: 'runway',
    Cursor: 'cursor',
  };
  const expectedFilters = { google: 'googlegemini', anthropic: 'anthropic', higgsfield: 'higgsfield', pixverse: 'pixverse', kling: 'kling-ai', flux: 'flux-1', runway: 'runway', cursor: 'cursor' };
  for (const prompt of promptsData) {
    const slug = getPromptProviderLogoSlug(prompt.provider, prompt.targetModel);
    assert.equal(slug, expected[prompt.provider], `${prompt.slug} provider ${prompt.provider}`);
    assert.ok(getBrandLogo(slug), `${prompt.slug} resolves to a canonical logo registry entry`);
  }
  for (const provider of promptProviders.filter((item) => item.filterValue)) {
    assert.equal(getPromptProviderLogoSlug(provider.name), expectedFilters[provider.filterValue], provider.name);
  }
  assert.equal(getBrandLogo('higgsfield').sourceUrl, 'https://higgsfield.ai/icon.png');
  assert.equal(getBrandLogo('flux-1').sourceUrl, 'https://bfl.ai/brand/symbol-black.svg');
  assert.equal(getBrandLogo('cursor').sourceType, 'simple-icons');
});

test('failed or missing preview sources use a clear accessible fallback', () => {
  const source = fs.readFileSync(path.resolve('src/components/PromptPreviewImage.tsx'), 'utf8');
  assert.match(source, /Preview unavailable/);
  assert.match(source, /role="img"/);
  assert.match(source, /aria-label=\{alt \|\| 'Preview unavailable'\}/);
  assert.match(source, /setFailedSrc\(src\)/);
});

test('licensed PromptFeed detail images are not stretched beyond their native thumbnail width', () => {
  const detail = fs.readFileSync(path.resolve('src/pages/PromptDetailPage.tsx'), 'utf8');
  assert.match(detail, /slug\.startsWith\('promptfeed-'\)[\s\S]*?max-w-\[380px\]/);
  assert.match(detail, /<PromptPreviewImage[\s\S]*?priority/);
});

test('preview dimensions match the local assets and landscape cards retain a wide crop on mobile', async () => {
  const dimensions = JSON.parse(fs.readFileSync(path.resolve('data/prompt-image-dimensions.json'), 'utf8'));
  const feed = JSON.parse(fs.readFileSync(path.resolve('data/promptfeed-import.json'), 'utf8'));
  const landscape = feed.filter((prompt) => dimensions[prompt.slug]?.width / dimensions[prompt.slug]?.height > 1.2);
  assert.equal(landscape.length, 44);
  assert.ok(landscape.every((prompt) => dimensions[prompt.slug].width === 380 && dimensions[prompt.slug].height === 254));
  const component = fs.readFileSync(path.resolve('src/components/PromptPreviewImage.tsx'), 'utf8');
  const cards = fs.readFileSync(path.resolve('src/components/PromptCard.tsx'), 'utf8');
  const css = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
  assert.doesNotMatch(component, /width="1254"|height="1254"/);
  assert.match(cards, /previewImageWidth[\s\S]*?prompt-card__image--landscape/);
  assert.match(css, /\.prompt-card__image--landscape\s*\{\s*aspect-ratio:\s*3\s*\/\s*2/s);
});
