import { aiToolsData, aiCategories } from '../data/aiToolsData.ts';
import { guidesData, guideCategories } from '../data/guidesData.ts';
import { promptsData, promptCategories } from '../data/promptsData.ts';
import { freeToolsData } from '../data/freeToolsData.ts';
import { toolsData } from '../data/seedData.ts';
import { proprietaryTools } from '../data/alternatives.ts';
import type { AiTool, AiFilterState, Guide, PromptItem, FreeToolUtility, Tool, ProprietaryTool, PickCriteria, MatchedPickResult } from '../types/index.ts';

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
        return (
          tool.category === 'image' ||
          Boolean(tool.generationTasks?.some((t) => t.includes('image'))) ||
          Boolean(tool.outputModalities?.includes('image'))
        );
      case 'chat-research':
      case 'write-copy':
        return (
          tool.category === 'assistants' ||
          tool.category === 'productivity' ||
          tool.category === 'writing' ||
          Boolean(tool.generationTasks?.includes('chat') || tool.generationTasks?.includes('research'))
        );
      case 'coding-dev':
      case 'build-app':
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

      let score = 50;
      const reasons: string[] = [];

      // Task detail bonus
      if (taskDetail && taskDetail !== 'all-video' && taskDetail !== 'all-image' && taskDetail !== 'all-chat') {
        const matchesTask =
          tool.generationTasks?.some((t) => t.toLowerCase() === taskDetail.toLowerCase()) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(taskDetail.toLowerCase())) ||
          tool.features.some((f) => f.toLowerCase().includes(taskDetail.toLowerCase()));

        if (matchesTask) {
          score += 35;
          reasons.push(`Tailored specifically for ${taskDetail.replace(/-/g, ' ')}`);
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
        } else {
          score += 15;
          reasons.push('Starter test credits provided');
        }
      } else if (budget === 'self-hosted') {
        if (tool.isSelfHostable) {
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
          ? `${tool.name} ${reasons.join('. ')}.`
          : `${tool.name} delivers verified ${tool.category} capabilities with ${tool.freeTierSummary}`;

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
