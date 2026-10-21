# Tech Hacks AI — implementation and inspection report

**Inspection date:** 2026-10-20
**Repository:** `parvez1521/tech-hacks-ai`
**Branch at inspection:** `main`
**Scope:** dark-first theme repair, premium motion pass, accessible theme hint,
logo runtime safety, browser QA, and regression checks.

## Executive summary

The existing React + TypeScript + Vite architecture was preserved. Routing,
catalog data, Supabase/server integrations, authentication, SEO metadata, admin
pages, and existing browser utilities were not replaced or bypassed.

The first-visit experience is now midnight blue and dark by default. An explicit
Light/Dark choice is stored in `localStorage` and is applied by an inline
bootstrap script before React mounts. The header theme control is keyboard and
screen-reader accessible. A session-scoped hand-drawn hint points at the
control, then disappears after the first interaction.

The homepage now has a restrained atmospheric hero, CSS 3D signal prism,
pointer/scroll-responsive depth, staggered reveal motion, and a static/no-JS
content fallback. No GSAP, Lenis, Three.js, React Three Fiber, or new runtime
dependency was added; the existing CSS and IntersectionObserver approach was
the smallest compatible implementation.

## Superseding final implementation sweep — 2026-10-21

This section supersedes older phase counts and logo/transcription notes below.

- `npm test` passed **458 tests across 116 suites with 0 failures**.
- `npm run build` passed after transforming **1,578 modules**.
- The official-logo ZIP export was integrated through
  `scripts/sync-official-ai-logo-assets.mjs`: 30 browser-inspected official web
  assets now live under `public/logos/official-ai/` with direct asset URLs in
  the canonical registry.
- Eight workspace-provided unresolved-logo files are also integrated under the
  same directory with `sourceType: provided`, official page URLs, and SHA-256
  records in `exports/official-ai-logos/provided-assets.csv`. They are not
  claimed as direct web downloads.
- `BrandLogo` now exposes `provided-asset` separately from
  `verified-asset`; favicon-derived mappings remain neutral fallbacks.
- The server transcriber accepts auto-detect, English (`en`), and Hindi (`hi`),
  forwards explicit language guidance, uses `verbose_json` metadata when the
  configured OpenAI/Groq model supports it, and returns provider-detected
  language only when supplied. Auto-detect is recommended for Hindi-English
  mixed speech; translation, diarization, and timestamps are not claimed.
- Provider documentation checked: OpenAI transcription supports input-language
  transcription and verbose metadata; Groq documents `whisper-large-v3` and
  `whisper-large-v3-turbo` as multilingual, with optional ISO-639-1 language
  guidance.
- The transcriber catalog now states the real 4 MB server-upload limit, while
  the local MP4-to-MP3 converter retains its separate 100 MB browser-only
  limit. YouTube and Instagram remain validation/authorized-owner workflows,
  not general downloaders, and their parsers now require HTTPS and exact path
  shapes.

## Existing project inspection

- **Stack:** React 18, TypeScript/TSX, Vite 5, Tailwind CSS, Lucide React.
- **Routing:** the existing lightweight router in `src/router/Router.tsx`.
- **Theme:** `src/context/ThemeContext.tsx`, Tailwind class mode, CSS variable
  channels in `src/index.css`.
- **Motion already present:** `useScrollReveal`, CSS keyframes, the existing
  CSS 3D chatbot orb, and reduced-motion handling.
- **Animation dependencies:** no GSAP, ScrollTrigger, Lenis, Three.js,
  React Three Fiber, Motion, or Framer Motion dependency exists in this app.
- **Verification scripts:** the repository has the `tests/*.test.js` suite and
  the `npm test`/`npm run build` scripts. `scripts/final-verification-suite.js`
  was requested but is not present in this checkout; that gap is recorded
  rather than silently inventing a result.
- **Git safety:** the initial worktree was clean on `main`. No unrelated
  uncommitted user changes were overwritten.

## Theme behavior

### Implemented

- Dark is the synchronous default when `localStorage.theme` is absent or
  invalid.
- Saved `light` and `dark` values are honored before first paint.
- Theme state updates `data-theme`, `.dark`/`.light`, `color-scheme`, body
  classes, and the mobile browser theme color.
- The desktop and mobile controls share `ThemeToggle.tsx` and expose an
  action-specific accessible label (`Switch to light mode` / `Switch to dark
  mode`) plus `aria-pressed`.
- Hint dismissal is remembered for the current tab session under
  `techhacks_theme_hint_dismissed`.
- Dark token palette uses the requested midnight direction: `#080D18`
  background, `#111C2F` cards, `#17243A` elevated/muted surfaces, slate text,
  blue primary, and `#29384F` borders. Light tokens remain available and
  polished.

### Changed files

