# PromptFeed import workflow

This workflow downloads the official PromptFeed MIT-licensed collection from its public GitHub repository. It does not scrape PromptFeed's website.

## What it does

- Downloads the collection JSON and preview index from the source repository.
- Downloads image files first and matches each one to its source prompt using the shared slug / filename.
- Validates image type, dimensions, content type, and a 10 MB per-image limit.
- Writes source attribution, creator/source URL, license notes, variables/placeholders, and preview alt text into a normalized JSON manifest.
- Reuses already-downloaded valid images unless `--force` is provided.
- Preserves failed downloads in an audit summary and exits non-zero if any pairs fail.

## Download images and prompt manifest

Run from the project root using Node.js 20+:

```bash
npm run prompts:download:promptfeed
```

The first run downloads assets into `public/prompts/promptfeed/`, writes the MIT license into `docs/licenses/PROMPTFEED-MIT-LICENSE.txt`, and creates `data/promptfeed-import.json`.

To force re-downloads and overwrite existing image assets:

```bash
npm run prompts:download:promptfeed -- --force
```

Do not publish the assets/manifest until the run summary reports 534 successful pairs and zero failed pairs (the upstream collection size can change). Review the source license and this repository's own license/attribution policy before making the collection public.

## Validate and import as drafts

The current import pipeline validates the manifest and rejects duplicate prompts, missing images, or missing rights metadata. First run validation only:

```bash
npm run prompts:import -- data/promptfeed-import.json
```

To send validated entries to the existing moderation queue, configure these environment variables locally (never commit secrets):

- `PROMPT_IMPORT_URL=https://<your-deployed-host>/api/prompts`
- `ADMIN_SECRET=<your-moderator-secret>`

Then run:

```bash
PROMPT_IMPORT_URL="$PROMPT_IMPORT_URL" ADMIN_SECRET="$ADMIN_SECRET" npm run prompts:import -- data/promptfeed-import.json --import
```

Imported records are created as **drafts**. Review them in the Admin Prompt Manager and publish them only after checking quality, attribution, license metadata, and representative image/prompt matches. Do not automatically publish every source record.

## Notes

- The source PromptFeed repository says its prompts were run with GPT Image 2 and pairs each prompt with the produced image. This importer uses each source prompt as-is instead of inventing a prompt from a mismatched image.
- The original PromptFeed image previews remain distinct files under `public/prompts/promptfeed/`; the existing 48 Tech Hacks AI previews are not overwritten.
- Prompt slugs are prefixed with `promptfeed-` to avoid collisions with the current catalog.
- If the source schema, preview filenames, or license changes, stop and inspect the upstream repository before proceeding.
