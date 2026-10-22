import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

describe('Phase 20: Restored focused hero and assistant branding', () => {
  let ssrModule;

  function setupMockBrowser(initialUrl = 'https://switchroute.in/') {
    const parsedUrl = new URL(initialUrl);
    global.window = {
      innerWidth: 1024,
      location: { href: parsedUrl.toString(), origin: parsedUrl.origin, pathname: parsedUrl.pathname, search: parsedUrl.search },
      history: { pushState: () => {}, replaceState: () => {} },
      localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
      addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => {}, scrollTo: () => {},
    };
    global.document = {
      title: '', querySelector: () => ({ setAttribute: () => {} }), querySelectorAll: () => [],
      documentElement: { classList: { toggle: () => {}, contains: () => false, add: () => {}, remove: () => {} }, setAttribute: () => {}, getAttribute: () => null },
      addEventListener: () => {}, removeEventListener: () => {},
    };
  }

  before(async () => { setupMockBrowser(); ssrModule = await import('../dist/test-ssr.js'); });

  test('HeroFloatingLogos is removed from the focused homepage hero', () => {
    const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
    const componentPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
    const content = fs.readFileSync(homePath, 'utf8');
    assert.ok(!fs.existsSync(componentPath), 'The unwanted orbit component is removed');
    assert.ok(!content.includes('HeroFloatingLogos'), 'HomePage does not import or render the orbit');
    assert.ok(content.includes('<HeroSignalVisual />'), 'The restrained non-logo hero visual remains');
    assert.ok(content.includes('<UniversalSearch />'), 'The real search remains in the hero');
  });

  test('Legacy prism, pointer, and scroll visual code is removed', () => {
    const css = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf8');
    const visual = fs.readFileSync(path.resolve(process.cwd(), 'src/components/HeroSignalVisual.tsx'), 'utf8');
    assert.ok(!css.includes('hero-visual__prism'), 'No CSS prism styles remain');
    assert.ok(!css.includes('hero-visual__halo'), 'No obsolete orbit treatment remains');
    assert.ok(!visual.includes('requestAnimationFrame'), 'Hero visual has no pointer or scroll render loop');
  });

  test('Assistant branding remains product-focused', () => {
    const chatbot = fs.readFileSync(path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx'), 'utf8');
    assert.ok(!chatbot.includes('Interactive 3D Assistant'));
    assert.ok(chatbot.includes('STARTER_PROMPTS'));
    assert.ok(chatbot.includes('aria-label="Open SwitchRoute assistant"'));
    assert.ok(!chatbot.includes('grounded 3D AI companion'));
  });

  test('HomePage renders hero and assistant without SSR exceptions', () => {
    setupMockBrowser('https://switchroute.in/');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
    assert.ok(html.includes("Stop paying for AI tools you don't need.") || html.includes("Stop paying for AI tools you don&#x27;t need."));
    assert.ok(html.includes('data-testid="chat-launcher"'));
    assert.ok(!html.includes('data-testid="chat-dialog"'));
  });
});
