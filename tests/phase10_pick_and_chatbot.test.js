import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { execSync } from 'child_process';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { getPickRecommendations } from '../src/services/aiCatalogService.ts';
import { generateGroundedResponse } from '../src/services/chatRetrievalService.ts';
import { getBrandLogo } from '../src/data/brandLogos.ts';

describe('Phase 10: Help Me Pick, Floating Chatbot, Video Generators & LLM Alternatives', () => {
  let ssrModule;

  before(async () => {
    ssrModule = await import('../dist/test-ssr.js');
  });

  function setupMockBrowser(initialUrl = 'https://openalternative.co/pick') {
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
        pushState: () => {},
        replaceState: () => {},
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
    global.document = { title: '' };
  }

  function renderClean(element) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }

  // -------------------------------------------------------------------------
  // 1. Help Me Pick Recommendation Engine & Hard Constraints
  // -------------------------------------------------------------------------
  test('Video goal strictly eliminates non-video tools before scoring', () => {
    const criteria = {
      goal: 'video-generation',
      budget: 'any',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    };

    const results = getPickRecommendations(criteria);
    assert.ok(results.length > 0, 'Should return video recommendations');

    // Verify EVERY returned tool is strictly a video generator
    results.forEach((rec) => {
      const tool = rec.tool;
      const isVideoCategory = tool.category === 'video';
      const hasVideoTask = tool.generationTasks?.some((t) => t.includes('video') || t === 'avatar-video');
      const hasVideoModality = tool.outputModalities?.includes('video');
      assert.ok(
        isVideoCategory || hasVideoTask || hasVideoModality,
        `Tool ${tool.name} must be a video tool, but has category: ${tool.category}`
      );
    });
  });

  test('Self-hosted video recommendation returns open-weights models', () => {
    const criteria = {
      goal: 'video-generation',
      budget: 'self-hosted',
      hostingPreference: 'local',
      watermarkPreference: 'no-watermark',
    };

    const results = getPickRecommendations(criteria);
    assert.ok(results.length > 0, 'Should find open-weights video models');

    const names = results.map((r) => r.tool.name);
    // Should include Wan 2.1, LTX Video, or CogVideoX
    assert.ok(
      names.some((n) => n.includes('Wan 2.1') || n.includes('LTX Video') || n.includes('CogVideoX')),
      'Returns open-weights models like Wan 2.1, LTX Video, or CogVideoX'
    );
  });

  test('Pika is accurately annotated with starter trial credits without recurring free plan', () => {
    const pika = aiToolsData.find((t) => t.id === 'pika');
    assert.ok(pika, 'Pika exists in catalog');
    assert.strictEqual(pika.hasFreePlan, false, 'Pika hasFreePlan should be false (trial only)');
    assert.strictEqual(pika.pricingType, 'free-credits', 'Pika pricingType is free-credits');
    assert.strictEqual(pika.freeAccessType, 'limited-free', 'Pika freeAccessType is limited-free');
    assert.ok(pika.freeTierLimits.includes('Starter trial credits'), 'Accurately documents starter trial limit');
  });

  // -------------------------------------------------------------------------
  // 2. Video Platforms & LLM Alternatives Catalog Expansion
  // -------------------------------------------------------------------------
  test('Catalog includes all 9 newly verified AI video generation platforms', () => {
    const expectedVideoSlugs = [
      'vidu',
      'hailuo-ai',
      'dreamina',
      'pixverse',
      'wan-video',
      'ltx-video',
      'cogvideox',
      'hedra',
      'kaiber',
    ];

    expectedVideoSlugs.forEach((slug) => {
      const tool = aiToolsData.find((t) => t.slug === slug);
      assert.ok(tool, `AI tool ${slug} should exist in catalog`);
      assert.strictEqual(tool.category, 'video', `${slug} must have category 'video'`);
      assert.ok(tool.generationTasks && tool.generationTasks.length > 0, `${slug} must have generationTasks`);
      assert.ok(tool.pricingVerifiedAt, `${slug} must have pricingVerifiedAt date`);
      assert.ok(getBrandLogo(slug), `${slug} must have a registered brand logo`);
    });
  });

  test('Catalog includes Mistral Le Chat, Qwen Chat, Meta AI, OmniRush, and KIE AI', () => {
    const expectedAssistantSlugs = [
      'mistral-le-chat',
      'qwen-chat',
      'meta-ai',
      'omnirush',
      'kie-ai',
    ];

    expectedAssistantSlugs.forEach((slug) => {
      const tool = aiToolsData.find((t) => t.slug === slug);
      assert.ok(tool, `Tool ${slug} should exist in catalog`);
      assert.ok(tool.generationTasks && tool.generationTasks.length > 0, `${slug} must have generationTasks`);
      assert.ok(getBrandLogo(slug), `${slug} must have registered brand logo`);
    });
  });

  test('Frontier model status accurately documents Claude Fable 5.1 and GPT-6 Astra', () => {
    const kie = aiToolsData.find((t) => t.slug === 'kie-ai');
    assert.ok(kie, 'KIE AI exists');
    assert.ok(kie.supportedModels?.some((m) => m.includes('Claude Fable 5.1')), 'Lists Claude Fable 5.1');
    assert.ok(kie.supportedModels?.some((m) => m.includes('GPT-6 Astra')), 'Lists GPT-6 Astra');
    assert.ok(kie.longDescription?.includes('evaluation stage'), 'Clarifies evaluation status');
  });

  // -------------------------------------------------------------------------
  // 3. Grounded Chatbot Retrieval Service
  // -------------------------------------------------------------------------
  test('Chatbot service answers Pika recurring free inquiries with accurate alternatives', () => {
    const response = generateGroundedResponse('Does Pika have a recurring free plan?');
    assert.ok(response.text.includes('starter trial credits'), 'Explains Pika trial limit');
    assert.ok(response.text.includes('recurring'), 'Notes lack of recurring plan');
    assert.ok(response.text.includes('Kling AI'), 'Recommends Kling AI');
    assert.ok(response.text.includes('Vidu'), 'Recommends Vidu');
    assert.ok(response.text.includes('Wan 2.1'), 'Recommends Wan 2.1');
  });

  test('Chatbot service handles Hindi / Hinglish queries for video and coding', () => {
    const videoHindi = generateGroundedResponse('Mujhe free video generator chahiye video banana hai');
    assert.ok(videoHindi.text.includes('Kling AI'), 'Recommends Kling for Hindi video query');
    assert.ok(videoHindi.text.includes('Wan 2.1'), 'Recommends Wan 2.1 for Hindi video query');

    const codingHindi = generateGroundedResponse('Coding ke liye best free tool kaun sa hai');
    assert.ok(codingHindi.text.includes('Cursor') || codingHindi.text.includes('Claude') || codingHindi.text.includes('DeepSeek'), 'Recommends top coding tools for Hindi query');
  });

  test('Chatbot service addresses Claude Fable 5.1 and recommended live models', () => {
    const fableResponse = generateGroundedResponse('Where can I try Claude Fable 5.1?');
    assert.ok(fableResponse.text.includes('Evaluation'), 'States Claude Fable 5.1 evaluation status');
    assert.ok(fableResponse.text.includes('Claude 3.5 Sonnet'), 'Recommends Claude 3.5 Sonnet as live standard');
  });

  // -------------------------------------------------------------------------
  // 4. UI Component & Route Integration
  // -------------------------------------------------------------------------
  test('FloatingChatbot is rendered in root App component with accessible button', async () => {
    setupMockBrowser('https://openalternative.co/');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Ask Tech Hacks AI'), 'Floating launcher button text rendered');
    assert.ok(html.includes('aria-label="Open Tech Hacks AI Assistant"'), 'Accessible aria-label on launcher');
  });

  test('PickPage renders adaptive wizard with verified criteria and step progression', async () => {
    setupMockBrowser('https://openalternative.co/pick');
    const html = renderClean(React.createElement(ssrModule.App));

    assert.ok(html.includes('Help Me Pick the Right Tool'), 'PickPage title');
    assert.ok(html.includes('Step 1 of 4: What is your primary objective?'), 'Step 1 heading');
    assert.ok(html.includes('AI Video Generation &amp; Animation') || html.includes('Generate Video or Images'), 'Video goal option');
    assert.ok(html.includes('Next Step'), 'Next step button');
  });
});
