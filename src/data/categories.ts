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
  },
];
