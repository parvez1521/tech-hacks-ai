# Curated GitHub Projects Directory — Implementation Audit

Checked: 2026-11-03. No repositories were cloned or executed, and no deployment was performed.

## Implementation

- Added `/github-projects` as a dedicated indexable route, with route title/description handling, canonical URL handling through the existing app, JSON-LD `CollectionPage`/`ItemList`, and a sitemap entry.
- Added a Discover navigation link for desktop and mobile, plus a homepage featured-collection entry. The existing Open Source Catalog remains at `/tools`.
- Added ten task-oriented categories: AI Video Generation, AI Image & Design, AI Coding Agents, Local AI & LLMs, AI Automation & Agents, Speech & Voice, AI Research & RAG, Scraping & Browser Automation, Developer Utilities, and Self-hosted Apps. Projects may appear under secondary categories; they remain a single repository record.
- Added search, category and license/language/self-hosting/GPU/API-key filters, featured/recently-updated/newest-curated sorting, and nine-item pagination. Only records with `verified` status are shown by default.
- Editorial summaries, requirements, categories, review notes, and verification state are stored separately from GitHub repository metadata snapshots. Live repository descriptions are displayed in a distinct field and cannot overwrite editorial copy.
- The unauthenticated GET metadata endpoint accepts only the verified-repository allowlist. It reads GitHub's public REST API, caches responses in memory for 15 minutes and at the CDN for five minutes, limits forced refresh to one request per repository per five minutes, checks the API rate-limit header, and serves stale data when available. README excerpts are stripped to plain text and length-limited before React renders them. There is no scheduled refresh mechanism in this application; refresh is user-initiated. No GitHub token is required.

## Candidate review

All 17 supplied repository URLs were checked for public availability and archive state through GitHub metadata. README, license evidence, recent commit/activity, and documented use/requirements were reviewed for project candidates. Values in `githubRepositorySnapshots.ts` are dated snapshots, not live counts.

**Verified and listed (13):**

