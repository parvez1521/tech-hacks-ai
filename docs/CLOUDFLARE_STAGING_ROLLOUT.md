# SwitchRoute — Cloudflare staging rollout

## Goal

Validate the existing Cloudflare Pages Functions port on an isolated Git-integrated staging project before changing production hosting.

## Environment separation

- Production remains on Vercel.
- The existing `switchroute-cf-test` Pages project remains untouched as a direct-upload fallback.
- This branch targets a separate Pages project named `switchroute-staging`.
- No production DNS records or custom domains are changed by this rollout.
- Do not add real credentials to Git, pull requests, screenshots, or build logs.

## Staging project

- Project: `switchroute-staging`
- Preview/primary URL: https://switchroute-staging.pages.dev
- Git deployment branch: `cloudflare-staging`

## Cloudflare Pages build settings

| Setting | Value |
| --- | --- |
| Git repository | `parvez1521/tech-hacks-ai` |
| Production branch for staging project | `cloudflare-staging` |
| Preview branches | Enabled for review branches |
| Root directory | `/` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | `22.23.4` via `.node-version` |

The build creates pre-rendered public routes and copies the Pages Functions from `functions/`. The existing `public/_redirects` and `public/_headers` files carry redirects, SPA fallback, caching and static-response headers.

## Runtime secrets to configure in Cloudflare

Set these only in the Pages dashboard/API as encrypted secrets, never as plaintext repository files:

- `ADMIN_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY` (optional live assistant)
- `OPENAI_API_KEY` (optional transcription) or `TRANSCRIPTION_API_KEY` for the configured provider
- `TRANSCRIPTION_API_URL` and `TRANSCRIPTION_MODEL` when overriding provider defaults

Optional public build variable:

- `VITE_SITE_URL=https://switchroute.in`

Do not assume these are configured just because the project builds. Without privileged Supabase credentials, writes are expected to fail closed with HTTP 503 rather than using ephemeral storage.

## Staging verification before any production cutover

1. Confirm the Git-connected Pages build succeeds from `cloudflare-staging`.
2. Smoke-test the homepage, tool directories, alternatives, guides, prompt library, contact page, moderation UI and representative prerendered detail URLs.
3. Test all ten `/api/*` Pages Function routes, including contact, submissions, discoveries, prompts, prompt categories, prompt submissions, prompt stats, GitHub projects, chat and transcription.
4. Verify admin authentication, Supabase reads/writes, public submission persistence, contact inbox behavior and prompt publishing with staging-safe credentials.
5. Test transcription with an authorized small file and verify provider timeout/error behavior.
6. Check redirects, 404s, canonical metadata, sitemap, robots, security headers, cache headers and SPA deep links.
7. Review Cloudflare logs and run the full repository test suite plus production build.
8. Only after all checks pass, prepare a separate production cutover plan for `switchroute.in` and `www.switchroute.in`.

## Rollback

Keep Vercel production active throughout staging. Do not change registrar nameservers, apex DNS, Vercel domains, or production environment variables during this phase. A staging failure is resolved on this branch/project and must not affect live traffic.
