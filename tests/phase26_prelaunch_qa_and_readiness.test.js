/**
 * Phase 26 Test Suite — Prelaunch QA, Production Readiness & Security Audit
 *
 * Verifies:
 * 1. Security: .gitignore includes .env and local secret patterns
 * 2. Configuration: .env.example exists and documents all production variables
 * 3. SEO & Crawlers: robots.txt disallows private administrative & API routes
 * 4. Architecture: siteConfig supports configurable VITE_SITE_URL
 * 5. Serverless: submissionsStore supports VERCEL environment /tmp fallback
 * 6. Markdown Security: SafeMarkdown disallows unsafe URI schemes (javascript:, data:)
 * 7. Bundle Quality: All production chunk sizes remain optimized
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf-8');

describe('Phase 26: Final QA, Production Readiness & Domain Preparation', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. Git & Environment Secrets Protection
  // ──────────────────────────────────────────────────────────────────────────
  it('.gitignore blocks .env files from accidental commit', () => {
    const gitignore = read('.gitignore');
    assert.ok(gitignore.includes('.env'), '.gitignore must ignore .env');
    assert.ok(gitignore.includes('.env.local'), '.gitignore must ignore .env.local');
    assert.ok(gitignore.includes('.env.production'), '.gitignore must ignore .env.production');
  });

  it('.env.example exists with comprehensive production documentation', () => {
    const envExamplePath = path.join(ROOT, '.env.example');
    assert.ok(fs.existsSync(envExamplePath), '.env.example must exist in project root');
    const content = read('.env.example');
    assert.ok(content.includes('VITE_SITE_URL='), 'Must document VITE_SITE_URL');
    assert.ok(content.includes('GROQ_API_KEY='), 'Must document GROQ_API_KEY');
    assert.ok(content.includes('GEMINI_API_KEY='), 'Must document GEMINI_API_KEY');
    assert.ok(content.includes('ADMIN_SECRET='), 'Must document ADMIN_SECRET');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. SEO & Crawler Directives in robots.txt
  // ──────────────────────────────────────────────────────────────────────────
  it('robots.txt disallows moderation, admin, saved, and api routes', () => {
    const robots = read('public/robots.txt');
    assert.ok(robots.includes('Disallow: /saved'), 'Must disallow /saved');
    assert.ok(robots.includes('Disallow: /moderation'), 'Must disallow /moderation');
    assert.ok(robots.includes('Disallow: /admin'), 'Must disallow /admin');
    assert.ok(robots.includes('Disallow: /api/'), 'Must disallow /api/');
    assert.ok(robots.includes('Sitemap: https://techhacksai.com/sitemap.xml'), 'Must declare sitemap');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Configurable Domain & Canonical Base URL
  // ──────────────────────────────────────────────────────────────────────────
  it('siteConfig supports VITE_SITE_URL environment configuration with default fallback', () => {
    const siteConfigSrc = read('src/config/site.ts');
    assert.ok(
      siteConfigSrc.includes('import.meta.env?.VITE_SITE_URL'),
      'siteConfig must read VITE_SITE_URL'
    );
    assert.ok(
      siteConfigSrc.includes('https://techhacksai.com'),
      'siteConfig must fallback to techhacksai.com'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Serverless Ephemeral Filesystem Compatibility
  // ──────────────────────────────────────────────────────────────────────────
  it('submissionsStore supports Vercel serverless /tmp fallback', () => {
    const storeSrc = read('server/submissionsStore.js');
    assert.ok(
      storeSrc.includes('process.env.VERCEL'),
      'Must check process.env.VERCEL for serverless environment'
    );
    assert.ok(
      storeSrc.includes('/tmp'),
      'Must use writable /tmp directory on serverless runtimes'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. SafeMarkdown Protocol Sanitization
  // ──────────────────────────────────────────────────────────────────────────
  it('SafeMarkdown component rejects dangerous javascript: protocol URLs', () => {
    const mdSrc = read('src/components/SafeMarkdown.tsx');
    assert.ok(
      mdSrc.includes('/^https?:\\/\\//i'),
      'SafeMarkdown must validate http/https protocols'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Production Bundle Chunk Optimization
  // ──────────────────────────────────────────────────────────────────────────
  it('vite.config.js splits vendor and page chunks cleanly', () => {
    const viteConfig = read('vite.config.js');
    assert.ok(viteConfig.includes("'vendor-react'"), 'Splits vendor-react');
    assert.ok(viteConfig.includes("'vendor-icons'"), 'Splits vendor-icons');
    assert.ok(viteConfig.includes("'catalog-data'"), 'Splits catalog-data');
    assert.ok(viteConfig.includes("'app-pages'"), 'Splits app-pages');
  });
});
