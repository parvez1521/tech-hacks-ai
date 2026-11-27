// Cloudflare Pages Functions tests.
//
// Exercises the ported API routes (functions/api/*) through their real
// `onRequest(context)` entry points with real Fetch `Request` objects —
// the same path Cloudflare invokes. No network is used except where a test
// explicitly mocks `globalThis.fetch`.
//
// Env hygiene: each test sets only the env vars it needs on `process.env`
// (the Functions read env via functions/_lib/env.js, which merges
// `process.env` with the bound `context.env`). `beforeEach` clears every
// var these tests touch; `afterEach` restores the pre-test values.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { onRequest as contactOnRequest } from '../functions/api/contact.js';
import { onRequest as submissionsOnRequest } from '../functions/api/submissions.js';
import { onRequest as promptsOnRequest } from '../functions/api/prompts.js';
import { onRequest as promptCategoriesOnRequest } from '../functions/api/prompt-categories.js';
import { onRequest as promptSubmissionsOnRequest } from '../functions/api/prompt-submissions.js';
import { onRequest as discoveriesOnRequest } from '../functions/api/discoveries.js';
import { onRequest as githubProjectsOnRequest } from '../functions/api/github-projects.js';
import { onRequest as promptStatsOnRequest } from '../functions/api/prompt-stats.js';
import { onRequest as chatOnRequest } from '../functions/api/chat.js';
import { onRequest as transcribeOnRequest } from '../functions/api/transcribe.js';
import { getStorageMode } from '../functions/_lib/storageAdapter.js';
import bundledDiscoveries from '../functions/_lib/bundledDiscoveries.js';

const ENV_KEYS = [
  'SUPABASE_URL',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'ADMIN_SECRET',
  'ADMIN_TOKEN',
  'GROQ_API_KEY',
  'OPENAI_API_KEY',
  'TRANSCRIPTION_API_KEY',
  'TRANSCRIPTION_API_URL',
  'TRANSCRIPTION_MODEL',
];

let savedEnv = {};

test.beforeEach(() => {
  savedEnv = {};
  for (const key of ENV_KEYS) {
    if (process.env[key] !== undefined) savedEnv[key] = process.env[key];
    delete process.env[key];
  }
});

test.afterEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
  for (const [key, value] of Object.entries(savedEnv)) process.env[key] = value;
  savedEnv = {};
});

async function call(onRequest, path, { method = 'GET', body, headers = {}, env = {} } = {}) {
  const init = { method, headers: { ...headers } };
  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body;
    } else {
      init.headers['content-type'] = 'application/json';
      init.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
  }
  const response = await onRequest({ request: new Request(`http://localhost${path}`, init), env });
  const text = await response.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  return { status: response.status, headers: response.headers, text, json };
}

function ipHeaders(ip) {
  return { 'cf-connecting-ip': ip };
}

// ---------------------------------------------------------------------------
// Storage mode: no durable creds -> unconfigured_production (parity with
// Vercel prod today, where Supabase is not configured).
// ---------------------------------------------------------------------------
test('cloudflare storage mode is unconfigured_production without durable credentials', () => {
  assert.equal(getStorageMode(), 'unconfigured_production');
});

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
test('cf contact: status reports unconfigured without Supabase', async () => {
  const res = await call(contactOnRequest, '/api/contact?action=status');
  assert.equal(res.status, 200);
  assert.deepEqual(res.json, { configured: false });
});

test('cf contact: inbox requires admin auth', async () => {
  const res = await call(contactOnRequest, '/api/contact?action=inbox');
  assert.equal(res.status, 401);
});

test('cf contact: invalid submission fails validation before storage', async () => {
  const res = await call(contactOnRequest, '/api/contact', {
    method: 'POST',
    headers: ipHeaders('cf-contact-validation-1'),
    body: { name: 'A', email: 'not-an-email', subject: 'general', message: 'short' },
  });
  assert.equal(res.status, 400);
  assert.equal(res.json.error, 'ValidationError');
});

