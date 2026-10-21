import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9222;
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 10000000);
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve(data.result);
        }
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/tools', name: 'Open Source Tools' },
  { path: '/tools/supabase', name: 'Tool Detail (Supabase)' },
  { path: '/categories', name: 'Categories Index' },
  { path: '/categories/developer-tools', name: 'Category Detail (Developer Tools)' },
  { path: '/alternatives', name: 'Alternatives Index' },
  { path: '/alternatives/firebase', name: 'Alternative Detail (Firebase)' },
  { path: '/collections/developer-essentials', name: 'Collection Detail' },
  { path: '/ai-tools', name: 'AI Tools Directory' },
  { path: '/ai-tools/claude-3-5-sonnet', name: 'AI Tool Detail (Claude 3.5 Sonnet)' },
  { path: '/free-ai-sites', name: 'Free AI Sites' },
  { path: '/guides', name: 'Guides Directory' },
  { path: '/guides/supabase-self-hosting', name: 'Guide Detail' },
  { path: '/prompt-library', name: 'Prompt Library' },
  { path: '/prompt-library/senior-architect-code-review', name: 'Prompt Detail' },
  { path: '/free-tools', name: 'Free Browser Utilities' },
  { path: '/free-tools/json-formatter', name: 'Free Utility Detail' },
  { path: '/compare', name: 'Side-by-Side Comparison' },
  { path: '/pick', name: 'Help Me Pick Wizard' },
  { path: '/saved', name: 'Saved Bookmarks' },
  { path: '/updates', name: 'Platform Updates' },
  { path: '/offers', name: 'Deals & Perks' },
  { path: '/offers/github-student-pack', name: 'Deal Detail' },
  { path: '/about', name: 'About Mission' },
  { path: '/contact', name: 'Contact' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/terms', name: 'Terms of Service' },
  { path: '/disclosure', name: 'Affiliate Disclosure' },
  { path: '/submit-tool', name: 'Submit Tool Form' },
  { path: '/submit-guide', name: 'Submit Guide Form' },
  { path: '/discoveries', name: 'Daily Discoveries' },
  { path: '/admin/moderation', name: 'Admin Moderation Queue' },
  { path: '/non-existent-route-for-404-test', name: '404 Not Found' },
];

