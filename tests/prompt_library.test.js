import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { promptsData } from '../src/data/promptsData.ts';
import { promptArtwork } from '../src/data/promptArtwork.ts';
import { validatePrompt, listPrompts } from '../server/promptsStore.js';
import promptApi from '../api/prompts.js';
import promptSubmissionApi from '../api/prompt-submissions.js';
import { createPromptDraft } from '../server/promptsStore.js';

test('prompt library recipes have usable metadata and unique original local previews', () => {
  assert.ok(promptsData.length > 0);
  const mapped = promptsData.map((prompt) => promptArtwork[prompt.slug]);
  assert.ok(mapped.every(Boolean), 'each prompt has a slug-specific artwork record');
  assert.equal(new Set(mapped.map((item) => item.path)).size, promptsData.length, 'every prompt has its own preview path');
  const source = fs.readFileSync(path.resolve('src/services/aiCatalogService.ts'), 'utf8');
  assert.match(source, /function inferPromptStyle/);
  assert.match(source, /function inferPromptAspectRatio/);
  for (const item of mapped) {
    const filePath = path.resolve('public', item.path.replace(/^\//, ''));
    assert.ok(fs.existsSync(filePath), `${item.path} exists`);
    assert.ok(item.alt.length >= 20, `${item.path} has meaningful alt text`);
  }
  assert.ok(promptsData.every((prompt) => prompt.promptText && prompt.tags.length && prompt.targetModel));
});

test('PromptFeed MIT collection has 534 unique matching local previews and full attribution', () => {
  const manifestPath = path.resolve('data/promptfeed-import.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const feed = Array.isArray(manifest) ? manifest : manifest.prompts;
  assert.ok(Array.isArray(feed), 'PromptFeed manifest must be a prompt array');
  assert.equal(feed.length, 534, 'expected the checked-in 534-pair PromptFeed collection');
  assert.equal(new Set(feed.map((prompt) => prompt.slug)).size, feed.length, 'PromptFeed slugs must be unique');

  for (const prompt of feed) {
    assert.ok(prompt.slug.startsWith('promptfeed-'), prompt.slug);
    assert.ok(prompt.promptText?.trim(), `${prompt.slug} has prompt text`);
    assert.ok(prompt.previewImage?.startsWith('/prompts/promptfeed/'), `${prompt.slug} has a local PromptFeed preview`);
    assert.ok(fs.existsSync(path.resolve('public', prompt.previewImage.slice(1)), prompt.previewImage), `${prompt.slug} preview exists`);
    assert.equal(prompt.rightsStatus, 'licensed', prompt.slug);
    assert.equal(prompt.rightsConfirmed, true, prompt.slug);
    assert.match(prompt.rightsLicense || '', /MIT/i, `${prompt.slug} keeps its MIT license`);
    assert.ok(prompt.sourceCreator && prompt.sourceUrl?.startsWith('https://') && prompt.attributionUrl?.startsWith('https://'), `${prompt.slug} has source attribution`);
  }
});

test('PromptFeed collection is lazy-loaded, attributable, and pagination keeps the gallery lightweight', () => {
  const loader = fs.readFileSync(path.resolve('src/data/promptfeedPrompts.ts'), 'utf8');
  const gallery = fs.readFileSync(path.resolve('src/pages/PromptLibraryPage.tsx'), 'utf8');
  const card = fs.readFileSync(path.resolve('src/components/PromptCard.tsx'), 'utf8');
  const sitemap = fs.readFileSync(path.resolve('scripts/generate-prompt-sitemap.mjs'), 'utf8');
  assert.match(loader, /import\('\.\.\/\.\.\/data\/promptfeed-import\.json'\)/);
  assert.match(loader, /rightsStatus !== 'licensed'/);
  assert.match(gallery, /loadPromptFeedPrompts/);
  assert.match(gallery, /selectedCollection/);
  assert.match(gallery, /PROMPTS_PER_PAGE = 24/);
  assert.match(gallery, /visiblePrompts\.map/);
  assert.match(card, /PromptFeed · MIT/);
  assert.doesNotMatch(gallery, /MeiGen/);
  assert.match(sitemap, /promptFeedPrompts/);
});

test('prompt storage rejects missing attribution and invalid image locations', () => {
  const good = { id: 'original-1', slug: 'original-one', title: 'Original one', description: 'Description', category: 'ai-image-generation', targetModel: 'Flux', promptText: 'An original image recipe.', tags: ['editorial'], authorOrSource: 'SwitchRoute', previewImage: '/prompts/generated/gemini-commercial-product-photography.webp', rightsStatus: 'original' };
  assert.equal(validatePrompt(good), null);
  assert.match(validatePrompt({ ...good, authorOrSource: '' }), /attribution/i);
  assert.match(validatePrompt({ ...good, previewImage: 'http://unsafe.test/preview.jpg' }), /HTTPS/);
  assert.match(validatePrompt({ ...good, previewImage: '' }), /image is required/i);
  assert.match(validatePrompt({ ...good, previewImage: '/prompts/../../index.html' }), /stay inside/i);
  assert.match(validatePrompt({ ...good, previewImage: 'https://creator.example/image.jpg', rightsStatus: 'original', sourceCreator: 'Creator' }), /explicit rights confirmation/i);
  assert.equal(validatePrompt({ ...good, previewImage: 'https://creator.example/image.jpg', rightsStatus: 'original', rightsConfirmed: true, sourceCreator: 'Creator' }), null);
  assert.match(validatePrompt({ ...good, previewImage: 'https://creator.example/image.jpg', rightsStatus: 'licensed', sourceCreator: 'Creator' }), /source URL and license or permission/i);
});

test('prompt read path degrades cleanly when Supabase is not configured', async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try { assert.deepEqual(await listPrompts(), { configured: false, prompts: [] }); }
  finally {
    if (url !== undefined) process.env.SUPABASE_URL = url;
    if (key !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = key;
  }
});

test('prompt mutations are restricted to the existing moderator authentication', async () => {
  const originalSecret = process.env.ADMIN_SECRET;
  process.env.ADMIN_SECRET = 'test-only-secret';
  const response = { code: 200, headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  try {
    await promptApi({ method: 'POST', url: '/api/prompts', headers: {}, body: { prompt: {} } }, response);
    assert.equal(response.code, 401);
    assert.match(response.body.error, /Unauthorized/);
  } finally {
    if (originalSecret === undefined) delete process.env.ADMIN_SECRET;
    else process.env.ADMIN_SECRET = originalSecret;
  }
});

test('prompt gallery and detail routes remain discoverable', () => {
  const router = fs.readFileSync(path.resolve('src/router/Router.tsx'), 'utf8');
  assert.match(router, /cleanPath === '\/prompt-library'/);
  assert.match(router, /promptsMatch = cleanPath\.match/);
  assert.match(router, /cleanPath === '\/submit-prompt'/);
  const sitemap = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/prompt-library\/gemini-commercial-product-photography/);
});

test('public prompt submissions are validated and always written as drafts', async () => {
  const oldUrl = process.env.SUPABASE_URL; const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY; const originalFetch = global.fetch;
  process.env.SUPABASE_URL = 'https://supabase.example'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-only-test-key';
  let submittedRow;
  global.fetch = async (_url, init = {}) => {
    submittedRow = JSON.parse(init.body);
    assert.equal(init.method, 'POST');
    assert.equal(init.headers.Prefer, 'return=representation');
    return new Response(JSON.stringify([{ ...submittedRow, created_at: '2026-10-22T00:00:00Z' }]), { status: 201 });
  };
  const response = { code: 200, headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  try {
    await promptSubmissionApi({ method: 'POST', url: '/api/prompt-submissions', headers: { 'x-vercel-forwarded-for': '203.0.113.5' }, body: { title: 'Original portrait study', promptText: 'A detailed original photographic prompt with light, framing, texture, subject, and background guidance.', category: 'human-portraits', targetModel: 'FLUX.1', provider: 'Black Forest Labs', tags: ['portrait'], previewImage: '/prompts/generated/portrait-editorial-duo.webp', sourceCreator: 'Creator', rightsStatus: 'original', rightsConfirmed: true } }, response);
    assert.equal(response.code, 201);
    assert.equal(submittedRow.status, 'draft');
    assert.equal(response.body.status, 'draft');
    assert.equal(submittedRow.content.status, 'draft');
    assert.equal(submittedRow.content.promptText.startsWith('A detailed'), true);
  } finally {
    global.fetch = originalFetch;
    if (oldUrl !== undefined) process.env.SUPABASE_URL = oldUrl; else delete process.env.SUPABASE_URL;
    if (oldKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey; else delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test('failed Faymas authorization gate prevents any import attempt', async () => {
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/import-faymas-prompts.mjs', '/tmp/nonexistent-faymas-export.json'], { cwd: process.cwd(), env: { ...process.env, FAYMAS_IMPORT_AUTHORIZED: 'false' }, encoding: 'utf8' });
  assert.equal(result.status, 3);
  assert.match(result.stderr, /import is disabled/i);
});
