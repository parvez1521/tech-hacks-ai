import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { promptCategories, promptsData, promptProviders } from '../src/data/promptsData.ts';
import { brandLogos, getBrandLogo } from '../src/data/brandLogos.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';

const LOGOS_DIR = path.resolve(process.cwd(), 'public/logos');

let ssrModule;

function setupMockBrowser(url = 'https://techhacksai.com/') {
  const parsed = new URL(url);
  global.window = {
    location: {
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      href: url,
      origin: parsed.origin,
    },
    history: {
      pushState: () => {},
      replaceState: () => {},
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
  };
  global.document = {
    title: '',
    head: { appendChild: () => {} },
    body: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
    documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} }, setAttribute: () => {} },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
  };
}

function renderClean(element) {
  return renderToString(element).replace(/<!--.*?-->/g, '');
}

describe('Phase 21: Prompt Library Expansion, Creative Workflows & Authentic Brand Logos', () => {
  before(async () => {
    ssrModule = await import('../dist/test-ssr.js');
  });

  // -------------------------------------------------------------------------
  // 1. Midjourney Purge Verification
  // -------------------------------------------------------------------------
  describe('1. Midjourney Purge Audit', () => {
    test('promptsData.ts contains zero references to Midjourney in prompt entries or filters', () => {
      const fileContent = fs.readFileSync(path.resolve(process.cwd(), 'src/data/promptsData.ts'), 'utf8');
      assert.strictEqual(
        fileContent.toLowerCase().includes('midjourney'),
        false,
        'src/data/promptsData.ts must not contain any occurrences of Midjourney'
      );
      
      for (const p of promptsData) {
        assert.ok(!p.targetModel.toLowerCase().includes('midjourney'), `Prompt ${p.id} targetModel must not mention Midjourney`);
        assert.ok(!p.promptText.toLowerCase().includes('midjourney'), `Prompt ${p.id} promptText must not mention Midjourney`);
        if (p.tips) {
          assert.ok(!p.tips.toLowerCase().includes('midjourney'), `Prompt ${p.id} tips must not mention Midjourney`);
        }
        for (const tag of p.tags) {
          assert.ok(!tag.toLowerCase().includes('midjourney'), `Prompt ${p.id} tags must not mention Midjourney`);
        }
      }
    });

    test('PromptLibraryPage.tsx does not mention Midjourney in header or copy', () => {
      const fileContent = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/PromptLibraryPage.tsx'), 'utf8');
      assert.strictEqual(
        fileContent.toLowerCase().includes('midjourney'),
        false,
        'PromptLibraryPage.tsx must not contain any mentions of Midjourney'
      );
    });
  });

  // -------------------------------------------------------------------------
  // 2. 14 Curated Categories Verification
  // -------------------------------------------------------------------------
  describe('2. 14 Curated Prompt Categories', () => {
    const requiredCategories = [
      'human-portraits',
      'ai-image-generation',
      'image-editing-img2img',
      'ai-video-generation',
      'cinematic-camera-vfx',
      'web-app-development',
      'website-landing-page',
      'ui-ux-design-prototyping',
      'frontend-development',
      'full-stack-development',
      'claude-artifacts-ui',
      'motion-design-animation',
      '3d-design-product-vis',
      'coding-debug-refactor',
      'marketing-content-social',
    ];

    test('promptCategories defines all 15 curated categories', () => {
      assert.strictEqual(promptCategories.length, 15, 'Must have exactly 15 categories');
      const slugs = promptCategories.map((c) => c.slug);
      for (const req of requiredCategories) {
        assert.ok(slugs.includes(req), `Category ${req} must be registered in promptCategories`);
      }
    });

    test('every single one of the 14 categories contains at least one prompt', () => {
      for (const cat of promptCategories) {
        const matching = promptsData.filter((p) => p.category === cat.slug);
        assert.ok(
          matching.length > 0,
          `Category "${cat.name}" (${cat.slug}) must have at least 1 prompt in promptsData (found ${matching.length})`
        );
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. Gemini Nano Banana Collection (Phase C)
  // -------------------------------------------------------------------------
  describe('3. Gemini Nano Banana Collection', () => {
    test('contains 10 substantive prompts with Google / Nano Banana targetModel', () => {
      const geminiPrompts = promptsData.filter(
        (p) => p.targetModel.toLowerCase().includes('gemini') || (p.provider && p.provider.toLowerCase().includes('google'))
      );
      assert.ok(geminiPrompts.length >= 10, `Expected at least 10 Gemini Nano Banana prompts (found ${geminiPrompts.length})`);
    });

    test('Gemini Nano Banana prompts include customizable placeholders and official documentation link', () => {
      const geminiPrompts = promptsData.filter(
        (p) => p.id.startsWith('gemini-')
      );
      assert.strictEqual(geminiPrompts.length, 10, 'Expected exactly 10 gemini- prefixed prompts');

      for (const p of geminiPrompts) {
        assert.ok(p.placeholders && p.placeholders.length >= 3, `Prompt ${p.id} must define placeholders`);
        assert.ok(p.customizationInstructions, `Prompt ${p.id} must have customizationInstructions`);
        assert.ok(p.expectedOutputType, `Prompt ${p.id} must have expectedOutputType`);
        assert.ok(p.exampleUseCase, `Prompt ${p.id} must have exampleUseCase`);
        assert.strictEqual(
          p.officialToolUrl,
          'https://ai.google.dev/gemini-api/docs/image-generation',
          `Prompt ${p.id} must point to official Google image generation documentation`
        );
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Claude Artifacts & Interactive UI Collection (Phase D)
  // -------------------------------------------------------------------------
  describe('4. Claude Artifacts & Interactive UI Collection', () => {
    test('contains rich interactive prompts targeting Claude Artifacts and Anthropic', () => {
      const claudeArtifacts = promptsData.filter(
        (p) => p.category === 'claude-artifacts-ui' || p.id.startsWith('claude-')
      );
      assert.ok(claudeArtifacts.length >= 7, `Expected at least 7 Claude Artifacts prompts (found ${claudeArtifacts.length})`);

      for (const p of claudeArtifacts) {
        assert.ok(p.officialToolUrl && p.officialToolUrl.includes('claude.com'), `Prompt ${p.id} must reference official Claude tool`);
        assert.ok(p.expectedOutputType, `Prompt ${p.id} must specify expectedOutputType`);
      }
    });

    test('includes dashboard, multi-agent chat, and node graph flowchart prompts', () => {
      const slugs = promptsData.map((p) => p.slug);
      assert.ok(slugs.includes('claude-interactive-saas-dashboard'), 'Contains SaaS dashboard prompt');
      assert.ok(slugs.includes('claude-realtime-chat-agent-ui'), 'Contains real-time chat interface prompt');
      assert.ok(slugs.includes('claude-interactive-node-flowchart'), 'Contains interactive flowchart prompt');
    });
  });

  // -------------------------------------------------------------------------
  // 5. Higgsfield AI Video Generation Collection (Phase G)
  // -------------------------------------------------------------------------
  describe('5. Higgsfield AI Video Generation Collection', () => {
    test('contains at least 12 Higgsfield prompt workflows', () => {
      const higgsfieldPrompts = promptsData.filter((p) => p.id.startsWith('higgsfield-'));
      assert.ok(
        higgsfieldPrompts.length >= 12,
        `Expected at least 12 Higgsfield prompts (found ${higgsfieldPrompts.length})`
      );

      for (const p of higgsfieldPrompts) {
        assert.strictEqual(p.provider, 'Higgsfield', `Prompt ${p.id} provider must be Higgsfield`);
        assert.strictEqual(p.targetModel, 'Higgsfield AI', `Prompt ${p.id} targetModel must be Higgsfield AI`);
        assert.strictEqual(p.officialToolUrl, 'https://higgsfield.ai', `Prompt ${p.id} must link to https://higgsfield.ai`);
        assert.ok(p.expectedOutputType, `Prompt ${p.id} must specify expectedOutputType`);
      }
    });

    test('covers camera moves: 360 orbit, whip pan, drone push-in, and vertigo dolly-zoom', () => {
      const slugs = promptsData.map((p) => p.slug);
      assert.ok(slugs.includes('higgsfield-360-orbital-automotive-sweep'), 'Contains 360 orbit prompt');
      assert.ok(slugs.includes('higgsfield-whip-pan-architectural-transition'), 'Contains whip pan transition prompt');
      assert.ok(slugs.includes('higgsfield-drone-descending-push-in-sunset'), 'Contains drone push-in prompt');
      assert.ok(slugs.includes('higgsfield-dolly-zoom-vertigo-effect'), 'Contains vertigo dolly zoom prompt');
      assert.ok(slugs.includes('higgsfield-vertical-fashion-reel-motion'), 'Contains 9:16 vertical video prompt');
    });
  });

  // -------------------------------------------------------------------------
  // 6. Web & App Development Engineering Protocol (Phase F)
  // -------------------------------------------------------------------------
  describe('6. Web & App Development Engineering Prompts', () => {
    test('includes master autonomous coding agent execution protocol', () => {
      const masterPrompt = promptsData.find((p) => p.id === 'master-autonomous-coding-agent-orchestrator');
      assert.ok(masterPrompt, 'Master autonomous agent prompt must exist');
      assert.ok(masterPrompt.promptText.includes('Deep Reconnaissance'), 'Includes reconnaissance instructions');
      assert.ok(masterPrompt.promptText.includes('Automated Verification'), 'Includes test verification instructions');
      assert.ok(masterPrompt.promptText.includes('Structured Completion Report'), 'Includes structured report instructions');
    });

    test('includes landing page, fullstack crud, and accessible form engine', () => {
      const slugs = promptsData.map((p) => p.slug);
      assert.ok(slugs.includes('modern-landing-page-conversion-engine'), 'Contains modern landing page prompt');
      assert.ok(slugs.includes('fullstack-auth-crud-postgresql-schema'), 'Contains fullstack crud prompt');
      assert.ok(slugs.includes('accessible-form-engine-zod-validation'), 'Contains accessible form engine prompt');
    });
  });

  // -------------------------------------------------------------------------
  // 7. Global Brand Logo Audit & Verification (Phase H)
  // -------------------------------------------------------------------------
  describe('7. Brand Logo Audit & Higgsfield Asset', () => {
    test('Higgsfield uses the official-site icon asset with a valid PNG signature', () => {
      const higgsfieldPath = path.resolve(process.cwd(), 'public/logos/official-ai/higgsfield.png');
      assert.ok(fs.existsSync(higgsfieldPath), 'official Higgsfield icon must exist');
      const content = fs.readFileSync(higgsfieldPath);
      assert.deepStrictEqual([...content.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    });

    test('higgsfield is registered in brandLogos manifest', () => {
      const logo = getBrandLogo('higgsfield');
      assert.ok(logo, 'getBrandLogo("higgsfield") must return logo entry');
      assert.strictEqual(logo.slug, 'higgsfield');
      assert.strictEqual(logo.name, 'Higgsfield AI');
      assert.strictEqual(logo.assetPath, '/logos/official-ai/higgsfield.png');
      assert.strictEqual(logo.sourceUrl, 'https://higgsfield.ai/icon.png');
    });

    test('higgsfield is registered in aiToolsData catalog with valid logo asset', () => {
      const tool = aiToolsData.find((t) => t.slug === 'higgsfield');
      assert.ok(tool, 'Higgsfield must exist in aiToolsData');
      assert.strictEqual(tool.category, 'video');
      assert.ok(tool.hasFreePlan !== undefined, 'Higgsfield must specify free plan status');
      assert.strictEqual(tool.websiteUrl, 'https://higgsfield.ai');
    });
  });

  // -------------------------------------------------------------------------
  // 8. SSR Rendering of Prompt Library and Details
  // -------------------------------------------------------------------------
  describe('8. SSR Rendering & Interaction Controls', () => {
    test('/prompt-library renders category tabs, provider filters, and prompt cards', () => {
      setupMockBrowser('https://techhacksai.com/prompt-library');
      const html = renderClean(React.createElement(ssrModule.App));

      assert.ok(html.includes('Find a prompt. Make it yours.') || html.includes('Find a prompt. Make it yours.'), 'Renders page title');
      assert.ok(html.includes('Google (Nano Banana)'), 'Renders Google provider filter');
      assert.ok(html.includes('Anthropic (Claude)'), 'Renders Anthropic provider filter');
      assert.ok(html.includes('Higgsfield AI'), 'Renders Higgsfield provider filter');
      assert.ok(html.includes('AI Image Generation'), 'Renders AI Image Generation category pill');
      assert.ok(html.includes('Claude Artifacts and Interactive UI'), 'Renders Claude Artifacts category pill');
      assert.ok(!html.includes('Midjourney'), 'Rendered HTML must not include Midjourney');
    });

    test('/prompt-library/:slug renders interactive placeholders and copy controls for Gemini', () => {
      setupMockBrowser('https://techhacksai.com/prompt-library/gemini-commercial-product-photography');
      const html = renderClean(React.createElement(ssrModule.App));

      assert.ok(html.includes('Photorealistic Studio Commercial Product Showcase'), 'Renders Gemini title');
      assert.ok(html.includes('Customize Placeholders in Real-Time'), 'Renders interactive placeholders section');
      assert.ok(html.includes('[PRODUCT]'), 'Renders [PRODUCT] placeholder input');
      assert.ok(html.includes('[BRAND COLORS]'), 'Renders [BRAND COLORS] placeholder input');
      assert.ok(html.includes('https://ai.google.dev/gemini-api/docs/image-generation'), 'Renders official Google documentation link');
      assert.ok(html.includes('Prompt Instructions'), 'Renders prompt instructions container');
    });

    test('/prompt-library/:slug renders Higgsfield video workflow details', () => {
      setupMockBrowser('https://techhacksai.com/prompt-library/higgsfield-vertical-fashion-reel-motion');
      const html = renderClean(React.createElement(ssrModule.App));

      assert.ok(html.includes('Vertical 9:16 High-Fashion Fabric Motion Reel'), 'Renders Higgsfield title');
      assert.ok(html.includes('Higgsfield AI'), 'Renders Higgsfield model badge');
      assert.ok(html.includes('https://higgsfield.ai'), 'Renders official Higgsfield link');
    });
  });
});
