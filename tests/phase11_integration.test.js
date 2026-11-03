import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { getPickRecommendations } from '../src/services/aiCatalogService.ts';
import { generateGroundedResponse } from '../src/services/chatRetrievalService.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';

describe('Phase 11: End-to-End Integration, Recommendation Integrity & Launch Readiness', () => {

  // ---------------------------------------------------------------------------
  // 1. Help Me Pick — 7 Realistic Scenarios
  // ---------------------------------------------------------------------------
  describe('Help Me Pick — Recommendation Engine Integrity', () => {
    test('Scenario 1: Free text-to-video generation returns verified video tools with recurring/open-source free tier', () => {
      const recs = getPickRecommendations({
        goal: 'video-generation',
        taskDetail: 'text-to-video',
        budget: 'completely-free',
        hostingPreference: 'any',
        watermarkPreference: 'any',
      });

      assert.ok(recs.length >= 4, 'Should match multiple text-to-video tools');
      recs.forEach((r) => {
        const tool = r.tool;
        assert.strictEqual(tool.category, 'video', `${tool.name} must be a video category tool`);
        assert.ok(
          tool.outputModalities?.includes('video') || tool.generationTasks?.some((t) => t.includes('video')),
          `${tool.name} must output video`
        );
        // Completely free must NOT be one-time trial or paid
        assert.notStrictEqual(tool.pricingType, 'free-trial', `${tool.name} must not be a one-time trial`);
        assert.notStrictEqual(tool.pricingType, 'paid', `${tool.name} must not be paid`);
      });

      const topNames = recs.slice(0, 4).map((r) => r.tool.name);
      assert.ok(topNames.some((n) => n.includes('Hailuo') || n.includes('Wan 2.1') || n.includes('Kling')));
    });

    test('Scenario 2: Free image-to-video generation returns tools capable of animating images', () => {
      const recs = getPickRecommendations({
        goal: 'video-generation',
        taskDetail: 'image-to-video',
        budget: 'free-credits',
        hostingPreference: 'any',
        watermarkPreference: 'any',
      });

      assert.ok(recs.length >= 4, 'Should find image-to-video tools');
      recs.forEach((r) => {
        const tool = r.tool;
        assert.strictEqual(tool.category, 'video', `${tool.name} must be in video category`);
        assert.ok(
          tool.generationTasks?.includes('image-to-video') ||
          tool.features.some((f) => f.toLowerCase().includes('image') || f.toLowerCase().includes('animate')),
          `${tool.name} must support image-to-video`
        );
      });
    });

    test('Scenario 3: Free AI chatbot prioritizes multi-turn conversational assistants', () => {
      const recs = getPickRecommendations({
        goal: 'chat-research',
        taskDetail: 'all-chat',
        budget: 'completely-free',
        hostingPreference: 'any',
        watermarkPreference: 'any',
      });

      assert.ok(recs.length >= 4, 'Should find conversational chatbots');
      const topCategories = recs.slice(0, 4).map((r) => r.tool.category);
      assert.ok(
        topCategories.every((cat) => cat === 'assistants'),
        'Top 4 chatbot recommendations must all belong to assistants category'
      );
      const names = recs.slice(0, 4).map((r) => r.tool.name);
      assert.ok(names.some((n) => n.includes('Claude') || n.includes('ChatGPT') || n.includes('Ollama')));
    });

    test('Scenario 4: Free AI coding assistant (IDE Editor) strictly excludes generic conversational chatbots', () => {
      const recs = getPickRecommendations({
        goal: 'coding-dev',
        taskDetail: 'ide-editor',
        budget: 'free-credits',
        hostingPreference: 'any',
        watermarkPreference: 'any',
      });

      assert.ok(recs.length >= 2, 'Should find IDE editors');
      recs.forEach((r) => {
        const tool = r.tool;
        assert.strictEqual(tool.category, 'coding', `${tool.name} must be a coding tool`);
        assert.ok(
          tool.tags.includes('ide') || tool.tags.includes('editor'),
          `${tool.name} must be tagged with ide or editor`
        );
        // Ensure non-IDE assistants like Claude or Qwen are not included
        assert.notStrictEqual(tool.id, 'claude', 'Claude is an assistant, not an IDE editor');
        assert.notStrictEqual(tool.id, 'qwen-chat', 'Qwen is an assistant, not an IDE editor');
      });

      const names = recs.map((r) => r.tool.name);
      assert.ok(names.includes('Cursor Editor') || names.includes('OmniRush'));
    });

    test('Scenario 5: Open-source local AI assistant returns self-hostable open-weights models', () => {
      const recs = getPickRecommendations({
        goal: 'chat-research',
        taskDetail: 'all-chat',
        budget: 'self-hosted',
        hostingPreference: 'local',
        watermarkPreference: 'any',
      });

      assert.ok(recs.length >= 3, 'Should find open-source local assistants');
      recs.forEach((r) => {
        const tool = r.tool;
        assert.ok(
          tool.isSelfHostable || tool.freeAccessType === 'open-source-local',
          `${tool.name} must be self-hostable or open-source-local`
        );
      });

      const names = recs.map((r) => r.tool.name);
      assert.ok(names.includes('Ollama') && names.includes('Open WebUI'));
    });

    test('Scenario 6: Free image editing strictly excludes pure video and coding tools', () => {
      const recs = getPickRecommendations({
        goal: 'image-generation',
        taskDetail: 'image-editing',
        budget: 'completely-free',
        hostingPreference: 'any',
        watermarkPreference: 'any',
      });

      assert.ok(recs.length >= 3, 'Should find free image editing tools');
      recs.forEach((r) => {
        const tool = r.tool;
        assert.strictEqual(tool.category, 'image', `${tool.name} must be strictly an image category tool`);
        assert.notStrictEqual(tool.category, 'video', `${tool.name} must not be a video tool`);
        assert.notStrictEqual(tool.category, 'coding', `${tool.name} must not be a coding tool`);
        assert.notStrictEqual(tool.category, 'assistants', `${tool.name} must not be a general assistant`);
      });

      const names = recs.map((r) => r.tool.name);
      assert.ok(names.includes('ComfyUI') || names.includes('FLUX.1 by Black Forest Labs') || names.includes('Recraft AI'));
    });

    test('Scenario 7: Budget filtering strictly differentiates completely free vs starter trial credits', () => {
      // 7a. completely-free excludes one-time starter trial tools
      const freeVideo = getPickRecommendations({
        goal: 'video-generation',
        budget: 'completely-free',
        hostingPreference: 'any',
        watermarkPreference: 'any',
      });

      const freeIds = freeVideo.map((r) => r.tool.id);
      assert.ok(!freeIds.includes('pika'), 'Pika only has one-time starter credits and must not appear in completely-free');
      assert.ok(!freeIds.includes('kaiber'), 'Kaiber only has one-time starter credits and must not appear in completely-free');

      // 7b. free-trial includes tools with starter trial allowances
      const trialVideo = getPickRecommendations({
        goal: 'video-generation',
        budget: 'free-trial',
        hostingPreference: 'any',
        watermarkPreference: 'any',
      });

      const trialIds = trialVideo.map((r) => r.tool.id);
      assert.ok(trialIds.includes('pika') || trialIds.includes('runway') || trialIds.includes('kaiber'), 'Should include trial credit tools');
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Chatbot Grounding, Multi-Lingual & Frontier Model Status
  // ---------------------------------------------------------------------------
  describe('Chatbot Grounding & Model Integrity', () => {
    test('Answers Pika inquiries with honest pricing status and recurring free alternatives', () => {
      const res = generateGroundedResponse('Does Pika have a free plan?');
      assert.ok(res.text.includes('not have a recurring monthly free plan') || res.text.includes('starter trial credits'));
      assert.ok(res.text.includes('Kling AI') || res.text.includes('Vidu'));
    });

    test('Documents Claude Fable 5.1 and GPT-6 Astra without claiming released free public access', () => {
      const res = generateGroundedResponse('Tell me about Claude Fable 5.1 and GPT-6 Astra on KIE AI');
      assert.ok(res.text.includes('Evaluation'), 'Uses the status stored in the catalogue');
      assert.ok(res.text.includes('published catalogue only'), 'Clearly discloses the catalogue-only fallback');
    });

    test('Handles Hindi / Hinglish queries seamlessly', () => {
      const videoHindi = generateGroundedResponse('Free video banana ke liye kaun sa AI tool best hai?');
      assert.ok(videoHindi.text.includes('Kling AI') || videoHindi.text.includes('Vidu'));
      assert.ok(videoHindi.groundedTools?.length > 0);

      const codeHindi = generateGroundedResponse('Coding ke liye best free tool batao');
      assert.ok(codeHindi.text.includes('Cursor Editor') || codeHindi.text.includes('DeepSeek-R1'));
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Client Bundle Security Audit & Vercel Configuration
  // ---------------------------------------------------------------------------
  describe('Production Security & Deployment Configuration', () => {
    test('Client production build bundle does not leak API keys or secrets', () => {
      const distAssetsDir = path.resolve(process.cwd(), 'dist/assets');
      if (fs.existsSync(distAssetsDir)) {
        const files = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.js'));
        files.forEach((file) => {
          const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
          assert.strictEqual(
            /GROQ_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY/.test(content),
            false,
            `File ${file} must not contain API key environment variable references`
          );
          assert.strictEqual(
            /gsk_[a-zA-Z0-9]{20,}/.test(content),
            false,
            `File ${file} must not contain live Groq API keys`
          );
        });
      }
    });

    test('vercel.json avoids a catch-all rewrite so missing URLs can return real 404s', () => {
      const vercelJsonPath = path.resolve(process.cwd(), 'vercel.json');
      assert.ok(fs.existsSync(vercelJsonPath), 'vercel.json must exist');
      const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
      assert.strictEqual(config.cleanUrls, true);
      assert.ok(!config.rewrites || config.rewrites.length === 0, 'Pre-rendered routes must not be hidden behind a global SPA rewrite');

      const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
      assert.ok(packageJson.scripts.build.includes('seo:prerender'), 'Production build must pre-render real routes');

      const prerenderPath = path.resolve(process.cwd(), 'scripts/prerender-site.mjs');
      assert.ok(fs.existsSync(prerenderPath), 'SEO pre-render script must exist');
      const prerender = fs.readFileSync(prerenderPath, 'utf8');
      assert.ok(prerender.includes('404.html'), 'Pre-render must create a custom 404 page');
      assert.ok(prerender.includes('application/ld+json'), 'Pre-render must emit structured metadata');
    });

    test('api/chat.js exists with server-side environment variable access and catalog fallback', () => {
      const apiChatPath = path.resolve(process.cwd(), 'api/chat.js');
      assert.ok(fs.existsSync(apiChatPath), 'api/chat.js must exist');
      const content = fs.readFileSync(apiChatPath, 'utf8');
      assert.ok(content.includes('process.env.GROQ_API_KEY'), 'api/chat.js should check GROQ_API_KEY securely on the server');
      assert.ok(content.includes('grounded_local_mode'), 'api/chat.js should provide clean fallback for client retrieval');
    });
  });
});
