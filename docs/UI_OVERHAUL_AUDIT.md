# SwitchRoute Product-wide UI/UX Audit

Baseline: `origin/main` at `ac70a88129126211c2529f7cacef1af66276e045` (`Prepare Codex toolkit for a product-wide premium UI overhaul`). Audit captured before UI edits on the local Vite app. Exact homepage H1 observed: **Another AI tool? Sure. Another Subscription? Nope.**

## Product and route inventory

The router exposes 38 route identifiers, including parameterized details, legacy aliases and a not-found route. The page families below cover all current visitor workflows; legacy aliases and query variations retain their existing destinations.

| Surface / routes | Visitor job and mode | Baseline strengths | Friction / design opportunity |
|---|---|---|---|
| Home `/` | Find a useful route into the catalog · Persuade/Explore | Preserves the signature title, functional search, real catalog preview and useful collection links. Strong editorial split composition. | Repeated four-card collection row and repeated bordered panels below it flatten hierarchy. At baseline, the hero preview and global floating chat competed for attention; the mobile launcher overlap was corrected in the QA follow-up. |
| Primary navigation, mobile menu, footer | Move across all feature areas · Operate | Four compact groups, semantic details/summary, persistent route access, theme switch and mobile menu. | Group menus and page links need consistent open/active/focus states. Some route labels and small-screen rows become dense. Footer is a large repeated surface on every route. |
| AI tools `/ai-tools`, query filters, `/ai-tools/:slug` | Search, compare and inspect AI platforms · Explore/Operate | Search, price/access filters, category filters, provenance, brand logo component, tool detail links and metadata are present. | The filter row is a long horizontal chip rail; several labels clip at the edge without a strong scroll cue. Search/filters and cards share similar bordered treatment. |
| Open-source catalog `/tools`, `/tools/:slug` | Find self-hostable projects and inspect technical fit · Explore/Operate | Structured data and technical detail content support practical evaluation. | Directory patterns are close to the AI catalog despite a different visitor job; information density and provenance can be organized more distinctly. |
| Categories `/categories`, `/categories/:slug` | Browse capabilities and task groupings · Explore/Read | Category descriptions and detail content give useful context. | Category index and directory filter chips compete as parallel ways to browse; repeated card grids obscure task hierarchy. |
| AI video `/ai-video-tools` | Compare video-generation methods and routes · Explore | Dedicated route, task-focused content and catalog links. | Shares several visual conventions with the general AI catalog; video formats and practical constraints deserve clearer scan structure. |
| Frontier Models `/frontier-models` | Compare models, capabilities, docs and provider access · Explore/Read | Model-first page, official model owner, access relationships and verification metadata are explicitly represented. | Model summary cards duplicate information in full records; repeated capability chips and large outlined route cards create long scanning paths. |
| Free Access `/free-ai-sites` | Find active allowances, trials and credits · Explore/Operate | Clear constraints, verification dates, access filters, source links and model-access section. | Several filter rails and equal-weight panels compete. Important distinctions (shared pool, account, region and active status) need a more deliberate reading order. |
| GitHub Projects `/github-projects` | Discover and screen curated public repositories · Operate/Explore | Search, category, license, language, hostability, GPU, API-key and sort controls are available; listing says verified count. | Six controls occupy one wide filter panel and the category rail clips on narrow layouts. Filter hierarchy and cards can be easier to scan without changing project data or verification. |
| Alternatives `/alternatives`, `/alternatives/:slug` | Find replacements and compare them with proprietary software · Explore/Read | Detail views contain evidence, constraints, selection factors and comparison links. | Oversized explanatory panel and colored status pills compete with actual replacement choices; pages still read as similar card collections. |
| Utilities `/free-tools`, `/free-tools/:slug` | Complete a browser-based task · Operate | Utility detail pages foreground capabilities, privacy constraints and a real task control (e.g. client-side image upload). | Detail page content is surrounded by repeated framed panels; breadcrumbs clip on phone, and the floating assistant overlapped the tool workspace at narrow widths. The launcher was moved into mobile navigation in the follow-up fix. |
| Compare `/compare`, Help Me Pick `/pick`, Saved `/saved` | Select, compare, or return to tools · Operate | Dedicated workflows and route-backed state exist. | Dense states, empty states and action hierarchy need consistent review; avoid marketing-card treatments in task screens. |
| Prompt Library `/prompt-library`, `/prompt-library/:slug` | Find, preview, customize and copy prompts · Explore/Operate | Distinct editorial hero image, source-aware inspiration, search and prompt previews. | Prompt gallery cards and related inspiration use a separate visual grammar from the rest of the product; retain its image-led quality while harmonizing controls and typography. |
| Guides `/guides`, `/guides/:slug`, updates `/updates` | Read workflows and product changes · Read | Detail pages expose byline, reading time, date, step hierarchy and actual illustrations. | Long-form content needs a restrained reading rail, consistent metadata and section spacing; reduce small tracked labels and repeated boxed steps where unnecessary. |
| Offers `/offers`, `/offers/:slug` | Check eligibility and claim terms · Explore/Read | Detail pages distinguish provider, region, eligibility, verification status, claim and terms. | The summary/detail page repeats many pills and boxed callouts. Status and eligibility can use clearer hierarchy while preserving factual claims. |
| Forms `/contact`, `/submit-tool`, `/submit-guide`, `/submit-prompt` | Send feedback or contribute content · Operate | Persistent labels, helper copy and editorial review context are present. | Long submission forms are split into repeated large bordered sections; improve progress, grouping, validation feedback and mobile scanning without changing submissions/API. |
| Discoveries `/discoveries`, content details | Find new and reviewed catalog entries · Explore | Distinct editorial route and source attribution. | Reused discovery cards make freshness and review state visually similar to generic directory cards. |
| Moderation `/admin/moderation` | Unlock editorial review and manage submissions · Operate | Passkey-first access and clear admin separation. | Login is centered in a sparse viewport with a high-contrast gradient edge; dense moderation states require a separate operational design pass. No privileged access was exercised. |
| About, brand kit, privacy, terms, disclosure and not-found | Understand identity, policies and recovery · Read | Routes, canonical metadata and shared shell render. | Long legal/editorial copy shares broad styles; improve measure, hierarchy and recovery links without rewriting policy claims. |