test('cf contact: honeypot submissions are rejected', async () => {
  const res = await call(contactOnRequest, '/api/contact', {
    method: 'POST',
    headers: ipHeaders('cf-contact-honeypot-1'),
    body: { name: 'Bot', email: 'bot@example.com', subject: 'general', message: 'This is a long enough message for the form.', website_hp: 'filled' },
  });
  assert.equal(res.status, 400);
});

test('cf contact: valid submission returns 503 without storage (Vercel parity)', async () => {
  const res = await call(contactOnRequest, '/api/contact', {
    method: 'POST',
    headers: ipHeaders('cf-contact-nostorage-1'),
    body: { name: 'Parvez', email: 'test@example.com', subject: 'general', message: 'This is a long enough message for the form.' },
  });
  assert.equal(res.status, 503);
  assert.equal(res.json.error, 'StorageUnavailable');
});

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------
test('cf submissions: published additions are empty without storage', async () => {
  const res = await call(submissionsOnRequest, '/api/submissions?action=published');
  assert.equal(res.status, 200);
  assert.deepEqual(res.json, { tools: [], guides: [], lastUpdated: '' });
});

test('cf submissions: moderation queue requires admin auth', async () => {
  const res = await call(submissionsOnRequest, '/api/submissions');
  assert.equal(res.status, 401);
});

test('cf submissions: invalid tool submission fails validation', async () => {
  const res = await call(submissionsOnRequest, '/api/submissions', {
    method: 'POST',
    headers: ipHeaders('cf-submissions-validation-1'),
    body: { type: 'tool', name: 'x', websiteUrl: 'not-a-url', description: 'short', category: '', pricingType: 'free' },
  });
  assert.equal(res.status, 400);
  assert.equal(res.json.success, false);
});

test('cf submissions: valid tool submission returns 503 without storage', async () => {
  const res = await call(submissionsOnRequest, '/api/submissions', {
    method: 'POST',
    headers: ipHeaders('cf-submissions-nostorage-1'),
    body: {
      type: 'tool',
      name: 'Example Tool XYZ',
      websiteUrl: 'https://example-tool-xyz.test',
      description: 'An example tool description that is long enough to pass validation.',
      category: 'writing',
      pricingType: 'free',
    },
  });
  assert.equal(res.status, 503);
  assert.equal(res.json.error, 'StorageUnavailable');
});

// ---------------------------------------------------------------------------
// Prompts + prompt categories
// ---------------------------------------------------------------------------
test('cf prompts: public list is unconfigured without Supabase', async () => {
  const res = await call(promptsOnRequest, '/api/prompts');
  assert.equal(res.status, 200);
  assert.deepEqual(res.json, { configured: false, prompts: [] });
});

test('cf prompts: admin routes require auth', async () => {
  const adminList = await call(promptsOnRequest, '/api/prompts?admin=1');
  assert.equal(adminList.status, 401);
  const create = await call(promptsOnRequest, '/api/prompts', { method: 'POST', body: { prompt: {} } });
  assert.equal(create.status, 401);
});

test('cf prompt-categories: public list is unconfigured without Supabase', async () => {
  const res = await call(promptCategoriesOnRequest, '/api/prompt-categories');
  assert.equal(res.status, 200);
  assert.deepEqual(res.json, { configured: false, categories: [] });
});

test('cf prompt-categories: writes require admin auth', async () => {
  const res = await call(promptCategoriesOnRequest, '/api/prompt-categories', {
    method: 'POST',
    body: { category: { slug: 'test', name: 'Test', description: '', displayOrder: 1 } },
  });
  assert.equal(res.status, 401);
});

// ---------------------------------------------------------------------------
// Prompt submissions
// ---------------------------------------------------------------------------
test('cf prompt-submissions: rights confirmation is required', async () => {
  const res = await call(promptSubmissionsOnRequest, '/api/prompt-submissions', {
    method: 'POST',
    headers: ipHeaders('cf-promptsub-rights-1'),
    body: { title: 'A valid title here', promptText: 'x'.repeat(50) },
  });
  assert.equal(res.status, 400);
  assert.match(res.json.error, /Confirm that you created/i);
});

