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
  // 1. Theme Mode & Dark-First Preference
  // =========================================================================
  describe('1. Theme Mode & Dark-First Preference', () => {
    test('ThemeContext supports dark-first initialization and explicit light/dark switching', () => {
      const contextPath = path.resolve(process.cwd(), 'src/context/ThemeContext.tsx');
      const content = fs.readFileSync(contextPath, 'utf8');

      assert.ok(content.includes('function getInitialTheme'), 'Has a synchronous initial theme resolver');
      assert.ok(content.includes("savedTheme === 'light' || savedTheme === 'dark'"), 'Accepts explicit saved preferences');
      assert.ok(content.includes("return 'dark'"), 'Defaults to dark without a saved preference');
      assert.ok(content.includes("root.setAttribute('data-theme', theme)"), 'Sets the active data-theme attribute');
      assert.ok(content.includes('root.style.colorScheme = theme'), 'Synchronizes form control color scheme');
      assert.ok(content.includes("localStorage.setItem(THEME_STORAGE_KEY, nextTheme)"), 'Persists explicit choices');
    });

    test('ThemeContext preserves useTheme contract with dark default', () => {
      const contextPath = path.resolve(process.cwd(), 'src/context/ThemeContext.tsx');
      const content = fs.readFileSync(contextPath, 'utf8');

      assert.ok(content.includes('value={{ theme, toggleTheme, setTheme }}'), 'Provides the live theme in context');
      assert.ok(content.includes('toggleTheme'), 'Preserves toggleTheme contract');
      assert.ok(content.includes('setTheme'), 'Preserves setTheme contract');
    });

    test('index.html initializes dark synchronously while honoring a saved light preference', () => {
      const htmlPath = path.resolve(process.cwd(), 'index.html');
      const content = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(content.includes("var theme = savedTheme === 'light' ? 'light' : 'dark'"), 'Defaults to dark while honoring light');
      assert.ok(content.includes("root.setAttribute('data-theme', theme)"), 'Sets data-theme before first paint');
      assert.ok(content.includes("root.style.colorScheme = theme"), 'Sets colorScheme before first paint');
      assert.ok(content.includes("root.classList.toggle('dark', theme === 'dark')"), 'Sets dark class before first paint');
      assert.ok(!content.includes("localStorage.removeItem('theme')"), 'Does not erase explicit preference');
    });

    test('src/index.css defines tokens for dark theme', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      assert.ok(content.includes('html.dark'), 'Includes html.dark selector');
      assert.ok(content.includes('color-scheme: dark'), 'Dark mode declares color-scheme: dark');
      assert.ok(content.includes('--color-bg: var(--brand-midnight)'), 'Midnight-blue dark background token exists');
    });

    test('Header exposes an accessible theme toggle for desktop and mobile', () => {
      const headerPath = path.resolve(process.cwd(), 'src/components/Header.tsx');
      const content = fs.readFileSync(headerPath, 'utf8');

      assert.ok(content.includes('<ThemeToggle />'), 'Desktop theme control is rendered');
      assert.ok(content.includes('<ThemeToggle compact />'), 'Mobile theme control is rendered');
    });

    test('ThemeToggle keeps one playful quote per session and dismisses it on interaction', () => {
      const togglePath = path.resolve(process.cwd(), 'src/components/ThemeToggle.tsx');
      const content = fs.readFileSync(togglePath, 'utf8');

      assert.ok(content.includes('THEME_HINT_QUOTE_SESSION_KEY'), 'Stores the selected quote in session storage');
      assert.ok(content.includes('THEME_HINT_QUOTES'), 'Uses a curated quote list');
      assert.ok(content.includes('sessionStorage.setItem(THEME_HINT_SESSION_KEY, \'1\')'), 'Dismisses the hint after interaction');
      assert.ok(content.includes('pointer-events'), 'Hint styling is expected to remain non-blocking');
    });
  });

  // =========================================================================
  // 2. Homepage Focused Hero & Truthful Catalog Metrics
  // =========================================================================
  describe('2. Homepage Focused Hero & Truthful Catalog Metrics', () => {
    test('Homepage removes the unwanted logo orbit but keeps the real discovery controls', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const content = fs.readFileSync(homePath, 'utf8');
      assert.ok(!content.includes('HeroFloatingLogos'), 'Homepage does not render the removed orbit');
      assert.ok(content.includes('<HeroSignalVisual />'), 'Keeps the restrained hero visual');
      assert.ok(content.includes('<UniversalSearch />'), 'Keeps the functional search');
    });

    test('Homepage restores truthful dynamic catalog metrics', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const servicePath = path.resolve(process.cwd(), 'src/services/aiCatalogService.ts');
      const content = fs.readFileSync(homePath, 'utf8');
      const service = fs.readFileSync(servicePath, 'utf8');
      assert.ok(content.includes('data-testid="catalog-trust-strip"'), 'Trust strip is rendered');
      assert.ok(content.includes('catalogStats.proprietaryToolsWithAlternatives'), 'Trust strip uses a distinct proprietary-tool target count');
      assert.ok(content.includes('catalogStats.imagePrompts'), 'Trust strip uses an image prompt count');
      assert.ok(content.includes('catalogStats.videoPrompts'), 'Trust strip uses a video prompt count');
      assert.ok(content.includes('catalogStats.browserUtilities'), 'Trust strip uses the current utility count');
      assert.ok(service.includes('export function getCatalogStats'), 'Catalog stats are computed in a shared service');
      assert.ok(!content.includes('10,000+'), 'Does not make an unsupported 10,000+ claim');
    });

    test('Catalog stats de-duplicate identity slugs', () => {
      const servicePath = path.resolve(process.cwd(), 'src/services/aiCatalogService.ts');
      const content = fs.readFileSync(servicePath, 'utf8');
      assert.ok(content.includes('new Set([...openSourceSlugs, ...aiSlugs, ...alternativeSlugs])'), 'Uses set-based unique identity counting');
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

    test('official light/dark wordmarks receive contrast tiles without recoloring', () => {
      const css = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf8');
      assert.ok(css.includes('.brand-logo-image--anythingllm'), 'Dark wordmarks have an explicit contrast selector');
      assert.ok(css.includes('.brand-logo-image--google-ai-studio'), 'Light wordmarks have an explicit contrast selector');
      assert.ok(css.includes('background: #ffffff'), 'Dark wordmarks use a light neutral tile');
      assert.ok(css.includes('background: #111c2f'), 'Light wordmarks use a dark neutral tile');
    });

    test('100% of brand logos in brandLogos manifest have valid image assets', () => {
      let count = 0;
      for (const [slug, entry] of Object.entries(brandLogos)) {
        const p = path.resolve(process.cwd(), 'public', entry.assetPath.replace(/^\//, ''));
        assert.ok(fs.existsSync(p), `Logo file for ${slug} must exist on disk at ${p}`);
        const content = fs.readFileSync(p);
        if (/\.svg$/i.test(p)) {
          const svg = content.toString('utf8');
          assert.ok(svg.includes('<svg'), `Logo SVG for ${slug} must declare an SVG root`);
          assert.ok(svg.includes('viewBox') || (svg.includes('width') && svg.includes('height')), `Logo SVG for ${slug} must declare viewport dimensions`);
        } else {
          assert.ok(content.length > 32, `Raster logo for ${slug} is suspiciously small`);
        }
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

    test('BrandLogo only paints traceable assets and exposes a neutral fallback status', () => {
      const logoCompPath = path.resolve(process.cwd(), 'src/components/BrandLogo.tsx');
      const content = fs.readFileSync(logoCompPath, 'utf8');

      assert.ok(content.includes('const isTrustedLogo = Boolean(logoEntry?.sourceUrl'), 'Trust is based on provenance, not filename');
       assert.ok(content.includes('data-logo-status={logoStatus}'), 'Logo provenance status is exposed for QA');
       assert.ok(content.includes('data-logo-status="intentional-neutral-fallback"'), 'Fallback status is exposed for QA');
    });

    test('Homepage uses a catalog-backed discovery interface with real logo components and reduced-motion support', () => {
      const heroPath = path.resolve('src/components/HeroSignalVisual.tsx');
      const homePath = path.resolve('src/pages/HomePage.tsx');
      const heroContent = fs.readFileSync(heroPath, 'utf8');
      const homeContent = fs.readFileSync(homePath, 'utf8');

      assert.ok(homeContent.includes('<HeroSignalVisual />'), 'Homepage renders the hero visual');
      const cssContent = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
      assert.ok(heroContent.includes('getAllAiTools()'), 'Hero visual uses the real catalog');
      assert.ok(cssContent.includes('@media (prefers-reduced-motion: reduce)') && cssContent.includes('.discovery-interface__result'), 'Hero interactions respect reduced motion');
      assert.ok(heroContent.includes('<BrandLogo'), 'Discovery preview uses provenance-aware local logo assets');
    });
  });
});