## Browser baseline

- Routes sampled: home, AI tools and detail, open-source catalog, categories and detail, video, Frontier Models, Free Access, GitHub Projects, alternatives and detail, utility index/detail, compare, picker, saved, Prompt Library, guide detail, offers/detail, forms, discoveries, updates, about/legal, moderation.
- Viewports: 320, 360, 390, 768, 1024 and 1440 CSS pixels; dark and light themes.
- 384 route/viewport/theme checks showed no document-level horizontal overflow. This does not guarantee that every internal control is fully visible; notably, directory category rails clip labels at their horizontal edge.
- Baseline screenshots for 12 representative route families were captured at desktop (1440), tablet (768), and mobile (390), in both themes. Additional route-family desktop-dark screenshots are included in `docs/ui-overhaul-screenshots/before/`.
- Route headings and canonical URLs were sampled. They resolve to their intended routes. `/submit-prompt` currently renders a duplicated `SwitchRoute` suffix in its document title; it is an existing SEO/title issue and will be reported without changing SEO metadata as a visual side effect.
- Search/filter interactions, keyboard paths, form submissions, admin authorization and utility file processing have not yet been exercised in the browser; these are validation requirements for implementation QA.

## Unslop screen audit

Verified issues and locations:

- Repeated outlined cards, pills and large panels lower the distinction between primary content, controls and metadata across AI tools, Frontier, GitHub Projects, alternatives and offers.
- Category/filter rails clip visible labels on narrow layouts and do not clearly advertise overflow.
- Several routes use tracked uppercase eyebrow pills for ordinary section context; metadata is visually louder than its content.
- AI-directory cards include decorative sparkle marks on products, and accent treatments are sometimes used for decoration rather than state.
- Forms and dense working screens inherit the general content/card grammar rather than a task-first control hierarchy.
- At baseline, global floating chat overlapped useful content in narrow work surfaces. The follow-up hides the fixed launcher below 1024px and exposes chat from the mobile navigation.
- The app has a real brand wordmark, official product logo registry, dark default, light theme and semantic token system. These are the foundation; do not replace them.

