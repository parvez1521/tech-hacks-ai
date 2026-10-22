import { checkRateLimit } from '../server/submissionsStore.js';
import { createPromptDraft } from '../server/promptsStore.js';

function readBody(req) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
  } catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const body = readBody(req);
  if (!body) return res.status(400).json({ error: 'A valid prompt submission is required.' });
  if (String(body.website_hp || '').trim()) return res.status(400).json({ error: 'Submission could not be accepted.' });
  if (body.rightsConfirmed !== true) return res.status(400).json({ error: 'Confirm that you created this content or have permission to submit it.' });
  const ip = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (!checkRateLimit(`prompt:${ip}`)) return res.status(429).json({ error: 'Too many submissions. Please try again in 10 minutes.' });
  const title = String(body.title || '').trim();
  const slug = title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 170);
  if (title.length < 5 || title.length > 120) return res.status(400).json({ error: 'Title must be between 5 and 120 characters.' });
  if (String(body.promptText || '').trim().length < 40 || String(body.promptText || '').length > 12000) return res.status(400).json({ error: 'Prompt text must be between 40 and 12,000 characters.' });
  const tags = Array.isArray(body.tags) ? body.tags.slice(0, 20).map((tag) => String(tag).trim().slice(0, 40)).filter(Boolean) : [];
  const creator = String(body.sourceCreator || body.authorOrSource || '').trim().slice(0, 120);
  const prompt = {
    id: `submission-${slug}-${Date.now()}`,
    slug,
    title,
    description: String(body.description || '').trim().slice(0, 500) || `Community-submitted ${String(body.mediaType || 'image')} prompt.` ,
    category: String(body.category || '').trim(),
    targetModel: String(body.targetModel || '').trim(),
    provider: String(body.provider || '').trim(),
    promptText: String(body.promptText).trim(),
    rightsConfirmed: body.rightsConfirmed === true,
    tags,
    visualStyle: String(body.visualStyle || '').trim(),
    aspectRatio: String(body.aspectRatio || '').trim(),
    previewImage: String(body.previewImage || '').trim(),
    previewImageAlt: String(body.previewImageAlt || `${title} prompt preview`).trim().slice(0, 240),
    authorOrSource: creator,
    sourceCreator: creator,
    sourceUrl: String(body.sourceUrl || '').trim() || undefined,
    attributionUrl: String(body.attributionUrl || '').trim() || undefined,
    rightsStatus: body.rightsStatus,
    rightsLicense: String(body.rightsLicense || '').trim() || undefined,
    promptProvenance: body.rightsStatus === 'original' ? 'original' : 'verified-source',
    mediaType: body.mediaType === 'video' ? 'video' : 'image',
    videoDetails: body.mediaType === 'video' ? {
      sourcePageUrl: String(body.videoSourceUrl || '').trim() || undefined,
      videoUrl: String(body.videoUrl || '').trim() || undefined,
      hostingMethod: 'link-only',
      creatorAttribution: creator,
      permissionStatus: String(body.rightsLicense || '').trim(),
    } : undefined,
  };
  const result = await createPromptDraft(prompt);
  return res.status(result.status).json(result.status === 201 ? { success: true, status: 'draft', prompt: result.prompt } : { error: result.error });
}
