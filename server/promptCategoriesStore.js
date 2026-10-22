import { isAuthorized } from './submissionsStore.js';

function getConfig() {
  const base = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return base && key ? { base, key } : null;
}

async function request(path, { base, key }, init = {}) {
  const response = await fetch(`${base}/rest/v1/techhacks_prompt_categories${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const body = await response.text();
  let data;
  try { data = body ? JSON.parse(body) : null; } catch { data = null; }
  if (!response.ok) { const error = new Error(data?.message || `Prompt categories returned HTTP ${response.status}.`); error.status = response.status; throw error; }
  return data;
}

export function validatePromptCategory(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Category must be an object.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value.slug || ''))) return 'Category slug must use lowercase letters, numbers, and hyphens.';
  if (typeof value.name !== 'string' || !value.name.trim()) return 'Category name is required.';
  if (typeof value.description !== 'string' || value.description.length > 500) return 'Category description must be 500 characters or fewer.';
  const order = Number(value.displayOrder ?? 100);
  if (!Number.isInteger(order) || order < 0 || order > 10000) return 'Category order must be a whole number from 0 to 10000.';
  return null;
}

export function canManagePromptCategories(headers) { return isAuthorized(headers); }

export async function listPromptCategories() {
  const config = getConfig();
  if (!config) return { configured: false, categories: [] };
  const rows = await request('?select=slug,name,description,display_order&order=display_order.asc,name.asc', config);
  return { configured: true, categories: (rows || []).map(({ display_order, ...row }) => ({ ...row, displayOrder: display_order })) };
}

export async function savePromptCategory(value, existingSlug) {
  const error = validatePromptCategory(value);
  if (error) return { status: 400, error };
  const config = getConfig();
  if (!config) return { status: 503, error: 'Prompt category storage is unavailable. Configure Supabase on the server.' };
  const row = { slug: value.slug, name: value.name.trim(), description: value.description.trim(), display_order: Number(value.displayOrder ?? 100) };
  const path = existingSlug ? `?slug=eq.${encodeURIComponent(existingSlug)}` : '';
  const result = await request(path, { ...config, headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }, { method: existingSlug ? 'PATCH' : 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) });
  const saved = result?.[0] || row;
  return { status: 200, category: { slug: saved.slug, name: saved.name, description: saved.description, displayOrder: saved.display_order } };
}

export async function removePromptCategory(slug) {
  const config = getConfig();
  if (!config) return { status: 503, error: 'Prompt category storage is unavailable. Configure Supabase on the server.' };
  await request(`?slug=eq.${encodeURIComponent(slug)}`, config, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  return { status: 200, success: true };
}
