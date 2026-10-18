import type { ToolDiscovery, DiscoveryFormData, DiscoveriesFilterState } from '../types/discoveries.ts';

/**
 * Client-side outbound URL sanitizer.
 * Strictly guarantees that only safe http: and https: links can be opened.
 * Rejects javascript:, data:, vbscript:, and malformed targets.
 */
export function sanitizeOutboundUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // Explicitly deny script protocols
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return '';
  }

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Public: Fetch published daily tool discoveries.
 */
export async function fetchPublishedDiscoveries(
  filters?: DiscoveriesFilterState
): Promise<{ success: boolean; discoveries: ToolDiscovery[]; error?: string }> {
  try {
    const params = new URLSearchParams();
    if (filters?.featuredOnly) params.set('featured', 'true');
    if (filters?.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters?.searchQuery) params.set('q', filters.searchQuery);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/discoveries${qs}`, {
      method: 'GET',
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, discoveries: [], error: data.error || 'Failed to load discoveries.' };
    }

    const data = await res.json();
    return { success: true, discoveries: data.discoveries || [] };
  } catch (err: any) {
    return {
      success: false,
      discoveries: [],
      error: err?.message || 'Could not connect to discoveries service.',
    };
  }
}

/**
 * Moderator / Admin: Fetch all discoveries including drafts.
 */
export async function fetchAdminDiscoveries(
  token: string,
  filters?: DiscoveriesFilterState
): Promise<{ success: boolean; discoveries: ToolDiscovery[]; error?: string }> {
  try {
    const params = new URLSearchParams({ all: 'true' });
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.searchQuery) params.set('q', filters.searchQuery);
    if (filters?.category && filters.category !== 'all') params.set('category', filters.category);

    const res = await fetch(`/api/discoveries?${params.toString()}`, {
      method: 'GET',
      headers: {
        'x-admin-token': token,
      },
    });

    if (res.status === 401) {
      return { success: false, discoveries: [], error: 'Unauthorized moderator access key.' };
    }

    const data = await res.json();
    if (!res.ok) {
      return { success: false, discoveries: [], error: data.error || 'Failed to load discoveries.' };
    }

    return { success: true, discoveries: data.discoveries || [] };
  } catch (err: any) {
    return { success: false, discoveries: [], error: err?.message || 'Connection error.' };
  }
}

/**
 * Admin: Create a new tool discovery.
 */
export async function createDiscovery(
  formData: DiscoveryFormData,
  token: string
): Promise<{ success: boolean; discovery?: ToolDiscovery; error?: string; message?: string }> {
  try {
    const res = await fetch('/api/discoveries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify(formData),
    });

    if (res.status === 401) {
      return { success: false, error: 'Unauthorized moderator access key.' };
    }

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || data.message || 'Failed to create discovery.' };
    }

    return { success: true, discovery: data.discovery, message: data.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Connection error while creating discovery.' };
  }
}

/**
 * Admin: Update an existing tool discovery.
 */
export async function updateDiscovery(
  id: string,
  updateData: Partial<DiscoveryFormData>,
  token: string
): Promise<{ success: boolean; discovery?: ToolDiscovery; error?: string; message?: string }> {
  try {
    const res = await fetch(`/api/discoveries?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify(updateData),
    });

    if (res.status === 401) {
      return { success: false, error: 'Unauthorized moderator access key.' };
    }

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || data.message || 'Failed to update discovery.' };
    }

    return { success: true, discovery: data.discovery, message: data.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Connection error while updating discovery.' };
  }
}

/**
 * Admin: Delete an existing tool discovery.
 */
export async function deleteDiscovery(
  id: string,
  token: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const res = await fetch(`/api/discoveries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': token,
      },
    });

    if (res.status === 401) {
      return { success: false, error: 'Unauthorized moderator access key.' };
    }

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || data.message || 'Failed to delete discovery.' };
    }

    return { success: true, message: data.message || 'Discovery deleted successfully.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Connection error while deleting discovery.' };
  }
}

/**
 * Admin: Toggle discovery status between 'published' and 'draft'.
 */
export async function toggleDiscoveryStatus(
  id: string,
  currentStatus: 'draft' | 'published',
  token: string
): Promise<{ success: boolean; discovery?: ToolDiscovery; error?: string }> {
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  return updateDiscovery(id, { status: newStatus }, token);
}

/**
 * Admin: Toggle discovery featured flag.
 */
export async function toggleDiscoveryFeatured(
  id: string,
  currentFeatured: boolean,
  token: string
): Promise<{ success: boolean; discovery?: ToolDiscovery; error?: string }> {
  return updateDiscovery(id, { isFeatured: !currentFeatured }, token);
}
