import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import {
  toDiscoveryDbRow,
  fromDiscoveryDbRow,
  getDiscoveries,
  saveNewDiscovery,
  updateExistingDiscovery,
  deleteExistingDiscovery,
  getStorageMode,
} from '../server/storageAdapter.js';

import {
  isValidHttpUrl,
  sanitizeUrl,
  validateDiscoveryPayload,
  getDiscoveriesListAsync,
  getDiscoveryByIdAsync,
  createDiscoveryAsync,
  updateDiscoveryAsync,
  deleteDiscoveryAsync,
  isAuthorized,
  ADMIN_SECRET,
} from '../server/discoveriesStore.js';

import discoveriesHandler from '../api/discoveries.js';
import { sanitizeOutboundUrl } from '../src/services/discoveryService.ts';
import { siteConfig } from '../src/config/site.ts';
import { matchRoute, getRouteTitle, getRouteDescription } from '../dist/test-ssr.js';

// Helper: Mock Request and Response for API handler
function createMockReqRes({
  method = 'GET',
  url = '/api/discoveries',
  headers = {},
  body = {},
} = {}) {
  const req = {
    method,
    url,
    headers: { host: 'localhost:3000', ...headers },
    body,
  };

  let statusCode = 200;
  let responseData = null;
  const responseHeaders = {};

  const res = {
    statusCode,
    setHeader: (name, val) => {
      responseHeaders[name.toLowerCase()] = val;
    },
    status: (code) => {
      statusCode = code;
      res.statusCode = code;
      return res;
    },
    json: (payload) => {
      responseData = payload;
      return res;
    },
    end: (str) => {
      try {
        responseData = JSON.parse(str);
      } catch {
        responseData = str;
      }
    },
    get result() {
      return { status: statusCode, body: responseData, headers: responseHeaders };
    },
  };

  return { req, res };
}

