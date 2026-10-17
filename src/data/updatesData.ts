import type { UpdateItem } from '../types/index.ts';

export const updatesData: UpdateItem[] = [
  {
    id: 'update-flux-1',
    title: 'FLUX.1 Schnell & Dev Models Added to Directory',
    date: '2026-10-15',
    category: 'model-update',
    summary: 'Black Forest Labs’ 12B parameter text-to-image models have been cataloged with verified open-weights and API endpoints.',
    toolSlug: 'flux-1',
    link: '/ai-tools/flux-1',
  },
  {
    id: 'update-runway-gen3',
    title: 'Runway Gen-3 Alpha Cinematic Camera Control Guide Published',
    date: '2026-10-12',
    category: 'guide',
    summary: 'Our editorial team published a practical walkthrough on combining FLUX master frames with Runway motion brush controls.',
    link: '/guides/cinematic-ai-video-workflow',
  },
  {
    id: 'update-supabase-ai',
    title: 'Supabase Vector Embeddings & pgvector 0.7 Benchmark Added',
    date: '2026-10-09',
    category: 'tool-release',
    summary: 'Supabase catalog entry updated with latest pgvector HNSW indexing benchmarks and self-hosting Docker steps.',
    toolSlug: 'supabase',
    link: '/tools/supabase',
  },
  {
    id: 'update-claude-artifacts',
    title: 'Claude 3.5 Sonnet Artifacts Dashboard Prototyping Guide',
    date: '2026-10-05',
    category: 'guide',
    summary: 'New step-by-step tutorial on rapid UI prototyping with interactive Artifacts, React, and Tailwind.',
    link: '/guides/mastering-claude-artifacts-dashboards',
  },
  {
    id: 'update-free-tools',
    title: 'Client-Side Utilities Suite Launched',
    date: '2026-09-30',
    category: 'platform-news',
    summary: 'Six client-side browser utilities launched, running 100% locally with zero server uploads and instant export.',
    link: '/free-tools',
  },
];
