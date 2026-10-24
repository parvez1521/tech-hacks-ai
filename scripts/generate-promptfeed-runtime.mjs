import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'data/promptfeed-import.json');
const outputPath = path.join(root, 'src/generated/promptfeedRuntime.generated.ts');
const slugPrefix = 'promptfeed-';
const promptFeedSourcePrefix = 'https://promptfeed.app/en/p/';
const previewImagePrefix = '/prompts/promptfeed/';
const previewImageSuffix = '.jpg';
const previewAltSuffix = ' — matching output preview from the PromptFeed image prompt.';
const expectedOutputSuffix = ' image generated from the matching text prompt.';
const commonTags = ['promptfeed', 'gpt-image-2', 'text-to-image'];
const sharedFields = [
  'authorOrSource', 'exampleUseCase', 'mediaType', 'officialToolUrl', 'promptProvenance',
  'provider', 'rightsConfirmed', 'rightsLicense', 'rightsStatus', 'sourceCreator', 'status',
  'targetModel',
];
const recordFields = [
  'attributionUrl', 'authorOrSource', 'category', 'customizationInstructions', 'description',
  'exampleUseCase', 'expectedOutputType', 'id', 'mediaType', 'officialToolUrl', 'placeholders',
  'previewImage', 'previewImageAlt', 'promptProvenance', 'promptText', 'provider',
  'rightsConfirmed', 'rightsLicense', 'rightsStatus', 'slug', 'sourceCreator', 'sourceUrl',
  'status', 'tags', 'targetModel', 'tips', 'title', 'visualStyle',
].sort();

let sourceText;
try {
  sourceText = await readFile(sourcePath, 'utf8');
} catch (error) {
  throw new Error(`Cannot read canonical PromptFeed input at ${sourcePath}: ${error.message}`);
}

let payload;
try {
  payload = JSON.parse(sourceText);
} catch (error) {
  throw new Error(`Canonical PromptFeed input is invalid JSON at ${sourcePath}: ${error.message}`);
}

const records = Array.isArray(payload) ? payload : payload?.prompts;
if (!Array.isArray(records) || records.length === 0) {
  throw new Error(`Canonical PromptFeed input must contain a non-empty array at ${sourcePath}.`);
}

const seenSlugs = new Set();
for (const [index, record] of records.entries()) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error(`PromptFeed record ${index + 1} must be an object.`);
  }
  const actualFields = Object.keys(record).sort();
  assert.deepEqual(actualFields, recordFields, `PromptFeed record ${index + 1} has an unexpected or missing field.`);
  if (typeof record.slug !== 'string' || !record.slug.startsWith(slugPrefix) || seenSlugs.has(record.slug)) {
    throw new Error(`PromptFeed record ${index + 1} has a missing, invalid, or duplicate slug: ${record.slug}`);
  }
  seenSlugs.add(record.slug);
  if (record.id !== record.slug) throw new Error(`PromptFeed id must equal slug before it can be derived: ${record.slug}`);
  if (record.sourceUrl !== record.attributionUrl || record.sourceUrl !== `${promptFeedSourcePrefix}${record.slug.slice(slugPrefix.length)}`) {
    throw new Error(`PromptFeed source and attribution URLs cannot be derived safely: ${record.slug}`);
  }
  if (record.previewImage !== `${previewImagePrefix}${record.slug.slice(slugPrefix.length)}${previewImageSuffix}`) {
    throw new Error(`PromptFeed preview image cannot be derived safely: ${record.slug}`);
  }
  if (record.previewImageAlt !== `${record.title}${previewAltSuffix}`) {
    throw new Error(`PromptFeed preview alt text cannot be derived safely: ${record.slug}`);
  }
  if (record.expectedOutputType !== `${record.visualStyle}${expectedOutputSuffix}`) {
    throw new Error(`PromptFeed output type cannot be derived safely: ${record.slug}`);
  }
  if (!Array.isArray(record.tags) || !commonTags.every((tag, tagIndex) => record.tags[tagIndex] === tag)) {
    throw new Error(`PromptFeed tag prefix cannot be compacted safely: ${record.slug}`);
  }
  if (typeof record.customizationInstructions !== 'string' || typeof record.promptText !== 'string' || !record.promptText.trim()) {
    throw new Error(`PromptFeed prompt content is incomplete: ${record.slug}`);
  }
}

const shared = Object.fromEntries(sharedFields.map((field) => [field, records[0][field]]));
for (const record of records) {
  for (const field of sharedFields) {
    if (record[field] !== shared[field]) throw new Error(`PromptFeed shared field ${field} differs for ${record.slug}.`);
  }
}

