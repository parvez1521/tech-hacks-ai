import { isAuthorized } from './submissionsStore.js';
import { getSupabaseConfig, getSupabaseHeaders, redactSupabaseCredential } from './supabaseRest.js';

function getConfig() {
  return getSupabaseConfig();
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
  if (value.sourceUrl && !/^https:\/\//i.test(value.sourceUrl)) return 'Source page must use HTTPS.';
  if (value.rightsStatus && !['original', 'licensed', 'permission-granted', 'pending', 'unknown'].includes(value.rightsStatus)) return 'Prompt rights status is invalid.';
  const externalPreview = !value.previewImage.startsWith('/prompts/');
  if (externalPreview && !['original', 'licensed', 'permission-granted'].includes(value.rightsStatus)) return 'External preview images require original ownership, a license, or written permission before saving.';
  if (externalPreview && !value.sourceCreator) return 'External preview images require creator attribution.';
  if (externalPreview && value.rightsStatus === 'original' && value.rightsConfirmed !== true) return 'Original external preview images require explicit rights confirmation.';
  if (externalPreview && ['licensed', 'permission-granted'].includes(value.rightsStatus) && (!value.sourceUrl && !value.attributionUrl || !value.rightsLicense)) return 'Third-party preview images require a source URL and license or permission details.';
  if (value.mediaType === 'video') {
    if (!value.videoDetails || !['image', 'video'].includes(value.mediaType)) return 'Video entries require media metadata.';
    for (const field of ['videoUrl', 'sourcePageUrl']) if (value.videoDetails[field] && !/^https:\/\//i.test(value.videoDetails[field])) return `Video ${field} must use HTTPS.`;
    if (value.videoDetails.sourcePageUrl && !value.videoDetails.permissionStatus) return 'Video source records require creator attribution and permission status.';
  }
  return null;
}

async function request(path, config, init = {}) {
  const response = await fetch(`${config.base}/rest/v1/techhacks_prompts${path}`, {
    ...init,
    headers: {
      ...getSupabaseHeaders(config),
      ...(init.headers || {}),
    },
  });
  const body = await response.text();
  let parsed;
  try { parsed = body ? JSON.parse(body) : null; } catch { parsed = null; }
  if (!response.ok) {
    const detail = parsed?.message || parsed?.details || `Prompt database returned HTTP ${response.status}.`;
    const error = new Error(redactSupabaseCredential(detail, config));
    error.status = response.status;
    throw error;
  }
  return parsed;
}

export async function listPrompts({ admin = false, slug } = {}) {
  const config = getConfig();
  if (!config) return { configured: false, prompts: [] };
  const params = new URLSearchParams({ select: 'id,slug,status,content,created_at,updated_at', order: 'created_at.desc' });
  if (!admin) params.set('status', 'eq.published');
  if (slug) params.set('slug', `eq.${slug}`);
  const rows = await request(`?${params}`, config);
  return { configured: true, prompts: (rows || []).map((row) => { const { copyCount: _unverifiedCopyCount, ...content } = row.content || {}; return { ...content, id: row.id, slug: row.slug, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at }; }) };
}

export async function createPromptDraft(prompt) {
  const error = validatePrompt(prompt);
  if (error) return { status: 400, error };
  if (['pending', 'unknown'].includes(prompt.rightsStatus)) return { status: 400, error: 'Submissions need confirmed rights before they can enter moderation.' };
  const config = getConfig();
  if (!config) return { status: 503, error: 'Prompt storage is unavailable. Configure Supabase on the server.' };
  const row = { id: prompt.id, slug: prompt.slug, status: 'draft', content: { ...prompt, status: 'draft' } };
  try {
    const result = await request('', config, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
    return { status: 201, prompt: { ...result?.[0]?.content, id: result?.[0]?.id || row.id, slug: result?.[0]?.slug || row.slug, status: 'draft', createdAt: result?.[0]?.created_at } };
  } catch (error) {
    if (error.status === 409 || error.status === 23505) return { status: 409, error: 'A prompt with this slug already exists.' };
    throw error;
  }
}

export async function getPromptCopyStats() {
  const config = getConfig();
  if (!config) return { configured: false, stats: [] };
  const response = await fetch(`${config.base}/rest/v1/techhacks_prompt_stats?select=slug,copy_count`, { headers: getSupabaseHeaders(config), signal: AbortSignal.timeout(10000) });
  if (!response.ok) return { configured: true, stats: [] };
  const rows = await response.json();
  return { configured: true, stats: (rows || []).map((row) => ({ slug: row.slug, copyCount: Number(row.copy_count) || 0 })) };
}

export async function recordPromptCopy(slug) {
  const config = getConfig();
  if (!config) return { status: 503, error: 'Prompt analytics are not configured.' };
  const response = await fetch(`${config.base}/rest/v1/rpc/techhacks_record_prompt_copy`, { method: 'POST', headers: getSupabaseHeaders(config), body: JSON.stringify({ p_slug: slug }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) return { status: response.status, error: 'Could not record this copy.' };
  return { status: 200, success: true };
}

export async function savePrompt(prompt, status, existingSlug) {
  const error = validatePrompt(prompt);
  if (error) return { status: 400, error };
  if (!['draft', 'pending', 'published', 'rejected'].includes(status)) return { status: 400, error: 'Invalid prompt status.' };
  if (['pending', 'published'].includes(status) && ['pending', 'unknown'].includes(prompt.rightsStatus)) return { status: 400, error: 'Content with pending or unknown rights cannot be submitted or published.' };
  const config = getConfig();
  if (!config) return { status: 503, error: 'Prompt storage is unavailable. Configure SUPABASE_URL and a server-side Supabase secret or service-role key.' };
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
  if (!config) return { status: 503, error: 'Prompt storage is unavailable. Configure SUPABASE_URL and a server-side Supabase secret or service-role key.' };
  await request(`?slug=eq.${encodeURIComponent(slug)}`, config, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  return { status: 200, success: true };
}

export function canManagePrompts(headers) { return isAuthorized(headers); }
