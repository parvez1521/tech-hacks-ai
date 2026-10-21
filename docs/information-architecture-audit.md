# Information architecture audit

Audit date: 2026-10-21

## Current source map

| Section | Source of truth | Public route | Classification rule |
| --- | --- | --- | --- |
| AI Tools | `src/data/aiToolsData.ts` plus approved non-community overlays | `/ai-tools` | `AiTool` records that are not marked community and use an AI category slug |
| Community Tools | approved records from `data/published-additions.json` / `/api/submissions?action=published` | `/community-tools` | Published tool records with `section: community` or the legacy `community-verified` marker |
| Open Source | `src/data/seedData.ts` | `/tools` | `Tool` records with repository, license, self-hosting, and alternative metadata |
| Utility Tools | `src/data/freeToolsData.ts`, normalized by `src/data/catalogTaxonomy.ts` | `/free-tools` | `FreeToolUtility` records with one canonical `UtilityCategory` |
| Alternatives | `src/data/alternatives.ts` | `/alternatives` | Proprietary target records and their open-source relationships |
| Guides/prompts/offers | `src/data/guidesData.ts`, `src/data/promptsData.ts`, `src/data/offersData.ts` | Existing dedicated routes | Separate content types; not product-section records |

## Root cause of the mixing

The data arrays were physically separate, but there was no shared section field or
section-aware service boundary. Published tool submissions were converted in
`server/submissionsStore.js` into AI-shaped records with only a category, then
`src/services/aiCatalogService.ts` appended every published record to
`getAllAiTools()`. A community record such as `category: assistants` therefore
appeared in the AI directory, homepage AI helpers, free-AI filtering, and
universal search. The utility registry was separate, but its legacy category
labels (`media`, `developer`, `browser`, etc.) were not the same taxonomy used by
the requested Utility Tools directory.

Navigation compounded the ambiguity: the header called the utility directory
“Free Tools,” there was no public Community Tools route, and universal search had
no Community Tools result group. Category pages correctly operated on the
open-source `Tool` registry, but their labels were not a canonical section model.

## Repair mapping and audit result

- Added `catalogTaxonomy.ts` with canonical sections, AI category labels, and six
  non-empty utility categories.
- Added `section` to published AI-shaped records and made community detection
  backward-compatible with existing `community-verified` records.
- `getAllAiTools`, AI filters, featured/free/open-source AI helpers, homepage AI
  sections, and search now exclude community records.
- Added `/community-tools` and `/community-tools/:slug`; `/community` remains a
  compatible alias with the canonical URL set to `/community-tools`.
- Added an explicit Community Tools search group and public directory.
- Normalized all 38 utility records into exactly six populated primary utility
  categories. No utility record is included in AI filters.
- Source audit found no invalid open-source category slugs or invalid AI category
  slugs. Utility category normalization produced no uncategorized records.

## Current record counts

These are counts from the checked-in data at audit time:

- 27 open-source records in `seedData.ts`.
- 65 curated AI records in `aiToolsData.ts`.
- 29 published community tool records in `data/published-additions.json`.
- 38 browser/service utility records in `freeToolsData.ts`.
- 14 proprietary alternative targets.
- 133 unique product identities when the static catalogs and persisted published
  community overlays are combined by slug.

The runtime homepage still derives counts from registries and de-duplicates by
slug; it does not hardcode these values.
