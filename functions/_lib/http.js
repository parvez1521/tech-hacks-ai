// Minimal Vercel-style req/res shim for the ported api handlers.
import { setEnv } from './env.js';
//
// The original handlers in api/*.js were written against Vercel's
// Node-style `(req, res)` serverless signature. The Cloudflare port keeps
// their logic verbatim and adapts the transport here, so a review can diff
// each ported handler against its Vercel original line by line.
//
// - `createReqRes(request, { body, bodyParseError, clientIp })` builds a
//   req shaped like Vercel's: lowercased headers, `query` object,
//   pre-parsed `body`, `bodyParseError`, `socket.remoteAddress`.
// - `res` records status/headers/payload (`setHeader` / `status` / `json`,
//   chainable exactly like the originals). Handlers may `return res` — the
//   wrapper ignores return values and converts the recorded state.
// - `toResponse(state)` converts the recorded state to a Fetch Response.
//
// Client IP: Cloudflare sets `CF-Connecting-IP` and `X-Forwarded-For`.
// The handlers read `x-vercel-forwarded-for` first (absent on CF), then
// `x-forwarded-for`, then `socket.remoteAddress` — the shim puts the
// connecting IP there so every existing lookup keeps working.

export function createReqRes(request, { body = undefined, bodyParseError = false, clientIp = 'unknown' } = {}) {
  const url = new URL(request.url);
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const req = {
    method: request.method,
    url: request.url,
    headers,
    query: Object.fromEntries(url.searchParams),
    body,
    bodyParseError,
    socket: { remoteAddress: clientIp },
  };

  const state = {
    statusCode: 200,
    headers: new Headers(),
    payload: undefined,
  };
  const res = {
    statusCode: 200,
    setHeader(key, value) {
      state.headers.set(key, value);
      return res;
    },
    status(code) {
      state.statusCode = code;
      res.statusCode = code;
      return res;
    },
    json(payload) {
      state.payload = payload;
      return res;
    },
  };
  return { req, res, state };
}

export function toResponse(state) {
  const headers = new Headers(state.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }
  const body = state.payload === undefined ? '' : JSON.stringify(state.payload);
  return new Response(body, { status: state.statusCode, headers });
}

// Parse a JSON request body the way Vercel's body parser does:
// - empty body -> undefined (handlers treat it as `{}` or null themselves)
// - valid JSON -> the parsed value
// - invalid JSON -> bodyParseError = true, body = raw text
export async function parseJsonBody(request) {
  const text = await request.text();
  if (text === '') return { body: undefined, bodyParseError: false };
  try {
    return { body: JSON.parse(text), bodyParseError: false };
  } catch {
    return { body: text, bodyParseError: true };
  }
}

export function getClientIp(request) {
  const connecting = request.headers.get('cf-connecting-ip');
  if (connecting) return connecting.trim().split(',')[0].trim().slice(0, 128) || 'unknown';
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 128) || 'unknown';
  return 'unknown';
}

// Shared entry wrapper used by every functions/api handler:
// binds env, parses a JSON body (unless the caller passes bodyOverride),
// runs the ported Vercel-style handler, converts the recorded response.
export async function runVercelHandler(context, handler, { parseBody = true } = {}) {
  setEnv(context.env);
  const request = context.request;
  let body;
  let bodyParseError = false;
  if (parseBody && request.method !== 'GET' && request.method !== 'HEAD') {
    const parsed = await parseJsonBody(request);
    body = parsed.body;
    bodyParseError = parsed.bodyParseError;
  }
  const { req, res, state } = createReqRes(request, {
    body,
    bodyParseError,
    clientIp: getClientIp(request),
  });
  await handler(req, res);
  return toResponse(state);
}
