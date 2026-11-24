import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';
import { proprietaryTools } from '../src/data/alternatives.ts';
import {
  getToolsForProprietary,
  getProprietaryToolBySlug,
} from '../src/services/catalogService.ts';
import { getAiToolsForProprietary } from '../src/services/aiCatalogService.ts';

describe('AdSense thin alternatives (2026-11-24 audit)', () => {
  let ssrModule;

  before(() => {
    if (!fs.existsSync(path.resolve(process.cwd(), 'dist/test-ssr.js'))) {
      execSync(
        './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
        { stdio: 'pipe' },
      );
    }
  });

  function setupMockBrowser(initialUrl = 'https://switchroute.in/') {
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

  async function renderAlternative(slug) {
    ssrModule = await import('../dist/test-ssr.js');
    setupMockBrowser(`https://switchroute.in/alternatives/${slug}`);
    return renderClean(React.createElement(ssrModule.App));
  }

  test('noindex list is exactly the computed empty set (0 replacements, 0 AI recommendations)', () => {
    const listed = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), 'scripts/noindex-alternative-slugs.json'), 'utf8'),
    );
    const computed = proprietaryTools
      .filter(
        (tool) =>
          getToolsForProprietary(tool.slug).length === 0 &&
          getAiToolsForProprietary(tool.slug).length === 0,
      )
      .map((tool) => tool.slug)
      .sort();
    assert.deepStrictEqual(
      [...listed].sort(),
      computed,
      'scripts/noindex-alternative-slugs.json must match the empty set from live data; update the list when mappings change',
    );
    assert.ok(listed.length > 0, 'Noindex list must not be empty');
  });

  test('detail pages make no unverified "verified" claim', async () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/pages/AlternativeDetailPage.tsx'),
      'utf8',
    );
    assert.doesNotMatch(source, /verified replacement/, 'Source must not call replacements verified');
    assert.doesNotMatch(source, /verified open source/, 'Source must not call the index verified');

    const html = await renderAlternative('notion');
    assert.ok(html.includes('22 open source replacements'), 'Badge states the honest count');
    assert.ok(!html.includes('verified replacements'), 'Rendered page states no verified claim');
  });

  test('at-a-glance block renders unique data-driven prose per page', async () => {
    const notionTop = [...getToolsForProprietary('notion')].sort((a, b) => b.stars - a.stars)[0];
    const notionHtml = await renderAlternative('notion');
    assert.ok(notionHtml.includes('At a glance: Notion alternatives'), 'Notion has the block');
    assert.ok(
      notionHtml.includes('We list 22 open source replacements for Notion'),
      'Notion block states its own count',
    );
    assert.ok(
      notionHtml.includes(
        `The most starred is ${notionTop.name}, with ${notionTop.stars.toLocaleString()} stars under the ${notionTop.license} license.`,
      ),
      'Notion block names its own top replacement',
    );

    const abletonHtml = await renderAlternative('ableton-live');
    assert.ok(
      abletonHtml.includes('We list 1 open source replacement for Ableton Live'),
      'Single-replacement page uses the singular form',
    );
    assert.ok(
      !abletonHtml.includes('We list 22 open source replacements'),
      'Thin page does not repeat another page’s copy',
    );
  });

  test('video target with no open source replacements still gets an honest at-a-glance', async () => {
    const html = await renderAlternative('synthesia');
    assert.ok(
      html.includes('We have not indexed open source replacements for Synthesia yet.'),
      'States the gap instead of inventing replacements',
    );
    assert.ok(
      html.includes('We also list 1 related generators and model workflows.'),
      'Lists the AI recommendations that do exist',
    );
  });

  test('empty noindexed page shows the empty state and no at-a-glance block', async () => {
    const html = await renderAlternative('angellist');
    assert.ok(html.includes('No Alternatives Mapped Yet'), 'Empty page explains the gap');
    assert.ok(!html.includes('at-a-glance-heading'), 'Empty page has no at-a-glance block');
  });

  test('dead outbound links are fixed: shut-down products have no Visit button', async () => {
    const cycle = getProprietaryToolBySlug('cycle');
    const fastgen = getProprietaryToolBySlug('fastgen');
    const rewind = getProprietaryToolBySlug('rewind-ai');
    assert.strictEqual(cycle.websiteUrl, undefined, 'Cycle shut down 31 Oct 2025; no live site remains');
    assert.strictEqual(fastgen.websiteUrl, undefined, 'Fastgen platform shut down; no live site remains');
    assert.strictEqual(
      rewind.websiteUrl,
      'https://limitless.ai',
      'Rewind rebranded to Limitless; link follows the successor',
    );

    const cycleHtml = await renderAlternative('cycle');
    assert.ok(!cycleHtml.includes('Visit Cycle Official Website'), 'No dead Visit button for Cycle');
    const figmaHtml = await renderAlternative('figma');
    assert.ok(
      figmaHtml.includes('Visit Figma Official Website'),
      'Live products keep their Visit button',
    );
  });

  test('sitemap generator excludes noindexed alternatives and removes prior entries', () => {
    // The generator also adds any missing candidates (pre-existing behaviour);
    // restore the committed sitemap afterwards so this test leaves no diff.
    const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
    const original = fs.readFileSync(sitemapPath, 'utf8');
    try {
      execSync('node --experimental-strip-types scripts/generate-prompt-sitemap.mjs', {
        stdio: 'pipe',
      });
      const sitemap = fs.readFileSync(sitemapPath, 'utf8');
      const listed = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), 'scripts/noindex-alternative-slugs.json'), 'utf8'),
      );
      for (const slug of listed) {
        assert.ok(
          !sitemap.includes(`https://switchroute.in/alternatives/${slug}`),
          `Sitemap must not advertise /alternatives/${slug}`,
        );
      }
    } finally {
      fs.writeFileSync(sitemapPath, original);
    }
  });

  test('prerender serves noindexed alternatives with noindex,follow', () => {
    const prerenderSource = fs.readFileSync(
      path.resolve(process.cwd(), 'scripts/prerender-site.mjs'),
      'utf8',
    );
    assert.ok(
      prerenderSource.includes('noindex-alternative-slugs.json'),
      'Prerender reads the shared noindex list',
    );
    assert.ok(
      prerenderSource.includes('...noindexAlternativePaths'),
      'Prerender adds noindexed paths to the noindex set and render list',
    );
    assert.ok(
      prerenderSource.includes('!noindexAlternativePaths.includes(pathname)'),
      'Prerender keeps noindexed paths out of the cleaned sitemap',
    );
  });

  test('no hardcoded stale review dates on the homepage or model pages', () => {
    for (const file of [
      'src/pages/HomePage.tsx',
      'src/pages/FreeAiSitesPage.tsx',
      'src/pages/FrontierModelsPage.tsx',
    ]) {
      const source = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
      assert.doesNotMatch(source, /3 Nov 2026/, `${file} must not carry a stale checked date`);
    }
  });
});
