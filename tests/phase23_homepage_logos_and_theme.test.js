import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { brandLogos, getBrandLogo } from '../src/data/brandLogos.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { toolsData } from '../src/data/seedData.ts';
import { offersData } from '../src/data/offersData.ts';

describe('Phase 23: Homepage Logo Fix, Real Brand Assets & Theme Toggle Repair', () => {
  // =========================================================================
  // 1. Theme Mode & Strictly Dark Enforcement (Updated in Phase 24)
  // =========================================================================
  describe('1. Theme Mode & Strictly Dark Enforcement', () => {
    test('ThemeContext strictly enforces dark theme, data-theme, and colorScheme', () => {
      const contextPath = path.resolve(process.cwd(), 'src/context/ThemeContext.tsx');
      const content = fs.readFileSync(contextPath, 'utf8');

      assert.ok(content.includes("root.setAttribute('data-theme', targetTheme)"), 'Sets data-theme dark attribute on root');
      assert.ok(content.includes("root.style.colorScheme = 'dark'"), 'Sets root style colorScheme to dark');
      assert.ok(content.includes("root.classList.remove('light')"), 'Removes light class');
      assert.ok(content.includes("root.classList.add('dark')"), 'Adds dark class');
    });

    test('ThemeContext preserves useTheme contract with dark default', () => {
      const contextPath = path.resolve(process.cwd(), 'src/context/ThemeContext.tsx');
      const content = fs.readFileSync(contextPath, 'utf8');

      assert.ok(content.includes("theme: 'dark'"), 'Provides theme: dark in context value');
      assert.ok(content.includes('toggleTheme'), 'Preserves toggleTheme contract');
      assert.ok(content.includes('setTheme'), 'Preserves setTheme contract');
    });

    test('index.html initializes dark theme synchronously and clears stale light preference', () => {
      const htmlPath = path.resolve(process.cwd(), 'index.html');
      const content = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(content.includes("document.documentElement.setAttribute('data-theme', 'dark')"), 'Sets dark data-theme');
      assert.ok(content.includes("document.documentElement.style.colorScheme = 'dark'"), 'Sets dark colorScheme');
      assert.ok(content.includes("document.documentElement.classList.add('dark')"), 'Sets dark class');
      assert.ok(content.includes("localStorage.removeItem('theme')"), 'Purges stale light theme preference from localStorage');
    });

    test('src/index.css defines tokens for dark theme', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      assert.ok(content.includes('html.dark'), 'Includes html.dark selector');
      assert.ok(content.includes('color-scheme: dark'), 'Dark mode declares color-scheme: dark');
      assert.ok(content.includes('--color-bg: 11 12 14'), 'Dark background token exists');
    });

    test('Header component cleanly removes theme toggle buttons per Phase 24 specifications', () => {
      const headerPath = path.resolve(process.cwd(), 'src/components/Header.tsx');
      const content = fs.readFileSync(headerPath, 'utf8');

      assert.ok(!content.includes('data-testid="theme-toggle-btn"'), 'Desktop theme button cleanly removed');
      assert.ok(!content.includes('data-testid="mobile-theme-toggle-btn"'), 'Mobile theme button cleanly removed');
    });
  });

  // =========================================================================
  // 2. Homepage Floating Brand Logos Verification
  // =========================================================================
  describe('2. Homepage Floating Brand Logos Verification', () => {
    test('HeroFloatingLogos uses high contrast opacity and backdrop blur', () => {
      const compPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      const content = fs.readFileSync(compPath, 'utf8');

      assert.ok(content.includes('opacity-80 dark:opacity-75'), 'Uses high-contrast 75-80% opacity');
      assert.ok(content.includes('backdrop-blur-md'), 'Includes backdrop-blur-md for glassy depth');
      assert.ok(content.includes('shadow-md'), 'Applies elevation shadow to badges');
    });

    test('Every floating badge wraps logos in a high-contrast mini tile container', () => {
      const compPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      const content = fs.readFileSync(compPath, 'utf8');

      assert.ok(content.includes('rounded-md bg-muted/70 dark:bg-muted/40'), 'Uses high-contrast inner logo tiles');
      assert.ok(content.includes('overflow-hidden shadow-xs'), 'Inner logo tiles clip cleanly with shadow');
    });

    test('All 14 brands featured in HeroFloatingLogos exist in brandLogos and on disk', () => {
      const featuredSlugs = [
        'claude-code',
        'aider',
        'perplexity',
        'perplexica',
        'cursor',
        'deepseek',
        'firebase',
        'supabase',
        'figma',
        'penpot',
        'ollama',
        'flux-1',
        'n8n',
        'kling-ai',
      ];

      for (const slug of featuredSlugs) {
        const logo = getBrandLogo(slug);
        assert.ok(logo, `Brand logo for ${slug} must be registered in brandLogos`);
        const fullPath = path.resolve(process.cwd(), 'public', logo.assetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(fullPath), `Logo asset for ${slug} must exist at ${fullPath}`);
      }
    });

    test('HeroFloatingLogos uses perimeter spacing and safe responsive rules', () => {
      const compPath = path.resolve(process.cwd(), 'src/components/HeroFloatingLogos.tsx');
      const content = fs.readFileSync(compPath, 'utf8');

      assert.ok(content.includes('hidden sm:flex'), 'Hides outer pairs on extra-small mobile');
      assert.ok(content.includes('hidden md:flex'), 'Hides ambient singles on narrow mobile');
      assert.ok(content.includes('hidden xl:flex'), 'Restricts wide pairs to extra-large viewports');
      assert.ok(content.includes('hidden 2xl:flex'), 'Restricts far outer desks to 2xl screens');
      assert.ok(!content.includes('light:opacity'), 'Contains no invalid light: Tailwind variant classes');
    });

    test('Floating logo animations respect prefers-reduced-motion in index.css', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      assert.ok(content.includes('@media (prefers-reduced-motion: reduce)'), 'Includes reduced motion media query');
      assert.ok(content.includes('.animate-float-slow-1'), 'floatSlow1 neutralized');
      assert.ok(content.includes('.animate-float-slow-2'), 'floatSlow2 neutralized');
    });
  });

  // =========================================================================
  // 3. Real Brand Assets & Dual-Theme Contrast Verification
  // =========================================================================
  describe('3. Real Brand Assets & Dual-Theme Contrast Verification', () => {
    test('BrandLogo synchronizes currentSrc via useEffect when slug changes', () => {
      const logoCompPath = path.resolve(process.cwd(), 'src/components/BrandLogo.tsx');
      const content = fs.readFileSync(logoCompPath, 'utf8');

      assert.ok(content.includes('useEffect(() => {'), 'Includes useEffect in BrandLogo');
      assert.ok(content.includes('setCurrentSrc(logoEntry?.assetPath)'), 'Updates currentSrc on slug prop change');
      assert.ok(content.includes('setHasError(false)'), 'Resets error state on slug prop change');
    });

    test('White-filled SVGs include background rects for light theme visibility', () => {
      const whiteSvgs = [
        'ollama.svg',
        'notion.svg',
        'elevenlabs.svg',
        'v0-vercel.svg',
        'cal-com.svg',
        'typeform.svg',
        'claude-code.svg',
      ];

      for (const file of whiteSvgs) {
        const svgPath = path.resolve(process.cwd(), 'public/logos', file);
        assert.ok(fs.existsSync(svgPath), `SVG ${file} must exist on disk`);
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        assert.ok(
          svgContent.includes('<rect') && /fill=["']#(000000|18181b|111111|111827|262627|1e1e24)/i.test(svgContent),
          `SVG ${file} must contain a dark background <rect> for light mode visibility`
        );
      }
    });

    test('100% of brand logos in brandLogos manifest have valid SVG files with viewBox', () => {
      let count = 0;
      for (const [slug, entry] of Object.entries(brandLogos)) {
        const p = path.resolve(process.cwd(), 'public', entry.assetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(p), `Logo file for ${slug} must exist on disk at ${p}`);
        const content = fs.readFileSync(p, 'utf8');
        assert.ok(content.includes('viewBox'), `Logo SVG for ${slug} must declare a viewBox`);
        count++;
      }
      assert.ok(count >= 218, 'At least 218 verified brand logos are validated');
    });

    test('All catalog tools across AI, SaaS Alternatives, Seed, and Offers have verified assets', () => {
      const checkTool = (slug, name) => {
        const logo = getBrandLogo(slug);
        assert.ok(logo, `Missing logo manifest entry for tool ${name} (${slug})`);
        const full = path.resolve(process.cwd(), 'public', logo.assetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(full), `Asset for ${name} (${slug}) must exist on disk at ${full}`);
      };

      aiToolsData.forEach((t) => checkTool(t.slug, t.name));
      proprietaryTools.forEach((t) => checkTool(t.slug, t.name));
      toolsData.forEach((t) => checkTool(t.slug, t.name));
      offersData.forEach((o) => {
        const full = path.resolve(process.cwd(), 'public', o.logoAssetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(full), `Offer ${o.title} logo must exist on disk at ${full}`);
      });
    });
  });
});
