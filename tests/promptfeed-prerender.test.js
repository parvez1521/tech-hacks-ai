import test from 'node:test';
import assert from 'node:assert/strict';
import { getPromptFeedSeoMetadata, renderPromptFeedStaticBody } from '../scripts/promptfeed-seo.mjs';

const samplePrompt = (overrides = {}) => ({
  id: 'promptfeed-city-travel-grid',
  slug: 'promptfeed-city-travel-grid',
  title: 'City travel storyboard grid',
  description: 'Create a coherent set of cinematic travel frames for a city itinerary.',
  targetModel: 'GPT Image 2',
  promptText: 'Create a 13-frame city travel storyboard grid. Include <script>alert("x")</script> as literal text.',
  category: 'Travel & editorial',
  previewImage: '/prompts/promptfeed/city-travel-grid.jpg',
  previewImageAlt: 'City travel storyboard output preview',
  sourceCreator: 'PromptFeed community',
  rightsStatus: 'licensed',
  rightsLicense: 'MIT License — preserve the original source notice.',
  tips: 'Replace [CITY] with your selected destination.',
  customizationInstructions: 'Adjust [CITY] and [DISTRICT] for the intended itinerary.',
  expectedOutputType: 'A 13-frame travel storyboard grid.',
  exampleUseCase: 'Travel campaign storyboards.',
  visualStyle: 'Cinematic phone photography',
  placeholders: ['[CITY]', '[DISTRICT]'],
  sourceUrl: 'https://promptfeed.app/en/p/city-travel-grid',
  attributionUrl: 'https://promptfeed.app/en/p/city-travel-grid',
  ...overrides,
});

test('PromptFeed metadata creates a model-specific title and bounded description', () => {
  const metadata = getPromptFeedSeoMetadata(samplePrompt());

  assert.equal(
    metadata.title,
    'City travel storyboard grid (GPT Image 2) — AI Prompt Recipe — SwitchRoute',
  );
  assert.match(metadata.description, /^City travel storyboard grid for GPT Image 2:/);
  assert.ok(metadata.description.length <= 300);
});

test('PromptFeed static body includes meaningful, accessible prompt content and attribution', () => {
  const body = renderPromptFeedStaticBody(samplePrompt());

  assert.ok(body);
  assert.match(body, /<main/);
  assert.match(body, /<h1[^>]*>City travel storyboard grid<\/h1>/);
  assert.match(body, /<h2[^>]*>Prompt template<\/h2>/);
  assert.match(body, /src="\/prompts\/promptfeed\/city-travel-grid\.jpg"/);
  assert.match(body, /href="https:\/\/promptfeed\.app\/en\/p\/city-travel-grid"/);
  assert.match(body, /<h2[^>]*>How to customize<\/h2>/);
  assert.match(body, /Adjust \[CITY\] and \[DISTRICT\]/);
  assert.match(body, /<h2[^>]*>Editable placeholders<\/h2>/);
  assert.match(body, /<li>\[CITY\]<\/li>/);
  assert.match(body, /<h2[^>]*>Source &amp; license<\/h2>/);
  assert.match(body, /MIT License — preserve the original source notice/);
  assert.match(body, /not the original prompt author/);
  assert.match(body, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
  assert.doesNotMatch(body, /<script>alert/);
});

test('PromptFeed static body rejects non-PromptFeed slugs and unsafe image/source URLs', () => {
  assert.equal(getPromptFeedSeoMetadata(samplePrompt({ slug: 'unrelated-prompt' })), null);
  assert.equal(getPromptFeedSeoMetadata(samplePrompt({ rightsStatus: 'unknown' })), null);
  assert.equal(getPromptFeedSeoMetadata(samplePrompt({ rightsLicense: 'Unverified source' })), null);
  assert.equal(renderPromptFeedStaticBody(samplePrompt({ promptText: '   ' })), null);

  const body = renderPromptFeedStaticBody(samplePrompt({
    previewImage: 'https://attacker.example/fake.jpg',
    sourceUrl: 'javascript:alert(1)',
    attributionUrl: 'https://attacker.example/prompt',
  }));

  assert.ok(body);
  assert.doesNotMatch(body, /<img\s/);
  assert.doesNotMatch(body, /href="javascript:/);
  assert.doesNotMatch(body, /href="https:\/\/attacker\.example/);
});
