// Cloudflare port of server/submissionsStore.js (main @ 52e05b3).
//
// Differences from the Vercel original:
// - `fs` / `path` / `node:crypto` / `Buffer` are REMOVED: Workers have no
//   filesystem and no Node crypto module. All sync file functions
//   (initStore, read/writeSubmissions, read/writePublishedAdditions,
//   getSubmissionsQueue, updateSubmissionStatus, publishSubmissionToCatalog)
//   are DROPPED — only the async storage-adapter paths remain. There is no
//   local mode on Cloudflare; without durable creds the adapter reports
//   `unconfigured_production` and writes are refused with 503, exactly as
//   Vercel prod behaves today.
// - `timingSafeEqual` is replaced by a pure-JS constant-time compare
//   (TextEncoder + XOR accumulation).
// - The catalog duplicate checks use STATIC imports of aiToolsData /
//   guidesData (dynamic `import()` of .ts would split the Function bundle;
//   static imports are bundled by esbuild and work in Node strip-types
//   tests too).
// - `ADMIN_SECRET` is read PER REQUEST via getConfiguredAdminSecret().
//   The original's module-level `ADMIN_SECRET`/`ADMIN_TOKEN` consts and
//   load-time warning are dropped: on Cloudflare a module is imported
//   before the first request binds env, so a top-level read would see an
//   empty env and warn falsely. `isAuthorized` already re-reads per call.
import { getEnv } from './env.js';
import {
  getStorageMode,
  isDurable,
  getStorageStatus,
  getSubmissions as fetchSubmissionsFromAdapter,
  saveNewSubmission as saveSubmissionToAdapter,
  updateExistingSubmission as updateSubmissionInAdapter,
  getPublishedAdditions as fetchPublishedAdditionsFromAdapter,
  savePublishedAdditions as savePublishedAdditionsToAdapter,
} from './storageAdapter.js';
import { aiToolsData } from '../../src/data/aiToolsData.ts';
import { guidesData } from '../../src/data/guidesData.ts';

export { getStorageMode, isDurable, getStorageStatus };

// Admin access requires an explicit secret in every environment.
// There is no fallback credential in source: admin access stays disabled
// until ADMIN_SECRET is configured in the deployment environment.
export function getConfiguredAdminSecret() {
  return getEnv().ADMIN_SECRET?.trim() || '';
}

// In-memory rate limiting map: ip -> timestamps[]
// On Cloudflare this map is per-isolate (same best-effort caveat the
// original documents for per-instance maps).
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

// Helper: Normalize URL
export function normalizeUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return '';
  let clean = urlStr.trim();
  clean = clean.replace(/^http:\/\//i, 'https://');
  if (!/^https?:\/\//i.test(clean)) {
    clean = 'https://' + clean;
  }
  try {
    const parsed = new URL(clean);
    // Strip common tracking params
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'fbclid', 'gclid'].forEach(
      (param) => parsed.searchParams.delete(param)
    );
    // Remove trailing slash from pathname if root
    let pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return `${parsed.protocol}//${parsed.host}${pathname}${parsed.search}`;
  } catch {
    return clean;
  }
}

