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
