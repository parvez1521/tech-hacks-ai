import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 24: Restrained UI, Verified Navigation & Chatbot Repair', () => {
  // =========================================================================
  // 1. Task 1: Homepage Focused Hero
  // =========================================================================
  describe('Task 1: Homepage Floating Brand Logos Removal', () => {
    test('HomePage removes the unwanted HeroFloatingLogos composition', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const content = fs.readFileSync(homePath, 'utf8');

      assert.ok(!content.includes('<HeroFloatingLogos'), 'HomePage does not render <HeroFloatingLogos />');
      assert.ok(!content.includes("from '../components/HeroFloatingLogos'"), 'HomePage does not import HeroFloatingLogos');
    });

    test('Hero section in HomePage maintains clean, focused, centered layout', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const content = fs.readFileSync(homePath, 'utf8');

      assert.ok(content.includes('Discover the Best AI Tools & Open Source Alternatives'), 'Hero H1 headline intact');
      assert.ok(content.includes('<UniversalSearch />'), 'Universal search bar prominently centered');
      assert.ok(content.includes('text-center max-w-6xl mx-auto'), 'Hero remains centered and readable');
    });
  });

  // =========================================================================
  // 2. Task 2: Dark-First Theme Preference
  // =========================================================================
  describe('Task 2: Dark-First Theme Preference', () => {
    test('Header component renders theme toggle button from desktop and mobile views', () => {
      const headerPath = path.resolve(process.cwd(), 'src/components/Header.tsx');
      const content = fs.readFileSync(headerPath, 'utf8');

      assert.ok(content.includes('<ThemeToggle />'), 'Desktop theme button is present in Header');
      assert.ok(content.includes('<ThemeToggle compact />'), 'Mobile theme button is present in Header');
    });

    test('ThemeContext synchronizes both theme modes and explicit storage choices', () => {
      const contextPath = path.resolve(process.cwd(), 'src/context/ThemeContext.tsx');
      const content = fs.readFileSync(contextPath, 'utf8');

      assert.ok(content.includes('value={{ theme, toggleTheme, setTheme }}'), 'useTheme provides the active theme');
      assert.ok(content.includes("root.setAttribute('data-theme'"), 'Applies data-theme attribute');
      assert.ok(content.includes('root.style.colorScheme = theme'), 'Applies active colorScheme for form controls');
      assert.ok(content.includes("root.classList.toggle('dark', isDark)"), 'Applies active dark class to documentElement');
      assert.ok(content.includes("root.classList.toggle('light', !isDark)"), 'Applies active light class to documentElement');
      assert.ok(content.includes('localStorage.setItem(THEME_STORAGE_KEY, nextTheme)'), 'Persists explicit mode choice');
    });

    test('index.html initializes dark theme without erasing a saved preference', () => {
      const htmlPath = path.resolve(process.cwd(), 'index.html');
      const content = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(content.includes("var theme = savedTheme === 'light' ? 'light' : 'dark'"), 'Defaults to dark and reads saved light');
      assert.ok(content.includes("root.classList.toggle('dark', theme === 'dark')"), 'Adds dark class synchronously');
      assert.ok(content.includes("root.setAttribute('data-theme', theme)"), 'Sets data-theme synchronously');
      assert.ok(content.includes("root.style.colorScheme = theme"), 'Sets colorScheme synchronously');
      assert.ok(!content.includes("localStorage.removeItem('theme')"), 'Does not purge explicit preference');
    });
  });

  // =========================================================================
  // 3. Task 3: Restrained global background treatment
  // =========================================================================
  describe('Task 3: Restrained global background treatment', () => {
    test('AmbientGlow paints a restrained global field behind the content shell', () => {
      const glowPath = path.resolve(process.cwd(), 'src/components/AmbientGlow.tsx');
      const content = fs.readFileSync(glowPath, 'utf8');

      assert.ok(content.includes('const ENABLE_AMBIENT_GLOW = true'), 'Global ambient painting is enabled');
      assert.ok(content.includes('ambient-glow-container'), 'Global field uses a dedicated visual layer');
    });

    test('AmbientGlow container is non-blocking, behind content, and accessible', () => {
      const glowPath = path.resolve(process.cwd(), 'src/components/AmbientGlow.tsx');
      const content = fs.readFileSync(glowPath, 'utf8');

      assert.ok(content.includes('pointer-events-none'), 'Container has pointer-events-none');
      assert.ok(content.includes('z-0'), 'Container positioned behind interactive content');
      assert.ok(content.includes('aria-hidden="true"'), 'Container hidden from screen readers');
      assert.ok(content.includes('prefers-reduced-motion'), 'Respects prefers-reduced-motion');
      assert.ok(content.includes('pointer: fine'), 'Disabled on coarse touch pointers');
    });
  });

  // =========================================================================
  // 4. Task 4: Working proactive chatbot suggestion
  // =========================================================================
  describe('Task 4: Working proactive chatbot suggestion', () => {
    test('FloatingChatbot selects and displays a local suggestion immediately', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('selectProactiveSuggestion()'), 'Uses the local proactive selector');
      assert.ok(content.includes('setShowWelcome(true)'), 'Makes the suggestion bubble visible');
      assert.ok(!content.includes('5000'), 'Does not delay the first suggestion');
    });

    test('Welcome popup bubble contains dismiss button and opens chat on click', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('data-testid="dismiss-welcome-btn"'), 'Has accessible dismiss button');
      assert.ok(content.includes('onClick={handleOpenFromWelcome}'), 'Bubble body opens chat on click');
      assert.ok(content.includes('A useful place to start'), 'Has a useful invitation headline');
      assert.ok(content.includes('bg-card border border-border'), 'Styled with an opaque shared surface');
    });
  });

  // =========================================================================
  // 5. Task 5: Focused chatbot UI
  // =========================================================================
  describe('Task 5: Focused chatbot UI', () => {
    test('Chat panel uses an opaque surface and clear catalog status', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('bg-card shadow-xl'), 'Panel uses an opaque elevated surface');
      assert.ok(content.includes('border-border'), 'Panel uses the shared border token');
      assert.ok(content.includes('Catalog'), 'Header displays the catalog assistant status');
      assert.ok(!content.includes('from-cyan-600 to-blue-600'), 'User messages do not use a gradient');
      assert.ok(content.includes('animate-bounce'), 'Includes animated pulsing typing indicator dots');
    });

    test('Chatbot launcher features high-contrast holographic styling', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('Ask Tech Hacks AI'), 'Displays clear Ask Tech Hacks AI label');
      assert.ok(content.includes('AiOrb3D'), 'Renders 3D companion orb inside launcher');
      assert.ok(content.includes('border-border'), 'Launcher uses the shared border token');
    });
  });

  // =========================================================================
  // 6. Task 6 & 7: Search polish & card interaction
  // =========================================================================
  describe('Task 6 & 7: Interactive Background & Interaction Polish', () => {
    test('HomePage keeps decorative hero layers behind the functional search hierarchy', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const content = fs.readFileSync(homePath, 'utf8');

      assert.ok(content.includes('hero-shell'), 'Hero uses the cinematic shell');
      assert.ok(content.includes('<HeroSignalVisual />'), 'Hero keeps the depth visual');
      assert.ok(!content.includes('<HeroFloatingLogos />'), 'Hero does not include the removed logo orbit');
      assert.ok(content.includes('<UniversalSearch />'), 'Functional search remains in the hero');
    });

    test('UniversalSearch includes Cmd+K shortcut listener and glowing cyan focus ring', () => {
      const searchPath = path.resolve(process.cwd(), 'src/components/UniversalSearch.tsx');
      const content = fs.readFileSync(searchPath, 'utf8');

      assert.ok(content.includes('handleGlobalKeyDown'), 'Listens for global keyboard shortcut');
      assert.ok(content.includes('⌘K'), 'Renders ⌘K shortcut hint badge');
      assert.ok(content.includes('focus:ring-cyan-500/50'), 'Includes cyan focus ring');
      assert.ok(content.includes('focus:shadow-['), 'Includes soft focus glow shadow');
    });

    test('AiToolCard and AlternativeCard use shared restrained interaction styles', () => {
      const aiCardPath = path.resolve(process.cwd(), 'src/components/AiToolCard.tsx');
      const aiContent = fs.readFileSync(aiCardPath, 'utf8');
      assert.ok(aiContent.includes('hover:-translate-y-1.5'), 'AiToolCard has refined hover elevation');
      assert.ok(aiContent.includes('hover:border-cyan-500/40'), 'AiToolCard illuminates with cyan border on hover');
      assert.ok(aiContent.includes('interactive-card'), 'AiToolCard uses the shared interaction utility');

      const altCardPath = path.resolve(process.cwd(), 'src/components/AlternativeCard.tsx');
      const altContent = fs.readFileSync(altCardPath, 'utf8');
      assert.ok(altContent.includes('hover:-translate-y-1.5'), 'AlternativeCard has refined hover elevation');
      assert.ok(altContent.includes('hover:border-cyan-500/40'), 'AlternativeCard illuminates with cyan border on hover');
      assert.ok(altContent.includes('interactive-card'), 'AlternativeCard uses the shared interaction utility');
    });
  });
});
