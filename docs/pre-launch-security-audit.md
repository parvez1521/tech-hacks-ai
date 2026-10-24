# SwitchRoute Pre-Launch Security Review

Local source review only; this does not represent a live penetration test or confirmation of deployed configuration. Reviewed 2026-10-23. No production credentials were read or reported.

## Findings

### Critical

None identified in the reviewed local source.

### High

None identified in the reviewed local source. Deployment permissions, Supabase project settings, and live edge rules were not accessible from this review, so this is not a production security certification.

### Medium

| Area | Evidence and impact | Local action / verification | Remaining work |
| --- | --- | --- | --- |
| Anonymous chat provider proxy | `POST /api/chat` can call the configured Groq provider without authentication. Repeated calls could consume provider quota/cost. | Added the existing server-side per-IP limiter before provider access. `tests/api_security_and_media.test.js` verifies the sixth request in a test window is rejected with `429` and `Retry-After: 600`. | The limiter is in-memory per serverless instance and can be bypassed by distributed traffic or instance churn. Add an edge/shared rate limit before enabling paid provider credentials. |
| HSTS scope not verified | `vercel.json` sends `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on every route. This affects the canonical domain and all subdomains. | No local change: deployment domain ownership, HTTPS coverage, and all subdomains cannot be verified from source. | Confirm every subdomain is HTTPS-capable and that the preload commitment is intended before deployment. Avoid enabling preload until this is confirmed. |
| CSP absent | `vercel.json` does not define a Content-Security-Policy. This leaves browser script/style/resource loading without an explicit policy. A restrictive policy could break inline styles, fonts, image sources, or API calls. | No enforcement policy added without a browser CSP report and deployment-origin inventory. | Add CSP in report-only mode, collect violations through the real site flows, then decide on enforcement. |
| Per-instance abuse controls | Public submissions and transcription have in-memory limits; chat now shares the same pattern. Serverless instances do not share counters, so limits are best-effort. | Source review and local request tests. | Configure shared edge rate limits for `/api/chat`, `/api/transcribe`, `/api/submissions`, `/api/prompt-submissions`, and `/api/prompt-stats`. Keep crawler-friendly public GET traffic separate. |

### Low

| Area | Evidence and impact | Local action / verification | Remaining work |
| --- | --- | --- | --- |
| Legacy XSS header | `vercel.json` emits `X-XSS-Protection: 1; mode=block`, which is obsolete in modern browsers and is not a substitute for CSP. | Left as-is to avoid changing existing deployment behavior without deployment-level verification. | Remove during a reviewed headers update; rely on output encoding and CSP. |
| Admin token comparison | `server/submissionsStore.js` compares the configured bearer/header token with ordinary string equality. A remote timing attack is unlikely to be practical, but constant-time comparison is preferable for a long-lived secret. | No behavior change made during this pre-launch audit. | Consider `crypto.timingSafeEqual` with length normalization and focused tests. Rotate the production secret if it has ever been exposed. |
| Development fallback token | `server/submissionsStore.js` includes a fixed development-only fallback. Production mode fails closed when the secret is absent or equals that fallback. | Existing production fail-closed test passes; fallback was not removed because local moderation and tests depend on it. | Keep it out of production environment configuration and confirm production `ADMIN_SECRET` is a unique random value. Never reuse the development token. |

### Informational

- `server/schema.sql` enables RLS on submissions, published additions, discoveries, prompts, prompt categories, and prompt copy statistics. Public prompt reads are restricted to `published`; moderation writes use `service_role`. The schema and server code were reviewed locally, but no live Supabase policies or grants were queried.
- The service-role credential is accessed from server-only modules (`server/*`). The Vite client source has no `VITE_` binding for a service-role key. A post-build scan for privileged-key values found no exposed credential values; environment variable names appearing in server source are not credential values.
- The public content endpoints intentionally expose published catalog and prompt data. Browser-delivered text/images can be copied, saved, screenshotted, or requested directly; `robots.txt` is crawler guidance, not access control.
- `.gitignore` ignores `.env*` and re-allows `.env.example`; `git ls-files` showed only `.env.example` among environment-file patterns. Do not put secrets in that example file.
- The deployment configuration contains baseline headers, but no Cloudflare Pages/Worker/WAF configuration is present in the repository. This review did not inspect Cloudflare or the hosting dashboard.

## Cloudflare launch checklist (manual, after approval)

1. Confirm DNS proxy and TLS settings for the canonical domain; use HTTPS redirects only after origin and subdomain coverage are verified.
2. Add rate limiting for the abuse-prone POST endpoints listed above. Prefer a shared edge rule/counter over per-function memory.
3. Challenge suspicious automation selectively; do not challenge static assets, normal public browsing, or verified search crawlers indiscriminately.
4. Add Turnstile only if public form abuse warrants it. Validate tokens server-side and fail closed for protected submissions.
5. Enable security event logging/alerts with retention and privacy controls; do not log bearer tokens, request secrets, or complete submitted prompts unnecessarily.
6. Stage CSP as report-only and test chat, image previews, font loading, media tools, and API routes before enforcement.
7. Recheck Supabase RLS/grants against this schema in the target project. Never expose the service-role key to a browser; rotate it if exposure is suspected.

## Scope and verification limits

- No live HTTP scan, Cloudflare dashboard check, Supabase connection, production migration, or production write was performed.
- No attempt was made to prove that public media is impossible to copy; that is not achievable for content delivered to a visitor's browser.
- Before launch, configure and verify `ADMIN_SECRET`, durable database credentials, and any provider credentials required for enabled features. Values must remain in the hosting secret store and must not be included in client-prefixed `VITE_` variables.