- `index.html` — pre-React theme bootstrap and no-flash `js` marker.
- `src/context/ThemeContext.tsx` — explicit preference state and persistence.
- `src/components/ThemeToggle.tsx` — shared accessible control and sketch hint.
- `src/components/Header.tsx` — desktop and mobile control placement.
- `src/index.css` — semantic theme tokens, focus styles, hint styles.

## Motion implementation

| Area | Implementation | Reduced motion / fallback |
| --- | --- | --- |
| Site-wide field | `AmbientGlow` paints a low-opacity grid/radial field behind all routes and only follows fine-pointer movement while settling | Global drift and pointer work stop/minimize under reduced motion; `pointer-events: none` |
| Homepage hero | `hero-shell` atmospheric gradients, grid texture, three low-opacity orb fields | CSS animation is disabled under `prefers-reduced-motion` |
| Hero depth moment | `src/components/HeroSignalVisual.tsx` CSS 3D prism, orbital halo, nodes, pointer tilt, scroll offset | No WebGL; visual is decorative and pointer-transparent; static prism remains |
| Hero entrance | Existing short staggered fade-up sequence | Existing reduced-motion rule removes it |
| Section reveals | Existing `useScrollReveal` IntersectionObserver, with child stagger on selected homepage grids | Reduced motion marks all sections visible immediately |
| Cards/categories | `motion-stagger-item` wrappers on homepage goal, editorial, AI, free-tool, utility, and category grids | Motion is opacity/transform only; cards remain readable without JS |
| Shared interaction | Existing card lift, button, search focus, chatbot, and navigation transitions retained | Global reduced-motion rule minimizes transitions |
| No-JS behavior | `index.html` adds `.js` only when the bootstrap executes; reveal hiding is scoped to `.js` | Without JavaScript, all sections render visible rather than remaining hidden |

No continuous high-frequency animation, native scroll replacement, forced smooth
scroll library, heavy canvas, or pointer-intercepting decorative layer was
introduced.

## Browser screenshots inspected

Screenshots were captured from the local Vite server at `http://127.0.0.1:3000`
with Playwright/Chromium and visually inspected during this task:

- `/tmp/tech-hacks-hero.png` — 1440px dark hero, signal prism, search, header
  hint, and readable contrast.
- `/tmp/tech-hacks-home-dark.png` — desktop first visit in dark mode.
- `/tmp/tech-hacks-home-light.png` — desktop after switching to Light mode and
  reloading; preference persisted.
- `/tmp/tech-hacks-home-mid.png` — scrolled desktop content, utility/category
  cards, cookie notice, and chatbot surfaces.
- `/tmp/tech-hacks-home-bottom.png` — newsletter/footer and persistent shell
  controls.
- `/tmp/tech-hacks-mobile-menu-final.png` — 390px mobile navigation after the
  menu animation settled.
- `/tmp/tech-hacks-home-mobile.png` — 390px full-page mobile capture.

The screenshots showed no horizontal overflow. The initial mobile screenshot
was taken during the 200ms menu fade and looked dim; a settled screenshot was
captured and re-inspected as `/tmp/tech-hacks-mobile-menu-final.png`.

## Logo inventory and verification

### Registry results

The audit was run against `src/data/brandLogos.ts`,
`public/logo-manifest.json`, `public/logos`, and the three active catalog data
sets (`seedData.ts`, `aiToolsData.ts`, and `alternatives.ts`). It was not based
on filenames alone.

| Measure | Result |
| --- | ---: |
| Canonical registry entries | **218** |
| Registry SVG files present | **218 / 218** |
| Registry SVGs with a `viewBox` | **218 / 218** |
| Missing registry assets | **0** |
| Invalid SVG signatures found | **0** |
| Duplicate asset-path owners | **0** |
| Active catalog records | **106** |
| Unique active catalog identities | **104** |
| Active identity mappings with traceable `sourceUrl` | **11** |
| Active explicit neutral fallbacks | **6** |
| Active mappings needing provenance follow-up | **87** |
| Offer records / offer asset files | **14 / 14** |

The active count is 104 unique identities because `Aider` is represented in
both the open-source and AI collections and `Perplexity` is represented in both
the AI and proprietary-target relationships. No fuzzy punctuation-stripping or
nearby-brand matching is used. The explicit alias table remains the only alias
mechanism.

### Runtime safety change

`BrandLogo.tsx` now treats an asset as renderable only when the registry has a
traceable source URL and the entry is not already marked `fallback`. Existing
missing/failed images also use the neutral monogram path. This prevents a
present-but-unverified local SVG from being presented as a confirmed brand mark,
keeps a fixed-size container to avoid layout shift, and exposes
`data-logo-status="verified-asset"`, `data-logo-status="provided-asset"`, or
`data-logo-status="neutral-fallback"` for browser QA.

### Traceable active mappings

