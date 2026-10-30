import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('src/components/CookieConsentBanner.tsx', 'utf8');

test('cookie banner stays hidden during SSR/hydration until saved consent is checked', () => {
  assert.match(source, /const \[isOpen, setIsOpen\] = useState\(false\)/);
  assert.match(source, /const existing = getCookiePreferences\(\);[\s\S]*?if \(existing\) \{[\s\S]*?return;[\s\S]*?\}\s*setIsOpen\(true\)/);
  assert.doesNotMatch(source, /useState\(true\);[\s\S]{0,160}setIsOpen\(false\)/);
});

test('malformed or incomplete stored consent cannot silently suppress the notice', () => {
  assert.match(source, /value\.essential !== true/);
  assert.match(source, /typeof value\.analytics !== 'boolean'/);
  assert.match(source, /typeof value\.advertising !== 'boolean'/);
  assert.match(source, /Number\.isNaN\(Date\.parse\(value\.updatedAt\)\)/);
  assert.match(source, /catch \{\s*return null;/);
});

test('banner remains dismissible through explicit user choices and settings stay reopenable', () => {
  assert.match(source, /onClick=\{handleAcceptAll\}/);
  assert.match(source, /onClick=\{handleRejectNonEssential\}/);
  assert.match(source, /open_cookie_preferences_modal/);
  assert.match(source, /handleSaveCustom/);
});
