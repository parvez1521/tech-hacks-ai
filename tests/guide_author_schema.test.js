import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');

test('guide structured data identifies the editorial team and publisher as organizations', async () => {
  const page = await read('../src/pages/GuideDetailPage.tsx');

  assert.match(
    page,
    /author:\s*\{\s*'@type': 'Organization',\s*name: guide\.author,\s*url: `\$\{siteConfig\.url\}\/about`,\s*\}/
  );
  assert.match(
    page,
    /publisher:\s*\{\s*'@type': 'Organization',\s*name: siteConfig\.name,\s*url: siteConfig\.url,\s*\}/
  );
  assert.match(page, /datePublished: guide\.publishedDate/);
});
