import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { serializeJsonLd } from '../src/lib/jsonLd.ts';
import {
  evaluateAdminAuth,
  isAdminAuthRateLimited,
  recordAdminAuthFailure,
  resetAdminAuthRateLimit,
  ADMIN_AUTH_MAX_FAILURES,
} from '../server/adminAuthRateLimit.js';
import submissionsHandler from '../api/submissions.js';

function snapshotEnv(keys) {
  return Object.fromEntries(keys.map((key) => [key, process.env[key]]));
}
function restoreEnv(snapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
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

describe('security hardening', () => {
  test('serializeJsonLd escapes < so a </script> payload cannot break out', () => {
    const payload = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Evil </script><script>alert(1)</script>',
      description: 'Desc </script> and a <tag> here',
    };
    const out = serializeJsonLd(payload);
    assert.ok(!out.includes('</script>'), 'output must not contain a closing script tag');
    assert.ok(!out.includes('<'), 'output must not contain a raw < character');
    assert.ok(out.includes('\\u003c/script>'));
    // Still valid JSON that round-trips to the original values.
    assert.deepEqual(JSON.parse(out), payload);
  });

  test('all four detail pages route JSON-LD through serializeJsonLd', () => {
    for (const page of ['ToolDetailPage.tsx', 'AiToolDetailPage.tsx', 'OfferDetailPage.tsx', 'GuideDetailPage.tsx']) {
      const source = fs.readFileSync(new URL(`../src/pages/${page}`, import.meta.url), 'utf8');
      assert.ok(source.includes('serializeJsonLd(jsonLd)'), `${page} must use serializeJsonLd`);
      assert.ok(!source.includes('JSON.stringify(jsonLd)'), `${page} must not stringify jsonLd directly`);
    }
  });

  test('no hardcoded admin fallback remains and auth fails closed without env in any environment', async () => {
    const source = fs.readFileSync(new URL('../server/submissionsStore.js', import.meta.url), 'utf8');
    assert.ok(!source.includes('DEVELOPMENT_ADMIN_SECRET'), 'hardcoded fallback constant must be gone');
    const original = snapshotEnv(['VERCEL', 'NODE_ENV', 'ADMIN_SECRET']);
    try {
      delete process.env.VERCEL;
      process.env.NODE_ENV = 'development';
      delete process.env.ADMIN_SECRET;
      const fresh = await import(`../server/submissionsStore.js?no-secret-dev-${Date.now()}`);
      assert.equal(fresh.ADMIN_SECRET, '');
      assert.equal(fresh.isAuthorized('any-token'), false);
      assert.equal(fresh.isAuthorized({ 'x-admin-token': 'any-token' }), false);
    } finally {
      restoreEnv(original);
    }
  });

  test('admin auth rate limiter blocks after repeated presented-credential failures per IP', () => {
    resetAdminAuthRateLimit();
    const ip = '203.0.113.99';
    assert.equal(isAdminAuthRateLimited(ip), false);
    for (let i = 0; i < ADMIN_AUTH_MAX_FAILURES; i += 1) recordAdminAuthFailure(ip);
    assert.equal(isAdminAuthRateLimited(ip), true);
    // A different IP is unaffected.
    assert.equal(isAdminAuthRateLimited('203.0.113.100'), false);
    resetAdminAuthRateLimit();
    assert.equal(isAdminAuthRateLimited(ip), false);
  });

  test('admin endpoint returns 429 after 5 failed presented-credential attempts from one IP', async () => {
    resetAdminAuthRateLimit();
    const original = snapshotEnv(['ADMIN_SECRET']);
    try {
      process.env.ADMIN_SECRET = 'rate-limit-test-secret';
      const ip = '198.51.100.77';
      for (let attempt = 0; attempt < ADMIN_AUTH_MAX_FAILURES; attempt += 1) {
        const res = createMockResponse();
        await submissionsHandler(
          { method: 'GET', url: '/api/submissions', headers: { host: 'localhost', 'x-forwarded-for': ip, 'x-admin-token': 'wrong-token' } },
          res,
        );
        assert.equal(res.statusCode, 401, `attempt ${attempt + 1} should be 401`);
      }
      const limited = createMockResponse();
      await submissionsHandler(
        { method: 'GET', url: '/api/submissions', headers: { host: 'localhost', 'x-forwarded-for': ip, 'x-admin-token': 'wrong-token' } },
        limited,
      );
      assert.equal(limited.statusCode, 429);
      assert.equal(limited.headers['Retry-After'], '900');
    } finally {
      restoreEnv(original);
      resetAdminAuthRateLimit();
    }
  });

  test('evaluateAdminAuth does not count requests that present no credential', () => {
    resetAdminAuthRateLimit();
    const req = { headers: {}, socket: { remoteAddress: '192.0.2.55' } };
    for (let i = 0; i < ADMIN_AUTH_MAX_FAILURES + 3; i += 1) {
      const result = evaluateAdminAuth(req, () => false);
      assert.equal(result.status, 'unauthorized');
    }
    assert.equal(isAdminAuthRateLimited('192.0.2.55'), false);
    resetAdminAuthRateLimit();
  });

  test('vercel.json sends a report-only CSP, keeps other headers, and drops X-XSS-Protection', () => {
    const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
    const globalEntry = config.headers.find((entry) => entry.source === '/(.*)');
    assert.ok(globalEntry, 'global headers entry must exist');
    const keys = globalEntry.headers.map((h) => h.key);
    assert.ok(keys.includes('Content-Security-Policy-Report-Only'));
    assert.ok(!keys.includes('X-XSS-Protection'), 'legacy X-XSS-Protection must be removed');
    assert.ok(!keys.includes('Content-Security-Policy'), 'CSP must be report-only, not enforcing');
    for (const kept of ['Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']) {
      assert.ok(keys.includes(kept), `${kept} must be kept`);
    }
    const csp = globalEntry.headers.find((h) => h.key === 'Content-Security-Policy-Report-Only').value;
    for (const origin of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://www.googletagmanager.com', 'https://pagead2.googlesyndication.com']) {
      assert.ok(csp.includes(origin), `CSP must include ${origin}`);
    }
  });
});
