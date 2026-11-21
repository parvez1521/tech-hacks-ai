import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { promptsData } from '../src/data/promptsData.ts';
import { getPromptBySlug } from '../src/services/aiCatalogService.ts';

// The 13 tool steps of the "15 Free Google AI Tools" entry that have a
// website to open, in step order. Steps 14 (Search Live) and 15 (Live
// Translate) are app-only features with no URL and must stay link-free.
const EXPECTED_LINKS = [
  'https://synthid.com',
  'https://playground.google',
  'https://gemini.google.com',
  'https://aistudio.google.com',
  'https://notebook.google',
  'https://labs.google.com/pomelli',
  'https://www.flowmusic.app',
  'https://stitch.google.com',
  'https://antigravity.google',
  'https://flow.google.com',
  'https://gemini.google.com',
  'https://vids.new',
  'https://google.com/ai',
];

test('google free AI tools entry links each tool step to its exact site', () => {
  const prompt = promptsData.find((item) => item.slug === 'google-free-ai-tools-2026');
  assert.ok(prompt, 'google-free-ai-tools-2026 entry exists');
  assert.equal(prompt.guideSteps.length, 15, 'entry keeps all 15 tool steps');
  const links = prompt.guideSteps.map((step) => step.link);
  assert.deepEqual(links.slice(0, 13), EXPECTED_LINKS, 'steps 1-13 carry exactly the tool URLs');
  assert.equal(links[13], undefined, 'step 14 (Search Live) is app-only and has no link');
  assert.equal(links[14], undefined, 'step 15 (Live Translate) is app-only and has no link');
  for (const link of EXPECTED_LINKS) {
    assert.ok(link.startsWith('https://'), `${link} uses HTTPS`);
    assert.doesNotThrow(() => new URL(link), `${link} parses as a URL`);
  }
  // The entry as the detail page actually receives it (via the catalog
  // service) keeps the same links.
  const rendered = getPromptBySlug('google-free-ai-tools-2026');
  assert.ok(rendered, 'catalog lookup finds the entry');
  assert.deepEqual(
    rendered.guideSteps.map((step) => step.link),
    links,
    'catalog passthrough keeps the step links',
  );
  // No other entry gains a step link: the change is scoped to these entries.
  for (const item of promptsData) {
    if (item.slug === 'google-free-ai-tools-2026' || item.slug === 'claude-max-plan-free') continue;
    assert.ok(
      (item.guideSteps || []).every((step) => step.link === undefined),
      `${item.slug} steps stay link-free`,
    );
  }
});

// The 8 GitHub repository steps of the "Claude $200 max plan free" entry,
// in source order. Every step links to its repository, so every step renders
// an "Open link" button on the detail page.
const EXPECTED_CLAUDE_MAX_LINKS = [
  'https://github.com/Devansh-365/freellm',
  'https://github.com/kaiser-data/free-llm-proxy-router',
  'https://github.com/nabinkhadka/free-llm-api',
  'https://github.com/YeomanYe/free-llm-router',
  'https://github.com/alienz-dev/llm-router',
  'https://github.com/MajidAsghariTabrizi/free-best-router',
  'https://github.com/tashfeenahmed/freellmapi',
  'https://github.com/Gmagl/omniroute',
];

test('claude max plan free entry links each repository step to its GitHub repo', () => {
  const prompt = promptsData.find((item) => item.slug === 'claude-max-plan-free');
  assert.ok(prompt, 'claude-max-plan-free entry exists');
  assert.equal(prompt.title, 'Claude $200 max plan free', 'entry keeps its exact title');
  assert.equal(prompt.provider, 'Anthropic', 'entry uses the Claude provider value');
  assert.equal(prompt.category, 'claude-max-plan-free', 'entry uses its own category');
  assert.equal(prompt.guideSteps.length, 8, 'entry keeps all 8 repository steps');
  const links = prompt.guideSteps.map((step) => step.link);
  assert.deepEqual(links, EXPECTED_CLAUDE_MAX_LINKS, 'steps carry exactly the repository URLs');
  for (const link of links) {
    assert.ok(link.startsWith('https://github.com/'), `${link} points at GitHub over HTTPS`);
    assert.doesNotThrow(() => new URL(link), `${link} parses as a URL`);
  }
  assert.equal(prompt.hidePreviewImage, undefined, 'poster is the entry artwork, so the hero is not hidden');
  // The entry as the detail page actually receives it (via the catalog
  // service) keeps the same links.
  const rendered = getPromptBySlug('claude-max-plan-free');
  assert.ok(rendered, 'catalog lookup finds the entry');
  assert.deepEqual(
    rendered.guideSteps.map((step) => step.link),
    links,
    'catalog passthrough keeps the step links',
  );
  // The poster dimensions record matches the 1600x1600 artwork.
  const dimensions = JSON.parse(fs.readFileSync(path.resolve('data/prompt-image-dimensions.json'), 'utf8'));
  assert.deepEqual(dimensions['claude-max-plan-free'], { width: 1600, height: 1600 }, 'poster dimensions record is 1600x1600');
});

test('prompt detail page renders an Open link button below the step text', () => {
  const detail = fs.readFileSync(path.resolve('src/pages/PromptDetailPage.tsx'), 'utf8');
  const types = fs.readFileSync(path.resolve('src/types/index.ts'), 'utf8');
  assert.match(types, /guideSteps\?: \{[^}]*link\?: string[^}]*\}\[\]/, 'guideSteps type carries an optional link');
  assert.match(detail, /step\.link/, 'detail page reads the step link');
  assert.match(detail, /href=\{step\.link\}/, 'Open link anchor uses the step link as its href');
  assert.match(detail, /target="_blank"/, 'Open link opens in a new tab');
  assert.match(detail, /rel="noopener noreferrer"/, 'Open link uses noopener noreferrer');
  assert.match(detail, /Open link/, 'Open link button label is present');
  assert.match(detail, /Copy this prompt/, 'Copy button is untouched');
  // The button is gated on the step having a link, so steps without one
  // (and every other entry) render exactly as before.
  assert.match(detail, /\{step\.link && \(/, 'Open link renders only when the step carries a link');
  // Position: the anchor sits BELOW the step text in DOM order — the step
  // content (title + text) is on top, the link button underneath.
  const textIndex = detail.indexOf('{step.text}</pre>');
  const linkIndex = detail.indexOf('href={step.link}');
  assert.ok(textIndex !== -1, 'step text pre is present');
  assert.ok(linkIndex !== -1, 'Open link anchor is present');
  assert.ok(linkIndex > textIndex, 'Open link anchor comes after the step text in DOM order');
  // …and it is no longer in the header row: everything between the step
  // header row and the step text carries no link anchor, while the Copy
  // button stays there.
  const headerIndex = detail.indexOf('flex flex-wrap items-start justify-between gap-3 mb-3');
  assert.ok(headerIndex !== -1, 'step header row is present');
  const headerSlice = detail.slice(headerIndex, textIndex);
  assert.ok(!headerSlice.includes('href={step.link}'), 'header row carries no Open link anchor');
  assert.ok(headerSlice.includes('Copy this prompt'), 'Copy button stays in the header row');
});