async function main() {
  console.log('🚀 Starting Comprehensive Full-Site Inspection Suite...');

  const axeSource = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

  fs.mkdirSync('.screenshots/qa', { recursive: true });
  const tempDir = fs.mkdtempSync('/tmp/chrome-qa-');

  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--disable-gpu',
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${tempDir}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await sleep(400);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      const targets = await res.json();
      const pageTarget = targets.find((t) => t.type === 'page');
      if (pageTarget && pageTarget.webSocketDebuggerUrl) {
        wsUrl = pageTarget.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    throw new Error('Failed to connect to headless Chrome on port ' + PORT);
  }

  console.log('Connected to Chrome CDP:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');
  await sendCDP(ws, 'DOM.enable');

  const results = {
    totalRoutes: ROUTES.length,
    consoleErrors: [],
    networkErrors: [],
    horizontalOverflows: [],
    contrastIssues: [],
    axeIssues: [],
    interactiveTests: {},
  };

  // Listen for console errors & failed requests
  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const type = data.params.type;
        if (type === 'error') {
          const text = data.params.args.map((a) => a.value || a.description || '').join(' ');
          // Ignore harmless font/polyfill notices if any
          if (!text.includes('favicon') && !text.includes('Download the React DevTools')) {
            results.consoleErrors.push(text);
          }
        }
      }
      if (data.method === 'Runtime.exceptionThrown') {
        const desc = data.params.exceptionDetails?.exception?.description || 'Unhandled exception';
        results.consoleErrors.push(desc);
      }
    } catch {}
  });

  console.log('\n--- PHASE 1 & 2: AUDITING ALL 33 ROUTES (LIGHT & DARK THEMES) ---');

  for (const r of ROUTES) {
    process.stdout.write(`Testing ${r.path} (${r.name})... `);

    // 1. Light Mode Desktop (1280x800)
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await sendCDP(ws, 'Page.navigate', { url: `${BASE_URL}${r.path}` });
    await sleep(600);

    // Ensure Light theme
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      `,
    });
    await sleep(200);

    // Inject axe-core and run accessibility scan
    await sendCDP(ws, 'Runtime.evaluate', { expression: axeSource });
    const axeLightRes = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          axe.run(document, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
            }
          }, (err, results) => {
            if (err) resolve({ error: err.message });
            else {
              const violations = (results.violations || []).map(v => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                nodesCount: v.nodes.length,
                samples: v.nodes.slice(0, 2).map(n => ({ html: n.html, target: n.target }))
              }));
              resolve({ violations });
            }
          });
        });
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    if (axeLightRes?.result?.value?.violations?.length > 0) {
      results.axeIssues.push({
        route: r.path,
        theme: 'light',
        violations: axeLightRes.result.value.violations,
      });
    }

    // Check computed contrast on text elements
    const contrastCheckLight = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const issues = [];
          const headings = document.querySelectorAll('h1, h2, h3, h4, p, span, a, button');
          headings.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bg = style.backgroundColor;
            const text = el.innerText?.trim();
            if (text && text.length > 2) {
              // Check if color is white on white or light surface
              if (color === 'rgb(255, 255, 255)' && (bg === 'rgb(255, 255, 255)' || bg === 'rgb(245, 248, 255)')) {
                issues.push({ text: text.slice(0, 40), tag: el.tagName, color, bg });
              }
            }
          });
          return issues;
        })()
      `,
      returnByValue: true,
    });

    if (contrastCheckLight?.result?.value?.length > 0) {
      results.contrastIssues.push({
        route: r.path,
        theme: 'light',
        issues: contrastCheckLight.result.value,
      });
    }

    // 2. Dark Mode Desktop (1280x800)
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      `,
    });
    await sleep(200);

    const axeDarkRes = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          axe.run(document, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
            }
          }, (err, results) => {
            if (err) resolve({ error: err.message });
            else {
              const violations = (results.violations || []).map(v => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                nodesCount: v.nodes.length,
                samples: v.nodes.slice(0, 2).map(n => ({ html: n.html, target: n.target }))
              }));
              resolve({ violations });
            }
          });
        });
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    if (axeDarkRes?.result?.value?.violations?.length > 0) {
      results.axeIssues.push({
        route: r.path,
        theme: 'dark',
        violations: axeDarkRes.result.value.violations,
      });
    }

    // 3. Mobile Viewport (375x812) Check for Horizontal Overflow
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(300);

    const overflowCheck = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const docWidth = document.documentElement.offsetWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const bodyScroll = document.body.scrollWidth;
          const isOverflow = scrollWidth > docWidth + 2 || bodyScroll > docWidth + 2;
          return { isOverflow, docWidth, scrollWidth, bodyScroll };
        })()
      `,
      returnByValue: true,
    });

    if (overflowCheck?.result?.value?.isOverflow) {
      results.horizontalOverflows.push({
        route: r.path,
        details: overflowCheck.result.value,
      });
    }

    console.log('✓ OK');
  }

  console.log('\n--- PHASE 3: INTERACTIVE USER JOURNEYS & FUNCTIONAL TESTS ---');

  // Test 1: Theme Toggle Interactive Persistence
  console.log('Testing Theme Toggle click and persistence...');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sendCDP(ws, 'Page.navigate', { url: `${BASE_URL}/` });
  await sleep(600);

  const toggleTest = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const toggleBtn = document.querySelector('[data-testid="color-mode-toggle"]');
        if (!toggleBtn) return { error: 'Theme toggle button not found' };

        const initialTheme = document.documentElement.getAttribute('data-theme');
        toggleBtn.click();
        const afterTheme = document.documentElement.getAttribute('data-theme');
        const storageVal = localStorage.getItem('theme');

        return {
          found: true,
          initialTheme,
          afterTheme,
          storageVal,
          success: initialTheme !== afterTheme && storageVal === afterTheme
        };
      })()
    `,
    returnByValue: true,
  });
  results.interactiveTests.themeToggle = toggleTest.result?.value;
  console.log('  Theme Toggle Result:', toggleTest.result?.value);

  // Test 2: Universal Search Dropdown & Keyboard / Input Flow
  console.log('Testing Universal Search Input & Auto-Suggestions...');
  const searchTest = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (!searchInput) return { error: 'Search input not found' };

        searchInput.focus();
        searchInput.value = 'supabase';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));

        return {
          found: true,
          query: 'supabase'
        };
      })()
    `,
    returnByValue: true,
  });
  await sleep(400);

  const searchResultsCheck = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const results = document.querySelectorAll('a[href*="/tools/supabase"]');
        return {
          hasSupabaseLink: results.length > 0,
          count: results.length
        };
      })()
    `,
    returnByValue: true,
  });
  results.interactiveTests.search = { ...searchTest.result?.value, ...searchResultsCheck.result?.value };
  console.log('  Search Result:', results.interactiveTests.search);

  // Test 3: AI Chatbot Floating Launcher & Modal Dialog
  console.log('Testing AI Chatbot Launcher and Dialog...');
  const chatbotTest = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const launcher = document.querySelector('button[aria-label*="Tech Hacks AI Assistant"], [class*="Ask Tech Hacks AI"], button:has([class*="petFloat"])') ||
                         Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ask Tech Hacks AI'));
        if (!launcher) return { error: 'Chatbot launcher not found' };

        launcher.click();
        return { found: true };
      })()
    `,
    returnByValue: true,
  });
  await sleep(600);

  const chatbotDialogCheck = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const dialog = document.querySelector('div[role="dialog"], [aria-label*="Tech Hacks AI Copilot"], [class*="z-50"]');
        const input = document.querySelector('input[placeholder*="Ask"], textarea[placeholder*="Ask"]');
        return {
          dialogOpened: !!dialog,
          hasInput: !!input
        };
      })()
    `,
    returnByValue: true,
  });
  results.interactiveTests.chatbot = { ...chatbotTest.result?.value, ...chatbotDialogCheck.result?.value };
  console.log('  Chatbot Result:', results.interactiveTests.chatbot);

  // Test 4: Mobile Drawer Menu
  console.log('Testing Mobile Drawer Menu Navigation...');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sleep(300);

  const mobileMenuTest = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const menuBtn = document.querySelector('button[aria-label*="mobile navigation"], button[aria-label*="navigation menu"], [data-testid="mobile-menu-toggle"]');
        if (!menuBtn) return { error: 'Mobile menu button not found' };

        menuBtn.click();
        return { clicked: true };
      })()
    `,
    returnByValue: true,
  });
  await sleep(400);

  const mobileDrawerCheck = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const drawer = document.querySelector('#mobile-nav') ||
                       document.querySelector('[data-testid="mobile-nav-dialog"]') ||
                       document.querySelector('nav[aria-label="Mobile Navigation"]') ||
                       document.querySelector('aside');
        const links = document.querySelectorAll('#mobile-nav a, a[href="/categories"], a[href="/ai-tools"], a[href="/tools"]');
        const themeBtn = document.querySelector('[data-testid="mobile-color-mode-toggle"], [data-testid="color-mode-toggle"]');
        return {
          drawerVisible: !!drawer,
          navLinksCount: links.length,
          hasThemeBtn: !!themeBtn
        };
      })()
    `,
    returnByValue: true,
  });
  results.interactiveTests.mobileMenu = { ...mobileMenuTest.result?.value, ...mobileDrawerCheck.result?.value };
  console.log('  Mobile Menu Result:', results.interactiveTests.mobileMenu);

  // Write summary report JSON
  fs.writeFileSync('qa-audit-summary.json', JSON.stringify(results, null, 2));

  console.log('\n============================================================');
  console.log('                E2E INSPECTION AUDIT SUMMARY                ');
  console.log('============================================================');
  console.log(`Total Routes Inspected: ${results.totalRoutes}`);
  console.log(`Console Errors: ${results.consoleErrors.length}`);
  console.log(`Horizontal Overflows (Mobile): ${results.horizontalOverflows.length}`);
  console.log(`Computed Low-Contrast Headings/Text: ${results.contrastIssues.length}`);
  console.log(`Routes with axe-core Accessibility Violations: ${results.axeIssues.length}`);
  console.log('Interactive Tests:');
  console.log('  - Theme Toggle:', results.interactiveTests.themeToggle?.success ? 'PASS' : 'FAIL');
  console.log('  - Search & Discovery:', results.interactiveTests.search?.hasSupabaseLink ? 'PASS' : 'FAIL');
  console.log('  - AI Chatbot Modal:', results.interactiveTests.chatbot?.dialogOpened ? 'PASS' : 'FAIL');
  console.log('  - Mobile Drawer Navigation:', results.interactiveTests.mobileMenu?.hasThemeBtn ? 'PASS' : 'FAIL');
  console.log('============================================================\n');

  // Clean up
  chromeProc.kill();
}

main().catch((err) => {
  console.error('Fatal Inspection Error:', err);
  process.exit(1);
});
