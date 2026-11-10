import { canManagePrompts, listPrompts, removePrompt, savePrompt } from '../server/promptsStore.js';
import { getSafeApiFailure, logSanitizedApiError } from '../server/apiErrorHandling.js';
import { evaluateAdminAuth } from '../server/adminAuthRateLimit.js';

function readBody(req) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
  } catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', req.method === 'GET' && !req.query?.admin ? 'public, s-maxage=60, stale-while-revalidate=300' : 'no-store');
  try {
    const admin = req.method !== 'GET' || req.query?.admin === '1';
    if (admin) {
      const auth = evaluateAdminAuth(req, canManagePrompts);
      if (auth.status === 'rate-limited') { res.setHeader('Retry-After', '900'); return res.status(429).json({ error: 'Too many failed authentication attempts. Please try again in 15 minutes.' }); }
      if (auth.status !== 'authorized') return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
    }
    if (req.method === 'GET') {
      const result = await listPrompts({ admin, slug: typeof req.query?.slug === 'string' ? req.query.slug : undefined });
      return res.status(200).json(result);
    }
    if (req.method === 'POST' || req.method === 'PATCH') {
      const body = readBody(req);
      if (!body?.prompt) return res.status(400).json({ error: 'A prompt object is required.' });
      const result = await savePrompt(body.prompt, body.status || 'draft', typeof req.query?.slug === 'string' ? req.query.slug : undefined);
      return res.status(result.status).json(result);
    }
    if (req.method === 'DELETE') {
      const slug = typeof req.query?.slug === 'string' ? req.query.slug : '';
      if (!slug) return res.status(400).json({ error: 'Prompt slug is required.' });
      const result = await removePrompt(slug);
      return res.status(result.status).json(result);
    }
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    logSanitizedApiError('/api/prompts', error, req);
    const failure = getSafeApiFailure(error);
    return res.status(failure.status).json(failure.body);
  }
}
