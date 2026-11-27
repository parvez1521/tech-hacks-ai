// Cloudflare port of server/supabaseRest.js (main @ 52e05b3).
// Identical logic; only the env source changed: `process.env` ->
// `getEnv()` (functions/_lib/env.js), because Workers have no process.env.
import { getEnv } from './env.js';

/**
 * Shared server-side Supabase REST credentials and headers.
 *
 * Privileged credential precedence is deterministic: SUPABASE_SECRET_KEY,
 * then SUPABASE_SERVICE_ROLE_KEY. Public-read fallback precedence is
 * SUPABASE_PUBLISHABLE_KEY, then SUPABASE_ANON_KEY. A request never retries
 * with another credential after an authentication failure.
 */
export function getSupabaseConfig({ allowPublic = false } = {}) {
  const env = getEnv();
  const base = env.SUPABASE_URL?.trim().replace(/\/+$/, '');
  if (!base) return null;

  const secretKey = env.SUPABASE_SECRET_KEY?.trim();
  if (secretKey) return { base, key: secretKey, keyType: 'secret' };

  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRoleKey) return { base, key: serviceRoleKey, keyType: 'service_role' };

  if (!allowPublic) return null;

  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (publishableKey) return { base, key: publishableKey, keyType: 'publishable' };

  const anonKey = env.SUPABASE_ANON_KEY?.trim();
  if (anonKey) return { base, key: anonKey, keyType: 'anon' };

  return null;
}

export function hasSupabasePrivilegedConfig() {
  return Boolean(getSupabaseConfig());
}

export function hasSupabasePublicReadConfig() {
  return Boolean(getSupabaseConfig({ allowPublic: true }));
}

export function getSupabaseHeaders(config = getSupabaseConfig(), extraHeaders = {}) {
  if (!config?.key || !config?.keyType) {
    throw new Error('Supabase server credentials are not configured.');
  }

  const headers = {
    apikey: config.key,
    'Content-Type': 'application/json',
  };

  // The new opaque keys are API keys, not JWTs. Do not send them as Bearer
  // tokens. Legacy anon/service-role JWTs retain the existing dual headers.
  if (config.keyType === 'service_role' || config.keyType === 'anon') {
    headers.Authorization = `Bearer ${config.key}`;
  }

  return { ...headers, ...extraHeaders };
}

export function redactSupabaseCredential(message, config = getSupabaseConfig({ allowPublic: true })) {
  const text = String(message ?? '');
  return config?.key ? text.split(config.key).join('[REDACTED]') : text;
}
