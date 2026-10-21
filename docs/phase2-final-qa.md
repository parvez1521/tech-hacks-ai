# Phase 2 final QA record

Audit date: 2026-10-22

## Browser route matrix

The router currently exposes static, parameterized, legacy-alias, single-slug, and not-found handling. This matrix contains 35 representative direct URL cases. Each was loaded at 1280×900, 768×1024, and 375×812 (105 route/viewport checks). A separate 35-route dark mobile pass also completed. Across those checks, each route rendered an H1, had no horizontal overflow, and had no broken images. Initial browser console smoke checks reported no console errors. Direct browser navigation was exercised; a hard refresh was not repeated for every case.

| Route case | Route case | Route case |
| --- | --- | --- |
| `/` | `/tools` | `/tools/supabase` |
| `/categories` | `/categories/developer-tools` | `/alternatives` |
| `/alternatives/firebase` | `/collections/trending` | `/ai-tools` |
| `/ai-tools/claude` | `/community-tools` | `/community-tools/claude` |
| `/free-ai-sites` | `/guides` | `/guides/cinematic-ai-video-workflow` |
| `/prompt-library` | `/prompt-library/gemini-commercial-product-photography` | `/free-tools` |
| `/free-tools/json-formatter` | `/compare` | `/pick` |
| `/saved` | `/updates` | `/offers` |
| `/offers/github-student-pack-copilot` | `/about` | `/contact` |
| `/privacy` | `/terms` | `/disclosure` |
| `/submit-tool` | `/submit-guide` | `/discoveries` |
| `/admin/moderation` | `/unknown-route` | |

Theme toggle behavior was checked in both directions. Axe ran across all 35 route cases in light and dark themes. The final light sweep was clean; its one delayed scan on `/free-ai-sites` was rerun separately and clean. The dark sweep exposed shared legacy color classes and two route-specific badge/callout issues; shared theme-token overrides and targeted color fixes were applied. The two delayed dark route results (`/free-ai-sites` and the prompt detail) were separately rerun after correction and clean. Dark mobile layout checks completed across all 35 route cases.

The browser smoke exercised the image resizer and text/JSON utility flows described below. The suite contains search, sorting, filtering, route, and form/data validation coverage. This QA did not submit externally visible forms, send chatbot prompts to a provider, or make authenticated admin changes.

## Accessibility

Historical records are inconsistent in scope. `qa-final-evidence.json` records 66 violations across 33 routes: 33 color-contrast and 33 label-content-name-mismatch entries, all recorded as serious in the detailed historical snapshot. `qa-audit-summary.json` contains 62 route/theme entries and 124 serious route-rule records (2,938 affected nodes); it is a different capture set and must not be added to the 66 count.

Fresh axe results after fixes: **0 violations** in the 35 light route scans and **0 violations** in the 35 dark route scans, with delayed cases rerun individually after the final color changes. Findings fixed included visible text/name mismatches in shared controls, low contrast in catalog, guide, offer, prompt, utility and legal-page content, and heading-order/landmark issues in shared card and navigation patterns. Theme labels now match visible state text; the chatbot launch button derives its name from visible child text.

## Utilities

The current registry contains **38 utilities**. All 38 utility routes were loaded in the browser; the existing suite also checks that registered tools resolve to implemented runners. Browser interactions verified the word counter/case conversion and JSON formatter success/error paths. Image resizing was exercised with locally generated fixtures: 16×8 PNG converted to 16×8 WebP and PNG outputs, with formats/dimensions inspected; unsupported, corrupt, and over-25-MB files showed validation errors. A stale asynchronous image-resize response race was fixed with a latest-request gate; old previews and output blob URLs are cleaned up.

This was not a full one-by-one browser E2E of every utility's unique transformation, nor did it export and externally validate every download format. Existing automated tests exercise the QR encoder, route-to-runner mapping, shared parser/security helpers, and the request gate, but remaining tools need focused E2E cases before claiming every implementation was manually verified. Media transcription needs a configured provider; tests confirm it returns a setup response without credentials. YouTube and Instagram entries are URL helpers, not downloaders, and do not bypass platform restrictions.

## Logos

See [logo-audit.md](logo-audit.md) for reconciled counts and the complete unresolved active identity list. The registry has 218 entries and 104 active unique identities. 44 active entries have official/Simple Icons source URLs, 8 use recorded workspace-provided provenance, and 52 active entries still lack a source URL. No logo identity was changed in this pass. Automated manifest parity, local path, SVG/PNG validity, and fallback checks remain in the suite. A full 218-logo visual contact sheet and independent first-party review of the 52 unresolved sources remain outstanding.

## Build, tests, and dependency review

- `npm test`: **464 passed, 0 failed** (115 suites).
- `npm run build`: successful. Build reports that `ADMIN_SECRET` is missing or still uses the development passkey; production admin access remains disabled until a strong random secret is configured.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Development-tree `npm audit`: 9 advisories remain (6 high, 3 moderate). A compatible `npm audit fix` resolved the `nanoid` and `source-map-js` advisories. The remaining transitive findings require major Tailwind 4 or Vite 8 upgrades; no force upgrade was applied.
- No `tsconfig.json`, TypeScript check script, or lint script is configured.
- The workspace has no Git metadata, so no clean working-tree or commit claim is available.

## Follow-up

1. Record and independently verify first-party provenance for the 52 active logo identities listed in `logo-audit.md`.
2. Add browser-level transformation, error, and download-integrity tests for the remaining utility implementations.
3. Plan Tailwind/Vite major upgrades separately with migration checks to remove the remaining development-only audit findings.
4. Configure a unique high-entropy `ADMIN_SECRET` in the production environment and confirm provider credentials for service-backed transcription if that feature is intended to be active.
