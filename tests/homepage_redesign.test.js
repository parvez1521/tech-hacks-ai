import { before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const read = (file) => fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
let appModule;

function setupBrowser() {
  const parsedUrl = new URL('https://techhacksai.com/');
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
  it('keeps the working universal search beside an interactive, branded discovery preview', () => {
    const home = read('src/pages/HomePage.tsx');
    const visual = read('src/components/HeroSignalVisual.tsx');

    assert.match(home, /Find the right tools for the work\./);
    assert.match(home, /<UniversalSearch \/>/);
    assert.match(home, /to="\/ai-tools"/);
    assert.match(home, /to="\/alternatives"/);
    assert.match(visual, /role="tablist"/);
    assert.match(visual, /aria-selected=\{activeMode === mode\}/);
    assert.match(visual, /<BrandLogo/);
    assert.match(visual, /useReducedMotion/);
    assert.doesNotMatch(visual, /requestAnimationFrame|hero-visual__prism|hero-tilt-x|hero-scroll/);
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

  it('loads Motion animation features after the initial render and honors reduced motion', () => {
    const home = read('src/pages/HomePage.tsx');
    const features = read('src/lib/motionFeatures.ts');
    assert.match(home, /import\('\.\.\/lib\/motionFeatures'\)/);
    assert.match(home, /useReducedMotion/);
    assert.match(features, /domAnimation/);
  });
});
