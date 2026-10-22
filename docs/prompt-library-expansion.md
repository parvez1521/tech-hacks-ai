# Prompt library expansion and media provenance

## Original additions

Four original human-portrait recipes are featured first: a two-person editorial portrait, a woman’s window-light portrait, a men’s professional headshot, and a couple portrait. Their subjects and preview artwork are fictional and were created specifically for Tech Hacks AI. Four portrait WebPs and one video-poster WebP were added; the prior 43 generated previews remain intact.

Portrait tags provide filters for women’s portraits, men’s portraits, couples, professional headshots, street-style lifestyle images, and featured portraits. Existing categories for product imagery, editing, video, camera movement, design, architecture, and coding remain in the catalog.

## MeiGen permissions and import status

No MeiGen image, prompt, or video has been imported. MeiGen’s current [Terms of Service](https://www.meigen.ai/terms) prohibit automated access and scraping, crawling, mirroring, or bulk collection without prior written permission, and state that website endpoints are not a public data API. The official MeiGen plugin offers selected inspiration search and generation workflows, but no authorized bulk-export or reuse license for this project was available during this work. The library links visitors to MeiGen’s public gallery and product photography collection instead. Written permission or a documented export/reuse agreement is required before importing MeiGen records.

The existing `npm run prompts:import -- <dataset.json> [--import]` pipeline remains the authorized-source path. It deduplicates slugs and normalized prompt text, validates actual local image signatures/dimensions or remote image headers, requires an explicit `rightsConfirmed: true`, and now requires `rightsStatus` (`original`, `licensed`, or `permission-granted`). External preview media additionally require source URL, creator attribution, and license/permission details. It reports invalid rows without importing them.

## Video references

Four video recipes now record official Higgsfield, PixVerse, and Kling provider pages, locally hosted original poster artwork, link-only hosting, and explicit `suggested-recreation` provenance. No creator videos are embedded or downloaded. The recipe prompts were written by Tech Hacks AI; the provider links identify tools where a visitor may use them.

## Admin and storage

The existing `/moderation` prompt manager now edits featured ordering, media type, rights/source fields, video source and permission metadata, guide slugs, and local or authorized image references. A separate categories panel supports category create, edit, ordering, and deletion. `api/prompt-categories.js` keeps writes behind the existing moderator authentication and uses server-only Supabase service-role access. Apply the additive `techhacks_prompt_categories` table and RLS statements in `server/schema.sql` to enable persistent category changes. Without Supabase configuration, the curated prompt catalog, original artwork, and static categories continue to work locally.

## Guide media

Five guide steps now show relevant original still imagery: rainy-city keyframes for the cinematic image-to-video guide, a dashboard interface preview for the Artifact guide, and portrait examples for the portrait photography guide. The camera-motion step clearly labels the still as a reference rather than a generated clip. The cinematic guide also links to original video prompt posters associated with its workflow.
