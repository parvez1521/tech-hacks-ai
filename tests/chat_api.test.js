import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/chat.js';

function responseRecorder() {
  return {
    statusCode: 200,
    payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

test('chat API rejects empty, malformed, and oversized input before provider access', async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('provider must not be called'); };
  try {
    for (const [body, expected] of [[{}, 400], ['not-json', 400], [{ message: 'x'.repeat(8001) }, 413]]) {
      const res = responseRecorder();
      await handler({ method: 'POST', headers: { 'x-vercel-forwarded-for': 'chat-api-invalid-inputs' }, body }, res);
      assert.equal(res.statusCode, expected);
      assert.equal(typeof res.payload.error, 'string');
    }
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test('chat API states when live AI is not configured and signals catalog mode', async () => {
  const priorKey = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  try {
    const res = responseRecorder();
    await handler({ method: 'POST', headers: { 'x-vercel-forwarded-for': 'chat-api-no-provider' }, body: { message: 'Find coding tools' } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.status, 'grounded_local_mode');
    assert.match(res.payload.message, /not configured/i);
    assert.equal(res.payload.text, null);
  } finally {
    if (priorKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = priorKey;
  }
});

test('chat API uses the supported Groq model and parses a valid provider response', async () => {
  const oldFetch = globalThis.fetch;
  const priorKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'test-only-key';
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'Here are coding tools.' } }] }) };
  };
  try {
    const res = responseRecorder();
    await handler({
      method: 'POST',
      headers: { 'x-vercel-forwarded-for': 'chat-api-provider-success' },
      body: {
        message: 'Find coding tools',
        conversationHistory: [{ sender: 'user', text: 'I build apps' }, { sender: 'other', text: 'ignore' }],
      },
    }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.text, 'Here are coding tools.');
    assert.equal(res.payload.mode, 'live');
    assert.equal(request.body.model, 'openai/gpt-oss-120b');
    assert.equal(request.body.messages.at(-2).content, 'I build apps');
    assert.ok(!request.options.headers.Authorization.includes('test-only-key') === false);
  } finally {
    globalThis.fetch = oldFetch;
    if (priorKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = priorKey;
  }
});

test('chat API falls back to catalog mode for provider errors and malformed responses', async () => {
  const oldFetch = globalThis.fetch;
  const priorKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'test-only-key';
  const providerFailures = [
    async () => ({ ok: false, status: 429 }),
    async () => ({ ok: true, json: async () => ({ choices: [] }) }),
    async () => { throw new Error('network unavailable'); },
  ];
  try {
    for (const failFetch of providerFailures) {
      globalThis.fetch = failFetch;
      const res = responseRecorder();
      await handler({ method: 'POST', headers: { 'x-vercel-forwarded-for': 'chat-api-provider-failure' }, body: { message: 'Find coding tools' } }, res);
      assert.equal(res.statusCode, 200);
      assert.equal(res.payload.status, 'grounded_local_mode');
      assert.match(res.payload.message, /temporarily unavailable/i);
      assert.equal(res.payload.text, null);
    }
  } finally {
    globalThis.fetch = oldFetch;
    if (priorKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = priorKey;
  }
});

test('homepage and footer do not fake a newsletter signup without delivery', async () => {
  const { readFile } = await import('node:fs/promises');
  const home = await readFile(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf8');
  const footer = await readFile(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8');
  assert.match(home, /Browse recent discoveries/);
  assert.doesNotMatch(home, /Newsletter delivery is not available yet/);
  assert.doesNotMatch(footer, /setIsSubscribed|handleSubscribe|Thanks — your interest is saved/);
  assert.match(footer, /Browse recent discoveries/);
});
