import {
  getDiscoveries as fetchDiscoveriesFromAdapter,
  saveNewDiscovery as saveDiscoveryToAdapter,
  updateExistingDiscovery as updateDiscoveryInAdapter,
  deleteExistingDiscovery as deleteDiscoveryFromAdapter,
  getStorageMode,
  isDurable,
  getStorageStatus,
} from './storageAdapter.js';
import { isAuthorized, ADMIN_SECRET } from './submissionsStore.js';

export { getStorageMode, isDurable, getStorageStatus, isAuthorized, ADMIN_SECRET };

/**
 * Validates that a string is a safe HTTP or HTTPS URL.
 * Strictly disallows dangerous protocols (javascript:, data:, vbscript:, file:).
 */
export function isValidHttpUrl(stringUrl) {
  if (!stringUrl || typeof stringUrl !== 'string') return false;
  const trimmed = stringUrl.trim();

  // Reject script injections or non-http protocols
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return false;
  }

  // Prepend https:// if protocol is omitted to parse domain
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = 'https://' + candidate;
  }

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitizes and normalizes an outbound HTTP/HTTPS URL.
 */
export function sanitizeUrl(stringUrl) {
  if (!isValidHttpUrl(stringUrl)) return '';
  let clean = stringUrl.trim();
  if (!/^https?:\/\//i.test(clean)) {
    clean = 'https://' + clean;
  }
  try {
    const parsed = new URL(clean);
    // Strip common tracking params
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'fbclid', 'gclid'].forEach(
      (param) => parsed.searchParams.delete(param)
    );
    let pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return `${parsed.protocol}//${parsed.host}${pathname}${parsed.search}`;
  } catch {
    return clean;
  }
}

/**
 * Validates payload for creating or updating a tool discovery.
 */