These 11 active identities have recorded source metadata in the current
registry: Supabase, n8n, Claude 3.5 Sonnet, Perplexity AI, DeepSeek, Ollama,
Cursor Editor, ElevenLabs, Firebase, Notion, and Figma. “Traceable” means the
registry records a source URL; it is not a claim that every current logo is a
first-party wordmark. Simple Icons assets are identified as Simple Icons in the
registry.

### Explicit fallback mappings

The following active identities intentionally use a neutral monogram because
the current entry is favicon-derived or otherwise not a verified original mark:

- ChatGPT (`chatgpt`)
- Groq (`groq`)
- Ideogram v2 (`ideogram`)
- Runway Gen-3 Alpha (`runway`)
- Pika (`pika`)
- Higgsfield AI (`higgsfield`)

The prior xAI/X collision remains fixed: `xai` points to its neutral unresolved
entry and never borrows `/logos/x.svg`.

### Unresolved active identities and reason

These 87 entries have a local asset and an exact registry mapping, but no
traceable source URL in the current registry. They are rendered as neutral
monograms by the runtime until an official website/media-kit or maintained
Simple Icons source is recorded. This is intentionally not reported as 100%
logo correctness:

Firecrawl (`firecrawl`), Postiz (`postiz`), Baserow (`baserow`), AppFlowy
(`appflowy`), Penpot (`penpot`), Plausible Analytics (`plausible`), Meilisearch
(`meilisearch`), Hoppscotch (`hoppscotch`), Cal.com (`cal-com`), Typebot
(`typebot`), Immich (`immich`), Outline (`outline`), Novu (`novu`), Docmost
(`docmost`), Beekeeper Studio (`beekeeper-studio`), AFFiNE (`affine`), RustDesk
(`rustdesk`), Umami (`umami`), Aider (`aider`), Cline (`cline`), Roo Code
(`roocode`), OpenCode (`opencode`), Perplexica (`perplexica`), Khoj (`khoj`),
SearXNG (`searxng`), Google Gemini (`gemini`), Microsoft Copilot (`copilot`),
Mistral Le Chat (`mistral-le-chat`), Qwen Chat (`qwen-chat`), Meta AI
(`meta-ai`), OmniRush (`omnirush`), KIE AI (`kie-ai`), Google NotebookLM
(`notebooklm`), HuggingChat (`huggingchat`), Google AI Studio
(`google-ai-studio`), Open WebUI (`open-webui`), Dify.ai (`dify`), Langflow
(`langflow`), LocalAI (`localai`), LibreChat (`librechat`), Jan (`jan`),
AnythingLLM (`anythingllm`), ComfyUI (`comfyui`), vLLM (`vllm`), GPT4All
(`gpt4all`), llama.cpp (`llama-cpp`), v0 by Vercel (`v0-vercel`), Bolt.new
(`bolt-new`), Continue (`continue-dev`), Qwen 2.5 Coder (`qwen-coder`),
Replit Agent (`replit-agent`), FLUX.1 by Black Forest Labs (`flux-1`), Stable
Diffusion 3.5 (`stable-diffusion-3`), Recraft AI (`recraft`), Leonardo.ai
(`leonardo-ai`), Krea AI (`krea-ai`), Midjourney v6.1 (`midjourney`), Luma
Dream Machine (`luma-dream-machine`), Kling AI (`kling-ai`), Haiper AI
(`haiper`), Vidu (`vidu`), Hailuo AI (MiniMax) (`hailuo-ai`), Dreamina
(`dreamina`), PixVerse (`pixverse`), Wan 2.1 (Alibaba) (`wan-video`), LTX
Video (`ltx-video`), CogVideoX (`cogvideox`), Hedra (`hedra`), Kaiber
(`kaiber`), Suno (`suno`), Udio (`udio`), Whisper by OpenAI (`whisper`),
Kokoro TTS (`kokoro-tts`), Make (`make`), Copy.ai (`copy-ai`), Meshy 3D
(`meshy-3d`), Zapier Central (`zapier-central`), Airtable (`airtable`), Buffer
(`buffer`), Zapier (`zapier`), Google Analytics (`google-analytics`), Postman
(`postman`), Calendly (`calendly`), Algolia (`algolia`), Typeform (`typeform`),
Google Photos (`google-photos`), and Claude Code (`claude-code`).

### What was and was not corrected

- Corrected in runtime: unverified/fallback assets no longer masquerade as
  verified logos; they use a stable accessible monogram.
- Preserved: canonical slug mappings, exact aliases, local assets, PNG
  fallback paths, aspect-ratio containers, and production-safe `/logos/...`
  references.
- Not claimed: first-party visual verification for the 87 provenance-follow-up
  identities. A future brand-audit pass should verify each against the official
  website/media kit or add a Simple Icons source URL before promoting it to a
  trusted asset.

