# SwitchRoute agent instructions

Before changing any UI, read these project instructions in order:

1. `DESIGN.md` — incumbent brand tokens and visual language.
2. `docs/CODEX_UI_OVERHAUL_BRIEF.md` — the active whole-product UI/UX brief and acceptance criteria.
3. `docs/UI_DESIGN_TOOLKIT.md` — curated external skills, component references, licenses, and install commands.
4. `.agents/skills/switchroute-premium-ui/SKILL.md` — SwitchRoute-specific craft and implementation rules.
5. Relevant existing skill guidance in `.agents/skills/unslop/` and `.agents/skills/webapp-testing/`.

## Non-negotiable project constraints

- Preserve existing routes, data, search/filter behavior, access rules, API contracts, SEO metadata, canonical URLs, sitemap behavior, admin safeguards, and user-facing functionality unless the task explicitly changes them.
- Keep the exact homepage title: **“Another AI tool? Sure. Another Subscription? Nope.”**
- The project is React 18 + TypeScript + Vite 5 + Tailwind CSS 3.4. Existing dependencies include `motion` and `lucide-react`. Prefer the current stack and components; do not add a competing UI framework or animation package by default.
- Preserve the dark/light theme system and brand tokens documented in `DESIGN.md`. Dark remains the default.
- Use `BrandLogo` and the canonical brand-logo registry for product logos. Never recreate, substitute, or invent a brand mark.
- Never invent product features, free allowances, model access, testimonials, ratings, customer logos, usage statistics, or verification claims. Use catalog provenance and clearly label uncertain or third-party access.
- Do not copy components or assets from a reference repository until its current license and the individual asset/component terms have been checked. In particular, React Bits is marked `NOASSERTION` by GitHub in the current audit; treat it as inspiration only unless licensing is resolved.
- Avoid adding dependencies just to reproduce a screenshot. Explain any unavoidable dependency and its bundle/runtime cost before adopting it.

## Required workflow

1. Audit the existing UI before editing. Inventory route families, shared components, theme behavior, current screenshots, existing tests, and known regressions.
2. Establish a coherent page system and page-specific patterns. Do not force every route into one generic card-grid template.
3. Implement in reviewable stages, preserving behavior and adding regression tests for every changed interaction.
4. Run the existing test suite and build sequentially. Do not run `npm test` and `npm run build` concurrently: both can write/read generated `dist` artifacts.
5. Check the final `git diff` for generated sitemap, prompt runtime, logo runtime, or unrelated data changes. Revert generated changes that are outside the UI scope.
6. Capture and inspect real browser screenshots at desktop, tablet, and mobile sizes in both themes. Do not claim visual QA from JSX or a successful build alone.
7. Open a pull request with before/after evidence, changed routes, validation results, and all remaining warnings. Do not deploy directly from an unreviewed working tree.

## Skills

Use the locally available `switchroute-premium-ui` skill as the project-specific baseline. Install or invoke external skills only where they add distinct value; avoid running several overlapping design agents on the same file without a clear division of responsibility. See `docs/UI_DESIGN_TOOLKIT.md`.
