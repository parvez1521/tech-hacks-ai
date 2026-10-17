import type { Collection } from '../types/index.ts';

export const collections: Collection[] = [
  {
    id: 'trending',
    name: 'Trending',
    slug: 'trending',
    headline: 'Fastest-Growing Open Source Tools',
    description: 'Projects gaining rapid star velocity, active contributions, and community interest this month.',
    filterKey: 'trending',
  },
  {
    id: 'self-hosted',
    name: 'Self-Hosted',
    slug: 'self-hosted',
    headline: 'Self-Hostable Software You Can Run Anywhere',
    description: 'Take full control over your private data with Docker-deployable and single-command self-hosted platforms.',
    filterKey: 'self-hosted',
  },
  {
    id: 'ai-native',
    name: 'AI-Native',
    slug: 'ai-native',
    headline: 'Open Source AI-Powered Software',
    description: 'Tools designed from the ground up for LLM agents, web scraping, and intelligent automation.',
    filterKey: 'ai-native',
  },
  {
    id: 'latest',
    name: 'Latest Releases',
    slug: 'latest',
    headline: 'Recently Published Open Source Discoveries',
    description: 'Fresh software additions hand-picked and verified for our open alternative index.',
    filterKey: 'latest',
  },
];
