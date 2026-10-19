import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

describe('Phase 20: Floating Brand-Logo Background & Assistant Branding Cleanup', () => {
  let ssrModule;

  function setupMockBrowser(initialUrl = 'https://techhacksai.com/') {
    const parsedUrl = new URL(initialUrl);
    const mockStorage = {};
    const mockSession = {};

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
      sessionStorage: {
        getItem: (k) => mockSession[k] || null,
        setItem: (k, v) => { mockSession[k] = String(v); },
        removeItem: (k) => { delete mockSession[k]; },
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
      documentElement: {
        classList: { toggle: () => {}, contains: () => false, add: () => {}, remove: () => {} },
        setAttribute: () => {},
        getAttribute: () => null,
      },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }

  before(async () => {
    setupMockBrowser();
    ssrModule = await import('../dist/test-ssr.js');
  });

  // =========================================================================
  // 1. Floating Brand-Logo Background Architecture (Phase A)
  // =========================================================================
  describe('1. Floating Brand-Logo Background Architecture', () => {
    test('HeroFloatingLogos component exists and renders with pointer-events-none and aria-hidden', () => {
      const componentPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      assert.ok(fs.existsSync(componentPath), 'HeroFloatingLogos.tsx exists');

      const content = fs.readFileSync(componentPath, 'utf8');
      assert.ok(content.includes('pointer-events-none'), 'Container has pointer-events-none');
      assert.ok(content.includes('select-none'), 'Container has select-none');
      assert.ok(content.includes('aria-hidden="true"'), 'Container has aria-hidden=true for screen readers');
      assert.ok(content.includes('overflow-hidden'), 'Container has overflow-hidden to prevent page scrollbars');
    });

    test('Hero section in HomePage cleanly excludes cluttered floating logos (Phase 24)', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const content = fs.readFileSync(homePath, 'utf8');

      assert.ok(!content.includes('<HeroFloatingLogos />'), 'HomePage removes <HeroFloatingLogos /> per Phase 24 mandate');
    });

    test('All brand logos referenced in HeroFloatingLogos exist as real SVGs on disk', () => {
      const componentPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      const content = fs.readFileSync(componentPath, 'utf8');

      const slugs = [
        'claude-code',
        'aider',
        'perplexity',
        'perplexica',
        'firebase',
        'supabase',
        'figma',
        'penpot',
        'cursor',
        'deepseek',
        'ollama',
        'flux-1',
        'n8n',
        'kling-ai',
      ];

      for (const slug of slugs) {
        assert.ok(content.includes(`slug="${slug}"`), `Component references verified slug ${slug}`);
        const svgPath = path.resolve(process.cwd(), `public/logos/${slug}.svg`);
        assert.ok(fs.existsSync(svgPath), `Physical SVG file exists on disk: public/logos/${slug}.svg`);
      }
    });
  });

  // =========================================================================
  // 2. Grounded Tool ↔ Alternative Visual Relationships (Phase B)
  // =========================================================================
  describe('2. Grounded Tool ↔ Alternative Visual Relationships', () => {
    test('Displays verified pairs grounded in the existing alternatives dataset', () => {
      const componentPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      const content = fs.readFileSync(componentPath, 'utf8');

      // Check Claude Code ↔ Aider pair
      assert.ok(
        content.includes('Claude Code') && content.includes('Aider'),
        'Displays Claude Code ↔ Aider relationship'
      );

      // Check Perplexity ↔ Perplexica pair
      assert.ok(
        content.includes('Perplexity') && content.includes('Perplexica'),
        'Displays Perplexity ↔ Perplexica relationship'
      );

      // Check Firebase ↔ Supabase pair
      assert.ok(
        content.includes('Firebase') && content.includes('Supabase'),
        'Displays Firebase ↔ Supabase relationship'
      );

      // Check Figma ↔ Penpot pair
      assert.ok(
        content.includes('Figma') && content.includes('Penpot'),
        'Displays Figma ↔ Penpot relationship'
      );
    });

    test('Pairs include subtle directional replacement indicator without cluttering center', () => {
      const componentPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      const content = fs.readFileSync(componentPath, 'utf8');

      assert.ok(content.includes('⇄'), 'Includes subtle replacement symbol between tool pairs');
      assert.ok(
        content.includes('backdrop-blur-md') && content.includes('rounded-2xl'),
        'Tiles styled with subtle glassmorphism'
      );
    });
  });

  // =========================================================================
  // 3. Motion Polish & Accessibility (Phase A & B)
  // =========================================================================
  describe('3. Motion Polish & Accessibility', () => {
    test('src/index.css defines gentle floating drift animations', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      assert.ok(content.includes('@keyframes floatSlow1'), 'Defines floatSlow1 keyframes');
      assert.ok(content.includes('@keyframes floatSlow2'), 'Defines floatSlow2 keyframes');
      assert.ok(content.includes('.animate-float-slow-1'), 'Defines .animate-float-slow-1');
      assert.ok(content.includes('.animate-float-slow-2'), 'Defines .animate-float-slow-2');
    });

    test('src/index.css neutralizes floating logo animations under prefers-reduced-motion', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      assert.ok(
        content.includes('.animate-float-slow-1,\n  .animate-float-slow-2'),
        'float animations explicitly included in prefers-reduced-motion block'
      );
    });

    test('Component applies responsive visibility to keep mobile view clean', () => {
      const componentPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      const content = fs.readFileSync(componentPath, 'utf8');

      assert.ok(
        content.includes('hidden sm:flex') && content.includes('hidden md:flex'),
        'Hides complex clusters on small mobile screens'
      );
    });
  });

  // =========================================================================
  // 4. Assistant Branding Cleanup (Phase C)
  // =========================================================================
  describe('4. Assistant Branding Cleanup', () => {
    test('Removes "Interactive 3D Assistant" from launcher subtitle', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(
        !content.includes('Interactive 3D Assistant'),
        'No visible "Interactive 3D Assistant" wording in launcher'
      );
      assert.ok(
        content.includes('Find the right AI tool'),
        'Uses benefit-oriented subtitle "Find the right AI tool"'
      );
    });

    test('Removes "grounded 3D AI companion" from chatbot welcome greeting', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(
        !content.includes('grounded 3D AI companion'),
        'No "grounded 3D AI companion" in welcome message'
      );
      assert.ok(
        content.includes('Welcome to the Tech Hacks AI assistant.'),
        'Uses a concise, product-focused welcome message'
      );
    });

    test('No remaining visible user-facing "3D AI Chatbot" or "3D Interactive" phrases in src components', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(!content.includes('3D Interactive AI Assistant'), 'No 3D Interactive AI Assistant');
      assert.ok(!content.includes('3D AI Chatbot'), 'No 3D AI Chatbot');
    });
  });

  // =========================================================================
  // 5. SSR & Integration Verification
  // =========================================================================
  describe('5. SSR & Integration Verification', () => {
    test('HomePage renders hero section on SSR without errors', () => {
      setupMockBrowser('https://techhacksai.com/');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

      assert.ok(html.includes('Discover the Best AI Tools &amp; Open Source Alternatives'), 'Hero H1 rendered');
      assert.ok(html.includes('Ask Tech Hacks AI'), 'Floating assistant launcher rendered');
      assert.ok(html.includes('Find the right AI tool'), 'Assistant launcher subtitle rendered');
    });
  });
});
