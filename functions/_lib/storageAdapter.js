// Cloudflare port of server/storageAdapter.js (main @ 52e05b3).
//
// Durable-storage interface for the ported API routes. Supabase and Upstash
// paths are verbatim; the differences from the Vercel original are:
//
// - `fs`/`path` are REMOVED: Workers have no filesystem. There is NO
//   `local` mode on Cloudflare. `getStorageMode()` returns
//   `supabase` -> `upstash` -> `supabase_readonly` ->
//   `unconfigured_production` (no durable creds). The safety behavior is
//   identical to Vercel prod: writes are refused with 503 instead of
//   silently landing in ephemeral storage.
// - The bundled discoveries fallback (`data/discoveries.json` on Vercel)
//   becomes a static JS import (`./bundledDiscoveries.js`, a copy of that
//   file — see the drift test in tests/cloudflare_pages_functions.test.js).
//   Live Vercel serves the 6 bundled discoveries today despite having no
//   Supabase configured, so this fallback is load-bearing for parity.
// - Env comes from `getEnv()` (functions/_lib/env.js), not `process.env`.

import { getEnv } from './env.js';
import { logSanitizedApiError } from './apiErrorHandling.js';
import {
  getSupabaseConfig,
  getSupabaseHeaders as buildSupabaseHeaders,
  hasSupabasePrivilegedConfig,
  hasSupabasePublicReadConfig,
  redactSupabaseCredential,
} from './supabaseRest.js';
import bundledDiscoveries from './bundledDiscoveries.js';

// Determine active storage mode
export function getStorageMode() {
  const env = getEnv();
  if (env.SUPABASE_URL && hasSupabasePrivilegedConfig()) {
    return 'supabase';
  }
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return 'upstash';
  }
  if (env.SUPABASE_URL && hasSupabasePublicReadConfig()) {
    return 'supabase_readonly';
  }
  // Cloudflare Functions are always serverless production: without durable
  // storage credentials, writes are refused (same safety as Vercel prod).
  return 'unconfigured_production';
}

function isStorageWriteUnavailable(mode = getStorageMode()) {
  return mode === 'unconfigured_production' || mode === 'supabase_readonly';
}

export function isDurable() {
  const mode = getStorageMode();
  return mode === 'supabase' || mode === 'upstash';
}

export function getStorageStatus() {
  const env = getEnv();
  const mode = getStorageMode();
  let provider = 'None (Unconfigured Serverless)';
  let details = 'Production environment detected without durable storage credentials. Submissions are paused to prevent ephemeral data loss.';

  if (mode === 'supabase') {
    let host = 'Supabase';
    try {
      host = new URL(env.SUPABASE_URL).hostname;
    } catch {}
    provider = 'Supabase (PostgreSQL REST)';
    details = `Connected to Supabase endpoint (${host})`;
  } else if (mode === 'upstash') {
    let host = 'Upstash';
    try {
      host = new URL(env.UPSTASH_REDIS_REST_URL).hostname;
    } catch {}
    provider = 'Upstash (Serverless Redis REST)';
    details = `Connected to Upstash endpoint (${host})`;
  } else if (mode === 'supabase_readonly') {
    provider = 'Supabase (public read only)';
    details = 'A public Supabase key is configured. Privileged writes and prompt storage require a server-side secret or service-role key.';
  }

  return {
    mode,
    isDurable: isDurable(),
    isServerless: true,
    provider,
    readyForProduction: mode === 'supabase' || mode === 'upstash',
    readyForGenericWrites: mode === 'supabase' || mode === 'upstash',
    readyForPromptStorage: mode === 'supabase',
    readyForPromptCategories: mode === 'supabase',
    readyForPromptCopyStats: mode === 'supabase',
    supportsPublicReads: mode === 'supabase' || mode === 'supabase_readonly',
    details,
  };
}

// Map application submission object to SQL snake_case row
export function toDbRow(sub = {}) {
  return {
    id: sub.id,
    type: sub.type,
    status: sub.status || 'pending',
    created_at: sub.createdAt || new Date().toISOString(),
    updated_at: sub.updatedAt || new Date().toISOString(),
    tool_data: sub.toolData || null,
    guide_data: sub.guideData || null,
    potential_duplicate: Boolean(sub.potentialDuplicate),
    duplicate_reason: sub.duplicateReason || null,
    duplicate_matches: sub.duplicateMatches || [],
    moderator_notes: sub.moderatorNotes || null,
    is_verified: Boolean(sub.isVerified),
    published_slug: sub.publishedSlug || null,
    published_at: sub.publishedAt || null,
  };
}

