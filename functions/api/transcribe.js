// Cloudflare Pages Function: POST /api/transcribe
// Port of api/transcribe.js (main @ 52e05b3), REWRITTEN for the Workers
// runtime — this is the only route whose transport changes materially:
//
// - Vercel used `busboy` over a Node request stream (`req.pipe`) with
//   `Buffer` accumulation. Workers have no Node streams: multipart bodies
//   are parsed with the platform `request.formData()` and the upload is a
//   `File` (a `Blob`), forwarded to the provider as-is — no buffering.
// - All validation messages, limits (4 MB file, 4.5 MB request, 3 requests
//   per 10 minutes per IP), provider allowlist (api.openai.com /
//   api.groq.com), model defaults and response shapes are kept identical,
//   in the same check order as the original.
// - Minor deltas vs busboy: extra form files/fields beyond the first are
//   ignored instead of erroring, and the 4-field/16-byte field limits are
//   not enforced (only `language` is read). Neither affects the documented
//   client (mediaWorkflowService sends exactly `file` + `language`).
// - The 120s provider timeout is kept; long transcriptions on the free
//   tier are unproven — verify a real 4 MB transcription in staging.

import { getEnv, setEnv } from '../_lib/env.js';

// Workers have no Vercel 4.5 MB body ceiling, but the file/request limits
// below are kept so behavior (and error messages) match the original.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_REQUEST_BYTES = 4.5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = /\.(mp3|wav|m4a|mp4|mov|webm|ogg|flac)$/i;
const ALLOWED_PROVIDER_HOSTS = new Set(['api.openai.com', 'api.groq.com']);
const SUPPORTED_LANGUAGES = new Set(['auto', 'en', 'hi']);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
// Per-isolate on Cloudflare (same best-effort caveat as the original).
const rateLimitMap = new Map();

function jsonResponse(status, payload, extraHeaders = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders });
  return new Response(JSON.stringify(payload), { status, headers });
}

function getClientIp(request) {
  const connecting = request.headers.get('cf-connecting-ip');
  if (connecting) return connecting.trim().split(',')[0].trim().slice(0, 128) || 'unknown';
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return String(forwarded).split(',')[0].trim().slice(0, 128) || 'unknown';
  return 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

export async function onRequest(context) {
  setEnv(context.env);
  const env = getEnv();
  const request = context.request;

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse(413, { error: 'Media request is too large.', message: 'Keep the media file at 4 MB or smaller.' });
  }

  const endpoint = env.TRANSCRIPTION_API_URL || 'https://api.openai.com/v1/audio/transcriptions';
  let providerUrl;
  try {
    providerUrl = new URL(endpoint);
  } catch {
    return jsonResponse(500, { error: 'Invalid transcription provider configuration.' });
  }
  if (providerUrl.protocol !== 'https:' || !ALLOWED_PROVIDER_HOSTS.has(providerUrl.hostname)) {
    return jsonResponse(500, { error: 'Transcription provider host is not allowlisted.' });
  }

  const apiKey = providerUrl.hostname === 'api.groq.com'
    ? (env.GROQ_API_KEY || env.TRANSCRIPTION_API_KEY)
    : (env.OPENAI_API_KEY || env.TRANSCRIPTION_API_KEY);
  if (!apiKey) return jsonResponse(503, { error: 'Transcription service is not configured.', message: 'The server-side transcription provider is not configured yet.' });

  if (!checkRateLimit(getClientIp(request))) {
    return jsonResponse(429, { error: 'Too many transcription requests.', message: 'Please wait a few minutes before trying again.' }, { 'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) });
  }

  let file;
  let language = 'auto';
  try {
    const formData = await request.formData();
    const languageValue = formData.get('language');
    if (typeof languageValue === 'string') language = languageValue.trim().toLowerCase();
    const fileValue = formData.get('file');
    if (fileValue && typeof fileValue === 'object' && typeof fileValue.arrayBuffer === 'function') {
      file = fileValue;
    }
  } catch (error) {
    return jsonResponse(400, { error: 'Invalid media upload.', message: error instanceof Error ? error.message : 'Choose a supported media file.' });
  }

  // Same validation order as the original busboy finish handler:
  // language -> size -> presence -> extension/mime.
  if (!SUPPORTED_LANGUAGES.has(language)) return jsonResponse(400, { error: 'Invalid media upload.', message: 'Choose Auto-detect, English, or Hindi for transcription.' });
  if (file && file.size > MAX_FILE_BYTES) return jsonResponse(400, { error: 'Invalid media upload.', message: 'Media files must be 4 MB or smaller.' });
  if (!file || !file.size) return jsonResponse(400, { error: 'Invalid media upload.', message: 'Choose a media file to transcribe.' });
  if (!ALLOWED_EXTENSIONS.test(file.name || '') && !/^\s*(audio|video)\//i.test(file.type || '')) return jsonResponse(400, { error: 'Invalid media upload.', message: 'Unsupported media format. Use MP3, WAV, M4A, MP4, MOV, WebM, OGG, or FLAC.' });

  try {
    const providerBody = new FormData();
    providerBody.append('file', file, String(file.name || 'media').replace(/[^A-Za-z0-9._-]/g, '_'));
    providerBody.append('model', env.TRANSCRIPTION_MODEL || (providerUrl.hostname === 'api.groq.com' ? 'whisper-large-v3-turbo' : 'whisper-1'));
    providerBody.append('response_format', 'verbose_json');
    if (language !== 'auto') providerBody.append('language', language);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    let providerResponse;
    try {
      providerResponse = await fetch(providerUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: providerBody,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    const payload = await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok) {
      if (providerResponse.status === 429) {
        const retryAfter = providerResponse.headers?.get?.('retry-after');
        const extraHeaders = retryAfter ? { 'Retry-After': retryAfter } : {};
        return jsonResponse(429, { error: 'Transcription provider rate limit reached.', message: 'The transcription provider is temporarily rate-limiting requests. Try again later.' }, extraHeaders);
      }
      return jsonResponse(502, { error: 'Transcription provider rejected the file.', message: payload.error?.message || 'The provider could not transcribe this media file.' });
    }
    if (typeof payload.text !== 'string') return jsonResponse(502, { error: 'Transcription provider returned an invalid response.' });
    const detectedLanguage = typeof payload.language === 'string'
      ? payload.language
      : Array.isArray(payload.languages) && typeof payload.languages[0]?.code === 'string'
        ? payload.languages[0].code
        : undefined;
    return jsonResponse(200, { text: payload.text, ...(detectedLanguage ? { detectedLanguage } : {}) });
  } catch (error) {
    if (error?.name === 'AbortError') return jsonResponse(504, { error: 'Transcription timed out.', message: 'The provider took too long to respond. Try a shorter file.' });
    return jsonResponse(502, { error: 'Transcription provider unavailable.', message: 'The transcription provider could not be reached. Try again later.' });
  }
}
