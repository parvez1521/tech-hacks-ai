import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';

import {
  createToolSubmission,
  createGuideSubmission,
  checkToolDuplicate,
  getSubmissionsQueue,
  updateSubmissionStatus,
  publishSubmissionToCatalog,
  getPublishedAdditions,
  verifyAdminToken,
  normalizeUrl,
  ADMIN_TOKEN,
} from '../server/submissionsStore.js';

import {
  checkClientToolDuplicate,
} from '../src/services/submissionService.ts';

import {
  getAiToolBySlug,
  getAllAiTools,
  filterAndSortAiTools,
  registerPublishedTool,
  registerPublishedGuide,
  getGuideBySlug,
} from '../src/services/aiCatalogService.ts';

describe('Phase 22: Community Contributions (Submit a Tool & Submit a Guide)', () => {
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
      sessionStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = String(v); },
        removeItem: (k) => { delete mockStorage[k]; },
      },
      localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = String(v); },
        removeItem: (k) => { delete mockStorage[k]; },
      },
      dispatchEvent: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
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

  // 1. Router & Match Tests
  describe('1. Routing & Title Infrastructure', () => {
    test('matchRoute correctly maps /submit-tool and alias /submit', () => {
      const match1 = ssrModule.matchRoute('/submit-tool');
      assert.strictEqual(match1.route, 'submit-tool');

      const match2 = ssrModule.matchRoute('/submit');
      assert.strictEqual(match2.route, 'submit-tool');
    });

    test('matchRoute correctly maps /submit-guide', () => {
      const match = ssrModule.matchRoute('/submit-guide');
      assert.strictEqual(match.route, 'submit-guide');
    });

    test('matchRoute correctly maps /admin/moderation and /moderation', () => {
      const match1 = ssrModule.matchRoute('/admin/moderation');
      assert.strictEqual(match1.route, 'moderation');

      const match2 = ssrModule.matchRoute('/moderation');
      assert.strictEqual(match2.route, 'moderation');
    });

    test('getRouteTitle formats titles for all community contribution routes', () => {
      const toolTitle = ssrModule.getRouteTitle('submit-tool');
      assert.ok(toolTitle.includes('Submit an AI Tool'));
      assert.ok(toolTitle.includes('Tech Hacks AI'));

      const guideTitle = ssrModule.getRouteTitle('submit-guide');
      assert.ok(guideTitle.includes('Submit an AI Guide'));

      const modTitle = ssrModule.getRouteTitle('moderation');
      assert.ok(modTitle.includes('Editorial Moderation Queue'));
    });
  });

  // 2. Client & Server Duplicate Detection
  describe('2. Multi-tier Duplicate Detection', () => {
    test('checkClientToolDuplicate flags known catalog names case-insensitively', () => {
      const result = checkClientToolDuplicate('ChatGPT', 'https://brand-new-site.io');
      assert.strictEqual(result.isDuplicate, true);
      assert.ok(result.reason.includes('already cataloged'));

      const resultLower = checkClientToolDuplicate('chatgpt', 'https://brand-new-site.io');
      assert.strictEqual(resultLower.isDuplicate, true);
    });

    test('checkClientToolDuplicate flags matching domain even with different tool name', () => {
      const result = checkClientToolDuplicate('My Cool Bot', 'https://chatgpt.com');
      assert.strictEqual(result.isDuplicate, true);
      assert.ok(result.reason.includes('chatgpt.com'));
    });

    test('checkClientToolDuplicate passes clean novel tool and domain', () => {
      const result = checkClientToolDuplicate('SuperUniqueAIEngine99', 'https://superuniqueai99.org');
      assert.strictEqual(result.isDuplicate, false);
    });

    test('server checkToolDuplicate catches duplicates and normalizes URLs', async () => {
      const dup = await checkToolDuplicate('ChatGPT', 'https://chatgpt.com');
      assert.strictEqual(dup.isDuplicate, true);
      assert.ok(dup.reason.length > 0);
    });

    test('normalizeUrl cleans tracking params and enforces https protocol', () => {
      const cleaned = normalizeUrl('http://example.com/app/?utm_source=twitter&utm_medium=social#tag');
      assert.ok(cleaned.startsWith('https://example.com/app'));
      assert.ok(!cleaned.includes('utm_source'));
      assert.ok(!cleaned.includes('utm_medium'));
    });
  });

  // 3. Validation, Anti-Spam & Security
  describe('3. Validation Rules, Bot Blocking & Passkey Security', () => {
    test('createToolSubmission rejects missing required fields with informative errors', async () => {
      const invalid = await createToolSubmission({
        name: '',
        websiteUrl: 'not-a-valid-url',
        category: '',
      });
      assert.strictEqual(invalid.success, false);
      assert.ok(invalid.errors && Object.keys(invalid.errors).length > 0);
    });

    test('createGuideSubmission rejects thin or missing markdown content', async () => {
      const invalid = await createGuideSubmission({
        title: 'Too short',
        category: 'coding',
        summary: 'Short',
        content: 'too short', // < 100 chars
        submitterName: 'Tester',
        submitterEmail: 'test@example.com',
      });
      assert.strictEqual(invalid.success, false);
      assert.ok(invalid.message.includes('validation') || invalid.errors?.content);
    });

    test('honeypot website_hp silently traps bots without adding to submissions queue', async () => {
      const initialQueue = getSubmissionsQueue(ADMIN_TOKEN);
      const initialCount = initialQueue.submissions.length;

      const botPayload = {
        name: 'Bot Tool Spam 9000',
        websiteUrl: 'https://spambot9000.xyz',
        category: 'productivity',
        pricingType: 'Free',
        shortDescription: 'Spam description for bot testing only.',
        submitterName: 'Spam Bot',
        submitterEmail: 'spambot@spam.com',
        website_hp: 'http://iamabot.com', // Bot filled hidden field
      };

      const result = await createToolSubmission(botPayload);
      assert.strictEqual(result.success, false);
      assert.ok(result.message.includes('honeypot'));

      // Verify not stored in queue
      const afterQueue = getSubmissionsQueue(ADMIN_TOKEN);
      assert.strictEqual(afterQueue.submissions.length, initialCount);
    });

    test('verifyAdminToken strictly checks editorial passkey', () => {
      assert.strictEqual(verifyAdminToken(ADMIN_TOKEN), true);
      assert.strictEqual(verifyAdminToken('wrong-passkey-123'), false);
      assert.strictEqual(verifyAdminToken(''), false);
      assert.strictEqual(verifyAdminToken(null), false);
    });

    test('getSubmissionsQueue requires valid admin passkey', () => {
      const unauth = getSubmissionsQueue('invalid-passkey');
      assert.strictEqual(unauth.success, false);
      assert.strictEqual(unauth.error, 'Unauthorized');
    });
  });

  // 4. Submission Lifecycle & Moderation to Live Catalog
  describe('4. Editorial Moderation & Live Catalog Publication', () => {
    let testSubId;
    const testToolName = `Community Tool ${Date.now()}`;
    const testToolUrl = `https://community-tool-${Date.now()}.ai`;

    test('valid tool submission is received as pending review', async () => {
      const payload = {
        name: testToolName,
        websiteUrl: testToolUrl,
        category: 'assistants',
        pricingType: 'freemium',
        description: 'A cutting-edge community-submitted AI assistant for developers with deep workflow integration.',
        features: ['Code autocomplete', 'Refactoring agent', 'Unit test generator'],
        platform: ['Web', 'macOS'],
        submitterName: 'Parvez Developer',
        submitterEmail: 'parvez@example.com',
      };

      const result = await createToolSubmission(payload);
      assert.strictEqual(result.success, true);
      assert.ok(result.id.startsWith('sub_tool_'));
      testSubId = result.id;

      // Verify unapproved item is NOT published in additions
      const additions = getPublishedAdditions();
      const match = (additions.tools || []).find((t) => t.id === testSubId);
      assert.strictEqual(match, undefined);
    });

    test('moderator can update submission status and notes', () => {
      assert.ok(testSubId, 'Test submission ID should exist');
      const updateRes = updateSubmissionStatus(
        testSubId,
        {
          status: 'in_review',
          moderatorNotes: 'Verified official website and pricing tier.',
        },
        ADMIN_TOKEN
      );

      assert.strictEqual(updateRes.success, true);
      assert.strictEqual(updateRes.submission.status, 'in_review');
      assert.strictEqual(updateRes.submission.moderatorNotes, 'Verified official website and pricing tier.');
    });

    test('moderator publishing to catalog makes item live immediately', () => {
      const pubRes = publishSubmissionToCatalog(testSubId, ADMIN_TOKEN);
      assert.strictEqual(pubRes.success, true);
      assert.ok(pubRes.publishedSlug);
      assert.strictEqual(pubRes.submission.status, 'published');

      // Verify it is present in published additions
      const additions = getPublishedAdditions();
      const publishedTool = (additions.tools || []).find((t) => t.slug === pubRes.publishedSlug);
      assert.ok(publishedTool, 'Published tool must appear in published additions');
      assert.strictEqual(publishedTool.name, testToolName);

      // Register dynamically into in-memory catalog
      registerPublishedTool(publishedTool);

      // Verify dynamic catalog query retrieves it
      const catalogQuery = getAiToolBySlug(pubRes.publishedSlug);
      assert.ok(catalogQuery, 'Catalog query by slug must find dynamically registered tool');
      assert.strictEqual(catalogQuery.name, testToolName);

      // Verify search & filter includes it
      const filterRes = filterAndSortAiTools({
        searchQuery: testToolName,
        category: null,
        pricingType: 'all',
        sortBy: 'popular',
        page: 1,
      });
      assert.ok(filterRes.tools.some((t) => t.slug === pubRes.publishedSlug));
    });

    test('guide submission and publication lifecycle', async () => {
      const testGuideTitle = `Building Autonomous Agents with Community Workflows ${Date.now()}`;
      const guidePayload = {
        title: testGuideTitle,
        category: 'workflow-automation',
        summary: 'A comprehensive step-by-step tutorial on building autonomous agents using modern AI models.',
        content: `## Getting Started with Agents\n\nStep 1: Setup developer environment.\nStep 2: Connect APIs and models.\nStep 3: Run pipeline with safe markdown rendering.\n\nEnjoy the workflow! This tutorial covers all essential architecture points.`,
        readTime: '6 min read',
        authorName: 'Jane Contributor',
        contactEmail: 'jane@example.com',
      };

      const submitRes = await createGuideSubmission(guidePayload);
      assert.strictEqual(submitRes.success, true);
      assert.ok(submitRes.id.startsWith('sub_guide_'));

      // Publish guide
      const pubGuide = publishSubmissionToCatalog(submitRes.id, ADMIN_TOKEN);
      assert.strictEqual(pubGuide.success, true);
      assert.ok(pubGuide.publishedSlug);

      // Verify additions
      const additions = getPublishedAdditions();
      const foundGuide = (additions.guides || []).find((g) => g.slug === pubGuide.publishedSlug);
      assert.ok(foundGuide);
      assert.strictEqual(foundGuide.title, testGuideTitle);

      // Register dynamically
      registerPublishedGuide(foundGuide);
      const queried = getGuideBySlug(pubGuide.publishedSlug);
      assert.ok(queried);
      assert.strictEqual(queried.title, testGuideTitle);
    });
  });

  // 5. SSR & Component Integration
  describe('5. UI Components & SSR Rendering Audit', () => {
    test('/submit-tool page renders complete multi-section form with instructions', () => {
      setupMockBrowser('https://techhacksai.com/submit-tool');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
      assert.ok(html.includes('Submit an AI Tool'));
      assert.ok(html.includes('Tool Name'));
      assert.ok(html.includes('Official Website URL'));
      assert.ok(html.includes('Submit Tool for Review'));
    });

    test('/submit-guide page renders form with markdown live preview tab', () => {
      setupMockBrowser('https://techhacksai.com/submit-guide');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
      assert.ok(html.includes('Submit an AI Guide &amp; Tutorial') || html.includes('Submit an AI Guide'));
      assert.ok(html.includes('Write Markdown'));
      assert.ok(html.includes('Live Preview'));
    });

    test('/admin/moderation page renders secure passkey gate when unauthenticated', () => {
      setupMockBrowser('https://techhacksai.com/admin/moderation');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
      assert.ok(html.includes('Editorial Moderation'));
      assert.ok(html.includes('Moderator Passkey'));
      assert.ok(html.includes('Unlock Moderation Queue'));
    });

    test('/ai-tools directory renders Submit a Tool CTA in header and CommunityCallout', () => {
      setupMockBrowser('https://techhacksai.com/ai-tools');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
      assert.ok(html.includes('Submit a Tool'));
      assert.ok(html.includes('Missing an AI Tool or Open Source Alternative?'));
    });

    test('/guides directory renders Submit a Guide CTA in header and CommunityCallout', () => {
      setupMockBrowser('https://techhacksai.com/guides');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
      assert.ok(html.includes('Submit a Guide'));
      assert.ok(html.includes('Have an AI Workflow or Practical Tutorial to Share?'));
    });

    test('Header desktop and mobile navigation contain community submission entry points', () => {
      setupMockBrowser('https://techhacksai.com/');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
      assert.ok(html.includes('/submit-tool'));
      assert.ok(html.includes('/submit-guide'));
    });

    test('Footer contains community submission links and moderation queue link', () => {
      setupMockBrowser('https://techhacksai.com/');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));
      assert.ok(html.includes('Submit an AI Tool'));
      assert.ok(html.includes('Submit a Guide'));
      assert.ok(html.includes('/moderation'));
    });
  });
});
