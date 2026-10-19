import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

describe('Phase 19: Floating AI Pet, Glass UI, Theme Repair & UX Bug Fixes', () => {
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
  // 1. Theme System Root Cause Resolution (Phase E)
  // =========================================================================
  describe('1. Theme System Repair & Tailwind RGB Variable Channels', () => {
    test('tailwind.config.js uses rgb(var(--color-...) / <alpha-value>) syntax for all theme colors', () => {
      const tailwindConfigPath = path.resolve(process.cwd(), 'tailwind.config.js');
      const content = fs.readFileSync(tailwindConfigPath, 'utf8');

      assert.ok(
        content.includes("rgb(var(--color-bg) / <alpha-value>)"),
        'Background color mapped with RGB alpha channel'
      );
      assert.ok(
        content.includes("rgb(var(--color-card) / <alpha-value>)"),
        'Card color mapped with RGB alpha channel'
      );
      assert.ok(
        content.includes("rgb(var(--color-border) / <alpha-value>)"),
        'Border color mapped with RGB alpha channel'
      );
      assert.ok(
        content.includes("rgb(var(--color-primary) / <alpha-value>)"),
        'Primary color mapped with RGB alpha channel'
      );
    });

    test('src/index.css defines RGB numeric triplets for :root, .dark, .light, and [data-theme]', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      // Check dark RGB values
      assert.ok(content.includes('--color-bg: 11 12 14;'), 'Dark background RGB numbers defined');
      assert.ok(content.includes('--color-card: 17 19 21;'), 'Dark card RGB numbers defined');

      // Check light RGB values
      assert.ok(content.includes('--color-bg: 248 250 252;'), 'Light background RGB numbers defined');
      assert.ok(content.includes('--color-card: 255 255 255;'), 'Light card RGB numbers defined');

      // Check data-theme selectors
      assert.ok(content.includes("[data-theme='dark']"), 'Includes data-theme=dark selector');
      assert.ok(content.includes("[data-theme='light']"), 'Includes data-theme=light selector');
    });

    test('ThemeContext sets both class and data-theme on documentElement and initializes synchronously', () => {
      const contextPath = path.resolve(process.cwd(), 'src/context/ThemeContext.tsx');
      const content = fs.readFileSync(contextPath, 'utf8');

      assert.ok(content.includes("root.setAttribute('data-theme', targetTheme);"), 'Sets data-theme attribute on root');
      assert.ok(content.includes("localStorage.getItem('theme')"), 'Synchronous localStorage initialization');
    });

    test('index.html anti-FOUC script synchronizes data-theme attribute', () => {
      const htmlPath = path.resolve(process.cwd(), 'index.html');
      const content = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(
        content.includes('document.documentElement.setAttribute(\'data-theme\''),
        'Anti-FOUC script sets data-theme attribute'
      );
    });
  });

  // =========================================================================
  // 2. Elevated Chat Launcher & Safe-Area Insets (Phase A)
  // =========================================================================
  describe('2. Elevated Launcher Positioning & Safe-Area Inset Handling', () => {
    test('Floating launcher has elevated coordinates bottom-8 right-5 sm:bottom-10 sm:right-8 and safe-area padding', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(
        content.includes('fixed bottom-8 right-5 sm:bottom-10 sm:right-8 z-50'),
        'Launcher has elevated bottom-8 / sm:bottom-10 placement'
      );
      assert.ok(
        content.includes('pb-[env(safe-area-inset-bottom)]'),
        'Launcher has safe-area inset bottom padding'
      );
    });

    test('Floating chat dialog elevated coordinates avoid bottom collision', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(
        content.includes('sm:right-8 sm:bottom-10'),
        'Chat panel desktop coordinates align with elevated launcher'
      );
    });
  });

  // =========================================================================
  // 3. Immediate Welcome Invitation Popup (Phase B)
  // =========================================================================
  describe('3. Immediate Welcome Invitation Popup & Persistence', () => {
    test('Welcome popup contains exact required copy and accessibility attributes', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('A useful place to start'), 'Useful welcome header rendered');
      assert.ok(content.includes('proactiveSuggestion?.description'), 'Catalog-backed suggestion body rendered');

      // Exact button labels
      assert.ok(content.includes('Open assistant'), "CTA primary label is 'Open assistant'");
      assert.ok(content.includes('Not now'), "Secondary label is 'Not now'");
      assert.ok(
        content.includes('aria-label="Dismiss assistant invitation"'),
        'Close button has accessible aria-label'
      );
    });

    test('Welcome popup selects immediately and avoids duplicate messages', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('selectProactiveSuggestion()'), 'Selects a suggestion on mount');
      assert.ok(content.includes('proactiveInitializedRef.current'), 'Guards against rerender duplicates');
      assert.ok(!content.includes('5000'), 'Does not delay the welcome suggestion');
    });
  });

  // =========================================================================
  // 4. Cute 3D AI Pet Companion (Phase C)
  // =========================================================================
  describe('4. Cute 3D AI Pet Companion & Expressive Eyes', () => {
    test('AiOrb3D supports 6 distinct pet states and passes data-pet-state', () => {
      const petPath = path.resolve(process.cwd(), 'src/components/AiOrb3D.tsx');
      const content = fs.readFileSync(petPath, 'utf8');

      assert.ok(content.includes("'idle' | 'hover' | 'welcome' | 'thinking' | 'responding' | 'error'"), 'Defines all 6 pet states');
      assert.ok(content.includes('data-pet-state='), 'Attaches data-pet-state attribute to DOM for styling and testing');
    });

    test('AiOrb3D renders expressive glowing eyes and blush cheeks', () => {
      const petPath = path.resolve(process.cwd(), 'src/components/AiOrb3D.tsx');
      const content = fs.readFileSync(petPath, 'utf8');

      assert.ok(content.includes('animate-pet-blink'), 'Includes pet blink animation for idle state');
      assert.ok(content.includes('animate-pet-think'), 'Includes pet think animation for thinking state');
      assert.ok(content.includes('animate-pet-respond'), 'Includes pet respond animation for responding state');
      assert.ok(content.includes('bg-rose-400/40 blur-[1px]'), 'Includes soft cheek blush on happy states');
      assert.ok(content.includes('M 1 9 Q 7 0 13 9'), 'Includes cheerful arch SVG path for hover eye state');
    });

    test('AiOrb3D renders gyroscopic orbital rings with satellite photon without external 3D libraries', () => {
      const petPath = path.resolve(process.cwd(), 'src/components/AiOrb3D.tsx');
      const content = fs.readFileSync(petPath, 'utf8');

      assert.ok(content.includes('rotateX(68deg) rotateY(15deg)'), 'Renders gyroscopic orbital ring');
      assert.ok(content.includes('rotateX(52deg) rotateY(-35deg)'), 'Renders secondary counter-rotating ring');
      assert.ok(content.includes('shadow-[0_0_8px_#38bdf8]'), 'Renders satellite photon with cyan illumination');
      assert.ok(!content.includes('three'), 'Zero Three.js or heavy 3D canvas libraries imported');
    });

    test('src/index.css includes strict prefers-reduced-motion for all pet animations', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      assert.ok(content.includes('.animate-pet-blink'), 'CSS defines .animate-pet-blink');
      assert.ok(content.includes('.animate-pet-float'), 'CSS defines .animate-pet-float');
      assert.ok(content.includes('.animate-pet-think'), 'CSS defines .animate-pet-think');
      assert.ok(content.includes('.animate-pet-respond'), 'CSS defines .animate-pet-respond');
      assert.ok(
        content.includes('.animate-pet-blink,\n  .animate-pet-float,\n  .animate-pet-think,\n  .animate-pet-respond'),
        'Reduced motion rule completely neutralizes all pet animations'
      );
    });
  });

  // =========================================================================
  // 5. Opaque UI & Search Enhancements (Phase D)
  // =========================================================================
  describe('5. Opaque UI & Keyboard-Navigable Search Combobox', () => {
    test('UniversalSearch applies the shared opaque surface and focus treatment', () => {
      const searchPath = path.resolve(process.cwd(), 'src/components/UniversalSearch.tsx');
      const content = fs.readFileSync(searchPath, 'utf8');

      assert.ok(content.includes('bg-card border border-border'), 'Search input uses the shared opaque surface');
      assert.ok(content.includes('focus:ring-cyan-500/50'), 'Search input has a visible focus ring');
      assert.ok(!content.includes('backdrop-blur-xl'), 'Search does not require a glass backdrop');
    });

    test('UniversalSearch implements accessible combobox pattern with ARIA roles', () => {
      const searchPath = path.resolve(process.cwd(), 'src/components/UniversalSearch.tsx');
      const content = fs.readFileSync(searchPath, 'utf8');

      assert.ok(content.includes('role="combobox"'), 'Search input marked as combobox');
      assert.ok(content.includes('aria-autocomplete="list"'), 'Combobox specifies list autocomplete');
      assert.ok(content.includes('role="listbox"'), 'Results dropdown marked as listbox');
      assert.ok(content.includes('role="option"'), 'Search result items marked as options');
      assert.ok(content.includes('aria-activedescendant='), 'Combobox tracks active option index');
    });

    test('UniversalSearch implements ArrowUp, ArrowDown, Enter and Escape keyboard navigation', () => {
      const searchPath = path.resolve(process.cwd(), 'src/components/UniversalSearch.tsx');
      const content = fs.readFileSync(searchPath, 'utf8');

      assert.ok(content.includes("e.key === 'ArrowDown'"), 'Handles ArrowDown navigation');
      assert.ok(content.includes("e.key === 'ArrowUp'"), 'Handles ArrowUp navigation');
      assert.ok(content.includes("e.key === 'Enter'"), 'Handles Enter navigation to active result');
      assert.ok(content.includes("e.key === 'Escape'"), 'Handles Escape dismiss');
    });
  });

  // =========================================================================
  // 6. Help Me Pick Simplification & Watermark Conditional Fix (Phase F)
  // =========================================================================
  describe('6. Help Me Pick Language Simplification & Watermark Conditional Fix', () => {
    test('Watermark question in PickPage is strictly conditional on media goals', () => {
      const pickPath = path.resolve(process.cwd(), 'src/pages/PickPage.tsx');
      const content = fs.readFileSync(pickPath, 'utf8');

      // Check condition declaration
      assert.ok(
        content.includes("goal === 'video-generation' || goal === 'image-generation'"),
        'Defines showWatermark strictly for video and image workflows'
      );
      assert.ok(
        content.includes('{showWatermark && ('),
        'Step 4 wraps Watermark Preference strictly inside {showWatermark && (...)}'
      );
    });

    test('Switching goal to non-media resets watermarkPreference to any', () => {
      const pickPath = path.resolve(process.cwd(), 'src/pages/PickPage.tsx');
      const content = fs.readFileSync(pickPath, 'utf8');

      assert.ok(
        content.includes("setWatermarkPreference('any')"),
        'Resets watermarkPreference to any when selecting non-media goals'
      );
    });

    test('PickPage Step 4 title adapts conditionally based on media vs non-media workflow', () => {
      const pickPath = path.resolve(process.cwd(), 'src/pages/PickPage.tsx');
      const content = fs.readFileSync(pickPath, 'utf8');

      assert.ok(
        content.includes("Step 4 of 4: Setup and watermark preferences"),
        'Adapts title when watermarks apply'
      );
      assert.ok(
        content.includes("Step 4 of 4: Setup and preferences"),
        'Adapts title when watermarks do not apply'
      );
    });

    test('PickPage renders full wizard without throwing on SSR', () => {
      setupMockBrowser('https://techhacksai.com/pick');
      const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

      assert.ok(html.includes('Help Me Pick the Right Tool'), 'Pick title rendered');
      assert.ok(html.includes('Step 1 of 4: What is your primary objective?'), 'Step 1 heading rendered');
      assert.ok(html.includes('Code or Build a Web App'), 'Coding goal with simplified label rendered');
    });
  });
});
