import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { offersData, isOfferActive } from '../src/data/offersData.ts';
import { getCatalogStats } from '../src/services/aiCatalogService.ts';

const entries = JSON.parse(await readFile(new URL('../public/video-inspiration.json', import.meta.url), 'utf8'));

test('curated video inspiration has distinct, attributed source entries', () => {
  assert.equal(entries.length, 25);
  assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length);
  assert.equal(entries.filter((entry) => entry.contentType === 'video-example').length, 21);
  assert.equal(entries.filter((entry) => entry.contentType === 'tutorial-template').length, 4);
  for (const entry of entries) {
    assert.match(entry.sourceUrl, /^https:\/\//, entry.id);
    assert.ok(entry.sourceName && entry.creator && entry.checkedAt, entry.id);
    assert.notEqual(entry.embedStatus, 'confirmed', entry.id);
    assert.equal('embedUrl' in entry, false, entry.id);
    assert.equal('videoUrl' in entry, false, entry.id);
  }
});

test('video inspiration is loaded only by the Prompt Library and links out safely', async () => {
  const [page, component, home] = await Promise.all([
    readFile(new URL('../src/pages/PromptLibraryPage.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/VideoInspirationSection.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf8'),
  ]);
  assert.match(page, /<VideoInspirationSection\s*\/>/);
  assert.match(component, /fetch\('\/video-inspiration\.json'\)/);
  assert.match(component, /target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(component, /<iframe|<video(?:\s|>)/);
  assert.doesNotMatch(home, /video-inspiration\.json|VideoInspirationSection/);
  assert.ok(['Another AI tool?', 'Sure.', 'Another Subscription?', 'Nope.'].every((line) => home.includes(line)));
  assert.match(home, /hero-redesign__headline-line/);
  assert.match(home, /catalogStats\.alternativeRelationships/);
  assert.match(home, /activeOfferCount/);
});

test('homepage catalog metrics match distinct source registry counts', () => {
  const stats = getCatalogStats();
  assert.deepEqual({
    aiPlatforms: stats.aiPlatforms,
    openSourceTools: stats.openSourceTools,
    alternativeTargets: stats.alternativeTargets,
    alternativeRelationships: stats.alternativeRelationships,
    browserUtilities: stats.browserUtilities,
    uniquePrompts: stats.uniquePrompts,
    imagePrompts: stats.imagePrompts,
    videoPrompts: stats.videoPrompts,
  }, {
    aiPlatforms: 75,
    openSourceTools: 27,
    alternativeTargets: 25,
    alternativeRelationships: 224,
    browserUtilities: 39,
    uniquePrompts: 582,
    imagePrompts: 548,
    videoPrompts: 12,
  });
});

test('offer audit separates active, pending, expired, and undated records', () => {
  const asOf = new Date('2026-10-24T12:00:00Z');
  const active = offersData.filter((offer) => isOfferActive(offer, asOf));
  const pending = offersData.filter((offer) => offer.verificationStatus === 'pending-verification');
  const expired = offersData.filter((offer) => ['expired', 'archived-expired'].includes(offer.verificationStatus));
  assert.equal(offersData.length, 31);
  assert.equal(new Set(offersData.map((offer) => offer.slug)).size, 31);
  assert.equal(active.length, 30);
  assert.equal(pending.length, 1);
  assert.equal(expired.length, 0);
  assert.equal(active.filter((offer) => !offer.validUntil).length, 29);
  assert.equal(offersData.filter((offer) => offer.validUntil && Number.isNaN(Date.parse(offer.validUntil))).length, 0);
  for (const field of ['claimUrl', 'officialTermsUrl']) {
    const values = offersData.map((offer) => offer[field]).filter(Boolean);
    assert.equal(new Set(values).size, values.length, `duplicate ${field}`);
  }
  const runway = offersData.find((offer) => offer.slug === 'runway-student-educator-discount');
  assert.ok(runway);
  assert.equal(runway.discountValue, '25%');
  assert.equal(runway.claimUrl, 'https://runway.com/educators');
  assert.equal(runway.officialTermsUrl, 'https://help.runwayml.com/hc/en-us/articles/48154114602259-Student-and-Educator-Discounts');
});
