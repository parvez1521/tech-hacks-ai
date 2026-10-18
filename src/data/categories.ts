import type { Category } from '../types/index.ts';

export const categories: Category[] = [
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'Frameworks, API tooling, code editors, testing, and deployment pipelines.',
    iconName: 'Code',
    subcategories: [
      { name: 'API Development', slug: 'api-development' },
      { name: 'Databases & Backend', slug: 'databases' },
      { name: 'Low-Code & No-Code', slug: 'low-code' },
      { name: 'Workflow Automation', slug: 'workflow-automation' },
    ],
    editorialOverview:
      'Developer tools form the backbone of modern software engineering, spanning relational and vector database backends, terminal coding agents, API testing suites, and visual workflow builders. Migrating from proprietary developer platforms like Firebase or Postman to open-source alternatives gives teams complete architectural sovereignty, eliminates unexpected egress and invocation billing, and enables localized offline staging environments.',
    targetAudience:
      'Full-stack software engineers, backend architects, DevOps engineers, and technical founders building scalable web and mobile applications.',
    selectionCriteria: [
      'Database Engine: Does the tool build on standard SQL (e.g. PostgreSQL with Supabase) or custom document datastores?',
      'Self-Hosting Complexity: Can the solution be deployed via single-command Docker Compose or does it mandate Kubernetes infrastructure?',
      'SDK & Ecosystem Support: Are first-party client libraries maintained for your runtime (TypeScript, Python, Go, Flutter)?',
      'Telemetry & Privacy: Can external cloud tracking be strictly disabled for air-gapped or HIPAA/GDPR-compliant deployments?',
    ],
    keyDifferences: [
      {
        title: 'Open Source vs. Free Hosted Inference',
        explanation: 'Open-source code editors and backend frameworks give you free software, but cloud inference (such as calling Claude or GPT-4o APIs) requires your own API key with associated token usage costs.',
      },
      {
        title: 'Self-Hosted vs. Managed Cloud PaaS',
        explanation: 'Self-hosting grants zero data lock-in and zero subscription fees, but shifts infrastructure maintenance, automated backups, and version upgrades to your team.',
      },
    ],
  },
  {
    id: 'ai-machine-learning',
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Web scraping for LLMs, agent frameworks, neural search, and AI personal assistants.',
    iconName: 'Bot',
    subcategories: [
      { name: 'AI Web Scraping', slug: 'ai-web-scraping' },
      { name: 'Vector & Search Engines', slug: 'vector-search' },
      { name: 'Agent Workflows', slug: 'agent-workflows' },
    ],
    editorialOverview:
      'The open-source AI ecosystem has matured rapidly, offering production-grade drop-in alternatives for conversational answer engines, neural search backends, structured web scrapers, and autonomous agent orchestrators. Instead of locking pipelines into closed proprietary APIs, these platforms empower teams to run open-weights models locally or route seamlessly across frontier providers.',
    targetAudience:
      'AI engineers, data scientists, research analysts, and software developers integrating generative models, RAG architectures, and web intelligence into their products.',
    selectionCriteria: [
      'Inference Backend: Support for local engines (Ollama, llama.cpp, vLLM) alongside commercial APIs.',
      'Data Ingestion: Capabilities for automated HTML parsing, proxy rotation, and markdown formatting for LLM context windows.',
      'Embeddings & Vector Indexing: Native support for hybrid search (BM25 lexical + vector semantic).',
      'License Permissions: Permissive Apache 2.0 / MIT licenses versus restrictive AGPL or non-commercial model weights.',
    ],
    keyDifferences: [
      {
        title: 'Local Quantized Models vs. Frontier Cloud APIs',
        explanation: 'Running 8B or 14B models on consumer hardware provides 100% data privacy and offline zero-cost execution, whereas frontier 70B+ cloud models offer higher reasoning benchmarks for complex tasks.',
      },
      {
        title: 'Raw Frameworks vs. Turnkey Answer Engines',
        explanation: 'Frameworks like Langflow require developer integration, while platforms like Perplexica and Khoj provide ready-to-use search UIs with citation synthesis out of the box.',
      },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity & Notes',
    slug: 'productivity',
    description: 'Knowledge bases, team wikis, project management, and scheduling tools.',
    iconName: 'CheckSquare',
    subcategories: [
      { name: 'Docs & Wikis', slug: 'docs-wikis' },
      { name: 'Spreadsheets & Databases', slug: 'spreadsheets-databases' },
      { name: 'Scheduling', slug: 'scheduling' },
    ],
    editorialOverview:
      'Modern knowledge management and team productivity software shouldn’t trap your documentation inside proprietary cloud silos. Open-source productivity alternatives provide relational databases, collaborative document canvases, and automated calendar scheduling while storing data in open formats like Markdown, SQLite, or PostgreSQL.',
    targetAudience:
      'Knowledge workers, engineering teams, remote companies, and privacy-conscious researchers seeking organized digital workspaces without vendor lock-in.',
    selectionCriteria: [
      'Data Format Portability: Does the tool store records in plain Markdown or open JSON rather than proprietary binary databases?',
      'Real-Time Collaboration: Is multi-user conflict resolution (CRDTs / WebSockets) supported for simultaneous document editing?',
      'Offline-First Capability: Can you read, write, and search your personal workspace without an active internet connection?',
      'Access Control: Granular role-based permissions (RBAC) and workspace isolation for internal team data security.',
    ],
    keyDifferences: [
      {
        title: 'Local-First vs. Server-Dependent Wikis',
        explanation: 'Tools like AFFiNE and AppFlowy prioritize local device storage with optional peer sync, whereas Docmost and Outline are client-server architectures built for central enterprise hosting.',
      },
      {
        title: 'Relational Database Tables vs. Simple Text Docs',
        explanation: 'Platforms like NocoDB and Baserow replace Airtable with relational PostgreSQL tables, while standard wikis focus strictly on hierarchical documentation.',
      },
    ],
  },
  {
    id: 'business-software',
    name: 'Business & Collaboration',
    slug: 'business-software',
    description: 'Customer communication, marketing, form builders, and social media scheduling.',
    iconName: 'Briefcase',
    subcategories: [
      { name: 'Social Media Scheduling', slug: 'social-media' },
      { name: 'Form Builders', slug: 'form-builders' },
      { name: 'Notifications & Messaging', slug: 'notifications' },
    ],
    editorialOverview:
      'Operating a modern online business often leads to a sprawl of recurring SaaS subscriptions for form collection, multi-channel messaging, and social publishing. Open-source business software allows startups and agencies to self-host their core marketing and communication tech stacks with zero per-seat licensing penalties.',
    targetAudience:
      'Growth teams, marketing agencies, small business owners, and startup operators managing customer engagement and multi-channel distribution.',
    selectionCriteria: [
      'Platform Integrations: Direct API integrations with social networks, email providers (SMTP/SES), and messaging channels.',
      'Multi-Tenant Architecture: Workspace separation allowing agencies to manage distinct client organizations securely.',
      'Compliance & Data Retention: Direct database storage of form responses and contact lists without third-party vendor access.',
      'Automation Webhooks: Native webhook triggers to route incoming leads directly into CRM and internal communication pipelines.',
    ],
    keyDifferences: [
      {
        title: 'API Quotas and Third-Party Token Limitations',
        explanation: 'Even when social scheduling software is open source, external platforms (like LinkedIn or Meta Graph APIs) enforce developer rate limits and token expirations.',
      },
      {
        title: 'Self-Hosted Delivery vs. Commercial Deliverability',
        explanation: 'Self-hosting email notifications requires configuring proper DNS records (SPF, DKIM, DMARC) or routing through reputable transactional relay providers.',
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics & Monitoring',
    slug: 'analytics',
    description: 'Privacy-focused web analytics, event tracking, and dashboard builders.',
    iconName: 'BarChart2',
    subcategories: [
      { name: 'Web Analytics', slug: 'web-analytics' },
      { name: 'Product Analytics', slug: 'product-analytics' },
    ],
    editorialOverview:
      'Traditional analytics services like Google Analytics collect extensive personal browsing identifiers, requiring intrusive cookie consent banners and raising cross-border GDPR compliance questions. Open-source analytics solutions provide lightweight, cookieless telemetry and full SQL database ownership.',
    targetAudience:
      'Website owners, product managers, privacy compliance officers, and developers measuring traffic, user funnels, and feature adoption.',
    selectionCriteria: [
      'Cookieless Tracking: Tracking methodologies that do not store persistent client identifiers or require GDPR cookie banners.',
      'Script Overhead: Lightweight tracking scripts (<5kB) that protect Core Web Vitals and reduce mobile data consumption.',
      'Custom Event Instrumentation: Support for measuring custom conversion goals, button clicks, and funnel drop-offs.',
      'Data Sovereignty: Hosting the database within your chosen cloud region to comply with local privacy regulations.',
    ],
    keyDifferences: [
      {
        title: 'High-Level Traffic Metrics vs. Deep Product Analytics',
        explanation: 'Umami and Plausible specialize in clean pageview and referral metrics without cookies, whereas PostHog provides comprehensive session replays and feature flags.',
      },
      {
        title: 'Storage Footprint: ClickHouse vs. Standard PostgreSQL',
        explanation: 'High-volume event pipelines benefit from columnar databases like ClickHouse, while low-to-medium traffic sites run efficiently on standard PostgreSQL.',
      },
    ],
  },
  {
    id: 'design-media',
    name: 'Design & Media',
    slug: 'design-media',
    description: 'Collaborative design editors, photo management, and media streaming.',
    iconName: 'Palette',
    subcategories: [
      { name: 'UI/UX Design', slug: 'ui-ux-design' },
      { name: 'Media Storage', slug: 'media-storage' },
    ],
    editorialOverview:
      'Design software has historically been monopolized by closed desktop and cloud ecosystems with expensive per-seat subscriptions. Modern open-source design platforms feature SVG-native canvas rendering, CSS flexbox/grid layout systems, and self-hostable photo libraries that respect personal privacy.',
    targetAudience:
      'UI/UX product designers, design systems engineers, digital illustrators, and creators seeking open file standards and self-hosted media storage.',
    selectionCriteria: [
      'Standard File Formats: Native reliance on open web standards (SVG, CSS) rather than proprietary encrypted design formats.',
      'Real-Time Multiplayer: Seamless collaborative editing with multi-cursor presence and component library sharing.',
      'Developer Handoff: Accurate CSS, flexbox, and SVG code inspection for engineering implementation.',
      'Self-Hosting Requirements: Resource requirements for image processing pipelines, thumbnail generation, and object storage.',
    ],
    keyDifferences: [
      {
        title: 'SVG-Native Standards vs. Proprietary Canvas Renders',
        explanation: 'Penpot renders natively using standard SVG and CSS, making design components directly translatable to web production code.',
      },
      {
        title: 'Local Desktop vs. Self-Hosted Cloud Instances',
        explanation: 'Design tools can be run via Docker on a private company server for team collaboration or used locally for offline personal projects.',
      },
    ],
  },
  {
    id: 'security-auth',
    name: 'Security & Auth',
    slug: 'security-auth',
    description: 'Authentication servers, secrets management, remote desktop, and passkeys.',
    iconName: 'Shield',
    subcategories: [
      { name: 'Authentication & SSO', slug: 'auth-sso' },
      { name: 'Secrets Management', slug: 'secrets-management' },
      { name: 'Remote Access', slug: 'remote-access' },
    ],
    editorialOverview:
      'Security, identity, and remote access software form the perimeter of any digital infrastructure. Open-source security tools ensure that cryptographic implementations and authentication handshakes are fully auditable by security researchers, preventing hidden backdoors or vendor-side outages.',
    targetAudience:
      'Security engineers, system administrators, enterprise IT teams, and developers managing user logins, encryption keys, and server infrastructure.',
    selectionCriteria: [
      'Audited Cryptography: Implementation of industry-vetted cryptographic protocols (OIDC, OAuth 2.0, WebAuthn/Passkeys, WireGuard).',
      'Zero-Knowledge Architecture: Encryption schemes where servers and relay nodes cannot decrypt user credentials or payload data.',
      'Directory Integration: Compatibility with LDAP, Active Directory, and SAML identity providers.',
      'Self-Hostable Relays: Ability to run private rendezvous and relay servers for remote access without third-party transit.',
    ],
    keyDifferences: [
      {
        title: 'Hosted Identity Providers vs. Self-Hosted Auth Engines',
        explanation: 'Self-hosting authentication gives you direct ownership of the user database, while hosted IDPs offer turnkey multi-region redundancy.',
      },
      {
        title: 'End-to-End Encrypted Relay vs. Cloud-Brokered Access',
        explanation: 'Tools like RustDesk allow running private relay servers so corporate screen feeds and keystrokes never traverse commercial cloud nodes.',
      },
    ],
  },
];
