import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { execSync } from 'child_process';
import { siteConfig, formatPageTitle } from '../src/config/site.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { toolsData } from '../src/data/seedData.ts';

describe('Phase 9: SwitchRoute Platform Rebranding', () => {
  let ssrModule;
  let logoModule;

  before(() => {
    // Recompile bundle for Node SSR
    execSync(
      './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
      { stdio: 'pipe' }
    );
    execSync(
      './node_modules/.bin/esbuild src/components/TechHacksLogo.tsx --bundle --platform=node --format=esm --external:react --outfile=dist/test-logo.js',
      { stdio: 'pipe' }
    );
  });

  function setupMockBrowser(initialUrl = 'https://switchroute.in/') {
    const parsedUrl = new URL(initialUrl);
    const mockStorage = {};

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
      localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => {
          mockStorage[k] = String(v);
        },
        removeItem: (k) => {
          delete mockStorage[k];
        },
      },
      addEventListener: () => {},
      removeEventListener: () => {},
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

  test('siteConfig defines canonical SwitchRoute identity and URLs', () => {
    assert.strictEqual(siteConfig.name, 'SwitchRoute', 'Canonical name must be SwitchRoute');
    assert.strictEqual(siteConfig.shortName, 'SwitchRoute', 'Short name must be SwitchRoute');
    assert.strictEqual(siteConfig.brandMark, 'SR', 'Brand mark must be SR');
    assert.strictEqual(siteConfig.url, 'https://switchroute.in', 'Base URL must be switchroute.in');
    assert.ok(siteConfig.tagline.length > 10, 'Tagline must be non-empty');
    assert.ok(siteConfig.description.length > 20, 'Description must be non-empty');

    // formatPageTitle helper
    assert.strictEqual(
      formatPageTitle(),
      'SwitchRoute — Free AI Tools, Smarter Alternatives & Open Source'
    );
    assert.strictEqual(
      formatPageTitle('All Open Source Tools'),
      'All Open Source Tools — SwitchRoute'
    );
    assert.strictEqual(
      formatPageTitle('Side-by-Side Tool Comparison'),
      'Side-by-Side Tool Comparison — SwitchRoute'
    );
  });

  test('official SwitchRoute vector logo assets exist on disk and have valid SVG markup', () => {
    const rootDir = process.cwd();
    const faviconPath = path.join(rootDir, 'public', 'favicon.svg');
    const logoPath = path.join(rootDir, 'public', 'tech-hacks-ai-logo.svg');
    const brandLogoPath = path.join(rootDir, 'public', 'logos', 'tech-hacks-ai.svg');

    assert.ok(fs.existsSync(faviconPath), 'favicon.svg must exist');
    assert.ok(fs.existsSync(logoPath), 'tech-hacks-ai-logo.svg must exist');
    assert.ok(fs.existsSync(brandLogoPath), 'logos/tech-hacks-ai.svg must exist');

    const faviconContent = fs.readFileSync(faviconPath, 'utf8');
    assert.ok(faviconContent.includes('<svg'), 'favicon.svg must contain <svg>');
    assert.ok(faviconContent.includes('viewBox="0 0 32 32"'), 'favicon.svg should have 32x32 viewBox');
    assert.ok(faviconContent.includes('linearGradient'), 'favicon.svg should include linear gradients');

    const logoContent = fs.readFileSync(logoPath, 'utf8');
    assert.ok(logoContent.includes('<svg'), 'logo must contain <svg>');
    assert.ok(logoContent.includes('linearGradient'), 'logo must include gradient styling');
  });

  test('index.html contains SwitchRoute metadata, OG tags, Twitter cards and favicon link', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

    assert.ok(
      indexHtml.includes('<title>SwitchRoute — Free AI Tools, Smarter Alternatives &amp; Open Source</title>'),
      'index.html title must be branded SwitchRoute'
    );
    assert.ok(
      indexHtml.includes('content="SwitchRoute"'),
      'index.html og:site_name must be SwitchRoute'
    );
    assert.ok(
      indexHtml.includes('href="https://switchroute.in"'),
      'index.html canonical link must point to switchroute.in'
    );
    assert.ok(
      indexHtml.includes('content="https://switchroute.in"'),
      'index.html og:url must point to switchroute.in'
    );
    assert.ok(
      !indexHtml.includes('content="@techhacksai"'),
      'index.html must not advertise the old Twitter handle after rebranding'
    );
    assert.ok(
      indexHtml.includes('href="/favicon.svg"'),
      'index.html should link to /favicon.svg'
    );
  });

  test('public/robots.txt and public/sitemap.xml point to switchroute.in', () => {
    const robotsTxt = fs.readFileSync(path.join(process.cwd(), 'public', 'robots.txt'), 'utf8');
    assert.ok(
      robotsTxt.includes('Sitemap: https://switchroute.in/sitemap.xml'),
      'robots.txt must declare switchroute.in sitemap'
    );

    const sitemapXml = fs.readFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), 'utf8');
    assert.ok(
      sitemapXml.includes('<loc>https://switchroute.in/</loc>'),
      'sitemap.xml must have switchroute.in root URL'
    );
    assert.ok(
      !sitemapXml.includes('openalternative.co'),
      'sitemap.xml must have no remaining openalternative.co references'
    );
  });

  test('Header renders SwitchRoute brand mark, wordmark and microinteractions', async () => {
    setupMockBrowser('https://switchroute.in/');
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('SwitchRoute'), 'Header must render "SwitchRoute" wordmark');
    assert.ok(html.includes('switchRoute-'), 'Header must render unique SwitchRoute route-mark gradients');
    assert.ok(html.includes('aria-label="SwitchRoute"'), 'Header logo link accessible name matches visible wordmark');
    assert.ok(html.includes('group-hover:rotate-3'), 'Logo must maintain microinteraction rotate hover');
  });

  test('rendered SwitchRoute logo SVG gradient IDs are unique across repeated instances', async () => {
    if (!logoModule) logoModule = await import('../dist/test-logo.js');
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(logoModule.TechHacksLogo),
        React.createElement(logoModule.TechHacksLogo),
      ),
    );
    const ids = [...html.matchAll(/id="(switchRoute-[^"]+)"/g)].map((match) => match[1]);
    assert.strictEqual(ids.length, 4, 'Each of the two logo instances should define line and glow gradients');
    assert.strictEqual(new Set(ids).size, ids.length, 'Every SwitchRoute gradient ID must be unique across logo instances');
    for (const id of ids) {
      assert.ok(html.includes(`url(#${id})`), `Gradient ${id} must be referenced by the SVG artwork`);
    }
  });

  test('Footer renders SwitchRoute about summary and current year copyright', async () => {
    setupMockBrowser('https://switchroute.in/');
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = renderClean(React.createElement(ssrModule.App));

    const currentYear = new Date().getFullYear();
    assert.ok(
      html.includes(`© ${currentYear} SwitchRoute. Built with open web standards.`),
      'Footer must render SwitchRoute copyright'
    );
    assert.ok(
      html.includes('SwitchRoute is an independent discovery directory'),
      'Footer must render SwitchRoute about text'
    );
  });

  test('HomePage hero renders SwitchRoute audience description', async () => {
    setupMockBrowser('https://switchroute.in/');
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(
      html.includes('Discover paid AI alternatives, creative prompts, verified offers, and practical everyday tools—all in one place.'),
      'Hero description must explain SwitchRoute’s alternatives, prompts, and utility value'
    );
  });

  test('dynamic document.title correctly formats with SwitchRoute suffix across all routes', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');

    const testRoutes = [
      {
        route: 'home',
        params: {},
        expected: 'SwitchRoute — Free AI Tools, Smarter Alternatives & Open Source',
      },
      {
        route: 'tools',
        params: {},
        expected: 'All Open Source Tools — SwitchRoute',
      },
      {
        route: 'ai-tools',
        params: {},
        expected: 'AI Tools Directory: Free, Paid & Open Models — SwitchRoute',
      },
      {
        route: 'free-ai-sites',
        params: {},
        expected: 'Free AI Access & Open-Source Tools — SwitchRoute',
      },
      {
        route: 'alternatives',
        params: {},
        expected: 'Browse Proprietary Software Alternatives — SwitchRoute',
      },
      {
        route: 'guides',
        params: {},
        expected: 'Step-by-Step AI Workflows & Tutorials — SwitchRoute',
      },
      {
        route: 'prompt-library',
        params: {},
        expected: 'AI Prompt Library & Creative Recipes — SwitchRoute',
      },
      {
        route: 'free-tools',
        params: {},
        expected: 'Free Browser-Based Utilities — SwitchRoute',
      },
      {
        route: 'compare',
        params: {},
        expected: 'Side-by-Side Tool Comparison — SwitchRoute',
      },
      {
        route: 'pick',
        params: {},
        expected: 'Help Me Pick: Guided Tool Discovery — SwitchRoute',
      },
      {
        route: 'saved',
        params: {},
        expected: 'Saved Tools & Prompt Recipes — SwitchRoute',
      },
      {
        route: 'updates',
        params: {},
        expected: 'Platform & Model Changelog — SwitchRoute',
      },
      {
        route: 'not-found',
        params: {},
        expected: '404 Page Not Found — SwitchRoute',
      },
      {
        route: 'tool-detail',
        params: { slug: 'supabase' },
        expected: 'Supabase: Open Source Alternative to firebase — SwitchRoute',
      },
      {
        route: 'alternative-detail',
        params: { slug: 'notion' },
        expected: 'Open Source Notion Alternatives — SwitchRoute',
      },
    ];

    for (const { route, params, expected } of testRoutes) {
      const title = ssrModule.getRouteTitle(route, params);
      assert.strictEqual(
        title,
        expected,
        `Route "${route}" with ${JSON.stringify(params)} should have formatted title "${expected}"`
      );
    }
  });

  test('third-party software names, categories, and AI tools are fully preserved', () => {
    // Check proprietary software targets
    assert.ok(proprietaryTools.some((t) => t.name === 'Figma'), 'Figma must remain untouched');
    assert.ok(proprietaryTools.some((t) => t.name === 'Notion'), 'Notion must remain untouched');
    assert.ok(proprietaryTools.some((t) => t.name === 'Firebase'), 'Firebase must remain untouched');
    assert.ok(proprietaryTools.some((t) => t.name === 'Airtable'), 'Airtable must remain untouched');

    // Check open source alternatives
    assert.ok(toolsData.some((t) => t.name === 'Supabase'), 'Supabase must remain untouched');
    assert.ok(toolsData.some((t) => t.name === 'Penpot'), 'Penpot must remain untouched');
    assert.ok(toolsData.some((t) => t.name === 'AppFlowy'), 'AppFlowy must remain untouched');

    // Check AI platforms
    assert.ok(aiToolsData.some((t) => t.slug === 'claude' || t.name.includes('Claude')), 'Claude must remain untouched');
    assert.ok(aiToolsData.some((t) => t.slug === 'cursor' || t.name === 'Cursor'), 'Cursor must remain untouched');
    assert.ok(aiToolsData.some((t) => t.slug === 'midjourney' || t.name === 'Midjourney'), 'Midjourney must remain untouched');
    assert.ok(aiToolsData.some((t) => t.slug === 'ollama' || t.name === 'Ollama'), 'Ollama must remain untouched');
  });
});
