/**
 * Regression tests — ScrollMorph 3D flip on very tall cards.
 *
 * The prompt detail page's main card carries `shadow-invary-card`, so
 * ScrollMorph tags it, and the hidden state tilts it back -38deg around
 * its bottom edge under a 900px perspective. The perspective projection
 * goes singular at z = 900px, i.e. ~1,461px (900 / sin 38°) above the
 * block's bottom edge. The consolidated "5 Premium Website Prompts
 * (Part 1)" entry renders a ~11,000px-tall card, so during the 0.7s
 * flip its text was magnified into giant blurred glyphs sweeping up
 * the page, and its projected bounding box sat far down the page so
 * the IntersectionObserver never fired at scroll 0.
 *
 * The fix: ScrollMorph never tags blocks taller than the singularity
 * line — they stay fully visible with no reveal animation. A second
 * fix on the same page memoizes the prompt lookup so the
 * copy-stats effect (which depends on the prompt object) stops
 * re-running on every render.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf-8');

describe('ScrollMorph tall-card guard', () => {
  it('defines a height cap below the ~1,461px perspective singularity line', () => {
    const src = read('src/components/ScrollMorph.tsx');
    const match = src.match(/MAX_REVEAL_HEIGHT_PX\s*=\s*(\d+)/);
    assert.ok(match, 'ScrollMorph should define MAX_REVEAL_HEIGHT_PX');
    const cap = Number(match[1]);
    assert.ok(
      cap > 0 && cap < 1461,
      `Height cap should sit just under the ~1,461px singularity line, got ${cap}px`,
    );
  });

  it('skips tagging elements taller than the cap, before any reveal class is added', () => {
    const src = read('src/components/ScrollMorph.tsx');
    const guardAt = src.indexOf('offsetHeight > MAX_REVEAL_HEIGHT_PX');
    assert.ok(guardAt > -1, 'tag() should guard on offsetHeight vs MAX_REVEAL_HEIGHT_PX');
    const tagAt = src.indexOf("classList.add('morph-reveal')");
    assert.ok(tagAt > guardAt, 'The tall-element guard must run before the reveal class is added');
    const guardBlock = src.slice(guardAt, guardAt + 120);
    assert.ok(
      guardBlock.includes('return;') || guardBlock.includes('return'),
      'The tall-element guard should bail out of tagging',
    );
  });

  it('documents why tall blocks are skipped', () => {
    const src = read('src/components/ScrollMorph.tsx');
    assert.ok(
      /singularity/i.test(src),
      'ScrollMorph should document the perspective singularity reason for the cap',
    );
  });

  it('the consolidated premium-prompts entry is long enough to need the guard', () => {
    const src = read('src/data/promptsData.ts');
    const start = src.indexOf("slug: 'premium-website-prompts-part-1'");
    assert.ok(start > -1, 'Consolidated entry should exist in promptsData');
    const textStart = src.indexOf('promptText:', start);
    const textEnd = src.indexOf('`,', textStart);
    const length = textEnd - textStart;
    assert.ok(
      length > 10000,
      `Consolidated promptText should be very long (card ~11,000px tall), got ~${length} chars`,
    );
  });
});

describe('PromptDetailPage prompt lookup stability', () => {
  it('memoizes the prompt lookup on slug + remotePrompt', () => {
    const src = read('src/pages/PromptDetailPage.tsx');
    assert.ok(
      src.includes('useMemo'),
      'PromptDetailPage should use useMemo for the prompt lookup',
    );
    assert.ok(
      /useMemo\(\s*\(\)\s*=>\s*\(remotePrompt\?\.slug === slug \? remotePrompt : getPromptBySlug\(slug\)\),\s*\[slug, remotePrompt\]/.test(
        src,
      ),
      'The prompt lookup should be memoized on [slug, remotePrompt] so the [prompt] effect gets a stable reference',
    );
  });

  it('still fetches copy stats from the prompt effect', () => {
    const src = read('src/pages/PromptDetailPage.tsx');
    assert.ok(
      src.includes('fetchPromptCopyStats'),
      'The copy-stats fetch should remain in the prompt effect',
    );
    assert.ok(
      /},\s*\[prompt\]\);/.test(src),
      'The copy-stats effect should still depend on [prompt] (now referentially stable)',
    );
  });
});
