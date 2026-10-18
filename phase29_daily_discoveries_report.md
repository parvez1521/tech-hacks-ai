# Phase 29: Admin-Managed Daily Discoveries & Featured Tools

> **Status:** Completed & Production Verified  
> **Test Suite:** 436 / 436 tests passing (117 test suites, +28 new tests in `tests/phase29_admin_discoveries.test.js`)  
> **Production Build:** Clean build in 2.09s (Vite 5 + React 18 + Tailwind CSS)

---

## 1. Executive Summary

In Phase 29, we implemented a production-ready **Daily Discoveries / Featured Tools** system across the Tech Hacks AI platform. This feature empowers administrators to hand-pick, curate, review, and highlight breakthrough AI tools with rich metadata, while providing public visitors with both an interactive homepage showcase and a dedicated searchable archive (`/discoveries`).

All mutations are guarded by the existing `ADMIN_SECRET` authentication token (`x-admin-token` or `Authorization: Bearer <secret>`). Dangerous protocols such as `javascript:`, `data:`, and `vbscript:` are strictly disallowed across both client and server sanitizers. Draft discoveries remain completely invisible to unauthenticated public visitors. Persistence is powered by the unified storage adapter, supporting local JSON files in development/testing, PostgreSQL via Supabase PostgREST in production, and an ephemeral safety guard that prevents silent data loss in unconfigured serverless runtimes.

---

## 2. Key Deliverables & Architectural Components

### A. Public Website Section (`DailyDiscoveriesSection.tsx`) & Card (`DailyDiscoveryCard.tsx`)
- **Homepage Showcase:** Mounted between Editor's Picks and the general catalog on `HomePage.tsx`. Features a glowing badge (*"Curated Daily by Editors"*), section title, description, and direct link to the full archive.
- **Interactive Tool Card:** Displays:
  - Tool name and verified hostname
  - Short editorial description
  - Category pill (e.g. `Developer Tools`, `Search & Research`, `Audio & Speech`)
  - Status badges: `Featured` (emerald glow) and `New` (violet glow)
  - Logo thumbnail or modern initial fallback
  - Added date (formatted e.g. *"Oct 18, 2026"*)
  - Verified Outbound CTA (*"Visit Website"* or *"Try Tool"*) with `target="_blank"`, `rel="noopener noreferrer"`, and safe click handlers
- **Empty & Error States:** Clear guidance for visitors when no discoveries are featured, with a link to submit tools.

### B. Dedicated Archive View (`DiscoveriesPage.tsx` at `/discoveries`)
- **Direct Route:** Accessible at `/discoveries` (with aliases `/daily-discoveries` and `/featured`).
- **Interactive Controls:**
  - Real-time keyword search across tool names, categories, and descriptions
  - Filter by category pills (dynamically derived from indexed entries)
  - "Featured Only" toggle
  - Sorting options: *Newest Added*, *Featured First*, and *Alphabetical (A-Z)*
  - Reset filters shortcut and match counter
- **Community Banner:** Outbound CTA encouraging users to submit their own AI platforms for editorial review.

### C. Admin Management Dashboard (`AdminDiscoveriesManager.tsx`)
- **Integrated Admin Experience:** Accessible inside `/moderation` (unlocked using the administrator passkey `techhacks-admin-2026`).
- **Tabbed Dashboard:** Added top-level tab switcher to toggle between **Community Submissions Queue** and **Daily Discoveries & Featured Tools**.
- **Management Capabilities:**
  - Metrics cards: Total Discoveries, Published (Live), Drafts (Hidden), and Featured
  - Real-time search and status filter tabs (*All*, *Published*, *Drafts*)
  - **1-Click Quick Toggles:**
    - Instant **Publish / Unpublish** toggle (immediately takes a tool live or hides it)
    - Instant **Feature / Unfeature** toggle
  - **Create / Edit Modal:**
    - Tool Name (required, min 2 chars)
    - Short Description (required, min 10 chars)
    - Website URL (required, validated HTTP/HTTPS)
    - Optional Logo/Image URL (with live preview thumbnail)
    - Category dropdown (Developer Tools, Search & Research, Audio & Speech, Design & Image, etc.)
    - Publication status (Draft vs Published)
    - Feature & New badges toggles
  - **Safe Deletion:** Confirmation modal prevents accidental data removal.
  - **Immediate UI Feedback:** Toast alerts and optimistic state updates.

