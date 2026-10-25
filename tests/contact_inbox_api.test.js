import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';

function makeResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: undefined,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function makeRequest({ method = 'GET', url = '/api/contact?action=status', body, headers = {}, ip = '192.0.2.40' } = {}) {
  return {
    method,
    url,
    headers: { host: 'switchroute.in', ...headers },
    body,
    socket: { remoteAddress: ip },
  };
}

async function runHandler(options) {
  const req = makeRequest(options);
  const res = makeResponse();
  await handler(req, res);
  return { req, res };
}

function setSupabaseEnv() {
  process.env.SUPABASE_URL = 'https://switchroute-test.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_only';
  process.env.ADMIN_SECRET = 'test-admin-token-long-enough';
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.NODE_ENV = 'test';
  delete process.env.VERCEL;
}

function clearSupabaseEnv() {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SECRET_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.ADMIN_SECRET;
  delete process.env.VERCEL;
}

test('contact status is false when no privileged database credentials exist', async () => {
  clearSupabaseEnv();
  const originalFetch = global.fetch;
  global.fetch = async () => { throw new Error('fetch should not be called without credentials'); };
  try {
    const { res } = await runHandler();
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { configured: false });
    assert.equal(res.headers['cache-control'], 'no-store');
  } finally {
    global.fetch = originalFetch;
  }
});

test('contact form accepts a validated message only after the database insert succeeds', async () => {
  setSupabaseEnv();
  const originalFetch = global.fetch;
  let captured;
  global.fetch = async (url, options) => {
    captured = { url: String(url), options };
    return { ok: true, status: 201 };
  };
  try {
    const { res } = await runHandler({
      method: 'POST',
      url: '/api/contact',
      ip: '192.0.2.41',
      body: {
        name: 'Example Sender',
        email: 'SENDER@EXAMPLE.COM',
        subject: 'general',
        message: 'This is a test contact message.',
      },
    });
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, { success: true, message: 'Your message was received.' });
    assert.match(captured.url, /switchroute_contact_messages$/);
    assert.equal(captured.options.headers.apikey, 'sb_secret_test_only');
    assert.equal(captured.options.headers.Authorization, undefined);
    assert.deepEqual(JSON.parse(captured.options.body), {
      name: 'Example Sender',
      email: 'sender@example.com',
      subject: 'general',
      message: 'This is a test contact message.',
    });
  } finally {
    global.fetch = originalFetch;
    clearSupabaseEnv();
  }
});

test('contact form rejects invalid content and honeypot submissions without calling the database', async () => {
  setSupabaseEnv();
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls += 1; return { ok: true, status: 201 }; };
  try {
    const invalid = await runHandler({
      method: 'POST',
      url: '/api/contact',
      body: { name: 'A', email: 'bad', subject: 'general', message: 'short' },
    });
    assert.equal(invalid.res.statusCode, 400);
    assert.equal(invalid.res.body.error, 'ValidationError');

    const honeypot = await runHandler({
      method: 'POST',
      url: '/api/contact',
      body: {
        name: 'Example Sender',
        email: 'sender@example.com',
        subject: 'general',
        message: 'This is a test contact message.',
        website_hp: 'automated-bot',
      },
    });
    assert.equal(honeypot.res.statusCode, 400);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
    clearSupabaseEnv();
  }
});

test('contact inbox rejects unauthenticated reads before querying the database', async () => {
  setSupabaseEnv();
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls += 1; return { ok: true, status: 200, json: async () => [] }; };
  try {
    const { res } = await runHandler({ url: '/api/contact?action=inbox' });
    assert.equal(res.statusCode, 401);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
    clearSupabaseEnv();
  }
});

test('contact inbox only updates messages to allowed statuses and validates UUIDs', async () => {
  setSupabaseEnv();
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls += 1; return { ok: true, status: 200, json: async () => [{ id: '00000000-0000-4000-8000-000000000001' }] }; };
  try {
    const invalidId = await runHandler({
      method: 'PATCH',
      url: '/api/contact?id=not-a-uuid',
      headers: { 'x-admin-token': 'test-admin-token-long-enough' },
      body: { status: 'resolved' },
    });
    assert.equal(invalidId.res.statusCode, 400);
    assert.equal(calls, 0);

    const invalidStatus = await runHandler({
      method: 'PATCH',
      url: '/api/contact?id=00000000-0000-4000-8000-000000000001',
      headers: { 'x-admin-token': 'test-admin-token-long-enough' },
      body: { status: 'public' },
    });
    assert.equal(invalidStatus.res.statusCode, 400);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
    clearSupabaseEnv();
  }
});
