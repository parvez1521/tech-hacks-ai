# Isolated Supabase Preview storage test

This checklist is for a new, empty Supabase project used only by a Vercel Preview deployment. It does not authorize production use. Do not point it at the production Supabase project.

## What the repository provides

- `server/schema.sql` is the canonical complete bootstrap. It creates the six `techhacks_*` tables, indexes, row-level security policies, grants, the prompt `updated_at` trigger, the `techhacks_record_prompt_copy(text)` RPC, and the `root` published-additions row.
- There is no versioned migration directory or schema-version tracker. Do not create a second baseline migration that duplicates this file. On an empty project, apply the current `server/schema.sql` once, as a whole, using the Supabase SQL Editor. It uses `IF NOT EXISTS` and replaces its named policies/functions/triggers, but it is not a schema-drift migration: do not use it to reconcile an already populated or differently structured database.
- `scripts/migrate-to-supabase.js` imports local submissions, discoveries, and published additions; it does **not** install the schema and does not import prompt/category/stat rows. Its default mode performs remote writes. Do not run it for this smoke test. The `--dry-run` and `--sql` modes do not contact Supabase, but are unnecessary for an empty Preview database.
- Bundled prompts remain in the application source. Preview prompt/category rows are database-backed overlays. Use synthetic test records only.

## Human operator setup sequence

1. Create a dedicated, empty Supabase project for Preview. Confirm its project name and URL are not the production project. Keep its privileged key in the server secret manager; do not paste it into chat, source, a URL, or a browser console.
2. Open the new project's SQL Editor. Review `server/schema.sql` in this repository, then execute the entire file once. Do not run the data migration script. Confirm the six tables exist under `public`: `techhacks_submissions`, `techhacks_published_additions`, `techhacks_discoveries`, `techhacks_prompts`, `techhacks_prompt_categories`, and `techhacks_prompt_stats`. Confirm the `techhacks_record_prompt_copy(text)` function, prompt timestamp trigger, listed indexes, RLS enablement, and policies/grants were created. The bootstrap inserts only the empty `root` published-additions record.
3. In Vercel, configure the variables below for **Preview only**. Configure one privileged Supabase key format, preferably `SUPABASE_SECRET_KEY`; leave the legacy key unset in this test to make the selected credential unambiguous. Do not create any `VITE_`-prefixed secret variable. Public keys are not required when a privileged key is configured.
4. Set `ADMIN_SECRET` to a strong, unique Preview moderator secret if testing admin endpoints. Keep it distinct from Production and from the Supabase key. Do not enable or test moderation without it.
5. Create a Preview deployment through the normal human-approved process so the deployment receives the Preview variables. This document does not create a deployment or change settings.
6. Run the smoke checks below using only synthetic data and the Preview URL. Verify results on separate HTTP requests. Delete synthetic moderation records through the authorized API after the checks, if the applicable delete operation exists; otherwise leave them clearly labeled as test records in Preview and remove them through the Preview database console later.

## Preview environment variables

| Variable | Required for this test | Scope and handling |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Preview; server-side project URL, not secret by itself |
| `SUPABASE_SECRET_KEY` | Yes, preferred | Preview; server-only privileged key. Sent as `apikey`; the opaque `sb_secret_...` value is not sent as a Bearer token |
| `SUPABASE_SERVICE_ROLE_KEY` | Alternative only | Preview; server-only legacy JWT service-role key. Use only if the new key is unavailable; it sends both `apikey` and `Authorization: Bearer ...` |
| `ADMIN_SECRET` | Yes for moderation checks | Preview; server-only moderator credential, unique from Production and from the Supabase key |

Configure either `SUPABASE_SECRET_KEY` **or** `SUPABASE_SERVICE_ROLE_KEY`, not both for this test. If both are present, code deterministically selects `SUPABASE_SECRET_KEY` and does not retry with the legacy key after an authentication failure. `SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_ANON_KEY` are optional public-read fallbacks only; neither enables durable writes or prompt/category/stat persistence. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are not needed for this Supabase test and should not be set to another project's store. `VERCEL` and `NODE_ENV` are host/runtime indicators, not operator-supplied storage credentials.

## Preview smoke test

Use a unique test prefix in names/slugs and no personal information. Record HTTP status and response identifiers only; never record request headers or credential values.

