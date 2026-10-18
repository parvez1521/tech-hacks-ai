import { getPickRecommendations } from '../src/services/aiCatalogService.ts';

const scenarios = [
  {
    name: '1. Free text-to-video generation',
    criteria: {
      goal: 'video-generation',
      taskDetail: 'text-to-video',
      budget: 'completely-free',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    },
  },
  {
    name: '2. Free image-to-video generation',
    criteria: {
      goal: 'video-generation',
      taskDetail: 'image-to-video',
      budget: 'free-credits',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    },
  },
  {
    name: '3. Free AI chatbot',
    criteria: {
      goal: 'chat-research',
      taskDetail: 'all-chat',
      budget: 'completely-free',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    },
  },
  {
    name: '4. Free AI coding assistant (IDE Editor)',
    criteria: {
      goal: 'coding-dev',
      taskDetail: 'ide-editor',
      budget: 'free-credits',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    },
  },
  {
    name: '5. Open-source local AI assistant',
    criteria: {
      goal: 'chat-research',
      taskDetail: 'all-chat',
      budget: 'self-hosted',
      hostingPreference: 'local',
      watermarkPreference: 'any',
    },
  },
  {
    name: '6. Free image editing',
    criteria: {
      goal: 'image-generation',
      taskDetail: 'image-editing',
      budget: 'completely-free',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    },
  },
  {
    name: '7a. Completely free video (no one-time trials)',
    criteria: {
      goal: 'video-generation',
      budget: 'completely-free',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    },
  },
  {
    name: '7b. Free starter credits video (allows trials/credits)',
    criteria: {
      goal: 'video-generation',
      budget: 'free-trial',
      hostingPreference: 'any',
      watermarkPreference: 'any',
    },
  },
];

console.log('--- RUNNING REALISTIC RECOMMENDATION SCENARIOS ---\n');

for (const sc of scenarios) {
  console.log(`=== SCENARIO: ${sc.name} ===`);
  const recs = getPickRecommendations(sc.criteria);
  console.log(`Total matched: ${recs.length}`);
  recs.slice(0, 4).forEach((r, idx) => {
    console.log(
      `  #${idx + 1}: ${r.tool.name} (Score: ${r.matchScore})` +
      `\n       Category: ${r.tool.category || ('categories' in r.tool ? r.tool.categories.join(', ') : 'unknown')}` +
      `\n       Pricing: ${r.pricingType} / ${r.freeAccessType}` +
      `\n       Explanation: ${r.matchExplanation}`
    );
  });
  console.log('');
}
