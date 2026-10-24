import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getSupabaseConfig,
  getSupabaseHeaders,
} from '../server/supabaseRest.js';
import {
  getStorageMode,
  getStorageStatus,
  getPublishedAdditions,
  getDiscoveries,
  saveNewSubmission,
  saveNewDiscovery,
  savePublishedAdditions,
} from '../server/storageAdapter.js';
import {
  getPromptCopyStats,
  listPrompts,
  canManagePrompts,
} from '../server/promptsStore.js';
import {
  listPromptCategories,
  canManagePromptCategories,
} from '../server/promptCategoriesStore.js';
import promptsHandler from '../api/prompts.js';

const ENV_KEYS = [
  'SUPABASE_URL',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'ADMIN_SECRET',
  'NODE_ENV',
  'VERCEL',
];

function snapshotEnv() {
  return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
}

function restoreEnv(snapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function setEnv(values) {
  for (const key of ENV_KEYS) delete process.env[key];
  Object.assign(process.env, values);
}

function response(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    payload: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

test('Supabase key precedence and header formats are explicit and deterministic', () => {
  const original = snapshotEnv();
  try {
    setEnv({
      SUPABASE_URL: 'https://project.example.invalid',
      SUPABASE_SECRET_KEY: 'sb_secret_synthetic-fixture',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJ.synthetic.legacy-fixture',
    });

    const preferred = getSupabaseConfig();
    assert.equal(preferred.keyType, 'secret');
    assert.equal(preferred.key, 'sb_secret_synthetic-fixture');
    const secretHeaders = getSupabaseHeaders(preferred);
    assert.equal(secretHeaders.apikey, 'sb_secret_synthetic-fixture');
    assert.equal(secretHeaders.Authorization, undefined);

    delete process.env.SUPABASE_SECRET_KEY;
    const legacy = getSupabaseConfig();
    assert.equal(legacy.keyType, 'service_role');
    assert.equal(legacy.key, 'eyJ.synthetic.legacy-fixture');
    const legacyHeaders = getSupabaseHeaders(legacy);
    assert.equal(legacyHeaders.apikey, legacy.key);
    assert.equal(legacyHeaders.Authorization, `Bearer ${legacy.key}`);
  } finally {
    restoreEnv(original);
  }
});

test('new secret key is used by generic, prompt, category, and copy-stat REST callers', async () => {
  const original = snapshotEnv();
  const originalFetch = globalThis.fetch;
  const requests = [];
  try {
    setEnv({
      SUPABASE_URL: 'https://project.example.invalid',
      SUPABASE_SECRET_KEY: 'sb_secret_synthetic-runtime',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJ.synthetic.lower-precedence',
      NODE_ENV: 'test',
    });
    globalThis.fetch = async (url, init = {}) => {
      requests.push({ url: String(url), headers: new Headers(init.headers || {}) });
      if (String(url).includes('techhacks_published_additions')) return response([{ data: { tools: [], guides: [] } }]);
      return response([]);
    };

    await getPublishedAdditions();
    await saveNewSubmission({ id: 'synthetic-submission' });
    await saveNewDiscovery({ id: 'synthetic-discovery', name: 'Synthetic', description: 'Test only', websiteUrl: 'https://example.invalid' });
    await listPrompts();
    await getPromptCopyStats();
    await listPromptCategories();
    assert.ok(requests.length >= 6);
    for (const request of requests) {
      assert.equal(request.headers.get('apikey'), 'sb_secret_synthetic-runtime');
      assert.equal(request.headers.get('authorization'), null, `${request.url} must not send the opaque secret as Bearer`);
    }
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv(original);
  }
});

test('new secret wins once and authentication failure does not retry with legacy key', async () => {
  const original = snapshotEnv();
  const originalFetch = globalThis.fetch;
  const requests = [];
  try {
    setEnv({
      SUPABASE_URL: 'https://project.example.invalid',
      SUPABASE_SECRET_KEY: 'sb_secret_primary-fixture',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJ.synthetic-secondary',
      NODE_ENV: 'test',
    });
    globalThis.fetch = async (_url, init = {}) => {
      requests.push(new Headers(init.headers || {}));
      return response({ message: 'denied' }, 401);
    };

    await assert.rejects(listPromptCategories(), /denied/);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].get('apikey'), 'sb_secret_primary-fixture');
    assert.equal(requests[0].get('authorization'), null);
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv(original);
  }
});

