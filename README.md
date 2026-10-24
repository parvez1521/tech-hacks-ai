# SwitchRoute — Software & Generative AI Discovery Platform

**SwitchRoute** is a curated, high-performance software discovery platform combining top generative AI tools, verified free software, open-source SaaS alternatives, step-by-step tutorials, model prompt recipes, side-by-side comparisons, community contributions, and an AI-powered assistant.

Target Domain: `https://switchroute.in`

---

## Key Features & Capabilities

- **Curated AI Tools Directory:** Catalog of 50+ independently verified generative AI platforms with pricing models (Free, Freemium, Paid, Open Source), feature breakdowns, and official outbound links.
- **Open-Source SaaS Alternatives:** Direct mapping from proprietary SaaS products (e.g., Notion, Figma, Airtable, Firebase, Zapier, Google Analytics) to production-ready open-source alternatives (Supabase, AppFlowy, Penpot, Baserow, n8n, Umami, Plausible).
- **Verified Free AI Tools:** Dedicated directory filtering tools by free access model: 100% Free Forever, Recurring Free Tier, Free Trial No Credit Card, and Local / Open Weights.
- **Side-by-Side Comparison Matrix:** Compare licenses, hosting models, pricing tiers, and capabilities between platforms.
- **"Help Me Pick" Guided Wizard:** Interactive multi-step recommendation engine tailored to user constraints.
- **Community Submissions System:** Public submission forms for new AI tools (`/submit-tool`) and tutorials (`/submit-guide`) with built-in client validation, URL normalization, anti-spam honeypots, rate limiting, and duplicate detection.
- **Separated Product Sections:** AI Tools (`/ai-tools`), Community Tools (`/community-tools`), Open Source (`/tools`), Utility Tools (`/free-tools`), and Alternatives use distinct section-aware filters and search groups.
- **Editorial Moderation Dashboard:** Protected administration interface (`/moderation`) to inspect, review, approve, edit, and publish community submissions directly to the live catalog.
- **Interactive AI Assistant:** Holographic floating chatbot with grounded local catalog retrieval and optional serverless LLM generation.
- **Official Brand Logos Registry:** High-resolution SVG brand icons for 80+ AI products, developer utilities, and open-source projects.
- **Step-by-Step AI Guides & Prompt Library:** Detailed creator and developer tutorials and copy-ready prompt templates.
- **Utility Tools Directory:** 38 categorized tools across Video & Audio, Image & Graphics, Text & Writing, Developer Tools, Security & Validation, and Files, Data & Browser.
- **Media Workflows:** Video & Audio Transcriber (configured server provider), local MP4-to-MP3 conversion through lazy FFmpeg WebAssembly, and honest YouTube/Instagram authorized-workflow helpers.

---

## Tech Stack & Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler & Dev Server:** Vite 5 with manual chunk splitting (`vendor-react`, `vendor-icons`, `catalog-data`, `app-pages`)
- **Styling & Motion:** Tailwind CSS, Lucide React icons, and hardware-accelerated ambient glow shaders
- **Media dependencies:** `@ffmpeg/ffmpeg` and `@ffmpeg/util` are dynamically loaded only when MP4 conversion starts; `busboy` parses server-side transcription uploads.
- **Client Routing:** Custom HTML5 pushState/popstate router with dynamic document titles and metadata

### Backend & API
- **Serverless API Routes:**
   - `api/submissions.js`: Handles community submissions, published catalog overlays, and moderator workflow actions.
   - `api/chat.js`: Handles live chatbot streaming queries with graceful fallback to grounded client-side catalog retrieval.
   - `api/transcribe.js`: Handles optional server-side media transcription with strict file limits, provider host allowlisting, and timeout handling.
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
| `npm test` | Runs the full automated test suite serially (457 tests across 116 suites) |
| `npm run logos:sync` | Copies the bounded official-logo export and recorded workspace-provided assets into the canonical registry and public manifest |
| `npm run db:migrate -- --dry-run` | Audits local JSON submissions and published additions ready for database sync |
| `npm run db:migrate -- --sql` | Outputs PostgreSQL INSERT statements ready for the Supabase SQL Editor |
| `npm run db:migrate` | Syncs local data to Supabase over REST when environment variables are set |

---

## Environment Variables

Configure these variables in your hosting environment (e.g. Vercel Project Settings) or `.env.local`:

| Variable | Environment | Description |
| :--- | :--- | :--- |
| `VITE_SITE_URL` | Client (Public) | Canonical site origin (e.g. `https://switchroute.in`). Defaults to `https://switchroute.in`. |
| `ADMIN_SECRET` | Server (Secret) | Bearer token / passkey required for `/moderation` and PATCH `/api/submissions`. |
| `SUPABASE_URL` | Server (Secret) | Supabase project URL (e.g. `https://<project-ref>.supabase.co`). |
| `SUPABASE_SECRET_KEY` | Server (Secret) | Preferred Supabase server key for privileged API storage. Takes precedence over the legacy service-role key. Never expose it to the browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (Secret) | Legacy JWT-based service-role key. Used when `SUPABASE_SECRET_KEY` is absent. |
| `SUPABASE_PUBLISHABLE_KEY` | Server (Public key) | *(Optional, read-only fallback)* Public Supabase key for published additions/discoveries only; does not enable writes or prompt storage. |
| `SUPABASE_ANON_KEY` | Server (Public key) | *(Optional, legacy read-only fallback)* Used only when no privileged key or `SUPABASE_PUBLISHABLE_KEY` is configured. Does not enable writes or prompt storage. |
| `UPSTASH_REDIS_REST_URL` | Server (Secret) | *(Optional)* Upstash REST endpoint for durable submissions, discoveries, and published additions. |
| `UPSTASH_REDIS_REST_TOKEN` | Server (Secret) | *(Optional)* Upstash REST token; required with `UPSTASH_REDIS_REST_URL`. |
| `GROQ_API_KEY` | Server (Secret) | *(Optional)* Groq API key for live chatbot responses (`openai/gpt-oss-120b`) or Groq multilingual speech-to-text when `TRANSCRIPTION_API_URL` points to Groq. |
| `GEMINI_API_KEY` | Server (Secret) | *(Optional)* Google Gemini API key for multimodal model inference. |
| `OPENAI_API_KEY` | Server (Secret) | *(Optional)* Server-side OpenAI speech-to-text key for the Video & Audio Transcriber. Never expose it as `VITE_`. The default `whisper-1` model supports multilingual transcription. |
| `TRANSCRIPTION_API_URL` | Server (Secret) | *(Optional)* Allowlisted OpenAI or Groq transcription endpoint. Defaults to OpenAI's audio transcription endpoint. |
| `TRANSCRIPTION_MODEL` | Server (Secret) | *(Optional)* Provider model name. Defaults to `whisper-1` for OpenAI and `whisper-large-v3-turbo` for Groq. The selected model must support multilingual transcription. |
| `VITE_ADSENSE_PUB_ID` | Client (Public) | *(Optional)* Google AdSense Publisher ID (e.g. `ca-pub-XXXXXXXXXXXXXXXX`). |

