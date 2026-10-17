# OpenAlternative Software Discovery Platform

A modern, high-performance software discovery platform inspired by the publicly observable functionality of [OpenAlternative](https://openalternative.co/). It provides a curated index of open-source alternatives to everyday proprietary SaaS products.

## Core Features
- **Responsive Navigation:** Fixed header with animated logo, desktop navigation menus, and full-screen mobile menu drawer.
- **Dynamic Search & Filtering:** Instant text search across tool names, taglines, descriptions, tech stacks, and tags with instant clear action.
- **Expandable 4-Way Filter Drawer:** Filter by proprietary software target (Alternative to), category, tech stack, and open source license.
- **Multiple Sorting Options:** Order by Most Popular, Latest Releases, Most Stars, Trending (monthly star growth velocity), Most Forks, Last Commit recency, Name A–Z, Name Z–A, and Oldest.
- **Dual-State Interactive Tool Cards:**
  - *Default view:* Favicon, Title, Verified & AI Badges, 2-line clamped summary, and metadata row (Stars with growth indicator, Last commit timestamp, License).
  - *Hover view:* Extended 4-line description and direct chips linking to proprietary replacement targets (`/alternatives/[slug]`).
- **All 8 Core Routes:**
  - `/` — Homepage with Hero, sponsors ribbon, interactive catalog, and newsletter capture.
  - `/tools` — Dedicated complete catalog directory view.
  - `/tools/[slug]` — Deep-dive tool detail page with GitHub metrics, repository links, tech stack, self-hosting guide, and similar projects.
  - `/categories` — Software categories directory with tool counts.
  - `/categories/[slug]` — Category-scoped discovery catalog with subcategory filter pills.
  - `/alternatives` — Proprietary software directory with open-source replacement counts.
  - `/alternatives/[slug]` — Target proprietary app page with sticky sidebar and matching open-source alternatives.
  - `/collections/[slug]` — Curated collections: Trending, Self-Hosted, AI-Native, and Latest Discoveries.
- **URL Parameter Persistence:** Seamless synchronization of search queries, active filters, sorting preferences, and pagination with browser history (`pushState` / `popstate`).
- **Polished States:** Accessible pagination controls, empty search states with quick filter reset button, and 404 page.

## Project Structure
```
open-alternative/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.tsx
│   ├── types/
│   │   └── index.ts
│   ├── router/
│   │   └── Router.tsx
│   ├── data/
│   │   ├── seedData.ts       # 20+ verified open source tools
│   │   ├── categories.ts     # Taxonomy and subcategories
│   │   ├── alternatives.ts   # Proprietary targets
│   │   └── collections.ts    # Curated collections
│   ├── services/
│   │   └── catalogService.ts # Filtering, sorting, and search engine
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── ToolCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── AlternativeCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── Pagination.tsx
│   │   ├── EmptyState.tsx
│   │   └── Badge.tsx
│   └── pages/
│       ├── HomePage.tsx
│       ├── ToolsPage.tsx
│       ├── ToolDetailPage.tsx
│       ├── CategoriesPage.tsx
│       ├── CategoryDetailPage.tsx
│       ├── AlternativesPage.tsx
│       ├── AlternativeDetailPage.tsx
│       ├── CollectionDetailPage.tsx
│       └── NotFoundPage.tsx
├── public/
│   ├── _redirects              # Static SPA rewrites (Cloudflare / Netlify)
│   ├── favicon.svg             # Standalone SVG platform icon
│   ├── robots.txt              # Crawler permissions & sitemap reference
│   └── sitemap.xml             # XML sitemap covering all 40+ routes
├── vercel.json                 # Vercel SPA rewrite & caching config
└── tests/
    ├── catalog.test.js         # Unit tests for data, search, filters & sort
    ├── qa_verification.test.js # Sort, bounds, and data provenance tests
    ├── routes.test.js          # Core route pattern matching tests
    ├── ssr_routes.test.js      # React DOM server rendering & landmark tests
    ├── interactive_browser_simulator.test.js # Window history, back/forward & deep route simulator
    └── phase5_motion_polish.test.js          # Cursor glow, card spotlight & motion accessibility tests
```

## Getting Started

### Development
```bash
npm run dev
```
Starts the local development server at `http://localhost:3000`.

### Production Build & Preview
```bash
npm run build
npm run preview
```
Creates an optimized, production-ready bundle in `dist/` and runs the preview server.

### Automated Tests
```bash
npm test
```
Executes the comprehensive test suite (72 passing tests across 12 test suites) with Node.js built-in test runner.

## Motion & Interactive Lighting Design
- **Cursor Ambient Spotlight:** Hardware-accelerated radial spotlight that smoothly tracks fine pointers using `requestAnimationFrame` and CSS variables (`--mouse-x`, `--mouse-y`), bypassing React render cycles.
- **Card-Level Dynamic Border Glow:** Cards (`ToolCard`, `CategoryCard`, `AlternativeCard`) track localized mouse coordinates to illuminate borders and surface highlights on hover.
- **Microinteractions:** Tasteful logo rotation, smooth search ring focus glow, active filter drawer transitions, animated chevron triggers, and hover lift.
- **Strict Accessibility:** Comprehensive `@media (prefers-reduced-motion: reduce)` support, visible keyboard focus indicators (`focus-visible:ring-2`), and pointer-events immunity.

## Deployment Readiness
- **Vercel:** Ready to deploy out-of-the-box via `vercel.json` with client-side rewrites and immutable asset caching.
- **Cloudflare Pages / Netlify:** Pre-configured with `public/_redirects` (`/* /index.html 200`).
- **SEO & Social:** Open Graph, Twitter Cards, canonical tags, `sitemap.xml`, and `robots.txt` are included.

