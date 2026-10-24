# Prompt artwork and logo provenance audit

Audit date: 2026-10-23

## Prompt artwork

- The 48 original SwitchRoute prompt previews are saved under `public/prompts/generated/`; their dimensions follow each image's composition rather than one fixed square size.
- Exact native dimensions are recorded by slug in `data/prompt-image-dimensions.json` and used to reserve accurate image geometry in the UI.
- The 534 MIT-licensed PromptFeed thumbnails are 380 pixels wide. Detail pages cap their display at native width, and landscape thumbnails retain a 3:2 gallery frame on mobile instead of being enlarged into a square crop.
- The image set has no repeated file hashes, missing assets, extension/signature mismatches, or files over 1.5 MB.
- The generator was Codex's built-in `image_gen` tool. The previews were made for Tech Hacks AI; no MeiGen images or prompt records were used.
- The previous five SVG illustrations remain in `public/prompts/` so any existing database records that still reference them do not break. Curated prompts no longer use them.
- The machine-readable inventory is [`prompt-image-audit.json`](./prompt-image-audit.json). Run `npm run prompts:audit` to refresh it; `npm run prompts:audit:remote` also checks recorded logo source URLs.

## Logo corrections

- Prompt provider labels now resolve through explicit aliases. Google/Gemini maps to Google Gemini; Anthropic/Claude maps to Anthropic; FLUX, Runway, Cursor, and Higgsfield each map to their canonical registry slug.
- The FLUX icon now uses Black Forest Labs' symbol from its brand-guidelines page, the Higgsfield icon comes from its official `icon.png`, and ChatGPT uses the app mark shown by the OpenAI Help Center.
- Google and Cursor are correctly labeled as Simple Icons sources. Eighteen more Simple Icons records now have direct source URLs after their local SVG path geometry was compared with the source.
- Thirty-six registry entries still lack traceable provenance. Their local artwork is retained for audit, but the UI shows an explicit neutral initials fallback for those entries. Thirty-three of those gaps belong to active catalogue identities; the audit JSON lists them.
- The registry has 223 entries. One hundred eighty recorded source URLs responded to the remote HEAD check; two returned inconclusive results (DeepSeek's site returned 403 to HEAD and Play.ht did not complete the request). These are not classified as invalid. Remaining entries had no source URL or were already marked as fallback.
- A complete visual inspection of all 223 logo assets was not performed. The targeted corrections above were checked at source and asset level; existing logo tests validate registry parity, local paths, and file signatures.

Simple Icons describes its artwork collection as CC0 while separately retaining brand/trademark caveats. Review its [license](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md) and [disclaimer](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md) before reusing a mark. This audit records provenance; it does not imply endorsement by any brand.
