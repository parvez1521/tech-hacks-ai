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
| `--brand-blue` | `96 165 250` / `#60A5FA` | Dark theme primary |
| `--brand-cyan` | `34 211 238` / `#22D3EE` | Secondary accent; use sparingly |
| `--brand-violet` | `139 92 246` / `#8B5CF6` | Secondary accent; use sparingly |
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
