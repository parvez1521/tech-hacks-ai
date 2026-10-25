import { getSupabaseConfig, getSupabaseHeaders } from '../server/supabaseRest.js';
import { isAuthorized } from '../server/submissionsStore.js';

const TABLE = 'switchroute_contact_messages';
const SUBJECTS = new Set([
  'general',
  'tool-suggestion',
  'pricing-correction',
  'bug-report',
  'copyright',
  'privacy',
  'security',
  'other',
]);
const STATUSES = new Set(['new', 'read', 'resolved', 'spam']);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
// Best-effort per-instance rate limiting. It never stores the submitter's IP in the database.
const attemptsByIp = new Map();

function sendJson(res, status, body, extraHeaders = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [key, value] of Object.entries(extraHeaders)) res.setHeader(key, value);
  return res.status(status).json(body);
}

function readBody(req) {
  if (req.bodyParseError) return null;
  try {
    const raw = req.body;
    if (raw === undefined || raw === null || raw === '') return {};
    const body = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'];
  return String(forwarded || req.socket?.remoteAddress || 'unknown').split(',')[0].trim().slice(0, 120);
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (attemptsByIp.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    attemptsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  attemptsByIp.set(ip, recent);

  if (attemptsByIp.size > 5000) {
    for (const [key, timestamps] of attemptsByIp) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) attemptsByIp.delete(key);
    }
  }
  return false;
}

function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function supabaseRequest(config, path, options = {}) {
  return fetch(`${config.base}/rest/v1/${path}`, {
    ...options,
    headers: getSupabaseHeaders(config, options.headers || {}),
  });
}

async function checkIntakeReady() {
  const config = getSupabaseConfig();
  if (!config) return false;
  try {
    // Verifies both server-side credentials and that the private table exists and is reachable.
    const response = await supabaseRequest(
      config,
      `${TABLE}?select=id&limit=0`,
      { method: 'GET' }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
  const action = url.searchParams.get('action');
  const id = url.searchParams.get('id');

  try {
    if (req.method === 'GET' && action === 'status') {
      return sendJson(res, 200, { configured: await checkIntakeReady() });
    }

    if (req.method === 'GET' && action === 'inbox') {
      if (!isAuthorized(req.headers)) {
        return sendJson(res, 401, { success: false, error: 'Unauthorized' });
      }
      const config = getSupabaseConfig();
      if (!config) {
        return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'Contact inbox storage is not configured.' });
      }
      const response = await supabaseRequest(
        config,
        `${TABLE}?select=id,name,email,subject,message,status,created_at,updated_at&order=created_at.desc&limit=100`,
        { method: 'GET' }
      );
      if (!response.ok) {
        console.error(`[API /contact] Inbox read failed (upstream status ${response.status}).`);
        return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'The contact inbox is temporarily unavailable.' });
      }
      const messages = await response.json();
      return sendJson(res, 200, { success: true, messages: Array.isArray(messages) ? messages : [] });
    }

    if (req.method === 'POST') {
      const body = readBody(req);
      if (!body) {
        return sendJson(res, 400, { success: false, error: 'InvalidRequest', message: 'Send a valid JSON object.' });
      }

      // Honeypot field catches many basic bots without storing their input.
      if (typeof body.website_hp === 'string' && body.website_hp.trim()) {
        return sendJson(res, 400, { success: false, error: 'InvalidRequest', message: 'The request could not be accepted.' });
      }

      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
      const message = typeof body.message === 'string' ? body.message.trim() : '';

      const errors = {};
      if (name.length < 2 || name.length > 80) errors.name = 'Name must be between 2 and 80 characters.';
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
      if (!SUBJECTS.has(subject)) errors.subject = 'Choose a valid topic.';
      if (message.length < 15 || message.length > 5000) errors.message = 'Message must be between 15 and 5,000 characters.';
      if (Object.keys(errors).length) {
        return sendJson(res, 400, { success: false, error: 'ValidationError', message: 'Check the highlighted fields.', errors });
      }

      if (isRateLimited(getClientIp(req))) {
        return sendJson(res, 429, { success: false, error: 'RateLimited', message: 'Too many messages from this connection. Please try again in 10 minutes.' }, { 'Retry-After': '600' });
      }

      const config = getSupabaseConfig();
      if (!config) {
        return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'No message was saved because secure contact storage is not configured yet.' });
      }

      const response = await supabaseRequest(
        config,
        TABLE,
        {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ name, email, subject, message }),
        }
      );
      if (!response.ok) {
        console.error(`[API /contact] Message insert failed (upstream status ${response.status}).`);
        return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'Your message was not saved. Please try again later or use Instagram for non-sensitive general questions.' });
      }
      return sendJson(res, 201, { success: true, message: 'Your message was received.' });
    }

    if (req.method === 'PATCH') {
      if (!isAuthorized(req.headers)) {
        return sendJson(res, 401, { success: false, error: 'Unauthorized' });
      }
      if (!isUuid(id)) return sendJson(res, 400, { success: false, error: 'InvalidRequest', message: 'A valid message ID is required.' });
      const body = readBody(req);
      if (!body || !STATUSES.has(body.status)) {
        return sendJson(res, 400, { success: false, error: 'ValidationError', message: 'Choose a valid message status.' });
      }
      const config = getSupabaseConfig();
      if (!config) return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'Contact inbox storage is not configured.' });

      const response = await supabaseRequest(
        config,
        `${TABLE}?id=eq.${encodeURIComponent(id)}&select=id,name,email,subject,message,status,created_at,updated_at`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({ status: body.status, updated_at: new Date().toISOString() }),
        }
      );
      if (!response.ok) {
        console.error(`[API /contact] Message update failed (upstream status ${response.status}).`);
        return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'The message status could not be updated.' });
      }
      const updated = await response.json();
      if (!Array.isArray(updated) || !updated[0]) {
        return sendJson(res, 404, { success: false, error: 'NotFound', message: 'This message no longer exists.' });
      }
      return sendJson(res, 200, { success: true, message: updated[0] });
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized(req.headers)) {
        return sendJson(res, 401, { success: false, error: 'Unauthorized' });
      }
      if (!isUuid(id)) return sendJson(res, 400, { success: false, error: 'InvalidRequest', message: 'A valid message ID is required.' });
      const config = getSupabaseConfig();
      if (!config) return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'Contact inbox storage is not configured.' });

      const response = await supabaseRequest(
        config,
        `${TABLE}?id=eq.${encodeURIComponent(id)}&select=id`,
        { method: 'DELETE', headers: { Prefer: 'return=representation' } }
      );
      if (!response.ok) {
        console.error(`[API /contact] Message delete failed (upstream status ${response.status}).`);
        return sendJson(res, 503, { success: false, error: 'StorageUnavailable', message: 'The message could not be deleted.' });
      }
      const deleted = await response.json();
      if (!Array.isArray(deleted) || !deleted[0]) {
        return sendJson(res, 404, { success: false, error: 'NotFound', message: 'This message no longer exists.' });
      }
      return sendJson(res, 200, { success: true, id: deleted[0].id });
    }

    return sendJson(res, 405, { success: false, error: 'MethodNotAllowed', message: 'Method not allowed.' }, { Allow: 'GET, POST, PATCH, DELETE' });
  } catch (error) {
    // Avoid logging message contents, sender emails, or provider response bodies.
    console.error(`[API /contact] Request failed (${error?.name === 'TypeError' ? 'network' : 'internal'} error).`);
    return sendJson(res, 500, { success: false, error: 'InternalError', message: 'The request could not be completed. Please try again later.' });
  }
}
