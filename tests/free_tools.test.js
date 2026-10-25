import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { freeToolsData } from '../src/data/freeToolsData.ts';
import { getAllFreeTools, getCatalogStats, getFreeToolBySlug } from '../src/services/aiCatalogService.ts';
import { everydayUtilityOrder, utilityCategoryDefinitions } from '../src/data/catalogTaxonomy.ts';
import { createQrMatrix } from '../src/lib/utilities/qr.ts';
import { createLatestRequestGate } from '../src/lib/utilities/requestGate.ts';
import { getAnimatedCountValue, formatCount, formatMilestoneCount } from '../src/lib/counter.ts';

describe('Built-in browser utility registry', () => {
  test('contains at least 20 new distinct utilities with unique IDs and slugs', () => {
    assert.ok(freeToolsData.length >= 30, `Expected at least 30 utilities, found ${freeToolsData.length}`);
    assert.equal(new Set(freeToolsData.map((tool) => tool.id)).size, freeToolsData.length, 'Utility IDs must be unique');
    assert.equal(new Set(freeToolsData.map((tool) => tool.slug)).size, freeToolsData.length, 'Utility slugs must be unique');
  });

  test('new utilities are discoverable through the real lookup service', () => {
    const expected = [
      'heic-to-png', 'text-diff', 'slug-generator', 'markdown-table-builder', 'unicode-inspector',
      'html-entity-codec', 'csv-json-converter', 'json-to-typescript', 'regex-tester',
      'url-query-builder', 'css-specificity', 'css-gradient', 'jwt-decoder', 'uuid-tool',
      'password-generator', 'text-hash', 'file-checksum', 'timestamp-converter',
      'viewport-inspector', 'mime-sniffer', 'file-metadata', 'image-cropper',
      'image-palette', 'favicon-generator', 'svg-optimizer', 'audio-metadata',
      'video-metadata', 'audio-trimmer', 'youtube-metadata', 'video-audio-transcriber',
      'mp4-to-mp3', 'youtube-video-downloader', 'instagram-video-downloader',
    ];
    expected.forEach((slug) => assert.ok(getFreeToolBySlug(slug), `${slug} must be registered`));
  });

  test('everyday utility priorities lead the listing without duplicating routes', () => {
    const tools = getAllFreeTools();
    assert.equal(utilityCategoryDefinitions[0].id, 'image-graphics');
    assert.deepEqual(tools.slice(0, everydayUtilityOrder.length).map((tool) => tool.slug), everydayUtilityOrder);
    assert.equal(new Set(tools.map((tool) => tool.slug)).size, freeToolsData.length);
    everydayUtilityOrder.forEach((slug) => assert.ok(getFreeToolBySlug(slug), `${slug} retains its detail route`));
  });

  test('every registered utility has a real runner case and no generic success placeholder', () => {
    const runner = fs.readFileSync(path.resolve(process.cwd(), 'src/components/utilities/UtilityRunner.tsx'), 'utf8');
    freeToolsData.forEach((tool) => assert.ok(runner.includes(`case '${tool.slug}'`), `${tool.slug} must have a runner case`));
    assert.ok(!runner.includes('Client-side execution verified'), 'Unimplemented tools must not claim verified execution');
  });

  test('QR encoder creates real version 1/2 matrices and rejects oversized payloads', () => {
    const matrix = createQrMatrix('https://example.com');
    assert.ok(matrix.length === 21 || matrix.length === 25, 'QR uses a supported QR matrix size');
    assert.equal(matrix.length, matrix[0].length, 'QR matrix is square');
    assert.throws(() => createQrMatrix('x'.repeat(40)), /32 UTF-8 bytes/);
    assert.throws(() => createQrMatrix(''), /Enter text/);
  });

  test('latest-request gate prevents stale asynchronous outputs from replacing current results', () => {
    const gate = createLatestRequestGate();
    const olderRequest = gate.begin();
    const currentRequest = gate.begin();
    assert.equal(gate.isCurrent(olderRequest), false);
    assert.equal(gate.isCurrent(currentRequest), true);
    gate.cancel(currentRequest);
    assert.equal(gate.isCurrent(currentRequest), false);
  });

  test('Catalog stats are de-duplicated and include the expanded utility count', () => {
    const stats = getCatalogStats();
    assert.deepEqual(stats, {
      catalogIdentities: 121,
      openSourceTools: 27,
      aiPlatforms: 75,
      alternativeTargets: 25,
      browserUtilities: 39,
      alternativeRelationships: 224,
      uniquePrompts: 582,
      proprietaryToolsWithAlternatives: 25,
      imagePrompts: 548,
      videoPrompts: 12,
      nonVisualPrompts: 22,
    });
  });

  test('homepage counter resolves to truthful final values and skips animation for reduced motion', () => {
    assert.equal(getAnimatedCountValue(104, 1), 104);
    assert.equal(getAnimatedCountValue(104, 0.5), 91);
    assert.equal(getAnimatedCountValue(104, 0, true), 104);
    assert.equal(formatCount(1042), '1,042');
    assert.equal(formatMilestoneCount(999), '999');
    assert.equal(formatMilestoneCount(1000), '1,000+');
    assert.equal(formatMilestoneCount(1250), '1,000+');
  });
});
