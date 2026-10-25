import { aiToolsData, aiCategories } from '../data/aiToolsData.ts';
import { guidesData, guideCategories } from '../data/guidesData.ts';
import { promptsData, promptCategories } from '../data/promptsData.ts';
import imageDimensions from '../../data/prompt-image-dimensions.json' with { type: 'json' };
import { freeToolsData } from '../data/freeToolsData.ts';
import { toolsData } from '../data/seedData.ts';
import { proprietaryTools } from '../data/alternatives.ts';
import type { AiTool, AiFilterState, Guide, PromptItem, FreeToolUtility, Tool, ProprietaryTool, PickCriteria, MatchedPickResult } from '../types/index.ts';
import type { VideoDiscoverySection } from '../types/index.ts';
import { everydayUtilityOrder, getUtilityCategory } from '../data/catalogTaxonomy.ts';
import { getPromptArtwork } from '../data/promptArtwork.ts';
import promptCatalogCount from '../../data/promptfeed-catalog-count.json' with { type: 'json' };
import promptMediaCounts from '../../data/prompt-media-counts.json' with { type: 'json' };
import { aiAlternativeMappings } from '../data/aiAlternativeMappings.ts';

export const AI_PAGE_SIZE = 12;

export interface AiFilterResult {
  tools: AiTool[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const dynamicPublishedTools: AiTool[] = [];
const dynamicPublishedGuides: Guide[] = [];

export function registerPublishedTool(tool: AiTool) {
  if (!tool || !tool.slug) return;
  const existingIdx = dynamicPublishedTools.findIndex((t) => t.slug === tool.slug);
  if (existingIdx >= 0) {
    dynamicPublishedTools[existingIdx] = tool;
  } else {
    dynamicPublishedTools.unshift(tool);
  }
}

export function registerPublishedGuide(guide: Guide) {
  if (!guide || !guide.slug) return;
  const existingIdx = dynamicPublishedGuides.findIndex((g) => g.slug === guide.slug);
  if (existingIdx >= 0) {
    dynamicPublishedGuides[existingIdx] = guide;
  } else {
    dynamicPublishedGuides.unshift(guide);
  }
}

export function getAllAiTools(): AiTool[] {
  const seen = new Set<string>();
  return [...dynamicPublishedTools, ...aiToolsData].filter((tool) => {
    if (!tool.slug || seen.has(tool.slug)) return false;
    seen.add(tool.slug);
    return !isCommunityTool(tool);
  });
}

/** Community submissions are kept separate from the editorial AI directory. */
export function getAllCommunityTools(): AiTool[] {
  const seen = new Set<string>();
  return dynamicPublishedTools.filter((tool) => {
    if (!tool.slug || seen.has(tool.slug)) return false;
    seen.add(tool.slug);
    return isCommunityTool(tool);
  });
}

export function isCommunityTool(tool: AiTool): boolean {
  return tool.section === 'community' || (Array.isArray(tool.tags) && tool.tags.includes('community-verified'));
}

// Client hydration: fetch approved additions if running in browser
if (typeof window !== 'undefined' && typeof fetch === 'function') {
  fetch('/api/submissions?action=published')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data?.tools && Array.isArray(data.tools)) {
        data.tools.forEach(registerPublishedTool);
      }
      if (data?.guides && Array.isArray(data.guides)) {
        data.guides.forEach(registerPublishedGuide);
      }
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('techhacks:catalog-updated'));
    })
    .catch(() => {});
}

const SEARCH_TERM_VARIANTS: Record<string, string[]> = {
  generator: ['generator', 'generators', 'generate', 'generates', 'generated', 'generating', 'generation', 'generative'],
  generate: ['generate', 'generates', 'generated', 'generating', 'generation', 'generative', 'generator'],
  free: ['free', 'zero-cost', 'no-cost', 'open-source', 'open source'],
  videos: ['videos', 'video'],
};

