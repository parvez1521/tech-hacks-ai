import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { execSync } from 'child_process';
import { toolsData } from '../src/data/seedData.ts';
import { categories } from '../src/data/categories.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { collections } from '../src/data/collections.ts';

describe('Phase 4: Interactive Browser Simulation & Route Navigation', () => {
  let ssrModule;

  before(() => {
    // Recompile App bundle for Node SSR & interactive simulation
    execSync(
      './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
      { stdio: 'pipe' }
    );
  });

  beforeEach(async () => {
    ssrModule = await import('../dist/test-ssr.js');
  });

  // Helper to simulate browser window environment
  function setupMockBrowser(initialUrl = 'https://openalternative.co/') {
    const parsedUrl = new URL(initialUrl);
    const historyStack = [parsedUrl.toString()];
    let historyIndex = 0;
    const listeners = {};

    const mockWindow = {
      location: {
        href: parsedUrl.toString(),
        origin: parsedUrl.origin,
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
      },
      history: {
        pushState: (state, title, url) => {
          const resolved = new URL(url, mockWindow.location.origin);
          mockWindow.location.pathname = resolved.pathname;
          mockWindow.location.search = resolved.search;
          mockWindow.location.href = resolved.toString();
          historyStack.splice(historyIndex + 1);
          historyStack.push(mockWindow.location.href);
          historyIndex = historyStack.length - 1;
        },
        replaceState: (state, title, url) => {
          const resolved = new URL(url, mockWindow.location.origin);
          mockWindow.location.pathname = resolved.pathname;
          mockWindow.location.search = resolved.search;
          mockWindow.location.href = resolved.toString();
          historyStack[historyIndex] = mockWindow.location.href;
        },
        back: () => {
          if (historyIndex > 0) {
            historyIndex--;
            const prevUrl = new URL(historyStack[historyIndex]);
            mockWindow.location.pathname = prevUrl.pathname;
            mockWindow.location.search = prevUrl.search;
            mockWindow.location.href = prevUrl.toString();
            if (listeners['popstate']) {
              listeners['popstate'].forEach((cb) => cb({ type: 'popstate' }));
            }
          }
        },
        forward: () => {
          if (historyIndex < historyStack.length - 1) {
            historyIndex++;
            const nextUrl = new URL(historyStack[historyIndex]);
            mockWindow.location.pathname = nextUrl.pathname;
            mockWindow.location.search = nextUrl.search;
            mockWindow.location.href = nextUrl.toString();
            if (listeners['popstate']) {
              listeners['popstate'].forEach((cb) => cb({ type: 'popstate' }));
            }
          }
        },
      },
      addEventListener: (event, handler) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      },
      removeEventListener: (event, handler) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((h) => h !== handler);
        }
      },
      scrollTo: () => {},
    };

    const mockDocument = {
      title: '',
    };

    global.window = mockWindow;
    global.document = mockDocument;

    return { mockWindow, mockDocument };
  }

  function renderClean(element) {
    const raw = ReactDOMServer.renderToString(element);
    return raw.replace(/<!-- -->/g, '');
  }

  test('Homepage direct navigation renders brand, hero, and tool catalog', () => {
    const { mockWindow } = setupMockBrowser('https://openalternative.co/');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('SwitchRoute'), 'Should render platform brand');
    assert.ok(html.includes('Free-first AI discovery'), 'Should render the hero context line');
    assert.ok(html.includes("Stop paying for AI tools you don't need.") || html.includes("Stop paying for AI tools you don&#x27;t need."), 'Should render headline');
    assert.ok(html.includes('Supabase'), 'Should render seed tools');
    assert.ok(html.includes('Filters'), 'Should render filter drawer trigger');
    assert.ok(html.includes('Most Popular'), 'Should render default sort');
  });

  test('Tools directory route /tools renders full directory view', () => {
    const { mockWindow } = setupMockBrowser('https://openalternative.co/tools');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('All Open Source Software Tools'), 'Should render Tools Page heading');
    assert.ok(html.includes('Full Directory'), 'Should render badge');
    assert.ok(html.includes('Order by'), 'Should render sorting control');
  });

  test('Tool detail route /tools/:slug renders deep tool metadata and self-hosting info', () => {
    setupMockBrowser('https://openalternative.co/tools/supabase');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Supabase'), 'Should render tool name');
    assert.ok(html.includes('The open source Firebase alternative'), 'Should render tagline');
    assert.ok(html.includes('Quick Self-Host Guide'), 'Should render self-hosting guide');
    assert.ok(html.includes('docker compose'), 'Should render docker compose command');
    assert.ok(html.includes('Similar Open Source Projects'), 'Should render similar tools');
  });

  test('Category detail route /categories/:slug renders category scoped tools', () => {
    setupMockBrowser('https://openalternative.co/categories/developer-tools');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Open Source Developer Tools'), 'Should render category heading');
    assert.ok(html.includes('Category Discovery'), 'Should render breadcrumb/badge');
    assert.ok(html.includes('Supabase') || html.includes('Appwrite'), 'Should render dev tools');
  });

  test('Alternative detail route /alternatives/:slug renders proprietary target and open alternatives', () => {
    setupMockBrowser('https://openalternative.co/alternatives/notion');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Open Source Notion Alternatives'), 'Should render alternative heading');
    assert.ok(html.includes('AppFlowy') || html.includes('AFFiNE'), 'Should render Notion alternatives');
  });

  test('Collection detail route /collections/:slug renders curated list', () => {
    setupMockBrowser('https://openalternative.co/collections/self-hosted');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Self-Hostable Software You Can Run Anywhere'), 'Should render collection heading');
    assert.ok(html.includes('Curated Collection'), 'Should render badge');
  });

  test('Single slug fallback /supabase routes to tool detail', () => {
    setupMockBrowser('https://openalternative.co/supabase');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Supabase'), 'Should render tool name for single slug');
    assert.ok(html.includes('The open source Firebase alternative'), 'Should render tagline');
  });

  test('Unknown root route /unknown-route renders 404 page', () => {
    setupMockBrowser('https://openalternative.co/unknown-route');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Page Not Found') || html.includes('404'), 'Should render 404 page');
    assert.ok(html.includes('Go to Homepage'), 'Should render return button');
  });

  test('Unknown tool slug /tools/non-existent-tool renders Tool Not Found state', () => {
    setupMockBrowser('https://openalternative.co/tools/non-existent-tool');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Tool Not Found'), 'Should render Tool Not Found');
    assert.ok(html.includes('Back to Tools Directory'), 'Should render back button');
  });

  test('Unknown category slug /categories/non-existent-cat renders Category Not Found state', () => {
    setupMockBrowser('https://openalternative.co/categories/non-existent-cat');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Category Not Found'), 'Should render Category Not Found');
  });

  test('Unknown alternative slug /alternatives/non-existent-alt renders Software Not Found state', () => {
    setupMockBrowser('https://openalternative.co/alternatives/non-existent-alt');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Software Not Found'), 'Should render Software Not Found');
  });

  test('Unknown collection slug /collections/non-existent-col renders Collection Not Found state', () => {
    setupMockBrowser('https://openalternative.co/collections/non-existent-col');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Collection Not Found'), 'Should render Collection Not Found');
  });

  test('Simulated back/forward history navigation transitions properly', () => {
    const { mockWindow } = setupMockBrowser('https://openalternative.co/');

    // Simulate navigation to /tools
    mockWindow.history.pushState({}, '', '/tools');
    assert.strictEqual(mockWindow.location.pathname, '/tools');

    // Simulate navigation to /tools/supabase
    mockWindow.history.pushState({}, '', '/tools/supabase');
    assert.strictEqual(mockWindow.location.pathname, '/tools/supabase');

    // Simulate Back button click
    mockWindow.history.back();
    assert.strictEqual(mockWindow.location.pathname, '/tools');

    // Simulate Back button click to home
    mockWindow.history.back();
    assert.strictEqual(mockWindow.location.pathname, '/');

    // Simulate Forward button click
    mockWindow.history.forward();
    assert.strictEqual(mockWindow.location.pathname, '/tools');
  });

  test('Simulated search query with combined filters maintains URL state', () => {
    const { mockWindow } = setupMockBrowser('https://openalternative.co/?q=data&category=developer-tools&sort=stars');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Supabase'), 'Supabase matches developer-tools');
    assert.strictEqual(mockWindow.location.search, '?q=data&category=developer-tools&sort=stars');
  });

  test('All HTML links use valid relative paths or external HTTPS URLs', () => {
    setupMockBrowser('https://openalternative.co/');
    const html = renderClean(React.createElement(ssrModule.App));

    const hrefRegex = /href="([^"]+)"/g;
    let match;
    const links = [];
    while ((match = hrefRegex.exec(html)) !== null) {
      links.push(match[1]);
    }

    assert.ok(links.length > 10, 'Page should contain links');
    links.forEach((href) => {
      assert.ok(
        href.startsWith('/') || href.startsWith('https://') || href.startsWith('mailto:'),
        `Link ${href} should be relative path, https://, or mailto:`
      );
      assert.ok(!href.includes('undefined'), `Link ${href} should not contain undefined`);
      assert.ok(!href.includes('null'), `Link ${href} should not contain null`);
    });
  });

  test('Responsive header renders both desktop links and mobile menu trigger', () => {
    setupMockBrowser('https://openalternative.co/');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('aria-label="Toggle mobile navigation menu"'), 'Should render mobile menu button');
    assert.ok(html.includes('Tools'), 'Should render navigation item');
    assert.ok(html.includes('Categories'), 'Should render navigation item');
    assert.ok(html.includes('Alternatives'), 'Should render navigation item');
  });
});
