import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getProprietaryToolBySlug, getToolDetailUrl } from '../src/services/catalogService.ts';
import { getAiToolBySlug } from '../src/services/aiCatalogService.ts';
import {
  MS_PER_HOUR,
  HOURLY_ALT_DISMISSAL_KEY,
  buildHourlyAlternativePairs,
  getDismissedEpochHour,
  getEpochHour,
  getHourlyAlternativePairs,
  saveDismissedEpochHour,
  selectHourlyAlternativePair,
  shouldShowHourlyAlternative,
} from '../src/lib/utilities/hourlyAlternative.ts';

/** In-memory Storage stand-in (Node has no localStorage). */
function createMemoryStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
  };
}

describe('Hourly free-alternative popup — pair-list integrity', () => {
  const pairs = getHourlyAlternativePairs();

  test('pair list is non-empty and built from real catalogue data', () => {
    assert.ok(pairs.length > 100, `expected a large pair list, got ${pairs.length}`);
    assert.equal(pairs.length, buildHourlyAlternativePairs().length, 'rebuild must be deterministic');
  });

  test('no paid-only AI tool is ever shown as a free alternative', () => {
    const midjourneyPairs = pairs.filter((pair) => pair.altSlug === 'midjourney');
    assert.equal(midjourneyPairs.length, 0, 'midjourney is pricingType paid + hasFreePlan false');
    for (const pair of pairs.filter((p) => p.altType === 'ai')) {
      const alt = getAiToolBySlug(pair.altSlug);
      assert.ok(alt, `AI alt ${pair.altSlug} must exist in aiToolsData`);
      assert.equal(alt.hasFreePlan, true, `AI alt ${pair.altSlug} must have a free plan`);
    }
  });

  test('no dangling target: every paid target has a live /alternatives page', () => {
    assert.equal(
      pairs.filter((pair) => pair.targetSlug === 'play-ht').length,
      0,
      'elevenlabs -> play-ht is dangling (play-ht is in neither catalogue)',
    );
    for (const pair of pairs) {
      assert.ok(
        getProprietaryToolBySlug(pair.targetSlug),
        `target ${pair.targetSlug} must be a proprietary tool`,
      );
      assert.equal(pair.targetUrl, `/alternatives/${pair.targetSlug}`);
    }
  });

  test('every free alternative has a live detail page (no dead links)', () => {
    for (const pair of pairs) {
      if (pair.altType === 'open-source') {
        // The gate: getToolDetailUrl() returns null without a live /tools page.
        assert.equal(pair.altUrl, getToolDetailUrl(pair.altSlug));
        assert.ok(pair.altUrl, `open-source alt ${pair.altSlug} must have a live /tools page`);
        assert.match(pair.altUrl, /^\/tools\/[a-z0-9-]+$/);
      } else {
        assert.ok(getAiToolBySlug(pair.altSlug), `AI alt ${pair.altSlug} must exist`);
        assert.equal(pair.altUrl, `/ai-tools/${pair.altSlug}`);
      }
    }
  });

  test('no duplicate (target, alternative) pairs', () => {
    const seen = new Set();
    for (const pair of pairs) {
      const key = `${pair.targetSlug}->${pair.altSlug}`;
      assert.ok(!seen.has(key), `duplicate pair: ${key}`);
      seen.add(key);
    }
  });

  test('badges match catalogue provenance', () => {
    for (const pair of pairs) {
      if (pair.altType === 'open-source') {
        assert.equal(pair.altBadge, 'Free · Open Source');
      } else {
        assert.equal(pair.altBadge, 'Free');
      }
    }
  });
});

