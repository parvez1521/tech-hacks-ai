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
  it('orders the compact homepage discovery sections', () => {
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(appModule.App));
    const positions = ['home-hero-heading', 'collections-heading', 'categories-heading', 'task-categories-heading', 'discoveries-heading', 'offers-heading', 'resources-heading'].map((id) => html.indexOf('id="' + id + '"'));
    assert.ok(positions.every((position) => position >= 0));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions);
    assert.ok(html.includes('type="search"') || html.includes('role="combobox"'), 'Global search is in the hero');
    const home = fs.readFileSync(path.join(root, 'src/pages/HomePage.tsx'), 'utf8');
    const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
    assert.match(home, /featuredCollections/);
    assert.match(home, /href: '\/frontier-models'/);
    assert.match(home, /href: '\/free-ai-sites'/);
    assert.match(home, /href: '\/github-projects'/);
    assert.match(html, /Frontier access highlights/);
    assert.match(html, /GPT-6 Astra/);
    assert.match(html, /Claude Opus 5\.5/);
    assert.match(html, /Seedance 2\.0/);
    assert.match(html, /Seedance 2\.5/);
    assert.match(html, /Fable 5/);
    assert.match(html, /Fable 5\.1/);
    assert.match(html, /Free AI Video Models/);
    assert.match(html, /Google Flow/);
    assert.match(html, /PixVerse/);
    assert.match(html, /Viggle/);
    assert.match(html, /Bing/);
    assert.match(home, /category\.subcategories\.map/);
    assert.match(html, /Free &amp; Trial AI Video Generators/);
    assert.match(html, /AI Image Generators/);
    assert.match(html, /AI Voice &amp; Speech/);
    assert.match(html, /AI Coding Agents/);
    assert.match(html, /AI Research &amp; Search/);
    assert.match(html, /data-brand-slug="runway"/);
    assert.match(html, /data-brand-slug="dreamina"/);
    assert.match(html, /home-collection-card__visual/);
    assert.match(html, /home-category-card__art/);
    assert.match(html, /home-task-card__art/);
    assert.match(html, /home-resource-card__icon/);
    for (const asset of ['collection-frontier-models.svg', 'collection-free-video-models.svg', 'collection-all-tools.svg', 'collection-github-projects.svg', 'category-assistants.svg', 'category-writing.svg', 'category-image.svg', 'category-video.svg', 'category-voice.svg', 'category-music.svg', 'category-coding.svg', 'category-productivity.svg', 'category-automation.svg', 'category-design-3d.svg', 'task-video-generators.svg', 'task-image-generators.svg', 'task-voice-speech.svg', 'task-coding-agents.svg', 'task-research-search.svg', 'task-open-source-ai.svg']) {
      assert.ok(fs.existsSync(path.join(root, 'public/images/home', asset)), `Dedicated homepage art exists: ${asset}`);
      assert.ok(home.includes(`/images/home/${asset}`), `Homepage references dedicated art ${asset}`);
    }
    assert.match(home, /home-model-access-card__header/);
    assert.match(home, /home-model-access-card__badge/);
    assert.match(css, /home-model-access-card__badge\s*\{/);
    const videoPage = fs.readFileSync(path.join(root, 'src/pages/AiVideoToolsPage.tsx'), 'utf8');
    assert.match(videoPage, /searchParams\.get\('filter'\)/);
    assert.match(videoPage, /initialFilter === 'free-entry'/);
  });

  it('keeps the Prompt Library and its featured prompt assets available outside the homepage', () => {
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(appModule.App));
    const home = fs.readFileSync(path.join(root, 'src/pages/HomePage.tsx'), 'utf8');
    assert.ok(!home.includes('prompt-workflow__step'), 'Prompt workflow detail is not duplicated in the discovery homepage');
    assert.ok(html.includes('href="/guides"') || html.includes('href="/prompt-library"'), 'Homepage links to learning resources');

    const women = getPromptBySlug('pixverse-cinematic-portrait-motion');
    const man = getPromptBySlug('higgsfield-dolly-zoom-vertigo-effect');
    assert.ok(women && man, 'Both prompt detail records remain available');
    for (const prompt of [women, man]) {
      assert.ok(prompt.previewImage);
      assert.ok(fs.existsSync(path.join(root, 'public', prompt.previewImage.replace(/^\//, ''))), `${prompt.previewImage} exists locally`);
      assert.ok(fs.existsSync(path.join(root, 'src/pages/PromptDetailPage.tsx')), 'Prompt detail route implementation remains present');
      assert.ok(fs.existsSync(path.join(root, 'src/pages/PromptDetailPage.tsx')));
    }
    assert.ok(fs.existsSync(path.join(root, 'public/prompts/generated/pixverse-motion-portrait-poster.webp')));
    assert.ok(fs.existsSync(path.join(root, 'public/prompts/generated/higgsfield-dolly-zoom-vertigo-effect.webp')));
    assert.ok(home.includes('Guides & Prompt Library'));
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
