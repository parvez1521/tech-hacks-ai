import { isAuthorized } from './submissionsStore.js';

function getConfig() {
  const base = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return base && key ? { base, key } : null;
}

export function validatePrompt(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Prompt must be an object.';
  for (const field of ['id', 'slug', 'title', 'description', 'category', 'targetModel', 'promptText']) {
    if (typeof value[field] !== 'string' || !value[field].trim()) return `Prompt ${field} is required.`;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) return 'Prompt slug must use lowercase letters, numbers, and hyphens.';
  if (!Array.isArray(value.tags) || value.tags.some((tag) => typeof tag !== 'string')) return 'Prompt tags must be an array of text values.';
  if (typeof value.authorOrSource !== 'string' || !value.authorOrSource.trim()) return 'Prompt attribution is required.';
  if (typeof value.previewImage !== 'string' || !value.previewImage.trim()) return 'Prompt preview image is required.';
  if (value.previewImage.startsWith('/prompts/')) {
    if (!/^\/prompts\/[A-Za-z0-9._/-]+$/.test(value.previewImage) || value.previewImage.split('/').includes('..')) return 'Local preview path must stay inside /prompts/. ';
  } else {
    try { if (new URL(value.previewImage).protocol !== 'https:') return 'Preview image must use HTTPS.'; }
    catch { return 'Preview image must be a project-local /prompts/ path or HTTPS URL.'; }
  }
  if (value.attributionUrl && !/^https:\/\//i.test(value.attributionUrl)) return 'Attribution link must use HTTPS.';
  return null;
}

async function request(path, { key, base }, init = {}) {
  const response = await fetch(`${base}/rest/v1/techhacks_prompts${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const body = await response.text();
  let parsed;
  try { parsed = body ? JSON.parse(body) : null; } catch { parsed = null; }
  if (!response.ok) {
    const error = new Error(parsed?.message || parsed?.details || `Prompt database returned HTTP ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return parsed;
}

export async function listPrompts({ admin = false, slug } = {}) {
  const config = getConfig();
  if (!config) return { configured: false, prompts: [] };
  const params = new URLSearchParams({ select: 'id,slug,status,content,updated_at', order: 'updated_at.desc' });
  if (!admin) params.set('status', 'eq.published');
  if (slug) params.set('slug', `eq.${slug}`);
  const rows = await request(`?${params}`, config);
  return { configured: true, prompts: (rows || []).map((row) => ({ ...row.content, id: row.id, slug: row.slug, status: row.status, updatedAt: row.updated_at })) };
}

export async function savePrompt(prompt, status, existingSlug) {
  const error = validatePrompt(prompt);
  if (error) return { status: 400, error };
  if (!['draft', 'pending', 'published', 'rejected'].includes(status)) return { status: 400, error: 'Invalid prompt status.' };
  const config = getConfig();
  if (!config) return { status: 503, error: 'Prompt storage is unavailable. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' };
  const row = { id: prompt.id, slug: prompt.slug, status, content: { ...prompt, status } };
  const path = existingSlug ? `?slug=eq.${encodeURIComponent(existingSlug)}` : '';
  const result = await request(path, { ...config, headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(row),
  });
  return { status: 200, prompt: result?.[0] ? { ...result[0].content, status: result[0].status } : row.content };
}

export async function removePrompt(slug) {
  const config = getConfig();
  if (!config) return { status: 503, error: 'Prompt storage is unavailable. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' };
  await request(`?slug=eq.${encodeURIComponent(slug)}`, config, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  return { status: 200, success: true };
}

export function canManagePrompts(headers) { return isAuthorized(headers); }
