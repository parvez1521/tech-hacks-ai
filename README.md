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
└── tests/
    ├── catalog.test.js       # Unit tests for data, search, filters & sort
    └── routes.test.js        # Route matching tests
```

## Getting Started

### Development
```bash
npm run dev
```
Starts the local development server at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Creates an optimized, production-ready bundle in `dist/`.

### Automated Tests
```bash
npm test
```
Executes the test suite with Node.js built-in test runner.
