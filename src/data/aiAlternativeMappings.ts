/** Curated relationship extensions with explicit provenance and scope notes. */
import { aiToolsData } from './aiToolsData.ts';
import { proprietaryTools } from './alternatives.ts';
import { toolsData } from './seedData.ts';
import type { AiTool, Tool } from '../types/index.ts';

export type MappingFit = 'direct' | 'partial';
export interface AiAlternativeMapping {
  alternativeSlug: string;
  targetSlug: string;
  alternativeType: 'ai' | 'open-source';
  fit: MappingFit;
  rationale: string;
  discoverySource: 'OpenAlternative' | 'SwitchRoute editorial';
  discoveryUrl: string;
  datasetUrl: string;
  datasetLicense: 'CC0-1.0' | 'not-applicable';
  verifiedAt: string;
}

const verifiedAt = '2026-10-23';
const openAlternativeDataset = 'https://github.com/piotrkulpinski/open-source-alternatives';
const datasetAnchors = {
  assistants: `${openAlternativeDataset}#ai--machine-learning`,
  coding: `${openAlternativeDataset}#developer-tools`,
};
const targetEvidence: Record<string, string> = Object.fromEntries([
  ...aiToolsData.map((tool) => [tool.slug, tool.websiteUrl]),
  ...proprietaryTools.map((tool) => [tool.slug, tool.websiteUrl]),
]) as Record<string, string>;
Object.assign(targetEvidence, {
  claude: 'https://openalternative.co/alternatives/claude',
  chatgpt: 'https://openalternative.co/alternatives/chatgpt',
  gemini: 'https://openalternative.co/alternatives/gemini',
  perplexity: 'https://openalternative.co/alternatives/perplexity',
  'claude-code': 'https://openalternative.co/alternatives/claude-code',
  cursor: 'https://openalternative.co/alternatives/cursor',
  'github-copilot': 'https://openalternative.co/alternatives/github-copilot',
});

const aiBySlug = new Map<string, AiTool>(aiToolsData.map((tool) => [tool.slug, tool]));
const openBySlug = new Map<string, Tool>(toolsData.map((tool) => [tool.slug, tool]));
const productBySlug = new Map<string, AiTool | Tool>([...openBySlug, ...aiBySlug]);
const existingPairs = new Set<string>();
for (const product of [...toolsData, ...aiToolsData]) {
  for (const targetSlug of product.alternativesTo || []) existingPairs.add(`${product.slug}->${targetSlug}`);
}

function createMapping(
  alternativeSlug: string,
  targetSlug: string,
  fit: MappingFit,
  rationale: string,
  discoverySource: AiAlternativeMapping['discoverySource'],
  datasetLicense: AiAlternativeMapping['datasetLicense'],
  discoveryUrl?: string,
): AiAlternativeMapping | undefined {
  const alternative = productBySlug.get(alternativeSlug);
  if (!alternative || !targetEvidence[targetSlug] || existingPairs.has(`${alternativeSlug}->${targetSlug}`)) return undefined;
  const alternativeType = aiBySlug.has(alternativeSlug) ? 'ai' : 'open-source';
  const category = 'category' in alternative
    ? alternative.category
    : alternative.categories?.includes('developer-tools') ? 'coding' : '';
  return {
    alternativeSlug,
    targetSlug,
    alternativeType,
    fit,
    rationale,
    discoverySource,
    discoveryUrl: discoveryUrl || targetEvidence[targetSlug],
    datasetUrl: discoverySource === 'OpenAlternative'
      ? datasetAnchors[category === 'coding' ? 'coding' : 'assistants']
      : alternative.websiteUrl,
    datasetLicense,
    verifiedAt,
  };
}

const mappings: AiAlternativeMapping[] = [];

// OpenAlternative's CC0 directory lists these existing chat clients/workspaces;
// the target pages below support them as discovery candidates. Fit is marked
// partial because the configured model, search and privacy capabilities differ.
for (const targetSlug of ['claude', 'chatgpt', 'gemini', 'perplexity']) {
  for (const alternativeSlug of ['open-webui', 'anythingllm', 'librechat', 'jan', 'khoj']) {
    const mapping = createMapping(
      alternativeSlug,
      targetSlug,
      'partial',
      'A self-hosted, multi-model chat or knowledge workflow can cover some assistant tasks; model access, web search, accounts, and feature parity depend on configuration.',
      'OpenAlternative',
      'CC0-1.0',
    );
    if (mapping) mappings.push(mapping);
  }
}

// Coding recommendations keep terminal agents, IDE agents, and model weights
// distinct. Qwen 2.5 Coder and Roo Code use the site's own canonical records.
for (const targetSlug of ['claude-code', 'cursor', 'github-copilot']) {
  for (const alternativeSlug of ['aider', 'cline', 'roocode', 'opencode', 'continue-dev', 'qwen-coder']) {
    const isOpenAlternativeCandidate = ['aider', 'cline', 'opencode', 'continue-dev'].includes(alternativeSlug);
    const mapping = createMapping(
      alternativeSlug,
      targetSlug,
      'partial',
      'This coding agent or model can support overlapping code-assistance work, with a different editor or terminal flow; integrations, completions, and model access vary.',
      isOpenAlternativeCandidate ? 'OpenAlternative' : 'SwitchRoute editorial',
      isOpenAlternativeCandidate ? 'CC0-1.0' : 'not-applicable',
      targetSlug === 'github-copilot' ? 'https://openalternative.co/alternatives/github-copilot' : undefined,
    );
    if (mapping) mappings.push(mapping);
  }
}

// Image-generation products are linked by overlapping tasks, not feature parity.
// Official product/model pages are used as the record sources, not copied copy.
const imageProducts = ['comfyui', 'flux-1', 'stable-diffusion-3', 'ideogram', 'recraft', 'leonardo-ai', 'krea-ai', 'midjourney'];
for (const targetSlug of imageProducts) {
  for (const alternativeSlug of imageProducts) {
    if (targetSlug === alternativeSlug) continue;
    const alternative = aiBySlug.get(alternativeSlug)!;
    const mapping = createMapping(
      alternativeSlug,
      targetSlug,
      'partial',
      'These products overlap on image generation, while hosted access, workflow controls, licensing, model behavior, and hardware requirements differ.',
      'SwitchRoute editorial',
      'not-applicable',
      alternative.websiteUrl,
    );
    if (mapping) mappings.push(mapping);
  }
}

const seenPairs = new Set<string>();
export const aiAlternativeMappings = mappings.filter((mapping) => {
  const key = `${mapping.alternativeSlug}->${mapping.targetSlug}`;
  if (seenPairs.has(key)) return false;
  seenPairs.add(key);
  return true;
});

export function getAiAlternativeMapping(alternativeSlug: string, targetSlug: string): AiAlternativeMapping | undefined {
  return aiAlternativeMappings.find((mapping) => mapping.alternativeSlug === alternativeSlug && mapping.targetSlug === targetSlug);
}

export function getOpenSourceAlternativesForTarget(targetSlug: string): Tool[] {
  const slugs = new Set(aiAlternativeMappings
    .filter((mapping) => mapping.targetSlug === targetSlug && mapping.alternativeType === 'open-source')
    .map((mapping) => mapping.alternativeSlug));
  return toolsData.filter((tool) => slugs.has(tool.slug));
}

export function getAlternativeTargetRecord(slug: string) {
  return aiBySlug.get(slug) || openBySlug.get(slug) || proprietaryTools.find((tool) => tool.slug === slug);
}
