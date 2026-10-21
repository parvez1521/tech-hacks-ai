export type CatalogSection = 'open-source' | 'ai' | 'community' | 'utility' | 'alternative';

export type UtilityCategory =
  | 'video-audio'
  | 'image-graphics'
  | 'text-writing'
  | 'developer-tools'
  | 'security-validation'
  | 'files-data-browser';

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
  generationTasks?: GenerationTask[];
  outputModalities?: OutputModality[];
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
  migrationDrivers?: string[];
  selectionCriteria?: string[];
  hostedCostNote?: string;
  replacementsOverview?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  subcategories: { name: string; slug: string }[];
  editorialOverview?: string;
  targetAudience?: string;
  selectionCriteria?: string[];
  keyDifferences?: { title: string; explanation: string }[];
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

export type GenerationTask =
  | 'text-to-video'
  | 'image-to-video'
  | 'video-to-video'
  | 'avatar-video'
  | 'text-to-image'
  | 'image-editing'
  | 'text-to-speech'
  | 'speech-to-text'
  | 'music-generation'
  | 'coding-assistant'
  | 'chat'
  | 'research'
  | 'automation'
  | '3d-generation';

export type InputModality = 'text' | 'image' | 'video' | 'audio' | 'code' | 'file';
export type OutputModality = 'text' | 'image' | 'video' | 'audio' | 'code' | '3d';

export interface PickCriteria {
  goal: string;
  taskDetail?: string;
  budget: 'completely-free' | 'free-credits' | 'free-trial' | 'self-hosted' | 'any';
  hostingPreference?: 'browser' | 'local' | 'any';
  watermarkPreference?: 'no-watermark' | 'any';
}

export interface MatchedPickResult {
  tool: Tool | AiTool;
  type: 'open-source' | 'ai' | 'utility';
  matchScore: number;
  matchExplanation: string;
  matchReasons: string[];
  tasks: string[];
  freeAccessSummary: string;
  websiteUrl: string;
  detailUrl: string;
  pricingVerifiedAt: string;
}

export interface AiTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription?: string;
  websiteUrl: string;
  category: string; // e.g. 'video', 'image', 'voice', 'assistants', 'writing', 'coding', 'automation', 'productivity', '3d', 'music'
  primaryCategory?: string;
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
  generationTasks?: GenerationTask[];
  inputModalities?: InputModality[];
  outputModalities?: OutputModality[];
  useCases?: string[];
  bestFor?: string;
  executionEnvironment?: string;
  hardwareRequirements?: string;
  requiresInstallation?: boolean;
  alternativesTo?: string[];
  subType?: 'standalone-tool' | 'model-access-platform';
  supportedModels?: string[];
  platformStatus?: 'live' | 'coming-soon' | 'preview';
  section?: 'ai' | 'community';
}

export interface CommunityTool extends AiTool {
  section: 'community';
  submittedAt?: string;
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
  category: string;
  targetModel: string; // e.g. 'FLUX.1', 'Claude 3.5 Sonnet', 'Gemini Nano Banana', 'Higgsfield AI'
  provider?: string; // e.g. 'Google', 'Anthropic', 'Higgsfield', 'Black Forest Labs', 'Runway', 'Cursor'
  promptText: string;
  copyCount?: number;
  tags: string[];
  tips?: string;
  authorOrSource?: string;
  placeholders?: string[]; // e.g. ['[PRODUCT]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]']
  customizationInstructions?: string;
  expectedOutputType?: string; // e.g. '16:9 4K Photorealistic Render', 'Interactive React Component (.tsx)', '9:16 Vertical Video'
  exampleUseCase?: string;
  relatedPromptSlugs?: string[];
  officialToolUrl?: string; // e.g. 'https://ai.google.dev/gemini-api/docs/image-generation', 'https://higgsfield.ai/'
  /** Original or properly licensed preview image hosted by this project. */
  previewImage?: string;
  /** Editorial visual treatment to help users find a compatible recipe. */
  visualStyle?: string;
  aspectRatio?: string;
  attributionUrl?: string;
  status?: 'draft' | 'pending' | 'published' | 'rejected';
}

export interface FreeToolUtility {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'image' | 'text' | 'code' | 'security' | 'developer' | 'browser' | 'media' | 'productivity';
  /** Canonical section/category fields are normalized by the utility catalog service. */
  section?: 'utility';
  primaryCategory?: UtilityCategory;
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

export type OfferType =
  | 'free-subscription'
  | 'student-plan'
  | 'telecom-bundle'
  | 'developer-pack'
  | 'startup-credits'
  | 'discount'
  | 'coupon'
  | 'free-trial';

export interface AiOffer {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string;
  offerType: OfferType;
  eligibility: string;
  benefitSummary: string;
  claimUrl: string;
  officialTermsUrl: string;
  couponCode?: string;
  discountValue?: string;
  validFrom?: string;
  validUntil?: string;
  lastVerifiedAt: string;
  verificationStatus: 'verified-active' | 'limited-time' | 'archived-expired' | 'expired' | 'pending-verification';
  region: 'India' | 'Global' | 'US' | 'EU';
  requiresStudentVerification: boolean;
  renewalTerms: string;
  claimSteps: { step: number; title: string; detail: string }[];
  /** Canonical registry identity used by BrandLogo; never render logoAssetPath directly. */
  logoSlug: string;
  logoAssetPath: string;
  tags: string[];
  isFeatured?: boolean;
}
