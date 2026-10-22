import { getBrandLogo } from './brandLogos.ts';

/** Display-name and model aliases used by the prompt catalog. */
export const promptProviderLogoAliases: Record<string, string> = {
  google: 'googlegemini',
  'google nano banana': 'googlegemini',
  'nano banana': 'googlegemini',
  gemini: 'googlegemini',
  'google gemini': 'googlegemini',
  anthropic: 'anthropic',
  claude: 'anthropic',
  sonnet: 'anthropic',
  'black forest labs': 'flux-1',
  blackforestlabs: 'flux-1',
  flux: 'flux-1',
  'flux 1': 'flux-1',
  higgsfield: 'higgsfield',
  pixverse: 'pixverse',
  'pixverse ai': 'pixverse',
  kling: 'kling-ai',
  'kling ai': 'kling-ai',
  runway: 'runway',
  cursor: 'cursor',
  openai: 'openai',
  chatgpt: 'chatgpt',
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[()]/g, ' ').replace(/[._/-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Resolves exact provider labels first, then known model-name aliases. */
export function getPromptProviderLogoSlug(provider?: string, targetModel?: string): string {
  const candidates = [provider, targetModel].filter((value): value is string => Boolean(value)).map(normalize);
  for (const candidate of candidates) {
    const exact = promptProviderLogoAliases[candidate];
    if (exact && getBrandLogo(exact)) return exact;
  }
  for (const candidate of candidates) {
    for (const [alias, slug] of Object.entries(promptProviderLogoAliases)) {
      if ((candidate === alias || candidate.startsWith(`${alias} `) || candidate.includes(` ${alias} `) || candidate.endsWith(` ${alias}`)) && getBrandLogo(slug)) return slug;
    }
  }
  return provider || targetModel || 'unknown';
}
