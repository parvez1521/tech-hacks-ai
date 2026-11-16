import type { Tool, FilterState, ProprietaryTool, Category, Collection } from '../types/index.ts';
import { toolsData } from '../data/seedData.ts';
import { proprietaryTools } from '../data/alternatives.ts';
import { categories } from '../data/categories.ts';
import { collections } from '../data/collections.ts';
import { aiAlternativeMappings } from '../data/aiAlternativeMappings.ts';

export const PAGE_SIZE = 12;

export interface FilterResult {
  tools: Tool[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export function filterAndSortTools(filterState: FilterState): FilterResult {
  let list = [...toolsData];

  // 1. Text Search Filter (name, tagline, description, tags, techStack)
  if (filterState.searchQuery.trim()) {
    const q = filterState.searchQuery.toLowerCase().trim();
    list = list.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchTagline = tool.tagline.toLowerCase().includes(q);
      const matchDescription = tool.description.toLowerCase().includes(q);
      const matchTags = tool.tags.some((t) => t.toLowerCase().includes(q));
      const matchStack = tool.techStack.some((s) => s.toLowerCase().includes(q));
      const matchAlt = tool.alternativesTo.some((a) => a.toLowerCase().includes(q));
      return matchName || matchTagline || matchDescription || matchTags || matchStack || matchAlt;
    });
  }

  // 2. Category Filter
  if (filterState.category) {
    list = list.filter((tool) => tool.categories.includes(filterState.category!));
  }

  // 3. Alternative To Filter
  if (filterState.alternativeTo) {
    list = list.filter((tool) => tool.alternativesTo.includes(filterState.alternativeTo!));
  }

  // 4. Tech Stack Filter
  if (filterState.techStack) {
    list = list.filter((tool) =>
      tool.techStack.map((s) => s.toLowerCase()).includes(filterState.techStack!.toLowerCase())
    );
  }

  // 5. License Filter
  if (filterState.license) {
    list = list.filter((tool) => tool.license.toLowerCase() === filterState.license!.toLowerCase());
  }

  // 6. Sorting
  list.sort((a, b) => {
    switch (filterState.sortBy) {
      case 'stars':
        return b.stars - a.stars;
      case 'trending':
        return b.starGrowthDelta - a.starGrowthDelta;
      case 'forks':
        return b.forks - a.forks;
      case 'last_commit':
        return new Date(b.lastCommitDate).getTime() - new Date(a.lastCommitDate).getTime();
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'oldest':
        return (b.repositoryAgeYears || 0) - (a.repositoryAgeYears || 0);
      case 'latest':
        return new Date(b.lastCommitDate).getTime() - new Date(a.lastCommitDate).getTime();
      case 'popular':
      default:
        // Featured order first, then stars
        if (a.featuredOrder && b.featuredOrder) {
          return a.featuredOrder - b.featuredOrder;
        }
        return b.stars - a.stars;
    }
  });

  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, filterState.page), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTools = list.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    tools: paginatedTools,
    totalCount,
    totalPages,
    currentPage,
  };
}

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsData.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Only the featured open-source tools have a prerendered `/tools/:slug`
 * detail page (and a sitemap entry). Every other catalogue tool resolves
 * client-side only, so a direct visit or crawler request returns the static
 * 404 — the 2026-11-16 AdSense audit found 780 dead `/tools/*` links from
 * this. Gate EVERY internal `/tools/:slug` link on this predicate; never
 * emit a link for a tool without a detail page. The featured set is exactly
 * the sitemap's `/tools/*` set (see tests/adsense_audit_link_gate.test.js).
 */
export function hasToolDetailPage(tool: Tool | string | undefined | null): boolean {
  if (!tool) return false;
  const record = typeof tool === 'string' ? getToolBySlug(tool) : tool;
  return Boolean(record?.featuredOrder);
}

/** Internal detail-page URL for a tool, or null when it has no live page. */
export function getToolDetailUrl(tool: Tool | string | undefined | null): string | null {
  if (!tool) return null;
  const record = typeof tool === 'string' ? getToolBySlug(tool) : tool;
  if (!record?.featuredOrder) return null;
  return `/tools/${record.slug}`;
}

export function getProprietaryToolBySlug(slug: string): ProprietaryTool | undefined {
  return proprietaryTools.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getToolsForProprietary(proprietarySlug: string): Tool[] {
  const mappedSlugs = new Set(aiAlternativeMappings
    .filter((mapping) => mapping.targetSlug === proprietarySlug && mapping.alternativeType === 'open-source')
    .map((mapping) => mapping.alternativeSlug));
  return toolsData.filter((tool) => tool.alternativesTo.includes(proprietarySlug) || mappedSlugs.has(tool.slug));
}

export function getSimilarTools(currentTool: Tool, limit = 3): Tool[] {
  return toolsData
    .filter((t) => t.id !== currentTool.id)
    .filter(
      (t) =>
        t.categories.some((c) => currentTool.categories.includes(c)) ||
        t.alternativesTo.some((a) => currentTool.alternativesTo.includes(a))
    )
    .slice(0, limit);
}

export function getDistinctTechStacks(): string[] {
  const set = new Set<string>();
  toolsData.forEach((t) => t.techStack.forEach((s) => set.add(s)));
  return Array.from(set).sort();
}

export function getDistinctLicenses(): string[] {
  const set = new Set<string>();
  toolsData.forEach((t) => set.add(t.license));
  return Array.from(set).sort();
}