### D. Secure Serverless API (`api/discoveries.js`) & Store (`server/discoveriesStore.js`)
- `GET /api/discoveries`:
  - Public requests: returns **only** published tools (`status === 'published'`). Drafts are never exposed. Supports `featured=true`, `category=...`, `q=...`.
  - Admin requests (with `x-admin-token` or Bearer): allows `all=true` or `status=draft` to view hidden entries. Sets `isAdmin: true`.
- `POST /api/discoveries`: Admin only. Validates inputs, creates new entry with unique ID (`disc_<timestamp>_<random>`), persists via storage adapter. Returns HTTP 201.
- `PATCH /api/discoveries?id=...`: Admin only. Updates fields or toggles publication status. Returns HTTP 200.
- `DELETE /api/discoveries?id=...`: Admin only. Deletes entry from storage. Returns HTTP 200.
- **Vite Dev Integration:** Middleware plugin `discoveriesApiPlugin` in `vite.config.js` routes `/api/discoveries` directly in local development (`npm run dev`).

### E. Durable Storage, Database Schema & Migration Utility
- **Storage Adapter (`server/storageAdapter.js`):**
  - Added `toDiscoveryDbRow` and `fromDiscoveryDbRow` mappings.
  - Added `getDiscoveries`, `saveNewDiscovery`, `updateExistingDiscovery`, and `deleteExistingDiscovery`.
  - **503 Ephemeral Guard:** In serverless environments (`VERCEL=1`) without cloud database credentials, all write operations reject with HTTP 503 `StorageUnavailable` to prevent silent data loss.
- **PostgreSQL Schema (`server/schema.sql`):**
  - Created `public.techhacks_discoveries` table with primary key `id`, indexes on `status`, `created_at DESC`, and `is_featured`.
  - Added Row Level Security (RLS) policies:
    - Public: `SELECT` allowed only for `status = 'published'`.
    - Service Role: Full access for all operations.
- **Migration Utility (`scripts/migrate-to-supabase.js`):**
  - Updated `--dry-run` to report and inspect discovery counts.
  - Updated `--sql` to output idempotent `INSERT ... ON CONFLICT (id) DO UPDATE` statements for Supabase.
  - Updated live sync to migrate discoveries over REST.

---

## 3. Verification & Automated Test Results

A new test suite (`tests/phase29_admin_discoveries.test.js`) was created with 28 targeted tests covering all functional, security, and edge-case requirements:

```
▶ Phase 29: Admin-Managed Tool Discoveries & Featured Tools
  ▶ 1. URL Validation & Safe Protocol Enforcement
    ✔ isValidHttpUrl accepts standard http and https addresses
    ✔ isValidHttpUrl strictly rejects dangerous injection protocols
    ✔ sanitizeUrl cleans URLs and removes marketing trackers
    ✔ client sanitizeOutboundUrl protects visitors from malicious links
  ✔ 1. URL Validation & Safe Protocol Enforcement
  ▶ 2. Discovery Payload Validation
    ✔ rejects payload with missing or short tool name
    ✔ rejects payload with missing or short description
    ✔ rejects payload with invalid website URL
    ✔ accepts well-formed discovery payload
  ✔ 2. Discovery Payload Validation
  ▶ 3. Public API Endpoint Behavior & Draft Privacy
    ✔ public GET /api/discoveries returns 200 with only published items
    ✔ public GET /api/discoveries?featured=true returns only featured items
    ✔ public GET /api/discoveries?category=... filters by category
    ✔ public GET /api/discoveries?q=... performs case-insensitive search
  ✔ 3. Public API Endpoint Behavior & Draft Privacy
  ▶ 4. Admin Authentication & Protection
    ✔ unauthenticated mutation requests return 401 Unauthorized
    ✔ invalid token in x-admin-token returns 401
    ✔ valid ADMIN_SECRET in x-admin-token or Bearer header authorizes admin
  ✔ 4. Admin Authentication & Protection
  ▶ 5. Admin CRUD Operations Lifecycle
    ✔ admin creates a new draft discovery via POST /api/discoveries
    ✔ draft discovery is NOT exposed in public GET /api/discoveries
    ✔ admin GET /api/discoveries?all=true DOES return the draft discovery
    ✔ admin publishes the draft discovery via PATCH /api/discoveries
    ✔ published discovery now appears in public GET /api/discoveries
    ✔ admin deletes the discovery via DELETE /api/discoveries
  ✔ 5. Admin CRUD Operations Lifecycle
  ▶ 6. Durable Storage & Production Guard (503)
    ✔ toDiscoveryDbRow and fromDiscoveryDbRow map columns accurately
    ✔ write operations reject with 503 in unconfigured production (VERCEL=1)
  ✔ 6. Durable Storage & Production Guard (503)
  ▶ 7. Database Schema DDL & Migration Utility
    ✔ server/schema.sql contains techhacks_discoveries table with RLS
    ✔ scripts/migrate-to-supabase.js includes discoveries in dry run and SQL
  ✔ 7. Database Schema DDL & Migration Utility
  ▶ 8. Routing & Navigation Architecture
    ✔ /discoveries and aliases route correctly
    ✔ page title and description format properly for discoveries route
    ✔ siteConfig discovery navigation list includes Daily Discoveries
  ✔ 8. Routing & Navigation Architecture
✔ Phase 29: Admin-Managed Tool Discoveries & Featured Tools

ℹ tests 436
ℹ suites 117
ℹ pass 436
ℹ fail 0
```

