import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { execSync } from 'child_process';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { guidesData } from '../src/data/guidesData.ts';
import { promptsData } from '../src/data/promptsData.ts';
import { freeToolsData } from '../src/data/freeToolsData.ts';
import {
  filterAndSortAiTools,
  getAiToolBySlug,
  getGuideBySlug,
  getPromptBySlug,
  getFreeToolBySlug,
  universalSearch,
} from '../src/services/aiCatalogService.ts';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  clearBookmarks,
  isBookmarked,
} from '../src/services/bookmarkService.ts';

describe('Phase 6: Homepage Redesign & HandlyTech Platform Integration', () => {
  let ssrModule;

  before(() => {
    // Recompile SSR bundle
    execSync(
      './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
      { stdio: 'pipe' }
    );
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
        setItem: (k, v) => {
          mockStorage[k] = v;
        },
        removeItem: (k) => {
          delete mockStorage[k];
        },
        clear: () => {
          Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
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

  // -------------------------------------------------------------------------
  // 1. Redesigned Homepage
  // -------------------------------------------------------------------------
  test('Redesigned Homepage renders the compact discovery architecture', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('id="home-hero-heading"') && html.includes('Find the right AI route for the work.'), 'Current hero heading renders');
    assert.ok(html.includes('type="search"') || html.includes('role="combobox"'), 'Universal search renders in the hero');
    for (const name of ['Frontier Models', 'Free Access', 'All AI Tools', 'GitHub Projects', 'AI categories', 'Daily discoveries', 'Selected offers', 'Resources and directories']) assert.ok(html.includes(name), `${name} is discoverable`);
    for (const route of ['/alternatives', '/free-tools', '/guides']) assert.ok(html.includes(`href="${route}"`), `${route} remains linked`);
  });

  // -------------------------------------------------------------------------
  // 2. AI Tools Directory & Details
  // -------------------------------------------------------------------------
  test('/ai-tools route renders AI platforms directory and filters', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/ai-tools');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('AI Tools Directory: Discover &amp; Compare AI Platforms') || html.includes('AI Tools Directory: Discover & Compare AI Platforms'), 'AI directory title');
    assert.ok(html.includes('Runway AI Video'), 'Renders the current Runway catalog label');
    assert.ok(html.includes('Cursor Editor'), 'Renders Cursor');
    assert.ok(html.includes('Claude'), 'Renders Claude');
    assert.ok(html.includes('href="/ai-tools/cursor"'), 'Links to /ai-tools/cursor');
  });

  test('/ai-tools/:slug renders deep metadata, pricing, and official outbound link', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/ai-tools/cursor');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Cursor Editor'), 'Renders tool name');
    assert.ok(html.includes('Core Capabilities &amp; Features') || html.includes('Core Capabilities & Features'), 'Features heading');
    assert.ok(html.includes('https://cursor.com'), 'Contains link to cursor.com');
    assert.ok(html.includes('Visit Official Website'), 'Official website link text');
    assert.ok(html.includes('Pricing Structure'), 'Pricing structure box');
  });

  test('KIE AI card and detail CTAs use the affiliate URL with disclosure while preserving canonical URLs', async () => {
    const affiliateUrl = 'https://kie.ai?ref=db7baff2ed7877243971150d4ea6ade2';
    const kie = aiToolsData.find((tool) => tool.slug === 'kie-ai');
    assert.ok(kie, 'KIE AI exists');
    assert.equal(kie.websiteUrl, 'https://kie.ai', 'Official website remains canonical');
    assert.equal(kie.affiliateUrl, affiliateUrl, 'Affiliate destination matches exactly');
    assert.equal(kie.pricingSourceUrl, 'https://kie.ai/pricing', 'Official pricing source remains unchanged');

    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/ai-tools?q=KIE');
    const directoryHtml = renderClean(React.createElement(ssrModule.App));
    assert.match(directoryHtml, new RegExp(`href="${affiliateUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*rel="noopener noreferrer sponsored nofollow"`));
    assert.match(directoryHtml, /Affiliate link · SwitchRoute may earn a commission from qualifying activity\./);

    setupMockBrowser('https://openalternative.co/ai-tools?q=Cursor');
    const otherToolHtml = renderClean(React.createElement(ssrModule.App));
    assert.match(otherToolHtml, /href="https:\/\/cursor\.com"[^>]*rel="noopener noreferrer"/);

    setupMockBrowser('https://openalternative.co/ai-tools/kie-ai');
    const detailHtml = renderClean(React.createElement(ssrModule.App));
    assert.match(detailHtml, new RegExp(`href="${affiliateUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*rel="noopener noreferrer sponsored nofollow"`));
    assert.match(detailHtml, /Try KIE AI/);
    assert.match(detailHtml, /https:\/\/kie\.ai\/pricing/);

    setupMockBrowser('https://openalternative.co/compare?tools=kie-ai,cursor');
    const comparisonHtml = renderClean(React.createElement(ssrModule.App));
    assert.match(comparisonHtml, new RegExp(`href="${affiliateUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*rel="noopener noreferrer sponsored nofollow"`));
    assert.match(comparisonHtml, /https:\/\/cursor\.com/);
    assert.match(comparisonHtml, /Affiliate link · SwitchRoute may earn a commission from qualifying activity\./);
  });

  test('Unknown AI tool slug renders 404 state', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/ai-tools/non-existent-ai');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('AI Tool Not Found'), 'Renders AI Tool Not Found');
    assert.ok(html.includes('href="/ai-tools"'), 'Has link back to /ai-tools');
  });

  // -------------------------------------------------------------------------
  // 3. Free AI Sites
  // -------------------------------------------------------------------------
  test('/free-ai-sites renders only free/freemium AI platforms', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/free-ai-sites');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Free AI Access'), 'Free access heading');
    assert.ok(html.includes('FLUX.1 by Black Forest Labs'), 'FLUX is listed as free/freemium');
    // Midjourney is paid only and should not appear in 100% free catalog
    assert.ok(!html.includes('Midjourney v6.1'), 'Paid-only tools like Midjourney are excluded from free sites');
  });

  // -------------------------------------------------------------------------
  // 4. Guides & Tutorials
  // -------------------------------------------------------------------------
  test('/guides directory renders searchable guides', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/guides');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Step-by-Step AI Guides &amp; Workflows') || html.includes('Step-by-Step AI Guides & Workflows'), 'Guides directory heading');
    assert.ok(html.includes('Building Full-Stack Web Apps in Hours with Cursor and Supabase'), 'Renders Cursor & Supabase guide');
    assert.ok(html.includes('href="/guides/building-apps-with-cursor-supabase"'), 'Links to guide detail');
  });

  test('/guides/:slug renders step-by-step instructions and copyable prompt templates', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/guides/cinematic-ai-video-workflow');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('A Practical Cinematic AI Video Workflow with FLUX and Runway'), 'Renders current guide title');
    assert.ok(html.includes('Step-by-Step Instructions'), 'Renders steps heading');
    assert.ok(html.includes('Build a reference frame before generating motion'), 'Renders current step 1');
    assert.ok(html.includes('Recommended Prompt Template'), 'Renders prompt template label');
    assert.ok(html.includes('Copy Prompt'), 'Renders copy prompt button');
    assert.ok(html.includes('Tools &amp; Models Used in this Guide') || html.includes('Tools & Models Used in this Guide'), 'Tools section');
  });

  // -------------------------------------------------------------------------
  // 5. Prompt Library
  // -------------------------------------------------------------------------
  test('/prompt-library directory renders prompt recipes with model badges', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/prompt-library');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Find a prompt. Make it yours.') || html.includes('Find a prompt. Make it yours.'), 'Prompt library heading');
    assert.ok(html.includes('Cinematic Anamorphic Studio Portrait'), 'Renders portrait prompt');
    assert.ok(promptsData.some((prompt) => prompt.slug === 'saas-landing-page-architecture' && prompt.title === 'Modern Full-Stack SaaS Architecture Blueprint'), 'SaaS prompt remains in the paginated catalog');
    assert.ok(html.includes('Copy Prompt'), 'Renders copy prompt button');
  });

  test('/prompt-library/:slug renders full prompt and optimization tips', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/prompt-library/saas-landing-page-architecture');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Modern Full-Stack SaaS Architecture Blueprint'), 'Prompt title');
    assert.ok(html.includes('Prompt Instructions'), 'Instructions header');
    assert.ok(html.includes('Optimization Tips &amp; Parameters') || html.includes('Optimization Tips & Parameters'), 'Tips header');
  });

  // -------------------------------------------------------------------------
  // 6. Free Browser Utilities
  // -------------------------------------------------------------------------
  test('/free-tools renders utilities catalog with client-side indicators', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/free-tools');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Free Browser-Based Utilities'), 'Utilities heading');
    assert.ok(html.includes('100% Client-Side') || html.includes('Client-Side'), 'Client-side badge');
    assert.ok(html.includes('href="/free-tools/image-resizer"'), 'Links to image resizer');
    assert.ok(html.includes('href="/free-tools/qr-generator"'), 'Links to QR generator');
  });

  test('/free-tools/:slug renders interactive utility runner', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/free-tools/qr-generator');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Vector QR Code Generator'), 'Renders tool title');
    assert.ok(html.includes('Target URL or Text'), 'Renders input label');
    assert.ok(html.includes('Download PNG'), 'Renders download button');
  });

  // -------------------------------------------------------------------------
  // 7. Comparison & Guided Discovery
  // -------------------------------------------------------------------------
  test('/compare renders side-by-side comparison matrix with URL persistence', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/compare?tools=supabase,cursor');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Compare Open Source &amp; AI Software') || html.includes('Compare Open Source & AI Software'), 'Compare title');
    assert.ok(html.includes('Supabase'), 'Compares Supabase');
    assert.ok(html.includes('Cursor Editor'), 'Compares Cursor');
    assert.ok(html.includes('Self-Hostable (Docker / Local)'), 'Distinguishes self-hostability');
  });

  test('/pick guided questionnaire renders recommendation flow', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser('https://openalternative.co/pick');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Help Me Pick the Right Tool'), 'Pick wizard title');
    assert.ok(html.includes('Build a Web App or Backend'), 'Option 1');
    assert.ok(html.includes('Generate Video or Images'), 'Option 2');
    assert.ok(html.includes('Next Step'), 'Next step button');
  });

  // -------------------------------------------------------------------------
  // 8. Bookmarks / Saved Items
  // -------------------------------------------------------------------------
  test('Bookmarks service correctly persists and queries saved items', () => {
    setupMockBrowser('https://openalternative.co/saved');
    clearBookmarks();
    assert.strictEqual(getBookmarks().length, 0, 'Initially empty');

    addBookmark({
      id: 'ai-cursor',
      type: 'ai-tool',
      slug: 'cursor',
      title: 'Cursor Editor',
      subtitle: 'AI Code Editor',
      url: '/ai-tools/cursor',
      savedAt: new Date().toISOString(),
    });

    assert.strictEqual(getBookmarks().length, 1, 'Contains 1 saved item');
    assert.ok(isBookmarked('ai-cursor'), 'isBookmarked returns true');

    removeBookmark('ai-cursor');
    assert.strictEqual(getBookmarks().length, 0, 'Item removed');
  });

  // -------------------------------------------------------------------------
  // 9. Universal Search
  // -------------------------------------------------------------------------
  test('universalSearch returns grouped matches across multiple categories', () => {
    const videoResults = universalSearch('video');
    assert.ok(videoResults.totalMatches > 0, 'Finds video matches');
    assert.ok(videoResults.aiTools.length > 0, 'Contains AI video tools');

    const codingResults = universalSearch('cursor');
    assert.ok(codingResults.aiTools.some((t) => t.slug === 'cursor'), 'Finds Cursor in AI tools');
  });
});
