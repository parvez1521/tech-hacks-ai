import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guidesData } from '../src/data/guidesData.ts';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');

test('every published guide includes at least one primary source reference', () => {
  assert.ok(guidesData.length >= 9, 'Expected the existing public guide collection');
  for (const guide of guidesData) {
    assert.ok(guide.references?.length, `${guide.slug} must include official references`);
    for (const reference of guide.references) {
      assert.ok(reference.title.trim(), `${guide.slug} reference is missing a title`);
      assert.ok(reference.publisher.trim(), `${guide.slug} reference is missing a publisher`);
      const url = new URL(reference.url);
      assert.equal(url.protocol, 'https:', `${guide.slug} reference must use HTTPS`);
    }
  }
});

test('guide detail page renders an official documentation section with safe external links', async () => {
  const page = await read('../src/pages/GuideDetailPage.tsx');
  assert.match(page, /Official documentation &amp; further reading/);
  assert.match(page, /guide.references.map/);
  assert.match(page, /target="_blank"/);
  assert.match(page, /rel="noopener noreferrer"/);
});
