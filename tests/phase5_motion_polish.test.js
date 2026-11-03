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

  test('Global ambient glow is omitted from the content shell', async () => {
    ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    assert.ok(!html.includes('ambient-glow-container'), 'Global glow should not compete with discovery content');
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
    const card = fs.readFileSync(path.join(process.cwd(), 'src/components/ToolCard.tsx'), 'utf8');
    assert.ok(card.includes('focus-within:ring-2'), 'ToolCard must contain focus-within ring for keyboard access');
    assert.ok(card.includes('focus-within:border-'), 'ToolCard focus is distinguishable from its default state');
  });

  test('Hero content is server-rendered immediately without an optional entrance animation', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    const homeSource = fs.readFileSync(path.join(process.cwd(), 'src/pages/HomePage.tsx'), 'utf8');
    assert.ok(html.includes('id="home-hero-heading"') && html.includes('Another AI tool?'), 'The editorial hero renders as a readable static server fallback');
    assert.ok(!homeSource.includes('motionFeatures') && !homeSource.includes('LazyMotion'), 'Hero does not load optional animation features before content is usable');
  });

  test('Header includes refined microinteraction classes', async () => {
    if (!ssrModule) ssrModule = await import('../dist/test-ssr.js');
    const html = ReactDOMServer.renderToString(React.createElement(ssrModule.App));

    assert.ok(html.includes('group-hover:rotate-3'), 'Logo should have refined rotate microinteraction');
  });

  test('Pagination includes enhanced active button shadow and scaling', async () => {
    const pagination = fs.readFileSync(path.join(process.cwd(), 'src/components/Pagination.tsx'), 'utf8');
    assert.ok(pagination.includes('aria-label="Pagination"'), 'Pagination has a named navigation landmark');
    assert.ok(pagination.includes('aria-current={isCurrent ? \'page\' : undefined}'), 'Current page is programmatically identified');
    assert.ok(pagination.includes('Go to page ${pageNum}'), 'Page buttons have descriptive accessible names');
  });
});
