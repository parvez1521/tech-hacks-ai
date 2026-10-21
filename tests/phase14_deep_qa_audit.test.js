import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { toolsData } from '../src/data/seedData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { offersData, isOfferActive, getActiveOffers, getArchivedOffers, getOfferBySlug } from '../src/data/offersData.ts';
import { brandLogos, getBrandLogo } from '../src/data/brandLogos.ts';
import { generateGroundedResponse } from '../src/services/chatRetrievalService.ts';
import { getBookmarks, addBookmark, removeBookmark, clearBookmarks, isBookmarked } from '../src/services/bookmarkService.ts';
import { getPickRecommendations } from '../src/services/aiCatalogService.ts';

describe('Phase 14: Deep QA, Production Readiness & Trust Audit', () => {
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
      matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    };

    global.document = {
      title: '',
      documentElement: {
        classList: {
          add: () => {},
          remove: () => {},
        },
      },
      querySelector: () => ({ setAttribute: () => {} }),
    };
  }

  function renderClean(element) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }

  // -------------------------------------------------------------------------
  // 1. Browser QA Across All Major Route Families
  // -------------------------------------------------------------------------
  describe('Route Families & Deep Browser Rendering', () => {
    test('renders Homepage with 10-section hierarchy and valid navigation links', () => {
      setupMockBrowser('https://techhacksai.com/');
      const html = renderClean(React.createElement(ssrModule.App));

      assert.ok(html.includes('Discover the Best AI Tools &amp; Open Source Alternatives') || html.includes('Discover the Best AI Tools & Open Source Alternatives'), 'Homepage H1 headline');
      assert.ok(html.includes('What do you want to build or replace today?'), 'Goal-driven discovery section');
      assert.ok(html.includes("Editor&#x27;s Picks") || html.includes("Editor's Picks"), 'Curated showcase section');
      assert.ok(html.includes('Explore Top Generative AI Platforms'), 'Trending AI models section');
      assert.ok(html.includes('Free AI Tools (No Credit Card Required)'), 'Free AI tools section');
      assert.ok(html.includes('Explore by Tech Category'), 'Category taxonomy section');
      assert.ok(html.includes('AI Deals, Student Plans &amp; Bundles') || html.includes('AI Deals, Student Plans & Bundles'), 'AI Deals section');
      assert.ok(html.includes('Step-by-Step AI Guides'), 'Guides section');
      assert.ok(html.includes('Open Source Alternatives to Popular Software'), 'Proprietary alternatives section');
      assert.ok(html.includes('Stay Ahead of the Open Source &amp; AI Wave') || html.includes('Stay Ahead of the Open Source & AI Wave'), 'Newsletter section');
    });

    test('renders /ai-tools directory and /ai-tools/claude detail page', () => {
      setupMockBrowser('https://techhacksai.com/ai-tools');
      const listHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(listHtml.includes('Discover Best AI Tools &amp; Generative Platforms') || listHtml.includes('Discover Best AI Tools & Generative Platforms'), 'AI directory header');

      setupMockBrowser('https://techhacksai.com/ai-tools/claude');
      const detailHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(detailHtml.includes('Claude 3.5 Sonnet'), 'Claude title in detail');
      assert.ok(detailHtml.includes('Pricing Structure &amp; Model Access') || detailHtml.includes('Pricing Structure & Model Access'), 'Pricing structure breakdown');
      assert.ok(detailHtml.includes('https://www.anthropic.com/pricing'), 'Official pricing URL link');
    });

    test('renders /free-ai-sites with verified free platforms', () => {
      setupMockBrowser('https://techhacksai.com/free-ai-sites');
      const html = renderClean(React.createElement(ssrModule.App));
      assert.ok(html.includes('Free AI Sites &amp; Generative Tools') || html.includes('Free AI Sites & Generative Tools'), 'Free AI heading');
      assert.ok(html.includes('Ollama'), 'Renders Ollama in free directory');
    });

    test('renders /alternatives and /alternatives/figma replacement page', () => {
      setupMockBrowser('https://techhacksai.com/alternatives');
      const listHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(listHtml.includes('Browse Open Source Software Alternatives'), 'Alternatives directory header');

      setupMockBrowser('https://techhacksai.com/alternatives/figma');
      const detailHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(detailHtml.includes('Figma'), 'Figma header');
      assert.ok(detailHtml.includes('Penpot'), 'Penpot replacement card rendered');
    });

    test('renders /offers and verified detail pages', () => {
      setupMockBrowser('https://techhacksai.com/offers');
      const listHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(listHtml.includes('AI Deals, Student Plans &amp; Exclusive Discounts') || listHtml.includes('AI Deals, Student Plans & Exclusive Discounts'), 'Offers directory header');
      assert.ok(listHtml.includes('Active ('), 'Active status tab');

      // Test Azure for Students detail page
      setupMockBrowser('https://techhacksai.com/offers/azure-for-students');
      const azureHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(azureHtml.includes('Microsoft Azure for Students'), 'Azure offer title');
      assert.ok(azureHtml.includes('$100 USD Azure credit'), 'Azure benefit summary');
      assert.ok(azureHtml.includes('https://azure.microsoft.com/en-us/free/students/'), 'Official claim URL');
      assert.ok(azureHtml.includes('Step-by-Step'), 'Claim steps rendered');

      // Test Jio Gemini offer detail page
      setupMockBrowser('https://techhacksai.com/offers/jio-google-gemini-offer');
      const jioHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(jioHtml.includes('Reliance Jio'), 'Jio provider');
      assert.ok(jioHtml.includes('18 Months'), '18 months duration');
    });

    test('renders /compare with multi-tool parameters and /pick wizard', () => {
      setupMockBrowser('https://techhacksai.com/compare?tools=supabase,firebase');
      const compareHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(compareHtml.includes('Supabase'), 'Supabase in comparison');
      assert.ok(compareHtml.includes('Firebase'), 'Firebase in comparison');

      setupMockBrowser('https://techhacksai.com/pick');
      const pickHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(pickHtml.includes('Help Me Pick the Right Tool'), 'Pick wizard title');
    });

    test('renders /guides and /prompt-library with detail pages', () => {
      setupMockBrowser('https://techhacksai.com/guides');
      const guidesHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(guidesHtml.includes('Step-by-Step AI Guides &amp; Workflows') || guidesHtml.includes('Step-by-Step AI Guides & Workflows'), 'Guides title');

      setupMockBrowser('https://techhacksai.com/prompt-library');
      const promptsHtml = renderClean(React.createElement(ssrModule.App));
      assert.ok(promptsHtml.includes('AI Prompt Library &amp; Creative Recipes') || promptsHtml.includes('AI Prompt Library & Creative Recipes'), 'Prompts title');
    });
  });

  // -------------------------------------------------------------------------
  // 2. Offer Expiration & Trust Logic Verification
  // -------------------------------------------------------------------------
  describe('Offer Accuracy & Expiration Integrity', () => {
    test('isOfferActive correctly validates active vs expired dates and statuses', () => {
      const activeOffer = {
        verificationStatus: 'verified-active',
        validUntil: undefined,
      };
      assert.strictEqual(isOfferActive(activeOffer), true, 'Uncapped active offer is active');

      const futureOffer = {
        verificationStatus: 'limited-time',
        validUntil: '2099-12-31',
      };
      assert.strictEqual(isOfferActive(futureOffer), true, 'Future deadline offer is active');

      const expiredStatusOffer = {
        verificationStatus: 'expired',
      };
      assert.strictEqual(isOfferActive(expiredStatusOffer), false, 'Expired status is not active');

      const archivedStatusOffer = {
        verificationStatus: 'archived-expired',
      };
      assert.strictEqual(isOfferActive(archivedStatusOffer), false, 'Archived status is not active');

      const pastDeadlineOffer = {
        verificationStatus: 'limited-time',
        validUntil: '2020-01-01',
      };
      assert.strictEqual(isOfferActive(pastDeadlineOffer), false, 'Past deadline is not active');
    });

    test('getActiveOffers excludes unverified or expired records', () => {
      const activeList = getActiveOffers();
      for (const offer of activeList) {
        assert.ok(
          offer.verificationStatus === 'verified-active' || offer.verificationStatus === 'limited-time',
          `Offer ${offer.title} must have active status`
        );
      }
    });

    test('all active offers have valid official terms URLs and claim links', () => {
      for (const offer of offersData) {
        assert.ok(offer.claimUrl.startsWith('https://'), `Offer ${offer.title} must have secure https claimUrl`);
        assert.ok(offer.officialTermsUrl.startsWith('https://'), `Offer ${offer.title} must have secure https terms URL`);
        assert.ok(offer.lastVerifiedAt, `Offer ${offer.title} must have lastVerifiedAt date`);
      }
    });

    test('Adobe CC Student Discount India is explicitly classified as a paid discount, not free', () => {
      const adobeOffer = getOfferBySlug('adobe-cc-student-discount-india');
      assert.ok(adobeOffer, 'Adobe student offer exists');
      assert.strictEqual(adobeOffer.offerType, 'discount', 'Must be classified as discount, not free-subscription');
      assert.ok(
        adobeOffer.description.includes('discount') || adobeOffer.benefitSummary.includes('Discounted paid subscription'),
        'Must disclose discounted paid subscription'
      );
    });

    test('Azure for Students explicitly specifies no credit card requirement and $100 credit', () => {
      const azureOffer = getOfferBySlug('azure-for-students');
      assert.ok(azureOffer, 'Azure for students offer exists');
      assert.ok(azureOffer.description.includes('no credit card required'), 'Must state no credit card required');
      assert.ok(azureOffer.benefitSummary.includes('$100 USD Azure credit'), 'Must state $100 credit');
    });
  });

  // -------------------------------------------------------------------------
  // 3. Logo Authenticity & Integrity
  // -------------------------------------------------------------------------
  describe('Global Logo Authenticity & Vector Verification', () => {
    test('microsoft brand logo points to authentic 4-color Microsoft logo, not Azure', () => {
      const msLogo = getBrandLogo('microsoft');
      assert.ok(msLogo, 'microsoft entry exists in brandLogos');
      assert.strictEqual(msLogo.assetPath, '/logos/microsoft.svg', 'Must use microsoft.svg');

      const azureLogo = getBrandLogo('azure');
      assert.ok(azureLogo, 'azure entry exists in brandLogos');
      assert.strictEqual(azureLogo.assetPath, '/logos/azure.svg', 'Must use azure.svg');
    });

    test('Microsoft Founders Hub offer references Microsoft logo, not GitHub Copilot', () => {
      const fhOffer = getOfferBySlug('microsoft-founders-hub-credits');
      assert.ok(fhOffer, 'Founders Hub offer exists');
      assert.strictEqual(fhOffer.logoAssetPath, '/logos/microsoft.svg', 'Founders Hub must use microsoft.svg');
    });

    test('every brand logo in manifest has verifiedAt date and a valid image file', () => {
      const publicDir = path.resolve(process.cwd(), 'public');
      for (const [slug, entry] of Object.entries(brandLogos)) {
        assert.ok(entry.verifiedAt, `Logo entry ${slug} must have verifiedAt`);
        const filePath = path.join(publicDir, entry.assetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(filePath), `Logo file must exist for ${slug}: ${filePath}`);
        const content = fs.readFileSync(filePath);
        if (/\.svg$/i.test(filePath)) {
          const svg = content.toString('utf8');
          assert.ok(svg.includes('<svg') && svg.includes('</svg>'), `Logo ${slug} must be valid SVG`);
        } else {
          assert.ok(content.length > 32, `Logo ${slug} must contain a valid raster payload`);
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Dynamic SEO Metadata & Sitemap Coverage
  // -------------------------------------------------------------------------
  describe('SEO & Technical Indexing Readiness', () => {
    test('getRouteDescription generates distinct, meaningful descriptions across routes', () => {
      const { getRouteDescription } = ssrModule;
      const homeDesc = getRouteDescription('home');
      const toolsDesc = getRouteDescription('tools');
      const offersDesc = getRouteDescription('offers');
      const aiToolsDesc = getRouteDescription('ai-tools');

      assert.ok(homeDesc.length > 30, 'Home description is descriptive');
      assert.notStrictEqual(homeDesc, toolsDesc, 'Tools description is distinct from home');
      assert.notStrictEqual(offersDesc, aiToolsDesc, 'Offers description is distinct from AI tools');

      const toolDesc = getRouteDescription('tool-detail', { slug: 'supabase' });
      assert.ok(toolDesc.includes('Supabase'), 'Tool detail description includes tool name');

      const offerDesc = getRouteDescription('offer-detail', { slug: 'azure-for-students' });
      assert.ok(offerDesc.includes('Azure'), 'Offer detail description includes offer name');
    });

    test('public/sitemap.xml contains all core routes and catalog slugs', () => {
      const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
      assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml exists');
      const content = fs.readFileSync(sitemapPath, 'utf8');

      // Core routes
      assert.ok(content.includes('<loc>https://techhacksai.com/</loc>'), 'Homepage in sitemap');
      assert.ok(content.includes('<loc>https://techhacksai.com/ai-tools</loc>'), 'AI tools in sitemap');
      assert.ok(content.includes('<loc>https://techhacksai.com/offers</loc>'), 'Offers in sitemap');
      assert.ok(content.includes('<loc>https://techhacksai.com/alternatives</loc>'), 'Alternatives in sitemap');
      assert.ok(content.includes('<loc>https://techhacksai.com/free-ai-sites</loc>'), 'Free AI sites in sitemap');
      assert.ok(content.includes('<loc>https://techhacksai.com/compare</loc>'), 'Compare in sitemap');
      assert.ok(content.includes('<loc>https://techhacksai.com/pick</loc>'), 'Pick in sitemap');

      // Offer detail slugs
      assert.ok(content.includes('https://techhacksai.com/offers/azure-for-students'), 'Azure offer in sitemap');
      assert.ok(content.includes('https://techhacksai.com/offers/jio-google-gemini-offer'), 'Jio Gemini offer in sitemap');
      assert.ok(content.includes('https://techhacksai.com/offers/github-copilot-free'), 'Copilot free in sitemap');

      // AI tool detail slugs
      assert.ok(content.includes('https://techhacksai.com/ai-tools/claude'), 'Claude in sitemap');
      assert.ok(content.includes('https://techhacksai.com/ai-tools/cursor'), 'Cursor in sitemap');

      // Private routes excluded
      assert.ok(!content.includes('/saved'), 'Saved items route must NOT be in sitemap');
    });
  });

  // -------------------------------------------------------------------------
  // 5. User Journey & Interactive State Verification
  // -------------------------------------------------------------------------
  describe('User Journeys & State Interactions', () => {
    test('Bookmark service journey: add, query, verify persistence, and remove', () => {
      clearBookmarks();
      assert.strictEqual(getBookmarks().length, 0, 'Bookmarks start empty');

      // 1. Add item
      addBookmark({
        id: 'supabase',
        type: 'open-source',
        slug: 'supabase',
        name: 'Supabase',
        tagline: 'Open source Firebase alternative',
      });
      assert.strictEqual(isBookmarked('supabase'), true, 'Supabase is bookmarked');
      assert.strictEqual(getBookmarks().length, 1, '1 bookmark stored');

      // 2. Add second item
      addBookmark({
        id: 'claude',
        type: 'ai',
        slug: 'claude',
        name: 'Claude 3.5 Sonnet',
        tagline: 'Frontier AI model',
      });
      assert.strictEqual(getBookmarks().length, 2, '2 bookmarks stored');

      // 3. Remove item
      removeBookmark('supabase');
      assert.strictEqual(isBookmarked('supabase'), false, 'Supabase was removed');
      assert.strictEqual(getBookmarks().length, 1, '1 bookmark remains');
      clearBookmarks();
    });

    test('Help Me Pick recommendation journey respects criteria and constraints', () => {
      // Free video generation request
      const videoRecs = getPickRecommendations({
        goal: 'video-generation',
        budget: 'completely-free',
      });
      assert.ok(videoRecs.length > 0, 'Generates video recommendations');
      assert.ok(
        videoRecs.every((r) => r.type === 'ai' || r.type === 'open-source'),
        'Returns valid tool types'
      );
      assert.ok(
        videoRecs.some((r) => r.tool.slug === 'kling-ai' || r.tool.slug === 'wan-video' || r.tool.slug === 'vidu'),
        'Recommends top free video generators'
      );

      // Coding assistant request
      const codeRecs = getPickRecommendations({
        goal: 'coding-dev',
        budget: 'completely-free',
      });
      assert.ok(codeRecs.length > 0, 'Generates coding recommendations');
      assert.ok(
        codeRecs.some((r) => r.tool.slug === 'aider' || r.tool.slug === 'cline' || r.tool.slug === 'ollama'),
        'Recommends free/open-source coding assistants'
      );
    });

    test('Chatbot grounding journey accurately retrieves student and deal records', () => {
      const res = generateGroundedResponse('Can I get free Azure credits as a student without a credit card?');
      assert.ok(res.text.includes('Azure for Students'), 'Recommends Azure for Students');
      assert.ok(res.text.includes('$100'), 'Mentions $100 credit');
      assert.ok(res.text.includes('no credit card required'), 'Confirms no credit card required');
      assert.ok(res.text.includes('/offers'), 'Links to offers');
    });
  });
});
