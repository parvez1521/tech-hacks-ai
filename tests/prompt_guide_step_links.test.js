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
  // No other entry gains a step link: the change is scoped to this entry.
  for (const item of promptsData) {
    if (item.slug === 'google-free-ai-tools-2026') continue;
    assert.ok(
      (item.guideSteps || []).every((step) => step.link === undefined),
      `${item.slug} steps stay link-free`,
    );
  }
});

test('prompt detail page renders an Open link button for guide steps that carry a link', () => {
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
});
