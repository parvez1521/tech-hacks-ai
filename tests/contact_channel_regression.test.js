import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('unverified legacy email addresses are not configured as contact channels', async () => {
  const config = await read('../src/config/contactConfig.ts');
  assert.match(config, /email:\s*''/);
  assert.doesNotMatch(config, /@techhacksai\.com|@switchroute\.in/i);
});

test('contact page gates its form on backend readiness and only confirms a real API success', async () => {
  const page = await read('../src/pages/ContactPage.tsx');
  assert.match(page, /fetch\('\/api\/contact\?action=status'/);
  assert.match(page, /fetch\('\/api\/contact'/);
  assert.match(page, /result\.success !== true/);
  assert.match(page, /Website contact form is not active yet/i);
  assert.match(page, /does not save a message/i);
  assert.doesNotMatch(page, /setTimeout\(|Message Received!/i);
});


test('verified Instagram is the only public contact channel while inbox setup is pending', async () => {
  const config = await read('../src/config/contactConfig.ts');
  assert.match(config, /instagramHandle: 'tech_hacks\.ai'/);
  assert.match(config, /instagramUrl: 'https:\/\/www\.instagram\.com\/tech_hacks\.ai\//);
  const page = await read('../src/pages/ContactPage.tsx');
  assert.match(page, /general, non-sensitive questions/i);
  assert.match(page, /DMs are not saved in the SwitchRoute contact inbox/i);
  assert.match(page, /Do not send private or formal legal information through social DMs/i);
});

test('privacy, terms, and disclosure pages do not publish inactive email addresses', async () => {
  for (const path of ['../src/pages/PrivacyPage.tsx', '../src/pages/TermsPage.tsx', '../src/pages/DisclosurePage.tsx']) {
    const content = await read(path);
    assert.doesNotMatch(content, /@techhacksai\.com|@switchroute\.in/i, path);
    assert.match(content, /to="\/contact"/, path);
  }
});