// Map SQL snake_case row back to application submission object
export function fromDbRow(row = {}) {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    toolData: row.tool_data || undefined,
    guideData: row.guide_data || undefined,
    potentialDuplicate: Boolean(row.potential_duplicate),
    duplicateReason: row.duplicate_reason || undefined,
    duplicateMatches: row.duplicate_matches || undefined,
    moderatorNotes: row.moderator_notes || undefined,
    isVerified: Boolean(row.is_verified),
    publishedSlug: row.published_slug || undefined,
    publishedAt: row.published_at || undefined,
  };
}

// ---------------------------------------------------------------------------
// Supabase REST Implementation
// ---------------------------------------------------------------------------
function getSupabaseHeaders({ allowPublic = false, extraHeaders = {} } = {}) {
  const config = getSupabaseConfig({ allowPublic });
  return buildSupabaseHeaders(config, extraHeaders);
}

function supabaseErrorMessage(message, allowPublic = false) {
  return redactSupabaseCredential(message, getSupabaseConfig({ allowPublic }));
}

function supabaseBase() {
  return getEnv().SUPABASE_URL.replace(/\/+$/, '');
}

async function fetchSubmissionsSupabase() {
  const url = `${supabaseBase()}/rest/v1/techhacks_submissions?select=*&order=created_at.desc`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getSupabaseHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(supabaseErrorMessage(`Supabase query failed (${res.status}): ${errorText}`));
  }
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(fromDbRow) : [];
}

async function insertSubmissionSupabase(submission) {
  const url = `${supabaseBase()}/rest/v1/techhacks_submissions`;
  const row = toDbRow(submission);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders({ extraHeaders: { Prefer: 'return=representation' } }),
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(supabaseErrorMessage(`Supabase insert failed (${res.status}): ${errorText}`));
  }
  const inserted = await res.json();
  return Array.isArray(inserted) && inserted[0] ? fromDbRow(inserted[0]) : submission;
}

async function updateSubmissionSupabase(id, updateData) {
  const url = `${supabaseBase()}/rest/v1/techhacks_submissions?id=eq.${encodeURIComponent(id)}`;
  const patch = {};

  if (updateData.status) patch.status = updateData.status;
  if (updateData.moderatorNotes !== undefined) patch.moderator_notes = updateData.moderatorNotes;
  if (updateData.isVerified !== undefined) patch.is_verified = Boolean(updateData.isVerified);
  if (updateData.toolData) patch.tool_data = updateData.toolData;
  if (updateData.guideData) patch.guide_data = updateData.guideData;
  if (updateData.publishedSlug) patch.published_slug = updateData.publishedSlug;
  if (updateData.publishedAt) patch.published_at = updateData.publishedAt;
  patch.updated_at = new Date().toISOString();

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...getSupabaseHeaders({ extraHeaders: { Prefer: 'return=representation' } }),
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(supabaseErrorMessage(`Supabase patch failed (${res.status}): ${errorText}`));
  }
  const updated = await res.json();
  return Array.isArray(updated) && updated[0] ? fromDbRow(updated[0]) : null;
}

async function fetchPublishedAdditionsSupabase() {
  const url = `${supabaseBase()}/rest/v1/techhacks_published_additions?key=eq.root&select=data`;
  const config = getSupabaseConfig({ allowPublic: true });
  const res = await fetch(url, {
    method: 'GET',
    headers: buildSupabaseHeaders(config),
  });
  if (!res.ok) {
    throw new Error(supabaseErrorMessage(`Supabase published additions query failed (${res.status})`, true));
  }
  const rows = await res.json();
  if (Array.isArray(rows) && rows[0]?.data) {
    return rows[0].data;
  }
  return { tools: [], guides: [], lastUpdated: '' };
}

