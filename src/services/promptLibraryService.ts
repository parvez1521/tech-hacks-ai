import type { PromptItem } from '../types/index.ts';

export async function fetchPublishedPrompts(slug?: string): Promise<PromptItem[]> {
  try {
    const query = new URLSearchParams();
    if (slug) query.set('slug', slug);
    const response = await fetch(`/api/prompts${query.size ? `?${query}` : ''}`);
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.prompts) ? payload.prompts : [];
  } catch {
    return [];
  }
}
