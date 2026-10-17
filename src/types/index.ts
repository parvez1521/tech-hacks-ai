export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  websiteUrl: string;
  repositoryUrl: string;
  stars: number;
  starGrowthDelta: number; // positive or neutral monthly velocity
  forks: number;
  license: string;
  lastCommitDate: string; // ISO string
  lastCommitFormatted: string; // e.g. "9 hours ago", "2 days ago"
  repositoryAge: string; // e.g. "4 years", "2 years"
  repositoryAgeYears: number; // numeric age in years for accurate sorting
  version: string;
  isSelfHostable: boolean;
  isAiNative: boolean;
  isVerified: boolean;
  verifiedAt: string; // ISO date of repository check
  starVelocityType: 'estimated' | 'measured';
  featuredOrder?: number;
  categories: string[]; // category slugs
  tags: string[];
  techStack: string[];
  alternativesTo: string[]; // proprietary tool slugs (e.g. 'notion', 'airtable')
  iconLetter: string;
  iconBgColor: string;
  selfHostingSteps?: { step: number; title: string; detail: string }[];
}

export interface ProprietaryTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  category: string;
  iconLetter: string;
  iconBgColor: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  subcategories: { name: string; slug: string }[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  filterKey: 'trending' | 'self-hosted' | 'ai-native' | 'latest' | 'top-starred';
}

export type SortOption =
  | 'popular'
  | 'latest'
  | 'stars'
  | 'trending'
  | 'forks'
  | 'last_commit'
  | 'name_asc'
  | 'name_desc'
  | 'oldest';

export interface FilterState {
  searchQuery: string;
  sortBy: SortOption;
  category: string | null;
  alternativeTo: string | null;
  techStack: string | null;
  license: string | null;
  page: number;
}

export type PricingType = 'free' | 'freemium' | 'paid' | 'free-trial' | 'free-credits';

export type FreeAccessType = 'open-source-local' | 'recurring-free' | 'limited-free' | 'free-credits' | 'none';

export interface AiTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription?: string;
  websiteUrl: string;
  category: string; // e.g. 'video', 'image', 'voice', 'assistants', 'writing', 'coding', 'automation', 'productivity', '3d', 'music'
  pricingType: PricingType;
  pricingDetails: string;
  iconLetter: string;
  iconBgColor: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  rating?: number;
  features: string[];
  tags: string[];
  hasFreePlan: boolean;
  releaseYear?: number;
  freeAccessType: FreeAccessType;
  freeTierSummary: string;
  freeTierLimits: string;
  requiresAccount: boolean;
  pricingSourceUrl: string;
  pricingVerifiedAt: string;
  isSelfHostable?: boolean;
  openSourceRepoUrl?: string;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  promptTemplate?: string;
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string; // e.g. 'video-creation', 'prompting', 'productivity', 'coding'
  readTime: string; // e.g. '5 min read'
  author: string;
  publishedDate: string; // e.g. '2026-10-12'
  tags: string[];
  steps: GuideStep[];
  relatedToolSlugs: string[];
}

export interface PromptItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string; // e.g. 'image-generation', 'video-scripts', 'coding', 'writing', 'marketing'
  targetModel: string; // e.g. 'Midjourney v6', 'ChatGPT / Claude', 'Flux.1', 'Kling / Runway'
  promptText: string;
  copyCount?: number;
  tags: string[];
  tips?: string;
  authorOrSource?: string;
}

export interface FreeToolUtility {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'image' | 'text' | 'code' | 'security' | 'developer';
  iconName: string;
  isClientSideOnly: boolean;
  acceptedInput: string;
  outputFormat: string;
}

export interface BookmarkItem {
  id: string;
  type: 'open-source-tool' | 'ai-tool' | 'guide' | 'prompt' | 'free-tool';
  slug: string;
  title: string;
  subtitle: string;
  url: string;
  iconBgColor?: string;
  iconLetter?: string;
  savedAt: string;
}

export interface UpdateItem {
  id: string;
  title: string;
  date: string;
  category: 'tool-release' | 'model-update' | 'platform-news' | 'guide';
  summary: string;
  toolSlug?: string;
  link?: string;
}

export interface AiFilterState {
  searchQuery: string;
  category: string | null;
  pricingType: PricingType | 'all';
  freeAccessType?: FreeAccessType | 'all';
  sortBy: 'popular' | 'latest' | 'name_asc' | 'rating';
  page: number;
}


