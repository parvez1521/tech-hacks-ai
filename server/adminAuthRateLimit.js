// Per-instance, in-memory rate limiting for admin authentication
// attempts. Follows the same pattern as the existing limiters on
// the chat / contact / submissions endpoints (a Map of IP ->
// timestamps, pruned to a sliding window). Serverless instances
// each keep their own map, so this is a best-effort brake on
// credential guessing, not a distributed lockout.

export const ADMIN_AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const ADMIN_AUTH_MAX_FAILURES = 5;

const failuresByIp = new Map();

export function getAdminAuthClientIp(req) {
  const forwarded =
    req?.headers?.['x-vercel-forwarded-for'] || req?.headers?.['x-forwarded-for'];
  const raw = forwarded || req?.socket?.remoteAddress || 'unknown';
  return String(raw).split(',')[0].trim().slice(0, 120) || 'unknown';
}

// True when a credential was actually presented. Requests with no
// credential are ordinary unauthenticated traffic (401) and are
// not counted — only guessing attempts are.
export function hasPresentedAdminCredential(headers = {}) {
  if (!headers) return false;
  if (typeof headers === 'string') return headers.trim().length > 0;
  const token = headers['x-admin-token'] || headers['X-Admin-Token'] || '';
  if (typeof token === 'string' && token.trim()) return true;
  const auth = headers['authorization'] || headers['Authorization'] || '';
  return typeof auth === 'string' && auth.startsWith('Bearer ') && auth.slice(7).trim().length > 0;
}

function recentFailures(ip, now = Date.now()) {
  const recent = (failuresByIp.get(ip) || []).filter((t) => now - t < ADMIN_AUTH_WINDOW_MS);
  if (recent.length) failuresByIp.set(ip, recent);
  else failuresByIp.delete(ip);
  return recent;
}

export function isAdminAuthRateLimited(ip = 'unknown') {
  return recentFailures(ip).length >= ADMIN_AUTH_MAX_FAILURES;
}

export function recordAdminAuthFailure(ip = 'unknown') {
  const now = Date.now();
  const recent = recentFailures(ip, now);
  recent.push(now);
  failuresByIp.set(ip, recent);
  if (failuresByIp.size > 5000) {
    for (const key of failuresByIp.keys()) recentFailures(key, now);
  }
  return recent.length >= ADMIN_AUTH_MAX_FAILURES;
}

export function clearAdminAuthFailures(ip = 'unknown') {
  failuresByIp.delete(ip);
}

export function resetAdminAuthRateLimit() {
  failuresByIp.clear();
}

/**
 * Gate an admin-auth check for a request.
 * Returns 'rate-limited' when the IP already has too many recent
 * failures, 'authorized' / 'unauthorized' otherwise, recording a
 * failure only when a credential was presented and rejected, and
 * clearing the counter on success.
 */
export function evaluateAdminAuth(req, isAuthorizedFn) {
  const ip = getAdminAuthClientIp(req);
  if (isAdminAuthRateLimited(ip) && hasPresentedAdminCredential(req?.headers)) {
    return { status: 'rate-limited', ip };
  }
  const authorized = Boolean(isAuthorizedFn(req?.headers));
  if (authorized) {
    clearAdminAuthFailures(ip);
    return { status: 'authorized', ip };
  }
  if (hasPresentedAdminCredential(req?.headers)) {
    recordAdminAuthFailure(ip);
  }
  return { status: 'unauthorized', ip };
}
