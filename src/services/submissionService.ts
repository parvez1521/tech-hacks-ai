import type {
  ToolSubmissionData,
  GuideSubmissionData,
  CommunitySubmission,
  SubmissionResponse,
  ModerationFilterState,
} from '../types/submissions.ts';
import { aiToolsData } from '../data/aiToolsData.ts';
import { toolsData } from '../data/seedData.ts';

const MODERATOR_TOKEN_KEY = 'th_mod_token';

// In-memory token fallback for SSR or environments without sessionStorage
let sessionTokenMemory: string | null = null;

export function getStoredModeratorToken(): string | null {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      return window.sessionStorage.getItem(MODERATOR_TOKEN_KEY) || sessionTokenMemory;
    } catch {
      return sessionTokenMemory;
    }
  }
  return sessionTokenMemory;
}

export function setStoredModeratorToken(token: string): void {
  sessionTokenMemory = token;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(MODERATOR_TOKEN_KEY, token);
    } catch {
      // Storage blocked or quota
    }
  }
}

export function clearStoredModeratorToken(): void {
  sessionTokenMemory = null;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.removeItem(MODERATOR_TOKEN_KEY);
    } catch {
      // Ignore
    }
  }
}

// Instant client-side duplicate pre-check for Tool form
export function checkClientToolDuplicate(
  name: string,
  websiteUrl: string
): { isDuplicate: boolean; reason?: string; matchName?: string; matchSlug?: string } {
  const normName = (name || '').toLowerCase().trim().replace(/[^\w]/g, '');

  let domain = '';
  try {
    const cleanUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
    domain = new URL(cleanUrl).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    domain = '';
  }

  if (!normName && !domain) {
    return { isDuplicate: false };
  }

  // 1. Check AI Tools
  for (const tool of aiToolsData) {
    const toolNorm = tool.name.toLowerCase().trim().replace(/[^\w]/g, '');
    let toolDomain = '';
    try {
      toolDomain = new URL(tool.websiteUrl).hostname.replace(/^www\./i, '').toLowerCase();
    } catch {}

    if (normName && toolNorm === normName) {
      return {
        isDuplicate: true,
        reason: `"${tool.name}" is already cataloged in the AI Tools Directory.`,
        matchName: tool.name,
        matchSlug: `/ai-tools/${tool.slug}`,
      };
    }

    if (domain && toolDomain && domain === toolDomain) {
      return {
        isDuplicate: true,
        reason: `The domain "${domain}" is already linked to "${tool.name}".`,
        matchName: tool.name,
        matchSlug: `/ai-tools/${tool.slug}`,
      };
    }
  }

  // 2. Check Open Source Tools
  for (const tool of toolsData) {
    const toolNorm = tool.name.toLowerCase().trim().replace(/[^\w]/g, '');
    let toolDomain = '';
    try {
      toolDomain = new URL(tool.websiteUrl).hostname.replace(/^www\./i, '').toLowerCase();
    } catch {}

    if (normName && toolNorm === normName) {
      return {
        isDuplicate: true,
        reason: `"${tool.name}" is already in the Open Source Catalog.`,
        matchName: tool.name,
        matchSlug: `/tools/${tool.slug}`,
      };
    }

    if (domain && toolDomain && domain === toolDomain) {
      return {
        isDuplicate: true,
        reason: `The domain "${domain}" is already cataloged as "${tool.name}".`,
        matchName: tool.name,
        matchSlug: `/tools/${tool.slug}`,
      };
    }
  }

  return { isDuplicate: false };
}

// Client API: Submit a tool
export async function submitTool(
  data: ToolSubmissionData,
  honeypot = ''
): Promise<SubmissionResponse> {
  try {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'tool',
        ...data,
        website_hp: honeypot,
      }),
    });

    const resData = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: resData.message || resData.error || 'Failed to submit tool.',
        errors: resData.errors,
      };
    }

    return {
      success: true,
      id: resData.id,
      message: resData.message,
      potentialDuplicate: resData.potentialDuplicate,
      duplicateReason: resData.duplicateReason,
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.message ||
        'Unable to connect to submission server. Please check your internet connection and try again.',
    };
  }
}

// Client API: Submit a guide
export async function submitGuide(
  data: GuideSubmissionData,
  honeypot = ''
): Promise<SubmissionResponse> {
  try {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'guide',
        ...data,
        website_hp: honeypot,
      }),
    });

    const resData = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: resData.message || resData.error || 'Failed to submit guide.',
        errors: resData.errors,
      };
    }

    return {
      success: true,
      id: resData.id,
      message: resData.message,
      potentialDuplicate: resData.potentialDuplicate,
      duplicateReason: resData.duplicateReason,
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.message ||
        'Unable to connect to submission server. Please check your internet connection and try again.',
    };
  }
}

// Moderator: Fetch submissions queue
export async function fetchSubmissions(
  token: string,
  filters?: ModerationFilterState
): Promise<{ success: boolean; submissions: CommunitySubmission[]; error?: string }> {
  try {
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.searchQuery) params.set('q', filters.searchQuery);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`/api/submissions${qs}`, {
      method: 'GET',
      headers: {
        'x-admin-token': token,
      },
    });

    if (response.status === 401) {
      return { success: false, submissions: [], error: 'Unauthorized moderator access key.' };
    }

    const data = await response.json();
    if (!response.ok) {
      return { success: false, submissions: [], error: data.error || 'Failed to fetch submissions.' };
    }

    return { success: true, submissions: data.submissions || [] };
  } catch (err: any) {
    return { success: false, submissions: [], error: err?.message || 'Server connection error.' };
  }
}

// Moderator: Update status, notes, or edited fields
export async function updateSubmission(
  id: string,
  updateData: Partial<CommunitySubmission>,
  token: string
): Promise<{ success: boolean; submission?: CommunitySubmission; error?: string }> {
  try {
    const response = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify(updateData),
    });

    if (response.status === 401) {
      return { success: false, error: 'Unauthorized moderator access key.' };
    }

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update submission.' };
    }

    return { success: true, submission: data.submission };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server connection error.' };
  }
}

// Moderator: Publish to catalog
export async function publishSubmission(
  id: string,
  token: string
): Promise<{ success: boolean; publishedSlug?: string; publishedUrl?: string; message?: string; error?: string }> {
  try {
    const response = await fetch(`/api/submissions?action=publish&id=${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
    });

    if (response.status === 401) {
      return { success: false, error: 'Unauthorized moderator access key.' };
    }

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to publish submission.' };
    }

    return {
      success: true,
      publishedSlug: data.publishedSlug,
      publishedUrl: data.publishedUrl,
      message: data.message,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server connection error.' };
  }
}
