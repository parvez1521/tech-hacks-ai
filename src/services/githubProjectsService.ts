import type { GitHubProject, GitHubProjectCategory, GitHubProjectLiveMetadata } from '../types/githubProjects.ts';
import { githubProjects, publicGitHubProjects } from '../data/githubProjectsData.ts';

export type ProjectSort = 'stars' | 'updated' | 'curated';
export type ProjectRequirementFilter = 'all' | 'required' | 'not-required' | 'unknown';
export interface GitHubProjectFilters {
  query?: string;
  category?: GitHubProjectCategory | 'all';
  license?: string;
  language?: string;
  selfHostable?: 'all' | 'yes' | 'no' | 'unknown';
  requiresGpu?: ProjectRequirementFilter;
  requiresApiKey?: ProjectRequirementFilter;
  featuredOnly?: boolean;
  sort?: ProjectSort;
  page?: number;
  pageSize?: number;
}

function compareNullableNumbers(a: number | null, b: number | null) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return b - a;
}

function compareNullableDates(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(b).getTime() - new Date(a).getTime();
}

function matchesRequirement(value: boolean | null, filter: ProjectRequirementFilter | undefined) {
  if (!filter || filter === 'all') return true;
  if (filter === 'unknown') return value === null;
  return value === (filter === 'required');
}

export function filterAndSortGitHubProjects(filters: GitHubProjectFilters = {}, source: GitHubProject[] = publicGitHubProjects) {
  const query = filters.query?.trim().toLowerCase().split(/\s+/).filter(Boolean) || [];
  const filtered = source.filter((project) => {
    const categoryMatch = !filters.category || filters.category === 'all' || project.primaryCategory === filters.category || project.secondaryCategories.includes(filters.category);
    const text = [project.name, project.fullName, project.description, project.longDescription, ...project.tags].join(' ').toLowerCase();
    const selfHostMatch = filters.selfHostable === 'yes' ? project.selfHostable === true
      : filters.selfHostable === 'no' ? project.selfHostable === false
        : filters.selfHostable === 'unknown' ? project.selfHostable === null : true;
    return (!query.length || query.every((term) => text.includes(term))) && categoryMatch &&
      (!filters.license || project.licenseSpdxId === filters.license) &&
      (!filters.language || project.language === filters.language) && selfHostMatch &&
      matchesRequirement(project.requiresGpu, filters.requiresGpu) &&
      matchesRequirement(project.requiresApiKey, filters.requiresApiKey) &&
      (!filters.featuredOnly || project.featured);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === 'updated') return compareNullableDates(a.repositoryUpdatedAt, b.repositoryUpdatedAt) || a.name.localeCompare(b.name);
    if (filters.sort === 'curated') return compareNullableDates(a.verifiedAt, b.verifiedAt) || (a.editorialRank ?? Number.MAX_SAFE_INTEGER) - (b.editorialRank ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name);
    return compareNullableNumbers(a.stars, b.stars) || a.name.localeCompare(b.name);
  });
  const pageSize = Math.max(1, Math.min(100, Math.floor(filters.pageSize || 9)));
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.max(1, Math.min(pageCount, Math.floor(filters.page || 1)));
  return { projects: sorted.slice((page - 1) * pageSize, page * pageSize), total: sorted.length, page, pageCount, pageSize };
}

export function getGitHubProjectBySlug(slug: string) {
  return githubProjects.find((project) => project.slug === slug) || null;
}

export interface RefreshGitHubProjectResult {
  success: boolean;
  metadata?: GitHubProjectLiveMetadata;
  error?: string;
  reviewRequired?: boolean;
}

export async function refreshGitHubProjectMetadata(fullName: string): Promise<RefreshGitHubProjectResult> {
  if (!publicGitHubProjects.some((project) => project.fullName === fullName)) {
    return { success: false, error: 'This repository is not in the verified directory.' };
  }
  try {
    const response = await fetch(`/api/github-projects?repo=${encodeURIComponent(fullName)}&refresh=1`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body?.metadata) return { success: false, error: body?.error || 'GitHub metadata is unavailable. Showing the saved directory record.' };
    const project = publicGitHubProjects.find((item) => item.fullName === fullName)!;
    const metadata = body.metadata as GitHubProjectLiveMetadata;
    const reviewRequired = metadata.archived || metadata.licenseSpdxId !== project.licenseSpdxId;
    return { success: true, metadata, reviewRequired };
  } catch {
    return { success: false, error: 'Could not reach the GitHub metadata service. Showing the saved directory record.' };
  }
}
