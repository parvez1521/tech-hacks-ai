import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/pages/PrivacyPage.tsx', import.meta.url), 'utf8');
const section = source.split('/* 4. Log Files & Server Diagnostics */')[1]?.split('/* 5. Contact Form Messages')[0];

test('privacy policy technical-data section uses sibling paragraphs', () => {
  assert.ok(section, 'Privacy policy technical-data section exists');
  const tags = section.match(/<\\/?p(?:\\s[^>]*)?>/g) ?? [];
  let depth = 0;
  let openCount = 0;
  let closeCount = 0;

  for (const tag of tags) {
    if (tag.startsWith('</')) {
      depth -= 1;
      closeCount += 1;
    } else {
      depth += 1;
      openCount += 1;
    }
    assert.ok(depth >= 0, 'Paragraph close tag must have a matching open tag');
    assert.ok(depth <= 1, 'Paragraph tags must not be nested');
  }

  assert.equal(depth, 0, 'All paragraphs must be closed');
  assert.equal(openCount, 3, 'Expected three standalone paragraphs');
  assert.equal(closeCount, 3, 'Every paragraph has one closing tag');
});
