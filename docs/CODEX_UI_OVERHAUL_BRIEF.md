# Codex Task: Product-wide SwitchRoute UI/UX overhaul

## Mission

Improve the **entire SwitchRoute interface** so it feels like a polished, premium, coherent AI discovery product—not only a refreshed homepage. Treat this as a product-wide design and frontend-engineering project, with the incumbent brand and all working features preserved.

Start by reading root `AGENTS.md`, `DESIGN.md`, `docs/UI_DESIGN_TOOLKIT.md`, and `.agents/skills/switchroute-premium-ui/SKILL.md`. Use the upstream skills installed for Codex where relevant. Do not start by changing code.

## Product truth and existing constraints

- SwitchRoute is an AI tools, model-access, open-source project, utility, alternative and learning directory.
- Keep the exact homepage headline: **“Another AI tool? Sure. Another Subscription? Nope.”**
- Existing stack: React 18, TypeScript, Vite 5, Tailwind 3.4, Motion, Lucide React.
- Dark theme is the default; light theme must be equally complete.
- Preserve routes, search, filters, saved items, compare/pick flows, catalog records, official links, source provenance, pricing/access status, forms, API behavior, analytics/SEO metadata and admin safeguards.
- Preserve the canonical brand-logo registry and use `BrandLogo` for logos. Never invent or approximate official brand marks.
- Do not relabel paid/trial/limited/region-dependent routes as unlimited free access.
- Do not introduce fake reviews, user counts, usage figures, benchmarks, testimonials, or claims.
- Existing build warnings may include the large-chunk advisory and missing `ADMIN_SECRET` warning. Report them; do not mask them as part of a visual change.

## Phase 1 — Whole-product audit (no edits until findings are recorded)

Inventory every route family and shared shell. At minimum inspect:

1. Home and primary navigation/footer.
2. AI tools directory, category filters, search, pagination, tool detail pages.
3. AI video generators and free-entry/open-model filters.
4. Frontier Models and Free Access routes.
5. GitHub Projects and its verified/unverified community sections.
6. Open-source catalog, categories, collections, alternatives and compare.
7. Prompt Library, prompt detail pages, guides and guide details.
8. Utility tools, utility category pages and utility detail/work surfaces.
9. Offers, offer details, submission/contact forms, About/legal pages.
10. Saved items, Help Me Pick, discoveries, and admin/moderation surfaces.

For each route family record: visitor goal, current visual pattern, current strengths, inconsistencies, content density, missing/weak states, mobile issues, and whether the surface is Persuade / Operate / Read / Explore. Distinguish marketing pages from dense working interfaces.

Capture baseline screenshots before editing. Include desktop (1440), tablet (768/1024), and phone (390; also check the narrow 320/360 edge), dark and light themes.

## Phase 2 — Establish one coherent design system

Use UI/UX Pro Max to develop a direction from the existing SwitchRoute brand; use Taste Skill for subject-specific composition and art direction; use Impeccable for critique/audit/polish; use Addy Osmani / UI Skills for frontend quality and accessibility; use Make Interfaces Feel Better for interaction finishing.

Deliver a revised root `DESIGN.md` (only change tokens where the reason is explicit) covering:

- Color roles and both theme mappings.
- Typography scale, weights, line lengths and hierarchy.
- Spacing and content-width scale.
- Border, radius, elevation and surface hierarchy.
- Icon and brand-logo rules.
- Motion timing/easing and reduced-motion behavior.
- Form, button, input, filter, navigation, card, table and status patterns.
- Content density for Explore/Operate/Read/Persuade surfaces.
- Responsive behavior and accessibility rules.

Do not use the same visual treatment everywhere. The goal is a consistent design language with deliberate page-specific compositions.

## Phase 3 — Implement the product-wide refresh

Prioritize in this order:

### A. Shared shell
- Header, desktop dropdowns, mobile navigation, active states, breadcrumbs, footer, theme switch.
- Consistent page width, horizontal alignment, spacing and focus behavior.
- Dropdowns, popovers, dialogs and mobile menu must close/restore focus correctly.

### B. Homepage and discovery
- Preserve the established hero message.
- Give the page a strong hierarchy and a useful first-screen task.
- Rich, readable collection and task-category treatments with real tool logos/preview artwork from local, verified assets.
- Better discovery pathways for free video/image/audio tools, coding, research, open source, utilities and models.
- Useful supporting detail only where catalog data proves it; no invented badges or counts.

### C. Directories and detail pages
- Make filters, search, sorting, pagination, counts, access/pricing notes and empty states visually consistent.
- Cards should expose the right amount of information for the task; don't force all categories into the same card layout.
- Tool detail pages should make purpose, capabilities, pricing/free limitations, provider links, provenance and alternatives easy to scan.
- Preserve source dates and verification semantics.

### D. Dense working interfaces
- Utility tools, compare, pick, saved, submission and admin screens should prioritize task completion, not marketing decoration.
- Better control grouping, state feedback, validation, loading/error/empty states, keyboard flow and recovery.
- Use charts or data visuals only when real data exists.

### E. Reading and learning surfaces
- Guides, prompt library, updates and legal pages need readable line length, hierarchy, metadata, and accessible navigation.
- Use actual available prompt previews and image assets where relevant.

## Phase 4 — Quality and visual validation

- Validate all affected route families, not just the homepage.
- Test dark and light themes.
- Test phone widths 320, 360 and 390; tablet 768 and 1024; desktop 1440.
- Check horizontal overflow, clipped text, overlapping panels, focus visibility, keyboard navigation, touch target sizing (aim for at least 44px where practical), hover/pressed/selected/disabled/loading/error states, and reduced motion.
- Check long tool names, missing logos, no-image fallbacks, zero-results searches, empty saved state, invalid forms and long category descriptions.
- Use screenshots and inspect the rendered page at 1:1; do not claim visual QA based only on JSX or build output.
- Run `npm test` and `npm run build` sequentially, not concurrently.
- Run `git diff --check`.
- Confirm generated sitemap/prompt/logo artifacts did not create unrelated diffs.
- Keep accessibility checks honest: report the tools and states actually tested; do not claim full WCAG conformance from automated scans alone.

## Deliverables

1. Product-wide implementation, split into coherent commits/PRs if that reduces risk.
2. Updated root `DESIGN.md` and any brief updates necessary to match the actual shipped system.
3. Before/after screenshots for representative routes at all breakpoints and both themes.
4. `docs/UI_OVERHAUL_AUDIT.md` with route inventory, findings, decisions, and accepted/rejected reference patterns.
5. `docs/UI_OVERHAUL_QA.md` with exact routes, viewport/theme matrix, interactions tested, test/build results, and remaining issues.
6. A PR summary listing all changed route families and explicit non-goals.

## Definition of done

- The whole product feels like one intentionally designed system.
- Important route families have been reviewed and refined, including dense tool screens.
- No existing route or key interaction silently disappeared.
- Both themes remain usable and coherent.
- No fake product facts, logos, ratings, free-access claims or testimonials were introduced.
- Tests/build pass, or any failure is diagnosed and clearly reported.
- Screenshots demonstrate real rendered results at desktop, tablet and mobile.
- No production deployment until the PR and validation evidence are reviewed.
