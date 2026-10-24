const SENSITIVE_KEY = /(?:authorization|bearer|token|secret|password|api[_-]?key|credential|cookie|session)/i;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectRequestValues(value, values = [], depth = 0) {
  if (depth > 8 || value == null) return values;
  if (typeof value === 'string') {
    if (value.length >= 3 && value.length <= 2000 && values.length < 100) {
      values.push(value);
      for (const part of value.split(/\s+/)) {
        if (part.length >= 5 && part.length <= 200 && values.length < 100) values.push(part);
      }
    }
    return values;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectRequestValues(item, values, depth + 1);
    return values;
  }
  if (typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      collectRequestValues(item, values, depth + 1);
    }
  }
  return values;
}

function requestSensitiveValues(req) {
  const values = [];
  try {
    for (const [key, value] of Object.entries(req?.headers || {})) {
      if (SENSITIVE_KEY.test(key)) collectRequestValues(value, values);
    }
    collectRequestValues(req?.body, values);
    collectRequestValues(req?.query, values);
    if (req?.url) {
      const parsed = new URL(req.url, 'http://localhost');
      for (const [key, value] of parsed.searchParams) {
        collectRequestValues(value, values);
      }
    }
  } catch {
    // Diagnostics must never cause an API failure of their own.
  }
  return [...new Set(values)].sort((a, b) => b.length - a.length);
}

export function sanitizeErrorForLog(error, req) {
  const name = typeof error?.name === 'string' ? error.name.slice(0, 80) : 'Error';
  const status = Number.isInteger(error?.status) ? error.status : undefined;
  let message = typeof error?.message === 'string' ? error.message : 'Unknown server error';
  message = message
    .replace(/\bBearer\s+[^\s,;"']+/gi, 'Bearer [REDACTED]')
    .replace(/((?:authorization|x-admin-token|access[_-]?token|api[_-]?key|secret|password|token|cookie|session)\s*[:=]\s*)([^\s,;"'}]+)/gi, '$1[REDACTED]')
    .replace(/(https?:\/\/)[^/@\s]+:[^/@\s]+@/gi, '$1[REDACTED]@')
    .replace(/([?&](?:token|key|secret|password|authorization|api_key|session)=)[^&\s]+/gi, '$1[REDACTED]')
    .replace(/\b[A-Za-z0-9_~-]{32,}\b/g, '[REDACTED]');
  for (const value of requestSensitiveValues(req)) {
    message = message.replace(new RegExp(escapeRegExp(value), 'g'), '[REDACTED]');
  }
  return { name, status, message: message.slice(0, 500) };
}

export function logSanitizedApiError(route, error, req, { includeMessage = true } = {}) {
  const diagnostic = sanitizeErrorForLog(error, req);
  const fields = [diagnostic.name, diagnostic.status ? `status=${diagnostic.status}` : null];
  if (includeMessage) fields.push(diagnostic.message);
  console.error(`[API ${route}] ${fields.filter(Boolean).join(' | ')}`);
}

export function getSafeApiFailure(error, fallbackStatus = 500) {
  const status = Number.isInteger(error?.status) && error.status >= 400 && error.status <= 599
    ? error.status
    : fallbackStatus;
  let message = 'Please check the request and try again.';
  if (status === 408 || status === 429) message = 'Please wait briefly, then try again.';
  else if (status === 401 || status === 403) message = 'Check your access, then try again.';
  else if (status === 404) message = 'Check the requested item and try again.';
  else if (status === 409) message = 'Refresh the latest data, then try again.';
  else if (status === 503) message = 'This service is temporarily unavailable. Please try again later.';
  else if (status >= 500) message = 'The request could not be completed. Please try again later.';
  return { status, body: { error: 'Request failed.', message } };
}

export function safeApiOperationResult(result) {
  const status = Number.isInteger(result?.status) ? result.status : (result?.success ? 200 : 500);
  if (result?.success !== false || status < 500 || result?.error === 'StorageUnavailable') {
    return { status, body: result };
  }
  const failure = getSafeApiFailure({ status });
  return { status: failure.status, body: { success: false, status: failure.status, ...failure.body } };
}
