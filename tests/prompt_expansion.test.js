import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { promptsData, promptCategories } from '../src/data/promptsData.ts';
import { getAllPrompts } from '../src/services/aiCatalogService.ts';
import { guidesData } from '../src/data/guidesData.ts';
import { validatePromptCategory } from '../server/promptCategoriesStore.js';
import categoryApi from '../api/prompt-categories.js';

test('featured human portraits lead the curated prompt order and preserve useful portrait subcategories', () => {
  const ordered = getAllPrompts();
  assert.deepEqual(ordered.slice(0, 4).map((prompt) => prompt.slug), [
    'portrait-editorial-duo', 'portrait-women-windowlight', 'portrait-mens-professional-headshot', 'portrait-couple-courtyard-dusk',
  ]);
  assert.equal(promptCategories[0].slug, 'human-portraits');
  for (const tag of ['womens-portraits', 'mens-portraits', 'couple-portraits', 'professional-headshots', 'fashion-editorial', 'cinematic-portraits']) {
    assert.ok(promptsData.some((prompt) => prompt.tags.includes(tag)), `missing portrait subcategory ${tag}`);
  }
});

test('prompt engagement and recent sorting have real data sources rather than seeded counters', () => {
  assert.ok(promptsData.every((prompt) => prompt.copyCount === undefined), 'seed catalog must not invent copy totals');
  assert.ok(promptsData.filter((prompt) => prompt.createdAt).every((prompt) => !Number.isNaN(Date.parse(prompt.createdAt))));
  const gallery = fs.readFileSync(path.resolve('src/pages/PromptLibraryPage.tsx'), 'utf8');
  assert.match(gallery, /sourceCreator/);
  assert.match(gallery, /selectedStyle/);
  assert.match(gallery, /selectedAspectRatio/);
  assert.match(gallery, /selectedMediaType/);
  assert.match(gallery, /copyCount/);
  assert.match(gallery, /createdAt/);
  const schema = fs.readFileSync(path.resolve('server/schema.sql'), 'utf8');
  assert.match(schema, /techhacks_record_prompt_copy/);
});

test('video prompt examples distinguish suggested recreations from source prompts and third-party clips', () => {
  const videos = promptsData.filter((prompt) => prompt.mediaType === 'video');
  assert.ok(videos.length >= 3);
  for (const prompt of videos) {
    assert.equal(prompt.promptProvenance, 'suggested-recreation');
    assert.equal(prompt.rightsStatus, 'original');
    assert.equal(prompt.videoDetails?.hostingMethod, 'link-only');
    assert.ok(prompt.videoDetails?.sourcePageUrl?.startsWith('https://'));
    assert.ok(prompt.videoDetails?.previewUrl?.startsWith('/prompts/'));
    assert.ok(!prompt.videoDetails?.videoUrl, 'no unlicensed creator clip is embedded');
  }
});

test('guide steps include matching local media and guide associations resolve to prompt posters', () => {
  const mediaSteps = guidesData.flatMap((guide) => guide.steps.filter((step) => step.media));
  assert.ok(mediaSteps.length >= 5);
  for (const step of mediaSteps) assert.ok(fs.existsSync(path.resolve('public', step.media.src.slice(1))), step.media.src);
  const associated = promptsData.filter((prompt) => prompt.videoDetails?.guideSlugs?.includes('cinematic-ai-video-workflow'));
  assert.ok(associated.length >= 1);
});

test('prompt categories validate and the category API keeps mutation behind moderator authentication', async () => {
  assert.equal(validatePromptCategory({ slug: 'human-portraits', name: 'Human portraits', description: 'Portrait recipes.', displayOrder: 1 }), null);
  assert.match(validatePromptCategory({ slug: '../private', name: 'Invalid', description: '' }), /slug/i);
  const response = { code: 200, headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  const oldUrl = process.env.SUPABASE_URL; const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    await categoryApi({ method: 'GET', query: {}, headers: {} }, response);
    assert.deepEqual(response.body, { configured: false, categories: [] });
    await categoryApi({ method: 'POST', query: {}, headers: {}, body: { category: {} } }, response);
    assert.equal(response.code, 401);
  } finally {
    if (oldUrl !== undefined) process.env.SUPABASE_URL = oldUrl;
    if (oldKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey;
  }
});
