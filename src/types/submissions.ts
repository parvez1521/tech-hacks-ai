export type SubmissionType = 'tool' | 'guide';

export type SubmissionStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'published';

export interface ToolSubmissionData {
  name: string;
  websiteUrl: string;
  description: string;
  category: string;
  section?: 'ai' | 'community' | 'open-source';
  pricingType: 'free' | 'freemium' | 'paid' | 'open-source';
  logoUrl?: string;
  features?: string[];
  tags?: string[];
  platform?: string[];
  alternativeTo?: string;
  submitterName?: string;
  submitterEmail?: string;
  notes?: string;
}

export interface GuideSubmissionData {
  title: string;
  summary: string;
  content: string;
  category: string;
  coverImageUrl?: string;
  tags?: string[];
  relatedTools?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  readTime?: string;
  authorName?: string;
  contactEmail?: string;
  referenceUrls?: string[];
  notes?: string;
}

export interface CommunitySubmission {
  id: string; // e.g. "sub_tool_1729267200000_abc"
  type: SubmissionType;
  status: SubmissionStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  toolData?: ToolSubmissionData;
  guideData?: GuideSubmissionData;
  moderatorNotes?: string;
  isVerified?: boolean;
  potentialDuplicate?: boolean;
  duplicateReason?: string;
  duplicateMatches?: string[];
  publishedSlug?: string;
  publishedAt?: string;
}

export interface SubmissionResponse {
  success: boolean;
  id?: string;
  message: string;
  potentialDuplicate?: boolean;
  duplicateReason?: string;
  errors?: Record<string, string>;
}

export interface ModerationFilterState {
  type: 'all' | SubmissionType;
  status: 'all' | SubmissionStatus;
  searchQuery: string;
}

export interface PublishedAdditions {
  tools: any[];
  guides: any[];
  lastUpdated: string;
}