describe('Phase 29: Admin-Managed Tool Discoveries & Featured Tools', () => {
  const ROOT_DIR = process.cwd();

  // =========================================================================
  // 1. URL Validation & Outbound Sanitization
  // =========================================================================
  describe('1. URL Validation & Safe Protocol Enforcement', () => {
    test('isValidHttpUrl accepts standard http and https addresses', () => {
      assert.strictEqual(isValidHttpUrl('https://cursor.com'), true);
      assert.strictEqual(isValidHttpUrl('http://v0.dev'), true);
      assert.strictEqual(isValidHttpUrl('https://sub.domain.ai/path?query=1#hash'), true);
      assert.strictEqual(isValidHttpUrl('cursor.com'), true); // auto-prepends https
    });

    test('isValidHttpUrl strictly rejects dangerous injection protocols', () => {
      assert.strictEqual(isValidHttpUrl('javascript:alert(1)'), false);
      assert.strictEqual(isValidHttpUrl('JAVASCRIPT:void(0)'), false);
      assert.strictEqual(isValidHttpUrl('data:text/html,<script>alert(1)</script>'), false);
      assert.strictEqual(isValidHttpUrl('vbscript:msgbox(1)'), false);
      assert.strictEqual(isValidHttpUrl('file:///etc/passwd'), false);
      assert.strictEqual(isValidHttpUrl(''), false);
      assert.strictEqual(isValidHttpUrl(null), false);
    });

    test('sanitizeUrl cleans URLs and removes marketing trackers', () => {
      const dirty = 'https://perplexity.ai/?utm_source=twitter&utm_medium=social&ref=partner';
      const clean = sanitizeUrl(dirty);
      assert.strictEqual(clean, 'https://perplexity.ai/');
      assert.ok(!clean.includes('utm_source'));
      assert.ok(!clean.includes('ref='));
    });

    test('client sanitizeOutboundUrl protects visitors from malicious links', () => {
      assert.strictEqual(sanitizeOutboundUrl('javascript:alert(document.cookie)'), '');
      assert.strictEqual(sanitizeOutboundUrl('data:text/html;base64,...'), '');
      assert.strictEqual(sanitizeOutboundUrl('https://elevenlabs.io'), 'https://elevenlabs.io/');
      assert.strictEqual(sanitizeOutboundUrl('recraft.ai'), 'https://recraft.ai/');
    });
  });

  // =========================================================================
  // 2. Input Validation
  // =========================================================================
  describe('2. Discovery Payload Validation', () => {
    test('rejects payload with missing or short tool name', () => {
      const v = validateDiscoveryPayload({
        name: 'A',
        description: 'A valid description with more than ten characters.',
        websiteUrl: 'https://example.com',
      });
      assert.strictEqual(v.isValid, false);
      assert.ok(v.errors.some((e) => e.includes('Tool name is required')));
    });

    test('rejects payload with missing or short description', () => {
      const v = validateDiscoveryPayload({
        name: 'Valid Tool',
        description: 'Too short',
        websiteUrl: 'https://example.com',
      });
      assert.strictEqual(v.isValid, false);
      assert.ok(v.errors.some((e) => e.includes('Short description is required')));
    });

    test('rejects payload with invalid website URL', () => {
      const v = validateDiscoveryPayload({
        name: 'Valid Tool',
        description: 'A valid description with more than ten characters.',
        websiteUrl: 'javascript:alert(1)',
      });
      assert.strictEqual(v.isValid, false);
      assert.ok(v.errors.some((e) => e.includes('valid HTTP or HTTPS address')));
    });

    test('accepts well-formed discovery payload', () => {
      const v = validateDiscoveryPayload({
        name: 'Claude 3.5 Sonnet',
        description: 'Frontier AI reasoning model excelling at software engineering and nuanced analysis.',
        websiteUrl: 'https://claude.ai',
        category: 'Large Language Models',
        isFeatured: true,
        status: 'published',
      });
      assert.strictEqual(v.isValid, true);
      assert.strictEqual(v.errors.length, 0);
    });
  });

  // =========================================================================
  // 3. Public API Endpoint Security & Data Privacy
  // =========================================================================
  describe('3. Public API Endpoint Behavior & Draft Privacy', () => {
    test('public GET /api/discoveries returns 200 with only published items', async () => {
      const { req, res } = createMockReqRes({ method: 'GET', url: '/api/discoveries' });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      assert.ok(Array.isArray(res.result.body.discoveries));
      assert.strictEqual(res.result.body.isAdmin, false);

      // Verify every returned item is published
      for (const item of res.result.body.discoveries) {
        assert.strictEqual(item.status, 'published');
        assert.ok(item.name);
        assert.ok(item.websiteUrl.startsWith('http'));
      }
    });

    test('public GET /api/discoveries?featured=true returns only featured items', async () => {
      const { req, res } = createMockReqRes({ method: 'GET', url: '/api/discoveries?featured=true' });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      for (const item of res.result.body.discoveries) {
        assert.strictEqual(item.isFeatured, true);
      }
    });

    test('public GET /api/discoveries?category=... filters by category', async () => {
      const { req, res } = createMockReqRes({
        method: 'GET',
        url: '/api/discoveries?category=Developer+Tools',
      });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      assert.ok(res.result.body.discoveries.length > 0);
      for (const item of res.result.body.discoveries) {
        assert.strictEqual(item.category, 'Developer Tools');
      }
    });

    test('public GET /api/discoveries?q=... performs case-insensitive search', async () => {
      const { req, res } = createMockReqRes({
        method: 'GET',
        url: '/api/discoveries?q=cursor',
      });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      assert.ok(res.result.body.discoveries.length > 0);
      assert.ok(
        res.result.body.discoveries.some((d) => d.name.toLowerCase().includes('cursor'))
      );
    });
  });

  // =========================================================================
  // 4. Admin Authentication & Authorization
  // =========================================================================
  describe('4. Admin Authentication & Protection', () => {
    test('unauthenticated mutation requests return 401 Unauthorized', async () => {
      // POST
      const postMock = createMockReqRes({
        method: 'POST',
        url: '/api/discoveries',
        body: { name: 'Test', description: 'Test description goes here', websiteUrl: 'https://test.com' },
      });
      await discoveriesHandler(postMock.req, postMock.res);
      assert.strictEqual(postMock.res.result.status, 401);

      // PATCH
      const patchMock = createMockReqRes({
        method: 'PATCH',
        url: '/api/discoveries?id=disc_cursor',
        body: { isFeatured: false },
      });
      await discoveriesHandler(patchMock.req, patchMock.res);
      assert.strictEqual(patchMock.res.result.status, 401);

      // DELETE
      const deleteMock = createMockReqRes({
        method: 'DELETE',
        url: '/api/discoveries?id=disc_cursor',
      });
      await discoveriesHandler(deleteMock.req, deleteMock.res);
      assert.strictEqual(deleteMock.res.result.status, 401);
    });

    test('invalid token in x-admin-token returns 401', async () => {
      const { req, res } = createMockReqRes({
        method: 'POST',
        url: '/api/discoveries',
        headers: { 'x-admin-token': 'wrong-passkey-123' },
        body: { name: 'Test', description: 'Test description goes here', websiteUrl: 'https://test.com' },
      });
      await discoveriesHandler(req, res);
      assert.strictEqual(res.result.status, 401);
    });

    test('valid ADMIN_SECRET in x-admin-token or Bearer header authorizes admin', () => {
      assert.strictEqual(isAuthorized({ 'x-admin-token': ADMIN_SECRET }), true);
      assert.strictEqual(isAuthorized({ Authorization: `Bearer ${ADMIN_SECRET}` }), true);
      assert.strictEqual(isAuthorized({ 'x-admin-token': 'invalid' }), false);
      assert.strictEqual(isAuthorized({}), false);
    });
  });

  // =========================================================================
  // 5. Admin CRUD Operations Lifecycle
  // =========================================================================
  describe('5. Admin CRUD Operations Lifecycle', () => {
    let createdDiscoveryId = '';

    test('admin creates a new draft discovery via POST /api/discoveries', async () => {
      const payload = {
        name: 'AutoGPT Workspace',
        description: 'An open-source autonomous multi-agent development environment for complex tasks.',
        websiteUrl: 'https://autogpt.co',
        category: 'Automation & Agents',
        isFeatured: false,
        isNew: true,
        status: 'draft',
      };

      const { req, res } = createMockReqRes({
        method: 'POST',
        url: '/api/discoveries',
        headers: { 'x-admin-token': ADMIN_SECRET },
        body: payload,
      });

      await discoveriesHandler(req, res);
      assert.strictEqual(res.result.status, 201);
      assert.strictEqual(res.result.body.success, true);
      assert.ok(res.result.body.discovery);
      assert.ok(res.result.body.discovery.id.startsWith('disc_'));
      assert.strictEqual(res.result.body.discovery.status, 'draft');
      assert.strictEqual(res.result.body.discovery.name, 'AutoGPT Workspace');

      createdDiscoveryId = res.result.body.discovery.id;
    });

    test('draft discovery is NOT exposed in public GET /api/discoveries', async () => {
      const { req, res } = createMockReqRes({ method: 'GET', url: '/api/discoveries' });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      const found = res.result.body.discoveries.find((d) => d.id === createdDiscoveryId);
      assert.strictEqual(found, undefined, 'Draft discovery must not appear in public listing');
    });

    test('admin GET /api/discoveries?all=true DOES return the draft discovery', async () => {
      const { req, res } = createMockReqRes({
        method: 'GET',
        url: '/api/discoveries?all=true',
        headers: { 'x-admin-token': ADMIN_SECRET },
      });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      assert.strictEqual(res.result.body.isAdmin, true);
      const found = res.result.body.discoveries.find((d) => d.id === createdDiscoveryId);
      assert.ok(found, 'Admin must see draft discoveries');
      assert.strictEqual(found.status, 'draft');
    });

    test('admin publishes the draft discovery via PATCH /api/discoveries', async () => {
      const { req, res } = createMockReqRes({
        method: 'PATCH',
        url: `/api/discoveries?id=${createdDiscoveryId}`,
        headers: { 'x-admin-token': ADMIN_SECRET },
        body: { status: 'published', isFeatured: true },
      });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      assert.strictEqual(res.result.body.success, true);
      assert.strictEqual(res.result.body.discovery.status, 'published');
      assert.strictEqual(res.result.body.discovery.isFeatured, true);
    });

    test('published discovery now appears in public GET /api/discoveries', async () => {
      const { req, res } = createMockReqRes({ method: 'GET', url: '/api/discoveries' });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      const found = res.result.body.discoveries.find((d) => d.id === createdDiscoveryId);
      assert.ok(found, 'Newly published discovery must now appear in public listing');
      assert.strictEqual(found.status, 'published');
    });

    test('admin deletes the discovery via DELETE /api/discoveries', async () => {
      const { req, res } = createMockReqRes({
        method: 'DELETE',
        url: `/api/discoveries?id=${createdDiscoveryId}`,
        headers: { 'x-admin-token': ADMIN_SECRET },
      });
      await discoveriesHandler(req, res);

      assert.strictEqual(res.result.status, 200);
      assert.strictEqual(res.result.body.success, true);

      // Verify it is gone from store
      const verify = await getDiscoveryByIdAsync(createdDiscoveryId, { isAdmin: true });
      assert.strictEqual(verify, null);
    });
  });

  // =========================================================================
  // 6. Durable Storage & Production Safety Guard
  // =========================================================================
  describe('6. Durable Storage & Production Guard (503)', () => {
    test('toDiscoveryDbRow and fromDiscoveryDbRow map columns accurately', () => {
      const appModel = {
        id: 'disc_test_123',
        name: 'Test Tool',
        description: 'Test description for model mapping verification.',
        websiteUrl: 'https://test.ai',
        imageUrl: 'https://test.ai/logo.png',
        category: 'Developer Tools',
        isFeatured: true,
        isNew: true,
        status: 'published',
        createdAt: '2026-10-18T10:00:00.000Z',
        updatedAt: '2026-10-18T10:00:00.000Z',
      };

      const dbRow = toDiscoveryDbRow(appModel);
      assert.strictEqual(dbRow.id, appModel.id);
      assert.strictEqual(dbRow.website_url, appModel.websiteUrl);
      assert.strictEqual(dbRow.image_url, appModel.imageUrl);
      assert.strictEqual(dbRow.is_featured, true);
      assert.strictEqual(dbRow.is_new, true);

      const restored = fromDiscoveryDbRow(dbRow);
      assert.strictEqual(restored.id, appModel.id);
      assert.strictEqual(restored.websiteUrl, appModel.websiteUrl);
      assert.strictEqual(restored.imageUrl, appModel.imageUrl);
      assert.strictEqual(restored.isFeatured, true);
      assert.strictEqual(restored.isNew, true);
      assert.strictEqual(restored.status, 'published');
    });

    test('write operations reject with 503 in unconfigured production (VERCEL=1)', async () => {
      const origVercel = process.env.VERCEL;
      try {
        process.env.VERCEL = '1';
        delete process.env.SUPABASE_URL;
        delete process.env.UPSTASH_REDIS_REST_URL;

        const saveRes = await saveNewDiscovery({
          id: 'disc_fail',
          name: 'Fail Tool',
          description: 'This must be rejected by the serverless ephemeral guard.',
          websiteUrl: 'https://fail.com',
        });
        assert.strictEqual(saveRes.success, false);
        assert.strictEqual(saveRes.status, 503);
        assert.strictEqual(saveRes.error, 'StorageUnavailable');

        const updateRes = await updateExistingDiscovery('disc_cursor', { name: 'Cursor Updated' });
        assert.strictEqual(updateRes.success, false);
        assert.strictEqual(updateRes.status, 503);

        const deleteRes = await deleteExistingDiscovery('disc_cursor');
        assert.strictEqual(deleteRes.success, false);
        assert.strictEqual(deleteRes.status, 503);
      } finally {
        if (origVercel !== undefined) process.env.VERCEL = origVercel;
        else delete process.env.VERCEL;
      }
    });
  });

  // =========================================================================
  // 7. Database Schema & Migration Utility
  // =========================================================================
  describe('7. Database Schema DDL & Migration Utility', () => {
    test('server/schema.sql contains techhacks_discoveries table with RLS', () => {
      const sqlPath = path.join(ROOT_DIR, 'server', 'schema.sql');
      assert.ok(fs.existsSync(sqlPath), 'server/schema.sql must exist');
      const sql = fs.readFileSync(sqlPath, 'utf8');

      assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.techhacks_discoveries'));
      assert.ok(sql.includes('idx_techhacks_disc_status'));
      assert.ok(sql.includes('idx_techhacks_disc_created_at'));
      assert.ok(sql.includes('idx_techhacks_disc_featured'));
      assert.ok(sql.includes('ALTER TABLE public.techhacks_discoveries ENABLE ROW LEVEL SECURITY'));
      assert.ok(sql.includes('Public can view published discoveries'));
      assert.ok(sql.includes('Service role full access on discoveries'));
    });

    test('scripts/migrate-to-supabase.js includes discoveries in dry run and SQL', () => {
      const dryRunOutput = execSync('node scripts/migrate-to-supabase.js --dry-run', {
        cwd: ROOT_DIR,
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024,
      });
      assert.ok(dryRunOutput.includes('daily tool discoveries'), 'Dry run must report discoveries count');
      assert.ok(dryRunOutput.includes('[DISCOVERY]'), 'Dry run must enumerate discoveries');

      let sqlOutput = '';
      for (let attempt = 0; attempt < 3; attempt++) {
        sqlOutput = execSync('node scripts/migrate-to-supabase.js --sql', {
          cwd: ROOT_DIR,
          encoding: 'utf8',
          maxBuffer: 10 * 1024 * 1024,
        });
        if (sqlOutput.includes('INSERT INTO public.techhacks_discoveries')) break;
      }
      assert.ok(sqlOutput.includes('INSERT INTO public.techhacks_discoveries'));
      assert.ok(sqlOutput.includes('ON CONFLICT (id) DO UPDATE'));
    });
  });

  // =========================================================================
  // 8. Routing & Navigation
  // =========================================================================
  describe('8. Routing & Navigation Architecture', () => {
    test('/discoveries and aliases route correctly', () => {
      assert.deepStrictEqual(matchRoute('/discoveries'), { route: 'discoveries', params: {} });
      assert.deepStrictEqual(matchRoute('/daily-discoveries'), { route: 'discoveries', params: {} });
      assert.deepStrictEqual(matchRoute('/featured'), { route: 'discoveries', params: {} });
    });

    test('page title and description format properly for discoveries route', () => {
      const title = getRouteTitle('discoveries');
      assert.ok(title.includes('Daily Discoveries'));
      assert.ok(title.includes('Tech Hacks AI'));

      const desc = getRouteDescription('discoveries');
      assert.ok(desc.includes('daily discoveries'));
    });

    test('siteConfig discovery navigation list includes Daily Discoveries', () => {
      const item = siteConfig.navigation.discovery.find((n) => n.href === '/discoveries');
      assert.ok(item, 'Daily Discoveries must be listed in discovery nav items');
      assert.strictEqual(item.title, 'Daily Discoveries');
    });
  });
});
