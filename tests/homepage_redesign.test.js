import { before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const read = (file) => fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
const exactHomeTitle = 'Another AI tool? Sure. Another Subscription? Nope.';
const extractedHomeTitle = (source) => source.match(/<h1 id="home-hero-heading"[\s\S]*?<\/h1>/)?.[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
let appModule;

function setupBrowser() {
  const parsedUrl = new URL('https://switchroute.in/');
  global.window = {
    innerWidth: 1440,
    location: { href: parsedUrl.href, origin: parsedUrl.origin, pathname: '/', search: '' },
    history: { pushState() {}, replaceState() {} },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
    scrollTo() {},
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
  };
  global.document = {
    title: '',
    querySelector: () => ({ setAttribute() {} }),
    querySelectorAll: () => [],
    documentElement: {
      classList: { toggle() {}, contains: () => false, add() {}, remove() {} },
      setAttribute() {},
      getAttribute: () => null,
      dataset: { theme: 'light' },
    },
    body: { classList: { toggle() {} } },
    addEventListener() {},
    removeEventListener() {},
  };
}

before(async () => {
  setupBrowser();
  appModule = await import('../dist/test-ssr.js');
});

describe('Premium homepage redesign regressions', () => {
  it('keeps global search in the product-led hero and links the core discovery collections', () => {
    const home = read('src/pages/HomePage.tsx');
    const visual = read('src/components/HeroSignalVisual.tsx');

    assert.equal(extractedHomeTitle(home), exactHomeTitle);
    assert.match(home, /<UniversalSearch \/>/);
    for (const route of ['/frontier-models', '/ai-video-tools', '/ai-tools', '/github-projects']) assert.ok(home.includes(`href: '${route}'`));
    assert.match(home, /<HeroSignalVisual \/>/);
    assert.match(visual, /getAllAiTools\(\)/);
    assert.match(visual, /isCommunityTool\(tool\)/);
    assert.match(visual, /type="search"/);
    assert.match(visual, /sampleQueries\[mode\]/);
    assert.match(visual, /aria-pressed=\{activeMode === mode\}/);
    assert.match(visual, /to=\{`\/ai-tools\/\$\{tool\.slug\}`\}/);
    assert.match(visual, /discovery-interface__empty/);
    assert.match(visual, /<BrandLogo/);
    assert.doesNotMatch(visual, /requestAnimationFrame|hero-visual__prism|hero-tilt-x|hero-scroll/);
  });

  it('avoids repeating catalog metrics as a large homepage section', () => {
    const home = read('src/pages/HomePage.tsx');
    const css = read('src/index.css');
    assert.doesNotMatch(home, /catalog-metric-card|catalog-trust-strip/);
    assert.match(home, /Choose a collection/);
    assert.match(home, /Browse by task/);
    assert.match(home, /Selected offers/);
    assert.ok(css.length > 0);
  });

  it('uses sourced brand marks or monogram fallbacks instead of discovery screenshot thumbnails', () => {
    const card = read('src/components/DailyDiscoveryCard.tsx');
    const data = JSON.parse(read('data/discoveries.json'));

    assert.match(card, /<BrandLogo/);
    assert.doesNotMatch(card, /discovery\.imageUrl|object-cover/);
    assert.match(card, /Added \{addedDate\}/);
    assert.match(card, /Visit website/);
    assert.doesNotMatch(card, /Verified Link|Verified website/);
    assert.ok(data.every((item) => item.createdAt), 'All published fixture dates remain intact');
  });

  it('keeps the home hero server-rendered and statically readable', () => {
    const home = read('src/pages/HomePage.tsx');
    assert.equal(extractedHomeTitle(home), exactHomeTitle);
    assert.match(home, /<UniversalSearch \/>/);
    assert.doesNotMatch(home, /LazyMotion|motionFeatures/);
  });

  it('renders a closed chat launcher by default and no invitation over content', () => {
    const html = ReactDOMServer.renderToString(React.createElement(appModule.App));
    assert.match(html, /data-testid="chat-launcher"/);
    assert.match(html, /aria-label="Open SwitchRoute assistant"/);
    assert.doesNotMatch(html, /data-testid="chat-dialog"/);
    assert.doesNotMatch(html, /Assistant welcome invitation/);
  });

  it('keeps the chat dialog modal, keyboard closable, and focus managed', () => {
    const chatbot = read('src/components/FloatingChatbot.tsx');
    assert.match(chatbot, /role="dialog"/);
    assert.match(chatbot, /aria-modal="true"/);
    assert.match(chatbot, /e\.key === 'Escape'/);
    assert.match(chatbot, /e\.key !== 'Tab'/);
    assert.match(chatbot, /launcherRef\.current\?\.focus\(\)/);
    assert.match(chatbot, /className="chat-overlay"/);
    assert.match(chatbot, /STARTER_PROMPTS/);
  });

  it('keeps the above-the-fold hero static without downloading optional Motion features', () => {
    const home = read('src/pages/HomePage.tsx');
    assert.doesNotMatch(home, /motionFeatures|LazyMotion|motion\/react-m/);
    assert.match(home, /<section[^>]+aria-labelledby="home-hero-heading"/);
    assert.match(home, /<h1 id="home-hero-heading"/);
    assert.match(home, /<UniversalSearch \/>/);
  });

  it('waits until Daily Discoveries approaches the viewport before fetching', () => {
    const discoveries = read('src/components/DailyDiscoveriesSection.tsx');
    assert.match(discoveries, /new IntersectionObserver/);
    assert.match(discoveries, /rootMargin: '600px 0px'/);
    assert.match(discoveries, /if \(shouldLoad\) void loadDiscoveries\(\)/);
    assert.match(discoveries, /typeof IntersectionObserver === 'undefined'[\s\S]*?setShouldLoad\(true\)/);
    assert.match(discoveries, /onClick=\{loadDiscoveries\}/);
  });
});