// Helper: Extract domain/host
export function extractDomain(urlStr) {
  try {
    const parsed = new URL(normalizeUrl(urlStr));
    return parsed.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
}

// Helper: Slugify string
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Rate limit check
export function checkRateLimit(ip = 'unknown') {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

// Constant-time string comparison (Workers have no node:crypto).
function safelyMatchesSecret(candidate, secret) {
  if (typeof candidate !== 'string' || typeof secret !== 'string') return false;
  const encoder = new TextEncoder();
  const candidateBytes = encoder.encode(candidate);
  const secretBytes = encoder.encode(secret);
  if (candidateBytes.length !== secretBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < candidateBytes.length; i++) diff |= candidateBytes[i] ^ secretBytes[i];
  return diff === 0;
}

// Check admin authorization
export function isAuthorized(headers = {}) {
  if (!headers) return false;
  const secret = getConfiguredAdminSecret();
  if (!secret) return false;
  if (typeof headers === 'string') {
    return safelyMatchesSecret(headers, secret);
  }
  const authHeader = headers['authorization'] || headers['Authorization'] || '';
  const tokenHeader = headers['x-admin-token'] || headers['X-Admin-Token'] || '';

  if (safelyMatchesSecret(tokenHeader, secret)) {
    return true;
  }

  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (safelyMatchesSecret(token, secret)) {
      return true;
    }
  }

  return false;
}

export function verifyAdminToken(token) {
  return isAuthorized(token);
}

export async function getSubmissionsQueueAsync(headers) {
  if (!isAuthorized(headers)) {
    return { success: false, error: 'Unauthorized', submissions: [] };
  }
  const subs = await fetchSubmissionsFromAdapter();
  return { success: true, submissions: subs };
}

// Async adapter reads used by the api routes (the sync file reads from the
// Vercel original do not exist in this port — see header).
export async function readSubmissionsAsync() {
  return fetchSubmissionsFromAdapter();
}

export async function readPublishedAdditionsAsync() {
  return fetchPublishedAdditionsFromAdapter();
}

// Check duplicate tool against catalog & submissions
export async function checkToolDuplicate(name, websiteUrl) {
  const normName = (name || '').toLowerCase().trim().replace(/[^\w]/g, '');
  const domain = extractDomain(websiteUrl);

  const submissions = await fetchSubmissionsFromAdapter();

  // 1. Check existing submissions
  for (const sub of submissions) {
    if (sub.toolData) {
      const subNorm = sub.toolData.name.toLowerCase().trim().replace(/[^\w]/g, '');
      const subDomain = extractDomain(sub.toolData.websiteUrl);

      if (normName && subNorm === normName) {
        return {
          isDuplicate: true,
          reason: `A tool named "${sub.toolData.name}" was already submitted (Status: ${sub.status}).`,
          matches: [sub.toolData.name],
        };
      }
      if (domain && subDomain && domain === subDomain) {
        return {
          isDuplicate: true,
          reason: `The website domain "${domain}" matches an existing submission for "${sub.toolData.name}".`,
          matches: [sub.toolData.name],
        };
      }
    }
  }

  // 2. Check catalog aiToolsData
  const aiTools = aiToolsData || [];
  for (const tool of aiTools) {
    const toolNorm = tool.name.toLowerCase().trim().replace(/[^\w]/g, '');
    const toolDomain = extractDomain(tool.websiteUrl);

    const isNameMatch =
      normName &&
      (toolNorm === normName ||
        tool.name.toLowerCase().trim() === name.toLowerCase().trim() ||
        tool.slug === slugify(name));

    if (isNameMatch) {
      return {
        isDuplicate: true,
        reason: `"${tool.name}" is already cataloged in the AI Tools Directory (/ai-tools/${tool.slug}).`,
        matches: [tool.name, tool.slug],
      };
    }
    if (domain && toolDomain && domain === toolDomain) {
      return {
        isDuplicate: true,
        reason: `The domain "${domain}" is already cataloged as "${tool.name}" (/ai-tools/${tool.slug}).`,
        matches: [tool.name, tool.slug],
      };
    }
  }

  return { isDuplicate: false };
}

// Check duplicate guide
export async function checkGuideDuplicate(title) {
  const normTitle = (title || '').toLowerCase().trim().replace(/[^\w]/g, '');
  const submissions = await fetchSubmissionsFromAdapter();

  for (const sub of submissions) {
    if (sub.guideData) {
      const subNorm = sub.guideData.title.toLowerCase().trim().replace(/[^\w]/g, '');
      if (normTitle && subNorm === normTitle) {
        return {
          isDuplicate: true,
          reason: `A guide with the title "${sub.guideData.title}" was already submitted (Status: ${sub.status}).`,
          matches: [sub.guideData.title],
        };
      }
    }
  }

  const guides = guidesData || [];
  for (const guide of guides) {
    const guideNorm = guide.title.toLowerCase().trim().replace(/[^\w]/g, '');
    if (normTitle && guideNorm === normTitle) {
      return {
        isDuplicate: true,
        reason: `"${guide.title}" already exists in the Guides catalog (/guides/${guide.slug}).`,
        matches: [guide.title, guide.slug],
      };
    }
  }

  return { isDuplicate: false };
}

// Validate and create tool submission
export async function createToolSubmission(data, clientIp = '127.0.0.1') {
  // Anti-spam honeypot
  if (data.website_hp && String(data.website_hp).trim().length > 0) {
    return {
      success: false,
      status: 400,
      message: 'Spam submission detected by honeypot verification.',
    };
  }

  // Rate limiting
  if (!checkRateLimit(clientIp)) {
    return {
      success: false,
      status: 429,
      message: 'Too many submissions. Please wait 10 minutes before submitting again.',
    };
  }

  // Validation
  const errors = {};
  const name = String(data.name || '').trim();
  const websiteUrl = normalizeUrl(data.websiteUrl);
  const description = String(data.description || data.shortDescription || '').trim();
  const category = String(data.category || '').trim();
  const pricingType = String(data.pricingType || '').toLowerCase().trim();

  if (!name || name.length < 2 || name.length > 80) {
    errors.name = 'Tool name must be between 2 and 80 characters.';
  }

  if (!websiteUrl || !/^https?:\/\/.+\..+/i.test(websiteUrl)) {
    errors.websiteUrl = 'Please provide a valid official website URL starting with http:// or https://.';
  }

  if (!description || description.length < 20 || description.length > 500) {
    errors.description = 'Description must be between 20 and 500 characters.';
  }

  if (!category) {
    errors.category = 'Please select a tool category.';
  }

  const validPricing = ['free', 'freemium', 'paid', 'open-source'];
  if (!pricingType || !validPricing.includes(pricingType)) {
    errors.pricingType = 'Pricing type must be Free, Freemium, Paid, or Open Source.';
  }

  if (data.submitterEmail) {
    const email = String(data.submitterEmail).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.submitterEmail = 'Please provide a valid email address.';
    }
  }

  if (data.logoUrl) {
    const logoUrl = normalizeUrl(data.logoUrl);
    if (!/^https?:\/\/.+\..+/i.test(logoUrl)) {
      errors.logoUrl = 'Logo URL must be a valid http:// or https:// address.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      status: 400,
      message: 'Please resolve the highlighted validation errors.',
      errors,
    };
  }

  // Duplicate Check
  const dupCheck = await checkToolDuplicate(name, websiteUrl);

  const newSubmission = {
    id: `sub_tool_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'tool',
    status: 'pending', // ALWAYS forced to pending for public submissions
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    toolData: {
      name,
      websiteUrl,
      description,
      category,
      pricingType,
      logoUrl: data.logoUrl ? normalizeUrl(data.logoUrl) : undefined,
      features: Array.isArray(data.features || data.keyFeatures)
        ? (data.features || data.keyFeatures).map(String).map((f) => f.trim()).filter(Boolean)
        : typeof (data.features || data.keyFeatures) === 'string'
        ? (data.features || data.keyFeatures).split(',').map((f) => f.trim()).filter(Boolean)
        : [],
      platform: Array.isArray(data.platform || data.platforms)
        ? (data.platform || data.platforms).map(String).map((p) => p.trim()).filter(Boolean)
        : typeof (data.platform || data.platforms) === 'string'
        ? (data.platform || data.platforms).split(',').map((p) => p.trim()).filter(Boolean)
        : [],
      alternativeTo: data.alternativeTo ? String(data.alternativeTo).trim() : undefined,
      submitterName: (data.submitterName || data.authorName) ? String(data.submitterName || data.authorName).trim().slice(0, 60) : undefined,
      submitterEmail: (data.submitterEmail || data.contactEmail) ? String(data.submitterEmail || data.contactEmail).trim().toLowerCase() : undefined,
      notes: data.notes ? String(data.notes).trim().slice(0, 1000) : undefined,
    },
    potentialDuplicate: dupCheck.isDuplicate,
    duplicateReason: dupCheck.reason,
    duplicateMatches: dupCheck.matches,
  };

  const mode = getStorageMode();
  if (mode === 'unconfigured_production') {
    console.warn('[TechHacks Storage Alert] Tool submission rejected: Serverless environment detected without durable storage credentials.');
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not yet configured for production submissions. Submissions are temporarily paused to prevent data loss. Configure SUPABASE_URL with a server-side Supabase secret or service-role key, or a supported Upstash store.',
      storageMode: 'unconfigured_production',
    };
  }

  if (mode === 'supabase' || mode === 'upstash') {
    const saveResult = await saveSubmissionToAdapter(newSubmission);
    if (!saveResult.success) {
      return {
        success: false,
        status: saveResult.status || 500,
        error: saveResult.error || 'StorageError',
        message: saveResult.message || 'Failed to save submission to durable database.',
      };
    }
  } else {
    // No local-filesystem fallback exists on Cloudflare (see header).
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not yet configured for production submissions. Submissions are temporarily paused to prevent data loss. Configure SUPABASE_URL with a server-side Supabase secret or service-role key, or a supported Upstash store.',
      storageMode: mode,
    };
  }

  return {
    success: true,
    status: 201,
    id: newSubmission.id,
    message: 'Thanks for contributing to Tech Hacks AI! Your submission has been received and will be reviewed before publication.',
    potentialDuplicate: dupCheck.isDuplicate,
    duplicateReason: dupCheck.reason,
  };
}

// Validate and create guide submission
export async function createGuideSubmission(data, clientIp = '127.0.0.1') {
  // Anti-spam honeypot
  if (data.website_hp && String(data.website_hp).trim().length > 0) {
    return {
      success: false,
      status: 400,
      message: 'Spam submission detected by honeypot verification.',
    };
  }

  // Rate limiting
  if (!checkRateLimit(clientIp)) {
    return {
      success: false,
      status: 429,
      message: 'Too many submissions. Please wait 10 minutes before submitting again.',
    };
  }

  const errors = {};
  const title = String(data.title || '').trim();
  const summary = String(data.summary || '').trim();
  const content = String(data.content || '').trim();
  const category = String(data.category || '').trim();

  if (!title || title.length < 10 || title.length > 120) {
    errors.title = 'Guide title must be between 10 and 120 characters.';
  }

  if (!summary || summary.length < 20 || summary.length > 300) {
    errors.summary = 'Summary must be between 20 and 300 characters.';
  }

  if (!content || content.length < 100 || content.length > 15000) {
    errors.content = 'Guide content must be between 100 and 15,000 characters.';
  }

  if (!category) {
    errors.category = 'Please select a topic or category.';
  }

  if (data.contactEmail) {
    const email = String(data.contactEmail).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.contactEmail = 'Please provide a valid contact email.';
    }
  }

  if (data.coverImageUrl) {
    const coverUrl = normalizeUrl(data.coverImageUrl);
    if (!/^https?:\/\/.+\..+/i.test(coverUrl)) {
      errors.coverImageUrl = 'Cover image URL must be a valid http:// or https:// address.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      status: 400,
      message: 'Please resolve the highlighted validation errors.',
      errors,
    };
  }

  // Duplicate Check
  const dupCheck = await checkGuideDuplicate(title);

  // Auto-calculate read time: ~200 words per minute
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const readTime = `${readMinutes} min read`;

  const newSubmission = {
    id: `sub_guide_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'guide',
    status: 'pending', // ALWAYS forced to pending for public submissions
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    guideData: {
      title,
      summary,
      content,
      category,
      coverImageUrl: data.coverImageUrl ? normalizeUrl(data.coverImageUrl) : undefined,
      tags: Array.isArray(data.tags)
        ? data.tags.map(String).map((t) => t.trim()).filter(Boolean)
        : typeof data.tags === 'string'
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      relatedTools: Array.isArray(data.relatedTools)
        ? data.relatedTools.map(String).map((t) => t.trim()).filter(Boolean)
        : typeof data.relatedTools === 'string'
        ? data.relatedTools.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(data.difficulty)
        ? data.difficulty
        : 'intermediate',
      readTime,
      authorName: data.authorName ? String(data.authorName).trim().slice(0, 60) : undefined,
      contactEmail: data.contactEmail ? String(data.contactEmail).trim().toLowerCase() : undefined,
      referenceUrls: Array.isArray(data.referenceUrls)
        ? data.referenceUrls.map(normalizeUrl).filter(Boolean)
        : typeof data.referenceUrls === 'string'
        ? data.referenceUrls.split('\n').map((u) => normalizeUrl(u.trim())).filter(Boolean)
        : [],
      notes: data.notes ? String(data.notes).trim().slice(0, 1000) : undefined,
    },
    potentialDuplicate: dupCheck.isDuplicate,
    duplicateReason: dupCheck.reason,
    duplicateMatches: dupCheck.matches,
  };

  const mode = getStorageMode();
  if (mode === 'unconfigured_production') {
    console.warn('[TechHacks Storage Alert] Guide submission rejected: Serverless environment detected without durable storage credentials.');
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not yet configured for production submissions. Submissions are temporarily paused to prevent data loss. Configure SUPABASE_URL with a server-side Supabase secret or service-role key, or a supported Upstash store.',
      storageMode: 'unconfigured_production',
    };
  }

  if (mode === 'supabase' || mode === 'upstash') {
    const saveResult = await saveSubmissionToAdapter(newSubmission);
    if (!saveResult.success) {
      return {
        success: false,
        status: saveResult.status || 500,
        error: saveResult.error || 'StorageError',
        message: saveResult.message || 'Failed to save submission to durable database.',
      };
    }
  } else {
    // No local-filesystem fallback exists on Cloudflare (see header).
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not yet configured for production submissions. Submissions are temporarily paused to prevent data loss. Configure SUPABASE_URL with a server-side Supabase secret or service-role key, or a supported Upstash store.',
      storageMode: mode,
    };
  }

  return {
    success: true,
    status: 201,
    id: newSubmission.id,
    message: 'Thanks for contributing to Tech Hacks AI! Your submission has been received and will be reviewed before publication.',
    potentialDuplicate: dupCheck.isDuplicate,
    duplicateReason: dupCheck.reason,
  };
}

