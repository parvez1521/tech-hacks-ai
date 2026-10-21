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
  assert.equal(audit.prompts.length, promptsData.length);
  assert.equal(audit.summary.originalGeneratedImages, promptsData.length);
  assert.equal(audit.summary.missingPromptImages, 0);
  assert.equal(audit.summary.duplicatePromptImages, 0);
  assert.equal(audit.summary.meigenAssetsUsed, false);
  assert.equal(audit.issues.filter((issue) => issue.type.startsWith('missing-prompt')).length, 0);
  for (const image of audit.prompts) {
    assert.equal(image.actualFileType, 'webp', image.slug);
    assert.equal(image.extensionMatchesContent, true, image.slug);
    assert.equal(image.dimensions.width, 1254, image.slug);
    assert.equal(image.dimensions.height, 1254, image.slug);
    assert.ok(image.sizeBytes < 1_500_000, `${image.slug} is optimized for gallery use`);
    assert.match(image.provenance.rightsStatus, /generated for this project/i);
    assert.ok(image.altText.length > 20);
  }
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
    'Black Forest Labs': 'flux-1',
    Runway: 'runway',
    Cursor: 'cursor',
  };
  const expectedFilters = { google: 'googlegemini', anthropic: 'anthropic', higgsfield: 'higgsfield', flux: 'flux-1', runway: 'runway', cursor: 'cursor' };
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
