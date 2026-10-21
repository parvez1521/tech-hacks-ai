import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { toolsData } from '../src/data/seedData.ts';

describe('Phase 5: Premium Interactive UI, Motion Polish & Accessibility', () => {
  let ssrModule;

  before(() => {
    // Recompile App bundle for Node SSR
    execSync(
      './node_modules/.bin/esbuild src/App.tsx --bundle --platform=node --format=esm --external:react --external:react-dom --external:lucide-react --outfile=dist/test-ssr.js',
      { stdio: 'pipe' }
    );
  });

  test('AmbientGlow renders with pointer-events-none and aria-hidden="true"', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    assert.ok(html.includes('ambient-glow-container'), 'Should render ambient glow container');
    assert.ok(html.includes('pointer-events-none'), 'Ambient glow must be pointer-events-none');
    assert.ok(html.includes('aria-hidden="true"'), 'Ambient glow must be aria-hidden for screen readers');
  });

  test('CSS stylesheet contains strict prefers-reduced-motion definitions', () => {
    const cssPath = path.resolve('src/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    assert.ok(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Must include prefers-reduced-motion query');
    assert.ok(cssContent.includes('animation: none !important'), 'Animations must be disabled under reduced motion');
    assert.ok(cssContent.includes('.bg-dot-pattern'), 'Should define fine dot texture pattern');
    assert.ok(cssContent.includes('@keyframes ambientDrift'), 'Should define ambient drift animation keyframe');
    assert.ok(cssContent.includes('@keyframes fadeInUp'), 'Should define fadeInUp animation keyframe');
  });

  test('ToolCard includes restrained interaction markup and accessible keyboard focus states', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    // ToolCards expose a shared interaction utility and focus ring.
    assert.ok(html.includes('focus-within:ring-2'), 'ToolCard must contain focus-within ring for keyboard access');
    assert.ok(html.includes('interactive-card'), 'ToolCard should use the shared restrained interaction utility');
  });

  test('Hero section keeps motion limited to a short entrance sequence', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    const homeSource = fs.readFileSync(path.join(process.cwd(), 'src/pages/HomePage.tsx'), 'utf8');
    assert.ok(html.includes('hero-redesign__copy'), 'The editorial hero renders as a readable static server fallback');
    assert.ok(homeSource.includes("from 'motion/react'") && homeSource.includes('useReducedMotion'), 'Hero entrance uses Motion.dev and respects reduced motion');
  });

  test('Header includes refined microinteraction classes', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    assert.ok(html.includes('group-hover:rotate-12'), 'Logo should have refined rotate microinteraction');
  });

  test('Pagination includes enhanced active button shadow and scaling', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    assert.ok(html.includes('shadow-md shadow-primary/20'), 'Active page number should feature primary glow shadow');
  });
});
