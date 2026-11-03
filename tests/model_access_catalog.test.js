import test from 'node:test';
import assert from 'node:assert/strict';
import { aiModels, getCurrentModelAccessRoutes, modelAccessProviders, modelAccessRoutes } from '../src/data/modelAccessCatalog.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';

test('model access catalog keeps models, providers and routes distinct and connected', () => {
  assert.equal(new Set(aiModels.map((model) => model.id)).size, aiModels.length);
  assert.equal(new Set(modelAccessProviders.map((provider) => provider.id)).size, modelAccessProviders.length);
  assert.equal(new Set(modelAccessRoutes.map((route) => route.id)).size, modelAccessRoutes.length);
  for (const route of modelAccessRoutes) {
    assert.ok(aiModels.some((model) => model.id === route.modelId), `unknown model ${route.modelId}`);
    assert.ok(modelAccessProviders.some((provider) => provider.id === route.providerId), `unknown provider ${route.providerId}`);
    assert.ok(route.claimUrl && route.sourceUrl && route.lastVerifiedAt);
  }
  assert.equal(aiToolsData.filter((tool) => ['omnirush', 'kie-ai'].includes(tool.slug)).length, 2);
  assert.equal(aiToolsData.some((tool) => tool.slug === 'rusherai'), false);
});

test('free routes distinguish daily model allowance, weekly shared tokens, and daily Seedance credits', () => {
  const seedanceFreeRoutes = getCurrentModelAccessRoutes('seedance-2-5').filter((route) => route.accessType === 'free-daily-credits');
  assert.equal(seedanceFreeRoutes.length, 1);
  assert.equal(seedanceFreeRoutes[0].providerId, 'dreamina');
  assert.match(seedanceFreeRoutes[0].quickNote, /region- and account-dependent/);

  const rusherRoutes = getCurrentModelAccessRoutes().filter((route) => route.providerId === 'rusherai');
  assert.deepEqual(rusherRoutes.map((route) => route.modelId).sort(), ['claude-opus-5-5', 'gpt-6-astra']);

  const omniRoute = getCurrentModelAccessRoutes('gpt-6-astra').find((route) => route.providerId === 'omnirush');
  assert.equal(omniRoute.accessType, 'free-daily-allowance');
  assert.match(omniRoute.conditions, /at least 7 days old/);
  assert.equal(modelAccessProviders.find((provider) => provider.id === 'dreamina').mode, 'official');
});

test('expired and unverified routes never appear in current access results', () => {
  const original = [...modelAccessRoutes];
  try {
    modelAccessRoutes.push(
      { ...original[0], id: 'test-expired', status: 'limited-time', expiryDate: '2026-10-01' },
      { ...original[0], id: 'test-unverified', status: 'unverified' },
    );
    const current = getCurrentModelAccessRoutes(undefined, new Date('2026-11-03T00:00:00Z'));
    assert.equal(current.some((route) => route.id === 'test-expired' || route.id === 'test-unverified'), false);
  } finally {
    modelAccessRoutes.splice(0, modelAccessRoutes.length, ...original);
  }
});