---

## 4. Modified & Created Files Summary

| File | Status | Description |
|---|---|---|
| `src/types/discoveries.ts` | **Created** | TypeScript interfaces for `ToolDiscovery`, `DiscoveryFormData`, and filters. |
| `data/discoveries.json` | **Created** | Seed data with 6 verified, high-quality AI tool discoveries (Cursor, v0, Perplexity, ElevenLabs, Recraft, Bolt.new). |
| `server/storageAdapter.js` | **Updated** | Added database mapping and unified CRUD methods for discoveries with 503 safety guard. |
| `server/discoveriesStore.js` | **Created** | Server-side business logic, input validation, protocol checking, and auth guards. |
| `api/discoveries.js` | **Created** | Serverless function handling `GET`, `POST`, `PATCH`, and `DELETE`. |
| `vite.config.js` | **Updated** | Added `discoveriesApiPlugin` to route `/api/discoveries` during local development. |
| `server/schema.sql` | **Updated** | Added `techhacks_discoveries` table DDL, performance indexes, and RLS policies. |
| `scripts/migrate-to-supabase.js` | **Updated** | Added discovery records to SQL migration generator, dry run, and REST sync. |
| `src/services/discoveryService.ts` | **Created** | Client-side API functions, status toggles, and `sanitizeOutboundUrl`. |
| `src/components/DailyDiscoveryCard.tsx` | **Created** | Responsive discovery card with badges, logo, date, and safe outbound CTA. |
| `src/components/DailyDiscoveriesSection.tsx` | **Created** | Homepage featured discoveries section with header, empty states, and archive link. |
| `src/pages/DiscoveriesPage.tsx` | **Created** | Dedicated `/discoveries` archive page with live search, category pills, and sort controls. |
| `src/components/AdminDiscoveriesManager.tsx` | **Created** | Admin dashboard management component with stats, table, modals, and quick toggles. |
| `src/pages/ModerationDashboardPage.tsx` | **Updated** | Added tab navigation to switch between Submissions and Daily Discoveries. |
| `src/pages/HomePage.tsx` | **Updated** | Mounted `DailyDiscoveriesSection` with scroll-reveal integration. |
| `src/router/Router.tsx` | **Updated** | Registered route matching for `/discoveries`, `/daily-discoveries`, and `/featured`. |
| `src/App.tsx` | **Updated** | Added route title, route description, and rendering for `DiscoveriesPage`. |
| `src/components/Header.tsx` | **Updated** | Added Daily Discoveries to desktop Discover dropdown and mobile navigation menu. |
| `src/components/Footer.tsx` | **Updated** | Added Daily Discoveries link to the Browse Software column. |
| `src/config/site.ts` | **Updated** | Added Daily Discoveries to canonical navigation configuration. |
| `tests/phase29_admin_discoveries.test.js` | **Created** | 28 automated tests verifying security, CRUD, URLs, storage, schema, and routing. |
