import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectCatalogSearchIntent,
  findAlternativeTargetFromQuery,
  getAiToolsForSearchIntent,
  getOpenSourceToolsForProprietary,
  universalSearch,
} from '../src/services/aiCatalogService.ts';
import { generateGroundedResponse } from '../src/services/chatRetrievalService.ts';

test('video generator intent excludes voice and image-only records', () => {
  assert.equal(detectCatalogSearchIntent('free AI video generator'), 'video-generation');
  const matches = getAiToolsForSearchIntent('free AI video generator');
  assert.ok(matches.length > 0);
  assert.ok(matches.every((tool) => tool.category === 'video'));
  assert.ok(!matches.some((tool) => ['elevenlabs', 'leonardo-ai', 'krea-ai'].includes(tool.slug)));
});

test('existing-video editing returns only records with explicit editing evidence', () => {
  assert.equal(detectCatalogSearchIntent('edit an existing video'), 'video-editing');
  const matches = getAiToolsForSearchIntent('edit an existing video');
  assert.ok(matches.every((tool) => tool.category === 'video'));
  assert.ok(matches.every((tool) => /timeline editing|video editor|video editing|repurpos|clip editor/i.test([
    tool.name, tool.description, tool.longDescription, ...(tool.features || []), ...(tool.useCases || []), ...(tool.tags || []),
  ].filter(Boolean).join(' ')));
  assert.ok(!matches.some((tool) => ['cursor', 'leonardo-ai', 'elevenlabs'].includes(tool.slug)));
});

test('voice-cloning intent only returns catalog records with voice-cloning evidence', () => {
  assert.equal(detectCatalogSearchIntent('voice cloning'), 'voice-cloning');
  const matches = getAiToolsForSearchIntent('voice cloning');
  assert.ok(matches.some((tool) => tool.slug === 'elevenlabs'));
  assert.ok(matches.every((tool) => tool.category === 'voice'));
});

test('local LLM search finds runners and model-serving tools, not workflow builders', () => {
  assert.equal(detectCatalogSearchIntent('local LLM tools'), 'local-llm');
  const slugs = new Set(getAiToolsForSearchIntent('local LLM tools').map((tool) => tool.slug));
  for (const slug of ['ollama', 'open-webui', 'vllm', 'llama-cpp']) assert.ok(slugs.has(slug), `Expected ${slug}`);
  assert.ok(!slugs.has('langflow'));
});

test('natural-language replacement queries resolve an alternatives target and replacements', () => {
  const target = findAlternativeTargetFromQuery('open-source alternative to Claude Code');
  assert.equal(target?.slug, 'claude-code');
  assert.ok(getOpenSourceToolsForProprietary('claude-code').length > 0);
  const results = universalSearch('open-source alternative to Claude Code');
  assert.ok(results.proprietaryAlternatives.some((item) => item.slug === 'claude-code'));
  assert.ok(results.totalMatches > 0);
});

test('chatbot refuses to present image and voice tools as video editors', () => {
  const response = generateGroundedResponse('edit an existing video');
  assert.ok(response.text.toLowerCase().includes('video-editing') || response.text.toLowerCase().includes('video editing'));
  assert.ok(!response.groundedTools?.some((tool) => ['cursor', 'leonardo-ai', 'elevenlabs'].includes(tool.slug)));
});
