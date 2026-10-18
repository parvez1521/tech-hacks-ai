import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { categories } from '../src/data/categories.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { guidesData } from '../src/data/guidesData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { toolsData } from '../src/data/seedData.ts';
import { offersData } from '../src/data/offersData.ts';
import { siteConfig } from '../src/config/siteConfig.ts';

describe('Phase 15: Organic Growth, Content Quality & SEO Expansion', () => {
  let ssrModule;

  before(async () => {
    ssrModule = await import('../dist/test-ssr.js');
  });

  function setupMockBrowser(initialUrl = 'https://techhacksai.com/') {
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
        pushState: (state, title, url) => {
          const resolved = new URL(url, global.window.location.origin);
          global.window.location.pathname = resolved.pathname;
          global.window.location.search = resolved.search;
          global.window.location.href = resolved.toString();
        },
        replaceState: (state, title, url) => {
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
      navigator: {
        clipboard: {
          writeText: async () => {},
        },
      },
      scrollTo: () => {},
    };

    global.document = {
      title: '',
      querySelector: () => ({ setAttribute: () => {} }),
      querySelectorAll: () => [],
      documentElement: { classList: { toggle: () => {}, contains: () => false, add: () => {}, remove: () => {} } },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }

  function renderClean(element) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }

  // 1. Category Buyer Guides & Editorial Content
  describe('1. Category Buyer Guides & Editorial Metadata', () => {
    test('all 7 core categories have substantive buyer guide metadata', () => {
      assert.strictEqual(categories.length, 7);
      categories.forEach((cat) => {
        assert.ok(cat.editorialOverview, `Category ${cat.slug} missing editorialOverview`);
        assert.ok(cat.editorialOverview.length > 50, `Category ${cat.slug} editorialOverview too short`);
        assert.ok(cat.targetAudience, `Category ${cat.slug} missing targetAudience`);
        assert.ok(Array.isArray(cat.selectionCriteria), `Category ${cat.slug} missing selectionCriteria`);
        assert.ok(cat.selectionCriteria.length >= 3, `Category ${cat.slug} has fewer than 3 selection criteria`);
        assert.ok(Array.isArray(cat.keyDifferences), `Category ${cat.slug} missing keyDifferences`);
        assert.ok(cat.keyDifferences.length >= 2, `Category ${cat.slug} has fewer than 2 key differences`);
      });
    });

    test('developer-tools category buyer guide mentions hosting and cost tradeoffs', () => {
      const dev = categories.find((c) => c.slug === 'developer-tools');
      assert.ok(dev);
      assert.ok(dev.editorialOverview.includes('sovereignty') || dev.editorialOverview.includes('open-source'));
      assert.ok(dev.targetAudience.toLowerCase().includes('engineers') || dev.targetAudience.toLowerCase().includes('developers'));
    });
  });

  // 2. Proprietary Alternatives Migration Analysis
  describe('2. Proprietary Alternatives Migration Analysis', () => {
    test('all 14 proprietary software tools have migration drivers and cost reality notes', () => {
      assert.strictEqual(proprietaryTools.length, 14);
      proprietaryTools.forEach((tool) => {
        assert.ok(Array.isArray(tool.migrationDrivers), `${tool.name} missing migrationDrivers array`);
        assert.ok(tool.migrationDrivers.length >= 3, `${tool.name} has fewer than 3 migration drivers`);
        assert.ok(Array.isArray(tool.selectionCriteria), `${tool.name} missing selectionCriteria array`);
        assert.ok(tool.selectionCriteria.length >= 3, `${tool.name} has fewer than 3 selection criteria`);
        assert.ok(tool.hostedCostNote, `${tool.name} missing hostedCostNote`);
        assert.ok(tool.hostedCostNote.length > 20, `${tool.name} hostedCostNote too short`);
        assert.ok(tool.replacementsOverview, `${tool.name} missing replacementsOverview`);
      });
    });

    test('Claude Code and Perplexity have AI-specific hosting/inference cost realities', () => {
      const claude = proprietaryTools.find((t) => t.slug === 'claude-code');
      assert.ok(claude);
      assert.ok(claude.hostedCostNote.includes('inference') || claude.hostedCostNote.includes('token') || claude.hostedCostNote.includes('API'));

      const perplexity = proprietaryTools.find((t) => t.slug === 'perplexity');
      assert.ok(perplexity);
      assert.ok(perplexity.hostedCostNote.includes('SearXNG') || perplexity.hostedCostNote.includes('API') || perplexity.hostedCostNote.includes('Serper'));
    });
  });

  // 3. New Substantive Workflow Guides
  describe('3. New Substantive Workflow Guides', () => {
    test('contains the 3 new high-intent guides with full steps and references', () => {
      const codingGuide = guidesData.find((g) => g.slug === 'how-to-choose-ai-coding-assistant');
      assert.ok(codingGuide, 'Missing how-to-choose-ai-coding-assistant guide');
      assert.ok(codingGuide.steps.length >= 4, 'Coding assistant guide has fewer than 4 steps');
      assert.ok(codingGuide.relatedToolSlugs.includes('cursor'));
      assert.ok(codingGuide.relatedToolSlugs.includes('aider'));

      const studentGuide = guidesData.find((g) => g.slug === 'free-ai-student-benefits-guide');
      assert.ok(studentGuide, 'Missing free-ai-student-benefits-guide');
      assert.ok(studentGuide.steps.length >= 4, 'Student guide has fewer than 4 steps');
      assert.ok(studentGuide.summary.toLowerCase().includes('cloud compute') || studentGuide.title.toLowerCase().includes('credits'));

      const freePlansGuide = guidesData.find((g) => g.slug === 'evaluating-free-ai-plans');
      assert.ok(freePlansGuide, 'Missing evaluating-free-ai-plans guide');
      assert.ok(freePlansGuide.steps.length >= 4, 'Free plans guide has fewer than 4 steps');
      assert.ok(freePlansGuide.summary.includes('credits') || freePlansGuide.summary.includes('recurring'));
    });

    test('guides have valid author, publication date, and non-empty step templates', () => {
      guidesData.forEach((g) => {
        assert.ok(g.title);
        assert.ok(g.summary);
        assert.ok(g.author);
        assert.ok(g.publishedDate.startsWith('2026-'));
        assert.ok(g.steps.every((s) => s.title && s.description));
      });
    });
  });

  // 4. Compare Page Architecture & Framework
  describe('4. Compare Page Presets & Decision Framework', () => {
    test('renders comparison presets and decision framework without error', () => {
      setupMockBrowser('https://techhacksai.com/compare?tools=cursor,claude-code,aider');
      const html = renderClean(React.createElement(ssrModule.App));
      assert.ok(html.includes('Compare Open Source &amp; AI Software') || html.includes('Compare Open Source & AI Software'));
      assert.ok(html.includes('Popular Comparisons:'));
      assert.ok(html.includes('Cursor vs Claude Code vs Aider'));
      assert.ok(html.includes('Software Decision-Making Framework'));
      assert.ok(html.includes('Self-Hosted vs. Cloud SaaS'));
      assert.ok(html.includes('Fixed SaaS vs. BYOK Token Economics'));
      assert.ok(html.includes('Licensing &amp; Commercial Freedom') || html.includes('Licensing & Commercial Freedom'));
      assert.ok(html.includes('Practical Selection Cheat Sheet'));
    });
  });

  // 5. Technical SEO & Metadata
  describe('5. Technical SEO & Metadata Generation', () => {
    test('robots.txt disallows /saved and lists sitemap', () => {
      const robotsContent = fs.readFileSync(path.resolve('public/robots.txt'), 'utf8');
      assert.ok(robotsContent.includes('Disallow: /saved'), 'robots.txt must disallow /saved');
      assert.ok(robotsContent.includes('Sitemap: https://techhacksai.com/sitemap.xml'), 'robots.txt must declare sitemap.xml');
    });

    test('sitemap.xml contains the 3 new substantive guides', () => {
      const sitemapContent = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');
      assert.ok(sitemapContent.includes('https://techhacksai.com/guides/how-to-choose-ai-coding-assistant'));
      assert.ok(sitemapContent.includes('https://techhacksai.com/guides/free-ai-student-benefits-guide'));
      assert.ok(sitemapContent.includes('https://techhacksai.com/guides/evaluating-free-ai-plans'));
    });

    test('getRouteDescription generates distinct non-empty descriptions for all route types', () => {
      const guideDesc = ssrModule.getRouteDescription('guide-detail', { slug: 'how-to-choose-ai-coding-assistant' });
      assert.ok(guideDesc.includes('Cursor vs Claude Code vs Aider vs Cline'));
      assert.ok(!guideDesc.includes('undefined'));

      const catDesc = ssrModule.getRouteDescription('category-detail', { slug: 'developer-tools' });
      assert.ok(catDesc.includes('Developer Tools'));

      const altDesc = ssrModule.getRouteDescription('alternative-detail', { slug: 'firebase' });
      assert.ok(altDesc.includes('Firebase'));

      const offerDesc = ssrModule.getRouteDescription('offer-detail', { slug: 'jio-google-gemini-offer' });
      assert.ok(offerDesc.includes('Jio') || offerDesc.includes('Gemini'));
    });

    test('getRouteTitle formats descriptive page titles', () => {
      const guideTitle = ssrModule.getRouteTitle('guide-detail', { slug: 'how-to-choose-ai-coding-assistant' });
      assert.ok(guideTitle.includes('How to Choose an AI Coding Assistant'));
      assert.ok(guideTitle.includes('Tech Hacks AI'));

      const compareTitle = ssrModule.getRouteTitle('compare');
      assert.ok(compareTitle.includes('Side-by-Side Tool Comparison'));
    });
  });

  // 6. Structured Data & Internal Linking
  describe('6. Structured Data & Internal Linking', () => {
    test('GuideDetailPage renders HowTo schema script and canonical share button', () => {
      setupMockBrowser('https://techhacksai.com/guides/how-to-choose-ai-coding-assistant');
      const html = renderClean(React.createElement(ssrModule.App));
      assert.ok(html.includes('"@type":"HowTo"'));
      assert.ok(html.includes('HowToStep'));
      assert.ok(html.includes('Share'));
      assert.ok(html.includes('Tools &amp; Models Used') || html.includes('Tools & Models Used'));
    });

    test('CategoryDetailPage renders buyer guide editorial sections and related guides', () => {
      setupMockBrowser('https://techhacksai.com/categories/developer-tools');
      const html = renderClean(React.createElement(ssrModule.App));
      assert.ok(html.includes('Open Source Developer Tools'));
      assert.ok(html.includes('Category Discovery &amp; Buyer Guide') || html.includes('Category Discovery & Buyer Guide'));
      assert.ok(html.includes('Who Benefits Most'));
      assert.ok(html.includes('Key Architectural Trade-Offs'));
      assert.ok(html.includes('How to Choose Between Options'));
      assert.ok(html.includes('Step-by-Step Guides for'));
    });

    test('AlternativeDetailPage renders migration drivers, cost reality, and related guides', () => {
      setupMockBrowser('https://techhacksai.com/alternatives/firebase');
      const html = renderClean(React.createElement(ssrModule.App));
      assert.ok(html.includes('Why Teams Look for Firebase Alternatives'));
      assert.ok(html.includes('Hosting &amp; Inference Reality') || html.includes('Hosting & Inference Reality'));
      assert.ok(html.includes('Key Selection Factors'));
      assert.ok(html.includes('Compare Top Replacements'));
      assert.ok(html.includes('Step-by-Step Guides for'));
    });

    test('AiToolDetailPage renders SoftwareApplication schema, audience, and compare quick-action', () => {
      setupMockBrowser('https://techhacksai.com/ai-tools/cursor');
      const html = renderClean(React.createElement(ssrModule.App));
      assert.ok(html.includes('"@type":"SoftwareApplication"'));
      assert.ok(html.includes('Who It&#x27;s Best Suited For') || html.includes("Who It's Best Suited For"));
      assert.ok(html.includes('Execution Environment'));
      assert.ok(html.includes('Side-by-Side Comparison'));
      assert.ok(html.includes('Compare Cursor'));
    });

    test('OfferDetailPage renders Offer schema, share button, and related educational guides', () => {
      setupMockBrowser('https://techhacksai.com/offers/jio-google-gemini-offer');
      const html = renderClean(React.createElement(ssrModule.App));
      assert.ok(html.includes('"@type":"Offer"'));
      assert.ok(html.includes('Related Guides &amp; Benefit Tutorials') || html.includes('Related Guides & Benefit Tutorials'));
      assert.ok(html.includes('The Definitive Guide to Free AI &amp; Cloud Credits') || html.includes('The Definitive Guide to Free AI & Cloud Credits'));
    });
  });
});