- [ComfyUI](https://github.com/Comfy-Org/ComfyUI) — GPL-3.0; local image/video workflow engine. Hardware needs vary by model/workflow; Comfy Cloud is a separate paid option.
- [Qwen Code](https://github.com/QwenLM/qwen-code) — Apache-2.0; coding agent supports remote and local model providers; provider costs/credentials vary.
- [Goose](https://github.com/aaif-goose/goose) — Apache-2.0; desktop/CLI agent with local and hosted model routes.
- [Open SWE](https://github.com/langchain-ai/open-swe) — MIT (README notes vendor directory is excluded); default deployment documents managed sandbox/tracing and provider credentials. Local execution lacks cloud sandbox isolation.
- [Ollama](https://github.com/ollama/ollama) — MIT; local model runtime; machine requirements depend on selected model. Cloud is separate.
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — MIT; local inference/runtime library; hardware and model requirements vary.
- [RamaLama](https://github.com/containers/ramalama) — MIT; container-oriented local model workflows; runtime/model requirements vary.
- [Kestra](https://github.com/kestra-io/kestra) — Apache-2.0; workflow orchestration platform; self-hosted infrastructure required.
- [Browser Use](https://github.com/browser-use/browser-use) — MIT; browser automation; model API credentials/costs depend on provider.
- [Haystack](https://github.com/deepset-ai/haystack) — Apache-2.0; RAG and AI application framework; provider requirements depend on selected components.
- [Firecrawl](https://github.com/firecrawl/firecrawl) — AGPL-3.0; self-hostable crawling/extraction with hosted service also available; operational/provider costs depend on deployment.
- [Handy](https://github.com/cjpais/Handy) — MIT; local speech-to-text desktop utility; performance depends on hardware/model choice.
- [MarkItDown](https://github.com/microsoft/markitdown) — MIT; document-to-Markdown utility; optional model integrations may require credentials.

**Held out pending review (4):**

- [Open-Higgsfield-AI](https://github.com/Autom8AI/Open-Higgsfield-AI) — `license-unclear`. README claims MIT, but GitHub detects no license and no root `LICENSE` file was found. It sends generation requests through MuAPI and requires its API key in the documented local setup; README privacy and request-flow claims conflict. README also says installers are unsigned/not notarized and describes bypassing OS warnings. It is clearly labeled an independent community project, not a Higgsfield product. Hosted costs/availability are unresolved, so paid-service requirement is unknown rather than asserted. No promotion until license, security, and service terms are independently resolved.
- [Continue](https://github.com/continuedev/continue) — `needs-review`. Current README says the repository is read-only and no longer actively maintained, despite Apache-2.0 metadata.
- [n8n](https://github.com/n8n-io/n8n) — `needs-review`. Sustainable Use License 1.0 and separately licensed Enterprise files do not support describing the project as OSI open source.
- [WhisperSpeech](https://github.com/collabora/WhisperSpeech) — `needs-review`. MIT metadata, but commit history showed its most recent commit on 2025-06-08; current maintenance/readiness needs review.

The three supplied awesome lists are research sources, not project listings: [awesome-video-generation](https://github.com/backblaze-labs/awesome-video-generation) (CC0-1.0), [awesome-private-ai](https://github.com/tdi/awesome-private-ai) (CC0-1.0), and [awesome-self-hosted-ai](https://github.com/frechdi/awesome-self-hosted-ai) (GitHub did not report an SPDX license). They are disclosed separately on the page.

Category totals overlap because of secondary categories: AI Video Generation 1; AI Image & Design 1; AI Coding Agents 4; Local AI & LLMs 6; AI Automation & Agents 3; Speech & Voice 1; AI Research & RAG 4; Scraping & Browser Automation 2; Developer Utilities 2; Self-hosted Apps 7. ComfyUI supplies the current AI-video category entry; no other submitted project was promoted solely to fill a category.

## Screenshots and QA

- Desktop directory: [desktop.png](github-projects-screenshots/desktop.png)
- Mobile directory: [mobile-directory.png](github-projects-screenshots/mobile-directory.png)
- Mobile navigation: [mobile-navigation.png](github-projects-screenshots/mobile-navigation.png)
- Existing homepage comparison captures from the concurrent redesign: [before desktop](redesign-screenshots/before-desktop.png), [after desktop](redesign-screenshots/after-desktop.png), [before mobile](redesign-screenshots/before-mobile.png), [after mobile](redesign-screenshots/after-mobile.png). There was no prior `/github-projects` page to capture before implementation.

Browser QA at 1440px and 390px: route/title render, 9 first-page cards render, search for “offline transcription” returns Handy, AI Video Generation returns ComfyUI, mobile navigation exposes the GitHub Projects link when Discover is expanded, Escape closes the mobile menu and restores focus to its trigger, and the directory has no horizontal overflow or page errors. Pagination and filter/sort behavior are also covered by the new node tests. The dev server does not host the Vercel function, so live GitHub refresh was validated by endpoint unit tests rather than browser-to-GitHub.

## Verification results and remaining limits

- `node --experimental-strip-types --test tests/github_projects_directory.test.js`: 5 tests pass.
- `npm run build`: passes (1603 modules transformed). Existing warnings remain for unset `ADMIN_SECRET` and large chunks; neither is introduced by this directory.
- `npm test`: fails overall in the existing broader suite. At this run: 526 tests, 326 passed, 37 failed, 163 cancelled. Failures are existing homepage structure/content, navigation/route expectations, offers, logo audit, SEO, and related journey assertions that conflict with the preserved in-progress redesign. The new GitHub Projects tests pass. The cancelled count follows failing parent suites. This feature does not change those assertions to hide the failures.
- `git diff --check`: passes.
- No `lint` or `typecheck` script is defined in `package.json`; the production build transpiles the app but is not a standalone TypeScript typecheck.
- Repository/license claims are an editorial snapshot as of the checked date, not legal advice or a security audit. Recheck README/license/activity and provider pricing before changing a held-out status or making a stronger cost/security claim. Hardware and inference cost can vary by selected model/provider.
