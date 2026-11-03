# SwitchRoute Unslop and Category Restructure Audit

**Date:** 3 November 2026
**Repository:** `/Users/parvez/tech-hacks-ai-audit`
**Design direction:** technical and editorial; product-first, restrained, and explicit about access evidence.

**Direction lines:** Product — help people find practical AI tools and model routes for a task. Character — exact, editorial, quietly useful. World — a working map of tools, providers, and terms. Moments — model-first frontier records and dated free-access evidence. Signature — a concise “checked” date beside each access route.

## Audit findings

- **Navigation:** Before the redesign, desktop used a Discover dropdown, several standalone directory links, an Offers link, and a Learn dropdown. Mobile presented a separate set of directory and resource groups, so the two layouts did not share one information architecture.
- **Repeated homepage content:** The homepage had more than ten sections with overlapping AI directory, free-plan, offers, alternatives, utilities, categories, and discovery previews. It also repeated calls to compare, pick, and explore. `FrontierBonusSection` did not exist as a separate component in this checkout; Frontier-related content was mixed into other previews.
- **Existing discovery capabilities:** AI platform records already had ten stable capability-category IDs, search/category filters and pagination. The open-source software taxonomy and utility catalog were separate. `/free-ai-sites` already provided search, category, access-type, account, and sort controls.
- **Model/provider duplication:** `AiTool` platform records can describe supported models and free plan metadata. That is useful for product listings, but it does not represent model identity, model ownership, or a particular provider route. OmniRush and KIE AI already have catalog records; a second platform record would duplicate them. RusherAI was not in the catalog.
- **SEO and routes:** The app uses a custom client router and updates title, description and canonical URL from `src/App.tsx`. `/free-ai-sites` is a public indexable URL and was retained. The sitemap is `public/sitemap.xml`; the existing prompt sitemap generator augments it. AI-tool category filters use query parameters, which remain outside sitemap entries and canonical URLs.

### Screen-audit signs and nine-pass treatment

The original homepage showed several Unslop signs: overlapping discovery grids repeated the same directory intent; dense standalone navigation labels differed by viewport; the Free AI page hard-coded light surfaces and high-contrast blue text; the shared AI card used a radial color wash and a large hover lift; headings used very heavy weights; small labels used uppercase tracking; and many lower sections relied on scroll-reveal motion. The hero also stacked multiple actions and surrounding feature treatments competed with the live catalog preview.

The requested restructuring allowed a full hierarchy change, so the nine-pass workflow was applied across the redesign:

1. **Spacing:** removed the repeated feature-grid rhythm and set a consistent section/card hierarchy.
2. **Color:** used the existing theme surface/text/accent tokens on the new surfaces; removed the AI-card radial wash.
3. **Icons:** retained the established Lucide set and used icons only where they identify an action or resource.
4. **Copy:** changed the headline to explain the task, replaced “100% free”/permanent-quota language with conditions and checked dates, and removed the extra homepage claims.
5. **Type:** reduced the Free Access heading weight and normalized small section labels.
6. **Layout:** made the homepage collection-first and the Frontier page model-first, with consistent desktop/mobile navigation groups.
7. **Details:** added explicit ownership, provider relationship, allowance, region, account, terms/source, status, expiry and verification fields.
8. **Visuals:** preserved the SwitchRoute logo and the catalog-backed hero preview; no new stock art or illustration was introduced.
9. **Motion:** removed homepage scroll-reveal dependencies and replaced AI-tool card lift/wash with a restrained border/focus treatment.

## Implemented architecture

The top-level navigation is now **Discover**, **Build**, **Learn**, and **Offers**. Desktop dropdowns and the mobile disclosure menu use the same group/link data. The mobile trigger is a 44px target; Escape closes the menu and restores focus. Offer links can preselect student, startup-credit, or discount filters through the existing `/offers` route.

