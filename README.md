# Tech Hacks AI — Software & AI Discovery Platform

**Tech Hacks AI** is a curated, high-performance software discovery platform combining top generative AI tools, verified free software platforms, open-source alternatives to proprietary SaaS, step-by-step tutorials, prompt recipes, and client-side browser utilities.

## Core Features
- **Global Brand Identity:** Centralized site configuration (`src/config/site.ts`), vector logo glyph, and responsive header lockup.
- **Top Generative AI Directory:** Over 50 independently verified generative AI platforms (Claude, ChatGPT, Midjourney, Cursor, v0, ElevenLabs, etc.) with verified pricing provenance, free tier quotas, and official outbound links.
- **Verified Free AI Tools:** Filtered zero-cost generative tools categorized by access models (100% Free Forever, Free Tier Quota, Free Trial No CC, Open Weights / Self-Hostable).
- **Proprietary Software Alternatives:** Direct mapped alternatives to closed-source products (Notion, Figma, Airtable, Firebase, Zapier, Google Analytics) replaced with reliable open-source software (Supabase, AppFlowy, Penpot, Baserow, n8n, Umami, Plausible).
- **Official Vector Brand Logos:** High-resolution vector logos for 80+ AI products, proprietary tools, and open-source projects with fallback initials.
- **Step-by-Step AI Guides & Tutorials:** Practical end-to-end workflows (cinematic AI video generation, automated social pipelines, local LLM deployment).
- **Curated Prompt Recipes:** Battle-tested prompts tagged by target model with copy-to-clipboard functionality.
- **Free Browser-Based Utilities:** 100% client-side privacy-first tools (Vector QR Generator, Image Resizer & Converter, Word Counter & Case Transformer, JSON Formatter & Validator, Prompt Builder, SVG to PNG Rasterizer).
- **Side-by-Side Comparison Matrix:** Compare licenses, hosting models, pricing, and GitHub stats between open-source tools and AI cloud platforms.
- **"Help Me Pick" Guided Wizard:** Interactive recommendation engine for finding software tailored to specific project constraints.
- **Saved Items & Bookmarks:** Client-side local storage bookmarks for tools, prompts, and workflows.
- **Cursor-Following Ambient Glow & Motion:** Hardware-accelerated radial spotlight and microinteractions.
- **SEO & Social Metadata:** Dynamic `document.title`, Open Graph, Twitter Cards, canonical tags, `sitemap.xml`, and `robots.txt`.

## Project Structure
```
open-alternative/
├── index.html                  # Branded Tech Hacks AI root HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.tsx                 # Dynamic document.title routing & layout
│   ├── config/
│   │   └── site.ts             # Central Tech Hacks AI site configuration
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── router/
│   │   └── Router.tsx          # Client-side router with pushState/popstate
│   ├── data/
│   │   ├── seedData.ts         # Verified open-source tools
│   │   ├── categories.ts       # Taxonomy & subcategories
│   │   ├── alternatives.ts     # Proprietary software targets
│   │   ├── collections.ts      # Curated collections
│   │   ├── aiToolsData.ts      # 50 verified AI platforms with provenance
│   │   ├── guidesData.ts       # Step-by-step tutorials
│   │   ├── promptsData.ts      # Prompt recipes
│   │   ├── freeToolsData.ts    # Browser utility registry
│   │   ├── brandLogos.ts       # 80+ mapped SVG brand logos
│   │   └── updatesData.ts      # Editorial changelog
│   ├── services/
│   │   ├── catalogService.ts   # Open-source search, sort, and filtering engine
│   │   ├── aiCatalogService.ts # AI discovery, guides, and utilities queries
│   │   └── bookmarkService.ts  # Saved items persistence
│   ├── components/
│   │   ├── Header.tsx          # Sticky navbar with TechHacksLogo & menus
│   │   ├── TechHacksLogo.tsx   # Custom vector logo glyph & wordmark
│   │   ├── Footer.tsx          # Branded footer & newsletter
│   │   ├── BrandLogo.tsx       # Multi-resolution SVG brand logos
│   │   ├── UniversalSearch.tsx # Unified search modal across tools & guides
│   │   ├── AmbientGlow.tsx     # Mouse-responsive ambient lighting
│   │   ├── ToolCard.tsx        # Open-source software card
│   │   ├── AlternativeCard.tsx # Proprietary SaaS target card
│   │   ├── AiToolCard.tsx      # Generative AI platform card
│   │   └── utilities/
│   │       └── UtilityRunner.tsx # Client-side browser tools runner
│   └── pages/
│       ├── HomePage.tsx        # Discovery hero, SaaS alternatives, AI catalog
│       ├── ToolsPage.tsx       # Open-source catalog
│       ├── AiToolsPage.tsx     # Generative AI directory
│       ├── FreeAiSitesPage.tsx # Free AI directory
│       ├── GuidesPage.tsx      # Step-by-step guides
│       ├── PromptLibraryPage.tsx # Prompt library
│       ├── FreeToolsPage.tsx   # Browser utilities
│       ├── ComparePage.tsx     # Side-by-side comparison matrix
│       ├── PickPage.tsx        # Guided recommendation wizard
│       └── SavedPage.tsx       # Bookmarks
├── public/
│   ├── favicon.svg             # Tech Hacks AI SVG favicon
│   ├── tech-hacks-ai-logo.svg  # High-res vector logo
│   ├── logos/                  # 80+ standalone SVG brand icons
│   ├── robots.txt              # Crawler permissions & sitemap URL
│   └── sitemap.xml             # XML sitemap covering all routes
└── tests/
    ├── catalog.test.js
    ├── qa_verification.test.js
    ├── routes.test.js
    ├── ssr_routes.test.js
    ├── interactive_browser_simulator.test.js
    ├── phase5_motion_polish.test.js
    ├── phase6_handlytech_platform.test.js
    ├── phase7_logos_and_free_ai.test.js
    └── phase9_branding.test.js # Brand identity & configuration verification
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
Executes the comprehensive test suite with Node.js built-in test runner.

## License
MIT
