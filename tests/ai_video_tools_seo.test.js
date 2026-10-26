import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');

test('dedicated AI video landing page targets a clear search intent with unique page metadata', async () => {
  const page = await read('../src/pages/AiVideoToolsPage.tsx');
  const app = await read('../src/App.tsx');
  const router = await read('../src/router/Router.tsx');

  assert.match(page, /AI Video Generators &amp; Text-to-Video Tools/);
  assert.match(page, /getAiToolsForSearchIntent\('AI video generator'\)/);
  assert.match(page, /<AiToolCard key=\{tool\.id\} tool=\{tool\} \/>/);
  assert.match(page, /image-to-video/);
  assert.match(page, /open-weight/i);
  assert.match(page, /AI video generator FAQs/);
  assert.match(app, /case 'ai-video-tools':\s+return formatPageTitle\('AI Video Generators: Free, Open-Source & Text-to-Video Tools'\)/);
  assert.match(app, /case 'ai-video-tools':\s+return 'Compare AI video generators/);
  assert.match(router, /cleanPath === '\/ai-video-tools'[\s\S]*route: 'ai-video-tools'/);
});

test('AI video landing page is discoverable through internal links and sitemap', async () => {
  const home = await read('../src/pages/HomePage.tsx');
  const aiTools = await read('../src/pages/AiToolsPage.tsx');
  const config = await read('../src/config/site.ts');
  const sitemap = await read('../public/sitemap.xml');
  const prerender = await read('../scripts/prerender-site.mjs');

  assert.match(home, /to="\/ai-video-tools"/);
  assert.match(aiTools, /to="\/ai-video-tools"/);
  assert.match(config, /title: 'AI Video Generators', href: '\/ai-video-tools'/);
  assert.match(sitemap, /<loc>https:\/\/switchroute\.in\/ai-video-tools<\/loc>/);
  assert.match(prerender, /routeName === 'ai-video-tools'[\s\S]*'CollectionPage'/);
});
