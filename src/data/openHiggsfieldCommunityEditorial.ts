import type { GitHubProjectEditorialRecord } from '../types/githubProjects.ts';

// Separate record for the popular wide-trace repository; kept unverified because
// the repository currently has no LICENSE file despite describing itself as open source.
export const openHiggsfieldCommunityEditorialRecords: GitHubProjectEditorialRecord[] = [
  {
    id: 'open-higgsfield-wide-trace',
    name: 'OpenHiggsfield AI',
    slug: 'open-higgsfield-wide-trace',
    fullName: 'wide-trace/open-higgsfield',
    repositoryUrl: 'https://github.com/wide-trace/open-higgsfield',
    readmeUrl: 'https://github.com/wide-trace/open-higgsfield#readme',
    description: 'A browser-based image and video generation studio that connects to external model providers.',
    longDescription: 'Community-built studio that provides one interface for multiple image and video models. The repository README says generation requires a provider platform key; the interface itself does not make model inference free. No LICENSE file is present in the repository, so reuse rights are unclear despite the README calling it open source. This is an independent community project, not an official Higgsfield product.',
    primaryCategory: 'ai-video-generation',
    secondaryCategories: ['ai-image-design', 'self-hosted-apps'],
    tags: ['community project', 'image generation', 'video generation', 'multi-model', 'bring your own API key'],
    documentationUrl: 'https://github.com/wide-trace/open-higgsfield#readme',
    installationDifficulty: 'intermediate',
    requiresGpu: false,
    requiresApiKey: true,
    requiresPaidService: null,
    selfHostable: true,
    platformSupport: ['Web', 'Self-hosted'],
    screenshots: [],
    verifiedAt: null,
    verificationStatus: 'community-unverified',
    verificationNotes: 'Listed only in Community Projects — Unverified. Repository has no LICENSE file; commercial/reuse rights are unclear. README requires a provider key for generation, and provider charges may apply. Independent project, not affiliated with Higgsfield.',
    featured: false,
    editorialRank: null
  }
];
