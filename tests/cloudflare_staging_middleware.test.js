import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/_middleware.js';

function createContext(pathname, env, response = new Response('staging page', {
  status: 202,
  headers: { 'Content-Type': 'text/plain', 'X-Test': 'preserved' },
})) {
  return {
    request: new Request(`https://switchroute-staging.pages.dev${pathname}`),
    env,
    next: async () => response,
  };
}

test('staging middleware adds noindex headers without changing the response body/status', async () => {
  const response = await onRequest(createContext('/ai-tools', { SWITCHROUTE_STAGING: 'true' }));
  assert.equal(response.status, 202);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow, noarchive');
  assert.equal(response.headers.get('X-Test'), 'preserved');
  assert.equal(await response.text(), 'staging page');
});

test('staging middleware disallows all crawlers in robots.txt', async () => {
  const response = await onRequest(createContext('/robots.txt', { SWITCHROUTE_STAGING: 'true' }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow, noarchive');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(await response.text(), 'User-agent: *\nDisallow: /\n');
});

test('non-staging deployments keep their original robots behavior and headers', async () => {
  const response = await onRequest(createContext('/robots.txt', {}));
  assert.equal(response.status, 202);
  assert.equal(response.headers.get('X-Robots-Tag'), null);
  assert.equal(response.headers.get('X-Test'), 'preserved');
  assert.equal(await response.text(), 'staging page');
});
