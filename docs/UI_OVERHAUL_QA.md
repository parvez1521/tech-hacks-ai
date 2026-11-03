# SwitchRoute product-wide UI overhaul: QA record

## Scope and design workflow

Implementation branch: `codex/switchroute-product-ui-overhaul`, based on `origin/main` at `ac70a88129126211c2529f7cacef1af66276e045`.

The preserved homepage H1 is **“Another AI tool? Sure. Another Subscription? Nope.”** It is the exact pre-overhaul wording in the historical source and the homepage regression test. Search, route data, collection relationships, theme persistence, submissions, backend behavior, metadata and canonical URLs were not intentionally changed.

The product audit and direction are in [UI_OVERHAUL_AUDIT.md](UI_OVERHAUL_AUDIT.md). The implementation used the installed UI/UX Pro Max search workflow, Taste's Product Performs direction (seed `1552989687`) and app-screen references, Unslop's screen-audit process, Impeccable context/polish/craft-floor guidance and detector, and the frontend UI engineering/baseline workflows. It preserves the existing SwitchRoute blue palette and product mark. Taste's photo-led examples and scroll/drag choreography were adapted out because there are no SwitchRoute product photos and those interactions would add unrelated behavior.

## Changes

- Added a shared semantic rhythm/type/control layer and route-family conventions while retaining page-specific layouts and existing theme tokens.
- Rebalanced the homepage hero around the original title, description, global search, task help and a live catalog preview. Kept the collection links, categories, frontier/free-access highlights, utility/offer discovery, daily discoveries and resource links.
- Reduced visual competition in collection cards and common directory surfaces; clarified header spacing and active/open states, footer hierarchy and filter-rail wrapping at phone widths.
- Applied consistent reading measure, focus treatment, input treatment, touch sizing, reduced-motion handling and safe-area spacing across route families.
- Kept all route definitions, catalog/provider records, verification rules, filtering logic, forms, service/API code and route metadata intact.

## Browser QA

The built Vite preview was inspected at `http://127.0.0.1:4173/` after the production build. The captured representative matrix covers 12 route families × 3 widths (1440, 768, 390) × 2 themes (dark/light), plus dedicated desktop header, expanded mobile navigation and full-page homepage captures. The baseline folder has the pre-change route captures.

| Surface | After screenshot |
|---|---|
| Homepage desktop, dark | [home-1440-dark.jpg](ui-overhaul-screenshots/after/home-1440-dark.jpg) |
| Homepage mobile, dark | [home-390-dark.jpg](ui-overhaul-screenshots/after/home-390-dark.jpg) |
| Homepage full page | [home-fullpage-1440-dark.jpg](ui-overhaul-screenshots/after/home-fullpage-1440-dark.jpg) |
| Desktop header | [header-desktop-1440-dark.jpg](ui-overhaul-screenshots/after/header-desktop-1440-dark.jpg) |
| Expanded mobile navigation | [mobile-navigation-open-390-dark.jpg](ui-overhaul-screenshots/after/mobile-navigation-open-390-dark.jpg) |
| Frontier Models | [frontier-models-1440-light.jpg](ui-overhaul-screenshots/after/frontier-models-1440-light.jpg) |
| Free Access | [free-ai-sites-390-dark.jpg](ui-overhaul-screenshots/after/free-ai-sites-390-dark.jpg) |
| GitHub Projects | [github-projects-1440-dark.jpg](ui-overhaul-screenshots/after/github-projects-1440-dark.jpg) |
| AI tool detail | [ai-tools-claude-390-dark.jpg](ui-overhaul-screenshots/after/ai-tools-claude-390-dark.jpg) |
| Alternatives detail | [alternatives-figma-1440-light.jpg](ui-overhaul-screenshots/after/alternatives-figma-1440-light.jpg) |
| Utility detail | [free-tools-image-resizer-390-light.jpg](ui-overhaul-screenshots/after/free-tools-image-resizer-390-light.jpg) |
| Prompt Library | [prompt-library-1440-dark.jpg](ui-overhaul-screenshots/after/prompt-library-1440-dark.jpg) |
| Guide detail | [guides-cinematic-ai-video-workflow-390-light.jpg](ui-overhaul-screenshots/after/guides-cinematic-ai-video-workflow-390-light.jpg) |

The full before/after captures are in `ui-overhaul-screenshots/before/` and `ui-overhaul-screenshots/after/`. The Vite preview does not host the repository's serverless `/api/discoveries` endpoint; the full-page home capture therefore shows the existing retryable API error state for Daily Discoveries, not live discovery cards. No API behavior was mocked or changed.

- Route pass: 38 route identifiers were checked in earlier live browser sweeps; final production-preview captures covered the 12 representative route families at all six viewport/theme combinations.
- Production-preview route matrix: 72/72 pages showed an H1, the expected theme and canonical URL, with zero document horizontal overflow.
- Taste inspector on the built preview at 1440, 768 and 390: zero horizontal overflow, zero side scrollers, zero broken images and zero console errors. Screens are saved under `.taste-skill/inspect-production/` locally; that isolated inspector browser did not inherit the saved cookie choice, so its captures include the existing consent banner.
- Search: typing `Claude` in global search produced 14 suggestion entries.
- Mobile navigation: opens; all visible links, summaries and buttons sampled were at least 44px high/wide; Escape closes the menu and focus returns to the menu button.
- Desktop navigation: Escape closes the open group and restores focus to its trigger.
- Both light and dark themes rendered with their expected `data-theme` value; collection filters were checked in the browser, including mobile wrapping.
- `git diff --check`: passed.

## Verification

Full suite (sequential): `npm test` — **615 passed, 0 failed, 0 cancelled, 0 skipped**.

