import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(new URL(file, `file://${process.cwd()}/`), 'utf8');

test('cookie consent stays complete while using a compact, scroll-safe responsive surface', () => {
  const source = read('src/components/CookieConsentBanner.tsx');
  assert.match(source, /max-h-\[min\(35vh,18rem\)\].*overflow-y-auto.*overscroll-contain/);
  assert.match(source, /left-3 right-3.*sm:left-6 sm:right-auto/);
  assert.match(source, /Analytics and advertising are not currently active/);
  assert.match(source, /not a Google-certified consent management platform/);
  assert.match(source, /Accept All[\s\S]*Essential Only[\s\S]*Customize/);
  assert.match(source, /saveCookiePreferences\(prefs\)/);
  assert.match(source, /role="dialog"[\s\S]*?aria-modal="true"/);
  assert.match(source, /focus-visible:ring-2 focus-visible:ring-primary/);
  assert.match(source, /min-h-11 min-w-11/);
});

test('Alternatives page and cards use semantic theme tokens and accessible search/filter state', () => {
  const page = read('src/pages/AlternativesPage.tsx');
  const card = read('src/components/AlternativeCard.tsx');
  assert.match(page, /<label htmlFor="alternatives-search" className="sr-only">Search proprietary software alternatives<\/label>/);
  assert.match(page, /id="alternatives-search"/);
  assert.match(page, /min-h-11/);
  assert.match(page, /role="group" aria-label="Filter alternatives by category"/);
  assert.match(page, /aria-pressed={!selectedCategory}/);
  assert.match(page, /aria-pressed={isSelected}/);
  assert.match(page, /min-h-11 px-3\.5 py-1\.5 rounded-full/);
  assert.match(page, /setSearchParams\(\{ q: val \? val : null \}, \{ replace: true \}\)/);
  assert.doesNotMatch(page, /#[0-9A-Fa-f]{3,8}/);
  assert.doesNotMatch(card, /bg-\[#|text-\[#|border-\[#|text-slate-/);
  assert.match(card, /bg-accent/);
  assert.match(card, /bg-muted hover:bg-accent text-secondary-foreground/);
});

test('header marks exact and nested current routes in desktop and mobile navigation', () => {
  const source = read('src/components/Header.tsx');
  assert.match(source, /const isRouteActive = \(to: string\) => currentPath === to \|\| currentPath\.startsWith\(`\$\{to\}\/`\)/);
  assert.match(source, /aria-current=\{isRouteActive\('\/alternatives'\) \? 'page' : undefined\}/);
  assert.match(source, /aria-current=\{isRouteActive\('\/free-tools'\) \? 'page' : undefined\}/);
  assert.match(source, /aria-current=\{isRouteActive\('\/prompt-library'\) \? 'page' : undefined\}/);
  assert.match(source, /mobileNavLinkClass\('\/alternatives'\)/);
  assert.match(source, /activeDiscoverRoute/);
  assert.match(source, /activeLearnRoute/);
});
