import type { PromptItem } from '../types/index.ts';
import imageDimensions from '../../data/prompt-image-dimensions.json' with { type: 'json' };

type PromptFeedRecord = PromptItem & { rightsConfirmed?: boolean; status?: string };
const PROMPTFEED_LICENSE_DISPLAY = 'MIT License — https://github.com/ClawLabsAI/awesome-verified-text-to-image-prompts; preserve the source copyright and license notice when redistributing.';
let promptFeedPromise: Promise<PromptItem[]> | undefined;

/** Load the compact licensed PromptFeed runtime module only when a PromptFeed route is opened. */
export function loadPromptFeedPrompts(): Promise<PromptItem[]> {
  if (!promptFeedPromise) {
    promptFeedPromise = import('../generated/promptfeedRuntime.generated.ts').then((module) => {
      const records = module.default() as PromptFeedRecord[];
      if (!Array.isArray(records) || records.length === 0) throw new Error('PromptFeed manifest did not contain any prompt records.');

      const seenSlugs = new Set<string>();
      return records.map((record) => {
        if (!record || !record.slug || !record.promptText?.trim()) throw new Error('PromptFeed manifest includes an incomplete prompt record.');
        if (seenSlugs.has(record.slug)) throw new Error(`PromptFeed manifest includes duplicate slug: ${record.slug}`);
        seenSlugs.add(record.slug);
        if (!record.slug.startsWith('promptfeed-') || !record.previewImage?.startsWith('/prompts/promptfeed/')) throw new Error(`PromptFeed preview and slug must use the PromptFeed namespace: ${record.slug}`);
        if (record.rightsStatus !== 'licensed' || !record.rightsLicense?.includes('MIT') || record.rightsConfirmed !== true) throw new Error(`PromptFeed license metadata is missing or invalid for ${record.slug}`);
        if (!record.sourceCreator || !record.sourceUrl?.startsWith('https://') || !record.attributionUrl?.startsWith('https://')) throw new Error(`PromptFeed attribution is incomplete for ${record.slug}`);
        const { rightsConfirmed: _rightsConfirmed, status: _stagedStatus, rightsLicense: _rightsLicense, ...prompt } = record;
        const dimensions = imageDimensions[record.slug as keyof typeof imageDimensions];
        return { ...prompt, rightsLicense: PROMPTFEED_LICENSE_DISPLAY, previewImageWidth: dimensions?.width || undefined, previewImageHeight: dimensions?.height || undefined, status: 'published' as const };
      });
    });
  }
  return promptFeedPromise;
}

export async function getPromptFeedPromptBySlug(slug: string): Promise<PromptItem | undefined> {
  if (!slug.startsWith('promptfeed-')) return undefined;
  const prompts = await loadPromptFeedPrompts();
  return prompts.find((prompt) => prompt.slug === slug);
}
