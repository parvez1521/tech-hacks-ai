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

const RECENT_PROMPTS_KEY = 'techhacks_recent_prompts';
export type RecentPrompt = { slug: string; title: string; previewImage?: string; viewedAt: string };

export function getRecentlyViewedPrompts(): RecentPrompt[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_PROMPTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.slug === 'string') : [];
  } catch { return []; }
}

export function recordPromptView(prompt: Pick<PromptItem, 'slug' | 'title' | 'previewImage'>): void {
  if (typeof window === 'undefined') return;
  try {
    const next = [{ ...prompt, viewedAt: new Date().toISOString() }, ...getRecentlyViewedPrompts().filter((item) => item.slug !== prompt.slug)].slice(0, 8);
    window.localStorage.setItem(RECENT_PROMPTS_KEY, JSON.stringify(next));
  } catch { /* Local history is optional when storage is unavailable. */ }
}

export async function fetchPromptCopyStats(): Promise<Array<{ slug: string; copyCount: number }>> {
  try {
    const response = await fetch('/api/prompt-stats');
    if (!response.ok) return [];
    const body = await response.json();
    return Array.isArray(body?.stats) ? body.stats : [];
  } catch { return []; }
}

export function recordPromptCopy(slug: string): void {
  fetch('/api/prompt-stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) }).catch(() => {});
}
