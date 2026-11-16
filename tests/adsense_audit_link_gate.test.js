import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { toolsData } from '../src/data/seedData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { guidesData } from '../src/data/guidesData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { promptsData } from '../src/data/promptsData.ts';
import { hasToolDetailPage, getToolDetailUrl } from '../src/services/catalogService.ts';
import { universalSearch, getPickRecommendations } from '../src/services/aiCatalogService.ts';
import { generateGroundedResponse } from '../src/services/chatRetrievalService.ts';

/**
 * Regression tests for the 2026-11-16 AdSense audit (4th rejection).
 * The audit found 780 dead internal /tools/* links: every replacement chip
 * linked `/tools/${slug}` with no existence check, while only 27 tool
 * slugs have a prerendered detail page. These tests pin the gate shut.
 */

const FEATURED_SLUGS = toolsData.filter((t) => t.featuredOrder).map((t) => t.slug);
const featuredSet = new Set(FEATURED_SLUGS);

function extractToolHrefs(html) {
  return [...html.matchAll(/href="\/tools\/([a-z0-9-]+)"/g)].map((m) => m[1]);
}

function assertNoDeadToolLinks(html, page) {
  for (const slug of extractToolHrefs(html)) {
    assert.ok(
      featuredSet.has(slug),
      `${page} links dead /tools/${slug} (no prerendered detail page)`
    );
  }
}

