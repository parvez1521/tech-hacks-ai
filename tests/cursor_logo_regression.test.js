import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Cursor product resolves to the supplied cube logo throughout the shared brand registry', async () => {
  const registry = await read('../src/data/brandLogos.ts');
  const manifest = JSON.parse(await read('../public/logo-manifest.json'));
  const catalog = await read('../src/data/aiToolsData.ts');
  const svg = await read('../public/logos/cursor.svg');

  assert.match(catalog, /id: 'cursor',[\s\S]*?name: 'Cursor Editor',[\s\S]*?slug: 'cursor'/);
  const registryStart = registry.indexOf('"cursor": {');
  const registryEnd = registry.indexOf('"davinciresolve": {', registryStart);
  assert.ok(registryStart >= 0 && registryEnd > registryStart, 'Cursor has a canonical registry entry');
  const cursorEntry = registry.slice(registryStart, registryEnd);
  assert.match(cursorEntry, /"assetPath": "\/logos\/cursor\.svg"/);
  assert.match(cursorEntry, /"sourceType": "provided"/);
  assert.doesNotMatch(cursorEntry, /cursor\.png|simple-icons\/icons\/cursor\.svg/);

  const publicEntry = manifest.find((entry) => entry.slug === 'cursor');
  assert.ok(publicEntry, 'Cursor is present in the public logo manifest');
  assert.equal(publicEntry.assetPath, '/logos/cursor.svg');
  assert.equal(publicEntry.sourceType, 'provided');
  assert.equal(publicEntry.pngAssetPath, undefined);
  assert.equal(publicEntry.sourceUrl, undefined);

  assert.match(svg, /<title id="cursorTitle">Cursor logo<\/title>/);
  assert.match(svg, /<rect width="447" height="447" fill="#000000"\/>/);
  assert.match(svg, /fill="#FFFFFF"/);
  assert.match(svg, /fill="#000000"/);
  assert.doesNotMatch(svg, /M6 5l12 6-5\.5 1\.5/, 'Old pointer glyph must not return');
});

test('Cursor logo is rendered through the central logo component, not a tool-specific hardcoded icon', async () => {
  const logoComponent = await read('../src/components/BrandLogo.tsx');
  const renderer = await read('../scripts/generate-runtime-logo-manifest.mjs');
  assert.match(logoComponent, /getBrandLogo\(slug\)/);
  assert.match(logoComponent, /logoEntry\?\.assetPath/);
  assert.match(renderer, /sourceRegistryPath/);
  assert.match(renderer, /publicManifestPath/);
});
