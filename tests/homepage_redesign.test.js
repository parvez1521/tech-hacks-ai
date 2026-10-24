import { before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const read = (file) => fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
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
  it('keeps the working universal search beside a live, catalog-backed discovery preview', () => {
    const home = read('src/pages/HomePage.tsx');
    const visual = read('src/components/HeroSignalVisual.tsx');

    assert.match(home, /YOUR AI TOOLKIT, ALL IN ONE PLACE/);
    const headlineLines = [...home.matchAll(/className="hero-redesign__headline-line(?: hero-redesign__headline-answer)?">([^<]+)<\/span>/g)].map((match) => match[1]);
    assert.deepEqual(headlineLines, ['Another AI tool?', 'Sure.', 'Another Subscription?', 'Nope.']);
    assert.match(home, /<h1 id="home-hero-heading" className="hero-redesign__headline">/);
    assert.match(home, /Discover paid AI alternatives, creative prompts, verified offers, and practical everyday tools—all in one place\./);
    assert.match(home, /<UniversalSearch \/>/);
    const search = read('src/components/UniversalSearch.tsx');
    assert.doesNotMatch(search, /intentChips|Make AI videos|Create images|Find writing tools|Replace proprietary SaaS|Discover prompts/);
    assert.match(home, /to="\/ai-tools"/);
    assert.match(home, /to="\/alternatives" className="hero-redesign__primary-action"/);
    assert.match(home, /to="\/free-tools" className="hero-redesign__secondary-action"/);
    assert.match(home, /<HeroSignalVisual \/>/);
    assert.match(visual, /getAllAiTools\(\)/);
    assert.match(visual, /isCommunityTool\(tool\)/);
    assert.match(visual, /type="search"/);
    assert.match(visual, /sampleQueries\[mode\]/);
    assert.match(visual, /aria-pressed=\{activeMode === mode\}/);
    assert.match(visual, /to=\{`\/ai-tools\/\$\{tool\.slug\}`\}/);
    assert.match(visual, /discovery-interface__empty/);
    assert.doesNotMatch(visual, /discoveryExamples|AI code editor|Generative video platform/);
    assert.match(visual, /<BrandLogo/);
    assert.doesNotMatch(visual, /requestAnimationFrame|hero-visual__prism|hero-tilt-x|hero-scroll/);
  });

  it('presents canonical catalog metrics as eight independent, responsive cards', () => {
    const home = read('src/pages/HomePage.tsx');
    const css = read('src/index.css');
    assert.equal((home.match(/className="catalog-metric-card"/g) || []).length, 8);
    for (const text of [
      'Paid tools with alternatives', 'Find replacement tools',
      'Alternative matches', 'Explore similar tools',
      'Active offers', 'Discover deals and discounts',
      'Image prompts', 'Ideas for AI images',
      'Video prompts', 'Prompts for AI videos',
      'Everyday utilities', 'Converters and useful tools',
      'AI tools', 'Explore AI platforms',
      'Open-source projects', 'Discover open projects',
    ]) assert.ok(home.includes(text), `metric text exists: ${text}`);
    assert.match(home, /getActiveOffers\(\)\.length/);
    assert.doesNotMatch(home, /Counts reflect distinct catalog records/);
    assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
    assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
    assert.match(css, /border: 1px solid rgb\(var\(--color-border\)/);
    assert.match(css, /background: rgb\(var\(--color-card\) \/ 0\.78\)/);
    assert.match(css, /\.catalog-trust-strip__metrics > article \{\s+display: flex;/);
    assert.match(css, /\.catalog-metric-card__number/);
    assert.ok(home.indexOf('data-testid="catalog-trust-strip"') > home.indexOf('</section>'), 'Metric cards follow the hero as a secondary discovery strip');
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
    assert.match(home, /<div className="hero-redesign__copy">/);
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
