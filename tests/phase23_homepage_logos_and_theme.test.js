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
      assert.ok(content.includes('{open && <nav id="mobile-navigation"'), 'Mobile navigation opens on demand');
      assert.ok(content.includes('<ThemeToggle /></div></nav>'), 'Mobile theme control is rendered inside the expanded menu');
    });

    test('ThemeToggle exposes the active theme through its accessible control', () => {
      const togglePath = path.resolve(process.cwd(), 'src/components/ThemeToggle.tsx');
      const content = fs.readFileSync(togglePath, 'utf8');

      assert.match(content, /aria-label=\{`Switch to \$\{theme === 'dark' \? 'light' : 'dark'\} mode`\}/, 'Control announces the destination theme');
      assert.match(content, /aria-pressed=\{theme === 'dark'\}/, 'Control exposes the active theme state');
      assert.ok(content.includes('onClick={toggleTheme}'), 'Control keeps theme switching functional');
      assert.ok(!content.includes('theme-hint'), 'Decorative hint is not repeated in the navigation');
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

    test('Homepage avoids duplicating catalog metrics in the compact discovery flow', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const servicePath = path.resolve(process.cwd(), 'src/services/aiCatalogService.ts');
      const content = fs.readFileSync(homePath, 'utf8');
      const service = fs.readFileSync(servicePath, 'utf8');
      assert.ok(content.includes('Choose a collection'), 'Collection entry points are the primary discovery shortcuts');
      assert.ok(content.includes('Browse by task'), 'Task categories remain discoverable');
      assert.ok(!content.includes('data-testid="catalog-trust-strip"'), 'The old large metric strip is not repeated on the homepage');
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

    test('Seven supplied tool logos use local provided artwork in the shared manifest and direct offer cards', () => {
      const manifestPath = path.resolve(process.cwd(), 'src/data/brandLogos.ts');
      const manifest = fs.readFileSync(manifestPath, 'utf8');
      const offersPath = path.resolve(process.cwd(), 'src/data/offersData.ts');
      const offers = fs.readFileSync(offersPath, 'utf8');
      const supplied = ['airtable', 'claude-code', 'figma', 'firebase', 'google-photos', 'omnirush', 'invideo-ai'];

      for (const slug of supplied) {
        assert.ok(manifest.includes(`"assetPath": "/logos/provided/${slug}.svg"`), `${slug} points to its supplied local artwork`);
        assert.ok(manifest.includes(`"${slug}": {`) && manifest.includes(`"sourceType": "provided"`), `${slug} is recorded as provided artwork`);
        assert.ok(fs.existsSync(path.resolve(process.cwd(), 'public/logos/provided', `${slug}.svg`)), `${slug} asset exists`);
      }
      assert.ok(offers.includes("logoAssetPath: '/logos/provided/figma.svg'"), 'Figma offer card uses the provided logo');
      assert.ok(offers.includes("logoAssetPath: '/logos/provided/firebase.svg'"), 'Firebase offer card uses the provided logo');
    });

    test('BrandLogo only paints traceable assets and exposes a neutral fallback status', () => {
      const logoCompPath = path.resolve(process.cwd(), 'src/components/BrandLogo.tsx');
      const content = fs.readFileSync(logoCompPath, 'utf8');

      assert.ok(content.includes("logoEntry.sourceType === 'provided'"), 'Explicitly provided local artwork is trusted without a fabricated source URL');
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
