import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { generateGroundedResponse } from '../src/services/chatRetrievalService.ts';
import { offersData } from '../src/data/offersData.ts';
import { toolsData } from '../src/data/seedData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';

describe('Phase 18: Pre-Launch Polish & Interactive 3D AI Chatbot Assistant', () => {
  let ssrModule;

  function setupMockBrowser(initialUrl = 'https://techhacksai.com/') {
    const parsedUrl = new URL(initialUrl);
    const mockStorage = {};

    global.window = {
      innerWidth: 1024,
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
        setItem: (k, v) => { mockStorage[k] = String(v); },
        removeItem: (k) => { delete mockStorage[k]; },
      },
      matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
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

  before(async () => {
    setupMockBrowser();
    ssrModule = await import('../dist/test-ssr.js');
  });

  // =========================================================================
  // 1. Interactive 3D AI Orb Assistant Architecture
  // =========================================================================
  describe('1. Interactive 3D AI Orb Assistant Component Architecture', () => {
    const orbFilePath = path.resolve('src/components/AiOrb3D.tsx');
    const orbContent = fs.readFileSync(orbFilePath, 'utf8');

    test('AiOrb3D source implements 3D perspective, preserve-3d, and layered gyroscopic rings', () => {
      assert.ok(orbContent.includes('perspective:'), 'AiOrb3D must configure 3D CSS perspective');
      assert.ok(orbContent.includes('transformStyle: \'preserve-3d\'') || orbContent.includes('transformStyle'), 'AiOrb3D must preserve 3D nested transforms');
      assert.ok(orbContent.includes('rotateX') && orbContent.includes('rotateY'), 'AiOrb3D must support dynamic 3D rotational tilt');
      assert.ok(orbContent.includes('aria-hidden="true"'), 'AiOrb3D decorative graphics must be marked aria-hidden');
    });

    test('AiOrb3D source handles generation flux state with accelerated animation', () => {
      assert.ok(orbContent.includes('isGenerating'), 'AiOrb3D must support isGenerating prop');
      assert.ok(orbContent.includes('duration-300') || orbContent.includes('animate-spin'), 'AiOrb3D must adapt motion timings for generation state');
    });

    test('AiOrb3D source respects prefers-reduced-motion preferences', () => {
      assert.ok(
        orbContent.includes('prefers-reduced-motion') || orbContent.includes('reducedMotion'),
        'AiOrb3D must handle reduced-motion accessibility preference'
      );
    });
  });

  // =========================================================================
  // 2. Floating Chatbot Launcher & 5 Official Starter Prompts
  // =========================================================================
  describe('2. Floating Chatbot Launcher & 5 Official Starter Prompts', () => {
    test('Root App renders FloatingChatbot launcher with 3D orb and accessible contract', () => {
      setupMockBrowser('https://techhacksai.com/');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

      assert.ok(html.includes('Ask Tech Hacks AI'), 'Chatbot launcher must render visible "Ask Tech Hacks AI" prompt');
      assert.ok(!html.includes('aria-label="Ask Tech Hacks AI'), 'Chatbot launcher uses its visible child text as its accessible name');
      assert.ok(html.includes('preserve-3d') || html.includes('perspective:'), 'Chatbot launcher embeds the 3D orb component');
      assert.ok(html.includes('fixed bottom-') && html.includes('right-'), 'Chatbot launcher is anchored to viewport bottom-right');
    });

    test('FloatingChatbot component source defines all 5 required Phase C.4 starter prompts', () => {
      const chatbotFilePath = path.resolve('src/components/FloatingChatbot.tsx');
      const chatbotContent = fs.readFileSync(chatbotFilePath, 'utf8');

      const requiredPrompts = [
        'Find free AI tools for video creation.',
        'Suggest alternatives to Claude Code.',
        'Help me choose an AI tool for coding.',
        'Find AI offers for students in India.',
        'Compare two AI tools.',
      ];

      for (const prompt of requiredPrompts) {
        assert.ok(
          chatbotContent.includes(prompt),
          `FloatingChatbot must include starter prompt: "${prompt}"`
        );
      }
    });
  });

  // =========================================================================
  // 3. Grounded Retrieval Intelligence for All 5 Starter Prompts
  // =========================================================================
  describe('3. Grounded Retrieval Intelligence for Starter Prompts', () => {
    test('handles "Find free AI tools for video creation."', () => {
      const resp = generateGroundedResponse('Find free AI tools for video creation.');
      assert.ok(resp.text.length > 50, 'Response should provide informative copy');
      assert.ok(
        resp.text.toLowerCase().includes('kling') ||
        resp.text.toLowerCase().includes('wan 2.1') ||
        resp.text.toLowerCase().includes('luma') ||
        resp.text.toLowerCase().includes('video'),
        'Response should highlight top verified free AI video models'
      );
    });

    test('handles "Suggest alternatives to Claude Code."', () => {
      const resp = generateGroundedResponse('Suggest alternatives to Claude Code.');
      assert.ok(resp.text.length > 50, 'Response should provide informative copy');
      assert.ok(
        resp.text.toLowerCase().includes('cursor') ||
        resp.text.toLowerCase().includes('aider') ||
        resp.text.toLowerCase().includes('ollama'),
        'Response should recommend coding alternatives (Cursor, Aider, Ollama)'
      );
    });

    test('handles "Help me choose an AI tool for coding."', () => {
      const resp = generateGroundedResponse('Help me choose an AI tool for coding.');
      assert.ok(resp.text.length > 50, 'Response should provide informative copy');
      assert.ok(
        resp.text.includes('/pick') || resp.text.toLowerCase().includes('help me pick'),
        'Response must guide user to the Help Me Pick wizard'
      );
    });

    test('handles "Find AI offers for students in India."', () => {
      const resp = generateGroundedResponse('Find AI offers for students in India.');
      assert.ok(resp.text.length > 50, 'Response should provide informative copy');
      assert.ok(
        resp.text.toLowerCase().includes('jio') || resp.text.toLowerCase().includes('student') || resp.text.includes('/offers'),
        'Response should highlight Indian student benefits and /offers'
      );
    });

    test('handles "Compare two AI tools."', () => {
      const resp = generateGroundedResponse('Compare two AI tools.');
      assert.ok(resp.text.length > 50, 'Response should provide informative copy');
      assert.ok(
        resp.text.includes('/compare') || resp.text.toLowerCase().includes('compare'),
        'Response should guide user to the side-by-side /compare software tool'
      );
    });
  });

  // =========================================================================
  // 4. Viewport Collision Prevention (CookieConsentBanner vs Chatbot)
  // =========================================================================
  describe('4. Viewport Collision Prevention (CookieConsentBanner vs Chatbot)', () => {
    test('CookieConsentBanner docks to bottom-left on desktop, leaving bottom-right free for chatbot', () => {
      const cookieFilePath = path.resolve('src/components/CookieConsentBanner.tsx');
      const cookieContent = fs.readFileSync(cookieFilePath, 'utf8');

      assert.ok(
        cookieContent.includes('sm:left-6') && cookieContent.includes('sm:right-auto'),
        'Cookie banner must dock to sm:left-6 and clear sm:right-auto on desktop'
      );
      assert.ok(
        cookieContent.includes('bottom-20') && cookieContent.includes('sm:bottom-6'),
        'Cookie banner must position comfortably above mobile navigation bar and standard desktop baseline'
      );
    });
  });

  // =========================================================================
  // 5. Card Height Uniformity & Touch Target Minimums
  // =========================================================================
  describe('5. Card Height Uniformity & Mobile Touch Target Minimums', () => {
    test('ToolCard root element includes h-full flex flex-col justify-between', () => {
      const content = fs.readFileSync(path.resolve('src/components/ToolCard.tsx'), 'utf8');
      assert.ok(content.includes('h-full') && content.includes('flex flex-col justify-between'), 'ToolCard must contain h-full and flex flex-col justify-between');
    });

    test('AlternativeCard root element includes h-full flex flex-col justify-between', () => {
      const content = fs.readFileSync(path.resolve('src/components/AlternativeCard.tsx'), 'utf8');
      assert.ok(content.includes('h-full') && content.includes('flex flex-col justify-between'), 'AlternativeCard must contain h-full and flex flex-col justify-between');
    });

    test('OfferCard root element includes h-full flex flex-col justify-between', () => {
      const content = fs.readFileSync(path.resolve('src/components/OfferCard.tsx'), 'utf8');
      assert.ok(content.includes('h-full') && content.includes('flex flex-col justify-between'), 'OfferCard must contain h-full and flex flex-col justify-between');
    });

    test('ReplacementCard root element includes h-full flex flex-col justify-between', () => {
      const content = fs.readFileSync(path.resolve('src/components/ReplacementCard.tsx'), 'utf8');
      assert.ok(content.includes('h-full') && content.includes('flex flex-col justify-between'), 'ReplacementCard must contain h-full and flex flex-col justify-between');
    });

    test('Header component enforces 44px minimum touch targets on mobile interactive items', () => {
      const headerContent = fs.readFileSync(path.resolve('src/components/Header.tsx'), 'utf8');
      assert.ok(headerContent.includes('min-h-[44px] min-w-[44px]'), 'Mobile toggle button must have min-h-[44px] min-w-[44px]');
      assert.ok(headerContent.includes('min-h-[44px] rounded-md'), 'Mobile navigation links must have min-h-[44px]');
    });
  });
});