describe('Hourly free-alternative popup — selector', () => {
  const pairs = getHourlyAlternativePairs();

  test('epoch-hour math: whole hours since the Unix epoch, timezone-independent', () => {
    assert.equal(MS_PER_HOUR, 3_600_000);
    // 2026-11-19T00:00:00Z = 1795046400000 ms -> epoch hour 498624.
    assert.equal(getEpochHour(Date.UTC(2026, 10, 19, 0, 0, 0)), 498624);
    assert.equal(getEpochHour(Date.UTC(2026, 10, 19, 1, 0, 0)), 498625);
    // Within the same hour, any minute/second maps to the same epoch hour.
    assert.equal(getEpochHour(Date.UTC(2026, 10, 19, 0, 59, 59)), 498624);
  });

  test('deterministic for a fixed hour', () => {
    const hour = 498624;
    const first = selectHourlyAlternativePair(hour, pairs);
    const second = selectHourlyAlternativePair(hour, pairs);
    assert.deepEqual(first, second);
    assert.ok(first);
  });

  test('changes across hours and wraps around the list', () => {
    const seen = new Set();
    for (let hour = 498624; hour < 498624 + pairs.length; hour += 1) {
      const pair = selectHourlyAlternativePair(hour, pairs);
      assert.ok(pair);
      seen.add(`${pair.targetSlug}->${pair.altSlug}`);
    }
    // One full cycle visits every pair exactly once.
    assert.equal(seen.size, pairs.length);
    assert.deepEqual(
      selectHourlyAlternativePair(498624 + pairs.length, pairs),
      selectHourlyAlternativePair(498624, pairs),
    );
  });

  test('negative / out-of-range hours still resolve inside the list', () => {
    assert.ok(selectHourlyAlternativePair(-1, pairs));
    assert.ok(selectHourlyAlternativePair(0, pairs));
  });
});

describe('Hourly free-alternative popup — dismissal', () => {
  test('dismissed hour suppresses, next hour shows again', () => {
    const storage = createMemoryStorage();
    const hour = 498624;
    assert.equal(getDismissedEpochHour(storage), null);
    assert.equal(shouldShowHourlyAlternative(hour, getDismissedEpochHour(storage)), true);

    saveDismissedEpochHour(storage, hour);
    assert.equal(getDismissedEpochHour(storage), hour);
    assert.equal(shouldShowHourlyAlternative(hour, getDismissedEpochHour(storage)), false);
    // The very next hour shows again.
    assert.equal(shouldShowHourlyAlternative(hour + 1, getDismissedEpochHour(storage)), true);
    // Much later hours also show.
    assert.equal(shouldShowHourlyAlternative(hour + 24, getDismissedEpochHour(storage)), true);
  });

  test('corrupt or wrong-shaped stored values are ignored (never crash)', () => {
    const cases = [
      'not-json{',
      JSON.stringify({ epochHour: '498624', updatedAt: new Date().toISOString() }),
      JSON.stringify({ epochHour: 498624.5, updatedAt: new Date().toISOString() }),
      JSON.stringify({ epochHour: -1, updatedAt: new Date().toISOString() }),
      JSON.stringify({ epochHour: 498624, updatedAt: 'not-a-date' }),
      JSON.stringify({ updatedAt: new Date().toISOString() }),
      JSON.stringify(null),
      'null',
    ];
    for (const raw of cases) {
      const storage = createMemoryStorage({ [HOURLY_ALT_DISMISSAL_KEY]: raw });
      assert.equal(getDismissedEpochHour(storage), null, `should reject: ${raw}`);
    }
    // A throwing storage backend must not propagate.
    const throwing = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    };
    assert.equal(getDismissedEpochHour(throwing), null);
    assert.doesNotThrow(() => saveDismissedEpochHour(throwing, 498624));
    assert.equal(getDismissedEpochHour(null), null);
    assert.doesNotThrow(() => saveDismissedEpochHour(undefined, 498624));
  });

  test('saving twice keeps the latest dismissed hour', () => {
    const storage = createMemoryStorage();
    saveDismissedEpochHour(storage, 498624);
    saveDismissedEpochHour(storage, 498625);
    assert.equal(getDismissedEpochHour(storage), 498625);
  });
});
