import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9222;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
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

async function main() {
  fs.mkdirSync('.screenshots', { recursive: true });

  const tempDir = fs.mkdtempSync('/tmp/chrome-test-');
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

  try {
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
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
      throw new Error('Failed to connect to Chrome CDP WebSocket');
    }

    console.log('Connected to Chrome CDP:', wsUrl);
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await sendCDP(ws, 'Page.enable');
    await sendCDP(ws, 'DOM.enable');

    // Test items: route, name, viewport, theme
    const tasks = [
      // Desktop Views - Light & Dark
      { route: '/categories', name: 'categories-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/categories', name: 'categories-dark', theme: 'dark', width: 1440, height: 1000 },
      { route: '/', name: 'home-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/', name: 'home-dark', theme: 'dark', width: 1440, height: 1000 },
      { route: '/tools', name: 'tools-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/tools', name: 'tools-dark', theme: 'dark', width: 1440, height: 1000 },
      { route: '/ai-tools', name: 'ai-tools-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/ai-tools', name: 'ai-tools-dark', theme: 'dark', width: 1440, height: 1000 },
      { route: '/tools/supabase', name: 'tool-detail-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/tools/supabase', name: 'tool-detail-dark', theme: 'dark', width: 1440, height: 1000 },
      { route: '/alternatives', name: 'alternatives-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/alternatives', name: 'alternatives-dark', theme: 'dark', width: 1440, height: 1000 },
      { route: '/compare', name: 'compare-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/compare', name: 'compare-dark', theme: 'dark', width: 1440, height: 1000 },
      { route: '/admin/moderation', name: 'admin-light', theme: 'light', width: 1440, height: 1000 },
      { route: '/admin/moderation', name: 'admin-dark', theme: 'dark', width: 1440, height: 1000 },

      // Mobile Views (390 x 844 iPhone resolution)
      { route: '/categories', name: 'mobile-categories-light', theme: 'light', width: 390, height: 844 },
      { route: '/categories', name: 'mobile-categories-dark', theme: 'dark', width: 390, height: 844 },
      { route: '/', name: 'mobile-home-light', theme: 'light', width: 390, height: 844 },
      { route: '/', name: 'mobile-home-dark', theme: 'dark', width: 390, height: 844 },
    ];

    for (const t of tasks) {
      console.log(`Processing: ${t.name} (${t.route}) [${t.theme}]...`);

      // 1. Set emulation viewport
      await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
        width: t.width,
        height: t.height,
        deviceScaleFactor: 2,
        mobile: t.width < 768,
      });

      // 2. Navigate to route
      await sendCDP(ws, 'Page.navigate', { url: `http://localhost:3000${t.route}` });
      await sleep(1500);

      // 3. Set theme in localStorage and DOM synchronously
      await sendCDP(ws, 'Runtime.evaluate', {
        expression: `
          (function() {
            var target = '${t.theme}';
            localStorage.setItem('theme', target);
            document.documentElement.setAttribute('data-theme', target);
            if (target === 'dark') {
              document.documentElement.classList.remove('light');
              document.documentElement.classList.add('dark');
              document.documentElement.style.colorScheme = 'dark';
              if (document.body) {
                document.body.classList.remove('light');
                document.body.classList.add('dark');
              }
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
              document.documentElement.style.colorScheme = 'light';
              if (document.body) {
                document.body.classList.remove('dark');
                document.body.classList.add('light');
              }
            }
          })();
        `,
      });
      await sleep(500);

      // 4. Capture screenshot
      const result = await sendCDP(ws, 'Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: 0,
          y: 0,
          width: t.width,
          height: t.height,
          scale: 1,
        },
      });

      const filePath = path.resolve('.screenshots', `${t.name}.png`);
      fs.writeFileSync(filePath, Buffer.from(result.data, 'base64'));
      console.log(`  ✓ Saved ${filePath}`);
    }

    // 5. Test Theme Toggle Click Interaction and Persistence
    console.log('Testing interactive theme toggle click and persistence...');
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000/categories' });
    await sleep(1000);

    const toggleTestResult = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (function() {
          // Force light first
          localStorage.setItem('theme', 'light');
          var btn = document.querySelector('[data-testid="color-mode-toggle"]');
          if (!btn) return { error: 'Toggle button not found in header' };

          btn.click();
          var newTheme = localStorage.getItem('theme');
          var isDarkClass = document.documentElement.classList.contains('dark');
          var dataTheme = document.documentElement.getAttribute('data-theme');

          // Click again
          btn.click();
          var toggledBackTheme = localStorage.getItem('theme');
          var isLightClass = document.documentElement.classList.contains('light');

          return {
            initialTheme: 'light',
            afterFirstClick: newTheme,
            isDarkClass,
            dataTheme,
            afterSecondClick: toggledBackTheme,
            isLightClass
          };
        })();
      `,
      returnByValue: true,
    });

    console.log('Toggle Test Result:', JSON.stringify(toggleTestResult.result.value, null, 2));

    // Capture mobile menu with theme toggle visible
    console.log('Capturing mobile menu open view...');
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(1000);
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (function() {
          var menuBtn = document.querySelector('button[aria-label="Toggle mobile navigation menu"]');
          if (menuBtn) menuBtn.click();
        })();
      `,
    });
    await sleep(600);
    const mobileMenuScreenshot = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.screenshots/mobile-menu-open.png', Buffer.from(mobileMenuScreenshot.data, 'base64'));
    console.log('  ✓ Saved .screenshots/mobile-menu-open.png');

    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch((err) => {
  console.error('Error running capture script:', err);
  process.exit(1);
});
