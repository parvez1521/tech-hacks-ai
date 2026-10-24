import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { toolsData } from '../src/data/seedData.ts';
import { aiAlternativeMappings, getAlternativeTargetRecord } from '../src/data/aiAlternativeMappings.ts';
import { getAiAlternativesForTarget, getAiToolsForProprietary, getCatalogStats } from '../src/services/aiCatalogService.ts';
import { getProprietaryToolBySlug, getToolsForProprietary } from '../src/services/catalogService.ts';
import { promptsData } from '../src/data/promptsData.ts';

test('catalog statistics count unique identities, mapped pairs, and prompt slugs', () => {
  const stats = getCatalogStats();
  assert.equal(stats.catalogIdentities, new Set([...toolsData, ...aiToolsData, ...proprietaryTools].map((item) => item.slug)).size);
  assert.equal(stats.openSourceTools, new Set(toolsData.map((item) => item.slug)).size);
  assert.equal(stats.alternativeRelationships, 224);
  assert.equal(stats.uniquePrompts, 582);
  assert.equal(stats.proprietaryToolsWithAlternatives, 25);
  assert.equal(stats.imagePrompts, 548);
  assert.equal(stats.videoPrompts, 12);
  assert.equal(stats.nonVisualPrompts, 22);
  const index = JSON.parse(fs.readFileSync('data/promptfeed-catalog-index.json', 'utf8'));
  const manifest = JSON.parse(fs.readFileSync('data/promptfeed-import.json', 'utf8'));
  const feed = Array.isArray(manifest) ? manifest : manifest.prompts;
  assert.deepEqual(index, [...new Set(feed.map((item) => item.slug))].sort());
  assert.equal(new Set([...promptsData.map((item) => item.slug), ...index]).size, stats.uniquePrompts);
});

test('85 additional alternatives are deduplicated, sourced, categorized, and route-backed', () => {
  assert.equal(aiAlternativeMappings.length, 85);
  const pairKeys = aiAlternativeMappings.map((mapping) => `${mapping.alternativeSlug}->${mapping.targetSlug}`);
  assert.equal(new Set(pairKeys).size, aiAlternativeMappings.length);
  const sources = new Map([...toolsData, ...aiToolsData].map((item) => [item.slug, item]));

  for (const mapping of aiAlternativeMappings) {
    const alternative = sources.get(mapping.alternativeSlug);
    const target = getAlternativeTargetRecord(mapping.targetSlug);
    assert.ok(alternative, `${mapping.alternativeSlug} is registered`);
    assert.ok(target, `${mapping.targetSlug} is registered`);
    assert.ok(alternative.websiteUrl.startsWith('https://'), `${mapping.alternativeSlug} has a canonical product URL`);
    assert.ok(target.websiteUrl.startsWith('https://'), `${mapping.targetSlug} has a canonical product URL`);
    assert.ok(mapping.discoveryUrl.startsWith('https://'));
    assert.ok(mapping.datasetUrl.startsWith('https://'));
    assert.match(mapping.verifiedAt, /^2026-10-23$/);
    assert.ok(mapping.rationale.length >= 60);
    if (mapping.discoverySource === 'OpenAlternative') assert.equal(mapping.datasetLicense, 'CC0-1.0');
    else assert.equal(mapping.datasetLicense, 'not-applicable');
  }
});

test('new recommendations appear on existing AI and proprietary detail flows', () => {
  assert.ok(getAiAlternativesForTarget('claude').some((tool) => tool.slug === 'open-webui'));
  assert.ok(getAiAlternativesForTarget('cursor').some((tool) => tool.slug === 'qwen-coder'));
  assert.ok(getToolsForProprietary('claude-code').some((tool) => tool.slug === 'cline'));
  assert.ok(getProprietaryToolBySlug('github-copilot'));
  assert.ok(getAiToolsForProprietary('github-copilot').some((tool) => tool.slug === 'qwen-coder'));
  assert.ok(getAiAlternativesForTarget('midjourney').some((tool) => tool.slug === 'comfyui'));
});