1. **Public submission:** `POST /api/submissions` with a valid synthetic tool submission. Expect `201`, `success: true`, and a generated ID. Then send `GET /api/submissions` without authorization and expect `401`. Send it with the Preview moderator token in `x-admin-token` and confirm the new item appears as `pending`. A separate request demonstrates persistence across requests.
2. **Discoveries:** with the moderator token, `POST /api/discoveries` a synthetic discovery with a unique name, valid HTTP(S) website, and `status: "published"`; expect `201`. Fetch it by ID and in the public list on a separate request; expect the published record. Also create a draft and confirm an unauthenticated public list does not expose it. Exercise `PATCH` and `DELETE` only on these test records.
3. **Prompt submission and management:** `POST /api/prompt-submissions` a synthetic prompt submission with a unique title, at least 40 characters of prompt text, valid category/model/provider values, a `/prompts/...` preview path or permitted HTTPS image, `rightsConfirmed: true`, and explicit valid rights/attribution fields. Expect `201` and `status: "draft"`. Confirm `GET /api/prompts?admin=1` without a moderator token returns `401`; with the Preview moderator token it returns the draft. Confirm public `GET /api/prompts?slug=<test-slug>` does not expose the draft. Then use authorized `POST` or `PATCH /api/prompts` to publish only if that is needed for the public-read check; verify publication on another request. Delete the test prompt with authorized `DELETE /api/prompts?slug=<test-slug>`.
4. **Prompt categories:** with the moderator token, `POST /api/prompt-categories` a unique test category; expect success. Read the categories on another request and confirm it appears, then delete the test category with the authorized endpoint.
5. **Prompt-copy statistics:** choose an existing published prompt slug. Read `GET /api/prompt-stats`, copy/count that prompt with `POST /api/prompt-stats` and body `{ "slug": "<published-slug>" }`, then read stats again and confirm its count increased. The endpoint has a 30-second per-instance duplicate cooldown; wait at least 30 seconds or use a separate test client before expecting another increment. The database RPC performs the durable increment.
6. **Persistence:** after each write, read it in a distinct request. For stronger evidence, repeat the reads after the Preview function has had time to be invoked independently; do not use only an in-memory UI state as proof. A Preview redeployment/restart can be used as an additional check if operationally convenient, but it is not needed to prove each DB-backed read is independent of the request that wrote the row.
7. **Authorization:** repeat protected reads/writes without a token and with a deliberately invalid synthetic token. Expect `401`; confirm no private submission or draft data is returned and no record changes. Confirm the Supabase key is never accepted as the moderator token. Valid moderator requests should succeed only with the Preview `ADMIN_SECRET` supplied through the existing `x-admin-token` or Bearer admin mechanism.

## Expected failures and pass criteria

- With Supabase URL and both privileged keys absent in a production/Preview runtime, storage mode is unconfigured: generic submission/discovery writes and prompt/category/stat persistence must fail safely (normally `503`), never report success backed only by ephemeral files. Published public reads may be unavailable or use the application's existing static data, but that is not evidence of durable storage.
- A public Supabase anon/publishable key alone permits only the intended public reads. It must not mark generic writes, prompt storage, categories, or copy statistics as ready. Admin writes remain unavailable.
- Missing, empty, or invalid `ADMIN_SECRET` credentials must not authorize moderation. Unauthorized moderation reads and mutations return `401`, regardless of whether Supabase storage is configured. A valid database secret is not an admin credential.
- A configured Preview key with incorrect project/schema/privileges should produce failed storage operations (or empty configured reads where the API intentionally handles a failed read); investigate the Preview function logs without exposing request headers, environment values, or credentials.
- Pass only when the expected records can be read on subsequent requests from the isolated Preview project, authorization boundaries hold, and no client response/log contains a credential.

## Local verification already represented in the repository

Use mocked local tests before the human Preview run:

```sh
node --experimental-strip-types --test tests/supabase_secret_key_compatibility.test.js tests/admin_security_remediations.test.js tests/phase27_storage_and_domain_readiness.test.js
git diff --check
```

The compatibility tests use synthetic fixture keys and mocked `fetch`; they verify `sb_secret_...` is sent only in `apikey`, legacy service-role header compatibility, precedence, public-only readiness, and separation from admin authorization. They do not contact Supabase. After Preview configuration, the human operator should execute the HTTP smoke test above against the Preview URL and inspect only sanitized status/results.
