import Busboy from 'busboy';

// Vercel limits function request and response bodies to 4.5 MB. Keep the file
// limit below that ceiling so multipart overhead has room to fit in the request.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_REQUEST_BYTES = 4.5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = /\.(mp3|wav|m4a|mp4|mov|webm|ogg|flac)$/i;
const ALLOWED_PROVIDER_HOSTS = new Set(['api.openai.com', 'api.groq.com']);
const SUPPORTED_LANGUAGES = new Set(['auto', 'en', 'hi']);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map();

export const config = {
  api: {
    bodyParser: false,
  },
};

function json(res, status, payload) {
  res.status(status).json(payload);
}

function getClientIp(req) {
  const headers = req?.headers || {};
  const forwarded = headers['x-vercel-forwarded-for'] || headers['x-forwarded-for'] || headers['x-real-ip'];
  if (forwarded) return String(forwarded).split(',')[0].trim().slice(0, 128) || 'unknown';
  return String(req?.socket?.remoteAddress || 'unknown').slice(0, 128);
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

function parseUpload(req) {
  return new Promise((resolve, reject) => {
    if (!req || typeof req.pipe !== 'function') {
      reject(new Error('Multipart request streaming is unavailable in this runtime.'));
      return;
    }
    let upload = null;
    let fileSize = 0;
    let tooLarge = false;
    let settled = false;
    let language = 'auto';
    const busboy = Busboy({
      headers: req.headers || {},
      limits: { files: 1, fileSize: MAX_FILE_BYTES, fields: 4, fieldSize: 16 },
    });

    busboy.on('field', (fieldName, value) => {
      if (fieldName === 'language') language = String(value || 'auto').trim().toLowerCase();
    });

    busboy.on('file', (fieldName, stream, info) => {
      const { filename, mimeType } = info;
      if (fieldName !== 'file') {
        stream.resume();
        return;
      }
      const chunks = [];
      stream.on('data', (chunk) => {
        fileSize += chunk.length;
        chunks.push(chunk);
      });
      stream.on('limit', () => { tooLarge = true; });
      stream.on('end', () => {
        upload = { filename, mimeType, buffer: Buffer.concat(chunks) };
      });
    });
    busboy.on('error', (error) => {
      if (!settled) { settled = true; reject(error); }
    });
    busboy.on('finish', () => {
      if (settled) return;
      settled = true;
      if (!SUPPORTED_LANGUAGES.has(language)) return reject(new Error('Choose Auto-detect, English, or Hindi for transcription.'));
      if (tooLarge || fileSize > MAX_FILE_BYTES) return reject(new Error('Media files must be 4 MB or smaller.'));
      if (!upload || !upload.buffer?.length) return reject(new Error('Choose a media file to transcribe.'));
      if (!ALLOWED_EXTENSIONS.test(upload.filename || '') && !/^\s*(audio|video)\//i.test(upload.mimeType || '')) return reject(new Error('Unsupported media format. Use MP3, WAV, M4A, MP4, MOV, WebM, OGG, or FLAC.'));
      resolve({ ...upload, language });
    });
    req.pipe(busboy);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const contentLength = Number(req.headers?.['content-length'] || req.headers?.['Content-Length']);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return json(res, 413, { error: 'Media request is too large.', message: 'Keep the media file at 4 MB or smaller.' });
  }

  const endpoint = process.env.TRANSCRIPTION_API_URL || 'https://api.openai.com/v1/audio/transcriptions';
  let providerUrl;
  try {
    providerUrl = new URL(endpoint);
  } catch {
    return json(res, 500, { error: 'Invalid transcription provider configuration.' });
  }
  if (providerUrl.protocol !== 'https:' || !ALLOWED_PROVIDER_HOSTS.has(providerUrl.hostname)) {
    return json(res, 500, { error: 'Transcription provider host is not allowlisted.' });
  }

  const apiKey = providerUrl.hostname === 'api.groq.com'
    ? (process.env.GROQ_API_KEY || process.env.TRANSCRIPTION_API_KEY)
    : (process.env.OPENAI_API_KEY || process.env.TRANSCRIPTION_API_KEY);
  if (!apiKey) return json(res, 503, { error: 'Transcription service is not configured.', message: 'The server-side transcription provider is not configured yet.' });

  if (!checkRateLimit(getClientIp(req))) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return json(res, 429, { error: 'Too many transcription requests.', message: 'Please wait a few minutes before trying again.' });
  }

  let upload;
  try {
    upload = await parseUpload(req);
  } catch (error) {
    return json(res, 400, { error: 'Invalid media upload.', message: error instanceof Error ? error.message : 'Choose a supported media file.' });
  }

  try {
    const providerBody = new FormData();
    providerBody.append('file', new Blob([upload.buffer], { type: upload.mimeType || 'application/octet-stream' }), String(upload.filename || 'media').replace(/[^A-Za-z0-9._-]/g, '_'));
    providerBody.append('model', process.env.TRANSCRIPTION_MODEL || (providerUrl.hostname === 'api.groq.com' ? 'whisper-large-v3-turbo' : 'whisper-1'));
    providerBody.append('response_format', 'verbose_json');
    if (upload.language !== 'auto') providerBody.append('language', upload.language);

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
        if (retryAfter) res.setHeader('Retry-After', retryAfter);
        return json(res, 429, { error: 'Transcription provider rate limit reached.', message: 'The transcription provider is temporarily rate-limiting requests. Try again later.' });
      }
      return json(res, 502, { error: 'Transcription provider rejected the file.', message: payload.error?.message || 'The provider could not transcribe this media file.' });
    }
    if (typeof payload.text !== 'string') return json(res, 502, { error: 'Transcription provider returned an invalid response.' });
    const detectedLanguage = typeof payload.language === 'string'
      ? payload.language
      : Array.isArray(payload.languages) && typeof payload.languages[0]?.code === 'string'
        ? payload.languages[0].code
        : undefined;
    return json(res, 200, { text: payload.text, ...(detectedLanguage ? { detectedLanguage } : {}) });
  } catch (error) {
    if (error?.name === 'AbortError') return json(res, 504, { error: 'Transcription timed out.', message: 'The provider took too long to respond. Try a shorter file.' });
    return json(res, 502, { error: 'Transcription provider unavailable.', message: 'The transcription provider could not be reached. Try again later.' });
  }
}
