import test from 'node:test';
import assert from 'node:assert/strict';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { generateGroundedResponse, getEligibleChatTools, validateGroundedText } from '../src/services/chatRetrievalService.ts';

const cases = [
  { query: 'Suggest free AI video tools', category: 'video' },
  { query: 'Which tools can generate videos from text?', category: 'video', task: 'text-to-video' },
  { query: 'Find AI video editing tools', category: 'video', contains: ['edit', 'clip', 'repurpose'] },
  { query: 'Suggest open-source video tools', category: 'video', open: true },
  { query: 'Find AI coding tools', category: 'coding' },
  { query: 'Suggest alternatives to Claude Code', alternatives: true },
  { query: 'Find free AI image generators', category: 'image', free: true },
  { query: 'Find voice cloning tools', category: 'voice', contains: ['clone'] },
  { query: 'Show me AI workflow automation tools', category: 'automation' },
];

test('chat fallback applies category, capability and access filters before ranking', () => {
  for (const scenario of cases) {
    const results = getEligibleChatTools(scenario.query);
    assert.ok(results.length, `Expected at least one eligible result for: ${scenario.query}`);
    for (const { item, type } of results) {
      if (scenario.category) assert.equal(type, 'ai', `${scenario.query}: expected AI catalogue entry`);
      if (scenario.category && scenario.category !== 'coding') assert.equal(item.category, scenario.category, `${scenario.query}: ${item.slug} category`);
      if (scenario.category === 'coding') assert.ok(item.category === 'coding' || item.generationTasks?.includes('coding-assistant') || item.outputModalities?.includes('code'), `${scenario.query}: ${item.slug} must be a coding-capable tool`);
      if (scenario.task) assert.ok(item.generationTasks?.includes(scenario.task), `${item.slug} must support ${scenario.task}`);
      if (scenario.contains) assert.ok(scenario.contains.some((word) => JSON.stringify(item).toLowerCase().includes(word)), `${item.slug} must match requested capability`);
      if (scenario.free) assert.ok(['free', 'freemium', 'free-credits'].includes(item.pricingType), `${item.slug} must have a free access record`);
      if (scenario.open) assert.ok(item.openSourceRepoUrl && item.isSelfHostable && item.licenseSummary, `${item.slug} must have verified open-source metadata`);
      if (scenario.alternatives) assert.ok(item.alternativesTo?.includes('claude-code'), `${item.slug} must be a catalogue alternative`);
    }
  }

  const video = getEligibleChatTools('Suggest free AI video tools');
  assert.ok(video.every(({ item }) => item.slug !== 'omnirush'));
  assert.ok(aiToolsData.find((item) => item.slug === 'omnirush')?.category === 'coding');
  const broadFreeTools = getEligibleChatTools('Suggest free AI tools');
  assert.ok(broadFreeTools.length > 0);
  assert.ok(broadFreeTools.some(({ item }) => item.category !== 'video'));
  assert.ok(broadFreeTools.every(({ item, type }) => type === 'ai' || item.isAiNative), 'Broad AI queries must not include unrelated open-source software');
});

test('API live prose must name only tools from its eligible candidate set', () => {
  const videoCandidate = getEligibleChatTools('Suggest free AI video tools')[0].item.name;
  assert.equal(validateGroundedText(`${videoCandidate} is listed.`, 'Suggest free AI video tools'), true);
  assert.equal(validateGroundedText('Runway and OmniRush are listed.', 'Suggest free AI video tools'), false);
  assert.equal(validateGroundedText('Here are some ideas.', 'Suggest free AI video tools'), false);
  const fallback = generateGroundedResponse('Which tools can generate videos from text?');
  const returnedSlugs = [...fallback.text.matchAll(/\/ai-tools\/([\w-]+)/g)].map((match) => match[1]);
  assert.deepEqual(returnedSlugs, fallback.groundedTools.map((tool) => tool.slug));
});