## Accessibility and responsive QA

- Desktop header hint points accurately toward the theme button without
  obscuring navigation.
- Mobile menu remains usable at 390px; the compact theme control is rendered
  inside the preference group and does not require hover.
- Keyboard focus reached the mobile theme button in Chromium and remained
  visible.
- `prefers-reduced-motion: reduce` produced all 10 homepage reveal sections as
  visible in browser QA.
- Desktop and mobile checks reported `document.documentElement.scrollWidth <=
  window.innerWidth`.
- Decorative hero layers use `pointer-events: none` and `aria-hidden="true"`.
- Search, navigation, route links, forms, chatbot, cookie notice, and existing
  admin/submission routes remain available.

## Route and browser smoke matrix

The following routes loaded from the real dev server in Chromium with no
console errors or failed network requests observed during the smoke pass:

- `/`
- `/tools`
- `/ai-tools`
- `/categories`
- `/alternatives`
- `/compare`
- `/discoveries`
- `/tools/supabase`
- `/alternatives/notion`

The requested `scripts/final-verification-suite.js` does not exist in this
checkout, so no result is claimed for it. Admin and submission logic remains
covered by the existing Node tests; a credentialed browser-admin workflow was
not run because no admin credentials were provided or read.

## Checks actually run

| Command | Result |
| --- | --- |
| `npm run build` | **Passed** — Vite production build completed; emitted vendor, catalog, page, and CSS chunks. Vite emitted the repository's existing warning about the default development `ADMIN_SECRET`; no secret was changed or read. |
| `npm test` | **Passed** — 445 tests, 118 suites, 0 failures after updating stale dark-only assertions to the requested toggle behavior and adding theme/logo/motion regression coverage. |
| Playwright/Chromium local dev smoke | **Passed** — dark default, saved light persistence, toggle dismissal, desktop/mobile overflow, reduced-motion visibility, route loads, console errors, and failed requests checked. |
| `curl -I http://127.0.0.1:3000/` | **Passed** — Vite dev server returned HTTP 200. |

## Remaining limitations

1. The repository does not contain `scripts/final-verification-suite.js`, so
   that specifically named check could not be run.
2. The logo audit is honest but incomplete at first-party visual-provenance
   level: 87 active identities need official source URLs/media-kit review. They
   now show neutral fallbacks instead of potentially misleading local marks.
3. No admin browser session was run because that would require credentials.
4. The production build still reports the pre-existing deployment warning that
   the default `ADMIN_SECRET` must be replaced in Vercel settings. This task did
   not modify credentials or environment files.
5. Screenshots are local QA artifacts under `/tmp` and were intentionally not
   added to the repository to avoid committing browser artifacts.

## Astra 6 cinematic upgrade — 2026-10-21

This section records the second upgrade pass without overwriting the earlier
2026-10-20 inspection history above.

### Capability and reference inspection

- The installed OmniRush CLI reported `omnirush 2.5.0`; an update to 2.6.2 was
  already downloaded and available. The current Astra model probe was run with
  `gpt-6-astra`.
- The verified CLI capabilities relevant to this task were local file
  inspection, shell/test/build execution, known-URL fetching, and image
  attachment inspection. The probe reported no dedicated browser automation
  tool inside OmniRush, so browser QA used the installed host Playwright 1.62.0
  Python package rather than claiming an undocumented Astra browser feature.
- `https://motion.dev/docs/react` and
  `https://motion.dev/docs/react-scroll-animations` were read directly. The
  relevant documented APIs are `motion`, `whileInView`, `useScroll`,
  `useTransform`, `useSpring`, and `useMotionValueEvent`.
- Both requested R3F references were inspected directly:
  `mirzasahin/r3f-gsap-scroll-3d-animation` demonstrates a full React Three
  Fiber + GSAP ScrollTrigger stack; `nadjascodejourney/scrollr3fproject`
  demonstrates R3F/Drei/Three/GSAP particles, camera parallax, and scroll
  movement.
- Motion MCP/search was not connected. The public docs and source repositories
  were sufficient to make the implementation decision: this directory already
  has CSS, RAF, and IntersectionObserver motion, so adding Motion and R3F
  together would add overlapping render/runtime cost without a meaningful
  product benefit. No animation dependency was added.

### Cinematic homepage changes

- `HeroFloatingLogos.tsx` is now a data-driven eight-brand orbit using the
  traceable active identities Claude, Perplexity, Cursor, DeepSeek, Supabase,
  Firebase, Figma, and Notion.
- The orbit uses stable local `BrandLogo` assets, restrained glass tiles,
  different CSS float timings, low-amplitude signal pulses, and a bounded
  pointer/scroll offset shared from `HeroSignalVisual` through the hero surface.
