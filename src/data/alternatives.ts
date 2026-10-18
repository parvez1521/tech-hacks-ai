import type { ProprietaryTool } from '../types/index.ts';

export const proprietaryTools: ProprietaryTool[] = [
  {
    id: 'firebase',
    name: 'Firebase',
    slug: 'firebase',
    tagline: 'Google app development and database platform',
    description: 'Cloud Firestore database, authentication, hosting, and serverless backends by Google.',
    websiteUrl: 'https://firebase.google.com',
    category: 'developer-tools',
    iconLetter: 'F',
    iconBgColor: '#f59e0b',
    migrationDrivers: [
      'Unpredictable read/write billing spikes on Cloud Firestore',
      'NoSQL querying limitations compared to standard relational SQL',
      'Vendor lock-in to Google Cloud infrastructure and proprietary security rules',
      'Difficulty running complete offline local staging environments',
    ],
    selectionCriteria: [
      'Relational Postgres foundation (Supabase) vs. lightweight SQLite document stores (PocketBase)',
      'Self-hosting footprint: single Docker container vs. distributed microservices',
      'Built-in real-time subscriptions, auth providers, and S3-compatible storage',
    ],
    hostedCostNote:
      'Open-source replacements like Supabase and PocketBase are 100% free software when self-hosted on your own VPS ($5–$20/mo server costs). Managed cloud tiers also offer generous free allowances.',
    replacementsOverview:
      'Supabase stands as the flagship open-source Firebase alternative, providing a full PostgreSQL database with Row Level Security, instant REST/GraphQL APIs, Auth, and Storage. For lightweight projects, PocketBase packages a complete database and auth server into a single executable.',
  },
  {
    id: 'notion',
    name: 'Notion',
    slug: 'notion',
    tagline: 'All-in-one workspace for notes, docs, and project management',
    description: 'Proprietary note-taking, project tracking, knowledge base, and team wiki system.',
    websiteUrl: 'https://notion.so',
    category: 'productivity',
    iconLetter: 'N',
    iconBgColor: '#18181b',
    migrationDrivers: [
      'Proprietary data formats that make complete raw Markdown export difficult',
      'Laggy document loading and offline access limitations',
      'Subscription fees per team member scaling to $10–$18/user/month',
      'Data privacy concerns for proprietary corporate intellectual property',
    ],
    selectionCriteria: [
      'Local-first offline privacy vs. centralized self-hosted team wikis',
      'Canvas whiteboard hybrid features versus structured document hierarchies',
      'Relational table properties and Kanban board parity',
    ],
    hostedCostNote:
      'Open-source alternatives store your notes in local SQLite or PostgreSQL databases. Self-hosting is free; AI writing features require configuring your own API keys (Ollama for free, or OpenAI/Anthropic pay-per-token).',
    replacementsOverview:
      'Community replacements range from local-first desktop workspaces with native performance to collaborative, self-hosted team knowledge bases that run cleanly on Docker.',
  },
  {
    id: 'airtable',
    name: 'Airtable',
    slug: 'airtable',
    tagline: 'Low-code relational database and spreadsheet platform',
    description: 'Cloud-based collaborative database and workflow builder for business operations.',
    websiteUrl: 'https://airtable.com',
    category: 'productivity',
    iconLetter: 'A',
    iconBgColor: '#2563eb',
    migrationDrivers: [
      'Strict record limits on free and lower-tier plans (1,000–50,000 records)',
      'High per-seat pricing ($20–$45/user/month) for business teams',
      'Requirement to keep internal business records inside private enterprise databases',
    ],
    selectionCriteria: [
      'Direct connection to existing PostgreSQL/MySQL databases (NocoDB) vs. native data storage (Baserow)',
      'Rich column types: formula fields, rollup aggregations, file attachments',
      'API rate limits and webhook integration flexibility',
    ],
    hostedCostNote:
      'Baserow and NocoDB can handle millions of rows on standard PostgreSQL servers with no per-record licensing fees.',
    replacementsOverview:
      'Baserow and NocoDB transform standard open-source relational databases into friendly, spreadsheet-like interfaces with views, forms, and automation webhooks.',
  },
  {
    id: 'buffer',
    name: 'Buffer',
    slug: 'buffer',
    tagline: 'Social media management and publishing toolkit',
    description: 'Social post scheduling, analytics, and community management across platforms.',
    websiteUrl: 'https://buffer.com',
    category: 'business-software',
    iconLetter: 'B',
    iconBgColor: '#0ea5e9',
    migrationDrivers: [
      'Channel connection limits on entry tiers',
      'Per-channel monthly subscription costs',
      'Desire to automate multi-account scheduling via custom webhooks and cron jobs',
    ],
    selectionCriteria: [
      'Support for key networks (X, LinkedIn, Instagram, TikTok, Reddit, YouTube)',
      'Integrated AI post drafting and image resizing utilities',
      'Self-hosted Docker deployment ease',
    ],
    hostedCostNote:
      'Postiz is open source and self-hostable. Note that social networks may require your own free developer API app keys.',
    replacementsOverview:
      'Postiz provides an all-in-one open-source social media scheduling suite that connects directly to 30+ platforms with AI copy generation.',
  },
  {
    id: 'figma',
    name: 'Figma',
    slug: 'figma',
    tagline: 'Collaborative cloud interface design and prototyping tool',
    description: 'Vector graphics and prototyping software primarily web-based for design teams.',
    websiteUrl: 'https://figma.com',
    category: 'design-media',
    iconLetter: 'Fi',
    iconBgColor: '#ec4899',
    migrationDrivers: [
      'Expensive monthly team and enterprise licensing ($12–$75/editor/month)',
      'Proprietary closed file format that cannot be rendered outside Figma',
      'Vendor lock-in and corporate cloud security requirements',
      'Disconnect between design canvas rendering and actual production CSS/SVG code',
    ],
    selectionCriteria: [
      'Standard web vector rendering: native SVG and CSS Flexbox/Grid support',
      'Real-time collaborative multiplayer editing with cursor presence',
      'Developer mode with accurate CSS code inspection and asset exporting',
      'Self-hostability via Docker Compose on company intranet',
    ],
    hostedCostNote:
      'Penpot is 100% free open-source software (MPL-2.0). You can self-host Penpot for your entire engineering and design team without paying per-seat license fees.',
    replacementsOverview:
      'Penpot is the leading open-source design tool built on web standards (SVG and CSS Grid/Flexbox), making design-to-code translation direct and natural for product engineering teams.',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    slug: 'zapier',
    tagline: 'Workflow automation and SaaS connector service',
    description: 'Automates work across 5,000+ app integrations without code.',
    websiteUrl: 'https://zapier.com',
    category: 'developer-tools',
    iconLetter: 'Z',
    iconBgColor: '#f97316',
    migrationDrivers: [
      'Punitive per-task billing where high-volume workflows cost hundreds of dollars monthly',
      'Strict multi-step workflow limits on entry tiers',
      'Inability to write arbitrary custom Node.js/Python code without premium tiers',
    ],
    selectionCriteria: [
      'Visual node-based workflow canvas with inline debugging and execution history',
      'Availability of 400+ pre-built integration nodes for popular SaaS and databases',
      'Self-hosted execution without per-task execution costs',
    ],
    hostedCostNote:
      'n8n and Activepieces are open-source and fair-code licensed. Self-hosted instances execute unlimited workflow tasks without per-run billing.',
    replacementsOverview:
      'n8n is the premier open-source workflow automation platform, providing visual flowchart automation, native JavaScript/Python scripting, and hundreds of integrations.',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    slug: 'google-analytics',
    tagline: 'Web analytics service by Google tracking website traffic',
    description: 'Enterprise web metrics, user tracking, and conversion measurement with cookie collection.',
    websiteUrl: 'https://analytics.google.com',
    category: 'analytics',
    iconLetter: 'GA',
    iconBgColor: '#eab308',
    migrationDrivers: [
      'Aggressive cookie tracking requiring intrusive cookie consent banners under GDPR and ePrivacy',
      'Complex, bloated GA4 user interface and reporting latency',
      'Heavy client tracking scripts that slow down Core Web Vitals and LCP metrics',
      'Data sharing with Google advertising networks',
    ],
    selectionCriteria: [
      'Cookieless, privacy-compliant tracking that requires zero user consent banners',
      'Ultralight script size (<3kB) for maximum web performance',
      'Simple, instantaneous dashboard views showing visitors, referrers, and devices in real time',
    ],
    hostedCostNote:
      'Umami is free open-source software (MIT) that runs easily on a free-tier Vercel + Supabase or cheap VPS stack.',
    replacementsOverview:
      'Umami provides clean, privacy-focused, cookieless website analytics that collect zero personal data, keep you 100% GDPR compliant, and load in milliseconds.',
  },
  {
    id: 'postman',
    name: 'Postman',
    slug: 'postman',
    tagline: 'API platform for building and using APIs',
    description: 'Commercial API testing, mocking, automated monitoring, and team workspaces.',
    websiteUrl: 'https://postman.com',
    category: 'developer-tools',
    iconLetter: 'P',
    iconBgColor: '#ef4444',
    migrationDrivers: [
      'Mandatory cloud account logins to use scratchpad and collection runners',
      'Enterprise workspace subscription costs and cloud sync privacy concerns',
      'Bloated desktop application performance and memory footprint',
    ],
    selectionCriteria: [
      'Offline-first execution with local file storage (Git-friendly)',
      'Fast, lightweight GUI or web client',
      'Environment variables, pre-request scripts, and test assertion support',
    ],
    hostedCostNote:
      'Hoppscotch and Bruno are free open-source tools with zero mandatory cloud accounts.',
    replacementsOverview:
      'Hoppscotch is a sleek, open-source web-based API testing tool, while Bruno stores collections directly in plain text files in your Git repository.',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    slug: 'calendly',
    tagline: 'Meeting scheduling and calendar booking platform',
    description: 'Automates scheduling meetings with clients and teams without back-and-forth emails.',
    websiteUrl: 'https://calendly.com',
    category: 'productivity',
    iconLetter: 'C',
    iconBgColor: '#3b82f6',
    migrationDrivers: [
      'Per-user subscription costs for multiple event types and collective scheduling',
      'Desire to white-label booking URLs under custom domains',
      'Calendar data synchronization and corporate calendar privacy',
    ],
    selectionCriteria: [
      'Bi-directional calendar sync with Google Calendar, Outlook, and CalDAV',
      'Custom availability schedules, round-robin booking, and paid booking integrations',
      'Self-hostability via Docker with full white-label branding',
    ],
    hostedCostNote:
      'Cal.com provides a community edition that can be self-hosted for free forever on your own infrastructure.',
    replacementsOverview:
      'Cal.com is the definitive open-source scheduling infrastructure, offering white-label custom domains, round-robin team routing, and developer-friendly webhooks.',
  },
  {
    id: 'algolia',
    name: 'Algolia',
    slug: 'algolia',
    tagline: 'Hosted search and discovery API engine',
    description: 'Proprietary cloud search API delivering millisecond search results.',
    websiteUrl: 'https://algolia.com',
    category: 'ai-machine-learning',
    iconLetter: 'Al',
    iconBgColor: '#6366f1',
    migrationDrivers: [
      'High search operation and record indexing costs at enterprise scale',
      'Desire for localized sub-millisecond search without external API latency',
      'Integration of AI vector search alongside traditional keyword search',
    ],
    selectionCriteria: [
      'Sub-50ms search query response times with typo tolerance and faceting',
      'Memory footprint and ease of indexing JSON records',
      'Hybrid search capabilities combining lexical BM25 and vector embeddings',
    ],
    hostedCostNote:
      'Meilisearch is open source and self-hostable. Firecrawl handles automated web extraction for search indexing.',
    replacementsOverview:
      'Meilisearch provides a lightning-fast, typo-tolerant open-source search engine with plug-and-play SDKs that drop right into web apps.',
  },
  {
    id: 'typeform',
    name: 'Typeform',
    slug: 'typeform',
    tagline: 'Conversational forms, surveys, and quizzes',
    description: 'Interactive one-question-at-a-time form builder with analytics.',
    websiteUrl: 'https://typeform.com',
    category: 'business-software',
    iconLetter: 'T',
    iconBgColor: '#10b981',
    migrationDrivers: [
      'Severe response caps on entry plans (100–1,000 responses/month)',
      'High pricing for basic conditional logic and custom branding',
      'GDPR compliance issues with third-party form data storage',
    ],
    selectionCriteria: [
      'Conversational step-by-step form UX with branching conditional logic',
      'Direct storage of responses in your own PostgreSQL/MySQL database',
      'Webhook notifications and CRM routing integrations',
    ],
    hostedCostNote:
      'HeyForm and Formbricks can be self-hosted for free to collect unlimited responses.',
    replacementsOverview:
      'Open-source form builders like HeyForm and Formbricks allow organizations to create beautiful conversational surveys and feedback forms without response limits.',
  },
  {
    id: 'google-photos',
    name: 'Google Photos',
    slug: 'google-photos',
    tagline: 'Cloud photo sharing and storage service',
    description: 'Cloud backup, timeline browsing, facial recognition, and albums for photos/videos.',
    websiteUrl: 'https://photos.google.com',
    category: 'design-media',
    iconLetter: 'GP',
    iconBgColor: '#06b6d4',
    migrationDrivers: [
      'Subscription fees for Google One storage tiers once 15GB free tier is exhausted',
      'Automated scanning and AI training on personal family photographs',
      'Compressed photo storage unless paying for original resolution',
    ],
    selectionCriteria: [
      'Native mobile apps with automatic background photo backup for iOS and Android',
      'Local machine learning for facial recognition, object search, and timeline albums',
      'Storage efficiency: handles RAW, HEIC, and 4K video files without compression',
    ],
    hostedCostNote:
      'Immich is 100% open source and free. You only pay for your own hard drives or NAS storage.',
    replacementsOverview:
      'Immich is a phenomenal, high-performance self-hosted photo and video backup solution with native mobile apps, local facial recognition, and reverse geocoding.',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    slug: 'claude-code',
    tagline: 'Anthropic agentic CLI coding tool operating in your terminal',
    description: 'Autonomous terminal coding assistant by Anthropic that edits multi-file repositories, runs tests, fixes bugs, and executes git commands.',
    websiteUrl: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview',
    category: 'developer-tools',
    iconLetter: 'CC',
    iconBgColor: '#d97706',
    migrationDrivers: [
      'Hard vendor lock-in to Anthropic Claude 3.5 Sonnet / Opus APIs with high token burn rates',
      'Inability to switch to open-weights models (DeepSeek-R1, Qwen 2.5 Coder, Llama 3.3) for local offline execution',
      'Lack of fine-grained multi-model orchestration (e.g. using cheap models for repo mapping and reasoning models for architectural diffs)',
      'Enterprise source code privacy policies prohibiting direct telemetry to single-vendor clouds',
    ],
    selectionCriteria: [
      'Multi-model flexibility: Bring Your Own Key (BYOK) for OpenAI, Anthropic, DeepSeek, or local Ollama endpoints',
      'Repository awareness: Compact repo map generation (Aider) vs. background embedding indexing',
      'Automated Git workflow: Automated atomic commits with descriptive commit messages and test verification',
      'Execution safety: Interactive human-in-the-loop confirmation before running terminal bash commands or writing files',
    ],
    hostedCostNote:
      'Open-source terminal agents (Aider, Cline, Roo Code, OpenCode) are 100% free software. When using cloud models, you pay token costs directly to your API provider with zero markup, or run 100% free offline with local models via Ollama.',
    replacementsOverview:
      'Aider is the benchmark terminal pair programming agent, editing multi-file git projects and committing clean diffs. Cline and Roo Code provide autonomous agent execution in VS Code with support for arbitrary models.',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    slug: 'perplexity',
    tagline: 'Conversational answer engine with live web search and citations',
    description: 'AI-driven research and answer engine that searches the live web in real time and synthesizes grounded answers with inline bibliographic citations.',
    websiteUrl: 'https://www.perplexity.ai',
    category: 'productivity',
    iconLetter: 'P',
    iconBgColor: '#20b2aa',
    migrationDrivers: [
      'Search query tracking and corporate research logging on commercial servers',
      'Pro tier subscription cost ($20/month) for advanced research models',
      'Desire to search across internal private documents (Obsidian notes, PDFs) simultaneously with live web search',
      'Desire to use SearXNG and local quantized models for 100% offline private search',
    ],
    selectionCriteria: [
      'Live web search grounding via private metasearch engines like SearXNG with zero tracking',
      'Direct bibliographic footnote citations linking to original publisher sources',
      'Hybrid search: combined live internet search plus private document and note indexing',
      'Self-hostability via Docker with local model support (Ollama)',
    ],
    hostedCostNote:
      'Perplexica and Khoj are free open-source software. Combined with SearXNG and Ollama, you can run a 100% free, completely private AI answer engine with zero subscription fees.',
    replacementsOverview:
      'Perplexica delivers an open-source AI answer engine using SearXNG and local or cloud LLMs with live citations. Khoj extends search to your personal notes and documents alongside live web retrieval.',
  },
];
