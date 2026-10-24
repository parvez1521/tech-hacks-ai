import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { execSync } from 'child_process';
import { toolsData } from '../src/data/seedData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { aiToolsData, aiCategories } from '../src/data/aiToolsData.ts';
import { brandLogos, getBrandLogo } from '../src/data/brandLogos.ts';
import {
  filterAndSortAiTools,
  getAiToolBySlug,
  getFreeAiTools,
  getOpenSourceAiTools,
} from '../src/services/aiCatalogService.ts';

describe('Phase 7: Official Brand Logos & Verified Free AI Tools Directory', () => {
  let ssrModule;

  before(() => {
    if (!fs.existsSync(path.resolve(process.cwd(), 'dist/test-ssr.js'))) {
      execSync(
        './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
        { stdio: 'pipe' }
      );
    }
  });

  function setupMockBrowser(initialUrl = 'https://openalternative.co/') {
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
        setItem: (k, v) => { mockStorage[k] = v; },
        removeItem: (k) => { delete mockStorage[k]; },
        clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
      },
      matchMedia: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
      scrollTo: () => {},
    };

    globalThis.window = mockWindow;
    globalThis.document = {
      title: 'OpenAlternative Test',
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }

  function renderClean(element) {
    return ReactDOMServer.renderToString(element);
  }

  // -------------------------------------------------------------------------
  // 1. Brand Logo Registry & Asset Verification
  // -------------------------------------------------------------------------
  test('all open-source tools have mapped logo assets that exist on disk', () => {
    const logosDir = path.resolve('public/logos');

    for (const tool of toolsData) {
      const entry = getBrandLogo(tool.slug);
      assert.ok(entry, `Tool ${tool.slug} should have an entry in brandLogos`);
      assert.ok(entry.assetPath, `Tool ${tool.slug} must specify assetPath`);

      // Verify file exists on disk
      const fullPath = path.resolve('public', entry.assetPath.replace(/^\//, ''));
      assert.ok(fs.existsSync(fullPath), `Asset file ${fullPath} must exist on disk for ${tool.slug}`);

      const content = fs.readFileSync(fullPath);
      if (/\.svg$/i.test(fullPath)) {
        assert.ok(content.toString('utf8').includes('<svg'), `Asset ${entry.assetPath} must be valid SVG`);
      } else if (/\.webp$/i.test(fullPath)) {
        assert.deepEqual([...content.subarray(0, 4)], [0x52, 0x49, 0x46, 0x46], `Asset ${entry.assetPath} must have a valid WebP RIFF header`);
        assert.equal(content.toString('ascii', 8, 12), 'WEBP', `Asset ${entry.assetPath} must identify WebP payload`);
      } else {
        assert.ok(content.length > 32, `Asset ${entry.assetPath} must contain a valid raster payload`);
      }
      assert.ok(content.length > 50, `Asset ${entry.assetPath} must have reasonable content size`);
    }
  });

  test('all proprietary software targets have mapped logo assets that exist on disk', () => {
    for (const alt of proprietaryTools) {
      const entry = getBrandLogo(alt.slug);
      assert.ok(entry, `Proprietary software ${alt.slug} should have an entry in brandLogos`);
      assert.ok(entry.assetPath, `Software ${alt.slug} must specify assetPath`);

      const fullPath = path.resolve('public', entry.assetPath.replace(/^\//, ''));
      assert.ok(fs.existsSync(fullPath), `Asset file ${fullPath} must exist on disk for ${alt.slug}`);

      const content = fs.readFileSync(fullPath);
      if (/\.svg$/i.test(fullPath)) {
        assert.ok(content.toString('utf8').includes('<svg'), `Asset ${entry.assetPath} must be valid SVG`);
      } else if (/\.webp$/i.test(fullPath)) {
        assert.deepEqual([...content.subarray(0, 4)], [0x52, 0x49, 0x46, 0x46], `Asset ${entry.assetPath} must have a valid WebP RIFF header`);
        assert.equal(content.toString('ascii', 8, 12), 'WEBP', `Asset ${entry.assetPath} must identify WebP payload`);
      } else {
        assert.ok(content.length > 32, `Asset ${entry.assetPath} must contain a valid raster payload`);
      }
    }
  });

  test('all AI tools have mapped logo assets in brandLogos and valid image files', () => {
    for (const ai of aiToolsData) {
      const entry = getBrandLogo(ai.slug);
      assert.ok(entry, `AI platform ${ai.slug} must be registered in brandLogos`);

      const fullPath = path.resolve('public', entry.assetPath.replace(/^\//, ''));
      assert.ok(fs.existsSync(fullPath), `Asset file ${fullPath} must exist on disk for ${ai.slug}`);

      const content = fs.readFileSync(fullPath);
      if (/\.svg$/i.test(fullPath)) assert.ok(content.toString('utf8').includes('<svg'), `Asset ${entry.assetPath} must contain SVG markup`);
      else assert.ok(content.length > 32, `Asset ${entry.assetPath} must contain a valid raster payload`);
    }
  });

  // -------------------------------------------------------------------------
  // 2. Verified Free AI Tools Directory (40+ Tools & Provenance)
  // -------------------------------------------------------------------------
  test('catalog contains at least 40 verified AI tools with unique identifiers', () => {
    assert.ok(aiToolsData.length >= 40, `Expected at least 40 AI tools, found ${aiToolsData.length}`);

    const slugs = new Set();
    const ids = new Set();

    for (const tool of aiToolsData) {
      assert.ok(!slugs.has(tool.slug), `Duplicate AI tool slug: ${tool.slug}`);
      assert.ok(!ids.has(tool.id), `Duplicate AI tool id: ${tool.id}`);
      slugs.add(tool.slug);
      ids.add(tool.id);
    }
  });

  test('every AI tool contains verified pricing provenance, quota details, and official URL', () => {
    const validAccessTypes = new Set(['open-source-local', 'recurring-free', 'limited-free', 'free-credits', 'none']);

    for (const tool of aiToolsData) {
      assert.ok(tool.websiteUrl.startsWith('https://'), `Valid website URL for ${tool.slug}`);
      assert.ok(tool.pricingSourceUrl.startsWith('https://'), `Valid pricing source URL for ${tool.slug}`);
      assert.ok(tool.pricingVerifiedAt.match(/^\d{4}-\d{2}-\d{2}$/), `ISO verification date for ${tool.slug}`);
      assert.ok(validAccessTypes.has(tool.freeAccessType), `Valid freeAccessType for ${tool.slug}`);
      assert.ok(tool.freeTierSummary && tool.freeTierSummary.length > 10, `Detailed freeTierSummary for ${tool.slug}`);
      assert.ok(tool.freeTierLimits && tool.freeTierLimits.length > 5, `Explicit freeTierLimits for ${tool.slug}`);
      assert.strictEqual(typeof tool.requiresAccount, 'boolean', `requiresAccount boolean for ${tool.slug}`);
    }
  });

  test('open-source and local self-hostable tools are distinctly classified', () => {
    const openSourceTools = getOpenSourceAiTools();
    assert.ok(openSourceTools.length >= 10, `Should have at least 10 open-source AI tools, found ${openSourceTools.length}`);

    const localSlugs = openSourceTools.map((t) => t.slug);
    assert.ok(localSlugs.includes('ollama'), 'Ollama is in open-source AI tools');
    assert.ok(localSlugs.includes('open-webui'), 'Open WebUI is in open-source AI tools');
    assert.ok(localSlugs.includes('comfyui'), 'ComfyUI is in open-source AI tools');
    assert.ok(localSlugs.includes('vllm'), 'vLLM is in open-source AI tools');
    assert.ok(localSlugs.includes('dify'), 'Dify is in open-source AI tools');

    for (const tool of openSourceTools) {
      assert.ok(tool.isSelfHostable || tool.freeAccessType === 'open-source-local', `${tool.slug} is classified as local/self-hostable`);
      if (tool.openSourceRepoUrl) {
        assert.ok(tool.openSourceRepoUrl.startsWith('https://github.com/'), `Valid GitHub repo for ${tool.slug}`);
      }
    }
  });

  test('getFreeAiTools filters out strictly paid-only tools', () => {
    const freeTools = getFreeAiTools();
    assert.ok(freeTools.length >= 35, `Should have at least 35 free-plan tools, found ${freeTools.length}`);

    const freeSlugs = freeTools.map((t) => t.slug);
    assert.ok(freeSlugs.includes('claude'), 'Claude is included in free tools');
    assert.ok(freeSlugs.includes('chatgpt'), 'ChatGPT is included in free tools');
    assert.ok(freeSlugs.includes('perplexity'), 'Perplexity is included in free tools');
    assert.ok(freeSlugs.includes('ollama'), 'Ollama is included in free tools');
    assert.ok(!freeSlugs.includes('midjourney'), 'Paid-only Midjourney is excluded from free tools');
  });

  // -------------------------------------------------------------------------
  // 3. UI Route Rendering & BrandLogo Integration
  // -------------------------------------------------------------------------
  test('/free-ai-sites renders access type tabs and official brand logos', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/free-ai-sites');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Free AI Sites &amp; Generative Tools') || html.includes('Free AI Sites & Generative Tools'), 'Renders Free AI heading');
    assert.ok(html.includes('100% Open Source &amp; Local') || html.includes('100% Open Source & Local'), 'Renders Open Source tab');
    assert.ok(html.includes('Recurring Free Plan'), 'Renders Recurring Free Plan tab');
    assert.ok(html.includes('No Account Required'), 'Renders No Account Required tab');
    assert.ok(html.includes('src="/logos/official-ai/ollama.png"'), 'Renders Ollama official brand logo');
    assert.ok(html.includes('src="/logos/claude.svg"'), 'Renders Claude official brand logo');
    assert.ok(html.includes('src="/logos/official-ai/chatgpt.webp"'), 'Renders ChatGPT icon sourced from OpenAI Help Center');
  });

  test('tool detail page renders high-res brand logo in hero header', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/tools/supabase');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Supabase'), 'Renders Supabase title');
    assert.ok(html.includes('src="/logos/supabase.svg"'), 'Renders official Supabase SVG logo in hero');
    assert.ok(html.includes('src="/logos/firebase.svg"'), 'Renders Firebase SVG logo in alternative chip');
  });

  test('alternative detail page renders proprietary target brand logo', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/alternatives/notion');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Notion'), 'Renders Notion header');
    assert.ok(html.includes('src="/logos/notion.svg"'), 'Renders Notion SVG logo in proprietary profile card');
  });

  test('AI tool detail page renders brand logo and verified pricing breakdown box', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/ai-tools/claude');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Claude'), 'Renders Claude title');
    assert.ok(html.includes('src="/logos/claude.svg"'), 'Renders Claude SVG logo in hero');
    assert.ok(html.includes('Pricing Structure &amp; Model Access') || html.includes('Pricing Structure & Model Access'), 'Renders pricing structure box');
    assert.ok(html.includes('Free Access Quota'), 'Renders free quota section');
    assert.ok(html.includes('Official Pricing'), 'Renders official pricing link button');
    assert.ok(html.includes('https://www.anthropic.com/pricing'), 'Links to official Anthropic pricing URL');
  });

  test('homepage renders official logos on open-source and proprietary software cards', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/');
    const html = renderClean(React.createElement(ssrModule.App));

    // Section 2 proprietary cards
    assert.ok(html.includes('src="/logos/figma.svg"') || html.includes('src="/logos/notion.svg"'), 'Proprietary cards render official SVGs');
    // Section 3 AI cards
    assert.ok(html.includes('src="/logos/runway.svg"') || html.includes('src="/logos/claude.svg"'), 'AI cards render official SVGs');
  });
});