test('cf prompt-submissions: valid draft returns 503 without storage', async () => {
  const res = await call(promptSubmissionsOnRequest, '/api/prompt-submissions', {
    method: 'POST',
    headers: ipHeaders('cf-promptsub-nostorage-1'),
    body: {
      title: 'A valid test prompt title',
      promptText: 'A prompt body that is long enough to pass validation checks.',
      description: 'A test description',
      category: 'general',
      targetModel: 'ChatGPT',
      provider: 'OpenAI',
      tags: [],
      authorOrSource: 'Tester',
      previewImage: '/prompts/test.webp',
      rightsStatus: 'original',
      rightsConfirmed: true,
    },
  });
  assert.equal(res.status, 503);
  assert.equal(res.json.error, 'Prompt storage is unavailable. Configure Supabase on the server.');
});

// ---------------------------------------------------------------------------
// Discoveries (bundled fallback is load-bearing: live Vercel serves these
// 6 items today with no Supabase configured).
// ---------------------------------------------------------------------------
test('cf discoveries: bundled discoveries are served without storage', async () => {
  const res = await call(discoveriesOnRequest, '/api/discoveries');
  assert.equal(res.status, 200);
  assert.equal(res.json.total, 6);
  assert.deepEqual(res.json.discoveries.map((d) => d.id), [
    'disc_cursor',
    'disc_v0',
    'disc_perplexity',
    'disc_elevenlabs',
    'disc_recraft',
    'disc_bolt_new',
  ]);
  assert.equal(res.json.isAdmin, false);
});

test('cf discoveries: single item lookup and 404', async () => {
  const found = await call(discoveriesOnRequest, '/api/discoveries?id=disc_cursor');
  assert.equal(found.status, 200);
  assert.equal(found.json.discovery.name, 'Cursor');
  const missing = await call(discoveriesOnRequest, '/api/discoveries?id=disc_nope');
  assert.equal(missing.status, 404);
});

test('cf discoveries: writes require admin auth', async () => {
  const res = await call(discoveriesOnRequest, '/api/discoveries', {
    method: 'POST',
    body: { name: 'Test', description: 'A long enough description.', websiteUrl: 'https://example.com' },
  });
  assert.equal(res.status, 401);
});

test('cf bundled discoveries match data/discoveries.json (drift guard)', async () => {
  const raw = await readFile(new URL('../data/discoveries.json', import.meta.url), 'utf8');
  assert.deepEqual(bundledDiscoveries, JSON.parse(raw));
});

// ---------------------------------------------------------------------------
// GitHub projects
// ---------------------------------------------------------------------------
test('cf github-projects: non-allowlisted repos are rejected', async () => {
  const res = await call(githubProjectsOnRequest, '/api/github-projects?repo=unknown/repo');
  assert.equal(res.status, 400);
  assert.match(res.json.error, /allowlist/i);
});

