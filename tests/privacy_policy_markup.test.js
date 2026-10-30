import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/pages/PrivacyPage.tsx', import.meta.url), 'utf8');
const section = source.split('/* 4. Log Files & Server Diagnostics */')[1]?.split('/* 5. Contact Form Messages')[0];

test('privacy policy technical-data section uses sibling paragraphs', () => {
  assert.ok(section, 'Privacy policy technical-data section exists');
  const openTags = section.match(/<p(?:\\s|>)/g) ?? [];
  const closeTags = section.match(/<\\/p>/g) ?? [];
  assert.equal(openTags.length, 3, 'Expected three standalone paragraphs');
  assert.equal(closeTags.length, 3, 'Every paragraph has one closing tag');
  assert.doesNotMatch(section, /<p(?:\\s|>)[\\s\\S]*?<p(?:\\s|>)/, 'Paragraph tags must not be nested');
});
