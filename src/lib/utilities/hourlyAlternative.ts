/**
 * Hourly "Free Alternative" popup — pair list, deterministic hourly selector,
 * and dismissal persistence.
 *
 * Pair list (real catalogue data only, never hand-listed):
 * - Paid targets are the proprietary tools (`proprietaryTools`, 970). Every
 *   one has a live `/alternatives/:slug` page, which is where the paid row links.
 * - Free alternatives come from the same services the detail pages use:
 *   `getToolsForProprietary()` (open-source, free by licence) and
 *   `getAiToolsForProprietary()` filtered by `hasFreePlan` (mandatory — without
 *   it the two paid-only pairs `flux-1 -> midjourney` and
 *   `stable-diffusion-3 -> midjourney` would present Midjourney as "free").
 * - Only the linkable subset is kept: an open-source alternative must pass
 *   `getToolDetailUrl()` (null means no live `/tools/:slug` page — the
 *   2026-11-16 AdSense audit found 780 dead `/tools/*` links, so no new ones
 *   are emitted); an AI alternative links to its live `/ai-tools/:slug` page.
 * - AI-only targets (e.g. `deepseek`, `midjourney`) are NOT paid targets
 *   here: they have no `/alternatives/:slug` page, so the paid row could not
 *   link anywhere real. The dangling `elevenlabs -> play-ht` pair is excluded
 *   by the same rule (`play-ht` is in neither catalogue).
 * - Order is catalogue order (proprietary list order, then the service order
 *   within each target — open-source first, then AI), following the SwitchFlow
 *   editorial precedent of first-listed real replacement per target.
 *
 * Measured on the current catalogue: 376 linkable pairs across 172 targets
 * (208 open-source, 168 AI). Recompute with
 * `tests/hourly_alternative_popup.test.js` — the counts are asserted there.
 *
 * Rotation is deterministic per hour so every visitor sees the same pair in
 * the same hour: `epochHour = Math.floor(Date.now() / 3_600_000)`
 * (timezone-independent) and `pair = pairs[epochHour % pairs.length]`.
 */
import { proprietaryTools } from '../../data/alternatives.ts';
import { getToolsForProprietary, getToolDetailUrl } from '../../services/catalogService.ts';
import { getAiToolsForProprietary } from '../../services/aiCatalogService.ts';

export const MS_PER_HOUR = 3_600_000;

/** One paid -> free pair the popup can show, with both links pre-resolved. */
export interface HourlyAlternativePair {
  /** Paid target slug, e.g. 'notion'. */
  targetSlug: string;
  targetName: string;
  /** Always a live page: `/alternatives/:slug` for every proprietary target. */
  targetUrl: string;
  /** Free alternative slug, e.g. 'appflowy'. */
  altSlug: string;
  altName: string;
  altType: 'open-source' | 'ai';
  /** Live detail page: `/tools/:slug` (open-source) or `/ai-tools/:slug` (AI). */
  altUrl: string;
  /** Badge copy matching catalogue provenance. */
  altBadge: 'Free' | 'Free · Open Source';
}

/** Epoch hour for a timestamp: whole hours since the Unix epoch (UTC). */
export function getEpochHour(now: number | Date = Date.now()): number {
  const ms = now instanceof Date ? now.getTime() : now;
  return Math.floor(ms / MS_PER_HOUR);
}

/**
 * Build the full linkable paid -> free pair list from the live catalogues.
 * Pure (no I/O besides reading the imported data) and deterministic: the same
 * catalogue always yields the same list in the same order.
 */