---

## Database Setup & Production Storage (Supabase)

To enable persistent community submissions and moderation in production:

1. Create a free account at [Supabase](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of [`server/schema.sql`](server/schema.sql) and execute it.
4. Obtain the project URL and a server-only secret key (preferred) or legacy service-role key.
5. Configure `SUPABASE_URL` and exactly the desired privileged key in the intended server environment. If both key variables are present, `SUPABASE_SECRET_KEY` wins; the application does not fall back after an authentication failure.
6. To seed local records, run `npm run db:migrate` only in an explicitly intended environment. The migration utility uses the same key precedence and sends opaque secret keys through `apikey` only; review its target before any live run.

---

## Editorial Moderation Workflow

1. Navigate to `/moderation` in your browser.
2. Enter the passkey configured in `ADMIN_SECRET`.
3. The dashboard allows editors to:
   - Filter submissions by status (`pending`, `in_review`, `approved`, `rejected`, `published`) and type (`tool`, `guide`).
   - Review submitted metadata, duplicate check flags, and submitter notes.
   - Update submission statuses and add editorial notes.
   - Click **Publish to Live Catalog** to publish approved tools or guides directly into live search, filters, and directory pages.

## Prompt Library

The prompt gallery ships original SwitchRoute recipes and original locally hosted SVG previews. It supports text, provider/model, category, tag, and sort filters; prompt detail pages provide the full text, model/style/aspect-ratio notes, and local bookmarks. Meigen media and prompt records are not included.

To enable database-backed prompt management, apply the `techhacks_prompts` section at the end of [`server/schema.sql`](server/schema.sql) in Supabase and configure server-only `SUPABASE_URL`, either `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_SECRET`. Public/low-privilege keys do not enable prompt storage. Open `/moderation` → **Prompt Library**. The public API returns only published prompts, while every write is protected by the moderator passkey and privileged server storage. Favorites use the existing browser-local bookmark store because the site has no user account system.

For authorized source imports, prepare a JSON array (or `{ "prompts": [...] }`) with `slug`, `title`, `description`, `category`, `targetModel`, `promptText`, `tags`, `authorOrSource`, `previewImage`, and `rightsConfirmed: true`; `id` is optional and generated if absent. Add `attributionUrl` where required. Local preview files must be under `/prompts/`; remote previews must be HTTPS, return an image content type and known size, and be no larger than 10 MB. The importer checks fields, preview image availability, rights confirmation, and duplicate slugs/prompt text against the bundled catalog, the import batch, and (when importing) saved Supabase entries.

Validate without saving:

```sh
npm run prompts:import -- ./authorized-prompts.json
```

To create database drafts, set `PROMPT_IMPORT_URL` to the site's `/api/prompts` endpoint and `ADMIN_SECRET` in the local shell, then add `--import`. Entries are always imported as drafts for review. After adding bundled editorial prompts, refresh the detail URL sitemap with `npm run prompts:sitemap`.

---

## Deployment Notes (Vercel)

- **SPA Rewrites:** [`vercel.json`](vercel.json) rewrites `/((?!api/).*)` to `/index.html`, preserving client-side React routes while leaving serverless functions under `/api/` intact.
- **Security Headers:** Modern HTTP security headers are configured in `vercel.json` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy`).
- **Transcription uploads:** Vercel Function request bodies are limited to 4.5 MB, so the transcriber accepts media files up to 4 MB to leave room for multipart overhead. Larger local MP4-to-MP3 conversions remain browser-only.
- **Multilingual transcription:** The transcriber supports provider auto-detection plus explicit English (`en`) and Hindi (`hi`) guidance. Auto-detect is the recommended mode for Hindi-English mixed speech; output remains in the spoken language and is not translated. OpenAI `whisper-1` and Groq Whisper models are documented as multilingual provider choices.
- **Logo provenance:** Thirty direct official web-logo assets are integrated under `public/logos/official-ai/`. Eight workspace-provided assets are labelled `provided` and hashed in `exports/official-ai-logos/provided-assets.csv`; favicon fallbacks remain explicit fallbacks.
- **Production secrets:** `ADMIN_SECRET` must be explicitly configured with a strong random value. The development fallback is disabled in production/serverless environments.
- **Commercial Use:** If monetizing through Google AdSense or sponsorships, Vercel requires a **Pro** plan. Non-commercial personal usage is supported under the Hobby tier.

---

## License

This project is licensed under the [MIT License](LICENSE).
