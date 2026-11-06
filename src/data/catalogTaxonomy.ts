import type { FreeToolUtility, UtilityCategory } from '../types/index.ts';

export const catalogSections = [
  { id: 'ai', name: 'AI Tools', description: 'AI-powered products, models, platforms, and services.' },
  { id: 'open-source', name: 'Open Source', description: 'Self-hostable projects and open-source software alternatives.' },
  { id: 'utility', name: 'Utility Tools', description: 'Practical browser tools that help users complete focused tasks.' },
  { id: 'alternative', name: 'Alternatives', description: 'Proprietary products and their open-source replacements.' },
] as const;

export const aiSectionCategories = [
  { id: 'assistants', name: 'AI Assistants & Reasoning', iconName: 'Bot', description: 'General chat, advanced reasoning, math, multimodal analysis, and research agents.', subcategories: ['Chat assistants', 'Reasoning & math', 'Deep research', 'Multimodal analysis'] },
  { id: 'writing', name: 'Writing & Content', iconName: 'PenTool', description: 'Create, edit, rewrite, summarize, and repurpose content for every channel.', subcategories: ['Copywriting', 'Blogs & SEO', 'Social content', 'Summarizers'] },
  { id: 'image', name: 'Image Generation', iconName: 'Image', description: 'Generate visuals, edit existing images, upscale, and build product creatives.', subcategories: ['Text-to-image', 'Image editing', 'Upscaling', 'Product visuals'] },
  { id: 'video', name: 'Video Generation & Editing', iconName: 'Video', description: 'Make clips, animate images, edit footage, and build creator-ready videos.', subcategories: ['Text-to-video', 'Image-to-video', 'AI video editing', 'Avatars & captions'] },
  { id: 'voice', name: 'Audio & Voice', iconName: 'Mic', description: 'Generate speech, clone voices, transcribe recordings, and clean audio.', subcategories: ['Text-to-speech', 'Voice cloning', 'Transcription', 'Audio cleanup'] },
  { id: 'music', name: 'Music', iconName: 'Music', description: 'Compose songs, create instrumentals, and separate or remix audio stems.', subcategories: ['Song generation', 'Instrumentals', 'Music editing', 'Stem separation'] },
  { id: 'coding', name: 'Coding & Development', iconName: 'Code', description: 'Build apps, write code, debug projects, and work with terminal agents.', subcategories: ['AI code editors', 'CLI agents', 'App builders', 'Debugging & review'] },
  { id: 'productivity', name: 'Productivity & Research', iconName: 'Search', description: 'Find answers, research sources, summarize documents, and organize work.', subcategories: ['Web search', 'PDF & documents', 'Meeting notes', 'Knowledge bases'] },
  { id: 'automation', name: 'Automation & Agents', iconName: 'Zap', description: 'Connect apps and models with workflows, browser actions, and agent teams.', subcategories: ['Workflow builders', 'Browser agents', 'App integrations', 'Multi-agent systems'] },
  { id: '3d', name: 'Design & Creativity', iconName: 'Palette', description: 'Explore visual concepts, 3D assets, interface design, and creative production.', subcategories: ['3D generation', 'UI & web design', 'Presentations', 'Brand assets'] },
] as const;

export const utilityCategoryDefinitions: Array<{
  id: UtilityCategory;
  name: string;
  description: string;
}> = [
  { id: 'image-graphics', name: 'Image & Graphics', description: 'Crop, inspect, sanitize, and generate image assets locally.' },
  { id: 'video-audio', name: 'Video & Audio', description: 'Inspect, transcribe, trim, convert, and responsibly process local media.' },
  { id: 'files-data-browser', name: 'Files, Data & Browser', description: 'Inspect files, browser capabilities, MIME signatures, and timestamps.' },
  { id: 'text-writing', name: 'Text & Writing', description: 'Transform, compare, inspect, and format text without a remote utility service.' },
  { id: 'developer-tools', name: 'Developer Tools', description: 'Work with structured data, URLs, regular expressions, and CSS.' },
  { id: 'security-validation', name: 'Security & Validation', description: 'Inspect and validate tokens, identifiers, hashes, and local files.' },
];

/** Practical defaults based on common tasks; this is not usage-analytics ranking. */
export const everydayUtilityOrder = [
  'image-resizer', 'heic-to-png', 'image-cropper', 'mp4-to-mp3', 'audio-trimmer',
  'video-audio-transcriber', 'video-metadata', 'audio-metadata',
];

const legacyUtilityCategoryMap: Record<FreeToolUtility['category'], UtilityCategory> = {
  image: 'image-graphics',
  text: 'text-writing',
  code: 'developer-tools',
  developer: 'developer-tools',
  security: 'security-validation',
  browser: 'files-data-browser',
  media: 'video-audio',
  productivity: 'text-writing',
};

const utilityCategoryOverrides: Record<string, UtilityCategory> = {
  'timestamp-converter': 'files-data-browser',
  'viewport-inspector': 'files-data-browser',
  'mime-sniffer': 'files-data-browser',
  'file-metadata': 'files-data-browser',
  'qr-generator': 'developer-tools',
  'word-counter': 'text-writing',
  'json-formatter': 'developer-tools',
  'prompt-builder': 'text-writing',
  'svg-to-png': 'image-graphics',
};

export function getUtilityCategory(tool: FreeToolUtility): UtilityCategory {
  return tool.primaryCategory || utilityCategoryOverrides[tool.slug] || legacyUtilityCategoryMap[tool.category];
}

export function getUtilityCategoryDefinition(category: UtilityCategory) {
  return utilityCategoryDefinitions.find((item) => item.id === category);
}

export function getCatalogSectionName(section: (typeof catalogSections)[number]['id']): string {
  return catalogSections.find((item) => item.id === section)?.name || section;
}
