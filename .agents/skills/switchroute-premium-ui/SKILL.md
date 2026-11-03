---
name: switchroute-premium-ui
description: Use when auditing, designing, redesigning, refining, or validating any SwitchRoute page or component. Applies the product's existing premium editorial technology-directory direction across homepage, navigation, directories, tool details, Frontier Models, Free Access, GitHub Projects, utilities, guides, prompts, offers, forms, and admin screens.
---

# SwitchRoute Premium UI

## Before acting

Read `AGENTS.md`, root `DESIGN.md`, `docs/UI_DESIGN_TOOLKIT.md`, and `docs/CODEX_UI_OVERHAUL_BRIEF.md`. Inspect the current component and rendered page before changing it. Reuse existing project components and theme tokens.

## Visual point of view

Make SwitchRoute feel like a premium editorial technology directory: useful, confident, content-rich, carefully typeset, visually distinctive, and easy to scan. The design should express the product's purpose—helping people choose a route to the right AI tool—rather than defaulting to generic SaaS layouts.

Use a consistent design language, but let each page's job determine its composition:
- Explore/discover: strong wayfinding, visual cues, useful previews, clear category distinctions.
- Operate/work: controls and data first, compact hierarchy, predictable states and recovery.
- Read/learn: readable line lengths, clear chapters, evidence and source context.
- Persuade/offer: a concise value proposition, actual proof and a clear action.

## Existing identity — preserve it

- Keep the exact homepage headline: “Another AI tool? Sure. Another Subscription? Nope.”
- Dark theme remains default; light theme is equally important.
- Existing semantic tokens in `src/index.css` are the source of truth. Do not introduce unrelated hex values when a token exists.
- Keep the existing Inter/system typography stack unless a deliberate, evidence-backed design-system change is approved.
- Use existing `motion` and `lucide-react` dependencies. Use `BrandLogo` and the local registry for brand marks.
- Keep all current route names, query parameters, search/filter behavior, SEO data, catalog data and business logic unless explicitly requested otherwise.

## Craft rules

1. Design from real content and tasks, not placeholder copy. Every panel needs a reason to exist.
2. Make hierarchy visible through type, scale, spacing, grouping, alignment and contrast before adding decoration.
3. Give page sections different layouts when their content/jobs differ. Avoid repeating an identical 3/4-card row down the page.
4. Use real, sourced product screenshots/previews and canonical brand logos. If there is no trustworthy asset, use the existing neutral fallback rather than a fabricated logo.
5. Use icons for wayfinding and meaning, not as decorative confetti. Keep icon family, size and stroke treatment consistent.
6. Make badges factual: Free, Trial, Open Source, Limited Credits, Paid API, Unverified and similar labels must match catalog provenance and limits.
7. Use gradients, glows, glass, shadows and motion sparingly and only when they reinforce a specific interaction or brand idea.
8. Dense utility/admin interfaces need operational clarity, not oversized marketing cards.
9. Preserve content density. Do not make the product feel empty in the name of minimalism; do not make it noisy with unnecessary helper text and metadata.
10. Use semantic elements, persistent form labels, accessible names, visible focus, keyboard paths, and clear error/retry states.
11. Respect `prefers-reduced-motion`. Animate state changes, not every element for attention.
12. Do not add a new dependency or copy an external component until compatibility, maintenance and licence have been checked.

## Required validation

- Check dark and light themes.
- Check 320, 360, 390, 768, 1024 and 1440 widths where relevant.
- Check keyboard navigation, Escape dismissal/focus return, focus visibility, touch targets, long labels, empty/error/loading states, no-logo/no-image fallbacks and horizontal overflow.
- Capture and inspect the actual rendered result. A successful build or passing JSX test is not visual QA.
- Run the existing test suite and build sequentially because generated `dist` artifacts are shared.
- Record exactly what was tested. Do not claim unperformed browser QA or full WCAG conformance.

## Stop conditions

Do not silently change the product's identity, headline, pricing/free-access truth, catalog classifications, brand assets, route structure, canonical/SEO behavior, backend/API logic, analytics or admin security as a side effect of UI work. Flag required changes separately and explain their impact.