// Moderator: Update submission status asynchronously (supporting Supabase / Upstash)
export async function updateSubmissionStatusAsync(id, updateData, headers) {
  if (!isAuthorized(headers)) {
    return { success: false, status: 401, message: 'Unauthorized. Moderator access token required.' };
  }

  const mode = getStorageMode();
  if (mode === 'unconfigured_production') {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not configured for production moderation updates.',
    };
  }

  if (mode === 'supabase' || mode === 'upstash') {
    const res = await updateSubmissionInAdapter(id, updateData);
    if (!res.success) {
      return { success: false, status: res.status || 500, message: res.message || 'Update failed.' };
    }
    return { success: true, status: 200, submission: res.submission };
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Durable database storage is not configured for production moderation updates.',
  };
}

// Moderator: Publish approved submission into catalog (async adapter path only)
export async function publishSubmissionToCatalogAsync(id, headers) {
  if (!isAuthorized(headers)) {
    return { success: false, status: 401, message: 'Unauthorized. Moderator access token required.' };
  }

  const mode = getStorageMode();
  if (mode === 'unconfigured_production') {
    return {
      success: false,
      status: 503,
      error: 'StorageUnavailable',
      message: 'Durable database storage is not configured for publishing additions in production.',
    };
  }

  if (mode === 'supabase' || mode === 'upstash') {
    const submissions = await fetchSubmissionsFromAdapter();
    const index = submissions.findIndex((s) => s.id === id);
    if (index === -1) {
      return { success: false, status: 404, message: 'Submission not found.' };
    }

    const submission = submissions[index];
    if (submission.status !== 'approved') {
      return {
        success: false,
        status: 409,
        error: 'SubmissionNotApproved',
        message: 'Only submissions marked approved can be published to the catalog.',
      };
    }
    const publishedAdditions = await fetchPublishedAdditionsFromAdapter();
    const today = new Date().toISOString().split('T')[0];

    if (submission.type === 'tool' && submission.toolData) {
      const slug = slugify(submission.publishedSlug || submission.toolData.name);
      const publishedTool = {
        id: slug,
        slug,
        name: submission.toolData.name,
        tagline: submission.toolData.description.slice(0, 90) + (submission.toolData.description.length > 90 ? '...' : ''),
        description: submission.toolData.description,
        longDescription: submission.toolData.description,
        websiteUrl: submission.toolData.websiteUrl,
        section: submission.toolData.section || 'community',
        category: submission.toolData.category,
        pricingType: submission.toolData.pricingType,
        pricingDetails:
          submission.toolData.pricingType === 'free'
            ? 'Free forever'
            : submission.toolData.pricingType === 'open-source'
            ? 'Open Source'
            : 'Freemium / Free tier available',
        iconLetter: (submission.toolData.name || 'AI').slice(0, 2).toUpperCase(),
        iconBgColor: '#6366f1',
        hasFreePlan: submission.toolData.pricingType !== 'paid',
        freeAccessType:
          submission.toolData.pricingType === 'open-source'
            ? 'open-source-local'
            : submission.toolData.pricingType === 'free'
            ? 'recurring-free'
            : 'limited-free',
        freeTierSummary: 'Community submission verified by Tech Hacks AI editorial team.',
        freeTierLimits: 'Verified live on official platform docs.',
        features: submission.toolData.features || [],
        tags: [
          submission.toolData.category,
          submission.toolData.pricingType,
          ...(submission.toolData.section === 'ai' ? [] : ['community-verified']),
          ...(submission.toolData.platform || []),
        ],
        requiresAccount: submission.toolData.pricingType !== 'open-source',
        pricingSourceUrl: submission.toolData.websiteUrl,
        pricingVerifiedAt: today,
        isVerified: true,
        alternativesTo: submission.toolData.alternativeTo ? [submission.toolData.alternativeTo] : [],
      };

      if (!publishedAdditions.tools) publishedAdditions.tools = [];
      const toolIdx = publishedAdditions.tools.findIndex((t) => t.slug === slug);
      if (toolIdx >= 0) {
        publishedAdditions.tools[toolIdx] = publishedTool;
      } else {
        publishedAdditions.tools.unshift(publishedTool);
      }

      submission.status = 'published';
      submission.publishedSlug = slug;
      submission.publishedAt = new Date().toISOString();
      submission.isVerified = true;
      submission.updatedAt = new Date().toISOString();

      await savePublishedAdditionsToAdapter(publishedAdditions);
      await updateSubmissionInAdapter(id, {
        status: 'published',
        publishedSlug: slug,
        publishedAt: submission.publishedAt,
        isVerified: true,
      });

      return {
        success: true,
        status: 200,
        submission,
        publishedSlug: slug,
        publishedUrl: `/ai-tools/${slug}`,
        message: `Tool "${submission.toolData.name}" has been published to the catalog.`,
      };
    }

    if (submission.type === 'guide' && submission.guideData) {
      const slug = slugify(submission.publishedSlug || submission.guideData.title);
      const paragraphs = submission.guideData.content
        .split(/\n\s*##\s+/)
        .map((section, idx) => {
          const lines = section.trim().split('\n');
          const title = idx === 0 ? lines[0].replace(/^#+\s*/, '') : lines[0];
          const description = lines.slice(1).join('\n').trim();
          return {
            stepNumber: idx + 1,
            title: title || `Step ${idx + 1}`,
            description: description || lines.join('\n'),
          };
        })
        .filter((s) => s.description.length > 0);

      const steps =
        paragraphs.length > 0
          ? paragraphs
          : [
              {
                stepNumber: 1,
                title: 'Getting Started',
                description: submission.guideData.content,
              },
            ];

      const publishedGuide = {
        id: slug,
        slug,
        title: submission.guideData.title,
        summary: submission.guideData.summary,
        category: submission.guideData.category,
        readTime: submission.guideData.readTime || '5 min read',
        author: submission.guideData.authorName || 'Tech Hacks AI Community',
        publishedDate: today,
        tags: ['community-tutorial', ...(submission.guideData.tags || [])],
        steps,
        relatedToolSlugs: submission.guideData.relatedTools || [],
      };

      if (!publishedAdditions.guides) publishedAdditions.guides = [];
      const guideIdx = publishedAdditions.guides.findIndex((g) => g.slug === slug);
      if (guideIdx >= 0) {
        publishedAdditions.guides[guideIdx] = publishedGuide;
      } else {
        publishedAdditions.guides.unshift(publishedGuide);
      }

      submission.status = 'published';
      submission.publishedSlug = slug;
      submission.publishedAt = new Date().toISOString();
      submission.isVerified = true;
      submission.updatedAt = new Date().toISOString();

      await savePublishedAdditionsToAdapter(publishedAdditions);
      await updateSubmissionInAdapter(id, {
        status: 'published',
        publishedSlug: slug,
        publishedAt: submission.publishedAt,
        isVerified: true,
      });

      return {
        success: true,
        status: 200,
        submission,
        publishedSlug: slug,
        publishedUrl: `/guides/${slug}`,
        message: `Guide "${submission.guideData.title}" has been published to the catalog.`,
      };
    }

    return { success: false, status: 400, message: 'Invalid submission data.' };
  }

  return {
    success: false,
    status: 503,
    error: 'StorageUnavailable',
    message: 'Durable database storage is not configured for publishing additions in production.',
  };
}
