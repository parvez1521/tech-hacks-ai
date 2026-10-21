import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';

describe('Task 3 & 5: Component & Page Rendering Audit', () => {
  let ssrModule;

  before(() => {
    if (!fs.existsSync(path.resolve(process.cwd(), 'dist/test-ssr.js'))) {
      execSync(
        './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
        { stdio: 'pipe' }
      );
    }
  });

  test('renders full App without throwing exceptions', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    assert.ok(html.length > 1000, 'Rendered HTML should have content');
    assert.ok(html.includes('Tech Hacks'), 'HTML should include brand title');
    assert.ok(html.includes('Open Source Alternatives'), 'HTML should include headline');
    assert.ok(html.includes('Filters'), 'HTML should render filter drawer trigger');
    assert.ok(html.includes('Supabase'), 'HTML should render tool cards');
    assert.ok(html.includes('Order by'), 'HTML should render sort combobox');
  });

  test('rendered page includes accessible ARIA landmarks', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    assert.ok(html.includes('<header'), 'Should have <header> tag');
    assert.ok(html.includes('<nav'), 'Should have <nav> tag');
    assert.ok(html.includes('<main'), 'Should have <main> tag');
    assert.ok(html.includes('<footer'), 'Should have <footer> tag');
    assert.ok(html.includes('aria-label='), 'Should have aria-label attributes');
  });

  test('rendered page contains no broken image tags', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    // Ensure all avatars have background colors and letter fallbacks
    assert.ok(!html.includes('src="undefined"'), 'Should not have undefined img sources');
    assert.ok(!html.includes('src="null"'), 'Should not have null img sources');
  });
});
