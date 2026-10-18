export type DiscoveryStatus = 'draft' | 'published';

export interface ToolDiscovery {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  imageUrl?: string;
  category?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  status: DiscoveryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryFormData {
  name: string;
  description: string;
  websiteUrl: string;
  imageUrl?: string;
  category?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  status?: DiscoveryStatus;
}

export interface DiscoveriesFilterState {
  status?: DiscoveryStatus | 'all';
  category?: string;
  searchQuery?: string;
  featuredOnly?: boolean;
}
