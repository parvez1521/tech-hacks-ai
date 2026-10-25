import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateCropDraft } from '../src/services/cropValidation.ts';

test('cropper preserves the intended coordinate and size values', () => {
  const result = validateCropDraft({ x: '100', y: '100', width: '400', height: '300' }, 800, 600);
  assert.deepEqual(result, { valid: true, crop: { x: 100, y: 100, width: 400, height: 300 } });
});

test('cropper rejects partially typed or malformed fields instead of silently coercing them', () => {
  const emptyWidth = validateCropDraft({ x: '100', y: '100', width: '', height: '300' }, 800, 600);
  assert.equal(emptyWidth.valid, false);
  if (!emptyWidth.valid) assert.match(emptyWidth.error, /Width must be a whole number/);

  const commaValue = validateCropDraft({ x: '100, 100', y: '0', width: '400', height: '300' }, 800, 600);
  assert.equal(commaValue.valid, false);
  if (!commaValue.valid) assert.match(commaValue.error, /X must be a whole number/);
});

test('cropper rejects out-of-bounds crops with an explicit validation message', () => {
  const result = validateCropDraft({ x: '700', y: '100', width: '200', height: '300' }, 800, 600);
  assert.equal(result.valid, false);
  if (!result.valid) assert.match(result.error, /Maximum width is 100px/);
});

test('cropper UI keeps four fields separate and validates only on render', async () => {
  const source = await readFile(new URL('../src/components/utilities/UtilityImageTools.tsx', import.meta.url), 'utf8');
  const section = source.slice(source.indexOf('export const ImageCropperTool'), source.indexOf('export const ImagePaletteTool'));
  assert.match(section, /numberField\('X offset \(px\)'/);
  assert.match(section, /numberField\('Y offset \(px\)'/);
  assert.match(section, /numberField\('Crop width \(px\)'/);
  assert.match(section, /numberField\('Crop height \(px\)'/);
  assert.match(section, /validateCropDraft\(cropDraft, image\.width, image\.height\)/);
  assert.doesNotMatch(section, /split\(', '\)\.map\(Number\)/);
});
