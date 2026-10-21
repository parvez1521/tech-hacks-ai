import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { promptsData } from '../src/data/promptsData.ts';
import { validatePrompt, listPrompts } from '../server/promptsStore.js';
import promptApi from '../api/prompts.js';

test('prompt library recipes have usable metadata and original local preview artwork', () => {
  assert.ok(promptsData.length > 0);
  const source = fs.readFileSync(path.resolve('src/services/aiCatalogService.ts'), 'utf8');
  assert.match(source, /function getPromptArtwork/);
  assert.match(source, /function inferPromptStyle/);
  assert.match(source, /function inferPromptAspectRatio/);
  for (const image of ['product-studio.svg', 'cinematic-frame.svg', 'character-study.svg', 'editorial-layout.svg', 'digital-garden.svg']) {
    assert.ok(fs.existsSync(path.resolve('public/prompts', image)), `${image} exists`);
  }
  assert.ok(promptsData.every((prompt) => prompt.promptText && prompt.tags.length && prompt.targetModel));
});

test('prompt storage rejects missing attribution and invalid image locations', () => {
  const good = { id: 'original-1', slug: 'original-one', title: 'Original one', description: 'Description', category: 'ai-image-generation', targetModel: 'Flux', promptText: 'An original image recipe.', tags: ['editorial'], authorOrSource: 'Tech Hacks AI', previewImage: '/prompts/digital-garden.svg' };
  assert.equal(validatePrompt(good), null);
  assert.match(validatePrompt({ ...good, authorOrSource: '' }), /attribution/i);
  assert.match(validatePrompt({ ...good, previewImage: 'http://unsafe.test/preview.jpg' }), /HTTPS/);
  assert.match(validatePrompt({ ...good, previewImage: '' }), /image is required/i);
  assert.match(validatePrompt({ ...good, previewImage: '/prompts/../../index.html' }), /stay inside/i);
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
  const sitemap = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/prompt-library\/gemini-commercial-product-photography/);
});
