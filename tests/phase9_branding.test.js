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

describe('Phase 9: Tech Hacks AI Platform Rebranding', () => {
  let ssrModule;

  before(() => {
    // Recompile bundle for Node SSR
    execSync(
      './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
      { stdio: 'pipe' }
    );
  });

  function setupMockBrowser(initialUrl = 'https://techhacksai.com/') {
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

  test('siteConfig defines canonical Tech Hacks AI identity and URLs', () => {
    assert.strictEqual(siteConfig.name, 'Tech Hacks AI', 'Canonical name must be Tech Hacks AI');
    assert.strictEqual(siteConfig.shortName, 'Tech Hacks', 'Short name must be Tech Hacks');
    assert.strictEqual(siteConfig.brandMark, 'AI', 'Brand mark must be AI');
    assert.strictEqual(siteConfig.url, 'https://techhacksai.com', 'Base URL must be techhacksai.com');
    assert.ok(siteConfig.tagline.length > 10, 'Tagline must be non-empty');
    assert.ok(siteConfig.description.length > 20, 'Description must be non-empty');

    // formatPageTitle helper
    assert.strictEqual(
      formatPageTitle(),
      'Tech Hacks AI — Discover AI Tools, Free Software & Open-Source Alternatives'
    );
    assert.strictEqual(
      formatPageTitle('All Open Source Tools'),
      'All Open Source Tools — Tech Hacks AI'
    );
    assert.strictEqual(
      formatPageTitle('Side-by-Side Tool Comparison'),
      'Side-by-Side Tool Comparison — Tech Hacks AI'
    );
  });

  test('official Tech Hacks AI vector logo assets exist on disk and have valid SVG markup', () => {
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

  test('index.html contains Tech Hacks AI metadata, OG tags, Twitter cards and favicon link', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

    assert.ok(
      indexHtml.includes('<title>Tech Hacks AI — Discover AI Tools, Free Software &amp; Open-Source Alternatives</title>'),
      'index.html title must be branded Tech Hacks AI'
    );
    assert.ok(
      indexHtml.includes('content="Tech Hacks AI"'),
      'index.html og:site_name must be Tech Hacks AI'
    );
    assert.ok(
      indexHtml.includes('href="https://techhacksai.com"'),
      'index.html canonical link must point to techhacksai.com'
    );
    assert.ok(
      indexHtml.includes('content="https://techhacksai.com"'),
      'index.html og:url must point to techhacksai.com'
    );
    assert.ok(
      indexHtml.includes('content="@techhacksai"'),
      'index.html twitter:site must be @techhacksai'
    );
    assert.ok(
      indexHtml.includes('href="/favicon.svg"'),
      'index.html should link to /favicon.svg'
    );
  });

  test('public/robots.txt and public/sitemap.xml point to techhacksai.com', () => {
    const robotsTxt = fs.readFileSync(path.join(process.cwd(), 'public', 'robots.txt'), 'utf8');
    assert.ok(
      robotsTxt.includes('Sitemap: https://techhacksai.com/sitemap.xml'),
      'robots.txt must declare techhacksai.com sitemap'
    );

    const sitemapXml = fs.readFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), 'utf8');
    assert.ok(
      sitemapXml.includes('<loc>https://techhacksai.com/</loc>'),
      'sitemap.xml must have techhacksai.com root URL'
    );
    assert.ok(
      !sitemapXml.includes('openalternative.co'),
      'sitemap.xml must have no remaining openalternative.co references'
    );
  });

  test('Header renders Tech Hacks AI brand mark, wordmark and microinteractions', async () => {
    setupMockBrowser('https://techhacksai.com/');
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Tech Hacks'), 'Header must render "Tech Hacks" wordmark');
    assert.ok(html.includes('AI'), 'Header must render "AI" accent badge');
    assert.ok(html.includes('aria-label="Tech Hacks AI Home"'), 'Header logo link must have accessible aria-label');
    assert.ok(html.includes('group-hover:rotate-12'), 'Logo must maintain microinteraction rotate hover');
  });

  test('Footer renders Tech Hacks AI about summary and current year copyright', async () => {
    setupMockBrowser('https://techhacksai.com/');
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = renderClean(React.createElement(ssrModule.App));

    const currentYear = new Date().getFullYear();
    assert.ok(
      html.includes(`© ${currentYear} Tech Hacks AI. Built with open web standards.`),
      'Footer must render Tech Hacks AI copyright'
    );
    assert.ok(
      html.includes('Tech Hacks AI is a curated discovery platform'),
      'Footer must render Tech Hacks AI about text'
    );
  });

  test('HomePage hero renders Tech Hacks AI audience description', async () => {
    setupMockBrowser('https://techhacksai.com/');
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(
      html.includes('Tech Hacks AI is a practical directory for finding AI products'),
      'Hero description must mention Tech Hacks AI'
    );
  });

  test('dynamic document.title correctly formats with Tech Hacks AI suffix across all routes', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');

    const testRoutes = [
      {
        route: 'home',
        params: {},
        expected: 'Tech Hacks AI — Discover AI Tools, Free Software & Open-Source Alternatives',
      },
      {
        route: 'tools',
        params: {},
        expected: 'All Open Source Tools — Tech Hacks AI',
      },
      {
        route: 'ai-tools',
        params: {},
        expected: 'AI Tools & Generative Platforms Directory — Tech Hacks AI',
      },
      {
        route: 'free-ai-sites',
        params: {},
        expected: 'Free AI Sites & Zero-Cost Generative Tools — Tech Hacks AI',
      },
      {
        route: 'alternatives',
        params: {},
        expected: 'Browse Proprietary Software Alternatives — Tech Hacks AI',
      },
      {
        route: 'guides',
        params: {},
        expected: 'Step-by-Step AI Workflows & Tutorials — Tech Hacks AI',
      },
      {
        route: 'prompt-library',
        params: {},
        expected: 'AI Prompt Library & Creative Recipes — Tech Hacks AI',
      },
      {
        route: 'free-tools',
        params: {},
        expected: 'Free Browser-Based Utilities — Tech Hacks AI',
      },
      {
        route: 'compare',
        params: {},
        expected: 'Side-by-Side Tool Comparison — Tech Hacks AI',
      },
      {
        route: 'pick',
        params: {},
        expected: 'Help Me Pick: Guided Tool Discovery — Tech Hacks AI',
      },
      {
        route: 'saved',
        params: {},
        expected: 'Saved Tools & Prompt Recipes — Tech Hacks AI',
      },
      {
        route: 'updates',
        params: {},
        expected: 'Platform & Model Changelog — Tech Hacks AI',
      },
      {
        route: 'not-found',
        params: {},
        expected: '404 Page Not Found — Tech Hacks AI',
      },
      {
        route: 'tool-detail',
        params: { slug: 'supabase' },
        expected: 'Supabase: Open Source Alternative to firebase — Tech Hacks AI',
      },
      {
        route: 'alternative-detail',
        params: { slug: 'notion' },
        expected: 'Open Source Notion Alternatives — Tech Hacks AI',
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
