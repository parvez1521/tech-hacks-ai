import { promptsData } from '../src/data/promptsData.ts';
import { getPromptCopyStats, listPrompts, recordPromptCopy } from '../server/promptsStore.js';

const recentCopyRequests = new Map();
const COPY_COOLDOWN_MS = 30_000;

function clientIp(req) {
  return String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', req.method === 'GET' ? 'public, s-maxage=60, stale-while-revalidate=300' : 'no-store');
  try {
    if (req.method === 'GET') {
      try {
        const [{ stats }, remote] = await Promise.all([getPromptCopyStats(), listPrompts({ admin: false })]);
        const allowed = new Set([...promptsData.map((prompt) => prompt.slug), ...remote.prompts.map((prompt) => prompt.slug)]);
        return res.status(200).json({ stats: stats.filter((item) => allowed.has(item.slug)) });
      } catch {
        // Copy counts are optional display metadata. If the analytics store is
        // temporarily unavailable, do not make public prompt pages fail.
        return res.status(200).json({ stats: [] });
      }
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method not allowed.' });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const slug = typeof body?.slug === 'string' ? body.slug : '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return res.status(400).json({ error: 'Prompt slug is invalid.' });
    const remote = await listPrompts({ admin: false, slug });
    if (!promptsData.some((prompt) => prompt.slug === slug) && !remote.prompts.some((prompt) => prompt.slug === slug)) return res.status(404).json({ error: 'Published prompt not found.' });
    const key = `${clientIp(req)}:${slug}`;
    const now = Date.now();
    if (now - (recentCopyRequests.get(key) || 0) < COPY_COOLDOWN_MS) return res.status(200).json({ success: true, counted: false });
    recentCopyRequests.set(key, now);
    const result = await recordPromptCopy(slug);
    return res.status(result.status).json(result);
  } catch {
    return res.status(400).json({ error: 'Could not process prompt analytics request.' });
  }
}