The AI capability taxonomy keeps its existing IDs and adopts the requested labels: AI Assistants & Reasoning; Writing & Content; Image Generation; Video Generation & Editing; Audio & Voice; Music; Coding & Development; Productivity & Research; Automation & Agents; Design & Creativity. Frontier Models and Free Access are collections that cross these capability categories; neither was added as a duplicate capability.

`src/data/modelAccessCatalog.ts` separates three records:

1. **Models:** canonical name, owning organization, official documentation, family, capability category, capabilities, API availability/pricing, and verification date.
2. **Providers:** official organizations, existing catalog platform references, or independent community/third-party providers.
3. **Access routes:** model/provider relationship, access mode, claim/source URLs, allowance/reset, account requirement, region, conditions, status, verification date, and optional expiry.

`/frontier-models` is a model-first searchable/category-filtered collection with route relationship labels, canonical metadata, and CollectionPage/ItemList JSON-LD. `/free-ai-sites` remains the Free Access route; it now leads with currently verified model routes and retains its existing platform search/filter/sort experience below. It labels catalog free plans as platform-level listings and avoids describing them as unlimited or permanent. Expired/unverified model routes are excluded from current access listings.

The homepage is organized into the hero/global search, three featured collections, category/task browsing, three recent discoveries, two active featured offers, and lower resource-directory links. The full provider grid is not rendered on the homepage. Existing Open Source, Utility, Alternatives, Compare, Offers, AI detail, and discovery pages remain available. No production config, catalog identities/counts, or unrelated image assets were intentionally changed.

## Provider and access evidence

All newly entered model and route records have `lastVerifiedAt: 2026-11-03`. “Verified” here means checked against the linked provider/owner source on that date; it does not imply independent account-level quota testing.