### Impeccable detector scan

Ran the bundled source detector on `src/`. It reported:

- Gradient text in `FrontierBonusSection.tsx`, `TechHacksLogo.tsx` and `BrandKitPage.tsx`.
- Purple accent text in `AdminDiscoveriesManager.tsx`.
- A thick left border in `SafeMarkdown.tsx`.
- Overused Inter stack in `index.css`.
- A decorative grid background in `index.css` (advisory).
- A rounded-card top accent in `HomePage.tsx`.
- Bouncing assistant prompt motion in `FloatingChatbot.tsx` (advisory).

These findings are prompts for visual review, not automatic removal rules. In particular, the official logo treatment, existing real brand mark, admin state colors and useful assistant activity feedback must be checked in context before changing them.

## Direction for the design system

- **Product:** A field guide that helps people choose an AI tool, model or access route for a concrete task.
- **Character:** Precise, grounded, quietly curious.
- **World:** An editorial technical atlas: ink, paper and clear route-blue wayfinding, with real catalog artwork as evidence.
- **Moments:** Verified product marks beside useful capability and access details; actual prompt previews where the product has them.
- **Signature:** A restrained route line/link motif that connects discovery entry points to their next useful destination.

Taste Skill's dealt **Product Performs** direction informed the live catalog hero preview. Its architecture-photo set, pinned-scroll scene, and drag-through stages were adapted out: there are no SwitchRoute product photographs, and scroll-jacking or invented drag behavior would misrepresent this directory. The useful product-specific device is the route preview itself, backed by real catalog entries. The UI/UX Pro Max search suggested a green marketplace palette; that was rejected to preserve route-blue.

## Design contract

- Preserve SwitchRoute’s semantic tokens, logo registry, Inter/system stack, dark-first theme, exact home title, all routes and actual catalog meaning.
- Use distinct layouts for Discover, Operate, Read and Persuade screens. Do not standardize all surfaces into a bento grid or generic SaaS dashboard.
- Prioritize hierarchy, filter discoverability, content density and operational clarity; use neutral surfaces, quiet hairlines and the existing blue accent. Reserve semantic colors for factual status.
- Use verified logos and genuine previews only. Keep text content and access/verification semantics intact.
- Keep interactions keyboard operable, visible focus, 44px touch targets where practical, responsive at 320–1440px, and reduced-motion-aware.

## Accepted and rejected reference patterns

Accepted: product-specific editorial compositions, real content previews, neutral app chrome, restrained route-blue wayfinding, readable long-form rails, clear filter grouping, compact task controls, useful status/source details.

Rejected: copied React Bits components until their license status is resolved; purple/blue gradient decoration; generic AI illustrations; interchangeable card grids; fake metrics or testimonials; removing product information merely to make pages sparse; new dependencies without a specific demonstrated need.

## Implementation and evidence

The overhaul and post-build QA record are documented in [UI_OVERHAUL_QA.md](UI_OVERHAUL_QA.md). Final production-preview captures for desktop, tablet and mobile in both themes live in `ui-overhaul-screenshots/after/`; baseline captures are in `ui-overhaul-screenshots/before/`. The product-wide type/spacing/focus/filter changes are in `src/index.css`, with route-aware shell hooks in `src/App.tsx` and navigation, homepage, footer and filter classes in their existing components. Search, routes, catalog data, APIs and SEO behavior were preserved.
