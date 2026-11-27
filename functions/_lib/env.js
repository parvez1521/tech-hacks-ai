// Cloudflare Pages Functions environment binding.
//
// Pages Functions receive secrets/bindings on `context.env`, NOT on
// `process.env` (which is empty/undefined in the Workers runtime).
// Modules in functions/_lib read env ONLY through `getEnv()` here.
//
// Rules:
// - Every `onRequest` calls `setEnv(context.env)` first.
// - Node tests use `process.env` directly (as the existing api tests do);
//   `getEnv()` merges both, with the bound Cloudflare env winning.
// - Never read env at module top level: a Function module is imported
//   before the first request, so a top-level read would see an empty env.
let boundEnv = null;

export function setEnv(env) {
  boundEnv = env && typeof env === 'object' ? env : {};
}

export function getEnv() {
  const nodeEnv =
    typeof globalThis.process !== 'undefined' &&
    globalThis.process &&
    globalThis.process.env
      ? globalThis.process.env
      : {};
  return { ...nodeEnv, ...(boundEnv || {}) };
}

export function getEnvValue(name) {
  return getEnv()[name];
}