export function buildHourlyAlternativePairs(): HourlyAlternativePair[] {
  const pairs: HourlyAlternativePair[] = [];
  for (const target of proprietaryTools) {
    const targetUrl = `/alternatives/${target.slug}`;
    for (const alt of getToolsForProprietary(target.slug)) {
      // Gate every /tools/:slug link: null means no live detail page.
      const altUrl = getToolDetailUrl(alt);
      if (!altUrl) continue;
      pairs.push({
        targetSlug: target.slug,
        targetName: target.name,
        targetUrl,
        altSlug: alt.slug,
        altName: alt.name,
        altType: 'open-source',
        altUrl,
        altBadge: 'Free · Open Source',
      });
    }
    for (const alt of getAiToolsForProprietary(target.slug)) {
      // Mandatory: only AI tools with a free plan may be shown as "free".
      if (!alt.hasFreePlan) continue;
      pairs.push({
        targetSlug: target.slug,
        targetName: target.name,
        targetUrl,
        altSlug: alt.slug,
        altName: alt.name,
        altType: 'ai',
        altUrl: `/ai-tools/${alt.slug}`,
        altBadge: 'Free',
      });
    }
  }
  return pairs;
}

let cachedPairs: HourlyAlternativePair[] | null = null;

/** Memoised pair list (built once per page load; the catalogues are static). */
export function getHourlyAlternativePairs(): HourlyAlternativePair[] {
  if (!cachedPairs) cachedPairs = buildHourlyAlternativePairs();
  return cachedPairs;
}

/**
 * Deterministic hourly pick: the same epoch hour always selects the same
 * pair, for every visitor. Returns null only when the pair list is empty.
 */
export function selectHourlyAlternativePair(
  epochHour: number,
  pairs: HourlyAlternativePair[] = getHourlyAlternativePairs(),
): HourlyAlternativePair | null {
  if (!pairs.length) return null;
  const index = ((epochHour % pairs.length) + pairs.length) % pairs.length;
  return pairs[index];
}

/** Convenience: the pair for a given moment (defaults to now). */
export function getHourlyAlternativePairForNow(
  now: number | Date = Date.now(),
): HourlyAlternativePair | null {
  return selectHourlyAlternativePair(getEpochHour(now));
}

// ---------------------------------------------------------------------------
// Dismissal persistence
// ---------------------------------------------------------------------------
//
// Closing the popup records the dismissed epoch hour in localStorage, so it
// stays closed until the next hour's pair. Shape mirrors the cookie-banner
// pattern: JSON with an `updatedAt` timestamp, validated on read, every
// access wrapped in try/catch (private browsing must never break the page).
// Key: `switchroute_hourly_alt_popup_dismissed`.

export const HOURLY_ALT_DISMISSAL_KEY = 'switchroute_hourly_alt_popup_dismissed';

export interface HourlyAltDismissal {
  /** The epoch hour (see getEpochHour) during which the popup was dismissed. */
  epochHour: number;
  updatedAt: string;
}

export type DismissalStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Validated read: returns the dismissed epoch hour, or null when absent/invalid. */
export function getDismissedEpochHour(
  storage: DismissalStorage | null | undefined,
): number | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(HOURLY_ALT_DISMISSAL_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const value = parsed as Partial<HourlyAltDismissal>;
    if (
      typeof value.epochHour !== 'number' ||
      !Number.isInteger(value.epochHour) ||
      value.epochHour < 0 ||
      typeof value.updatedAt !== 'string' ||
      Number.isNaN(Date.parse(value.updatedAt))
    ) {
      return null;
    }
    return value.epochHour;
  } catch {
    return null;
  }
}

/** Record a dismissal for the given epoch hour. Never throws. */
export function saveDismissedEpochHour(
  storage: DismissalStorage | null | undefined,
  epochHour: number,
): void {
  if (!storage) return;
  try {
    const record: HourlyAltDismissal = {
      epochHour,
      updatedAt: new Date().toISOString(),
    };
    storage.setItem(HOURLY_ALT_DISMISSAL_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage errors (e.g. private browsing).
  }
}

/**
 * Pure visibility rule: the popup may show for `epochHour` unless that exact
 * hour was already dismissed. A new hour always shows again.
 */
export function shouldShowHourlyAlternative(
  epochHour: number,
  dismissedEpochHour: number | null,
): boolean {
  return dismissedEpochHour !== epochHour;
}