Production build (after tests): `npm run build` — **passed**. The build generated the existing sitemap/runtime artifacts and prerendered 261 route pages. It reports a pre-existing 1,352.85 kB minified `heic2any` chunk warning. It also prints the app's existing missing `ADMIN_SECRET` security warning; admin access remains fail-closed.

No TypeScript typecheck is claimed. This repository does not currently expose a dedicated typecheck script.

## Remaining issues

1. The production build still emits the large `heic2any` chunk warning; code splitting is outside this visual-only scope.
2. The build environment has no production `ADMIN_SECRET`, so the existing security guard warns and disables privileged admin access. No environment configuration was changed.
3. The Impeccable source detector still flags retained brand/context patterns: gradient wordmark/Brand Kit treatment, purple moderator status, SafeMarkdown's semantic left border, Inter as the existing product font, an existing decorative grid rule, the incumbent FrontierBonusSection heading and homepage collection top accents; the existing chatbot also uses bounce animation. These were not removed wholesale because they are brand, state, markdown, non-home legacy, or functional activity treatments. Taste's final homepage metrics reported zero gradients, zero gradient text, zero micro-labels and no contrast/overflow/broken-image findings; its detector's low-picture signal is not a fit for a real catalog directory, and no arbitrary stock art was added.
4. The build's sitemap generator appended blank whitespace after the closing `</urlset>` in `public/sitemap.xml`. I verified that file had no pre-existing worktree edits, then restored only this build-generated output to its committed contents. Sitemap source logic and committed sitemap content are unchanged.

No deployment was performed.

## Mobile chat launcher repair follow-up

The original floating launcher was fixed to the viewport on phones and could overlap the live catalog preview or utility content while scrolling. It is now hidden below 1024px; the expanded mobile navigation provides a full-width, 44px “Ask the SwitchRoute assistant” action instead. This uses a local browser event to open the existing chat component; no chat API or backend behavior changed. The open dialog keeps its existing keyboard trap and Escape behavior. The mobile navigation action remains mounted behind the modal so Escape restores focus to that action. On desktop, the fixed launcher remains in the same bottom-right location and safe-area offset; focus returns to the newly rendered launcher after close. Mobile navigation retains its safe-area bottom padding, and the chat dialog retains its viewport/safe-area height. Reduced-motion behavior remains unchanged.

Built-preview QA at 390px in dark and light themes scrolled the full homepage and Image Resizer route from top to bottom, and separately scrolled the upload workspace and processing policy into view. The launcher wrapper computed to `display:none` at every scroll checkpoint on both routes/themes. The upload control and full processing-policy text remained visible. Opening chat from the keyboard-accessible mobile menu worked in both themes; Escape closed it and restored focus. At 1440px, the launcher remained fixed at the previous bottom-right location, opened the same dialog, and returned focus on Escape.

| Before | After |
|---|---|
| [Homepage, 390px dark](ui-overhaul-screenshots/before/home-mobile-dark.jpg) | [Homepage, 390px dark](ui-overhaul-screenshots/after/home-390-dark.jpg) · [full scroll](ui-overhaul-screenshots/after/home-fullpage-390-dark.jpg) |
| [Utility detail, 390px dark](ui-overhaul-screenshots/before/utility-detail-mobile-dark.jpg) | [Image Resizer, 390px dark](ui-overhaul-screenshots/after/image-resizer-390-dark.jpg) · [full scroll](ui-overhaul-screenshots/after/image-resizer-fullpage-390-dark.jpg) |
| — | [Upload workspace](ui-overhaul-screenshots/after/image-resizer-upload-390-dark.jpg) · [processing policy](ui-overhaul-screenshots/after/image-resizer-policy-390-dark.jpg) |
| — | [Mobile chat entry, dark](ui-overhaul-screenshots/after/chat-mobile-nav-dark.jpg) · [desktop launcher](ui-overhaul-screenshots/after/chat-desktop-1440-dark.jpg) · [desktop chat open](ui-overhaul-screenshots/after/chat-desktop-open-1440-dark.jpg) |

The same homepage, utility route, upload workspace, policy, and mobile-chat navigation captures are included for light theme. The regression check in `tests/mobile_viewport_overflow.test.js` requires the mobile launcher to be non-rendered, verifies the fixed launcher exists only at the desktop breakpoint with safe-area positioning, and checks the mobile nav open action and focus return path.

Follow-up verification: `npm test` — 616 passed, 0 failed, 0 cancelled, 0 skipped. `npm run build` — passed. `git diff --check` — passed. The build retains the existing `heic2any` size warning and fail-closed missing-admin-secret warning described above.


## Generated homepage visual-art pass

Original decorative workflow illustrations were prepared under `public/images/generated-ui/` for collection, category and task cards. These are original category illustrations, not official product logos, tool screenshots, model badges or capability claims.

The homepage uses artwork-led collection and category cards, matching Lucide pictograms, local canonical provider logos for frontier-model cards, and offer logos from the existing `BrandLogo` registry. Images are lazy-loaded and decorative images have empty alt text. Reduced-motion users do not receive image-zoom transitions. Generated artwork never replaces the canonical brand-logo registry.


## Homepage art and frontier-card layout correction

The previous lower-resolution raster art has been replaced with 20 individual 960×540 SVG illustrations in `public/images/home/`: four collection visuals, ten unique AI-category visuals, and six separate task-card visuals. These are original, text-free vector illustrations and do not imitate or replace third-party brand marks.

The model-access cards now place provider identity and model name in a full-width row, with the free-access chip on its own row below. This prevents the chip from squeezing the provider/title area at desktop, tablet, and mobile widths. Artwork panels no longer use opacity fades, zoom transforms, or overlay gradients that softened the previous artwork.
