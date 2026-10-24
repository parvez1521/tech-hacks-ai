import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { getAiToolBySlug, filterAndSortAiTools, getAiToolsForProprietary, getVideoDiscoveryTools } from '../src/services/aiCatalogService.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';

const filter = (searchQuery = '', videoDiscoverySection = 'all') => filterAndSortAiTools({
  searchQuery, category: 'video', pricingType: 'all', sortBy: 'name_asc', page: 1, videoDiscoverySection,
});

describe('Free video generation discovery', () => {
  test('AI catalog IDs and slugs remain unique, including new video entries', () => {
    assert.equal(new Set(aiToolsData.map((item) => item.id)).size, aiToolsData.length);
    assert.equal(new Set(aiToolsData.map((item) => item.slug)).size, aiToolsData.length);
  });

  test('applications, hosted demos and weights have distinct canonical links', () => {
    const agnes = getAiToolBySlug('agnes-video-generator');
    assert.equal(agnes.websiteUrl, 'https://video.lichuanyang.top');
    assert.equal(agnes.openSourceRepoUrl, 'https://github.com/lcy362/agnes-video-generator');
    assert.equal(agnes.relatedDemoUrl, 'https://video.lichuanyang.top/studio');
    assert.match(agnes.freeTierSummary, /free Agnes AI API key required/i);
    assert.ok(agnes.videoDiscoverySections.includes('browser-demos'));
    assert.equal(agnes.relatedDemoName, 'FreeShortVideoStudio');
    assert.match(agnes.freeTierLimits, /under active construction/i);

    const openGenerative = getAiToolBySlug('open-generative-ai');
    assert.equal(openGenerative.openSourceRepoUrl, 'https://github.com/Anil-matcha/Open-Generative-AI');
    assert.match(openGenerative.freeTierLimits, /MuAPI credentials.*charges may apply/i);

    const vuza = getAiToolBySlug('vuza');
    assert.match(vuza.longDescription, /AI-generated video clips are listed as planned/i);
    assert.match(vuza.freeTierLimits, /rights/i);

    const spaces = getAiToolBySlug('huggingface-video-spaces');
    assert.equal(spaces.accountRequirement, 'varies');
    assert.match(spaces.freeTierLimits, /queues.*quotas/i);

    const ltx = getAiToolBySlug('ltx-2-3');
    assert.equal(ltx.websiteUrl, 'https://ltx.io/model/ltx-2-3');
    assert.equal(ltx.modelWeightsUrl, 'https://huggingface.co/Lightricks/LTX-2.3');
    assert.match(ltx.licenseSummary, /Community License/i);

    const wan = getAiToolBySlug('wan-2-2');
    assert.equal(wan.openSourceRepoUrl, 'https://github.com/Wan-Video/Wan2.2');
    assert.equal(wan.modelWeightsUrl, 'https://huggingface.co/Wan-AI');
    assert.match(wan.hardwareRequirements, /80 GB/i);
  });

  test('Hunyuan, CogVideoX and Spaces retain their own terms and hardware context', () => {
    assert.match(getAiToolBySlug('hunyuanvideo').licenseSummary, /Tencent Hunyuan Community License/i);
    assert.match(getAiToolBySlug('hunyuanvideo-i2v').hardwareRequirements, /60 GB/i);
    assert.match(getAiToolBySlug('cogvideox').licenseSummary, /2B: Apache-2\.0.*5B: CogVideoX License/i);
    assert.equal(getAiToolBySlug('huggingface-video-spaces').websiteUrl, 'https://huggingface.co/spaces');
    assert.match(getAiToolBySlug('huggingface-video-spaces').freeTierLimits, /queues.*quotas/i);
  });

  test('section discovery and search use the shared AI catalog records', () => {
    for (const section of ['self-hosted', 'open-weights', 'browser-demos']) {
      assert.ok(getVideoDiscoveryTools(section).length > 0, `${section} has records`);
      assert.ok(filter('', section).totalCount > 0, `${section} is filterable on the video category`);
    }
    assert.ok(filter('digital presenter', 'self-hosted').tools.some((item) => item.slug === 'agnes-video-generator'));
    assert.ok(filter('60 GB', 'open-weights').totalCount >= 1);
    assert.ok(filter('Hugging Face', 'browser-demos').tools.some((item) => item.slug === 'huggingface-video-spaces'));
  });

  test('existing model detail slugs remain available and newer releases are separate', () => {
    for (const slug of ['wan-video', 'ltx-video', 'cogvideox', 'wan-2-2', 'ltx-2-3']) assert.ok(getAiToolBySlug(slug), `${slug} remains resolvable`);
    assert.notEqual(getAiToolBySlug('wan-video').slug, getAiToolBySlug('wan-2-2').slug);
    assert.notEqual(getAiToolBySlug('ltx-video').slug, getAiToolBySlug('ltx-2-3').slug);
  });

  test('AI recommendations are integrated through applicable Alternatives pages', () => {
    const targetSlugs = new Set(proprietaryTools.map((item) => item.slug));
    for (const item of aiToolsData.filter((record) => record.videoDiscoverySections?.length)) {
      for (const target of item.alternativesTo || []) assert.ok(targetSlugs.has(target), `${item.slug} points to existing alternative target ${target}`);
    }
    assert.ok(getAiToolsForProprietary('invideo-ai').some((item) => item.slug === 'agnes-video-generator'));
    assert.ok(getAiToolsForProprietary('opus-clip').some((item) => item.slug === 'purffle-shorts'));
    assert.ok(getAiToolsForProprietary('runway').some((item) => item.slug === 'wan-2-2'));
  });
});
