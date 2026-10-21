import type { FreeToolUtility, UtilityCategory } from '../types/index.ts';

export const catalogSections = [
  { id: 'ai', name: 'AI Tools', description: 'AI-powered products, models, platforms, and services.' },
  { id: 'community', name: 'Community Tools', description: 'Editorially reviewed tools submitted by the Tech Hacks AI community.' },
  { id: 'open-source', name: 'Open Source', description: 'Self-hostable projects and open-source software alternatives.' },
  { id: 'utility', name: 'Utility Tools', description: 'Practical browser tools that help users complete focused tasks.' },
  { id: 'alternative', name: 'Alternatives', description: 'Proprietary products and their open-source replacements.' },
] as const;

export const aiSectionCategories = [
  { id: 'assistants', name: 'AI Chatbots & Assistants', iconName: 'Bot', description: 'General intelligence assistants, reasoning models, and research agents.' },
  { id: 'writing', name: 'AI Writing & Content', iconName: 'PenTool', description: 'Copywriting, long-form articles, summarization, and tone enhancement.' },
  { id: 'image', name: 'AI Image Generation', iconName: 'Image', description: 'Text-to-image synthesis, upscaling, editing, and style transfer.' },
  { id: 'video', name: 'AI Video Generation & Editing', iconName: 'Video', description: 'Generative video models, video editing, and text-to-video tools.' },
  { id: 'voice', name: 'AI Audio & Voice', iconName: 'Mic', description: 'AI voice generation, speech cloning, text-to-speech, and audio isolation.' },
  { id: 'music', name: 'AI Music & Audio', iconName: 'Music', description: 'Full song composition, instrumental tracks, and stems generation.' },
  { id: 'coding', name: 'AI Coding & Development', iconName: 'Code', description: 'AI code editors, UI scaffolding, code completion, and terminal agents.' },
  { id: 'productivity', name: 'AI Productivity & Research', iconName: 'Search', description: 'Neural search engines, meeting transcribers, and knowledge synthesizers.' },
  { id: 'automation', name: 'AI Automation & Agents', iconName: 'Zap', description: 'Connecting AI models to databases, webhooks, and multi-step processes.' },
  { id: '3d', name: 'AI Design & Creativity', iconName: 'Palette', description: '3D generation, visual design, and creative production workflows.' },
] as const;

export const utilityCategoryDefinitions: Array<{
  id: UtilityCategory;
  name: string;
  description: string;
}> = [
  { id: 'video-audio', name: 'Video & Audio', description: 'Inspect, transcribe, trim, convert, and responsibly process local media.' },
  { id: 'image-graphics', name: 'Image & Graphics', description: 'Crop, inspect, sanitize, and generate image assets locally.' },
  { id: 'text-writing', name: 'Text & Writing', description: 'Transform, compare, inspect, and format text without a remote utility service.' },
  { id: 'developer-tools', name: 'Developer Tools', description: 'Work with structured data, URLs, regular expressions, and CSS.' },
  { id: 'security-validation', name: 'Security & Validation', description: 'Inspect and validate tokens, identifiers, hashes, and local files.' },
  { id: 'files-data-browser', name: 'Files, Data & Browser', description: 'Inspect files, browser capabilities, MIME signatures, and timestamps.' },
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
