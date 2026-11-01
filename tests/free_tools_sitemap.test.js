import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('utility detail pages are included in the generated sitemap for direct-load prerendering', () => {
  const script = fs.readFileSync('scripts/generate-prompt-sitemap.mjs', 'utf8');
  assert.ok(script.includes("import { freeToolsData } from '../src/data/freeToolsData.ts';"));
  assert.ok(script.includes('freeToolsData.filter((item) => item?.slug).map'));
  assert.ok(script.includes('/free-tools/'));
});