async function upsertPublishedAdditionsSupabase(data) {
  const url = `${supabaseBase()}/rest/v1/techhacks_published_additions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders({ extraHeaders: { Prefer: 'resolution=merge-duplicates,return=representation' } }),
    },
    body: JSON.stringify({
      key: 'root',
      data,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(supabaseErrorMessage(`Supabase upsert published additions failed (${res.status}): ${errorText}`));
  }
  return data;
}

// ---------------------------------------------------------------------------
// Upstash REST Implementation
// ---------------------------------------------------------------------------
function upstashBase() {
  return getEnv().UPSTASH_REDIS_REST_URL.replace(/\/+$/, '');
}

function upstashHeaders() {
  return { Authorization: `Bearer ${getEnv().UPSTASH_REDIS_REST_TOKEN}` };
}

async function fetchSubmissionsUpstash() {
  const url = `${upstashBase()}/get/techhacks:submissions`;
  const res = await fetch(url, {
    headers: upstashHeaders(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (data?.result) {
    try {
      return JSON.parse(data.result);
    } catch {}
  }
  return [];
}

async function saveSubmissionsUpstash(submissions) {
  const url = `${upstashBase()}/set/techhacks:submissions`;
  await fetch(url, {
    method: 'POST',
    headers: {
      ...upstashHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissions),
  });
  return submissions;
}

async function fetchPublishedAdditionsUpstash() {
  const url = `${upstashBase()}/get/techhacks:published_additions`;
  const res = await fetch(url, {
    headers: upstashHeaders(),
  });
  if (!res.ok) return { tools: [], guides: [], lastUpdated: new Date().toISOString() };
  const data = await res.json();
  if (data?.result) {
    try {
      return JSON.parse(data.result);
    } catch {}
  }
  return { tools: [], guides: [], lastUpdated: new Date().toISOString() };
}

async function savePublishedAdditionsUpstash(data) {
  const url = `${upstashBase()}/set/techhacks:published_additions`;
  await fetch(url, {
    method: 'POST',
    headers: {
      ...upstashHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return data;
}

// ---------------------------------------------------------------------------
// Unified Storage Adapter Interface
// ---------------------------------------------------------------------------
export async function getSubmissions() {
  const mode = getStorageMode();
  if (mode === 'unconfigured_production' || mode === 'supabase_readonly') return [];
  if (mode === 'supabase') {
    return await fetchSubmissionsSupabase();
  }
  if (mode === 'upstash') {
    try {
      return await fetchSubmissionsUpstash();
    } catch (err) {
      return [];
    }
  }
  return [];
}

export async function saveNewSubmission(submission) {
  const mode = getStorageMode();

  if (isStorageWriteUnavailable(mode)) {
    console.warn('[TechHacks Storage Alert] Write rejected: Serverless/production environment detected without durable storage credentials.');
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Privileged durable storage is not configured. Submissions are temporarily paused to prevent data loss. Configure a server-side Supabase secret or service-role key, or a supported Upstash store.',
      storageMode: mode,
    };
  }

  if (mode === 'supabase') {
    try {
      const inserted = await insertSubmissionSupabase(submission);
      return { success: true, submission: inserted };
    } catch (err) {
      logSanitizedApiError('storage:insert-submission', err, { body: submission });
      return {
        success: false,
        status: 500,
        error: 'DatabaseError',
        message: 'Could not write submission to database. Please try again shortly.',
      };
    }
  }

  if (mode === 'upstash') {
    try {
      const list = await fetchSubmissionsUpstash();
      list.unshift(submission);
      await saveSubmissionsUpstash(list);
      return { success: true, submission };
    } catch (err) {
      logSanitizedApiError('storage:insert-submission', err, { body: submission });
      return { success: false, status: 500, message: err.message };
    }
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Privileged durable storage is not configured.',
    storageMode: mode,
  };
}

export async function updateExistingSubmission(id, patch) {
  const mode = getStorageMode();

  if (isStorageWriteUnavailable(mode)) {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not configured for production moderation updates.',
    };
  }

  if (mode === 'supabase') {
    try {
      const updated = await updateSubmissionSupabase(id, patch);
      if (!updated) {
        return { success: false, status: 404, message: 'Submission not found in database.' };
      }
      return { success: true, submission: updated };
    } catch (err) {
      logSanitizedApiError('storage:update-submission', err, { body: { id, patch } });
      return { success: false, status: 500, message: err.message };
    }
  }

  if (mode === 'upstash') {
    const list = await fetchSubmissionsUpstash();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return { success: false, status: 404, message: 'Submission not found.' };
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    await saveSubmissionsUpstash(list);
    return { success: true, submission: list[idx] };
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Durable database storage is not configured for production moderation updates.',
  };
}

export async function getPublishedAdditions() {
  const mode = getStorageMode();
  if (mode === 'unconfigured_production') return { tools: [], guides: [], lastUpdated: '' };
  if (mode === 'supabase' || mode === 'supabase_readonly') {
    return await fetchPublishedAdditionsSupabase();
  }
  if (mode === 'upstash') {
    return await fetchPublishedAdditionsUpstash();
  }
  return { tools: [], guides: [], lastUpdated: '' };
}

export async function savePublishedAdditions(data) {
  const mode = getStorageMode();

  if (isStorageWriteUnavailable(mode)) {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not configured for published additions.',
    };
  }

  if (mode === 'supabase') {
    try {
      await upsertPublishedAdditionsSupabase(data);
      return { success: true, data };
    } catch (err) {
      logSanitizedApiError('storage:publish-additions', err, { body: data });
      return { success: false, status: 500, message: err.message };
    }
  }

  if (mode === 'upstash') {
    await savePublishedAdditionsUpstash(data);
    return { success: true, data };
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Durable database storage is not configured for published additions.',
  };
}

// ---------------------------------------------------------------------------
// Discoveries Data Mapping & Database Methods
// ---------------------------------------------------------------------------
export function toDiscoveryDbRow(disc = {}) {
  return {
    id: disc.id,
    name: disc.name,
    description: disc.description,
    website_url: disc.websiteUrl,
    image_url: disc.imageUrl || null,
    category: disc.category || null,
    is_featured: Boolean(disc.isFeatured),
    is_new: Boolean(disc.isNew),
    status: disc.status || 'published',
    created_at: disc.createdAt || new Date().toISOString(),
    updated_at: disc.updatedAt || new Date().toISOString(),
  };
}

export function fromDiscoveryDbRow(row = {}) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    websiteUrl: row.website_url,
    imageUrl: row.image_url || undefined,
    category: row.category || undefined,
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    status: row.status || 'published',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchDiscoveriesSupabase(onlyPublished = false) {
  let url = `${supabaseBase()}/rest/v1/techhacks_discoveries?select=*&order=created_at.desc`;
  if (onlyPublished) {
    url += '&status=eq.published';
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: getSupabaseHeaders({ allowPublic: onlyPublished }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(supabaseErrorMessage(`Supabase discoveries query failed (${res.status}): ${errorText}`, onlyPublished));
  }
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(fromDiscoveryDbRow) : [];
}

async function insertDiscoverySupabase(discovery) {
  const url = `${supabaseBase()}/rest/v1/techhacks_discoveries`;
  const row = toDiscoveryDbRow(discovery);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase insert discovery failed (${res.status}): ${errorText}`);
  }
  const inserted = await res.json();
  return Array.isArray(inserted) && inserted[0] ? fromDiscoveryDbRow(inserted[0]) : discovery;
}

