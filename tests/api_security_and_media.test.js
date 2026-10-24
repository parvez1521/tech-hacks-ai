import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';

import transcribeHandler from '../api/transcribe.js';
import submissionsHandler from '../api/submissions.js';
import discoveriesHandler from '../api/discoveries.js';
import chatHandler from '../api/chat.js';
import { ADMIN_TOKEN, isAuthorized } from '../server/submissionsStore.js';

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

function createMultipartRequest({ language = 'auto', filename = 'sample.mp3', mimeType = 'audio/mpeg', content = 'fixture' } = {}) {
  const boundary = `----tech-hacks-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const body = Buffer.from([
    `--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${language}\r\n`,
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n${content}\r\n`,
    `--${boundary}--\r\n`,
  ].join(''));
  const request = new PassThrough();
  request.method = 'POST';
  request.headers = {
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': String(body.length),
    'x-forwarded-for': `203.0.113.${Math.floor(Math.random() * 200) + 1}`,
  };
  return { request, body };
}

describe('API security and production media boundaries', () => {
  test('chat applies a per-instance request limit before making provider calls', async () => {
    const originalGroq = process.env.GROQ_API_KEY;
    const ip = `chat-test:${Date.now()}`;
    try {
      delete process.env.GROQ_API_KEY;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const res = createMockResponse();
        await chatHandler({ method: 'POST', headers: { 'x-vercel-forwarded-for': ip }, body: { message: 'hello' } }, res);
        assert.equal(res.statusCode, 200);
      }
      const limited = createMockResponse();
      await chatHandler({ method: 'POST', headers: { 'x-vercel-forwarded-for': ip }, body: { message: 'hello' } }, limited);
      assert.equal(limited.statusCode, 429);
      assert.equal(limited.headers['Retry-After'], '600');
    } finally {
      if (originalGroq === undefined) delete process.env.GROQ_API_KEY;
      else process.env.GROQ_API_KEY = originalGroq;
    }
  });

  test('production/serverless admin authentication fails closed without an explicit secret', () => {
    const originalVercel = process.env.VERCEL;
    const originalSecret = process.env.ADMIN_SECRET;
    try {
      process.env.VERCEL = '1';
      delete process.env.ADMIN_SECRET;
      assert.equal(isAuthorized(ADMIN_TOKEN), false);
      assert.equal(isAuthorized({ Authorization: `Bearer ${ADMIN_TOKEN}` }), false);
    } finally {
      if (originalVercel === undefined) delete process.env.VERCEL;
      else process.env.VERCEL = originalVercel;
      if (originalSecret === undefined) delete process.env.ADMIN_SECRET;
      else process.env.ADMIN_SECRET = originalSecret;
    }
  });

  test('submission API returns 400 for malformed JSON instead of 500', async () => {
    const req = {
      method: 'POST',
      url: '/api/submissions',
      headers: { host: 'localhost' },
      socket: { remoteAddress: '127.0.0.1' },
      get body() {
        throw new SyntaxError('Unexpected token');
      },
    };
    const res = createMockResponse();

    await submissionsHandler(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.error, 'InvalidRequest');
  });

  test('discoveries API returns 400 for malformed JSON instead of 500', async () => {
    const req = {
      method: 'POST',
      url: '/api/discoveries',
      headers: { host: 'localhost', 'x-admin-token': ADMIN_TOKEN },
      get body() {
        throw new SyntaxError('Unexpected token');
      },
    };
    const res = createMockResponse();

    await discoveriesHandler(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.error, 'InvalidRequest');
  });

  test('transcription returns an explicit setup response without provider credentials', async () => {
    const originalOpenAi = process.env.OPENAI_API_KEY;
    const originalTranscription = process.env.TRANSCRIPTION_API_KEY;
    try {
      delete process.env.OPENAI_API_KEY;
      delete process.env.TRANSCRIPTION_API_KEY;
      const res = createMockResponse();
      await transcribeHandler({ method: 'POST', headers: {} }, res);
      assert.equal(res.statusCode, 503);
      assert.match(res.payload.message, /not configured/i);
    } finally {
      if (originalOpenAi === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalOpenAi;
      if (originalTranscription === undefined) delete process.env.TRANSCRIPTION_API_KEY;
      else process.env.TRANSCRIPTION_API_KEY = originalTranscription;
    }
  });

  test('transcription rejects requests above the deployed function body budget', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    try {
      process.env.OPENAI_API_KEY = 'test-key';
      const res = createMockResponse();
      await transcribeHandler({
        method: 'POST',
        headers: { 'content-length': String(5 * 1024 * 1024) },
      }, res);
      assert.equal(res.statusCode, 413);
      assert.match(res.payload.message, /4 MB/i);
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
    }
  });

  test('transcription rejects provider endpoints outside the explicit allowlist', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    const originalUrl = process.env.TRANSCRIPTION_API_URL;
    try {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.TRANSCRIPTION_API_URL = 'https://example.com/audio/transcriptions';
      const res = createMockResponse();
      await transcribeHandler({ method: 'POST', headers: {} }, res);
      assert.equal(res.statusCode, 500);
      assert.match(res.payload.error, /allowlisted/i);
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
      if (originalUrl === undefined) delete process.env.TRANSCRIPTION_API_URL;
      else process.env.TRANSCRIPTION_API_URL = originalUrl;
    }
  });

  test('transcription applies a per-instance request limit before parsing media', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    const originalUrl = process.env.TRANSCRIPTION_API_URL;
    const ip = `198.51.100.${Date.now() % 200 + 1}`;
    try {
      process.env.OPENAI_API_KEY = 'test-key';
      delete process.env.TRANSCRIPTION_API_URL;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const res = createMockResponse();
        await transcribeHandler({ method: 'POST', headers: { 'x-forwarded-for': ip } }, res);
        assert.equal(res.statusCode, 400);
      }
      const limited = createMockResponse();
      await transcribeHandler({ method: 'POST', headers: { 'x-forwarded-for': ip } }, limited);
      assert.equal(limited.statusCode, 429);
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
      if (originalUrl === undefined) delete process.env.TRANSCRIPTION_API_URL;
      else process.env.TRANSCRIPTION_API_URL = originalUrl;
    }
  });

  test('transcription forwards a supported language and returns provider language metadata', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    const originalUrl = process.env.TRANSCRIPTION_API_URL;
    const originalFetch = globalThis.fetch;
    try {
      process.env.OPENAI_API_KEY = 'test-key';
      delete process.env.TRANSCRIPTION_API_URL;
      globalThis.fetch = async (_url, init) => {
        assert.equal(init.method, 'POST');
        assert.equal(init.body.get('language'), 'hi');
        assert.equal(init.body.get('response_format'), 'verbose_json');
        return new Response(JSON.stringify({ text: 'नमस्ते दुनिया', language: 'hindi' }), { status: 200, headers: { 'content-type': 'application/json' } });
      };
      const { request, body } = createMultipartRequest({ language: 'hi' });
      const res = createMockResponse();
      const pending = transcribeHandler(request, res);
      request.end(body);
      await pending;
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.payload, { text: 'नमस्ते दुनिया', detectedLanguage: 'hindi' });
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
      if (originalUrl === undefined) delete process.env.TRANSCRIPTION_API_URL;
      else process.env.TRANSCRIPTION_API_URL = originalUrl;
      globalThis.fetch = originalFetch;
    }
  });
});
