TECH HACKS AI — OFFICIAL AI LOGO WEB EXPORT

Date of export: 2026-10-21T09:52:21.969836+00:00
Unique AI tools in catalog: 65
Actual web downloads: 57
Official logos verified: 30
Official favicon fallbacks: 27
Unresolved identities: 8
Files sourced from existing local assets: 0

RESEARCH METHOD
- Source of truth: src/data/aiToolsData.ts, deduplicated by canonical slug.
- Each official website was opened and inspected in a Playwright Chromium browser.
- Candidate assets were downloaded through the browser context from URLs exposed by the official page.
- No files from public/logos, the logo registry, the previous ZIP, or prior exports were used as inputs.
- Downloaded assets were checked for HTML masquerading, size, image signatures, and basic SVG/XML validity.

USAGE AND LICENSING NOTES
- Official brand marks may have trademark and brand-guideline restrictions.
- Website favicons are clearly labelled fallbacks and may not be suitable for marketing or redistribution.
- Review each source page and the brand's terms before publishing or redistributing these assets.
- The manifest records the source page, direct asset URL, and verification status for every tool.

UNRESOLVED TOOLS
- DeepSeek (deepseek): Official page returned HTTP 403; browser DOM was still inspected. Candidate https://chat.deepseek.com/favicon.ico: HTML response instead of an image asset. Candidate https://chat.deepseek.com/apple-touch-icon.png: HTML response instead of an image asset.
- Dreamina (dreamina): Candidate https://dreamina.capcut.com/favicon.ico: empty response. Candidate https://dreamina.capcut.com/apple-touch-icon.png: HTML response instead of an image asset.
- Haiper AI (haiper): Candidate https://haiper.ai/favicon.ico: HTTP 404. Candidate https://haiper.ai/apple-touch-icon.png: HTTP 404.
- Kokoro TTS (kokoro-tts): No direct logo or official favicon asset was exposed by the inspected page.
- LTX Video (ltx-video): No direct logo or official favicon asset was exposed by the inspected page.
- Meshy 3D (meshy-3d): No direct logo or official favicon asset was exposed by the inspected page.
- Replit Agent (replit-agent): Official page returned HTTP 403; browser DOM was still inspected. Candidate https://replit.com/favicon.ico: HTTP 403. Candidate https://replit.com/apple-touch-icon.png: HTTP 403.
- Whisper by OpenAI (whisper): No direct logo or official favicon asset was exposed by the inspected page.

ARCHIVE CONTENTS
- The ZIP's `logos/` entries are freshly downloaded web assets only. The
  working-tree `logos/` directory also contains the eight owner-provided files
  recorded in `provided-assets.csv`.
- manifest.csv — one row per catalog AI tool.
- provided-assets.csv — SHA-256 inventory for the eight workspace-provided
  files added after the browser export; these are not counted as web downloads.
- README.txt — this research and licensing note.
- unresolved.csv — tools without a verified/downloaded asset.

CANONICAL RUNTIME INTEGRATION
- The 30 `official logo` files from the ZIP export are copied to
  `public/logos/official-ai/` and retain their direct asset URLs in the
  canonical registry.
- The eight workspace-provided files are copied to the same runtime directory
  with `sourceType: provided`. They are visually reviewed against their
  official pages, but their direct asset URLs were not independently verified.
- Favicon fallbacks remain explicit fallbacks and are not promoted as original
  brand marks.
