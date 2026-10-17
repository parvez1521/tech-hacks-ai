import { aiToolsData, aiCategories } from '../data/aiToolsData.ts';
import { guidesData, guideCategories } from '../data/guidesData.ts';
import { promptsData, promptCategories } from '../data/promptsData.ts';
import { freeToolsData } from '../data/freeToolsData.ts';
import { toolsData } from '../data/seedData.ts';
import { proprietaryTools } from '../data/alternatives.ts';
import type { AiTool, AiFilterState, Guide, PromptItem, FreeToolUtility, Tool, ProprietaryTool } from '../types/index.ts';

export const AI_PAGE_SIZE = 12;

export interface AiFilterResult {
  tools: AiTool[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export function filterAndSortAiTools(state: AiFilterState): AiFilterResult {
  let list = [...aiToolsData];

  // 1. Text search
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchTagline = tool.tagline.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchTags = tool.tags.some((t) => t.toLowerCase().includes(q));
      const matchFeatures = tool.features.some((f) => f.toLowerCase().includes(q));
      return matchName || matchTagline || matchDesc || matchTags || matchFeatures;
    });
  }

  // 2. Category
  if (state.category) {
    list = list.filter((tool) => tool.category.toLowerCase() === state.category!.toLowerCase());
  }

  // 3. Pricing
  if (state.pricingType && state.pricingType !== 'all') {
    list = list.filter((tool) => tool.pricingType === state.pricingType);
  }

  // 3b. Free Access Type
  if (state.freeAccessType && state.freeAccessType !== 'all') {
    list = list.filter((tool) => tool.freeAccessType === state.freeAccessType);
  }

  // 4. Sort
  list.sort((a, b) => {
    switch (state.sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'latest':
        return (b.releaseYear || 2024) - (a.releaseYear || 2024);
      case 'popular':
      default:
        // Featured first, then rating
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / AI_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, state.page), totalPages);
  const startIndex = (currentPage - 1) * AI_PAGE_SIZE;
  const paginatedTools = list.slice(startIndex, startIndex + AI_PAGE_SIZE);

  return {
    tools: paginatedTools,
    totalCount,
    totalPages,
    currentPage,
  };
}

export function getAiToolBySlug(slug: string): AiTool | undefined {
  return aiToolsData.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
}

export function getFeaturedAiTools(limit = 6): AiTool[] {
  return aiToolsData.filter((t) => t.isFeatured).slice(0, limit);
}

export function getTrendingAiTools(limit = 6): AiTool[] {
  return aiToolsData.filter((t) => t.isTrending).slice(0, limit);
}

export function getFreeAiTools(limit?: number): AiTool[] {
  const free = aiToolsData.filter((t) => t.hasFreePlan || t.pricingType === 'free');
  return limit ? free.slice(0, limit) : free;
}

export function getOpenSourceAiTools(limit?: number): AiTool[] {
  const os = aiToolsData.filter((t) => t.isSelfHostable || t.freeAccessType === 'open-source-local');
  return limit ? os.slice(0, limit) : os;
}

export function getAllGuides(): Guide[] {
  return guidesData;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guidesData.find((g) => g.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllPrompts(): PromptItem[] {
  return promptsData;
}

export function getPromptBySlug(slug: string): PromptItem | undefined {
  return promptsData.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllFreeTools(): FreeToolUtility[] {
  return freeToolsData;
}

export function getFreeToolBySlug(slug: string): FreeToolUtility | undefined {
  return freeToolsData.find((ft) => ft.slug.toLowerCase() === slug.toLowerCase());
}

export interface UniversalSearchResult {
  openSourceTools: Tool[];
  aiTools: AiTool[];
  proprietaryAlternatives: ProprietaryTool[];
  guides: Guide[];
  prompts: PromptItem[];
  utilities: FreeToolUtility[];
  totalMatches: number;
}

export function universalSearch(query: string): UniversalSearchResult {
  const q = query.toLowerCase().trim();
  if (!q) {
    return {
      openSourceTools: [],
      aiTools: [],
      proprietaryAlternatives: [],
      guides: [],
      prompts: [],
      utilities: [],
      totalMatches: 0,
    };
  }

  const openSourceTools = toolsData
    .filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
    .slice(0, 4);

  const aiTools = aiToolsData
    .filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
    .slice(0, 4);

  const proprietaryAlternatives = proprietaryTools
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
    .slice(0, 3);

  const guides = guidesData
    .filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.tags.some((tag) => tag.toLowerCase().includes(q))
    )
    .slice(0, 3);

  const prompts = promptsData
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        p.targetModel.toLowerCase().includes(q)
    )
    .slice(0, 3);

  const utilities = freeToolsData
    .filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.tagline.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q)
    )
    .slice(0, 3);

  const totalMatches =
    openSourceTools.length +
    aiTools.length +
    proprietaryAlternatives.length +
    guides.length +
    prompts.length +
    utilities.length;

  return {
    openSourceTools,
    aiTools,
    proprietaryAlternatives,
    guides,
    prompts,
    utilities,
    totalMatches,
  };
}
