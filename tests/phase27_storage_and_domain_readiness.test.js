import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import {
  getStorageMode,
  isDurable,
  getStorageStatus,
  toDbRow,
  fromDbRow,
} from '../server/storageAdapter.js';

import {
  createToolSubmission,
  createGuideSubmission,
  updateSubmissionStatus,
  updateSubmissionStatusAsync,
  publishSubmissionToCatalog,
  publishSubmissionToCatalogAsync,
  readSubmissionsAsync,
  readPublishedAdditionsAsync,
} from '../server/submissionsStore.js';

import { siteConfig, getCanonicalUrl } from '../src/config/site.ts';

describe('Phase 27: Durable Data Storage & Production Deployment Readiness', () => {
  const ROOT_DIR = process.cwd();

  // 1. Storage Mode Detection & Status
  describe('1. Storage Mode Detection & Configuration', () => {
    test('default development environment resolves to "local" mode', () => {
      // In normal test execution without cloud env vars, mode must be local
      const mode = getStorageMode();
      assert.strictEqual(mode, 'local');
      assert.strictEqual(isDurable(), false);

      const status = getStorageStatus();
      assert.strictEqual(status.mode, 'local');
      assert.strictEqual(status.isDurable, false);
      assert.strictEqual(status.isServerless, false);
      assert.strictEqual(status.readyForProduction, false);
      assert.ok(status.provider.includes('Local Filesystem'));
    });

    test('detects Supabase mode when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set', () => {
      const origUrl = process.env.SUPABASE_URL;
      const origKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      try {
        process.env.SUPABASE_URL = 'https://mock-proj.supabase.co';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-secret';

        assert.strictEqual(getStorageMode(), 'supabase');
        assert.strictEqual(isDurable(), true);

        const status = getStorageStatus();
        assert.strictEqual(status.mode, 'supabase');
        assert.strictEqual(status.readyForProduction, true);
        assert.ok(status.provider.includes('Supabase'));
        assert.ok(status.details.includes('mock-proj.supabase.co'));
      } finally {
        if (origUrl !== undefined) process.env.SUPABASE_URL = origUrl; else delete process.env.SUPABASE_URL;
        if (origKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = origKey; else delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      }
    });

    test('detects Upstash mode when UPSTASH credentials are set', () => {
      const origUrl = process.env.UPSTASH_REDIS_REST_URL;
      const origToken = process.env.UPSTASH_REDIS_REST_TOKEN;
      try {
        process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-upstash-token';

        assert.strictEqual(getStorageMode(), 'upstash');
        assert.strictEqual(isDurable(), true);

        const status = getStorageStatus();
        assert.strictEqual(status.mode, 'upstash');
        assert.strictEqual(status.readyForProduction, true);
      } finally {
        if (origUrl !== undefined) process.env.UPSTASH_REDIS_REST_URL = origUrl; else delete process.env.UPSTASH_REDIS_REST_URL;
        if (origToken !== undefined) process.env.UPSTASH_REDIS_REST_TOKEN = origToken; else delete process.env.UPSTASH_REDIS_REST_TOKEN;
      }
    });

    test('detects unconfigured_production mode when running in serverless without cloud DB', () => {
      const origVercel = process.env.VERCEL;
      const origSupabase = process.env.SUPABASE_URL;
      try {
        process.env.VERCEL = '1';
        delete process.env.SUPABASE_URL;
        delete process.env.UPSTASH_REDIS_REST_URL;

        assert.strictEqual(getStorageMode(), 'unconfigured_production');
        assert.strictEqual(isDurable(), false);

        const status = getStorageStatus();
        assert.strictEqual(status.mode, 'unconfigured_production');
        assert.strictEqual(status.isServerless, true);
        assert.strictEqual(status.readyForProduction, false);
      } finally {
        if (origVercel !== undefined) process.env.VERCEL = origVercel; else delete process.env.VERCEL;
        if (origSupabase !== undefined) process.env.SUPABASE_URL = origSupabase; else delete process.env.SUPABASE_URL;
      }
    });
  });

  // 2. Production Safety Guards (No Ephemeral Silent Data Loss)
  describe('2. Ephemeral Storage Safety Guards (No Silent Data Loss)', () => {
    test('createToolSubmission rejects write with HTTP 503 in unconfigured production', async () => {
      const origVercel = process.env.VERCEL;
      const origSupabase = process.env.SUPABASE_URL;
      try {
        process.env.VERCEL = '1';
        delete process.env.SUPABASE_URL;
        delete process.env.UPSTASH_REDIS_REST_URL;

        const payload = {
          name: 'Production Test Tool',
          websiteUrl: 'https://prod-test-tool.com',
          category: 'coding',
          pricingType: 'free',
          description: 'A test tool submitted to check production ephemeral guard behavior in serverless.',
        };

        const result = await createToolSubmission(payload);
        assert.strictEqual(result.success, false);
        assert.strictEqual(result.status, 503);
        assert.strictEqual(result.error, 'StorageUnavailable');
        assert.strictEqual(result.storageMode, 'unconfigured_production');
        assert.ok(result.message.includes('Durable database storage is not yet configured'));
      } finally {
        if (origVercel !== undefined) process.env.VERCEL = origVercel; else delete process.env.VERCEL;
        if (origSupabase !== undefined) process.env.SUPABASE_URL = origSupabase; else delete process.env.SUPABASE_URL;
      }
    });

    test('createGuideSubmission rejects write with HTTP 503 in unconfigured production', async () => {
      const origVercel = process.env.VERCEL;
      try {
        process.env.VERCEL = '1';
        delete process.env.SUPABASE_URL;
        delete process.env.UPSTASH_REDIS_REST_URL;

        const payload = {
          title: 'Production Guard Test Guide with Comprehensive Workflow Steps',
          category: 'workflow-automation',
          summary: 'A test guide to verify serverless storage safety guard.',
          content: '## Step 1: Initialize Database\nSetting up production verification tests for SwitchRoute.\n\n## Step 2: Test Ephemeral Guards\nEnsure no silent data loss in serverless Vercel environments.',
        };

        const result = await createGuideSubmission(payload);
        assert.strictEqual(result.success, false);
        assert.strictEqual(result.status, 503);
        assert.strictEqual(result.error, 'StorageUnavailable');
      } finally {
        if (origVercel !== undefined) process.env.VERCEL = origVercel; else delete process.env.VERCEL;
      }
    });

    test('updateSubmissionStatus and publishSubmission reject with 503 in unconfigured production', async () => {
      const origVercel = process.env.VERCEL;
      const origAdminSecret = process.env.ADMIN_SECRET;
      try {
        process.env.VERCEL = '1';
        process.env.ADMIN_SECRET = 'test-production-admin-secret';
        delete process.env.SUPABASE_URL;
        delete process.env.UPSTASH_REDIS_REST_URL;

        const updateRes = updateSubmissionStatus('sub_tool_seed_001', { status: 'in_review' }, process.env.ADMIN_SECRET);
        assert.strictEqual(updateRes.success, false);
        assert.strictEqual(updateRes.status, 503);

        const updateAsyncRes = await updateSubmissionStatusAsync('sub_tool_seed_001', { status: 'in_review' }, process.env.ADMIN_SECRET);
        assert.strictEqual(updateAsyncRes.success, false);
        assert.strictEqual(updateAsyncRes.status, 503);

        const pubRes = publishSubmissionToCatalog('sub_tool_seed_001', process.env.ADMIN_SECRET);
        assert.strictEqual(pubRes.success, false);
        assert.strictEqual(pubRes.status, 503);

        const pubAsyncRes = await publishSubmissionToCatalogAsync('sub_tool_seed_001', process.env.ADMIN_SECRET);
        assert.strictEqual(pubAsyncRes.success, false);
        assert.strictEqual(pubAsyncRes.status, 503);
      } finally {
        if (origVercel !== undefined) process.env.VERCEL = origVercel; else delete process.env.VERCEL;
        if (origAdminSecret !== undefined) process.env.ADMIN_SECRET = origAdminSecret; else delete process.env.ADMIN_SECRET;
      }
    });

    test('readSubmissionsAsync and readPublishedAdditionsAsync fall back gracefully in serverless', async () => {
      const origVercel = process.env.VERCEL;
      try {
        process.env.VERCEL = '1';
        delete process.env.SUPABASE_URL;
        delete process.env.UPSTASH_REDIS_REST_URL;

        const subs = await readSubmissionsAsync();
        assert.ok(Array.isArray(subs));

        const published = await readPublishedAdditionsAsync();
        assert.ok(published && Array.isArray(published.tools));
      } finally {
        if (origVercel !== undefined) process.env.VERCEL = origVercel; else delete process.env.VERCEL;
      }
    });
  });

  // 3. Database Schema & Migration Utility Validation
  describe('3. Database Schema (DDL) & Migration Utility', () => {
    test('server/schema.sql exists and contains valid PostgreSQL DDL', () => {
      const schemaFile = path.join(ROOT_DIR, 'server', 'schema.sql');
      assert.ok(fs.existsSync(schemaFile), 'server/schema.sql must exist');

      const sqlContent = fs.readFileSync(schemaFile, 'utf8');
      assert.ok(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.techhacks_submissions'));
      assert.ok(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.techhacks_published_additions'));
      assert.ok(sqlContent.includes('ALTER TABLE public.techhacks_submissions ENABLE ROW LEVEL SECURITY'));
      assert.ok(sqlContent.includes('ALTER TABLE public.techhacks_published_additions ENABLE ROW LEVEL SECURITY'));
      assert.ok(sqlContent.includes('CREATE INDEX IF NOT EXISTS idx_techhacks_sub_status'));
      assert.ok(sqlContent.includes('CREATE INDEX IF NOT EXISTS idx_techhacks_sub_created_at'));
      assert.ok(sqlContent.includes('CREATE POLICY "Service role full access on submissions"'));
      assert.ok(sqlContent.includes('CREATE POLICY "Public can view published additions"'));
    });

    test('scripts/migrate-to-supabase.js exists and runs --dry-run without error', () => {
      const scriptPath = path.join(ROOT_DIR, 'scripts', 'migrate-to-supabase.js');
      assert.ok(fs.existsSync(scriptPath), 'scripts/migrate-to-supabase.js must exist');

      const output = execSync('node scripts/migrate-to-supabase.js --dry-run', {
        cwd: ROOT_DIR,
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024,
      });
      assert.ok(output.includes('SwitchRoute — Database Migration Assistant'));
      assert.ok(output.includes('[Dry Run] Inspection summary'));
      assert.ok(output.includes('Submissions ready for sync'));
    });

    test('scripts/migrate-to-supabase.js --sql outputs valid SQL INSERT statements', () => {
      let output = '';
      for (let attempt = 0; attempt < 3; attempt++) {
        output = execSync('node scripts/migrate-to-supabase.js --sql', {
          cwd: ROOT_DIR,
          encoding: 'utf8',
          maxBuffer: 10 * 1024 * 1024,
        });
        if (output.includes('INSERT INTO public.techhacks_published_additions')) break;
      }
      assert.ok(output.includes('Found 0 local submissions.'));
      assert.ok(!output.includes('INSERT INTO public.techhacks_submissions'), 'Empty production data must not create fake migration rows');
      assert.ok(output.includes('INSERT INTO public.techhacks_published_additions'));
      assert.ok(output.includes('ON CONFLICT (key)'));
    });
  });

  // 4. Data Transformation Contract (toDbRow & fromDbRow)
  describe('4. Data Mapping & Schema Transformation', () => {
    test('toDbRow converts application submission into database snake_case columns', () => {
      const appSubmission = {
        id: 'sub_tool_99999',
        type: 'tool',
        status: 'pending',
        createdAt: '2026-10-18T12:00:00.000Z',
        updatedAt: '2026-10-18T12:00:00.000Z',
        toolData: {
          name: 'Open Assistant Pro',
          websiteUrl: 'https://openassistant.ai',
          description: 'A powerful open-source conversational AI agent.',
        },
        potentialDuplicate: true,
        duplicateReason: 'Matching name',
        duplicateMatches: ['Open Assistant'],
        moderatorNotes: 'Need verification',
        isVerified: false,
        publishedSlug: 'open-assistant-pro',
        publishedAt: null,
      };

      const row = toDbRow(appSubmission);
      assert.strictEqual(row.id, 'sub_tool_99999');
      assert.strictEqual(row.type, 'tool');
      assert.strictEqual(row.status, 'pending');
      assert.strictEqual(row.created_at, '2026-10-18T12:00:00.000Z');
      assert.strictEqual(row.potential_duplicate, true);
      assert.strictEqual(row.duplicate_reason, 'Matching name');
      assert.deepStrictEqual(row.duplicate_matches, ['Open Assistant']);
      assert.strictEqual(row.moderator_notes, 'Need verification');
      assert.strictEqual(row.is_verified, false);
      assert.strictEqual(row.published_slug, 'open-assistant-pro');
      assert.strictEqual(row.tool_data.name, 'Open Assistant Pro');
    });

    test('fromDbRow converts database snake_case columns back to application camelCase', () => {
      const dbRow = {
        id: 'sub_guide_88888',
        type: 'guide',
        status: 'published',
        created_at: '2026-10-18T14:00:00.000Z',
        updated_at: '2026-10-18T14:30:00.000Z',
        guide_data: {
          title: 'Fine-Tuning Llama 3 on Local GPUs',
          summary: 'Complete guide to fine-tuning Llama 3 with LoRA.',
        },
        potential_duplicate: false,
        duplicate_reason: null,
        duplicate_matches: [],
        moderator_notes: 'Reviewed and verified.',
        is_verified: true,
        published_slug: 'fine-tuning-llama-3-local-gpus',
        published_at: '2026-10-18T14:30:00.000Z',
      };

      const appSub = fromDbRow(dbRow);
      assert.strictEqual(appSub.id, 'sub_guide_88888');
      assert.strictEqual(appSub.type, 'guide');
      assert.strictEqual(appSub.status, 'published');
      assert.strictEqual(appSub.createdAt, '2026-10-18T14:00:00.000Z');
      assert.strictEqual(appSub.updatedAt, '2026-10-18T14:30:00.000Z');
      assert.strictEqual(appSub.potentialDuplicate, false);
      assert.strictEqual(appSub.isVerified, true);
      assert.strictEqual(appSub.publishedSlug, 'fine-tuning-llama-3-local-gpus');
      assert.strictEqual(appSub.publishedAt, '2026-10-18T14:30:00.000Z');
      assert.strictEqual(appSub.guideData.title, 'Fine-Tuning Llama 3 on Local GPUs');
    });
  });

  // 5. Vercel & Domain Deployment Readiness
  describe('5. Vercel & Custom Domain Deployment Readiness', () => {
    test('vercel.json uses pre-rendered routing and retains security headers', () => {
      const vercelJsonPath = path.join(ROOT_DIR, 'vercel.json');
      assert.ok(fs.existsSync(vercelJsonPath), 'vercel.json must exist');

      const raw = fs.readFileSync(vercelJsonPath, 'utf8');
      const config = JSON.parse(raw);

      assert.strictEqual(config.cleanUrls, true);
      assert.ok(!config.rewrites || config.rewrites.length === 0, 'Global SPA rewrites must not turn unknown URLs into 200s');
      const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
      assert.ok(packageJson.scripts.build.includes('seo:prerender'), 'Production build must pre-render route HTML');

      // Security headers check
      const globalHeader = (config.headers || []).find((h) => h.source === '/(.*)');
      assert.ok(globalHeader, 'vercel.json must define security headers for /(.*)');

      const headersMap = {};
      globalHeader.headers.forEach((h) => {
        headersMap[h.key.toLowerCase()] = h.value;
      });

      assert.strictEqual(headersMap['x-content-type-options'], 'nosniff');
      assert.strictEqual(headersMap['x-frame-options'], 'DENY');
      assert.ok(headersMap['strict-transport-security']?.includes('max-age=63072000'));
      assert.strictEqual(headersMap['referrer-policy'], 'strict-origin-when-cross-origin');
    });

    test('.env.example documents all production variables including durable DB', () => {
      const envExamplePath = path.join(ROOT_DIR, '.env.example');
      assert.ok(fs.existsSync(envExamplePath), '.env.example must exist');

      const content = fs.readFileSync(envExamplePath, 'utf8');
      assert.ok(content.includes('VITE_SITE_URL='));
      assert.ok(content.includes('ADMIN_SECRET='));
      assert.ok(content.includes('SUPABASE_URL='));
      assert.ok(content.includes('SUPABASE_SERVICE_ROLE_KEY='));
      assert.ok(content.includes('GROQ_API_KEY='));
    });

    test('canonical URL resolver uses configured domain without localhost leak', () => {
      const canonical = getCanonicalUrl('/ai-tools/jan-ai');
      assert.ok(canonical.startsWith('https://switchroute.in'));
      assert.ok(!canonical.includes('localhost'));
      assert.strictEqual(canonical, 'https://switchroute.in/ai-tools/jan-ai');
    });

    test('robots.txt disallows sensitive administrative and API paths', () => {
      const robotsPath = path.join(ROOT_DIR, 'public', 'robots.txt');
      assert.ok(fs.existsSync(robotsPath), 'public/robots.txt must exist');

      const content = fs.readFileSync(robotsPath, 'utf8');
      assert.ok(content.includes('Disallow: /moderation'));
      assert.ok(content.includes('Disallow: /admin'));
      assert.ok(content.includes('Disallow: /api/'));
      assert.ok(content.includes('Sitemap: https://switchroute.in/sitemap.xml'));
    });

    test('package.json includes db:migrate script', () => {
      const pkgPath = path.join(ROOT_DIR, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      assert.ok(pkg.scripts['db:migrate']);
    });
  });
});