function normalizeSearchText(value: unknown): string {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Match all query terms across the full record, rather than requiring the whole phrase verbatim. */
function matchesSearchQuery(query: string, fields: unknown[]): boolean {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const searchableText = normalizeSearchText(fields.filter(Boolean).join(' '));
  return terms.every((term) => {
    const variants = SEARCH_TERM_VARIANTS[term] || [term];
    return variants.some((variant) => searchableText.includes(normalizeSearchText(variant)));
  });
}

export function filterAndSortAiTools(state: AiFilterState): AiFilterResult {
  let list = getAllAiTools().filter((tool) => !isCommunityTool(tool));

  // 1. Text search
  if (state.searchQuery.trim()) {
    list = list.filter((tool) => matchesSearchQuery(state.searchQuery, [
      tool.name, tool.tagline, tool.description, tool.category, tool.pricingType,
      tool.freeTierSummary, tool.freeTierLimits, tool.pricingDetails, tool.bestFor,
      tool.executionEnvironment, tool.hardwareRequirements, tool.licenseSummary,
      tool.accessLabel, ...(tool.tags || []), ...(tool.features || []),
      ...(tool.useCases || []), ...(tool.generationTasks || []), ...(tool.outputModalities || []),
      tool.hasFreePlan ? 'free recurring free plan' : '',
      tool.isSelfHostable ? 'open source local self hosted free' : '',
      tool.category === 'video' ? 'video generator video generation generative video' : '',
    ]));
  }

  // 2. Category
  if (state.category) {
    list = list.filter((tool) => tool.category.toLowerCase() === state.category!.toLowerCase());
  }

  if (state.alternativesTo) {
    const alternatives = new Set(getAiAlternativesForTarget(state.alternativesTo).map((tool) => tool.slug));
    list = list.filter((tool) => alternatives.has(tool.slug));
  }

  if (state.videoDiscoverySection && state.videoDiscoverySection !== 'all') {
    list = list.filter((tool) => tool.videoDiscoverySections?.includes(state.videoDiscoverySection as VideoDiscoverySection));
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
  if (!slug) return undefined;
  return getAllAiTools().find((t) => t.slug.toLowerCase() === slug.toLowerCase());
}

export function getFeaturedAiTools(limit = 6): AiTool[] {
  return getAllAiTools().filter((t) => !isCommunityTool(t) && t.isFeatured).slice(0, limit);
}

export function getTrendingAiTools(limit = 6): AiTool[] {
  return getAllAiTools().filter((t) => !isCommunityTool(t) && t.isTrending).slice(0, limit);
}

export function getFreeAiTools(limit?: number): AiTool[] {
  const free = getAllAiTools().filter((t) => !isCommunityTool(t) && (t.hasFreePlan || t.pricingType === 'free'));
  return limit ? free.slice(0, limit) : free;
}

export function getOpenSourceAiTools(limit?: number): AiTool[] {
  const os = getAllAiTools().filter((t) => !isCommunityTool(t) && (t.isSelfHostable || t.freeAccessType === 'open-source-local'));
  return limit ? os.slice(0, limit) : os;
}

export function getAiToolsForProprietary(proprietarySlug: string): AiTool[] {
  if (!proprietarySlug) return [];
  const mappedSlugs = new Set(aiAlternativeMappings.filter((mapping) => mapping.targetSlug === proprietarySlug).map((mapping) => mapping.alternativeSlug));
  return getAllAiTools().filter((tool) => !isCommunityTool(tool) && (tool.alternativesTo?.includes(proprietarySlug) || mappedSlugs.has(tool.slug)));
}

/** Resolve both explicitly listed and reverse-linked catalog alternatives without duplicating product records. */
export function getAiAlternativesForTarget(targetSlug: string): AiTool[] {
  if (!targetSlug) return [];
  const allTools = getAllAiTools().filter((tool) => !isCommunityTool(tool));
  const target = allTools.find((tool) => tool.slug === targetSlug);
  const bySlug = new Map(allTools.map((tool) => [tool.slug, tool]));
  const orderedSlugs = [
    ...(target?.alternativesTo || []),
    ...allTools.filter((tool) => tool.alternativesTo?.includes(targetSlug)).map((tool) => tool.slug),
    ...aiAlternativeMappings.filter((mapping) => mapping.targetSlug === targetSlug && mapping.alternativeType === 'ai').map((mapping) => mapping.alternativeSlug),
  ];
  const seen = new Set<string>();
  return orderedSlugs.flatMap((slug) => {
    if (slug === targetSlug || seen.has(slug)) return [];
    seen.add(slug);
    const tool = bySlug.get(slug);
    return tool ? [tool] : [];
  });
}

export function getVideoDiscoveryTools(section?: VideoDiscoverySection): AiTool[] {
  return getAllAiTools().filter((tool) =>
    !isCommunityTool(tool) && tool.category === 'video' &&
    (!section || tool.videoDiscoverySections?.includes(section))
  );
}

export function getAllGuides(): Guide[] {
  const seen = new Set<string>();
  return [...dynamicPublishedGuides, ...guidesData].filter((guide) => {
    if (!guide.slug || seen.has(guide.slug)) return false;
    seen.add(guide.slug);
    return true;
  });
}

export function getGuideBySlug(slug: string): Guide | undefined {
  if (!slug) return undefined;
  return getAllGuides().find((g) => g.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllPrompts(): PromptItem[] {
  return promptsData.map((prompt) => ({
    ...prompt,
    previewImage: prompt.previewImage || getPromptArtwork(prompt)?.path,
    previewImageAlt: prompt.previewImageAlt || getPromptArtwork(prompt)?.alt,
    previewImageWidth: imageDimensions[prompt.slug]?.width || undefined,
    previewImageHeight: imageDimensions[prompt.slug]?.height || undefined,
    visualStyle: prompt.visualStyle || inferPromptStyle(prompt),
    aspectRatio: prompt.aspectRatio || inferPromptAspectRatio(prompt),
    status: prompt.status || 'published',
  })).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    || (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER));
}

export function getPromptBySlug(slug: string): PromptItem | undefined {
  return getAllPrompts().find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

function inferPromptStyle(prompt: PromptItem): string {
  const tags = prompt.tags.join(' ').toLowerCase();
  if (/cinematic|film|video|motion/.test(tags)) return 'Cinematic';
  if (/product|commercial|studio/.test(tags)) return 'Studio product';
  if (/character|portrait|fashion/.test(tags)) return 'Character study';
  if (/vector|interface|ui|app-icon/.test(tags)) return 'Graphic';
  return 'Conceptual';
}

function inferPromptAspectRatio(prompt: PromptItem): string {
  const text = `${prompt.expectedOutputType || ''} ${prompt.promptText}`;
  const ratio = text.match(/(?:--ar\s*)?(\d{1,2}:\d{1,2})/i);
  if (ratio) return ratio[1];
  return /portrait|vertical|9:16/i.test(text) ? '9:16' : /panorama|wide|16:9/i.test(text) ? '16:9' : '1:1';
}

export function getAllFreeTools(): FreeToolUtility[] {
  const priority = new Map(everydayUtilityOrder.map((slug, index) => [slug, index]));
  return [...freeToolsData]
    .map((tool, originalIndex) => ({ ...tool, section: 'utility' as const, primaryCategory: getUtilityCategory(tool), originalIndex }))
    .sort((a, b) => (priority.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (priority.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
      || a.originalIndex - b.originalIndex)
    .map(({ originalIndex: _originalIndex, ...tool }) => tool);
}

export function getFreeToolBySlug(slug: string): FreeToolUtility | undefined {
  return getAllFreeTools().find((ft) => ft.slug.toLowerCase() === slug.toLowerCase());
}

export interface CatalogStats {
  catalogIdentities: number;
  openSourceTools: number;
  aiPlatforms: number;
  alternativeTargets: number;
  browserUtilities: number;
  alternativeRelationships: number;
  uniquePrompts: number;
  proprietaryToolsWithAlternatives: number;
  imagePrompts: number;
  videoPrompts: number;
  nonVisualPrompts: number;
}

export function getCatalogStats(): CatalogStats {
  const openSourceSlugs = new Set(toolsData.map((tool) => tool.slug));
  const aiSlugs = new Set(getAllAiTools().filter((tool) => !isCommunityTool(tool)).map((tool) => tool.slug));
  const alternativeSlugs = new Set(proprietaryTools.map((tool) => tool.slug));
  const aiTargetSlugs = new Set(getAllAiTools().map((tool) => tool.slug));
  const coreCatalogSlugs = new Set([...openSourceSlugs, ...aiSlugs, ...alternativeSlugs]);
  const knownTargetSlugs = new Set([...openSourceSlugs, ...aiSlugs, ...alternativeSlugs]);
  const relationshipPairs = new Set<string>();
  for (const tool of [...toolsData, ...getAllAiTools()]) {
    for (const targetSlug of tool.alternativesTo || []) {
      if (knownTargetSlugs.has(targetSlug)) relationshipPairs.add(`${tool.slug}->${targetSlug}`);
    }
  }
  for (const mapping of aiAlternativeMappings) {
    if (knownTargetSlugs.has(mapping.targetSlug) && (aiTargetSlugs.has(mapping.alternativeSlug) || openSourceSlugs.has(mapping.alternativeSlug))) {
      relationshipPairs.add(`${mapping.alternativeSlug}->${mapping.targetSlug}`);
    }
  }
  return {
    catalogIdentities: coreCatalogSlugs.size,
    openSourceTools: openSourceSlugs.size,
    aiPlatforms: aiSlugs.size,
    alternativeTargets: alternativeSlugs.size,
    browserUtilities: getAllFreeTools().length,
    alternativeRelationships: relationshipPairs.size,
    uniquePrompts: promptCatalogCount,
    proprietaryToolsWithAlternatives: new Set([...relationshipPairs]
      .map((pair) => pair.slice(pair.indexOf('->') + 2))
      .filter((slug) => alternativeSlugs.has(slug))).size,
    imagePrompts: promptMediaCounts.imagePrompts,
    videoPrompts: promptMediaCounts.videoPrompts,
    nonVisualPrompts: promptMediaCounts.nonVisualPrompts,
  };
}

export function getAiAlternativeMappingsForTarget(targetSlug: string) {
  return aiAlternativeMappings.filter((mapping) => mapping.targetSlug === targetSlug);
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

  const aiTools = getAllAiTools()
    .filter((tool) => !isCommunityTool(tool))
    .filter((tool) => matchesSearchQuery(q, [
      tool.name, tool.tagline, tool.description, tool.category, tool.pricingType,
      tool.freeTierSummary, tool.freeTierLimits, ...(tool.tags || []), ...(tool.features || []),
      ...(tool.useCases || []), ...(tool.generationTasks || []), ...(tool.outputModalities || []),
      tool.hasFreePlan ? 'free recurring free plan' : '',
      tool.isSelfHostable ? 'open source local self hosted free' : '',
      tool.category === 'video' ? 'video generator video generation generative video' : '',
    ]))
    .slice(0, 4);

  const proprietaryAlternatives = proprietaryTools
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
    .slice(0, 3);

  const guides = getAllGuides()
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

  const utilities = getAllFreeTools()
    .filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.tagline.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q) ||
        Boolean(u.primaryCategory?.toLowerCase().includes(q))
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

export function getPickRecommendations(criteria: PickCriteria): MatchedPickResult[] {
  const { goal, taskDetail, budget, hostingPreference = 'any', watermarkPreference = 'any' } = criteria;
  const results: MatchedPickResult[] = [];

  // Helper to test if an AI tool matches the goal
  const matchesGoalAi = (tool: AiTool): boolean => {
    switch (goal) {
      case 'video-generation':
        return (
          tool.category === 'video' ||
          Boolean(tool.generationTasks?.some((t) => t.includes('video') || t === 'avatar-video')) ||
          Boolean(tool.outputModalities?.includes('video'))
        );
      case 'image-generation':
        // Must produce images, never video, never coding tools, never general assistants
        if (
          tool.category === 'video' ||
          tool.category === 'coding' ||
          tool.category === 'assistants' ||
          (tool.outputModalities?.includes('video') && !tool.outputModalities?.includes('image'))
        ) {
          return false;
        }
        if (taskDetail === 'image-editing') {
          return (
            tool.category === 'image' &&
            (Boolean(tool.generationTasks?.includes('image-editing')) ||
              tool.features.some((f) => f.toLowerCase().includes('canvas') || f.toLowerCase().includes('inpainting') || f.toLowerCase().includes('editing')) ||
              tool.tags.some((t) => t.includes('editing')))
          );
        }
        return (
          tool.category === 'image' ||
          Boolean(tool.generationTasks?.some((t) => t === 'text-to-image' || t === 'image-editing')) ||
          Boolean(tool.outputModalities?.includes('image'))
        );
      case 'chat-research':
      case 'write-copy':
        // Exclude dedicated code editors and serving engines from general conversational chat
        if (tool.category === 'coding' && (taskDetail === 'all-chat' || taskDetail === 'reasoning' || taskDetail === 'research')) {
          return false;
        }
        if (taskDetail === 'all-chat' && tool.category === 'productivity' && !tool.tags.includes('chat')) {
          return false;
        }
        return (
          tool.category === 'assistants' ||
          tool.category === 'productivity' ||
          tool.category === 'writing' ||
          Boolean(tool.generationTasks?.includes('chat') || tool.generationTasks?.includes('research'))
        );
      case 'coding-dev':
      case 'build-app':
        if (taskDetail === 'ide-editor') {
          return (
            tool.category === 'coding' &&
            (tool.tags.includes('ide') || tool.tags.includes('editor'))
          );
        }
        return (
          tool.category === 'coding' ||
          Boolean(tool.generationTasks?.includes('coding-assistant'))
        );
      case 'voice-music':
        return (
          tool.category === 'voice' ||
          tool.category === 'music' ||
          Boolean(tool.generationTasks?.some((t) => t.includes('speech') || t.includes('music'))) ||
          Boolean(tool.outputModalities?.includes('audio'))
        );
      case 'workflow-automation':
      case 'automate-workflows':
        return (
          tool.category === 'automation' ||
          Boolean(tool.generationTasks?.includes('automation'))
        );
      case 'create-media':
        // If taskDetail specifies video, only allow video
        if (taskDetail?.includes('video')) {
          return tool.category === 'video' || Boolean(tool.generationTasks?.some((t) => t.includes('video')));
        }
        return tool.category === 'video' || tool.category === 'image';
      default:
        return false;
    }
  };

  // Helper to test if an open source tool matches the goal
  const matchesGoalOs = (tool: Tool): boolean => {
    switch (goal) {
      case 'open-source-software':
        return true;
      case 'coding-dev':
      case 'build-app':
        return tool.categories.includes('developer-tools');
      case 'workflow-automation':
      case 'automate-workflows':
        return tool.slug === 'n8n' || tool.slug === 'activepieces' || tool.categories.includes('developer-tools');
      case 'notes-wiki':
        return tool.categories.includes('productivity');
      case 'create-media':
        return tool.categories.includes('design-media');
      default:
        // By default, open-source tools NEVER match pure AI video/image/voice requests unless requested specifically
        return false;
    }
  };

  // Helper to check budget constraint for AI tools
  const matchesBudgetAi = (tool: AiTool): boolean => {
    if (budget === 'any') return true;
    if (budget === 'completely-free') {
      // Must have recurring free allowance or be 100% free / open-source; exclude one-time trial credits
      if (
        tool.freeAccessType === 'limited-free' ||
        tool.pricingType === 'free-trial' ||
        (tool.pricingType === 'free-credits' && !tool.freeTierSummary.toLowerCase().includes('daily') && !tool.freeTierSummary.toLowerCase().includes('monthly'))
      ) {
        return false;
      }
      return (
        tool.pricingType === 'free' ||
        tool.freeAccessType === 'recurring-free' ||
        tool.freeAccessType === 'open-source-local'
      );
    }
    if (budget === 'free-credits') {
      return (
        tool.freeAccessType === 'free-credits' ||
        tool.freeAccessType === 'recurring-free' ||
        tool.pricingType === 'free-credits'
      );
    }
    if (budget === 'free-trial') {
      return (
        tool.pricingType === 'free-trial' ||
        tool.pricingType === 'free-credits' ||
        tool.freeAccessType === 'free-credits' ||
        tool.freeAccessType === 'limited-free' ||
        tool.hasFreePlan
      );
    }
    if (budget === 'self-hosted') {
      return Boolean(tool.isSelfHostable || tool.freeAccessType === 'open-source-local');
    }
    return true;
  };

  // Helper to check hosting constraint for AI tools
  const matchesHostingAi = (tool: AiTool): boolean => {
    if (hostingPreference === 'any') return true;
    if (hostingPreference === 'local') {
      return Boolean(tool.isSelfHostable || tool.freeAccessType === 'open-source-local' || tool.requiresInstallation);
    }
    if (hostingPreference === 'browser') {
      // Exclude pure command-line or local weights if they lack a web hosted version
      return !tool.requiresInstallation;
    }
    return true;
  };

  // Helper to check watermark constraint for AI tools
  const scoreWatermarkAi = (tool: AiTool): number => {
    if (watermarkPreference !== 'no-watermark') return 0;
    const limits = (tool.freeTierLimits || '').toLowerCase();
    const details = (tool.pricingDetails || '').toLowerCase();
    if (limits.includes('watermark') || details.includes('watermark')) {
      return -30;
    }
    if (tool.pricingType === 'free' || tool.freeAccessType === 'open-source-local') {
      return 20;
    }
    return 10;
  };

  // 1. Evaluate AI Tools candidate pool
  if (goal !== 'open-source-software' && goal !== 'browser-utilities' && goal !== 'notes-wiki') {
    aiToolsData.forEach((tool) => {
      // Hard constraint elimination: MUST match goal
      if (!matchesGoalAi(tool)) return;

      // Hard constraint elimination: MUST match budget
      if (!matchesBudgetAi(tool)) return;

      // Hard constraint elimination: MUST match hosting
      if (!matchesHostingAi(tool)) return;

      let score = 30;
      const reasons: string[] = [];

      // Task detail bonus
      if (taskDetail === 'all-chat' && tool.category === 'assistants') {
        score += 35;
        reasons.push('Conversational assistant with multi-turn dialog and general reasoning');
      } else if (taskDetail && taskDetail !== 'all-video' && taskDetail !== 'all-image' && taskDetail !== 'all-chat') {
        const detailNormalized = taskDetail.toLowerCase();

        // Check specific task matches
        if (detailNormalized === 'ide-editor') {
          if (tool.category === 'coding' && (tool.tags.includes('ide') || tool.tags.includes('editor'))) {
            score += 45;
            reasons.push('AI-first code editor with deep repository indexing');
          }
        } else if (detailNormalized === 'reasoning') {
          if (tool.tags.includes('reasoning') || tool.features.some((f) => f.toLowerCase().includes('reasoning'))) {
            score += 40;
            reasons.push('Features chain-of-thought mathematical and logical reasoning');
          }
        } else if (detailNormalized === 'research') {
          if (tool.category === 'productivity' || tool.tags.includes('research') || tool.tags.includes('citations')) {
            score += 40;
            reasons.push('Directly provides live web search and bibliographic citations');
          }
        } else if (detailNormalized === 'image-editing') {
          if (tool.generationTasks?.includes('image-editing') || tool.tags.includes('editing')) {
            score += 40;
            reasons.push('Specialized image inpainting, canvas expansion, and editing');
          }
        } else {
          const matchesTask =
            tool.generationTasks?.some((t) => t.toLowerCase() === detailNormalized) ||
            tool.tags.some((tag) => tag.toLowerCase().includes(detailNormalized)) ||
            tool.features.some((f) => f.toLowerCase().includes(detailNormalized));

          if (matchesTask) {
            score += 35;
            reasons.push(`Tailored specifically for ${taskDetail.replace(/-/g, ' ')}`);
          }
        }
      }

      // Budget scoring
      if (budget === 'completely-free') {
        if (tool.pricingType === 'free' || tool.freeAccessType === 'open-source-local') {
          score += 25;
          reasons.push('100% Free with zero subscription or generation charges');
        } else if (tool.freeAccessType === 'recurring-free') {
          score += 20;
          reasons.push('Includes recurring free allowance refreshed automatically');
        }
      } else if (budget === 'free-credits') {
        if (tool.freeTierSummary.toLowerCase().includes('daily') || tool.freeTierLimits.toLowerCase().includes('daily')) {
          score += 30;
          reasons.push('Generous daily check-in credits to generate without upfront payment');
        } else if (tool.freeTierSummary.toLowerCase().includes('monthly') || tool.freeTierLimits.toLowerCase().includes('monthly')) {
          score += 20;
          reasons.push('Recurring monthly free allowance');
        } else {
          score += 10;
          reasons.push('Starter test credits provided');
        }
      } else if (budget === 'free-trial') {
        if (tool.pricingType === 'free-trial' || tool.freeAccessType === 'limited-free' || tool.freeAccessType === 'free-credits') {
          score += 35;
          reasons.push('Starter trial credits available without recurring commitment');
        }
      } else if (budget === 'self-hosted') {
        if (tool.isSelfHostable || tool.freeAccessType === 'open-source-local') {
          score += 30;
          reasons.push('Open weights running locally on consumer hardware (zero API fees)');
        }
      }

      // Watermark scoring
      const watermarkAdj = scoreWatermarkAi(tool);
      score += watermarkAdj;
      if (watermarkPreference === 'no-watermark' && watermarkAdj > 0) {
        reasons.push('Provides watermark-free output on verified tier');
      }

      // Quality rating bonus
      score += Math.round((tool.rating || 4.5) * 4);

      if (tool.isFeatured) score += 5;
      if (tool.isTrending) score += 5;

      // Construct detailed explanation
      const explanation =
        reasons.length > 0
          ? `${tool.name}: ${reasons.join('. ')}.`
          : `${tool.name}: Verified ${tool.category} tool with ${tool.freeTierSummary}`;

      const tasks = tool.generationTasks ? tool.generationTasks.map((t) => t.replace(/-/g, ' ')) : [tool.category];

      results.push({
        tool,
        type: 'ai',
        matchScore: Math.min(100, Math.max(10, score)),
        matchExplanation: explanation,
        matchReasons: reasons.length ? reasons : [tool.tagline],
        tasks,
        freeAccessSummary: tool.freeTierSummary,
        websiteUrl: tool.websiteUrl,
        detailUrl: `/ai-tools/${tool.slug}`,
        pricingVerifiedAt: tool.pricingVerifiedAt,
      });
    });
  }

  // 2. Evaluate Open Source Software candidate pool
  if (goal === 'open-source-software' || goal === 'coding-dev' || goal === 'workflow-automation' || goal === 'build-app' || goal === 'notes-wiki') {
    toolsData.forEach((tool) => {
      // Hard constraint elimination: MUST match goal
      if (!matchesGoalOs(tool)) return;

      // If budget asked for free-credits, open-source self-hosted has no credit concept
      if (budget === 'free-credits') return;

      let score = 55;
      const reasons: string[] = ['100% Free & Open-Source software with transparent codebase'];

      if (budget === 'completely-free' || budget === 'self-hosted') {
        score += 25;
        reasons.push('Zero licensing or subscription costs; self-hostable with Docker');
      }

      if (taskDetail) {
        const matchesCategory = tool.categories.some((c) => c.toLowerCase().includes(taskDetail.toLowerCase()));
        const matchesDesc = tool.description.toLowerCase().includes(taskDetail.toLowerCase()) || tool.tagline.toLowerCase().includes(taskDetail.toLowerCase());
        if (matchesCategory || matchesDesc) {
          score += 30;
          reasons.push(`Direct replacement for proprietary ${taskDetail.replace(/-/g, ' ')} solutions`);
        }
      }

      if (hostingPreference === 'local' && tool.isSelfHostable) {
        score += 15;
        reasons.push('Full local deployment support with complete data privacy');
      }

      score += Math.min(15, Math.round(tool.stars / 5000));

      const explanation = `${tool.name} is a top open-source solution. ${reasons.join('. ')}.`;

      results.push({
        tool,
        type: 'open-source',
        matchScore: Math.min(100, score),
        matchExplanation: explanation,
        matchReasons: reasons,
        tasks: tool.categories.map((c) => c.replace(/-/g, ' ')),
        freeAccessSummary: 'Free & Open Source (Self-Hostable)',
        websiteUrl: tool.websiteUrl,
        detailUrl: `/tools/${tool.slug}`,
        pricingVerifiedAt: tool.verifiedAt,
      });
    });
  }

  // 3. Evaluate Browser Utilities candidate pool
  if (goal === 'browser-utilities') {
    freeToolsData.forEach((util) => {
      if (budget === 'self-hosted' || hostingPreference === 'local') return;

      let score = 65;
      const reasons: string[] = ['100% Free browser utility running locally in your browser'];

      if (taskDetail) {
        if (util.category.toLowerCase().includes(taskDetail.toLowerCase()) || util.slug.includes(taskDetail)) {
          score += 30;
          reasons.push(`Specialized ${util.name} tool`);
        }
      }

      results.push({
        tool: util as unknown as Tool,
        type: 'utility',
        matchScore: score,
        matchExplanation: `${util.name}: ${util.tagline}. Runs 100% client-side with zero data tracking.`,
        matchReasons: reasons,
        tasks: [util.category, 'browser-utility'],
        freeAccessSummary: 'Free In-Browser Utility (No Login Required)',
        websiteUrl: `/free-tools/${util.slug}`,
        detailUrl: `/free-tools/${util.slug}`,
        pricingVerifiedAt: '2026-10-18',
      });
    });
  }

  // Sort by matchScore descending, break ties with rating/stars
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    const aRating = (a.tool as AiTool).rating || 0;
    const bRating = (b.tool as AiTool).rating || 0;
    return bRating - aRating;
  });

  return results.slice(0, 6);
}
