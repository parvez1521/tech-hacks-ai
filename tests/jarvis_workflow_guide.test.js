import test from 'node:test';
import assert from 'node:assert/strict';
import { guidesData } from '../src/data/guidesData.ts';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');

test('the OpenJarvis workflow is listed with Windows and macOS setup steps', () => {
  const guide = guidesData.find((item) => item.slug === 'free-local-jarvis-windows-mac');
  assert.ok(guide, 'Expected the OpenJarvis workflow in the public guide collection');
  assert.match(guide.title, /Windows & Mac/);
  assert.ok(guide.references?.length >= 5, 'Expected official setup and tool references');
  assert.ok(guide.steps.some((step) => step.title.startsWith('Windows:')));
  assert.ok(guide.steps.some((step) => step.title.startsWith('Mac:')));
});

test('every command tells readers where to paste it and has a copyable command UI', async () => {
  const guide = guidesData.find((item) => item.slug === 'free-local-jarvis-windows-mac');
  const commandSteps = guide.steps.filter((step) => step.command);
  assert.ok(commandSteps.length >= 7);
  for (const step of commandSteps) {
    assert.ok(step.commandTarget, `Missing terminal target in step ${step.stepNumber}`);
    assert.match(step.commandInstruction, /^Copy this command and paste it into /);
  }

  const page = await read('../src/pages/GuideDetailPage.tsx');
  assert.match(page, /step\.command/);
  assert.match(page, /step\.commandTarget/);
  assert.match(page, /step\.commandInstruction/);
  assert.match(page, /Copy Command/);
  assert.match(page, /handleCopyCommand/);
});

test('the workflow links only to HTTPS official documentation and tool sources', () => {
  const guide = guidesData.find((item) => item.slug === 'free-local-jarvis-windows-mac');
  for (const reference of guide.references) {
    assert.equal(new URL(reference.url).protocol, 'https:');
  }
});