test('cf github-projects: allowlisted repo returns metadata via mocked GitHub API', async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes('/readme')) {
      return { ok: true, headers: new Headers({ 'x-ratelimit-remaining': '60' }), text: async () => 'Ollama is a tool for running large language models locally.\n\nIt has many features.' };
    }
    if (String(url).includes('/commits')) {
      return { ok: true, headers: new Headers({ 'x-ratelimit-remaining': '59' }), json: async () => [{ commit: { committer: { date: '2026-11-20T00:00:00Z' } } }] };
    }
    return {
      ok: true,
      headers: new Headers({ 'x-ratelimit-remaining': '60' }),
      json: async () => ({
        full_name: 'ollama/ollama',
        description: 'Get up and running with large language models.',
        language: 'Go',
        license: { name: 'MIT License', spdx_id: 'MIT' },
        stargazers_count: 100,
        forks_count: 10,
        open_issues_count: 5,
        archived: false,
        default_branch: 'main',
        homepage: 'https://ollama.com',
        updated_at: '2026-11-20T00:00:00Z',
      }),
    };
  };
  try {
    const res = await call(githubProjectsOnRequest, '/api/github-projects?repo=ollama/ollama&refresh=1');
    assert.equal(res.status, 200);
    assert.equal(res.json.metadata.fullName, 'ollama/ollama');
    assert.equal(res.json.metadata.stars, 100);
    assert.equal(res.json.stale, false);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

// ---------------------------------------------------------------------------
// Prompt stats
// ---------------------------------------------------------------------------
test('cf prompt-stats: GET falls back to empty stats without storage', async () => {
  const res = await call(promptStatsOnRequest, '/api/prompt-stats');
  assert.equal(res.status, 200);
  assert.deepEqual(res.json, { stats: [] });
});

test('cf prompt-stats: invalid and unknown slugs are rejected', async () => {
  const bad = await call(promptStatsOnRequest, '/api/prompt-stats', { method: 'POST', body: { slug: 'BAD SLUG' } });
  assert.equal(bad.status, 400);
  const unknown = await call(promptStatsOnRequest, '/api/prompt-stats', { method: 'POST', body: { slug: 'no-such-prompt' } });
  assert.equal(unknown.status, 404);
});

test('cf prompt-stats: known slug returns 503 without analytics storage', async () => {
  const res = await call(promptStatsOnRequest, '/api/prompt-stats', {
    method: 'POST',
    headers: ipHeaders('cf-promptstats-nostorage-1'),
    body: { slug: 'premium-website-prompts-part-1' },
  });
  assert.equal(res.status, 503);
});

test('cf prompt-stats: GET returns filtered stats with mocked Supabase', async () => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-service-role-key';
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes('techhacks_prompt_stats')) {
      return { ok: true, json: async () => [{ slug: 'premium-website-prompts-part-1', copy_count: 7 }, { slug: 'not-a-real-prompt', copy_count: 99 }] };
    }
    const promptRows = [{
      id: '1',
      slug: 'premium-website-prompts-part-1',
      status: 'published',
      content: { title: 'x' },
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z',
    }];
    return {
      ok: true,
      json: async () => promptRows,
      text: async () => JSON.stringify(promptRows),
    };
  };
  try {
    const res = await call(promptStatsOnRequest, '/api/prompt-stats');
    assert.equal(res.status, 200);
    assert.deepEqual(res.json, { stats: [{ slug: 'premium-website-prompts-part-1', copyCount: 7 }] });
  } finally {
    globalThis.fetch = oldFetch;
  }
});

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
test('cf chat: rejects empty, malformed, and oversized input before provider access', async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('provider must not be called'); };
  try {
    for (const [body, expected] of [[{}, 400], ['not-json', 400], [{ message: 'x'.repeat(8001) }, 413]]) {
      const res = await call(chatOnRequest, '/api/chat', {
        method: 'POST',
        headers: ipHeaders('cf-chat-invalid-inputs'),
        body,
      });
      assert.equal(res.status, expected);
      assert.equal(typeof res.json.error, 'string');
    }
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test('cf chat: states when live AI is not configured and signals catalog mode', async () => {
  const res = await call(chatOnRequest, '/api/chat', {
    method: 'POST',
    headers: ipHeaders('cf-chat-no-provider'),
    body: { message: 'Find coding tools' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.json.status, 'grounded_local_mode');
  assert.match(res.json.message, /not configured/i);
  assert.equal(typeof res.json.text, 'string');
  assert.ok(Array.isArray(res.json.groundedTools));
});

test('cf chat: uses the supported Groq model and parses a valid provider response', async () => {
  const oldFetch = globalThis.fetch;
  process.env.GROQ_API_KEY = 'test-only-key';
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'Aider is a listed coding option.' } }] }) };
  };
  try {
    const res = await call(chatOnRequest, '/api/chat', {
      method: 'POST',
      headers: ipHeaders('cf-chat-provider-success'),
      body: {
        message: 'Find coding tools',
        conversationHistory: [{ sender: 'user', text: 'I build apps' }, { sender: 'other', text: 'ignore' }],
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.json.text, 'Aider is a listed coding option.');
    assert.equal(res.json.mode, 'live');
    assert.ok(res.json.groundedTools.some((tool) => tool.slug === 'aider'));
    assert.equal(request.body.model, 'openai/gpt-oss-120b');
    assert.equal(request.body.messages.at(-2).content, 'I build apps');
    assert.ok(request.options.headers.Authorization.includes('test-only-key'));
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test('cf chat: falls back to catalog mode for provider errors and malformed responses', async () => {
  const oldFetch = globalThis.fetch;
  process.env.GROQ_API_KEY = 'test-only-key';
  const providerFailures = [
    async () => ({ ok: false, status: 429 }),
    async () => ({ ok: true, json: async () => ({ choices: [] }) }),
    async () => { throw new Error('network unavailable'); },
  ];
  try {
    for (const failFetch of providerFailures) {
      globalThis.fetch = failFetch;
      const res = await call(chatOnRequest, '/api/chat', {
        method: 'POST',
        headers: ipHeaders('cf-chat-provider-failure'),
        body: { message: 'Find coding tools' },
      });
      assert.equal(res.status, 200);
      assert.equal(res.json.status, 'grounded_local_mode');
      assert.match(res.json.message, /temporarily unavailable/i);
      assert.equal(typeof res.json.text, 'string');
      assert.ok(Array.isArray(res.json.groundedTools));
    }
  } finally {
    globalThis.fetch = oldFetch;
  }
});

// ---------------------------------------------------------------------------
// Transcribe
// ---------------------------------------------------------------------------
test('cf transcribe: non-POST methods are rejected', async () => {
  const res = await call(transcribeOnRequest, '/api/transcribe');
  assert.equal(res.status, 405);
});

test('cf transcribe: missing file is rejected', async () => {
  process.env.TRANSCRIPTION_API_KEY = 'test-only-key';
  const form = new FormData();
  form.append('language', 'en');
  const res = await call(transcribeOnRequest, '/api/transcribe', { method: 'POST', headers: ipHeaders('cf-transcribe-missing-1'), body: form });
  assert.equal(res.status, 400);
  assert.match(res.json.message, /Choose a media file/i);
});

test('cf transcribe: unsupported language is rejected', async () => {
  process.env.TRANSCRIPTION_API_KEY = 'test-only-key';
  const form = new FormData();
  form.append('language', 'fr');
  form.append('file', new File(['fake'], 'test.mp3', { type: 'audio/mpeg' }));
  const res = await call(transcribeOnRequest, '/api/transcribe', { method: 'POST', headers: ipHeaders('cf-transcribe-language-1'), body: form });
  assert.equal(res.status, 400);
  assert.match(res.json.message, /Auto-detect, English, or Hindi/i);
});

test('cf transcribe: oversized file is rejected', async () => {
  process.env.TRANSCRIPTION_API_KEY = 'test-only-key';
  const form = new FormData();
  form.append('file', new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'big.mp3', { type: 'audio/mpeg' }));
  const res = await call(transcribeOnRequest, '/api/transcribe', { method: 'POST', headers: ipHeaders('cf-transcribe-oversized-1'), body: form });
  assert.equal(res.status, 400);
  assert.match(res.json.message, /4 MB or smaller/i);
});

test('cf transcribe: returns 503 without a provider key', async () => {
  const form = new FormData();
  form.append('file', new File(['fake-audio-bytes'], 'test.mp3', { type: 'audio/mpeg' }));
  const res = await call(transcribeOnRequest, '/api/transcribe', { method: 'POST', body: form });
  assert.equal(res.status, 503);
  assert.match(res.json.error, /not configured/i);
});

test('cf transcribe: forwards a file to the mocked provider', async () => {
  process.env.GROQ_API_KEY = 'test-only-key';
  process.env.TRANSCRIPTION_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
  const oldFetch = globalThis.fetch;
  let forwarded;
  globalThis.fetch = async (url, options) => {
    forwarded = { url: String(url), options };
    return {
      ok: true,
      json: async () => ({ text: 'hello world', language: 'en' }),
    };
  };
  try {
    const form = new FormData();
    form.append('language', 'en');
    form.append('file', new File(['fake-audio-bytes'], 'test.mp3', { type: 'audio/mpeg' }));
    const res = await call(transcribeOnRequest, '/api/transcribe', { method: 'POST', headers: ipHeaders('cf-transcribe-forward-1'), body: form });
    assert.equal(res.status, 200);
    assert.equal(res.json.text, 'hello world');
    assert.equal(res.json.detectedLanguage, 'en');
    assert.ok(forwarded.url.includes('api.groq.com'));
    assert.ok(forwarded.options.headers.Authorization.includes('test-only-key'));
    assert.equal(forwarded.options.body.get('model'), 'whisper-large-v3-turbo');
  } finally {
    globalThis.fetch = oldFetch;
  }
});

// ---------------------------------------------------------------------------
// Admin auth rate limiting
// ---------------------------------------------------------------------------
test('cf admin auth: 6 wrong-token attempts from one IP end in 429', async () => {
  const ip = 'cf-admin-ratelimit-1';
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const res = await call(promptsOnRequest, '/api/prompts?admin=1', {
      headers: { ...ipHeaders(ip), 'x-admin-token': 'wrong-token' },
    });
    if (attempt <= 5) assert.equal(res.status, 401, `attempt ${attempt} should be 401`);
    else assert.equal(res.status, 429, 'attempt 6 should be rate-limited');
  }
});

test('cf admin auth: correct token authorizes admin reads', async () => {
  process.env.ADMIN_SECRET = 'test-only-admin-secret';
  const res = await call(promptsOnRequest, '/api/prompts?admin=1', {
    headers: { 'x-admin-token': 'test-only-admin-secret' },
  });
  assert.equal(res.status, 200);
  assert.deepEqual(res.json, { configured: false, prompts: [] });
});

// ---------------------------------------------------------------------------
// Config parity: _redirects / _headers mirror vercel.json
// ---------------------------------------------------------------------------
test('cf public/_redirects carries the vercel.json redirects above the SPA catch-all', async () => {
  const redirects = await readFile(new URL('../public/_redirects', import.meta.url), 'utf8');
  const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const lines = redirects.split('\n').map((line) => line.trim()).filter(Boolean);
  for (const redirect of vercel.redirects) {
    const expected = `${redirect.source} ${redirect.destination} ${redirect.permanent ? 301 : 302}`;
    assert.ok(lines.includes(expected), `missing redirect: ${expected}`);
    assert.ok(lines.indexOf(expected) < lines.indexOf('/*    /index.html   200'), 'redirect must precede the SPA catch-all');
  }
  assert.ok(lines.includes('/*    /index.html   200'));
});

test('cf public/_headers carries the vercel.json security headers and CSP', async () => {
  const headersFile = await readFile(new URL('../public/_headers', import.meta.url), 'utf8');
  const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const globalHeaders = vercel.headers.find((entry) => entry.source === '/(.*)').headers;
  for (const header of globalHeaders) {
    assert.ok(headersFile.includes(`${header.key}: ${header.value}`), `missing header: ${header.key}`);
  }
  const assetHeaders = vercel.headers.find((entry) => entry.source === '/assets/(.*)').headers;
  for (const header of assetHeaders) {
    assert.ok(headersFile.includes(`${header.key}: ${header.value}`), `missing asset header: ${header.key}`);
  }
});

test('cf wrangler.toml names the existing Pages project and dist output', async () => {
  const wrangler = await readFile(new URL('../wrangler.toml', import.meta.url), 'utf8');
  assert.match(wrangler, /name = "switchroute-cf-test"/);
  assert.match(wrangler, /pages_build_output_dir = "dist"/);
});
