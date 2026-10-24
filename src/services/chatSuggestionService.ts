/** Selects a small set of prompt chips without allowing an empty UI state. */
export function pickRandomSuggestions(
  candidates: readonly string[],
  count = 4,
  random: () => number = Math.random,
): string[] {
  const pool = candidates.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const draw = random();
    const normalized = Number.isFinite(draw) ? Math.min(0.999999999, Math.max(0, draw)) : 0;
    const swapIndex = Math.floor(normalized * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, Math.max(0, count));
}

/** Uses a safe fallback when a selector, API response, or storage-backed choice is empty. */
export function suggestionsOrFallback(
  candidates: unknown,
  fallback: readonly string[],
  select: (items: readonly string[]) => unknown = (items) => items,
  limit = 4,
): string[] {
  const validFallback = fallback.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  try {
    const selected = select(Array.isArray(candidates) ? candidates.filter((item): item is string => typeof item === 'string') : []);
    const unique = Array.isArray(selected)
      ? [...new Set(selected.filter((item): item is string => typeof item === 'string' && item.trim().length > 0))]
      : [];
    const result = unique.length ? unique : validFallback;
    return result.slice(0, Math.max(0, limit));
  } catch {
    return validFallback.slice(0, Math.max(0, limit));
  }
}