const categories = [...new Set(records.map((record) => record.category))];
const visualStyles = [...new Set(records.map((record) => record.visualStyle))];
const tips = [...new Set(records.map((record) => record.tips))];
const customizationCounts = new Map();
for (const record of records) {
  customizationCounts.set(record.customizationInstructions, (customizationCounts.get(record.customizationInstructions) || 0) + 1);
}
let defaultCustomizationInstructions;
let highestCustomizationCount = 0;
for (const [value, count] of customizationCounts) {
  if (count > highestCustomizationCount) {
    defaultCustomizationInstructions = value;
    highestCustomizationCount = count;
  }
}

const packed = {
  shared,
  categories,
  visualStyles,
  tips,
  commonTags,
  defaultCustomizationInstructions,
  records: records.map((record) => [
    record.slug,
    record.title,
    record.description,
    categories.indexOf(record.category),
    record.customizationInstructions === defaultCustomizationInstructions ? null : record.customizationInstructions,
    record.placeholders,
    record.promptText,
    record.tags.slice(commonTags.length),
    tips.indexOf(record.tips),
    visualStyles.indexOf(record.visualStyle),
  ]),
};

const restoreRecord = ([slug, title, description, categoryIndex, customization, placeholders, promptText, tagTail, tipsIndex, styleIndex]) => {
  const visualStyle = visualStyles[styleIndex];
  const sourceUrl = `${promptFeedSourcePrefix}${slug.slice(slugPrefix.length)}`;
  return {
    ...shared,
    id: slug,
    title,
    slug,
    description,
    category: categories[categoryIndex],
    customizationInstructions: customization ?? defaultCustomizationInstructions,
    placeholders,
    expectedOutputType: `${visualStyle}${expectedOutputSuffix}`,
    promptText,
    tags: [...commonTags, ...tagTail],
    tips: tips[tipsIndex],
    visualStyle,
    previewImage: `${previewImagePrefix}${slug.slice(slugPrefix.length)}${previewImageSuffix}`,
    previewImageAlt: `${title}${previewAltSuffix}`,
    sourceUrl,
    attributionUrl: sourceUrl,
  };
};

assert.deepEqual(records.map((record, index) => restoreRecord(packed.records[index])), records,
  'Compact PromptFeed representation does not round-trip to the canonical records.');

const generatedSource = `// Generated from data/promptfeed-import.json by scripts/generate-promptfeed-runtime.mjs. Do not edit.\nconst packedPromptFeed = ${JSON.stringify(packed)};\nconst promptFeedSlugPrefix = ${JSON.stringify(slugPrefix)};\nconst promptFeedSourcePrefix = ${JSON.stringify(promptFeedSourcePrefix)};\nconst promptFeedPreviewPrefix = ${JSON.stringify(previewImagePrefix)};\nconst promptFeedPreviewSuffix = ${JSON.stringify(previewImageSuffix)};\nconst promptFeedPreviewAltSuffix = ${JSON.stringify(previewAltSuffix)};\nconst promptFeedExpectedOutputSuffix = ${JSON.stringify(expectedOutputSuffix)};\nexport default function decodePromptFeedRuntime() {\n  return packedPromptFeed.records.map(([slug, title, description, categoryIndex, customization, placeholders, promptText, tagTail, tipsIndex, styleIndex]) => {\n    const visualStyle = packedPromptFeed.visualStyles[styleIndex];\n    const sourceUrl = promptFeedSourcePrefix + slug.slice(promptFeedSlugPrefix.length);\n    return {\n      ...packedPromptFeed.shared, id: slug, title, slug, description,\n      category: packedPromptFeed.categories[categoryIndex],\n      customizationInstructions: customization ?? packedPromptFeed.defaultCustomizationInstructions,\n      placeholders, expectedOutputType: visualStyle + promptFeedExpectedOutputSuffix, promptText,\n      tags: [...packedPromptFeed.commonTags, ...tagTail], tips: packedPromptFeed.tips[tipsIndex], visualStyle,\n      previewImage: promptFeedPreviewPrefix + slug.slice(promptFeedSlugPrefix.length) + promptFeedPreviewSuffix,\n      previewImageAlt: title + promptFeedPreviewAltSuffix, sourceUrl, attributionUrl: sourceUrl,\n    };\n  });\n}\n`;

await mkdir(path.dirname(outputPath), { recursive: true });
let previousSource;
try {
  previousSource = await readFile(outputPath, 'utf8');
} catch {
  previousSource = undefined;
}
if (previousSource !== generatedSource) await writeFile(outputPath, generatedSource);
console.log(`Generated compact PromptFeed runtime module for ${records.length} records.`);