- The center remains reserved for the real headline, description, universal
  search, intent chips, and directory shortcuts. Desktop cards stay on the
  perimeter; mobile keeps four readable marks instead of shrinking the desktop
  composition.
- Reduced-motion users receive static cards and immediate section visibility.
  Decorative layers remain `aria-hidden`, pointer-transparent, and do not
  intercept search or navigation.
- The theme hint now chooses one quote per session from a curated list, stores
  it under `techhacks_theme_hint_quote`, and dismisses the non-blocking arrow
  and quote after theme interaction. The mobile hint appears only with the
  mobile menu's theme control.

### Shared logo-pipeline repairs

- `gemini` now records the verified official product URL
  `https://gemini.google.com`; the matching metadata was added to
  `public/logo-manifest.json`.
- Exact canonical identities no longer get shadowed by nearby brand aliases:
  `githubcopilot` resolves to GitHub Copilot, `googlegemini` resolves to Google
  Gemini, `github-copilot` aliases to `githubcopilot`, and `google-gemini`
  aliases to `googlegemini`.
- Offers now carry explicit `logoSlug` values and render through
  `BrandLogo` in both `OfferCard` and `OfferDetailPage`. Raw
  `offer.logoAssetPath` rendering was removed.
- Corrected offer mappings include:
  - Google Gemini → `/logos/googlegemini.svg`
  - GitHub Copilot → `/logos/githubcopilot.svg`
  - Google Cloud → `/logos/googlecloud.svg`
- AWS and Azure offer entries remain safe neutral fallbacks because the
  current registry still has no traceable source URL for those local marks.
  No asset was promoted merely because its file existed.
- `docs/logo-audit.md` now records the updated counts: 110 traceable registry
  mappings, 12 traceable active identities, 6 explicit active fallbacks, and
  86 active provenance follow-ups.

### Upgrade browser evidence

Screenshots captured from the real Vite server at `http://127.0.0.1:3000` and
visually inspected:

- `/tmp/tech-hacks-astra6-final-dark-desktop.png` — 1440px dark hero with the
  eight-logo perimeter, atmospheric field, functional search, theme hint, and
  existing assistant/cookie surfaces.
- `/tmp/tech-hacks-astra6-final-light-desktop.png` — Light Mode hero after the
  toggle, with the same logo identities and readable contrast.
- `/tmp/tech-hacks-astra6-final-dark-mobile.png` — 390px mobile hero with four
  simplified logo cards and no horizontal overflow.
- `/tmp/tech-hacks-astra6-final-mobile-menu.png` — settled mobile navigation
  with the compact theme control and session hint placement.

### Upgrade QA results

- First visit with a fresh browser context resolved to `dark`.
- The theme hint selected a single session quote, switched to Light Mode, and
  disappeared after interaction. Light Mode persisted after reload with body
  background `rgb(248, 250, 252)`.
- Homepage hero: 8/8 rendered logo cards had `data-logo-status="verified-asset"`
  and 0 broken logo images.
- Universal search opened for `claude` and returned a matching result.
- Desktop and mobile document overflow checks were false.
- Mobile rendered 4 simplified hero cards; reduced-motion rendered 4 static
  cards and all 10 reveal sections were visible.
- Browser console errors: 0. Failed requests: 0.
- Route smoke checks passed for `/`, `/tools`, `/ai-tools`, `/categories`,
  `/alternatives`, `/offers`, `/offers/jio-google-gemini-offer`,
  `/tools/supabase`, and `/alternatives/notion`.

### Upgrade checks actually run

| Command | Result |
| --- | --- |
| `npm test` | **Passed** — 447 tests, 118 suites, 0 failures. This includes new canonical offer-logo, hero-orbit, and session-quote regression coverage. |
| `npm run build` | **Passed** — Vite production build transformed 1,558 modules. The existing default-development `ADMIN_SECRET` deployment warning remains. |
| `git diff --check` | **Passed** — no whitespace errors. |
| Playwright/Chromium local browser smoke | **Passed** — theme persistence, search results, verified hero logos, mobile menu, reduced motion, route loads, overflow, console, and image-request checks. |

### Upgrade limitations

1. The requested `scripts/final-verification-suite.js` is still absent from the
   checkout and was not invented.
2. OmniRush's dedicated browser automation capability was not available in the
   inspected runtime; the host's installed Playwright package was used for the
   actual browser evidence above.
3. Credentialed admin/submission browser flows were not run because no
   credentials were provided.
4. Eight hero identities are provenance-traceable in the registry, but the
   broader catalog still intentionally keeps 86 active identity mappings in
   neutral fallback/provenance-follow-up status.

## Targeted restoration and utility expansion — 2026-10-21

This section records the follow-up correction requested after the cinematic
upgrade. The prior orbit was removed rather than replaced with another random
logo composition.

### Restored and removed homepage behavior