test('public Supabase keys support published reads but never imply privileged readiness', async () => {
  const original = snapshotEnv();
  const originalFetch = globalThis.fetch;
  const originalWarn = console.warn;
  const requests = [];
  try {
    setEnv({
      SUPABASE_URL: 'https://project.example.invalid',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic-fixture',
      VERCEL: '1',
      NODE_ENV: 'production',
    });
    globalThis.fetch = async (url, init = {}) => {
      requests.push({ url: String(url), method: init.method || 'GET', headers: new Headers(init.headers || {}) });
      if (String(url).includes('techhacks_discoveries')) {
        return response([{ id: 'public-1', name: 'Published', description: 'Public', website_url: 'https://example.invalid', status: 'published' }]);
      }
      return response([{ data: { tools: [], guides: [] } }]);
    };
    console.warn = () => {};

    assert.equal(getStorageMode(), 'supabase_readonly');
    const status = getStorageStatus();
    assert.equal(status.readyForProduction, false);
    assert.equal(status.readyForGenericWrites, false);
    assert.equal(status.readyForPromptStorage, false);
    assert.equal(status.readyForPromptCategories, false);
    assert.equal(status.readyForPromptCopyStats, false);
    assert.equal(status.supportsPublicReads, true);
    assert.equal((await getDiscoveries(true)).length, 1);
    await getPublishedAdditions();
    assert.equal((await getDiscoveries(false)).length, 0);

    const submissionResult = await saveNewSubmission({ id: 'no-write' });
    const discoveryResult = await saveNewDiscovery({ id: 'no-write' });
    const additionsResult = await savePublishedAdditions({ tools: [] });
    assert.equal(submissionResult.status, 503);
    assert.equal(discoveryResult.status, 503);
    assert.equal(additionsResult.status, 503);
    assert.ok(requests.every(({ method }) => method === 'GET'));
    assert.ok(requests.filter(({ url }) => url.includes('techhacks_discoveries')).every(({ headers }) => {
      return headers.get('apikey') === 'sb_publishable_synthetic-fixture' && headers.get('authorization') === null;
    }));
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
    restoreEnv(original);
  }
});

test('legacy anon key remains read-only and retains its JWT Bearer compatibility', async () => {
  const original = snapshotEnv();
  const originalFetch = globalThis.fetch;
  let captured;
  try {
    setEnv({
      SUPABASE_URL: 'https://project.example.invalid',
      SUPABASE_ANON_KEY: 'eyJ.synthetic.anon-fixture',
      VERCEL: '1',
      NODE_ENV: 'production',
    });
    globalThis.fetch = async (_url, init = {}) => {
      captured = new Headers(init.headers || {});
      return response([]);
    };
    assert.equal(getStorageMode(), 'supabase_readonly');
    await getDiscoveries(true);
    assert.equal(captured.get('apikey'), 'eyJ.synthetic.anon-fixture');
    assert.equal(captured.get('authorization'), 'Bearer eyJ.synthetic.anon-fixture');
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv(original);
  }
});

test('missing Supabase credentials fail closed and prompt/category stores stay unconfigured', async () => {
  const original = snapshotEnv();
  const originalFetch = globalThis.fetch;
  let fetchCount = 0;
  const originalWarn = console.warn;
  try {
    setEnv({ VERCEL: '1', NODE_ENV: 'production' });
    globalThis.fetch = async () => { fetchCount += 1; return response([]); };
    console.warn = () => {};
    assert.equal(getSupabaseConfig(), null);
    assert.equal(getStorageMode(), 'unconfigured_production');
    assert.equal(getStorageStatus().readyForProduction, false);
    assert.deepEqual(await listPrompts(), { configured: false, prompts: [] });
    assert.deepEqual(await listPromptCategories(), { configured: false, categories: [] });
    assert.equal((await getPromptCopyStats()).configured, false);
    assert.equal((await saveNewSubmission({ id: 'no-config' })).status, 503);
    assert.equal(fetchCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
    restoreEnv(original);
  }
});

test('admin authorization is independent of the selected Supabase key', () => {
  const original = snapshotEnv();
  try {
    setEnv({
      SUPABASE_URL: 'https://project.example.invalid',
      SUPABASE_SECRET_KEY: 'sb_secret_not-an-admin-token',
      ADMIN_SECRET: 'synthetic-admin-token',
      NODE_ENV: 'test',
    });
    assert.equal(canManagePrompts({ 'x-admin-token': 'synthetic-admin-token' }), true);
    assert.equal(canManagePromptCategories({ 'x-admin-token': 'synthetic-admin-token' }), true);
    assert.equal(canManagePrompts({ 'x-admin-token': 'sb_secret_not-an-admin-token' }), false);
  } finally {
    restoreEnv(original);
  }
});

test('provider responses cannot expose the selected key in API errors or logs', async () => {
  const original = snapshotEnv();
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  const key = 'sb_secret_synthetic-redaction-fixture';
  const logs = [];
  try {
    setEnv({
      SUPABASE_URL: 'https://project.example.invalid',
      SUPABASE_SECRET_KEY: key,
      ADMIN_SECRET: 'synthetic-admin-token',
      NODE_ENV: 'test',
    });
    globalThis.fetch = async () => response({ message: `provider echoed ${key}` }, 500);
    console.error = (...parts) => logs.push(parts.join(' '));
    const res = mockRes();
    await promptsHandler({ method: 'GET', url: '/api/prompts', headers: {} }, res);
    assert.equal(res.statusCode, 500);
    assert.ok(!JSON.stringify(res.payload).includes(key));
    assert.ok(!logs.join('\n').includes(key));
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
    restoreEnv(original);
  }
});

test('server-only secret variable is absent from client source', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (/\.(?:[cm]?[jt]sx?)$/.test(entry.name)) files.push(target);
    }
  };
  visit(root);
  for (const file of files) {
    assert.ok(!fs.readFileSync(file, 'utf8').includes('SUPABASE_SECRET_KEY'), `${path.relative(root, file)} must not reference a server secret`);
  }
});
