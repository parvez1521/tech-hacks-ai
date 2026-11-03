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
  accessType: 'paid-api' | 'browser-plan' | 'free-weekly-shared';
  allowance?: string;
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
    officialApi: { available: true, url: 'https://developers.openai.com/api/docs/models/gpt-6-astra', pricing: '$10 / 1M input tokens; $50 / 1M output tokens' },
    lastVerifiedAt: '2026-11-03',
  },
  {
    id: 'claude-opus-5-5', name: 'Claude Opus 5.5', organization: 'Anthropic',
    documentationUrl: 'https://www.anthropic.com/claude/opus', family: 'Claude 5', category: 'assistants',
    capabilities: ['Reasoning', 'Coding', 'Long-context analysis', 'Research'],
    officialApi: { available: true, url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', pricing: '$4 / 1M input tokens; $20 / 1M output tokens' },
    lastVerifiedAt: '2026-11-03',
  },
  {
    id: 'seedance-2-5', name: 'Seedance 2.5', organization: 'ByteDance',
    documentationUrl: 'https://seed.bytedance.com/en/seedance2_5', family: 'Seedance', category: 'video',
    capabilities: ['Text-to-video', 'Reference-guided generation', 'Audio and video generation'],
    officialApi: { available: true, url: 'https://docs.volcengine.com/docs/ark/seedance-2-5?lang=en' },
    lastVerifiedAt: '2026-11-03',
  },
];

export const modelAccessProviders: ModelAccessProvider[] = [
  { id: 'openai', name: 'OpenAI API', url: 'https://developers.openai.com/api/docs/models/gpt-6-astra', mode: 'official' },
  { id: 'anthropic', name: 'Anthropic API', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', mode: 'official' },
  { id: 'claude', name: 'Claude', url: 'https://claude.com/pricing', mode: 'official' },
  { id: 'rusherai', name: 'RusherAI', url: 'https://rusherai.com/', mode: 'community-or-promotional' },
  { id: 'byteplus-modelark', name: 'BytePlus ModelArk', url: 'https://docs.volcengine.com/docs/ark/seedance-2-5?lang=en', mode: 'official' },
  { id: 'kie-ai', name: 'KIE AI', url: 'https://kie.ai/seedance-2-5', mode: 'third-party-api', existingToolSlug: 'kie-ai' },
];

export const modelAccessRoutes: ModelAccessRoute[] = [
  { id: 'astra-openai-api', modelId: 'gpt-6-astra', providerId: 'openai', claimUrl: 'https://developers.openai.com/api/docs/models/gpt-6-astra', accessType: 'paid-api', requiresAccount: true, region: 'Regions supported by OpenAI API', conditions: 'Paid API usage; account and billing required.', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-6-astra', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'astra-rusherai', modelId: 'gpt-6-astra', providerId: 'rusherai', claimUrl: 'https://rusherai.com/', accessType: 'free-weekly-shared', allowance: '50 million tokens shared weekly across 9 listed models', resetFrequency: 'weekly', requiresAccount: true, region: 'Not published', conditions: 'Provider states access is free; allowance is shared across its listed models. Account required. Not affiliated with OpenAI.', sourceUrl: 'https://rusherai.com/', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'opus-anthropic-api', modelId: 'claude-opus-5-5', providerId: 'anthropic', claimUrl: 'https://www.anthropic.com/claude/opus', accessType: 'paid-api', requiresAccount: true, region: 'Regions supported by Anthropic', conditions: 'Paid API usage; account and billing required.', sourceUrl: 'https://www.anthropic.com/claude/opus', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'opus-claude-plan', modelId: 'claude-opus-5-5', providerId: 'claude', claimUrl: 'https://claude.com/pricing', accessType: 'browser-plan', requiresAccount: true, region: 'Regions supported by Claude', conditions: 'Opus access requires a paid Claude plan; not included in the Free plan.', sourceUrl: 'https://claude.com/pricing', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
  { id: 'opus-rusherai', modelId: 'claude-opus-5-5', providerId: 'rusherai', claimUrl: 'https://rusherai.com/', accessType: 'free-weekly-shared', allowance: '50 million tokens shared weekly across 9 listed models', resetFrequency: 'weekly', requiresAccount: true, region: 'Not published', conditions: 'Provider states access is free; allowance is shared across its listed models. Account required. Not affiliated with Anthropic.', sourceUrl: 'https://rusherai.com/', lastVerifiedAt: '2026-11-03', status: 'verified-active' },
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
