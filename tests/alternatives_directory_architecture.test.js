import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { execSync } from 'child_process';
import { toolsData } from '../src/data/seedData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { getToolsForProprietary, getProprietaryToolBySlug } from '../src/services/catalogService.ts';

describe('Alternatives Directory & Proprietary vs Replacement Architecture', () => {
  let ssrModule;

  before(() => {
    // Recompile App bundle for Node SSR
    execSync(
      './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
      { stdio: 'pipe' }
    );
  });

  function setupMockBrowser(initialUrl = 'https://openalternative.co/alternatives') {
    const parsedUrl = new URL(initialUrl);
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
        },
        replaceState: (state, title, url) => {
          const resolved = new URL(url, mockWindow.location.origin);
          mockWindow.location.pathname = resolved.pathname;
          mockWindow.location.search = resolved.search;
          mockWindow.location.href = resolved.toString();
        },
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {},
    };

    global.window = mockWindow;
    global.document = { title: '' };
  }

  function renderClean(element) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }

  test('Proprietary tools have dynamically computed alternative counts from actual relationships', () => {
    // Verify each proprietary tool count matches actual mapped open source tools
    for (const proprietary of proprietaryTools) {
      const replacements = getToolsForProprietary(proprietary.slug);
      assert.ok(
        Array.isArray(replacements),
        `getToolsForProprietary should return an array for ${proprietary.slug}`
      );

      // Verify specific known targets
      if (proprietary.slug === 'notion') {
        assert.strictEqual(replacements.length, 4, 'Notion must have 4 mapped open-source alternatives');
        const names = replacements.map((t) => t.name).sort();
        assert.deepStrictEqual(names, ['AFFiNE', 'AppFlowy', 'Docmost', 'Outline']);
      }
      if (proprietary.slug === 'figma') {
        assert.strictEqual(replacements.length, 2, 'Figma must have 2 mapped open-source alternatives');
        const names = replacements.map((t) => t.name).sort();
        assert.deepStrictEqual(names, ['AFFiNE', 'Penpot']);
      }
      if (proprietary.slug === 'firebase') {
        assert.strictEqual(replacements.length, 2, 'Firebase must have 2 mapped open-source alternatives');
        const names = replacements.map((t) => t.name).sort();
        assert.deepStrictEqual(names, ['Beekeeper Studio', 'Supabase']);
      }
      if (proprietary.slug === 'airtable') {
        assert.strictEqual(replacements.length, 1, 'Airtable must have 1 mapped open-source alternative (Baserow)');
        assert.strictEqual(replacements[0].name, 'Baserow');
      }
      if (proprietary.slug === 'zapier') {
        assert.strictEqual(replacements.length, 1, 'Zapier must have 1 mapped open-source alternative (n8n)');
        assert.strictEqual(replacements[0].name, 'n8n');
      }
      if (proprietary.slug === 'google-analytics') {
        assert.strictEqual(replacements.length, 2, 'Google Analytics must have 2 mapped alternatives');
        const names = replacements.map((t) => t.name).sort();
        assert.deepStrictEqual(names, ['Plausible Analytics', 'Umami']);
      }
    }
  });

  test('/alternatives index page renders proprietary software as primary cards', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/alternatives');
    const html = renderClean(React.createElement(ssrModule.App));

    // Page must have primary heading
    assert.ok(html.includes('Browse Open Source Software Alternatives'), 'Index has clear heading');
    assert.ok(html.includes('Proprietary Replacements'), 'Index has section badge');

    // Primary cards must be proprietary apps: Figma, Notion, Firebase, Airtable
    assert.ok(html.includes('Figma'), 'Must render Figma as proprietary card');
    assert.ok(html.includes('Notion'), 'Must render Notion as proprietary card');
    assert.ok(html.includes('Firebase'), 'Must render Firebase as proprietary card');
    assert.ok(html.includes('Airtable'), 'Must render Airtable as proprietary card');
    assert.ok(html.includes('Zapier'), 'Must render Zapier as proprietary card');
    assert.ok(html.includes('Google Analytics'), 'Must render Google Analytics as proprietary card');

    // Cards must link to /alternatives/:slug
    assert.ok(html.includes('href="/alternatives/figma"'), 'Card links to /alternatives/figma');
    assert.ok(html.includes('href="/alternatives/notion"'), 'Card links to /alternatives/notion');
    assert.ok(html.includes('href="/alternatives/firebase"'), 'Card links to /alternatives/firebase');

    // Dynamic alternative count labels
    assert.ok(html.includes('4 alternatives') || html.includes('4 open alternatives'), 'Shows Notion count');
    assert.ok(html.includes('2 alternatives') || html.includes('2 open alternatives'), 'Shows Figma count');
  });

  test('/alternatives/figma detail page renders only open source tools replacing Figma', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/alternatives/figma');
    const html = renderClean(React.createElement(ssrModule.App));

    // Header contains Figma details and link to proprietary website
    assert.ok(html.includes('Open Source Figma Alternatives'), 'Header shows Figma alternatives title');
    assert.ok(html.includes('https://figma.com'), 'Contains link to official figma.com website');
    assert.ok(html.includes('Visit Figma Official Website'), 'Contains official website link text');

    // Shows Penpot and AFFiNE
    assert.ok(html.includes('Penpot'), 'Must render Penpot replacement card');
    assert.ok(html.includes('AFFiNE'), 'Must render AFFiNE replacement card');

    // Must NOT render unrelated tools
    assert.ok(!html.includes('Baserow'), 'Should NOT render Baserow on Figma page');
    assert.ok(!html.includes('Hoppscotch'), 'Should NOT render Hoppscotch on Figma page');
    assert.ok(!html.includes('Postiz'), 'Should NOT render Postiz on Figma page');
  });

  test('/alternatives/notion detail page renders only Notion alternatives with 4 verified tools', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/alternatives/notion');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Open Source Notion Alternatives'), 'Header shows Notion alternatives title');
    assert.ok(html.includes('https://notion.so'), 'Contains link to official notion.so website');
    assert.ok(html.includes('4 verified replacements'), 'Displays count of 4 replacements');

    // All 4 Notion replacements must be rendered
    assert.ok(html.includes('AppFlowy'), 'Renders AppFlowy');
    assert.ok(html.includes('Outline'), 'Renders Outline');
    assert.ok(html.includes('Docmost'), 'Renders Docmost');
    assert.ok(html.includes('AFFiNE'), 'Renders AFFiNE');

    // Tools that do not replace Notion should not be rendered
    assert.ok(!html.includes('Supabase'), 'Should NOT render Supabase on Notion page');
    assert.ok(!html.includes('Cal.com'), 'Should NOT render Cal.com on Notion page');
  });

  test('Replacement cards clearly distinguish internal tool links from external website/code links', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/alternatives/figma');
    const html = renderClean(React.createElement(ssrModule.App));

    // Internal navigation to /tools/:slug
    assert.ok(html.includes('href="/tools/penpot"'), 'Contains internal navigation link to /tools/penpot');
    assert.ok(html.includes('View Details'), 'Contains "View Details" affordance');

    // External link to tool website
    assert.ok(html.includes('https://penpot.app'), 'Contains external link to Penpot website');
    assert.ok(html.includes('target="_blank"'), 'External links open in new tab');
    assert.ok(html.includes('rel="noopener noreferrer"'), 'External links have secure rel attributes');

    // External link to GitHub repository
    assert.ok(
      html.includes('https://github.com/penpot/penpot'),
      'Contains external link to Penpot GitHub repo'
    );

    // Metadata badges
    assert.ok(html.includes('MPL-2.0'), 'Shows Penpot MPL-2.0 license');
    assert.ok(html.includes('Clojure') || html.includes('Rust'), 'Shows Penpot tech stack');
  });

  test('Unknown proprietary slug renders Software Not Found state with return link', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/alternatives/unknown-saas-platform');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Software Not Found'), 'Renders Software Not Found title');
    assert.ok(html.includes('unknown-saas-platform'), 'Mentions the requested slug');
    assert.ok(html.includes('Back to Alternatives'), 'Contains back button label');
    assert.ok(html.includes('href="/alternatives"'), 'Has return link to /alternatives');
  });

  test('Local search within alternative detail filters replacements and displays empty state on no match', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    
    // Search for Flutter under Notion (matches AppFlowy)
    setupMockBrowser('https://openalternative.co/alternatives/notion?q=flutter');
    const htmlMatch = renderClean(React.createElement(ssrModule.App));
    assert.ok(htmlMatch.includes('AppFlowy'), 'Matches AppFlowy for flutter search');
    assert.ok(!htmlMatch.includes('Docmost'), 'Filters out Docmost');

    // Search for non-matching term under Notion
    setupMockBrowser('https://openalternative.co/alternatives/notion?q=nonexistentqueryxyz');
    const htmlNoMatch = renderClean(React.createElement(ssrModule.App));
    assert.ok(
      htmlNoMatch.includes('No open source alternatives matching'),
      'Renders empty state when search query matches zero replacements'
    );
  });
});
