import { before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import {
  filterAndSortAiTools,
  getAiAlternativesForTarget,
  getAiToolBySlug,
} from '../src/services/aiCatalogService.ts';
import { getProprietaryToolBySlug } from '../src/services/catalogService.ts';

let appModule;

function setHomeLocation() {
  const url = new URL('https://switchroute.in/');
  global.window = {
    innerWidth: 1440,
    location: { href: url.href, origin: url.origin, pathname: '/', search: '' },
    history: { pushState() {}, replaceState() {} },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    addEventListener() {}, removeEventListener() {}, dispatchEvent() {}, scrollTo() {},
    requestAnimationFrame: () => 1, cancelAnimationFrame() {},
  };
  global.document = {
    title: '', querySelector: () => ({ setAttribute() {} }), querySelectorAll: () => [],
    documentElement: { classList: { toggle() {}, contains: () => false, add() {}, remove() {} }, setAttribute() {}, getAttribute: () => null, dataset: { theme: 'dark' } },
    body: { classList: { toggle() {} } }, addEventListener() {}, removeEventListener() {},
  };
}

before(async () => {
  setHomeLocation();
  appModule = await import('../dist/test-ssr.js');
});

describe('Homepage AI alternatives showcase and Claude identity', () => {
  it('renames Claude without changing its catalog identity or genuine alternatives', () => {
    const claude = getAiToolBySlug('claude');
    assert.equal(claude.name, 'Claude');
    assert.equal(claude.id, 'claude');
    assert.equal(claude.slug, 'claude');
    assert.deepEqual(claude.alternativesTo.slice(0, 3), ['chatgpt', 'gemini', 'mistral-le-chat']);
    assert.deepEqual(getAiAlternativesForTarget('claude').slice(0, 3).map((tool) => tool.slug), ['chatgpt', 'gemini', 'mistral-le-chat']);
  });

  it('renders the metric cards directly after the hero and before the showcase, with six real targets and valid routes', () => {
    setHomeLocation();
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(appModule.App));
    const heroIndex = html.indexOf('class="hero-shell');
    const heroEndIndex = html.indexOf('</section>', heroIndex);
    const showcaseIndex = html.indexOf('FIND YOUR BETTER ALTERNATIVE');
    const showcaseSectionIndex = html.indexOf('data-testid="ai-alternatives-section"');
    const trustStripIndex = html.indexOf('data-testid="catalog-trust-strip"');
    const goalsIndex = html.indexOf('What do you want to build or replace today?');
    const picksIndex = html.indexOf('Editor&#x27;s Picks: Benchmark-Leading Tools');
    const discoveriesIndex = html.indexOf('Tools worth a closer look');
    const catalogIndex = html.indexOf('Explore Top Generative AI Platforms');
    const saasAlternativesIndex = html.indexOf('Open Source Alternatives to Popular Software');

    assert.ok(heroIndex >= 0 && heroIndex < heroEndIndex && heroEndIndex < trustStripIndex && trustStripIndex < showcaseSectionIndex, 'Metric cards follow the original two-column hero and precede the alternatives showcase');
    assert.ok(html.includes('href="/alternatives"'), 'Primary hero CTA opens the alternatives directory');
    assert.ok(html.includes('href="/free-tools"'), 'Utilities CTA opens the canonical Utility Tools directory');
    assert.ok(trustStripIndex < goalsIndex && goalsIndex < picksIndex && picksIndex < discoveriesIndex && discoveriesIndex < catalogIndex && catalogIndex < saasAlternativesIndex, 'Remaining homepage sections retain their requested order');
    assert.equal((html.match(/data-testid="ai-alternatives-card"/g) || []).length, 6, 'Exactly six showcase cards are rendered');
    assert.equal((html.match(/id="ai-alternatives-heading"/g) || []).length, 1, 'There is exactly one showcase on the homepage');
    assert.ok(html.includes('Love the tool. Not the price?'));
    assert.ok(html.includes('Discover AI alternatives that fit your budget, workflow, and privacy needs. Compare free options, open-source projects, and hosted tools.'));
    assert.ok(html.includes('Browse all alternatives'));
    assert.ok(html.includes('an AI alternative to Claude'));
    assert.ok(html.includes('href="/ai-tools/chatgpt"'));
    assert.ok(html.includes('href="/ai-tools/gemini"'));
    assert.ok(html.includes('href="/ai-tools/mistral-le-chat"'));
    assert.ok(html.includes('href="https://invideo.io/ai/"'));
    assert.ok(html.includes('href="/ai-tools/runway"'));
    assert.ok(html.includes('href="/ai-tools/pika"'));
    assert.ok(html.includes('href="/ai-tools?category=assistants&amp;alternativesTo=claude"'));
    for (const target of ['invideo-ai', 'runway', 'cursor', 'chatgpt']) {
      const category = target === 'cursor' ? 'coding' : ['invideo-ai', 'runway'].includes(target) ? 'video' : 'assistants';
      assert.ok(html.includes(`alternativesTo=${target}`), `${target} has a working filtered-catalog CTA`);
      assert.ok(html.includes(`href="/ai-tools?category=${category}&amp;alternativesTo=${target}"`));
    }
    assert.ok(html.includes('href="https://pictory.ai/"'));
    assert.ok(html.includes('href="/ai-tools?category=video&amp;alternativesTo=pictory"'));
    assert.ok(html.includes('src="/logos/claude.svg"'));
    assert.ok(html.includes('Open Source Alternatives to Popular Software'), 'Existing SaaS alternatives section remains present');
    assert.equal((html.match(/data-testid="catalog-trust-strip"/g) || []).length, 1, 'Homepage has exactly one dynamic counting section');
  });

  it('uses only catalog relationships and filters the existing AI directory by target', () => {
    const cursorAlternatives = getAiAlternativesForTarget('cursor').map((tool) => tool.slug);
    assert.deepEqual(cursorAlternatives.slice(0, 2), ['copilot', 'omnirush']);
    assert.ok(getAiToolBySlug('runway'));
    assert.ok(getProprietaryToolBySlug('invideo-ai'));
    assert.ok(getProprietaryToolBySlug('invideo-ai'), 'InVideo AI detail target is registered');
    assert.ok(getProprietaryToolBySlug('runway'), 'Runway detail target is registered');
    assert.ok(getProprietaryToolBySlug('pictory'), 'Pictory target is registered');
    assert.ok(getAiToolBySlug('chatgpt') && getAiToolBySlug('gemini') && getAiToolBySlug('mistral-le-chat'), 'Claude alternatives have valid AI detail routes');
    for (const target of ['claude', 'invideo-ai', 'runway', 'cursor', 'chatgpt', 'pictory']) {
      const alternatives = getAiAlternativesForTarget(target);
      assert.ok(alternatives.length > 0, `${target} has catalog-backed alternatives`);
      assert.ok(alternatives.every((tool) => getAiToolBySlug(tool.slug)), `${target} alternatives have valid AI detail routes`);
    }

    const result = filterAndSortAiTools({
      searchQuery: '', category: 'assistants', alternativesTo: 'claude', pricingType: 'all', sortBy: 'name_asc', page: 1,
    });
    const slugs = result.tools.map((tool) => tool.slug);
    for (const slug of ['chatgpt', 'gemini', 'mistral-le-chat']) assert.ok(slugs.includes(slug), `${slug} appears in Claude alternatives`);
  });

  it('uses a responsive card grid and keeps the prior homepage discovery sections', () => {
    const showcase = fs.readFileSync(path.resolve(process.cwd(), 'src/components/AiAlternativesShowcase.tsx'), 'utf8');
    assert.match(showcase, /grid-cols-1 auto-rows-fr sm:grid-cols-2 xl:grid-cols-3/);
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(appModule.App));
    assert.ok(html.includes('Daily Discoveries'));
    assert.ok(html.includes('Open Source Alternatives to Popular Software'));
  });
});
