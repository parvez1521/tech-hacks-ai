# Faymas-inspired prompt platform upgrade

## Reference and reuse boundary

Faymas was used as a product-reference request, not a content source. No Faymas posts, prompts, images, creator assets, or private endpoints are imported. A general web reader returned an indexed text view of a public page with a prompt feed, search and categories/tags navigation, cards with model labels and image counts, and like/copy/save engagement labels. This was not a live visual inspection. The in-app browser was disabled by settings, so no Faymas screenshot is represented as evidence. Further inspection stopped when Faymas's current terms showed restrictions on automated/non-human access.

Faymas's [Terms of Service](https://faymas.in/terms) describe its content and marks as protected, restrict use of the site to personal non-commercial use absent written permission, and prohibit systematic data retrieval without written permission. They also prohibit access through automated/non-human means. Accordingly, this work did not use REA automation, scrape, enumerate endpoints, or copy creator material. The Faymas adapter below is an offline import gate only; it does not fetch Faymas.

## Importing authorized Faymas exports

`npm run prompts:import:faymas -- <authorized-export.json>` exits unless `FAYMAS_IMPORT_AUTHORIZED=true` and a `FAYMAS_PERMISSION_REFERENCE` are explicitly set. Do not set those until written permission or an authorized export/API exists and reuse rights have been confirmed. The adapter checks each record for a Faymas source URL, creator attribution, license/permission status, and explicit rights confirmation. The shared import pipeline then validates image data, HTTPS sources, and unique slugs/prompt fingerprints. Imports are drafts; publication requires moderator review. `--import` additionally requires the existing server-side `PROMPT_IMPORT_URL` and `ADMIN_SECRET` configuration.

## Local discovery and analytics

- Existing saved prompts continue to use local bookmarks; recent prompt views are stored locally with a small capped history.
- Search includes title, description, complete prompt text, model/provider, visual style, aspect ratio, creator/source and tags.
- The gallery supports model, category/tag, style, ratio, image/video, and saved-only filters.
- `Recently added` sorts only records with real publication timestamps (`created_at` from Supabase; known catalog additions have their recorded date). Undated records sort after dated records.
- Previous hand-entered copy totals were removed. `Most copied` uses only successful copy events recorded by the `/api/prompt-stats` endpoint. The additive SQL in `server/schema.sql` creates the aggregate counter table and service-role RPC; no user identity or copy text is stored. The server limits repeated copies per IP and prompt to one count per 30 seconds.

## Creator submissions and moderation

`/submit-prompt` accepts the full prompt, category/tags, provider/model, visual metadata, preview URL, creator/source attribution, and rights details. Its API validates the record and inserts it as a `draft` using the server-only Supabase service-role key. Public roles receive no insert/update access. Moderators continue to manage and publish records using the existing authenticated `/moderation` workflow. The service-role credential is never sent to the browser.

Apply the additive sections in `server/schema.sql` to the existing Supabase project to enable prompt category storage and copy analytics. Creator submissions require the existing `techhacks_prompts` schema and server-side `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` configuration. Without database configuration, the existing static catalog continues to render, but public submissions and aggregate counts are unavailable.

## Validation notes

Project routes and all existing preview assets are retained. After this change, run `npm test`, `npm run build`, and `npm run prompts:audit`. Browser-based mobile checks depend on a browser target being enabled in Codex settings. Faymas visual screenshots remain an outstanding manual review because this session has no authorized, non-automated browser access.
