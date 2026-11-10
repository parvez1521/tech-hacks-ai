import { canManagePromptCategories, listPromptCategories, removePromptCategory, savePromptCategory } from '../server/promptCategoriesStore.js';
import { getSafeApiFailure, logSanitizedApiError } from '../server/apiErrorHandling.js';
import { evaluateAdminAuth } from '../server/adminAuthRateLimit.js';

function readBody(req) {
  try { const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; return body && typeof body === 'object' && !Array.isArray(body) ? body : null; }
  catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', req.method === 'GET' ? 'public, s-maxage=60, stale-while-revalidate=300' : 'no-store');
  try {
    if (req.method === 'GET') return res.status(200).json(await listPromptCategories());
    {
      const auth = evaluateAdminAuth(req, canManagePromptCategories);
      if (auth.status === 'rate-limited') { res.setHeader('Retry-After', '900'); return res.status(429).json({ error: 'Too many failed authentication attempts. Please try again in 15 minutes.' }); }
      if (auth.status !== 'authorized') return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
    }
    if (req.method === 'POST' || req.method === 'PATCH') {
      const body = readBody(req);
      if (!body?.category) return res.status(400).json({ error: 'A category object is required.' });
      const result = await savePromptCategory(body.category, typeof req.query?.slug === 'string' ? req.query.slug : undefined);
      return res.status(result.status).json(result);
    }
    if (req.method === 'DELETE') {
      const slug = typeof req.query?.slug === 'string' ? req.query.slug : '';
      if (!slug) return res.status(400).json({ error: 'Category slug is required.' });
      const result = await removePromptCategory(slug);
      return res.status(result.status).json(result);
    }
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    logSanitizedApiError('/api/prompt-categories', error, req);
    const failure = getSafeApiFailure(error);
    return res.status(failure.status).json(failure.body);
  }
}
