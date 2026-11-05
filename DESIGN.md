# SwitchRoute Design System

This document records the current brand foundation and the intended direction for product-wide refinement. It is a baseline to evolve deliberately, not permission to rebrand or discard established behavior.

## Product and experience

SwitchRoute is an AI discovery directory. Its job is to help visitors find the right tool or model for a real task, understand access/pricing constraints, and move confidently to a verified destination.

The interface should feel like a premium, editorial technology directory: precise, useful, information-rich, calm, and distinctive. It should not look like a generic SaaS dashboard or a wall of interchangeable cards.

## Existing visual tokens

Source of truth: `src/index.css`.

### Brand palette

| Token | Current value | Role |
|---|---|---|
| `--brand-midnight` | `8 13 24` / `#080D18` | Dark theme background |
| `--brand-navy` | `19 41 74` / `#13294A` | Deep brand navy |
| `--brand-blue` | `255 106 61` / `#FF6A3D` | Dark theme primary |
| `--brand-cyan` | `255 106 0` / `#FF6A00` | Secondary accent; use sparingly |
| `--brand-violet` | `249 58 18` / `#F93A12` | Secondary accent; use sparingly |
| `--brand-ice` | `241 245 249` / `#F1F5F9` | Dark theme foreground |
| `--brand-slate` | `148 163 184` / `#94A3B8` | Muted foreground |
| `--brand-border` | `41 56 79` | Dark theme border |
| `--brand-light-bg` | `248 250 252` / `#F8FAFC` | Light theme background |
| `--brand-light-surface` | `255 255 255` / `#FFFFFF` | Light theme surface |
| `--brand-light-ink` | `15 23 42` / `#0F172A` | Light theme foreground |
| `--brand-light-blue` | `29 78 216` / `#1D4ED8` | Light theme primary |
| `--brand-light-border` | `218 226 235` | Light theme border |

The site also defines semantic tokens such as `--color-bg`, `--color-fg`, `--color-card`, `--color-muted`, `--color-border`, and `--color-primary`. Components should consume semantic tokens rather than hard-coded theme-specific colors.

### Typography

- Current body stack: Inter, then native system sans-serif fallbacks.
- Use a deliberate type scale with clear display, page-title, section-title, body, metadata, and data-label roles.
- Prefer readable line lengths and consistent weights. Do not add a second display family simply to make the UI appear premium.

### Theme

- Dark theme is the default.
- Light theme is a first-class supported theme, not an afterthought.
- Both themes must preserve contrast, border visibility, logo contrast, focus states, chart legibility, and selected/disabled states.

### Layout and interaction

- Existing layout utilities include `surface-card`, `interactive-card`, `eyebrow`, `focus-ring`, and shared brand/theme tokens.
- Use consistent content rails, spacing rhythm, control heights, and responsive breakpoints.
- Motion already exists in the dependency graph through `motion`. Use purposeful, short state transitions; respect reduced motion.
- Icons should use the existing `lucide-react` dependency. Brand marks should use `BrandLogo`.

## Intended quality bar

- Distinct hierarchy and page-specific composition rather than a repeated card template.
- Rich, useful directory content: categories, task labels, capability notes, access/price constraints, provenance, and useful metadata where the underlying data supports it.
- Consistent navigation, search, filters, pagination, empty/loading/error states, and detail-page structure.
- Strong visual rhythm, alignment, typography, and spacing across all route families.
- Real visual assets from the existing registry/catalog when relevant. No invented logos or decorative stock imagery that misrepresents a tool.
- Accessible keyboard operation, visible focus, readable contrast, touch targets, and responsive layouts.

Any token change must be deliberate, documented here, and applied consistently to both themes. Do not silently replace the current brand identity.

## Direction A — Dark precision (Phase 1, Nov 2026)

An evolution of the language above, not a new identity: brand tokens, the
route gradient, and Inter are unchanged. Direction A borrows Linear/Raycast
discipline:

