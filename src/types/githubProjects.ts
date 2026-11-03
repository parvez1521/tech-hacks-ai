export type GitHubProjectCategory =
  | 'ai-video-generation'
  | 'ai-image-design'
  | 'ai-coding-agents'
  | 'local-ai-llms'
  | 'ai-automation-agents'
  | 'speech-voice'
  | 'ai-research-rag'
  | 'scraping-browser-automation'
  | 'developer-utilities'
  | 'self-hosted-apps';

export type GitHubProjectVerificationStatus = 'verified' | 'needs-review' | 'archived-unavailable' | 'license-unclear';
export type InstallationDifficulty = 'beginner' | 'intermediate' | 'advanced' | null;

export interface GitHubProjectEditorialRecord {
  id: string;
  name: string;
  slug: string;
  fullName: string;
  repositoryUrl: string;
  readmeUrl: string;
  description: string;
  longDescription: string;
  primaryCategory: GitHubProjectCategory;
  secondaryCategories: GitHubProjectCategory[];
  tags: string[];
  documentationUrl: string | null;
  installationDifficulty: InstallationDifficulty;
  requiresGpu: boolean | null;
  requiresApiKey: boolean | null;
  requiresPaidService: boolean | null;
  selfHostable: boolean | null;
  platformSupport: string[] | null;
  screenshots: string[];
  verifiedAt: string | null;
  verificationStatus: GitHubProjectVerificationStatus;
  verificationNotes: string;
  featured: boolean;
  editorialRank: number | null;
}

export interface GitHubRepositorySnapshot {
  fullName: string;
  githubDescription: string | null;
  language: string | null;
  licenseName: string | null;
  licenseSpdxId: string | null;
  licenseUrl: string | null;
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  lastCommitAt: string | null;
  repositoryUpdatedAt: string | null;
  defaultBranch: string | null;
  homepageUrl: string | null;
  snapshotCheckedAt: string | null;
}

export interface GitHubProject extends GitHubProjectEditorialRecord, GitHubRepositorySnapshot {}

export interface GitHubProjectLiveMetadata {
  fullName: string;
  githubDescription: string | null;
  language: string | null;
  licenseName: string | null;
  licenseSpdxId: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  defaultBranch: string;
  homepageUrl: string | null;
  lastCommitAt: string | null;
  repositoryUpdatedAt: string | null;
  readmeExcerpt: string | null;
  fetchedAt: string;
}