describe('AdSense audit 2026-11-16: dead /tools/* link gate', () => {
  test('featured tools are exactly the sitemap /tools/* pages', () => {
    const sitemap = fs.readFileSync(path.resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');
    const sitemapToolSlugs = [...sitemap.matchAll(/<loc>https:\/\/switchroute\.in\/tools\/([a-z0-9-]+)<\/loc>/g)].map((m) => m[1]);
    assert.strictEqual(sitemapToolSlugs.length, 27, 'Sitemap should list 27 /tools detail pages');
    assert.deepStrictEqual(new Set(sitemapToolSlugs), featuredSet);
    assert.strictEqual(FEATURED_SLUGS.length, 27);
  });

  test('hasToolDetailPage / getToolDetailUrl gate on featuredOrder', () => {
    for (const slug of FEATURED_SLUGS) {
      assert.strictEqual(hasToolDetailPage(slug), true, `${slug} should have a detail page`);
      assert.strictEqual(getToolDetailUrl(slug), `/tools/${slug}`);
    }
    for (const slug of ['bitwarden', 'logseq', 'activepieces', 'ghost', 'wordpress']) {
      assert.strictEqual(hasToolDetailPage(slug), false, `${slug} must not link a detail page`);
      assert.strictEqual(getToolDetailUrl(slug), null);
    }
    assert.strictEqual(hasToolDetailPage('does-not-exist'), false);
    assert.strictEqual(hasToolDetailPage(null), false);
    assert.strictEqual(getToolDetailUrl(undefined), null);
    const bitwarden = toolsData.find((t) => t.slug === 'bitwarden');
    assert.ok(bitwarden);
    assert.strictEqual(hasToolDetailPage(bitwarden), false);
  });

  test('universalSearch never returns an open-source tool without a detail page', () => {
    assert.deepStrictEqual(universalSearch('bitwarden').openSourceTools, []);
    assert.deepStrictEqual(universalSearch('logseq').openSourceTools, []);
    const n8n = universalSearch('n8n').openSourceTools;
    assert.ok(n8n.some((t) => t.slug === 'n8n'), 'Featured tools must stay searchable');
    for (const query of ['code', 'notes', 'automation', 'alternative to notion', 'local llm']) {
      for (const tool of universalSearch(query).openSourceTools) {
        assert.ok(featuredSet.has(tool.slug), `Search result ${tool.slug} has no detail page`);
      }
    }
  });

  test('Help Me Pick open-source results carry a detail URL only when one exists', () => {
    const recs = getPickRecommendations({
      goal: 'open-source-software',
      budget: 'completely-free',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    });
    assert.ok(recs.length > 0, 'Expected open-source recommendations');
    for (const rec of recs) {
      if (rec.type !== 'open-source') continue;
      if (rec.detailUrl === null) continue;
      assert.ok(
        rec.detailUrl.startsWith('/tools/') && featuredSet.has(rec.detailUrl.slice('/tools/'.length)),
        `Pick result ${rec.tool.name} links dead ${rec.detailUrl}`
      );
    }
  });

  test('chatbot grounded replies never link a dead /tools/* page', () => {
    for (const query of [
      'open source alternatives to notion',
      'open source alternatives to figma',
      'find open source note taking tools',
      'best open source tools for coding',
    ]) {
      const reply = generateGroundedResponse(query);
      for (const slug of [...reply.text.matchAll(/\/tools\/([a-z0-9-]+)/g)].map((m) => m[1])) {
        assert.ok(featuredSet.has(slug), `Chat reply links dead /tools/${slug} for "${query}"`);
      }
    }
  });

  describe('SSR sweep: every prerendered page links only live /tools/* pages', () => {
    let ssrModule;

    before(async () => {
      ssrModule = await import('../dist/test-ssr.js');
    });

    function setupMockBrowser(initialUrl) {
      const parsedUrl = new URL(initialUrl);
      const mockStorage = {};
      global.window = {
        location: {
          href: parsedUrl.toString(),
          origin: parsedUrl.origin,
          pathname: parsedUrl.pathname,
          search: parsedUrl.search,
        },
        history: {
          pushState: (_state, _title, url) => {
            const resolved = new URL(url, global.window.location.origin);
            global.window.location.pathname = resolved.pathname;
            global.window.location.search = resolved.search;
            global.window.location.href = resolved.toString();
          },
          replaceState: (_state, _title, url) => {
            const resolved = new URL(url, global.window.location.origin);
            global.window.location.pathname = resolved.pathname;
            global.window.location.search = resolved.search;
            global.window.location.href = resolved.toString();
          },
        },
        localStorage: {
          getItem: (k) => mockStorage[k] || null,
          setItem: (k, v) => { mockStorage[k] = String(v); },
          removeItem: (k) => { delete mockStorage[k]; },
        },
        navigator: { clipboard: { writeText: async () => {} } },
        scrollTo: () => {},
        innerWidth: 1440,
        innerHeight: 900,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      global.document = {
        title: '',
        querySelector: () => ({ setAttribute: () => {} }),
        querySelectorAll: () => [],
        documentElement: {
          classList: { toggle: () => {}, contains: () => false, add: () => {}, remove: () => {} },
          dataset: {},
          style: {},
        },
        body: { classList: { add: () => {}, remove: () => {} } },
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    }

    function renderPage(url) {
      setupMockBrowser(url);
      return ReactDOMServer.renderToStaticMarkup(React.createElement(ssrModule.App));
    }

    test('all 970 /alternatives/* pages link only live /tools/* pages', () => {
      assert.strictEqual(proprietaryTools.length, 970);
      let checkedLinks = 0;
      for (const target of proprietaryTools) {
        const html = renderPage(`https://switchroute.in/alternatives/${target.slug}`);
        assertNoDeadToolLinks(html, `/alternatives/${target.slug}`);
        checkedLinks += extractToolHrefs(html).length;
      }
      // Featured replacements must still link: the gate removes dead links,
      // it does not remove the linking itself.
      assert.ok(checkedLinks > 0, 'Expected some live /tools links across alternatives pages');
    });

    test('/alternatives index links only live /tools/* pages', () => {
      const html = renderPage('https://switchroute.in/alternatives');
      assertNoDeadToolLinks(html, '/alternatives');
    });

    test('every /tools index page links only live /tools/* pages', () => {
      const totalPages = Math.ceil(toolsData.length / 12);
      for (let page = 1; page <= totalPages; page += 1) {
        const html = renderPage(`https://switchroute.in/tools?page=${page}`);
        assertNoDeadToolLinks(html, `/tools?page=${page}`);
      }
    });

    test('all /tools/* detail pages link only live /tools/* pages', () => {
      for (const slug of FEATURED_SLUGS) {
        const html = renderPage(`https://switchroute.in/tools/${slug}`);
        assertNoDeadToolLinks(html, `/tools/${slug}`);
      }
    });

    test('all /guides/* pages link only live /tools/* pages', () => {
      for (const guide of guidesData) {
        const html = renderPage(`https://switchroute.in/guides/${guide.slug}`);
        assertNoDeadToolLinks(html, `/guides/${guide.slug}`);
      }
    });
  });
});

describe('AdSense audit 2026-11-16: Ox Alpha pricing correction', () => {
  test('Ox Alpha is no longer listed as a free model with an official free chat', () => {
    const ox = aiToolsData.find((t) => t.slug === 'ox-alpha');
    assert.ok(ox, 'Ox Alpha record must exist');
    assert.notStrictEqual(ox.pricingType, 'free', 'Free preview ended 26 Aug 2026');
    assert.strictEqual(ox.pricingType, 'freemium');
    assert.strictEqual(ox.pricingVerifiedAt, '2026-11-16');
    assert.ok(!ox.freeTierSummary.toLowerCase().includes('official website'), 'oxalpha.com is an independent chat interface, not the official site');
    assert.ok(ox.freeTierSummary.includes('GLM-5.3-Flash'), 'Summary must name the revealed model');
    assert.ok(ox.description.includes('26 August 2026'), 'Description must record the reveal date');
    assert.ok(ox.pricingDetails.includes('26 August 2026'));
    assert.strictEqual(ox.pricingSourceUrl, 'https://openrouter.ai/z-ai/glm-5.3-flash');
  });
});

describe('AdSense audit 2026-11-16: Aaghaz attribution', () => {
  test('premium website prompts link the Aaghaz source', () => {
    const prompt = promptsData.find((p) => p.slug === 'premium-website-prompts-part-1');
    assert.ok(prompt, 'Premium prompts record must exist');
    assert.strictEqual(prompt.sourceUrl, 'https://aaghaz.ai');
    assert.ok(prompt.sourceCreator.includes('Aaghaz'));
    assert.ok(prompt.sourceCreator.includes('@make.first.million'));
  });
});

describe('AdSense audit 2026-11-16: guide depth', () => {
  test('every guide carries 700+ words of original prose (summary + steps)', () => {
    const wc = (s) => s.split(/\s+/).filter(Boolean).length;
    for (const guide of guidesData) {
      const prose = wc(guide.summary) + guide.steps.reduce((n, s) => n + wc(s.description), 0);
      assert.ok(prose >= 700, `${guide.slug} has only ${prose} prose words`);
    }
  });
});