| Record | Source and relationship | Access classification |
| --- | --- | --- |
| GPT-6 Astra — OpenAI | [Official model documentation](https://developers.openai.com/api/docs/models/gpt-6-astra) | Official paid API; published token pricing is shown on the model record. |
| Claude Opus 5.5 — Anthropic | [Official model page](https://www.anthropic.com/claude/opus) and [plan pricing](https://claude.com/pricing) | Official paid API and paid Claude plan. The Claude Free plan is not listed as Opus access. |
| GPT-6 Astra and Claude Opus 5.5 — RusherAI | [RusherAI provider page](https://rusherai.com/) | Third-party/community access. The provider advertises 50 million tokens shared weekly across nine models, account required, region not published. It is not represented as affiliated with OpenAI or Anthropic; continued access is not guaranteed. |
| Seedance 2.5 — ByteDance | [Official model page](https://seed.bytedance.com/en/seedance2_5) and [BytePlus ModelArk API documentation](https://docs.volcengine.com/docs/ark/seedance-2-5?lang=en) | Official paid API route. Classified under video; not in Free Access because a qualifying free generation route was not verified. |
| Seedance 2.5 — KIE AI | [KIE AI model route](https://kie.ai/seedance-2-5) | Third-party paid API route referencing the existing `kie-ai` AI-tool record. Trial credits are not promoted as Seedance access because the available credit amount was not verified to cover a generation. |
| OmniRush | Existing `omnirush` AI-tool record | No new tool/provider record created in this change. |
| KIE AI | Existing `kie-ai` AI-tool record | No duplicate platform record created. |
| RusherAI | Provider route only | Not added as a canonical AI platform record; evidence is its own published page and should be treated as provider-reported. |

## Unslop installation and process

The complete upstream `skills/unslop` directory was copied to `.agents/skills/unslop/`, including `SKILL.md`, references, scripts, and `agents/openai.yaml`; the upstream license is included at `.agents/skills/unslop/LICENSE`. The skill manifest sets the display name and description for OpenAI agent discovery. Damir Sokolovsky attribution and CC BY 4.0 terms are retained in the upstream skill/license content. The source is [heydamir/unslop](https://github.com/heydamir/unslop/tree/main/skills/unslop); license: [CC BY 4.0](https://github.com/heydamir/unslop/blob/main/LICENSE).

The screen audit found a long, repetitive homepage, inconsistent desktop/mobile navigation, and content hidden by scroll reveal until visited. The redesign applies the skill’s screen-audit and direction process, reuses the existing SwitchRoute logo, type, dark/light theme and functional catalog, and avoids adding animation or illustration. The optional story-video/ffmpeg workflow was not run.

## Screenshots

Before and after captures are in `docs/redesign-screenshots/`:

| Before | After |
| --- | --- |
| [Desktop](redesign-screenshots/before-desktop.png) | [Desktop](redesign-screenshots/after-desktop.png) |
| [Mobile](redesign-screenshots/before-mobile.png) | [Mobile](redesign-screenshots/after-mobile.png) |

The after captures show the homepage at 1440px and 375px widths. Before captures are the original homepage at the same widths. The cookie prompt was dismissed using “Essential Only” before the after captures. Browser checks found no horizontal overflow at 375px.

## Files changed

- `.agents/skills/unslop/` — full Unslop skill, manifest, references, scripts, and license.
- `src/components/Header.tsx` — shared four-group navigation and keyboard-accessible mobile menu.
- `src/pages/HomePage.tsx` — reduced, ordered discovery homepage.
- `src/pages/FrontierModelsPage.tsx` — new model-first collection.
- `src/pages/FreeAiSitesPage.tsx` — reused Free Access route, current model routes, theme-aware presentation, accurate access language.
- `src/data/modelAccessCatalog.ts` — separate model/provider/route records and active-route filtering.
- `src/data/catalogTaxonomy.ts` — requested taxonomy labels, unchanged category IDs.
- `src/pages/OffersPage.tsx` — initialize offer filter from supported query parameters.
- `src/router/Router.tsx`, `src/App.tsx` — route and page metadata.
- `src/components/AiToolCard.tsx` — quieter hover treatment.
- `public/sitemap.xml` — indexable `/frontier-models` entry; no filter URLs.
- `tests/model_access_catalog.test.js` — catalog relationship, route, and expiration assertions.
- `docs/redesign-screenshots/` — four before/after captures.
- `docs/UNSLOP-AND-CATEGORY-RESTRUCTURE-AUDIT.md` — this report.

## Verification

- `npm run build` — passed. Existing build output warns that some chunks exceed 500 kB and that the production `ADMIN_SECRET` is unset; these are unrelated to this frontend change.
- `npm test` — 508 passed, 40 failed, out of 548. Failures are overwhelmingly source/markup assertions that require the removed old homepage sections, old hero copy, old navigation markup, scroll-reveal hooks, and the old Free AI heading. Those expectations need a dedicated test refresh against the new IA. The failures were not hidden by weakening assertions. The new `tests/model_access_catalog.test.js` cases pass (3/3).
- `git diff --check` — passed.
- The project defines no `lint` or `typecheck` npm scripts and has no root TypeScript configuration. `npm run build` and the test prebuild successfully bundle the app, but this is not a substitute for a standalone typecheck.
- Browser QA: `/`, `/frontier-models`, `/free-ai-sites`, `/offers?type=student-plan`, `/ai-tools?category=video`, `/ai-tools/claude`, `/tools`, `/free-tools`, and `/alternatives` rendered. Video filtering on the Frontier page returned Seedance 2.5 only. Free Access showed the two RusherAI model routes and no Seedance card. Canonical URL remained `/offers` for the filtered offers query. Mobile menu group parity and Escape/focus restoration were checked at 375px.

## Remaining issues

- Refresh the legacy homepage/navigation source-level tests to assert the new architecture and keep their meaningful behavioral coverage. The full suite is not green until this is done.
- RusherAI quota, supported model list, region, account behavior and continued availability are provider claims. They were not independently verified by creating an account; recheck before presenting the route as active beyond this audit date.
- The currently listed official/API prices and model/region availability can change; retain the dated source trail and verify them again before publication.
- Standalone lint/typecheck commands are not configured in this project.
