# Community submissions storage setup

The submission API keeps new records pending moderation. It must use durable
storage in a production/serverless deployment; bundled JSON and `/tmp` are not
production persistence. When storage is unavailable, public submissions return
HTTP 503 and published community listings are empty.

## Supabase (PostgreSQL)

1. Configure server-side `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the
   deployment environment. Never prefix these with `VITE_` or expose the service
   role key to browser code.
2. Run [`server/schema.sql`](../server/schema.sql) in the Supabase SQL editor (or
   use the repository's `npm run db:migrate` workflow after reviewing its output).
   The schema must include `techhacks_submissions` and
   `techhacks_published_additions`.
3. Deploy, submit a test record, verify it appears in the authenticated
   moderation queue as `pending`, approve it through moderation, and confirm it
   appears on `/community-tools` after refresh and a new server request.

The supported Upstash alternative requires server-side
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Keep these credentials
out of client bundles. Production readiness is not established until a
submission write, moderation update, published read, page refresh, and new
server request have all been verified against the configured durable provider.
