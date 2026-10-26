import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('official support inbox is configured without legacy contact addresses', async () => {
  const config = await read('../src/config/contactConfig.ts');
  assert.match(config, /email:\s*'support@switchroute\.in'/);
  assert.doesNotMatch(config, /@techhacksai\.com/i);
});

test('contact page gates its form on backend readiness and only confirms a real API success', async () => {
  const page = await read('../src/pages/ContactPage.tsx');
  assert.match(page, /fetch\('\/api\/contact\?action=status'/);
  assert.match(page, /fetch\('\/api\/contact'/);
  assert.match(page, /result\.success !== true/);
  assert.match(page, /Website contact form is not active yet/i);
  assert.match(page, /will not collect or pretend to send a message/i);
  assert.doesNotMatch(page, /setTimeout\(|Message Received!/i);
});


test('verified Instagram is the only public contact channel while inbox setup is pending', async () => {
  const config = await read('../src/config/contactConfig.ts');
  assert.match(config, /instagramHandle: 'tech_hacks\.ai'/);
  assert.match(config, /instagramUrl: 'https:\/\/www\.instagram\.com\/tech_hacks\.ai\//);
  const page = await read('../src/pages/ContactPage.tsx');
  assert.match(page, /general, non-sensitive questions/i);
  assert.match(page, /DMs are not saved in the SwitchRoute contact inbox/i);
  assert.match(page, /support@switchroute\.in/);
  assert.match(page, /mailto:support@switchroute\.in/);
});

test('privacy and disclosure pages use the official support channel without legacy addresses', async () => {
  const privacy = await read('../src/pages/PrivacyPage.tsx');
  assert.match(privacy, /siteConfig\.links\.email/);
  assert.doesNotMatch(privacy, /@techhacksai\.com/i);

  const terms = await read('../src/pages/TermsPage.tsx');
  assert.doesNotMatch(terms, /@techhacksai\.com/i);
  assert.match(terms, /to="\/contact"/);

  const disclosure = await read('../src/pages/DisclosurePage.tsx');
  assert.match(disclosure, /support@switchroute\.in/);
  assert.doesNotMatch(disclosure, /@techhacksai\.com/i);
});

test('contact page keeps support links readable in dark mode and avoids pale hover fills', async () => {
  const page = await read('../src/pages/ContactPage.tsx');
  assert.match(page, /border-emerald-400\/40 bg-card/);
  assert.match(page, /hover:bg-muted/);
  assert.doesNotMatch(page, /hover:bg-emerald-50/);
  assert.match(page, /bg-amber-500\/10 p-4 text-foreground/);
  assert.match(page, /text-muted-foreground/);
  assert.match(page, /font-semibold text-primary underline/);
});
