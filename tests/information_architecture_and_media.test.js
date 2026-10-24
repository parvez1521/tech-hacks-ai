import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { freeToolsData } from '../src/data/freeToolsData.ts';
import { utilityCategoryDefinitions, getUtilityCategory } from '../src/data/catalogTaxonomy.ts';
import { filterAndSortAiTools, getAllAiTools, getAllCommunityTools, registerPublishedTool } from '../src/services/aiCatalogService.ts';
import { parseInstagramUrl, parseYoutubeUrl } from '../src/services/mediaWorkflowService.ts';

describe('Canonical catalog sections and expanded media utilities', () => {
  test('utility records have unique stable identities and non-empty canonical categories', () => {
    assert.equal(new Set(freeToolsData.map((tool) => tool.slug)).size, freeToolsData.length);
    const categories = new Set(utilityCategoryDefinitions.map((category) => category.id));
    freeToolsData.forEach((tool) => assert.ok(categories.has(getUtilityCategory(tool)), `${tool.slug} needs a canonical utility category`));
  });

  test('AI and community records remain separate in catalog filters', () => {
    const slug = 'community-separation-fixture';
    registerPublishedTool({
      id: slug,
      slug,
      name: 'Community Separation Fixture',
      tagline: 'A fixture for section boundaries',
      description: 'A community fixture used to prove that section filters remain separate.',
      websiteUrl: 'https://community-fixture.example',
      category: 'assistants',
      pricingType: 'free',
      pricingDetails: 'Free',
      iconLetter: 'C',
      iconBgColor: '#000000',
      features: [],
      tags: ['community-verified'],
      hasFreePlan: true,
      freeAccessType: 'recurring-free',
      freeTierSummary: 'Fixture',
      freeTierLimits: 'Fixture',
      requiresAccount: false,
      pricingSourceUrl: 'https://community-fixture.example',
      pricingVerifiedAt: '2026-10-21',
      section: 'community',
    });
    assert.ok(getAllCommunityTools().some((tool) => tool.slug === slug));
    assert.equal(getAllAiTools().some((tool) => tool.slug === slug), false);
    const result = filterAndSortAiTools({ searchQuery: 'Community Separation Fixture', category: null, pricingType: 'all', sortBy: 'popular', page: 1 });
    assert.equal(result.tools.some((tool) => tool.slug === slug), false);
  });

  test('legacy community URLs redirect and utility routes retain their distinct route identity', async () => {
    const { matchRoute } = await import('../dist/test-ssr.js');
    assert.deepEqual(matchRoute('/community-tools'), { route: 'community-redirect', params: {} });
    assert.deepEqual(matchRoute('/community'), { route: 'community-redirect', params: {} });
    assert.deepEqual(matchRoute('/community-tools/example'), { route: 'community-redirect', params: { slug: 'example' } });
    assert.deepEqual(matchRoute('/free-tools/mp4-to-mp3'), { route: 'free-tool-detail', params: { slug: 'mp4-to-mp3' } });
  });

  test('media URL helpers validate and normalize only supported public URL shapes', () => {
    assert.deepEqual(parseYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), { videoId: 'dQw4w9WgXcQ', normalizedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    assert.deepEqual(parseYoutubeUrl('https://youtu.be/dQw4w9WgXcQ'), { videoId: 'dQw4w9WgXcQ', normalizedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    assert.deepEqual(parseYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123'), { videoId: 'dQw4w9WgXcQ', normalizedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }, 'Playlist URL is treated as its selected video, not a playlist job');
    assert.deepEqual(parseYoutubeUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ/'), { videoId: 'dQw4w9WgXcQ', normalizedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    assert.deepEqual(parseYoutubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ'), { videoId: 'dQw4w9WgXcQ', normalizedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    assert.throws(() => parseYoutubeUrl('https://example.com/watch?v=dQw4w9WgXcQ'), /youtube.com/);
    assert.throws(() => parseYoutubeUrl('ftp://www.youtube.com/watch?v=dQw4w9WgXcQ'), /HTTPS/);
    assert.throws(() => parseYoutubeUrl('https://youtu.be/dQw4w9WgXcQ/extra'), /one video ID/);
    assert.throws(() => parseYoutubeUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ/comments'), /supported 11-character/);
    assert.deepEqual(parseInstagramUrl('https://www.instagram.com/reel/ABC_123/').kind, 'reel');
    assert.deepEqual(parseInstagramUrl('https://www.instagram.com/ReEl/ABC_123/').kind, 'reel');
    assert.throws(() => parseInstagramUrl('https://instagram.com/accounts/login/'), /Supported links/);
    assert.throws(() => parseInstagramUrl('http://www.instagram.com/reel/ABC_123/'), /HTTPS/);
    assert.throws(() => parseInstagramUrl('https://www.instagram.com/reel/ABC_123/comments/'), /one supported/);
  });

  test('media runners disclose supported limitations and real processing boundaries', () => {
    const media = fs.readFileSync(path.resolve(process.cwd(), 'src/components/utilities/UtilityMediaTools.tsx'), 'utf8');
    const api = fs.readFileSync(path.resolve(process.cwd(), 'api/transcribe.js'), 'utf8');
    assert.match(media, /FFmpeg WebAssembly runtime/);
    assert.match(media, /does not download YouTube videos/);
    assert.match(media, /does not scrape Instagram/);
    assert.match(api, /OPENAI_API_KEY/);
    assert.match(api, /4 \* 1024 \* 1024/);
    assert.match(api, /ALLOWED_PROVIDER_HOSTS/);
    assert.match(media, /Auto-detect is recommended for Hindi-English mixed speech/);
    assert.match(media, /up to 4 MB per server upload/);
  });

  test('media catalog keeps server transcription and local conversion limits distinct', () => {
    const transcriber = freeToolsData.find((tool) => tool.slug === 'video-audio-transcriber');
    const converter = freeToolsData.find((tool) => tool.slug === 'mp4-to-mp3');
    assert.match(transcriber?.acceptedInput || '', /4 MB per server upload/);
    assert.match(converter?.acceptedInput || '', /100MB/);
  });
});