- **Borders over shadows.** Surface levels are separated by the crisp 1px
  token border plus the inset top highlight. Resting card shadows are reduced
  to a single soft contact layer (`surface-card`, `interactive-card`); the
  hover glow remains the only expressive shadow.
- **One accent family.** Cyan→blue (`--color-primary`) is the accent. Violet
  appears only inside `--brand-route-gradient` (logo mark, gradient headline
  line, primary CTA) — never as a flat accent, badge, or panel tint.
- **Mono technical kickers.** `.eyebrow`, `.kicker`, and `.meta-label` use the
  system monospace stack (`ui-monospace, SFMono-Regular, Menlo, monospace` —
  no webfont) at 11px, uppercase, 0.14–0.18em tracking for section eyebrows,
  page-header kickers, card meta labels, and data chips.
- **Sharper radius scale.** Cards and panels: 12px (`rounded-xl`). Buttons,
  inputs, and chips: 8–10px (`rounded-lg`/`rounded-md`). Inner tiles and
  controls stay concentric with their container.
- **Density with air.** Listing grids use `gap-4`; cards follow a 3-row
  anatomy — header (logo tile + title + primary chip), 2-line description,
  footer meta row of mono micro-labels.

## Liquid Glass surface pass (Nov 2026)

Direction A's structure stays — bento homepage, Raycast category rows, mono
kickers, shared page-header pattern, cyan→blue accent discipline. What
changes is the material: flat border-led surfaces become translucent glass
(Apple's Liquid Glass language), and the sharp 12px radius scale relaxes to
soft concentric glass radii. This section supersedes Direction A's
"borders over shadows" and radius bullets for surface material only.

### Material recipe (tokens in `src/index.css`)

- **Fills:** `--glass-fill` (dark: white 5.5% over midnight; light: white
  55%), `--glass-fill-hover`, and `--glass-fill-strong` (card token at
  68% dark / 78% light) for floating panels.
- **Specular edge light:** inset top highlight (`--glass-highlight`),
  a faint inset bottom edge, and a 1px glass edge (`--glass-border`) —
  drawn as an inset box-shadow ring on the `.glass` utilities so a
  component's own border utilities (tone top borders, hover border
  colours) keep working; `.surface-card` keeps a real border because the
  shared cards rely on it for their edge.
- **Depth:** glass floats — resting cards carry a soft shadow
  (`--glass-shadow`); floating chrome carries `--glass-shadow-lg`.
- **Shapes:** primary buttons and chips are capsules (`rounded-full`);
  cards and panels are 16px (`rounded-2xl`) with concentric inner
  tiles — 16px because the homepage artwork carries a baked-in frame at
  that radius; a larger card radius makes the two curves read as a
  double frame; inputs on glass are capsules or glass fields (`.glass-field`).
- **Colour behind glass:** a fixed ambient wash (`--page-wash`, brand
  cyan/blue/violet at 3–6%) sits behind every page, and the hero aurora
  was enriched, so the translucency has something to refract.

### Where real backdrop blur is used vs fill-only

- **Real blur** (`blur(18–24px) saturate(160%)`): site header,
  `.glass-blur` (FilterBar toolbar), `.glass-strong` (header dropdowns,
  search results, cookie banner/modal), hero search field, hero
  discovery panel, chat dialog. These are chrome or single floating
  panels over coloured/scrolling content.
- **Fill-only glass** (`.glass`, `.surface-card`, `.interactive-card`,
  discovery cards): translucent fill + specular edges + soft shadow, no
  backdrop filter. Grid pages render dozens of cards; per-card blur is a
  scroll-performance risk on low-end mobile GPUs, and the ambient wash
  gives the fill its colour.

### Fallbacks and accessibility

- `@supports not (backdrop-filter: …)`: blurred glass chrome falls back
  to a near-opaque card surface.
- `prefers-reduced-transparency: reduce`: every glass tier rises to a
  solid token surface and blur is removed.
- Body text never sits on the most translucent tier; copy stays on the
  foreground token, and the strong tier backs anything text-heavy that
  floats (dialogs, dropdowns, search results).