async function updateDiscoverySupabase(id, patch) {
  const url = `${supabaseBase()}/rest/v1/techhacks_discoveries?id=eq.${encodeURIComponent(id)}`;
  const dbPatch = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.websiteUrl !== undefined) dbPatch.website_url = patch.websiteUrl;
  if (patch.imageUrl !== undefined) dbPatch.image_url = patch.imageUrl;
  if (patch.category !== undefined) dbPatch.category = patch.category;
  if (patch.isFeatured !== undefined) dbPatch.is_featured = Boolean(patch.isFeatured);
  if (patch.isNew !== undefined) dbPatch.is_new = Boolean(patch.isNew);
  if (patch.status !== undefined) dbPatch.status = patch.status;
  dbPatch.updated_at = new Date().toISOString();

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...getSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify(dbPatch),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase patch discovery failed (${res.status}): ${errorText}`);
  }
  const updated = await res.json();
  return Array.isArray(updated) && updated[0] ? fromDiscoveryDbRow(updated[0]) : null;
}

async function deleteDiscoverySupabase(id) {
  const url = `${supabaseBase()}/rest/v1/techhacks_discoveries?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getSupabaseHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase delete discovery failed (${res.status}): ${errorText}`);
  }
  return true;
}

async function fetchDiscoveriesUpstash() {
  const url = `${upstashBase()}/get/techhacks:discoveries`;
  const res = await fetch(url, {
    headers: upstashHeaders(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (data?.result) {
    try {
      return JSON.parse(data.result);
    } catch {}
  }
  return [];
}

async function saveDiscoveriesUpstash(discoveries) {
  const url = `${upstashBase()}/set/techhacks:discoveries`;
  await fetch(url, {
    method: 'POST',
    headers: {
      ...upstashHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discoveries),
  });
  return discoveries;
}

// Bundled fallback: a static copy of data/discoveries.json (see
// bundledDiscoveries.js). Live Vercel serves these 6 items today with no
// Supabase configured, so the fallback is load-bearing for parity.
function bundledDiscoveriesList() {
  return Array.isArray(bundledDiscoveries) ? [...bundledDiscoveries] : [];
}

export async function getDiscoveries(onlyPublished = false) {
  const mode = getStorageMode();
  let list = [];
  if (mode === 'supabase' || (mode === 'supabase_readonly' && onlyPublished)) {
    try {
      return await fetchDiscoveriesSupabase(onlyPublished);
    } catch (err) {
      logSanitizedApiError('storage:fetch-discoveries', err);
      list = bundledDiscoveriesList();
    }
  } else if (mode === 'supabase_readonly') {
    return [];
  } else if (mode === 'upstash') {
    try {
      list = await fetchDiscoveriesUpstash();
      if (!list || list.length === 0) {
        list = bundledDiscoveriesList();
      }
    } catch (err) {
      list = bundledDiscoveriesList();
    }
  } else {
    list = bundledDiscoveriesList();
  }

  if (onlyPublished) {
    return list.filter((d) => d.status === 'published');
  }
  return list;
}

export async function saveNewDiscovery(discovery) {
  const mode = getStorageMode();

  if (isStorageWriteUnavailable(mode)) {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Privileged durable storage is not configured. Discovery submissions are temporarily paused. Configure a server-side Supabase secret or service-role key, or a supported Upstash store.',
    };
  }

  if (mode === 'supabase') {
    try {
      const inserted = await insertDiscoverySupabase(discovery);
      return { success: true, discovery: inserted };
    } catch (err) {
      logSanitizedApiError('storage:insert-discovery', err, { body: discovery });
      return { success: false, status: 500, error: 'DatabaseError', message: 'Could not save discovery. Please try again later.' };
    }
  }

  if (mode === 'upstash') {
    try {
      const list = await fetchDiscoveriesUpstash();
      list.unshift(discovery);
      await saveDiscoveriesUpstash(list);
      return { success: true, discovery };
    } catch (err) {
      logSanitizedApiError('storage:insert-discovery', err, { body: discovery });
      return { success: false, status: 500, error: 'DatabaseError', message: 'Could not save discovery. Please try again later.' };
    }
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Privileged durable storage is not configured. Discovery submissions are temporarily paused.',
  };
}

export async function updateExistingDiscovery(id, patch) {
  const mode = getStorageMode();

  if (isStorageWriteUnavailable(mode)) {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not configured for production discovery updates.',
    };
  }

  if (mode === 'supabase') {
    try {
      const updated = await updateDiscoverySupabase(id, patch);
      if (!updated) {
        return { success: false, status: 404, message: 'Discovery not found in database.' };
      }
      return { success: true, discovery: updated };
    } catch (err) {
      logSanitizedApiError('storage:update-discovery', err, { body: { id, patch } });
      return { success: false, status: 500, error: 'DatabaseError', message: 'Could not update discovery. Please try again later.' };
    }
  }

  if (mode === 'upstash') {
    const list = await fetchDiscoveriesUpstash();
    const idx = list.findIndex((d) => d.id === id);
    if (idx === -1) return { success: false, status: 404, message: 'Discovery not found.' };
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    await saveDiscoveriesUpstash(list);
    return { success: true, discovery: list[idx] };
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Durable database storage is not configured for production discovery updates.',
  };
}

export async function deleteExistingDiscovery(id) {
  const mode = getStorageMode();

  if (isStorageWriteUnavailable(mode)) {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not configured for production discovery deletions.',
    };
  }

  if (mode === 'supabase') {
    try {
      await deleteDiscoverySupabase(id);
      return { success: true };
    } catch (err) {
      logSanitizedApiError('storage:delete-discovery', err, { body: { id } });
      return { success: false, status: 500, error: 'DatabaseError', message: 'Could not delete discovery. Please try again later.' };
    }
  }

  if (mode === 'upstash') {
    const list = await fetchDiscoveriesUpstash();
    const filtered = list.filter((d) => d.id !== id);
    if (filtered.length === list.length) {
      return { success: false, status: 404, message: 'Discovery not found.' };
    }
    await saveDiscoveriesUpstash(filtered);
    return { success: true };
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Durable database storage is not configured for production discovery deletions.',
  };
}
