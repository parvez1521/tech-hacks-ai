import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const src = readFileSync(
  new URL('../src/components/HourlyAlternativePopup.tsx', import.meta.url),
  'utf8',
);

test('popup: orange appears exactly once (the FREE pill)', () => {
  // bg-primary must occur exactly once — the FREE badge.
  assert.equal(src.match(/bg-primary/g)?.length ?? 0, 1, 'only the FREE pill may use bg-primary');
  // No orange text anywhere (arrow, header, strike).
  assert.equal(src.match(/text-primary(?!-foreground)/g)?.length ?? 0, 0);
  // No orange focus ring on the close button (ring-primary may still appear
  // on the two row links' keyboard-focus rings — allow at most 2).
  assert.ok((src.match(/ring-primary/g) ?? []).length <= 2, 'close button must not use ring-primary');
});

test('popup: strike is name-scoped, 1px, muted — never row-wide', () => {
  assert.doesNotMatch(src, /left-2 right-2[\s\S]{0,120}?bg-primary/, 'no row-wide strike');
  assert.doesNotMatch(src, /h-\[2px\]/, 'no 2px strike');
  assert.match(src, /bg-muted-foreground\/70/, 'strike is muted');
  assert.match(src, /h-px/, 'strike is 1px');
  // The strike span must be nested inside the name span (relative inline-block truncate).
  assert.match(src, /relative inline-block max-w-full truncate/);
});

test('popup: close button is quiet and unfocused on open', () => {
  assert.doesNotMatch(src, /closeRef\.current\?\.\s*focus\(\)/, 'do not auto-focus the close button');
  assert.match(src, /dialogRef\.current\?\.\s*focus\(\)/, 'focus the dialog container on open');
  assert.match(src, /tabIndex=\{-1\}/, 'dialog container is focusable programmatically');
  assert.match(src, /h-8 w-8/, 'close button is 32px');
  assert.match(src, /focus-visible:ring-1 focus-visible:ring-border/);
});