export function validateDiscoveryPayload(data = {}, isUpdate = false) {
  const errors = [];

  // Name validation
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Tool name is required (minimum 2 characters).');
    } else if (data.name.trim().length > 120) {
      errors.push('Tool name must not exceed 120 characters.');
    }
  }

  // Description validation
  if (!isUpdate || data.description !== undefined) {
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
      errors.push('Short description is required (minimum 10 characters).');
    } else if (data.description.trim().length > 600) {
      errors.push('Short description must not exceed 600 characters.');
    }
  }

  // Website URL validation
  if (!isUpdate || data.websiteUrl !== undefined) {
    if (!data.websiteUrl || typeof data.websiteUrl !== 'string') {
      errors.push('Website URL is required.');
    } else if (!isValidHttpUrl(data.websiteUrl)) {
      errors.push('Website URL must be a valid HTTP or HTTPS address. Unsafe protocols (e.g. javascript:) are rejected.');
    }
  }

  // Optional Image URL validation
  if (data.imageUrl) {
    if (!isValidHttpUrl(data.imageUrl)) {
      errors.push('Image/logo URL must be a valid HTTP or HTTPS address.');
    }
  }

  // Optional Category validation
  if (data.category && typeof data.category === 'string' && data.category.length > 80) {
    errors.push('Category must not exceed 80 characters.');
  }

  // Status validation
  if (data.status !== undefined) {
    if (data.status !== 'draft' && data.status !== 'published') {
      errors.push('Status must be either "draft" or "published".');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Fetch discoveries list with permissions and filtering.
 */
export async function getDiscoveriesListAsync({
  isAdmin = false,
  status = 'all',
  searchQuery = '',
  featuredOnly = false,
  category = '',
} = {}) {
  // Public users only ever see published discoveries
  const onlyPublished = !isAdmin;
  let discoveries = await fetchDiscoveriesFromAdapter(onlyPublished);

  // Status filter (for admin)
  if (isAdmin && status && status !== 'all') {
    discoveries = discoveries.filter((d) => d.status === status);
  }

  // Featured only filter
  if (featuredOnly) {
    discoveries = discoveries.filter((d) => Boolean(d.isFeatured));
  }

  // Category filter
  if (category && category !== 'all') {
    const normCat = category.toLowerCase().trim();
    discoveries = discoveries.filter((d) => (d.category || '').toLowerCase().trim() === normCat);
  }

  // Search query filter
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    discoveries = discoveries.filter((d) => {
      const name = (d.name || '').toLowerCase();
      const desc = (d.description || '').toLowerCase();
      const cat = (d.category || '').toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }

  return discoveries;
}

/**
 * Get a single discovery by ID.
 */
export async function getDiscoveryByIdAsync(id, { isAdmin = false } = {}) {
  const all = await fetchDiscoveriesFromAdapter(!isAdmin);
  const item = all.find((d) => d.id === id);
  if (!item) return null;
  if (!isAdmin && item.status !== 'published') {
    return null;
  }
  return item;
}

/**
 * Create a new tool discovery (Admin only).
 */
export async function createDiscoveryAsync(payload, headers) {
  if (!isAuthorized(headers)) {
    return {
      success: false,
      status: 401,
      error: 'Unauthorized. Moderator access token required.',
    };
  }

  const validation = validateDiscoveryPayload(payload, false);
  if (!validation.isValid) {
    return {
      success: false,
      status: 400,
      error: validation.errors.join(' '),
      validationErrors: validation.errors,
    };
  }

  const now = new Date().toISOString();
  const id = `disc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const newDiscovery = {
    id,
    name: payload.name.trim(),
    description: payload.description.trim(),
    websiteUrl: sanitizeUrl(payload.websiteUrl),
    imageUrl: payload.imageUrl ? sanitizeUrl(payload.imageUrl) : undefined,
    category: payload.category ? payload.category.trim() : 'General',
    isFeatured: Boolean(payload.isFeatured),
    isNew: payload.isNew !== undefined ? Boolean(payload.isNew) : true,
    status: payload.status || 'published',
    createdAt: now,
    updatedAt: now,
  };

  const result = await saveDiscoveryToAdapter(newDiscovery);
  if (!result.success) {
    return {
      success: false,
      status: result.status || 500,
      error: result.error || 'DatabaseError',
      message: result.message || 'Failed to save discovery.',
    };
  }

  return {
    success: true,
    status: 201,
    discovery: result.discovery,
    message: `Tool discovery "${newDiscovery.name}" created successfully.`,
  };
}

/**
 * Update an existing discovery (Admin only).
 */
export async function updateDiscoveryAsync(id, payload, headers) {
  if (!isAuthorized(headers)) {
    return {
      success: false,
      status: 401,
      error: 'Unauthorized. Moderator access token required.',
    };
  }

  if (!id) {
    return { success: false, status: 400, error: 'Discovery ID is required.' };
  }

  const validation = validateDiscoveryPayload(payload, true);
  if (!validation.isValid) {
    return {
      success: false,
      status: 400,
      error: validation.errors.join(' '),
      validationErrors: validation.errors,
    };
  }

  const patch = {};
  if (payload.name !== undefined) patch.name = payload.name.trim();
  if (payload.description !== undefined) patch.description = payload.description.trim();
  if (payload.websiteUrl !== undefined) patch.websiteUrl = sanitizeUrl(payload.websiteUrl);
  if (payload.imageUrl !== undefined) patch.imageUrl = payload.imageUrl ? sanitizeUrl(payload.imageUrl) : '';
  if (payload.category !== undefined) patch.category = payload.category.trim();
  if (payload.isFeatured !== undefined) patch.isFeatured = Boolean(payload.isFeatured);
  if (payload.isNew !== undefined) patch.isNew = Boolean(payload.isNew);
  if (payload.status !== undefined) patch.status = payload.status;

  const result = await updateDiscoveryInAdapter(id, patch);
  if (!result.success) {
    return {
      success: false,
      status: result.status || 500,
      error: result.error || 'DatabaseError',
      message: result.message || 'Failed to update discovery.',
    };
  }

  return {
    success: true,
    status: 200,
    discovery: result.discovery,
    message: 'Discovery updated successfully.',
  };
}

/**
 * Delete a discovery (Admin only).
 */
export async function deleteDiscoveryAsync(id, headers) {
  if (!isAuthorized(headers)) {
    return {
      success: false,
      status: 401,
      error: 'Unauthorized. Moderator access token required.',
    };
  }

  if (!id) {
    return { success: false, status: 400, error: 'Discovery ID is required.' };
  }

  const result = await deleteDiscoveryFromAdapter(id);
  if (!result.success) {
    return {
      success: false,
      status: result.status || 500,
      error: result.error || 'DatabaseError',
      message: result.message || 'Failed to delete discovery.',
    };
  }

  return {
    success: true,
    status: 200,
    message: 'Discovery deleted successfully.',
  };
}
