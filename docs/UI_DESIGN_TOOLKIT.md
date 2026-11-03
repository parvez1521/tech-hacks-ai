# UI Design Toolkit — SwitchRoute

Curated source register for Codex and human contributors. Sources are references or installable skills; this document does **not** vendor their source code or copy their components into SwitchRoute.

Audit date: 2026-11-03.

## A. Design and frontend skills

### Core skills recommended for the overhaul

| Skill / repository | Licence reported by GitHub | What it contributes | Use in SwitchRoute |
|---|---|---|---|
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | Design intelligence, style directions, palettes, type pairings, UX rules and stack guidance | Use to establish and persist a consistent system before implementation |
| [Taste Skill](https://github.com/Leonxlnx/taste-skill) | MIT | Art direction, subject-specific visual concepts, layout references and screenshot review | Use to create a distinct visual direction rather than a generic AI template |
| [Impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | Design commands for critique, audit, polish, typography, layout, accessibility, motion and design documentation | Use for staged UI audit and final quality passes |
| [Addy Osmani — Agent Skills](https://github.com/addyosmani/agent-skills) | MIT | Production frontend engineering, browser testing, performance, accessibility and code quality | Use for implementation quality and browser evidence |
| [ibelick — UI Skills](https://github.com/ibelick/ui-skills) | MIT | Baseline UI, design tokens, accessibility, motion performance and UI improvement | Use to check hierarchy, baseline consistency and accessibility |
| [Make Interfaces Feel Better](https://github.com/jakubkrehel/make-interfaces-feel-better) | MIT | Micro-interactions, transitions, pressed/focus states and interface finishing | Use on real interactive states, not as decoration |
| [Better Design](https://github.com/Moddingflow/better-design) | MIT | Design direction, DESIGN.md, tokens, motion, accessibility and real-interface checks | Alternative/companion design workflow; compare with Impeccable rather than blindly running both |

### Additional skill collections (catalogued; not recommended to install wholesale)

| Repository | GitHub-reported licence | Scope / caution |
|---|---|---|
| [Frontend AI Skills](https://github.com/JustineBijuPaul/frontend-ai-skills) | MIT | 70 modular frontend skills across React, architecture, animation, 3D, accessibility and performance. Smaller community project; inspect each skill before use. |
| [Emmraan Agent Skills](https://github.com/Emmraan/agent-skills) | MIT | 180+ general agent skills. Large and overlapping collection; do not bulk-install into this project. |
| [Skills.sh](https://skills.sh/) | Directory | Searchable directory for agent skills; inspect the source repository and licence of each result. |
| [OpenDesign](https://open-design.ai/skills/) | Directory | Design-skills index; treat each listed skill as an independent source with its own licence and maintenance status. |

### Codex installation

Codex discovers project skills from `.agents/skills/`. The project already has local `unslop` and `webapp-testing` skills. Install the core upstream skills from the repository root when Codex is ready to do the overhaul:

```bash
# Structured design system and design-intelligence workflow
npm install -g ui-ux-pro-max-cli@2.15.0
uipro init --ai codex

# Distinct art direction and screenshot review
npx skills add Leonxlnx/taste-skill --skill taste-skill -a codex

# UX critique, layout, typography, polish and hardening
npx skills add pbakaus/impeccable --skill impeccable -a codex

# Production frontend engineering and browser QA
npx skills add addyosmani/agent-skills --skill frontend-ui-engineering -a codex

# Baseline UI, accessibility and design-token consistency
npx skills add ibelick/ui-skills --skill baseline-ui -a codex

# Interaction and micro-motion refinement
npx skills add jakubkrehel/make-interfaces-feel-better --skill make-interfaces-feel-better -a codex
```

`Better Design` is catalogued as an alternative workflow; use it only if the agent identifies a capability gap, rather than installing overlapping design systems by default:

```bash
npx skills add Moddingflow/better-design --skill better-design -a codex
```

After installing, restart Codex if the new skills do not appear. Review the installed folder contents and upstream licence before accepting generated files. Installation commands are based on the upstream repositories and the Skills CLI; check the repositories for later changes before running them.

## B. UI component and design-reference repositories

| Repository | Licence reported by GitHub | What to reference | SwitchRoute guidance |
|---|---|---|---|
| [shadcn/ui](https://github.com/shadcn-ui/ui) · [docs](https://ui.shadcn.com/) | MIT | Accessible, composable primitives and copyable component patterns | Strong reference for consistent controls. Check Tailwind 3 / React 18 compatibility and dependencies of each copied component. |
| [Magic UI](https://github.com/magicuidesign/magicui) · [gallery](https://magicui.design/) | MIT | Animated hero elements, borders, backgrounds and motion-led components | Use selectively for one or two signature moments; avoid a page-wide animation layer. |
| [React Bits](https://github.com/DavidHDev/react-bits) · [gallery](https://www.reactbits.dev/) | NOASSERTION (GitHub metadata) | Interactive React components, text effects and visual motion ideas | Reference only until the applicable component/source licence is explicitly confirmed. Do not copy code or assets based on assumptions. |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) · [docs](https://motion-primitives.com/) | MIT | Small motion-led React components and transition patterns | Compare APIs with the project's existing `motion` dependency before adopting code. |
| [Tailark Blocks](https://github.com/tailark/blocks) · [site](https://tailark.com/) | MIT | Marketing and product page section compositions | Useful for section-level inspiration; adapt to SwitchRoute content and avoid cloning the stock landing-page sequence. |
| [Radix Primitives](https://github.com/radix-ui/primitives) · [docs](https://www.radix-ui.com/primitives) | MIT | Accessible low-level popovers, menus, dialogs, tabs and other interaction patterns | Use when an existing control needs a better accessible foundation; don't introduce duplicate primitive systems without need. |
| [Tremor](https://github.com/tremorlabs/tremor) · [site](https://tremor.so/) | Apache-2.0 | KPI, chart, metric and data-heavy dashboard patterns | Optional for analytics/admin surfaces only. Repository activity is older than the other references; verify maintenance, framework compatibility and chart dependencies. |

## C. SwitchRoute implementation compatibility

Current project stack, read from `package.json`:

- React 18, TypeScript, Vite 5, Tailwind CSS 3.4.
- `motion` and `lucide-react` are already installed.
- Existing `BrandLogo` component and canonical logo registry should be used for official/local brand artwork.
- Existing dark/light design tokens live in `src/index.css`; see root `DESIGN.md`.

Rules:

1. Prefer existing components and tokens. Reuse a reference component only when it improves a real task or fixes a demonstrated inconsistency.
2. Do not add Framer Motion, another icon pack, another component framework, or another CSS system just because a reference uses it.
3. Treat reference screenshots as inspiration, not as permission to copy logos, product names, illustrations, or proprietary assets.
4. Verify licence at the repository and component level before copying. GitHub's repository licence field is a discovery aid, not a substitute for reading licence files and notices.
5. Keep the directory focused: no vendoring entire external repositories, no duplicate package trees, and no unused dependencies.
