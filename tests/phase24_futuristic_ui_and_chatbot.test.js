import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 24: Futuristic UI, Interactive Background & Chatbot Repair', () => {
  // =========================================================================
  // 1. Task 1: Homepage Floating Brand Logos Removal
  // =========================================================================
  describe('Task 1: Homepage Floating Brand Logos Removal', () => {
    test('HomePage does not render or import HeroFloatingLogos', () => {
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
  // 2. Task 2: Strictly Dark Theme Enforcement
  // =========================================================================
  describe('Task 2: Strictly Dark Theme Enforcement', () => {
    test('Header component removes theme toggle button from desktop and mobile views', () => {
      const headerPath = path.resolve(process.cwd(), 'src/components/Header.tsx');
      const content = fs.readFileSync(headerPath, 'utf8');

      assert.ok(!content.includes('data-testid="theme-toggle-btn"'), 'Desktop theme button removed from Header');
      assert.ok(!content.includes('data-testid="mobile-theme-toggle-btn"'), 'Mobile theme button removed from Header');
    });

    test('ThemeContext strictly enforces dark theme and synchronizes DOM attributes', () => {
      const contextPath = path.resolve(process.cwd(), 'src/context/ThemeContext.tsx');
      const content = fs.readFileSync(contextPath, 'utf8');

      assert.ok(content.includes("theme: 'dark'"), 'useTheme provides theme: dark');
      assert.ok(content.includes("root.setAttribute('data-theme'"), 'Applies data-theme attribute');
      assert.ok(content.includes("root.style.colorScheme = 'dark'"), 'Applies dark colorScheme for form controls');
      assert.ok(content.includes("root.classList.add('dark')"), 'Applies dark class to documentElement');
      assert.ok(content.includes("root.classList.remove('light')"), 'Removes light class');
      assert.ok(content.includes("localStorage.setItem('theme', 'dark')"), 'Overrides saved light mode in localStorage');
    });

    test('index.html initializes dark theme and removes stale light preference', () => {
      const htmlPath = path.resolve(process.cwd(), 'index.html');
      const content = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(content.includes("localStorage.removeItem('theme')"), 'Purges stale light theme');
      assert.ok(content.includes("document.documentElement.classList.add('dark')"), 'Adds dark class synchronously');
      assert.ok(content.includes("document.documentElement.setAttribute('data-theme', 'dark')"), 'Sets data-theme="dark"');
      assert.ok(content.includes("document.documentElement.style.colorScheme = 'dark'"), 'Sets colorScheme to dark');
    });
  });

  // =========================================================================
  // 3. Task 3: Real Mouse-Follow Glow Effect
  // =========================================================================
  describe('Task 3: Real Mouse-Follow Glow Effect', () => {
    test('AmbientGlow renders holographic multi-stop radial gradient in cyan, blue and purple', () => {
      const glowPath = path.resolve(process.cwd(), 'src/components/AmbientGlow.tsx');
      const content = fs.readFileSync(glowPath, 'utf8');

      assert.ok(content.includes('rgba(6, 182, 212,'), 'Uses vibrant cyan stop in cursor aura');
      assert.ok(content.includes('rgba(59, 130, 246,'), 'Uses electric blue stop in cursor aura');
      assert.ok(content.includes('rgba(147, 51, 234,'), 'Uses subtle violet stop in cursor aura');
      assert.ok(content.includes('--mouse-x'), 'Uses dynamic --mouse-x CSS custom property');
      assert.ok(content.includes('--mouse-y'), 'Uses dynamic --mouse-y CSS custom property');
    });

    test('AmbientGlow container is non-blocking, behind content, and accessible', () => {
      const glowPath = path.resolve(process.cwd(), 'src/components/AmbientGlow.tsx');
      const content = fs.readFileSync(glowPath, 'utf8');

      assert.ok(content.includes('pointer-events-none'), 'Container has pointer-events-none');
      assert.ok(content.includes('-z-10'), 'Container positioned behind interactive content (-z-10)');
      assert.ok(content.includes('aria-hidden="true"'), 'Container hidden from screen readers');
      assert.ok(content.includes('prefers-reduced-motion'), 'Respects prefers-reduced-motion');
      assert.ok(content.includes('pointer: fine'), 'Disabled on coarse touch pointers');
    });
  });

  // =========================================================================
  // 4. Task 4: Working 5-Second Chatbot Welcome Popup
  // =========================================================================
  describe('Task 4: Working 5-Second Chatbot Welcome Popup', () => {
    test('FloatingChatbot initializes 5000ms delay timer with sessionStorage persistence', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('5000'), 'Uses exact 5000ms delay timer');
      assert.ok(content.includes('techhacks_assistant_welcome_dismissed'), 'Uses session persistence key');
      assert.ok(content.includes('clearTimeout(timer)'), 'Cleans up timer on unmount');
    });

    test('Welcome popup bubble contains dismiss button and opens chat on click', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('data-testid="dismiss-welcome-btn"'), 'Has accessible dismiss button');
      assert.ok(content.includes('onClick={handleOpenFromWelcome}'), 'Bubble body opens chat on click');
      assert.ok(content.includes('Need help finding the right AI tool? 👋'), 'Has friendly invitation headline');
      assert.ok(content.includes('border-cyan-500/30'), 'Styled with holographic cyan border glow');
    });
  });

  // =========================================================================
  // 5. Task 5: Futuristic Holographic Chatbot UI
  // =========================================================================
  describe('Task 5: Futuristic Holographic Chatbot UI', () => {
    test('Chat panel uses translucent glass, cyan border glow, and cybernetic halo', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('backdrop-blur-2xl'), 'Uses high-blur translucent glass');
      assert.ok(content.includes('border-cyan-500/30'), 'Uses holographic cyan border');
      assert.ok(content.includes('Online / Ready'), 'Header displays cybernetic Online / Ready status badge');
      assert.ok(content.includes('from-cyan-600 to-blue-600'), 'User messages styled with cyan-to-blue gradient');
      assert.ok(content.includes('animate-bounce'), 'Includes animated pulsing typing indicator dots');
    });

    test('Chatbot launcher features high-contrast holographic styling', () => {
      const chatbotPath = path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx');
      const content = fs.readFileSync(chatbotPath, 'utf8');

      assert.ok(content.includes('Ask Tech Hacks AI'), 'Displays clear Ask Tech Hacks AI label');
      assert.ok(content.includes('AiOrb3D'), 'Renders 3D companion orb inside launcher');
      assert.ok(content.includes('shadow-cyan-500'), 'Launcher illuminates with cyan hover glow');
    });
  });

  // =========================================================================
  // 6. Task 6 & 7: Interactive Background, Search Polish & Card Illumination
  // =========================================================================
  describe('Task 6 & 7: Interactive Background & Interaction Polish', () => {
    test('HomePage features modern layered background and hero halo bloom', () => {
      const homePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
      const content = fs.readFileSync(homePath, 'utf8');

      assert.ok(content.includes('bg-dot-pattern'), 'Features fine dot texture pattern');
      assert.ok(content.includes('bg-grid-pattern'), 'Features subtle geometric grid pattern');
      assert.ok(content.includes('animate-ambient-drift'), 'Features drifting ambient gradient bloom');
      assert.ok(content.includes('from-cyan-500/15 via-blue-600/15 to-purple-600/10'), 'Central hero halo has cybernetic color mesh');
    });

    test('UniversalSearch includes Cmd+K shortcut listener and glowing cyan focus ring', () => {
      const searchPath = path.resolve(process.cwd(), 'src/components/UniversalSearch.tsx');
      const content = fs.readFileSync(searchPath, 'utf8');

      assert.ok(content.includes('handleGlobalKeyDown'), 'Listens for global keyboard shortcut');
      assert.ok(content.includes('⌘K'), 'Renders ⌘K shortcut hint badge');
      assert.ok(content.includes('focus:ring-cyan-500/50'), 'Includes cyan focus ring');
      assert.ok(content.includes('focus:shadow-['), 'Includes soft focus glow shadow');
    });

    test('AiToolCard and AlternativeCard feature refined elevation and cyan spotlight', () => {
      const aiCardPath = path.resolve(process.cwd(), 'src/components/AiToolCard.tsx');
      const aiContent = fs.readFileSync(aiCardPath, 'utf8');
      assert.ok(aiContent.includes('hover:-translate-y-1.5'), 'AiToolCard has refined hover elevation');
      assert.ok(aiContent.includes('hover:border-cyan-500/40'), 'AiToolCard illuminates with cyan border on hover');
      assert.ok(aiContent.includes('rgba(6, 182, 212,'), 'AiToolCard features cyan interactive spotlight');

      const altCardPath = path.resolve(process.cwd(), 'src/components/AlternativeCard.tsx');
      const altContent = fs.readFileSync(altCardPath, 'utf8');
      assert.ok(altContent.includes('hover:-translate-y-1.5'), 'AlternativeCard has refined hover elevation');
      assert.ok(altContent.includes('hover:border-cyan-500/40'), 'AlternativeCard illuminates with cyan border on hover');
      assert.ok(altContent.includes('rgba(6, 182, 212,'), 'AlternativeCard features cyan interactive spotlight');
    });
  });
});
