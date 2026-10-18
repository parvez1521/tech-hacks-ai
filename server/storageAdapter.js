/**
 * Tech Hacks AI — Durable Storage Adapter
 *
 * Provides a unified storage interface supporting:
 * 1. 'supabase': PostgreSQL via PostgREST HTTP REST API using native fetch (zero dependencies).
 * 2. 'upstash': Serverless Redis via REST API.
 * 3. 'local': Local filesystem JSON storage (data/*.json) for local development and test runners.
 * 4. 'unconfigured_production': Safety mode in serverless/production when cloud DB is missing.
 *    Blocks writes to ephemeral /tmp to eliminate silent data loss.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUNDLED_DATA_DIR = path.resolve(__dirname, '..', 'data');
const LOCAL_SUBMISSIONS_FILE = path.join(BUNDLED_DATA_DIR, 'submissions.json');
const LOCAL_PUBLISHED_FILE = path.join(BUNDLED_DATA_DIR, 'published-additions.json');
const LOCAL_DISCOVERIES_FILE = path.join(BUNDLED_DATA_DIR, 'discoveries.json');

// Determine active storage mode
export function getStorageMode() {
  if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
    return 'supabase';
  }
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return 'upstash';
  }
  // Production / serverless without configured durable storage
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    return 'unconfigured_production';
  }
  return 'local';
}

export function isDurable() {
  const mode = getStorageMode();
  return mode === 'supabase' || mode === 'upstash';
}

export function getStorageStatus() {
  const mode = getStorageMode();
  let provider = 'Local Filesystem (data/*.json)';
  let details = 'Local development storage using data/ directory.';

  if (mode === 'supabase') {
    let host = 'Supabase';
    try {
      host = new URL(process.env.SUPABASE_URL).hostname;
    } catch {}
    provider = 'Supabase (PostgreSQL REST)';
    details = `Connected to Supabase endpoint (${host})`;
  } else if (mode === 'upstash') {
    let host = 'Upstash';
    try {
      host = new URL(process.env.UPSTASH_REDIS_REST_URL).hostname;
    } catch {}
    provider = 'Upstash (Serverless Redis REST)';
    details = `Connected to Upstash endpoint (${host})`;
  } else if (mode === 'unconfigured_production') {
    provider = 'None (Unconfigured Serverless)';
    details = 'Production environment detected without durable storage credentials. Submissions are paused to prevent ephemeral data loss.';
  }

  return {
    mode,
    isDurable: isDurable(),
    isServerless: Boolean(process.env.VERCEL),
    provider,
    readyForProduction: mode === 'supabase' || mode === 'upstash',
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

// Read bundled file safely
function readBundledJson(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return defaultValue;
}

// ---------------------------------------------------------------------------
// Supabase REST Implementation
// ---------------------------------------------------------------------------
function getSupabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

async function fetchSubmissionsSupabase() {
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_submissions?select=*&order=created_at.desc`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getSupabaseHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase query failed (${res.status}): ${errorText}`);
  }
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(fromDbRow) : [];
}

async function insertSubmissionSupabase(submission) {
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_submissions`;
  const row = toDbRow(submission);
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
    throw new Error(`Supabase insert failed (${res.status}): ${errorText}`);
  }
  const inserted = await res.json();
  return Array.isArray(inserted) && inserted[0] ? fromDbRow(inserted[0]) : submission;
}

async function updateSubmissionSupabase(id, updateData) {
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_submissions?id=eq.${encodeURIComponent(id)}`;
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
      ...getSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase patch failed (${res.status}): ${errorText}`);
  }
  const updated = await res.json();
  return Array.isArray(updated) && updated[0] ? fromDbRow(updated[0]) : null;
}

async function fetchPublishedAdditionsSupabase() {
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_published_additions?key=eq.root&select=data`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getSupabaseHeaders(),
  });
  if (!res.ok) {
    return readBundledJson(LOCAL_PUBLISHED_FILE, { tools: [], guides: [], lastUpdated: new Date().toISOString() });
  }
  const rows = await res.json();
  if (Array.isArray(rows) && rows[0]?.data) {
    return rows[0].data;
  }
  return readBundledJson(LOCAL_PUBLISHED_FILE, { tools: [], guides: [], lastUpdated: new Date().toISOString() });
}

async function upsertPublishedAdditionsSupabase(data) {
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_published_additions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders(),
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      key: 'root',
      data,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase upsert published additions failed (${res.status}): ${errorText}`);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Upstash REST Implementation
// ---------------------------------------------------------------------------
async function fetchSubmissionsUpstash() {
  const url = `${process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, '')}/get/techhacks:submissions`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
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
  const url = `${process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, '')}/set/techhacks:submissions`;
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissions),
  });
  return submissions;
}

async function fetchPublishedAdditionsUpstash() {
  const url = `${process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, '')}/get/techhacks:published_additions`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
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
  const url = `${process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, '')}/set/techhacks:published_additions`;
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
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
  if (mode === 'supabase') {
    try {
      return await fetchSubmissionsSupabase();
    } catch (err) {
      console.error('[Storage Error] Failed to fetch from Supabase, falling back to bundled data:', err.message);
      return readBundledJson(LOCAL_SUBMISSIONS_FILE, []);
    }
  }
  if (mode === 'upstash') {
    try {
      return await fetchSubmissionsUpstash();
    } catch (err) {
      return readBundledJson(LOCAL_SUBMISSIONS_FILE, []);
    }
  }
  return readBundledJson(LOCAL_SUBMISSIONS_FILE, []);
}

export async function saveNewSubmission(submission) {
  const mode = getStorageMode();

  if (mode === 'unconfigured_production') {
    console.warn('[TechHacks Storage Alert] Write rejected: Serverless/production environment detected without durable storage credentials.');
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not yet configured for production submissions. Submissions are temporarily paused to prevent data loss. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      storageMode: 'unconfigured_production',
    };
  }

  if (mode === 'supabase') {
    try {
      const inserted = await insertSubmissionSupabase(submission);
      return { success: true, submission: inserted };
    } catch (err) {
      console.error('[Storage Error] Failed to insert submission to Supabase:', err.message);
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
      return { success: false, status: 500, message: err.message };
    }
  }

  // Local file storage
  const list = readBundledJson(LOCAL_SUBMISSIONS_FILE, []);
  list.unshift(submission);
  const tempFile = `${LOCAL_SUBMISSIONS_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf8');
  fs.renameSync(tempFile, LOCAL_SUBMISSIONS_FILE);
  return { success: true, submission };
}

export async function updateExistingSubmission(id, patch) {
  const mode = getStorageMode();

  if (mode === 'unconfigured_production') {
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

  // Local
  const list = readBundledJson(LOCAL_SUBMISSIONS_FILE, []);
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return { success: false, status: 404, message: 'Submission not found.' };
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  const tempFile = `${LOCAL_SUBMISSIONS_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf8');
  fs.renameSync(tempFile, LOCAL_SUBMISSIONS_FILE);
  return { success: true, submission: list[idx] };
}

export async function getPublishedAdditions() {
  const mode = getStorageMode();
  if (mode === 'supabase') {
    try {
      return await fetchPublishedAdditionsSupabase();
    } catch (err) {
      return readBundledJson(LOCAL_PUBLISHED_FILE, { tools: [], guides: [], lastUpdated: new Date().toISOString() });
    }
  }
  if (mode === 'upstash') {
    return await fetchPublishedAdditionsUpstash();
  }
  return readBundledJson(LOCAL_PUBLISHED_FILE, { tools: [], guides: [], lastUpdated: new Date().toISOString() });
}

export async function savePublishedAdditions(data) {
  const mode = getStorageMode();

  if (mode === 'unconfigured_production') {
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
      return { success: false, status: 500, message: err.message };
    }
  }

  if (mode === 'upstash') {
    await savePublishedAdditionsUpstash(data);
    return { success: true, data };
  }

  // Local
  const tempFile = `${LOCAL_PUBLISHED_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, LOCAL_PUBLISHED_FILE);
  return { success: true, data };
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
  let url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_discoveries?select=*&order=created_at.desc`;
  if (onlyPublished) {
    url += '&status=eq.published';
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: getSupabaseHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase discoveries query failed (${res.status}): ${errorText}`);
  }
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(fromDiscoveryDbRow) : [];
}

async function insertDiscoverySupabase(discovery) {
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_discoveries`;
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
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_discoveries?id=eq.${encodeURIComponent(id)}`;
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
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/techhacks_discoveries?id=eq.${encodeURIComponent(id)}`;
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
  const url = `${process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, '')}/get/techhacks:discoveries`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
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
  const url = `${process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, '')}/set/techhacks:discoveries`;
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discoveries),
  });
  return discoveries;
}

export async function getDiscoveries(onlyPublished = false) {
  const mode = getStorageMode();
  let list = [];
  if (mode === 'supabase') {
    try {
      return await fetchDiscoveriesSupabase(onlyPublished);
    } catch (err) {
      console.error('[Storage Error] Failed to fetch discoveries from Supabase, falling back to local file:', err.message);
      list = readBundledJson(LOCAL_DISCOVERIES_FILE, []);
    }
  } else if (mode === 'upstash') {
    try {
      list = await fetchDiscoveriesUpstash();
      if (!list || list.length === 0) {
        list = readBundledJson(LOCAL_DISCOVERIES_FILE, []);
      }
    } catch (err) {
      list = readBundledJson(LOCAL_DISCOVERIES_FILE, []);
    }
  } else {
    list = readBundledJson(LOCAL_DISCOVERIES_FILE, []);
  }

  if (onlyPublished) {
    return list.filter((d) => d.status === 'published');
  }
  return list;
}

export async function saveNewDiscovery(discovery) {
  const mode = getStorageMode();

  if (mode === 'unconfigured_production') {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not configured for production discoveries. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    };
  }

  if (mode === 'supabase') {
    try {
      const inserted = await insertDiscoverySupabase(discovery);
      return { success: true, discovery: inserted };
    } catch (err) {
      return { success: false, status: 500, message: err.message };
    }
  }

  if (mode === 'upstash') {
    try {
      const list = await fetchDiscoveriesUpstash();
      list.unshift(discovery);
      await saveDiscoveriesUpstash(list);
      return { success: true, discovery };
    } catch (err) {
      return { success: false, status: 500, message: err.message };
    }
  }

  // Local
  const list = readBundledJson(LOCAL_DISCOVERIES_FILE, []);
  list.unshift(discovery);
  const tempFile = `${LOCAL_DISCOVERIES_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf8');
  fs.renameSync(tempFile, LOCAL_DISCOVERIES_FILE);
  return { success: true, discovery };
}

export async function updateExistingDiscovery(id, patch) {
  const mode = getStorageMode();

  if (mode === 'unconfigured_production') {
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
      return { success: false, status: 500, message: err.message };
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

  // Local
  const list = readBundledJson(LOCAL_DISCOVERIES_FILE, []);
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return { success: false, status: 404, message: 'Discovery not found.' };
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  const tempFile = `${LOCAL_DISCOVERIES_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf8');
  fs.renameSync(tempFile, LOCAL_DISCOVERIES_FILE);
  return { success: true, discovery: list[idx] };
}

export async function deleteExistingDiscovery(id) {
  const mode = getStorageMode();

  if (mode === 'unconfigured_production') {
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
      return { success: false, status: 500, message: err.message };
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

  // Local
  const list = readBundledJson(LOCAL_DISCOVERIES_FILE, []);
  const filtered = list.filter((d) => d.id !== id);
  if (filtered.length === list.length) {
    return { success: false, status: 404, message: 'Discovery not found.' };
  }
  const tempFile = `${LOCAL_DISCOVERIES_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(filtered, null, 2), 'utf8');
  fs.renameSync(tempFile, LOCAL_DISCOVERIES_FILE);
  return { success: true };
}