- Removed `HeroFloatingLogos.tsx`, its eight-logo orbit, signal pulses,
  positioning variables, and orbit-specific CSS. The existing headline,
  `UniversalSearch`, intent chips, route shortcuts, atmospheric field, and
  restrained `HeroSignalVisual` remain.
- Restored the theme hint lifecycle with a visible first render, a curated
  per-session quote, a sketch arrow beside the actual toggle, and dismissal
  only after theme interaction. Dismissal uses the versioned session key
  `techhacks_theme_hint_dismissed_v2` so prior stale sessions do not hide the
  restored feature immediately.
- Restored a truthful homepage catalog proof-point below the hero. The actual
  de-duplicated counts start at **104 static catalog identities** and update to
  **133 identities** after the 29 persisted community overlays load; the
  section counts are **27 open-source projects**, **65 AI platforms**, **29
  community tools**, and **38 utility tools**. The unsupported
  `10,000+ tools` claim was not restored.

### Built-in utility expansion

The utilities registry now contains **38 distinct tools** (6 existing plus 32
new runners), all routed through the existing `/free-tools/:slug` path. New
working interfaces are:

- Text and content: Text Diff Checker; Slug & Identifier Generator; Markdown
  Table Builder; Unicode Inspector; HTML Entity Encoder & Decoder.
- Code and data: CSV ↔ JSON Converter; JSON to TypeScript Interfaces; Regex
  Tester; URL Query Builder; CSS Specificity Calculator; CSS Gradient Generator.
- Security: JWT Decoder; UUID Generator & Validator; Secure Password Generator;
  Text Hash Generator; File Checksum Calculator.
- Browser and files: Timestamp Converter; Viewport & Browser Inspector; File
  MIME Sniffer; File Metadata Inspector.
- Images: Local Image Cropper; Image Palette Extractor; Favicon Size Generator;
  SVG Sanitizer & Optimizer.
- Media and compliant workflows: Audio Metadata Inspector; Video Metadata
  Inspector; Audio Trimmer; Authorized YouTube URL Helper; Video & Audio
  Transcriber; MP4 to MP3 Converter; authorized YouTube and Instagram workflow
  helpers.

The new runners use browser APIs such as Canvas, Web Crypto, Web Audio,
`DOMParser`, `URL`, `File`, and `Blob`. The YouTube utility deliberately parses
authorized public URLs only; it does not download videos, bypass DRM, or call
an undocumented downloader endpoint. Audio/video tools report browser codec
limits instead of claiming universal transcoding.

The utility directory gained local search and category filtering. The previous
generic “Client-side execution verified” placeholder was removed; a registry
mismatch now reports that the working runner is unavailable rather than making
a false success claim. Existing QR metadata was narrowed and its decorative
matrix replaced with a bounded byte-mode QR encoder for short payloads. Utility
privacy copy now describes local utility processing without claiming that every
normal application request is absent.

### Logo correction pass

The browser audit identified three visible dark-card failures even though the
canonical identities were correct: the monochrome Gemini, Google Cloud, and
GitHub Copilot marks rendered black. `BrandLogo` now applies scoped,
theme-aware presentation classes for `googlegemini`, `googlecloud`, and
`githubcopilot`; no cross-company aliasing was introduced. Offer alt text now
uses the canonical registry name. The dormant `huggingchat` (Hugging Face mark)
and `v0-vercel` (generic Vercel triangle) assets remain neutral fallbacks until
their product-specific provenance is independently verified.

### Restoration and utility browser evidence

Screenshots captured and visually inspected against the real Vite server:

- `/tmp/tech-hacks-restored-dark-home.png` — clean dark hero with no logo orbit,
  visible theme hint arrow, real search, and truthful catalog strip.
- `/tmp/tech-hacks-restored-light-home.png` — persisted Light Mode with the
  same focused hero and readable trust metrics.
- `/tmp/tech-hacks-restored-mobile-home.png` — 390px mobile hero without
  horizontal overflow.
- `/tmp/tech-hacks-restored-mobile-menu.png` — mobile navigation with the
  compact theme control and hint placement.
- `/tmp/tech-hacks-restored-utilities.png` — 38-item utilities directory with
  search and category filtering.
- `/tmp/tech-hacks-restored-offers-dark.png` and
  `/tmp/tech-hacks-restored-offers-light.png` — representative offer cards in
  both themes after the Gemini/Google Cloud/GitHub Copilot visibility repair.
- `/tmp/tech-hacks-ia-home-dark.png`, `/tmp/tech-hacks-ia-home-light-final.png`,
  `/tmp/tech-hacks-ia-mobile-home.png` — current desktop Dark/Light and mobile
  homepage regression evidence.
