# Tech Hacks AI — Software & Generative AI Discovery Platform

**Tech Hacks AI** is a curated, high-performance software discovery platform combining top generative AI tools, verified free software, open-source SaaS alternatives, step-by-step tutorials, model prompt recipes, side-by-side comparisons, community contributions, and an AI-powered assistant.

Target Domain: `https://techhacksai.com`

---

## Key Features & Capabilities

- **Curated AI Tools Directory:** Catalog of 50+ independently verified generative AI platforms with pricing models (Free, Freemium, Paid, Open Source), feature breakdowns, and official outbound links.
- **Open-Source SaaS Alternatives:** Direct mapping from proprietary SaaS products (e.g., Notion, Figma, Airtable, Firebase, Zapier, Google Analytics) to production-ready open-source alternatives (Supabase, AppFlowy, Penpot, Baserow, n8n, Umami, Plausible).
- **Verified Free AI Tools:** Dedicated directory filtering tools by free access model: 100% Free Forever, Recurring Free Tier, Free Trial No Credit Card, and Local / Open Weights.
- **Side-by-Side Comparison Matrix:** Compare licenses, hosting models, pricing tiers, and capabilities between platforms.
- **"Help Me Pick" Guided Wizard:** Interactive multi-step recommendation engine tailored to user constraints.
- **Community Submissions System:** Public submission forms for new AI tools (`/submit-tool`) and tutorials (`/submit-guide`) with built-in client validation, URL normalization, anti-spam honeypots, rate limiting, and duplicate detection.
- **Editorial Moderation Dashboard:** Protected administration interface (`/moderation`) to inspect, review, approve, edit, and publish community submissions directly to the live catalog.
- **Interactive AI Assistant:** Holographic floating chatbot with grounded local catalog retrieval and optional serverless LLM generation.
- **Official Brand Logos Registry:** High-resolution SVG brand icons for 80+ AI products, developer utilities, and open-source projects.
- **Step-by-Step AI Guides & Prompt Library:** Detailed creator and developer tutorials and copy-ready prompt templates.
- **Privacy-First Client Utilities:** 100% client-side browser tools including QR Code Generator, Word Counter, JSON Formatter, and Image Resizers.

---

## Tech Stack & Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler & Dev Server:** Vite 5 with manual chunk splitting (`vendor-react`, `vendor-icons`, `catalog-data`, `app-pages`)
- **Styling & Motion:** Tailwind CSS, Lucide React icons, and hardware-accelerated ambient glow shaders
- **Client Routing:** Custom HTML5 pushState/popstate router with dynamic document titles and metadata

### Backend & API
- **Serverless API Routes:**
  - `api/submissions.js`: Handles community submissions, published catalog overlays, and moderator workflow actions.
  - `api/chat.js`: Handles live chatbot streaming queries with graceful fallback to grounded client-side catalog retrieval.
- **Storage Layer (`server/storageAdapter.js`):**
  - **Local Development / Test Mode:** Persists atomically to `data/*.json`.
  - **Durable Production Mode (Supabase):** Connects to Supabase PostgreSQL over HTTPS PostgREST REST API using native Node 18+ `globalThis.fetch` (**zero extra npm dependencies**).
  - **Ephemeral Safety Guard:** Rejects public submission writes with HTTP 503 (`StorageUnavailable`) when running in serverless without configured database credentials, eliminating silent data loss.
- **Database Schema:** PostgreSQL schema with Row Level Security (RLS) policies and performance indexes (`server/schema.sql`).
- **Migration CLI:** `scripts/migrate-to-supabase.js` (`npm run db:migrate`).

---

## Prerequisites

- **Node.js:** v18.0.0 or later (v20+ recommended)
- **npm:** v9.0.0 or later
- **Git**

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/parvez1521/tech-hacks-ai.git
cd tech-hacks-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Local Environment
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
*(For local development, no cloud credentials are required; the application automatically runs in local storage mode using `data/*.json`).*

### 4. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Scripts & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with integrated API middleware at `http://localhost:3000` |
| `npm run build` | Compiles the production build with bundle optimization into `dist/` |
| `npm run preview` | Serves the production build locally for verification |
| `npm test` | Runs the full automated test suite (408 tests across 108 suites) |
| `npm run db:migrate -- --dry-run` | Audits local JSON submissions and published additions ready for database sync |
| `npm run db:migrate -- --sql` | Outputs PostgreSQL INSERT statements ready for the Supabase SQL Editor |
| `npm run db:migrate` | Syncs local data to Supabase over REST when environment variables are set |

---

## Environment Variables

Configure these variables in your hosting environment (e.g. Vercel Project Settings) or `.env.local`:

| Variable | Environment | Description |
| :--- | :--- | :--- |
| `VITE_SITE_URL` | Client (Public) | Canonical site origin (e.g. `https://techhacksai.com`). Defaults to `https://techhacksai.com`. |
| `ADMIN_SECRET` | Server (Secret) | Bearer token / passkey required for `/moderation` and PATCH `/api/submissions`. |
| `SUPABASE_URL` | Server (Secret) | Supabase project URL (e.g. `https://<project-ref>.supabase.co`). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (Secret) | Supabase secret key with RLS bypass for API storage operations. |
| `GROQ_API_KEY` | Server (Secret) | *(Optional)* Groq API key for Llama 3.3 live chatbot responses. |
| `GEMINI_API_KEY` | Server (Secret) | *(Optional)* Google Gemini API key for multimodal model inference. |
| `VITE_ADSENSE_PUB_ID` | Client (Public) | *(Optional)* Google AdSense Publisher ID (e.g. `ca-pub-XXXXXXXXXXXXXXXX`). |

---

## Database Setup & Production Storage (Supabase)

To enable persistent community submissions and moderation in production:

1. Create a free account at [Supabase](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of [`server/schema.sql`](server/schema.sql) and execute it.
4. Obtain your **Project URL** and **`service_role` Secret Key** from **Project Settings -> API**.
5. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your Vercel Environment Variables.
6. Seed the initial records:
   ```bash
   SUPABASE_URL="https://<project-ref>.supabase.co" \
   SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
   npm run db:migrate
   ```

---

## Editorial Moderation Workflow

1. Navigate to `/moderation` in your browser.
2. Enter the passkey configured in `ADMIN_SECRET`.
3. The dashboard allows editors to:
   - Filter submissions by status (`pending`, `in_review`, `approved`, `rejected`, `published`) and type (`tool`, `guide`).
   - Review submitted metadata, duplicate check flags, and submitter notes.
   - Update submission statuses and add editorial notes.
   - Click **Publish to Live Catalog** to publish approved tools or guides directly into live search, filters, and directory pages.

---

## Deployment Notes (Vercel)

- **SPA Rewrites:** [`vercel.json`](vercel.json) rewrites `/((?!api/).*)` to `/index.html`, preserving client-side React routes while leaving serverless functions under `/api/` intact.
- **Security Headers:** Modern HTTP security headers are configured in `vercel.json` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy`).
- **Commercial Use:** If monetizing through Google AdSense or sponsorships, Vercel requires a **Pro** plan. Non-commercial personal usage is supported under the Hobby tier.

---

## License

This project is licensed under the [MIT License](LICENSE).
