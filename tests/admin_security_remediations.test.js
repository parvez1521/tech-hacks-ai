import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import submissionsHandler from '../api/submissions.js';
import discoveriesHandler from '../api/discoveries.js';
import promptsHandler from '../api/prompts.js';
import promptCategoriesHandler from '../api/prompt-categories.js';
import { isAuthorized } from '../server/submissionsStore.js';
import {
  clearStoredModeratorToken,
  fetchSubmissions,
  getStoredModeratorToken,
  publishSubmission,
  setStoredModeratorToken,
  updateSubmission,
} from '../src/services/submissionService.ts';

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

function snapshotEnv(keys) {
  return Object.fromEntries(keys.map((key) => [key, process.env[key]]));
}

function restoreEnv(snapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

describe('admin security remediation', () => {
  test('empty and development-fallback secrets fail closed in production', async () => {
    const original = snapshotEnv(['VERCEL', 'NODE_ENV', 'ADMIN_SECRET']);
    try {
      process.env.VERCEL = '1';
      process.env.NODE_ENV = 'production';
      process.env.ADMIN_SECRET = '';
      const emptySecretModule = await import(`../server/submissionsStore.js?empty-secret-${Date.now()}`);
      assert.equal(emptySecretModule.isAuthorized('any-token'), false);

      delete process.env.ADMIN_SECRET;
      const fallbackModule = await import(`../server/submissionsStore.js?fallback-secret-${Date.now()}`);
      assert.equal(fallbackModule.isAuthorized(fallbackModule.ADMIN_TOKEN), false);
      assert.equal(fallbackModule.isAuthorized({ 'x-admin-token': fallbackModule.ADMIN_TOKEN }), false);
    } finally {
      restoreEnv(original);
    }
  });

  test('configured moderator secret accepts header and bearer forms without accepting mismatches', () => {
    const original = snapshotEnv(['VERCEL', 'NODE_ENV', 'ADMIN_SECRET']);
    try {
      delete process.env.VERCEL;
      process.env.NODE_ENV = 'test';
      process.env.ADMIN_SECRET = 'test-moderator-credential';
      assert.equal(isAuthorized({ 'x-admin-token': 'test-moderator-credential' }), true);
      assert.equal(isAuthorized({ authorization: 'Bearer test-moderator-credential' }), true);
      assert.equal(isAuthorized({ 'x-admin-token': 'wrong-token' }), false);
    } finally {
      restoreEnv(original);
    }
  });

  test('sensitive admin and moderation routes reject unauthenticated reads and writes', async () => {
    const original = snapshotEnv(['VERCEL', 'NODE_ENV', 'ADMIN_SECRET']);
    try {
      process.env.VERCEL = '1';
      process.env.NODE_ENV = 'production';
      delete process.env.ADMIN_SECRET;

      const cases = [
        [submissionsHandler, { method: 'GET', url: '/api/submissions', headers: {} }, 401],
        [submissionsHandler, { method: 'PATCH', url: '/api/submissions?id=sub-1', headers: {}, body: { status: 'rejected' } }, 401],
        [submissionsHandler, { method: 'POST', url: '/api/submissions?action=publish&id=sub-1', headers: {} }, 401],
        [discoveriesHandler, { method: 'POST', url: '/api/discoveries', headers: {}, body: {} }, 401],
        [discoveriesHandler, { method: 'PATCH', url: '/api/discoveries?id=disc-1', headers: {}, body: {} }, 401],
        [discoveriesHandler, { method: 'DELETE', url: '/api/discoveries?id=disc-1', headers: {} }, 401],
        [promptsHandler, { method: 'GET', url: '/api/prompts?admin=1', query: { admin: '1' }, headers: {} }, 401],
        [promptsHandler, { method: 'POST', url: '/api/prompts', headers: {}, body: {} }, 401],
        [promptsHandler, { method: 'PATCH', url: '/api/prompts', headers: {}, body: {} }, 401],
        [promptsHandler, { method: 'DELETE', url: '/api/prompts?slug=secret-prompt', query: { slug: 'secret-prompt' }, headers: {} }, 401],
        [promptCategoriesHandler, { method: 'POST', url: '/api/prompt-categories', headers: {}, body: {} }, 401],
        [promptCategoriesHandler, { method: 'PATCH', url: '/api/prompt-categories', headers: {}, body: {} }, 401],
        [promptCategoriesHandler, { method: 'DELETE', url: '/api/prompt-categories?slug=private', query: { slug: 'private' }, headers: {} }, 401],
      ];

      for (const [handler, req, expectedStatus] of cases) {
        const res = createMockResponse();
        await handler(req, res);
        assert.equal(res.statusCode, expectedStatus, `${req.method} ${req.url}`);
      }

      const privateDiscoveries = createMockResponse();
      await discoveriesHandler({ method: 'GET', url: '/api/discoveries?all=true', headers: {} }, privateDiscoveries);
      assert.equal(privateDiscoveries.statusCode, 200);
      assert.equal(privateDiscoveries.payload.isAdmin, false);
      assert.ok(privateDiscoveries.payload.discoveries.every((item) => item.status === 'published'));
    } finally {
      restoreEnv(original);
    }
  });

  test('provider failures return generic responses and redact request values from diagnostics', async () => {
    const originalEnv = snapshotEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ADMIN_SECRET']);
    const originalFetch = globalThis.fetch;
    const originalConsoleError = console.error;
    const logs = [];
    const diagnosticBody = 'database host internal-db.local; /srv/postgres/data/private; Authorization: Bearer test-provider-credential';
    try {
      process.env.SUPABASE_URL = 'https://db.example.invalid';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-provider-credential';
      process.env.ADMIN_SECRET = 'test-moderator-credential';
      globalThis.fetch = async (url, init) => {
        const requestEcho = String(url).includes('techhacks_discoveries')
          ? '; request-title-sensitive-value'
          : String(url).includes('techhacks_submissions')
            ? '; moderation-sensitive-value'
            : '';
        return new Response(`${diagnosticBody}${requestEcho}`, { status: 500 });
      };
      console.error = (...parts) => logs.push(parts.join(' '));

      const promptRes = createMockResponse();
      await promptsHandler({
        method: 'GET', url: '/api/prompts?slug=private-prompt-slug',
        query: { slug: 'private-prompt-slug' }, headers: {},
      }, promptRes);
      assert.equal(promptRes.statusCode, 500);
      assert.match(promptRes.payload.message, /try again later/i);

      const categoryRes = createMockResponse();
      await promptCategoriesHandler({ method: 'GET', url: '/api/prompt-categories', headers: {} }, categoryRes);
      assert.equal(categoryRes.statusCode, 500);
      assert.match(categoryRes.payload.message, /try again later/i);

      const submissionRes = createMockResponse();
      await submissionsHandler({
        method: 'PATCH', url: '/api/submissions?id=submission-1',
        headers: { 'x-admin-token': 'test-moderator-credential' },
        body: { status: 'rejected', moderatorNotes: 'moderation-sensitive-value' },
      }, submissionRes);
      assert.equal(submissionRes.statusCode, 500);
      assert.match(submissionRes.payload.message, /try again later/i);

      const discoveryRes = createMockResponse();
      await discoveriesHandler({
        method: 'POST', url: '/api/discoveries',
        headers: { 'x-admin-token': 'test-moderator-credential' },
        body: {
          name: 'Sensitive request title',
          description: 'request-title-sensitive-value used in a diagnostic fixture',
          websiteUrl: 'https://example.com', status: 'published',
        },
      }, discoveryRes);
      assert.equal(discoveryRes.statusCode, 500);
      assert.match(discoveryRes.payload.message, /try again later/i);

      const responses = JSON.stringify([promptRes.payload, categoryRes.payload, submissionRes.payload, discoveryRes.payload]);
      for (const forbidden of ['internal-db.local', '/srv/postgres/data/private', 'test-provider-credential', 'private-prompt-slug', 'request-title-sensitive-value', 'moderation-sensitive-value']) {
        assert.ok(!responses.includes(forbidden), `response leaked ${forbidden}`);
      }
      const diagnostics = logs.join('\n');
      for (const forbidden of ['test-provider-credential', 'test-moderator-credential', 'private-prompt-slug', 'request-title-sensitive-value', 'moderation-sensitive-value']) {
        assert.ok(!diagnostics.includes(forbidden), `log leaked ${forbidden}`);
      }
      assert.match(diagnostics, /status=500/);
    } finally {
      restoreEnv(originalEnv);
      globalThis.fetch = originalFetch;
      console.error = originalConsoleError;
    }
  });

  test('401 moderator API responses clear session-only tokens and never put them in URLs', async () => {
    const originalWindow = globalThis.window;
    const originalFetch = globalThis.fetch;
    const session = new Map();
    const permanent = new Map();
    const calls = [];
    globalThis.window = {
      sessionStorage: {
        getItem: (key) => session.get(key) || null,
        setItem: (key, value) => session.set(key, value),
        removeItem: (key) => session.delete(key),
      },
      localStorage: {
        getItem: (key) => permanent.get(key) || null,
        setItem: (key, value) => permanent.set(key, value),
        removeItem: (key) => permanent.delete(key),
      },
    };
    globalThis.fetch = async (url, init) => {
      calls.push({ url: String(url), init });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
    };

    try {
      const token = 'test-session-token';
      const operations = [
        () => fetchSubmissions(token, { searchQuery: 'moderation search' }),
        () => updateSubmission('submission-1', { status: 'rejected' }, token),
        () => publishSubmission('submission-1', token),
      ];
      for (const operation of operations) {
        setStoredModeratorToken(token);
        assert.equal(getStoredModeratorToken(), token);
        const result = await operation();
        assert.equal(result.success, false);
        assert.match(result.error, /Unauthorized/);
        assert.equal(getStoredModeratorToken(), null);
      }
      assert.equal(session.has('th_mod_token'), false);
      assert.equal(permanent.size, 0);
      assert.equal(calls.length, 3);
      for (const { url, init } of calls) {
        assert.ok(!url.includes('test-session-token'));
        assert.equal(init.headers['x-admin-token'], 'test-session-token');
      }
    } finally {
      clearStoredModeratorToken();
      globalThis.window = originalWindow;
      globalThis.fetch = originalFetch;
    }
  });

  test('moderator unlock keeps native keyboard-submittable password form semantics', () => {
    const pageSource = fs.readFileSync(new URL('../src/pages/ModerationDashboardPage.tsx', import.meta.url), 'utf8');
    assert.match(pageSource, /<form onSubmit=\{handleUnlock\}/);
    assert.match(pageSource, /type="password"/);
    assert.match(pageSource, /clearStoredModeratorToken\(\)/);
  });
});
