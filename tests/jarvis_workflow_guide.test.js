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

test('the workflow detail URL is included in the sitemap for prerendering', async () => {
  const sitemap = await read('../public/sitemap.xml');
  assert.match(sitemap, /https:\/\/switchroute\.in\/guides\/free-local-jarvis-windows-mac/);
});

test('the workflow links only to HTTPS official documentation and tool sources', () => {
  const guide = guidesData.find((item) => item.slug === 'free-local-jarvis-windows-mac');
  for (const reference of guide.references) {
    assert.equal(new URL(reference.url).protocol, 'https:');
  }
});

test('the OpenJarvis guide offers manual setup and copy-ready prompts for three coding agents', async () => {
  const guide = guidesData.find((item) => item.slug === 'free-local-jarvis-windows-mac');
  assert.ok(guide?.agentPrompts, 'Expected AI agent setup prompts on the OpenJarvis guide');
  assert.deepEqual(guide.agentPrompts.map((prompt) => prompt.id), ['antigravity', 'claude-code', 'codex']);
  for (const item of guide.agentPrompts) {
    assert.ok(item.prompt.length > 15000, `Expected a complete end-to-end setup prompt for ${item.name}`);
    assert.ok(item.prompt.includes('STEP 1 — ASK THE USER ONCE'));
    assert.ok(item.prompt.includes('STEP 5 — BUILD THE INTERACTIVE HOLOGRAPHIC VOICE INTERFACE'));
    assert.ok(item.prompt.includes('real microphone'));
    assert.ok(item.prompt.includes('actual TTS output audio'));
    assert.ok(item.prompt.includes('Morning Digest'));
    assert.ok(item.prompt.includes('Do not claim a feature works'));
    assert.ok(item.prompt.includes('OpenJarvis'));
  }

  assert.match(guide.agentPrompts[0].prompt, /Google Antigravity/);
  assert.match(guide.agentPrompts[1].prompt, /Claude Code/);
  assert.match(guide.agentPrompts[2].prompt, /OpenAI Codex/);
  assert.ok(guide.agentPrompts.every((prompt) => prompt.prompt.includes('Do not use ElevenLabs')));
  assert.ok(guide.agentPrompts.every((prompt) => prompt.prompt.includes('Three.js is preferred')));

  const page = await read('../src/pages/GuideDetailPage.tsx');
  assert.match(page, /Choose Your Setup Method/);
  assert.match(page, /Manual Setup/);
  assert.match(page, /AI Agent Setup/);
  assert.match(page, /Choose Your AI Coding Agent/);
  assert.match(page, /antigravity/);
  assert.match(page, /holographic voice interface/);
  assert.match(page, /handleCopyAgentPrompt/);
  assert.match(page, /Copy Prompt/);
});

test('the OpenJarvis workflow links to the current native Windows installation instructions', () => {
  const guide = guidesData.find((item) => item.slug === 'free-local-jarvis-windows-mac');
  assert.ok(guide.references.some((reference) => reference.url === 'https://open-jarvis.github.io/OpenJarvis/getting-started/windows-native/'));
  assert.ok(guide.references.some((reference) => reference.url === 'https://open-jarvis.github.io/OpenJarvis/getting-started/install/'));
});
