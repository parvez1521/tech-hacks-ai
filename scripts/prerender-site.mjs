#!/usr/bin/env node
/**
 * Build-time static rendering for SwitchRoute's public routes.
 * This lets crawlers and social unfurlers read page-specific content and metadata
 * without depending on client-side JavaScript. Unknown slugs are omitted from the
 * sitemap, and Vercel can return a real 404 because the SPA catch-all rewrite is removed.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { getPromptFeedSeoMetadata, renderPromptFeedStaticBody } from './promptfeed-seo.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const baseUrl = (process.env.VITE_SITE_URL || 'https://switchroute.in').replace(/\/+$/, '');
const bundlePath = path.join(dist, 'seo-renderer.js');

function runEsbuild() {
  const executable = path.join(root, 'node_modules', '.bin', 'esbuild');
  const result = spawnSync(executable, [
    'src/App.tsx',
    '--bundle',
    '--platform=node',
    '--format=esm',
    '--external:react',
    '--external:react-dom',
    '--external:lucide-react',
    '--outfile=dist/seo-renderer.js',
  ], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`SEO server-render bundle failed with exit code ${result.status}`);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizedPath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function replaceMeta(html, attribute, key, value) {
  const matcher = new RegExp(`<meta\\s+${attribute}="${escapeRegExp(key)}"[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

function replaceCanonical(html, canonical) {
  const matcher = /<link\s+rel="canonical"[^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

function createRouteHtml(template, pathname, title, description, body, routeName) {
  const canonical = pathname === '/' ? `${baseUrl}/` : `${baseUrl}${pathname}`;
  const socialImage = `${baseUrl}/social-card.svg`;
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:image', socialImage);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = replaceMeta(html, 'name', 'twitter:image', socialImage);
  html = replaceCanonical(html, canonical);

  const noIndex = new Set(['/saved', '/submit-tool', '/submit-guide', '/submit-prompt']);
  if (noIndex.has(pathname)) html = replaceMeta(html, 'name', 'robots', 'noindex,follow');

  const pageType = ['guide-detail', 'prompt-detail'].includes(routeName)
    ? 'Article'
    : routeName === 'ai-video-tools'
      ? 'CollectionPage'
      : 'WebPage';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: title,
    description,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'SwitchRoute', url: `${baseUrl}/` },
    inLanguage: 'en',
  };
  const jsonLd = JSON.stringify(structuredData).replace(/</g, '\\u003c');
  html = html.replace('</head>', `  <script type="application/ld+json">${jsonLd}</script>\n</head>`);

  const rootElement = `<div id="root">${body}</div>`;
  if (!/<div id="root"><\/div>/i.test(html)) {
    throw new Error(`Unable to find the empty React root in the build template for ${pathname}`);
  }
  return html.replace(/<div id="root"><\/div>/i, rootElement);
}

function installServerBrowser(pathname) {
  const url = new URL(pathname, baseUrl);
  const localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
  globalThis.window = {
    location: { href: url.href, origin: baseUrl, pathname: url.pathname, search: url.search, hash: '' },
    localStorage,
    innerWidth: 1440,
    innerHeight: 900,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    scrollTo: () => {},
    requestAnimationFrame: (callback) => callback(0),
    history: { pushState: () => {}, replaceState: () => {} },
  };
  const noopClassList = { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false };
  globalThis.document = {
    title: '',
    activeElement: null,
    documentElement: { dataset: { theme: 'dark' }, classList: noopClassList, style: {}, setAttribute: () => {}, getAttribute: () => null },
    body: { classList: noopClassList },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

function outputPathFor(pathname) {
  const clean = normalizedPath(pathname);
  return clean === '/' ? path.join(dist, 'index.html') : path.join(dist, ...clean.slice(1).split('/'), 'index.html');
}

async function writeNotFoundPage() {
  const body = `<!doctype html>
<html lang="en" class="dark" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,follow" />
  <title>Page Not Found — SwitchRoute</title>
  <meta name="description" content="This SwitchRoute page does not exist. Browse AI tools, open-source alternatives, offers and free utilities." />
  <link rel="canonical" href="${baseUrl}/404" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#080d18;color:#f8fafc;font:16px/1.6 Inter,system-ui,sans-serif;padding:24px;box-sizing:border-box}.card{max-width:640px;text-align:center;border:1px solid #253249;border-radius:24px;padding:40px;background:#0d1525}h1{font-size:clamp(2rem,6vw,3.5rem);line-height:1.1;margin:0 0 16px}p{color:#b8c4d7;margin:0 0 24px}a{color:#93c5fd;text-decoration:none;font-weight:700}a:hover{text-decoration:underline}</style>
</head>
<body><main class="card"><p>SWITCHROUTE / 404</p><h1>This route doesn’t exist.</h1><p>The link may be outdated, or the page may have been removed. Try the directory or return to the homepage.</p><p><a href="/">Back to SwitchRoute home</a> · <a href="/ai-tools">Browse AI tools</a></p></main></body>
</html>`;
  await fs.writeFile(path.join(dist, '404.html'), body);
}

async function main() {
  await fs.mkdir(dist, { recursive: true });
  const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
  let sitemap = await fs.readFile(sitemapPath, 'utf8');
  const promptFeedSourcePath = path.join(root, 'data', 'promptfeed-import.json');
  const promptFeedPayload = JSON.parse(await fs.readFile(promptFeedSourcePath, 'utf8'));
  const promptFeedRecords = Array.isArray(promptFeedPayload) ? promptFeedPayload : promptFeedPayload?.prompts;
  if (!Array.isArray(promptFeedRecords) || promptFeedRecords.length === 0) {
    throw new Error(`PromptFeed source must contain a non-empty prompt array at ${promptFeedSourcePath}.`);
  }
  const promptFeedBySlug = new Map();
  for (const record of promptFeedRecords) {
    if (typeof record?.slug !== 'string' || !record.slug.startsWith('promptfeed-')) continue;
    if (promptFeedBySlug.has(record.slug)) {
      throw new Error(`Duplicate PromptFeed slug in canonical source: ${record.slug}`);
    }
    promptFeedBySlug.set(record.slug, record);
  }
  runEsbuild();
  const renderer = await import(pathToFileURL(bundlePath).href);
  // The renderer is build-time only, not a public JS asset.
  await fs.rm(bundlePath, { force: true });

  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((value) => {
      try { return new URL(value).origin === baseUrl; } catch { return false; }
    })
    .map((value) => normalizedPath(new URL(value).pathname));
  const extraPaths = [
    '/saved', '/submit-tool', '/submit-guide', '/submit-prompt', '/discoveries', '/updates',
  ];
  const routes = [...new Set([...sitemapUrls, ...extraPaths])].sort((a, b) => a.localeCompare(b));
  const validSitemapPaths = new Set();
  const omitted = [];
  let rendered = 0;
  let promptFeedRendered = 0;

  for (const pathname of routes) {
    const matched = renderer.matchRoute(pathname);
    const promptFeedRecord = matched.route === 'prompt-detail'
      ? promptFeedBySlug.get(matched.params.slug)
      : undefined;
    const promptFeedMetadata = promptFeedRecord ? getPromptFeedSeoMetadata(promptFeedRecord) : null;
    let title = renderer.getRouteTitle(matched.route, matched.params);
    let description = renderer.getRouteDescription(matched.route, matched.params);
    if (promptFeedMetadata) {
      title = promptFeedMetadata.title;
      description = promptFeedMetadata.description;
    }
    if (matched.route === 'not-found' || (!promptFeedMetadata && /not found/i.test(title))) {
      omitted.push(pathname);
      continue;
    }

    installServerBrowser(pathname);
    const body = promptFeedMetadata
      ? renderPromptFeedStaticBody(promptFeedRecord)
      : renderToString(React.createElement(renderer.App));
    if (!body) {
      omitted.push(pathname);
      continue;
    }
    const html = createRouteHtml(template, pathname, title, description, body, matched.route);
    const outputPath = outputPathFor(pathname);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, 'utf8');
    rendered += 1;
    if (promptFeedMetadata) promptFeedRendered += 1;
    if (sitemapUrls.includes(pathname)) validSitemapPaths.add(pathname);
    if (rendered % 100 === 0) console.log(`Pre-rendered ${rendered} public pages…`);
  }

  // Sitemap must only advertise routes that resolve to actual catalogue records/pages.
  const cleanedSitemap = sitemap.replace(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g, (block, loc) => {
    try {
      const pathName = normalizedPath(new URL(loc).pathname);
      return validSitemapPaths.has(pathName) ? block : '';
    } catch {
      return '';
    }
  });
  await fs.writeFile(sitemapPath, cleanedSitemap, 'utf8');
  await fs.writeFile(path.join(dist, 'sitemap.xml'), cleanedSitemap, 'utf8');
  await writeNotFoundPage();

  console.log(`Pre-rendered ${rendered} route pages, including ${promptFeedRendered} PromptFeed detail pages. Removed ${omitted.length} dead/unknown routes from the sitemap.`);
  if (omitted.length) console.log(`Omitted routes: ${omitted.slice(0, 30).join(', ')}${omitted.length > 30 ? ', …' : ''}`);
}

main().catch((error) => {
  console.error('[SEO prerender] Failed:', error);
  process.exitCode = 1;
});
