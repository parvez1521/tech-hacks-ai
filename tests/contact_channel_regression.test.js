import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('unverified legacy email addresses are not configured as contact channels', async () => {
  const config = await read('../src/config/contactConfig.ts');
  assert.match(config, /email:\s*''/);
  assert.doesNotMatch(config, /@techhacksai\.com|@switchroute\.in/i);
});

test('contact page does not simulate a successful message submission', async () => {
  const page = await read('../src/pages/ContactPage.tsx');
  assert.match(page, /Contact submissions are temporarily unavailable/i);
  assert.match(page, /No message can be sent or saved/i);
  assert.doesNotMatch(page, /setTimeout\(|Message Received!|<form\b/i);
});

test('privacy, terms, and disclosure pages do not publish inactive email addresses', async () => {
  for (const path of ['../src/pages/PrivacyPage.tsx', '../src/pages/TermsPage.tsx', '../src/pages/DisclosurePage.tsx']) {
    const content = await read(path);
    assert.doesNotMatch(content, /@techhacksai\.com|@switchroute\.in/i, path);
    assert.match(content, /to="\/contact"/, path);
  }
});