- `/tmp/tech-hacks-ia-community.png`, `/tmp/tech-hacks-ia-mobile-community.png`,
  `/tmp/tech-hacks-ia-utilities-final.png`, and
  `/tmp/tech-hacks-ia-mobile-utilities.png` — current Community Tools and
  Utility Tools desktop/mobile evidence.

Browser interactions verified the theme hint, orbit removal, dynamic count
strip, utility filtering (`hash` reduced the directory to one match), JSON to
TypeScript generation, invalid JWT errors, UUID generation, SHA-256 hashing,
SVG sanitization, authorized YouTube ID parsing, and the new media route
validation. All **38/38** utility
detail routes rendered without the missing-runner state, console errors,
failed requests, or horizontal overflow; sampled utility flows had the
advertised success/error behavior.

The current browser pass also verified 29 rendered community records on their
own detail routes, mobile no-overflow for the homepage/community/utility pages,
real MP4-to-MP3 conversion from a generated one-second MP4 fixture (25.9 KB
MP3 output), and the explicit 503 setup state for transcription when no server
provider key is configured.

### Latest checks

| Command | Result |
| --- | --- |
| `npm test` | Historical eager-run baseline — 442 tests, 114 suites, 0 failures. The current serial suite and media/IA regression coverage are recorded below. |
| `npm run build` | Historical eager-import baseline — 1,565 modules transformed; the chunk-size warning was addressed by the lazy-loading follow-up below. |
| `git diff --check` | **Passed**. |
| Playwright/Chromium browser QA | **Passed for sampled real flows** — dark/light persistence, hint lifecycle, orbit absence, truthful counts, utility filtering, sampled utility interactions, routes, image loads, console, and overflow. |

### Remaining limitations

1. The utility runner now lazy-loads its six group modules. MP4 conversion also
   downloads the FFmpeg WebAssembly runtime only when conversion begins; that
   deferred runtime and provider network time are not included in the initial
   bundle measurement.
2. The lightweight QR encoder intentionally caps payloads at 32 UTF-8 bytes and
   supports a narrow version 1/2-L range. It does not claim arbitrary QR
   payload, WiFi, contact-card, SVG, or high-error-correction support.
3. The full catalog still contains neutral fallbacks for unresolved provenance;
   file existence is not being used as a claim of brand correctness.
4. The named `scripts/final-verification-suite.js` remains absent, and no
   credentialed admin browser flow was run.

### Information architecture repair

The root cause was not CSS or card placement. Published community submissions
were converted into AI-shaped records with a category but no section field, and
`getAllAiTools()` appended every published record to the AI directory. A
community record categorized as `assistants` therefore appeared in AI filters,
homepage AI helpers, free-AI results, and universal search. Utility records had
their own registry, but their legacy labels (`media`, `developer`, `browser`,
etc.) were not the same taxonomy used by the requested Utility Tools directory.

The repair adds `src/data/catalogTaxonomy.ts` as the canonical section and
utility-category mapping, adds a separate `/community-tools` directory and
detail route, keeps `/community` as a compatible alias, marks published records
with `section: community`, and excludes community records from AI helpers and
filters. Universal search now presents Community Tools as its own result group.
The full audit mapping and source counts are recorded in
`docs/information-architecture-audit.md`.

Checked-in source counts are 27 open-source records, 65 curated AI records, 29
published community records, 38 utilities, and 14 alternative targets. The
combined persisted catalog has 133 unique product identities by slug. The
utility registry has six populated primary categories and no invalid source
category slugs were found.

### New media utility behavior

- **Video & Audio Transcriber** uses `/api/transcribe` only after the user
  starts processing. The endpoint requires a server-side `OPENAI_API_KEY` or
  `TRANSCRIPTION_API_KEY`, accepts media files up to 4 MB so multipart requests
  stay below Vercel's 4.5 MB function-body ceiling, allowlists OpenAI and Groq
  provider hosts, applies a per-function-instance request limit, times out
  after two minutes, and never logs transcript text. Without configuration, the
  UI reports setup/unavailable rather than fabricating a transcript.
- **MP4 to MP3 Converter** dynamically loads FFmpeg WebAssembly when conversion
  starts, validates local MP4 input, reports progress, verifies non-empty MP3
  output, and exposes a real download action. The original file is not changed.
- **YouTube Video Downloader** and **Instagram Video Downloader** are explicit
  authorized-workflow utilities. They validate and normalize public URL shapes
  but do not claim to download, scrape, access private content, bypass access
  controls, or store credentials. They link users to official owner/export
  workflows instead.

### Latest performance follow-up: utility lazy loading

The utility dispatcher now lazy-loads the six new utility groups with native
dynamic imports and React `Suspense` fallbacks. The existing `/free-tools/:slug`
route and all 38 runner mappings remain intact; the group modules are fetched
only when a matching utility route is opened.

The comparison below uses the same local production build command and the same
working tree, with the eager-import build above as the baseline:

| Build artifact | Eager baseline | Lazy-loaded build | Change |
| --- | ---: | ---: | ---: |
| `app-pages` | 525.23 kB / 106.60 kB gzip (34-tool eager baseline) | 489.41 kB / 97.47 kB gzip (38-tool lazy build) | **-35.82 kB / -9.13 kB gzip** |
| Utility group chunks | Included in `app-pages` | 62.36 kB / 21.55 kB gzip total | Deferred by route |
| Transformed modules | 1,565 | 1,578 | +13 from taxonomy/media additions and lazy boundaries |

The initial `app-pages` chunk is now below Vite's 500 kB warning threshold. The
deferred chunks are `UtilityTextTools`, `UtilityCodeTools`,
`UtilitySecurityTools`, `UtilityBrowserTools`, `UtilityImageTools`,
`UtilityMediaTools`, plus their shared helper chunk. The build logs an explicit
fail-closed `ADMIN_SECRET` configuration alert when no production secret is
configured; deployment must provide the secret before admin access is enabled.

Post-change verification:

- `npm test` — **Passed**, 455 tests across 116 suites, 0 failures.
- `npm run build` — **Passed**, 1,578 modules transformed; `app-pages` 490.60 kB / 98.01 kB gzip.
- `git diff --check` — **Passed**.
- Browser route sweep — **Passed**, 38/38 utility routes; no loading state,
  missing-runner state, console errors, page errors, failed requests, or
  horizontal overflow.
- Browser interaction smoke checks — **Passed** for JSON to TypeScript, invalid
  JWT, UUID generation, SHA-256 hashing, SVG sanitization, and YouTube ID
  parsing after the dynamic imports loaded.

## Final security, API, and media sweep — 2026-10-21

This follow-up pass corrected confirmed production issues rather than adding
speculative media integrations.

### Confirmed fixes

- Production/serverless admin authentication now fails closed when
  `ADMIN_SECRET` is missing or still uses the development fallback. The
  moderation gate no longer renders any default passkey in public HTML.
- The moderation dashboard now reads and writes the API's actual
  `toolData`/`guideData` records instead of the unrelated `data` shape. Tool
  descriptions, guide summaries, author details, and editorial edits now map to
  the persisted fields.
- Publishing now requires an explicit `approved` status in both synchronous and
  durable-storage paths. Pending, in-review, and rejected submissions return a
  409 response rather than bypassing moderation.
- Custom published slugs are persisted and used when a moderator edits a
  submission before publication.
- Submission and discovery APIs return 400 for malformed JSON bodies instead of
  reporting client input as a 500 server error. Forwarded client addresses are
  normalized to the first address before the local submission limiter uses them.
- `/api/transcribe` disables Vercel's default body parser, rejects requests over
  the deployed body budget, uses 4 MB media messaging, returns 504 for provider
  timeouts, 502 for provider/network failures, and preserves provider
  rate-limit responses as 429 where applicable.
- The browser transcriber now advertises the 4 MB deployment-safe limit while
  local-only MP4-to-MP3 conversion retains its separate 100 MB browser limit.

### Evidence from this pass

| Check | Result |
| --- | --- |
| `npm test` | **Passed** — 455 tests, 116 suites, 0 failures. |
| `npm run build` | **Passed** — 1,578 modules transformed; `app-pages` 490.60 kB / 98.01 kB gzip. |
| `git diff --check` | **Passed**. |
| `node --check` on the four changed API/store JavaScript files | **Passed**. |
| Local API smoke | **Passed** — `/api/transcribe` without a key returned 503; malformed `/api/submissions` returned 400; production-default admin token was denied. |
| Chromium moderation gate | **Passed** — no console errors, no page errors, and the default development passkey was absent from rendered HTML. |
| Chromium MP4-to-MP3 flow | **Passed** — generated MP4 fixture produced a verified 25.9 KB MP3. |

### Remaining production blockers

1. A real `ADMIN_SECRET` must be configured in the production host. The code
   now refuses the development fallback instead of warning and continuing.
2. Durable Supabase or Upstash storage must be configured before accepting
   production community submissions; unconfigured serverless writes remain
   intentionally paused with 503.
3. A real OpenAI or Groq transcription key is required for end-to-end provider
   verification. The current environment only verifies the explicit setup
   response.
4. The transcription limiter is a per-function-instance defense-in-depth
   measure. Production abuse/cost control should also use Vercel protection or
   a shared rate-limit service; no shared credentialed limiter is configured
   here.
5. YouTube and Instagram utilities remain URL validation and authorized-owner
   workflow tools. No general direct-download capability is claimed or
   integrated, because no authorized provider/API path has been verified.
6. The named `scripts/final-verification-suite.js` is still absent, and a
   credentialed moderation workflow was not run because no admin credential was
   available.
