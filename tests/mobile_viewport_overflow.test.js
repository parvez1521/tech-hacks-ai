import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

test('app shell and document root contain horizontal overflow without locking vertical scroll', () => {
  const css = read('src/index.css');
  const app = read('src/App.tsx');
  assert.match(css, /html\s*\{[\s\S]*?overflow-x:\s*clip/);
  assert.match(css, /body\s*\{[\s\S]*?overflow-x:\s*clip/);
  assert.match(app, /min-w-0 max-w-full overflow-x-clip/);
  assert.match(app, /<main className="flex-1 min-w-0 w-full max-w-full/);
  assert.doesNotMatch(app, /overflow-y-hidden|h-screen overflow-hidden/);
});

test('floating assistant stays inside narrow phone viewports and the decorative glow is contained', () => {
  const css = read('src/index.css');
  assert.match(css, /\.chat-launcher-position\s*\{[\s\S]*?max-width:\s*calc\(100vw\s*-\s*2rem\)/);
  assert.match(css, /@media\s*\(max-width:\s*360px\)[\s\S]*?\.chat-launcher-position\s*\{\s*right:\s*2\.25rem/);
  assert.match(css, /\.ambient-glow-container\s*\{[\s\S]*?contain:\s*paint/);
});

test('AI category chips scroll within their own bounded row rather than widening the page', () => {
  const page = read('src/pages/AiToolsPage.tsx');
  assert.match(page, /flex min-w-0 w-full max-w-full items-center gap-2 overflow-x-auto overscroll-x-contain/);
});

test('catalog filters wrap on narrow viewports and keep selects within their parent', () => {
  const filter = read('src/components/FilterBar.tsx');
  assert.match(filter, /w-full min-w-0 max-w-full flex flex-col/);
  assert.match(filter, /flex min-w-0 max-w-full flex-wrap items-center gap-2/);
  assert.match(filter, /w-\[min\(190px,100%\)\] max-w-full/);
  assert.match(filter, /w-full min-w-0 max-w-full bg-slate-50/);
});

test('long detail breadcrumbs wrap or truncate without increasing document width', () => {
  const category = read('src/pages/CategoryDetailPage.tsx');
  const guide = read('src/pages/GuideDetailPage.tsx');
  const offer = read('src/pages/OfferDetailPage.tsx');
  assert.match(category, /flex min-w-0 max-w-full flex-wrap items-center gap-2 text-xs/);
  assert.match(category, /min-w-0 break-words text-slate-900 font-semibold/);
  assert.match(guide, /flex min-w-0 max-w-full flex-wrap items-center gap-2/);
  assert.match(guide, /max-w-\[160px\] truncate/);
  assert.match(offer, /flex min-w-0 max-w-full flex-wrap items-center gap-2/);
  assert.match(offer, /max-w-\[160px\] truncate/);
});
