/**
 * Regression tests — /alternatives scroll performance (2026-11-21).
 *
 * User report: "Website bohot slow scroll ho raha hai alternatives waala
 * section bhot zyaada glitchy ho rha hai". Measured baseline (headless
 * Chromium, production build, 1440x900):
 * - 32,476 DOM nodes, 90,571px tall, 970 cards all in the DOM at once
 * - scripted scroll: 495 longtasks totalling 178,291ms in 9s, frames
 *   averaging 5,732ms (worst 31,082ms) — the page was effectively frozen
 * - 969/970 cards ended up ScrollMorph-tagged (.morph-reveal): each one a
 *   3D-transformed compositor layer + one IntersectionObserver entry +
 *   a getComputedStyle forced layout at tag time + a 0.7s flip + a 0.9s
 *   lightSweep on every reveal
 * - below-fold cards sit at opacity: 0 until their observer fires, so a
 *   fast scroll (or a busy main thread) shows the page background — the
 *   black area from the 2026-11-20 screenshot
 *
 * The fix (no visual redesign, no pagination):
 * 1. The alternatives grid carries data-no-reveal — ScrollMorph's own
 *    opt-out, so the 970 cards never get the flip, the observer entries,
 *    the forced layouts or the timeouts, and render visible immediately.
 * 2. .alternatives-grid > .interactive-card gets content-visibility: auto
 *    with contain-intrinsic-size: auto 260px (measured average card height
 *    259px), so off-screen cards skip layout/style/paint. Cards stay in
 *    the DOM: SEO, search/filter and find-in-page are unaffected.
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { proprietaryTools } from '../src/data/alternatives.ts';

const ROOT = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf-8');

function setupMockBrowser(url = 'https://switchroute.in/alternatives') {
  const parsed = new URL(url);
  global.window = {
    location: {
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      href: url,
      origin: parsed.origin,
    },
    history: { pushState: () => {}, replaceState: () => {} },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
  };
  global.document = {
    title: '',
    head: { appendChild: () => {} },
    body: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
    documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} }, setAttribute: () => {} },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
  };
}

describe('Alternatives scroll performance', () => {
  let ssrModule;
  let html;

  before(async () => {
    setupMockBrowser('https://switchroute.in/alternatives');
    ssrModule = await import('../dist/test-ssr.js');
    html = renderToString(React.createElement(ssrModule.App)).replace(/<!--.*?-->/g, '');
  });

  it('still renders all 970 proprietary targets (no pagination, no slicing)', () => {
    assert.strictEqual(proprietaryTools.length, 970, 'Catalog must still hold 970 targets');
    const cards = (html.match(/interactive-card/g) || []).length;
    assert.strictEqual(cards, 970, `Expected 970 rendered cards, found ${cards}`);
  });

  it('every target stays reachable via its detail link', () => {
    const slugs = new Set(
      [...html.matchAll(/href="\/alternatives\/([a-z0-9-]+)"/g)].map((m) => m[1]),
    );
    const catalogSlugs = new Set(proprietaryTools.map((t) => t.slug));
    assert.strictEqual(slugs.size, 970, `Expected 970 unique detail links, found ${slugs.size}`);
    for (const slug of catalogSlugs) {
      assert.ok(slugs.has(slug), `Detail link missing for ${slug}`);
    }
  });

  it('the grid opts out of ScrollMorph so cards render visible immediately', () => {
    assert.match(
      html,
      /<div[^>]*(?:class="[^"]*alternatives-grid[^"]*"[^>]*data-no-reveal|data-no-reveal[^>]*class="[^"]*alternatives-grid[^"]*")/,
      'The alternatives grid must carry data-no-reveal so ScrollMorph never tags its cards',
    );
  });

  it('AlternativesPage maps the full filtered list (no slice/limit on the grid)', () => {
    const src = read('src/pages/AlternativesPage.tsx');
    assert.ok(
      src.includes('filteredAlternatives.map((alt)'),
      'The grid must map the full filtered list',
    );
    assert.ok(
      !/filteredAlternatives\.slice\(/.test(src),
      'The grid must not slice the filtered list',
    );
    assert.ok(src.includes('data-no-reveal'), 'The grid must carry data-no-reveal');
    assert.ok(src.includes('alternatives-grid'), 'The grid must carry the alternatives-grid class');
  });

  it('ScrollMorph still honours the data-no-reveal opt-out', () => {
    const src = read('src/components/ScrollMorph.tsx');
    assert.ok(
      src.includes("[data-no-reveal]"),
      'ScrollMorph must keep the data-no-reveal escape hatch its opt-out relies on',
    );
    assert.ok(
      /closest\(['"]\.hero-aurora, \[data-no-reveal\]['"]\)/.test(src),
      'ScrollMorph must skip anything inside a [data-no-reveal] ancestor',
    );
  });

  it('index.css skips layout/paint for off-screen alternatives cards', () => {
    const css = read('src/index.css');
    const rule = css.match(/\.alternatives-grid\s*>\s*\.interactive-card\s*\{([^}]*)\}/);
    assert.ok(rule, 'index.css must define .alternatives-grid > .interactive-card');
    assert.ok(
      rule[1].includes('content-visibility: auto'),
      'Off-screen cards must use content-visibility: auto',
    );
    assert.ok(
      rule[1].includes('contain-intrinsic-size: auto 225px'),
      'Cards must reserve the measured average height (259px) minus the card p-4 + border (34px) Chrome adds on top, so the scrollbar stays stable',
    );
  });
});
