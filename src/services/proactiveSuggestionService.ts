import { aiToolsData } from '../data/aiToolsData.ts';
import { toolsData } from '../data/seedData.ts';
import { getBrandLogo } from '../data/brandLogos.ts';

export interface ProactiveSuggestion {
  id: string;
  kind: 'prompt' | 'tool';
  title: string;
  prompt: string;
  description: string;
  href: string;
  tool?: {
    name: string;
    slug: string;
    type: 'ai' | 'open-source';
  };
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const PROACTIVE_SUGGESTION_STORAGE_KEY = 'techhacks_proactive_suggestion_id';

export const PROACTIVE_PROMPTS: ProactiveSuggestion[] = [
  {
    id: 'prompt-video-editing',
    kind: 'prompt',
    title: 'Find a free video tool',
    prompt: 'Looking for a free AI tool for video editing?',
    description: 'Compare recurring-free and self-hosted options for video work.',
    href: '/ai-tools?category=video',
  },
  {
    id: 'prompt-coding',
    kind: 'prompt',
    title: 'Discover AI coding tools',
    prompt: 'Show me useful AI tools for coding.',
    description: 'Find code editors, terminal agents, and open developer tools.',
    href: '/ai-tools?category=coding',
  },
  {
    id: 'prompt-alternative',
    kind: 'prompt',
    title: 'Replace an expensive subscription',
    prompt: 'Find an open-source alternative to an expensive software subscription.',
    description: 'Browse practical replacements with self-hosting and license details.',
    href: '/alternatives',
  },
  {
    id: 'prompt-creative',
    kind: 'prompt',
    title: 'Make images or videos',
    prompt: 'I need an AI tool to generate images or videos.',
    description: 'Start with verified creative platforms and clear free-access notes.',
    href: '/free-ai-sites',
  },
  {
    id: 'prompt-discovery',
    kind: 'prompt',
    title: 'Find a less-known productivity tool',
    prompt: 'Help me discover a lesser-known productivity tool.',
    description: 'Explore focused tools beyond the usual software shortlist.',
    href: '/collections/latest',
  },
  {
    id: 'prompt-compare',
    kind: 'prompt',
    title: 'Compare before choosing',
    prompt: 'Compare tools before I choose one.',
    description: 'Put a few products side by side using the comparison workspace.',
    href: '/compare',
  },
];

function getBrowserStorage(): StorageLike | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function getVerifiedToolSuggestions(): ProactiveSuggestion[] {
  const aiSuggestions = aiToolsData
    .filter((tool) => {
      const logo = getBrandLogo(tool.slug);
      return (
        tool.platformStatus !== 'coming-soon' &&
        Boolean(tool.slug && tool.name && tool.description && logo && logo.sourceType !== 'fallback')
      );
    })
    .map((tool) => ({
      id: `tool-ai-${tool.slug}`,
      kind: 'tool' as const,
      title: `Explore ${tool.name}`,
      prompt: `Tell me about ${tool.name} and its free access options.`,
      description: tool.tagline || tool.description,
      href: `/ai-tools/${tool.slug}`,
      tool: { name: tool.name, slug: tool.slug, type: 'ai' as const },
    }));

  const openSourceSuggestions = toolsData
    .filter((tool) => {
      const logo = getBrandLogo(tool.slug);
      return Boolean(tool.isVerified && tool.slug && tool.name && tool.tagline && logo && logo.sourceType !== 'fallback');
    })
    .map((tool) => ({
      id: `tool-open-source-${tool.slug}`,
      kind: 'tool' as const,
      title: `Explore ${tool.name}`,
      prompt: `Tell me about ${tool.name} and what it replaces.`,
      description: tool.tagline || tool.description,
      href: `/tools/${tool.slug}`,
      tool: { name: tool.name, slug: tool.slug, type: 'open-source' as const },
    }));

  return [...aiSuggestions, ...openSourceSuggestions];
}

export function getProactiveSuggestionPool(): ProactiveSuggestion[] {
  return [...PROACTIVE_PROMPTS, ...getVerifiedToolSuggestions()];
}

/**
 * Select one local, actionable suggestion without making a network request.
 * The previous id is persisted only to keep consecutive page loads varied.
 */
export function selectProactiveSuggestion(options: {
  random?: () => number;
  previousId?: string;
  storage?: StorageLike;
} = {}): ProactiveSuggestion {
  const pool = getProactiveSuggestionPool();
  const storage = options.storage ?? getBrowserStorage();
  let previousId = options.previousId;

  if (!previousId && storage) {
    try {
      previousId = storage.getItem(PROACTIVE_SUGGESTION_STORAGE_KEY) ?? undefined;
    } catch {
      previousId = undefined;
    }
  }

  const eligible = pool.length > 1 ? pool.filter((suggestion) => suggestion.id !== previousId) : pool;
  const random = options.random ?? Math.random;
  const index = Math.min(eligible.length - 1, Math.max(0, Math.floor(random() * eligible.length)));
  const selected = eligible[index] ?? PROACTIVE_PROMPTS[0];

  if (storage) {
    try {
      storage.setItem(PROACTIVE_SUGGESTION_STORAGE_KEY, selected.id);
    } catch {
      // Private browsing and strict storage policies should not block the assistant.
    }
  }

  return selected;
}
