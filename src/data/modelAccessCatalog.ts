export type ModelCategory = 'assistants' | 'coding' | 'video';
export type AccessStatus = 'verified-active' | 'limited-time' | 'expired' | 'unverified';
export type AccessMode = 'official' | 'third-party-api' | 'community-or-promotional';

export interface AiModelRecord {
  id: string;
  name: string;
  organization: string;
  documentationUrl: string;
  family: string;
  category: ModelCategory;
  capabilities: string[];
  summary: string;
  officialApi: { available: boolean; url: string; pricing?: string };
  lastVerifiedAt: string;
}

export interface ModelAccessProvider {
  id: string;
  name: string;
  url: string;
  mode: AccessMode;
  existingToolSlug?: string;
}

export interface ModelAccessRoute {
  id: string;
  modelId: string;
  providerId: string;
  claimUrl: string;
  accessType: 'paid-api' | 'browser-plan' | 'free-weekly-shared' | 'free-daily-allowance' | 'free-daily-credits';
  allowance?: string;
  quickNote?: string;
  resetFrequency?: 'weekly' | 'monthly' | 'daily';
  requiresAccount: boolean;
  region: string;
  conditions: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  expiryDate?: string;
  status: AccessStatus;
}

export const aiModels: AiModelRecord[] = [
  {
    id: 'gpt-6-astra', name: 'GPT-6 Astra', organization: 'OpenAI',
    documentationUrl: 'https://developers.openai.com/api/docs/models/gpt-6-astra', family: 'GPT-6', category: 'assistants',
    capabilities: ['Reasoning', 'Coding', 'Computer use', 'Research', 'Document creation'],
    summary: 'A high-end work model for complex reasoning, software engineering, browser/computer use, and research.'
    officialApi: { available: true, url: 'https://developers.openai.com/api/docs/models/gpt-6-astra', pricing: '$10 / 1M input tokens; $50 / 1M output tokens' },
    lastVerifiedAt: '2026-11-03',
  },
  {
    id: 'claude-opus-5-5', name: 'Claude Opus 5.5', organization: 'Anthropic',
    documentationUrl: 'https://www.anthropic.com/claude/opus', family: 'Claude 5', category: 'assistants',
    capabilities: ['Reasoning', 'Coding', 'Long-context analysis', 'Research'],
    summary: 'Built for long-running agentic coding, large codebase work, and detailed knowledge tasks.'
    officialApi: { available: true, url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', pricing: '$4 / 1M input tokens; $20 / 1M output tokens' },
    lastVerifiedAt: '2026-11-03',
  },
  {
    id: 'seedance-2-5', name: 'Seedance 2.5', organization: 'ByteDance',
    documentationUrl: 'https://seed.bytedance.com/en/seedance2_5', family: 'Seedance', category: 'video',
    capabilities: ['Text-to-video', 'Reference-guided generation', 'Audio and video generation'],
    summary: 'A native audio-video generator for up to 30-second scenes, multi-reference direction, and precise edits.'
    officialApi: { available: true, url: 'https://docs.volcengine.com/docs/ark/seedance-2-5?lang=en' },
    lastVerifiedAt: '2026-11-03',
  },
];

export const modelAccessProviders: ModelAccessProvider[] = [
  { id: 'openai', name: 'OpenAI API', url: 'https://developers.openai.com/api/docs/models/gpt-6-astra', mode: 'official' },
  { id: 'anthropic', name: 'Anthropic API', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', mode: 'official' },
  { id: 'claude', name: 'Claude', url: 'https://claude.com/pricing', mode: 'official' },
  { id: 'rusherai', name: 'RusherAI', url: 'https://rusherai.com/', mode: 'community-or-promotional' },
  { id: 'omnirush', name: 'OmniRush', url: 'https://omnirush.ai/', mode: 'community-or-promotional', existingToolSlug: 'omnirush' },
  { id: 'dreamina', name: 'Dreamina', url: 'https://dreamina.capcut.com/seedance/seedance-2-5', mode: 'official' },
  { id: 'byteplus-modelark', name: 'BytePlus ModelArk', url: 'https://docs.volcengine.com/docs/ark/seedance-2-5?lang=en', mode: 'official' },
  { id: 'kie-ai', name: 'KIE AI', url: 'https://kie.ai/seedance-2-5', mode: 'third-party-api', existingToolSlug: 'kie-ai' },
];

export const modelAccessRoutes: ModelAccessRoute[] = [
  { id: 'astra-openai-api', modelId: 'gpt-6-astra', providerId: 'openai', claimUrl: 'https://developers.openai.com/api/docs/models/gpt-6-astra', accessType: 'paid-api', requiresAccount: true, region: 'Regions supported by OpenAI API', conditions: 'Paid API usage; account and billing required.', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-6-astra', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'astra-rusherai', modelId: 'gpt-6-astra', providerId: 'rusherai', claimUrl: 'https://rusherai.com/', accessType: 'free-weekly-shared', allowance: '50 million tokens shared weekly across 9 listed models', quickNote: 'One shared weekly pool across 9 models; it is not 50 million tokens per model.', resetFrequency: 'weekly', requiresAccount: true, region: 'Not published', conditions: 'Provider states access is free. Account required. Independent third-party access; not affiliated with OpenAI.', sourceUrl: 'https://rusherai.com/', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'opus-anthropic-api', modelId: 'claude-opus-5-5', providerId: 'anthropic', claimUrl: 'https://www.anthropic.com/claude/opus', accessType: 'paid-api', requiresAccount: true, region: 'Regions supported by Anthropic', conditions: 'Paid API usage; account and billing required.', sourceUrl: 'https://www.anthropic.com/claude/opus', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'opus-claude-plan', modelId: 'claude-opus-5-5', providerId: 'claude', claimUrl: 'https://claude.com/pricing', accessType: 'browser-plan', requiresAccount: true, region: 'Regions supported by Claude', conditions: 'Opus access requires a paid Claude plan; not included in the Free plan.', sourceUrl: 'https://claude.com/pricing', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'opus-rusherai', modelId: 'claude-opus-5-5', providerId: 'rusherai', claimUrl: 'https://rusherai.com/', accessType: 'free-weekly-shared', allowance: '50 million tokens shared weekly across 9 listed models', quickNote: 'Same shared 50 million-token weekly pool across 9 models; not a separate Opus allowance.', resetFrequency: 'weekly', requiresAccount: true, region: 'Not published', conditions: 'Provider states access is free. Account required. Independent third-party access; not affiliated with Anthropic.', sourceUrl: 'https://rusherai.com/', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'astra-omnirush-daily', modelId: 'gpt-6-astra', providerId: 'omnirush', claimUrl: 'https://omnirush.ai/', accessType: 'free-daily-allowance', allowance: 'Daily free frontier-model allowance; a fixed token amount is not published', quickNote: 'Daily allowance with no card or paid tier. Sign-up requires a GitHub account that is at least 7 days old.', resetFrequency: 'daily', requiresAccount: true, region: 'Not published; check account eligibility', conditions: 'OmniRush states every account receives a daily allowance for frontier-model work. Sign-up requires a GitHub account at least 7 days old. Independent provider; not affiliated with OpenAI.', sourceUrl: 'https://omnirush.ai/', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'seedance-dreamina-daily', modelId: 'seedance-2-5', providerId: 'dreamina', claimUrl: 'https://dreamina.capcut.com/seedance/seedance-2-5', accessType: 'free-daily-credits', allowance: 'Free daily credits for testing Seedance 2.5; credit cost varies by generation settings', quickNote: 'Daily credits are region- and account-dependent. Check the in-product credit quote; no fixed number of free clips is promised.', resetFrequency: 'daily', requiresAccount: true, region: 'Varies by region and account', conditions: 'Dreamina advertises free daily credits that can be used to try Seedance 2.5. Model availability and credit cost can vary by region, account, duration, resolution and settings. Free exports may include a watermark.', sourceUrl: 'https://dreamina.capcut.com/seedance/seedance-2-5', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'seedance-byteplus', modelId: 'seedance-2-5', providerId: 'byteplus-modelark', claimUrl: 'https://docs.volcengine.com/docs/ark/seedance-2-5?lang=en', accessType: 'paid-api', requiresAccount: true, region: 'BytePlus ModelArk supported regions', conditions: 'Paid API; account balance or credits required.', sourceUrl: 'https://docs.volcengine.com/docs/ark/seedance-2-5?lang=en', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'seedance-kie', modelId: 'seedance-2-5', providerId: 'kie-ai', claimUrl: 'https://kie.ai/seedance-2-5', accessType: 'paid-api', requiresAccount: true, region: 'Not published', conditions: 'Third-party API route billed per generation; KIE trial credits are not advertised here as sufficient for a Seedance generation.', sourceUrl: 'https://kie.ai/seedance-2-5', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
];

export function getCurrentModelAccessRoutes(modelId?: string, now = new Date()) {
  return modelAccessRoutes.filter((route) => {
    if (modelId && route.modelId !== modelId) return false;
    if (!['verified-active', 'limited-time'].includes(route.status)) return false;
    if (route.expiryDate && new Date(`${route.expiryDate}T23:59:59Z`) < now) return false;
    return Boolean(route.claimUrl && route.sourceUrl && route.lastVerifiedAt);
  });
}
