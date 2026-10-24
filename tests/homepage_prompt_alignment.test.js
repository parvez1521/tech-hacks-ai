import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { getPromptBySlug } from '../src/services/aiCatalogService.ts';

let appModule;
const root = process.cwd();

before(async () => {
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
  appModule = await import('../dist/test-ssr.js');
});

describe('Homepage prompt showcase and section alignment', () => {
  it('orders hero, dynamic metric strip, alternatives, goals, picks, and discoveries', () => {
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(appModule.App));
    const positions = [
      html.indexOf('class="hero-shell'),
      html.indexOf('data-testid="catalog-trust-strip"'),
      html.indexOf('data-testid="ai-alternatives-section"'),
      html.indexOf('What do you want to build or replace today?'),
      html.indexOf('Editor&#x27;s Picks: Benchmark-Leading Tools'),
      html.indexOf('Tools worth a closer look'),
    ];
    assert.ok(positions.every((position) => position >= 0));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions);
    assert.equal((html.match(/data-testid="catalog-trust-strip"/g) || []).length, 1);
    assert.equal((html.match(/data-testid="ai-alternatives-section"/g) || []).length, 1);
    const home = fs.readFileSync(path.join(root, 'src/pages/HomePage.tsx'), 'utf8');
    assert.match(home, /AnimatedCount className="catalog-metric-card__number" value=\{catalogStats\.proprietaryToolsWithAlternatives\}/);
    assert.match(home, /AnimatedCount className="catalog-metric-card__number" value=\{catalogStats\.imagePrompts\}/);
    assert.match(home, /AnimatedCount className="catalog-metric-card__number" value=\{catalogStats\.videoPrompts\}/);
    assert.match(home, /AnimatedCount className="catalog-metric-card__number" value=\{catalogStats\.browserUtilities\}/);
  });

  it('renders a five-step guide, exactly two matching original portraits, and valid library links', () => {
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(appModule.App));
    const home = fs.readFileSync(path.join(root, 'src/pages/HomePage.tsx'), 'utf8');
    assert.equal((html.match(/class="prompt-workflow__step"/g) || []).length, 5);
    assert.ok(html.includes('Choose a prompt') && html.includes('Customize the details') && html.includes('Select an AI tool') && html.includes('Generate and refine') && html.includes('Save and reuse'));

    const women = getPromptBySlug('pixverse-cinematic-portrait-motion');
    const man = getPromptBySlug('higgsfield-dolly-zoom-vertigo-effect');
    assert.ok(women && man, 'Both prompt detail records remain available');
    for (const prompt of [women, man]) {
      assert.ok(prompt.previewImage);
      assert.ok(fs.existsSync(path.join(root, 'public', prompt.previewImage.replace(/^\//, ''))), `${prompt.previewImage} exists locally`);
      assert.ok(fs.existsSync(path.join(root, 'src/pages/PromptDetailPage.tsx')), 'Prompt detail route implementation remains present');
      assert.ok(home.includes(`prompt.slug === '${prompt.slug}'`));
      assert.ok(html.includes(`href="/prompt-library/${prompt.slug}"`));
    }
    assert.equal((html.match(/class="prompt-portrait-card"/g) || []).length, 2);
    assert.match(html, /alt="A fictional adult Black woman in a cobalt jacket on a rooftop at blue hour[^"]*"/);
    assert.match(html, /alt="A fictional man stands in a dark hallway with distorted perspective[^"]*"/);
    assert.ok(html.includes('src="/prompts/generated/pixverse-motion-portrait-poster.webp"'));
    assert.ok(html.includes('src="/prompts/generated/higgsfield-dolly-zoom-vertigo-effect.webp"'));
    assert.ok(fs.existsSync(path.join(root, 'public/prompts/generated/pixverse-motion-portrait-poster.webp')));
    assert.ok(fs.existsSync(path.join(root, 'public/prompts/generated/higgsfield-dolly-zoom-vertigo-effect.webp')));
    assert.equal((html.match(/href="\/prompt-library"/g) || []).length, 1, 'Primary CTA links to the existing Prompt Library route');
    assert.match(home, /loading="lazy"[\s\S]*?decoding="async"/);
  });

  it('keeps the prompt showcase in a responsive two-column desktop and stacked mobile layout', () => {
    const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
    assert.match(css, /\.prompt-showcase-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.05fr\) minmax\(0, \.95fr\)/s);
    assert.match(css, /\.prompt-portrait-card\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
    assert.match(css, /\.prompt-portrait-card img\s*\{[^}]*object-fit:\s*cover/s);
    assert.match(css, /@media \(max-width: 899px\)\s*\{\s*\.prompt-showcase-grid\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/s);
    assert.match(css, /prefers-reduced-motion: reduce/);
  });

  it('uses the matching original single-subject portrait as the first Prompt Library feature', async () => {
    const { promptsData } = await import('../src/data/promptsData.ts');
    const featured = promptsData.filter((prompt) => prompt.featured).sort((a, b) => a.featuredOrder - b.featuredOrder);
    assert.equal(featured[0]?.slug, 'portrait-women-windowlight');
    const library = fs.readFileSync(path.join(root, 'src/pages/PromptLibraryPage.tsx'), 'utf8');
    assert.match(library, /src="\/prompts\/generated\/portrait-woman-windowlight\.webp"/);
    assert.ok(fs.existsSync(path.join(root, 'public/prompts/generated/portrait-woman-windowlight.webp')));
  });
});
