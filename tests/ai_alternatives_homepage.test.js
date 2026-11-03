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

  it('renders the decluttered hero, featured collections, task categories, discoveries, offers, and resources', () => {
    setHomeLocation();
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(appModule.App));
    const home = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/HomePage.tsx'), 'utf8');
    assert.ok(html.includes('Another AI tool?'));
    assert.ok(html.includes('href="/frontier-models"') && html.includes('href="/free-ai-sites"') && html.includes('href="/ai-tools"') && html.includes('href="/github-projects"'));
    assert.ok(html.includes('Browse by task') && html.includes('Daily discoveries') && html.includes('Selected offers') && html.includes('Resources and directories'));
    assert.ok(home.indexOf('aria-labelledby="home-hero-heading"') < home.indexOf('aria-labelledby="collections-heading"'));
    assert.ok(home.indexOf('aria-labelledby="collections-heading"') < home.indexOf('aria-labelledby="categories-heading"'));
    assert.ok(home.indexOf('aria-labelledby="categories-heading"') < home.indexOf('aria-labelledby="discoveries-heading"'));
    assert.ok(home.indexOf('aria-labelledby="discoveries-heading"') < home.indexOf('aria-labelledby="offers-heading"'));
    assert.ok(home.indexOf('aria-labelledby="offers-heading"') < home.indexOf('aria-labelledby="resources-heading"'));
    assert.ok(!html.includes('data-testid="ai-alternatives-section"'), 'The full alternatives showcase is no longer duplicated on the homepage');
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
    assert.ok(html.includes('Daily discoveries'));
    assert.ok(html.includes('GitHub Projects'));
    assert.ok(html.includes('Browse offers'));
  });
});
