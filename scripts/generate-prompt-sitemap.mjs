import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promptCategories, promptsData } from '../src/data/promptsData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = path.join(root, 'public/sitemap.xml');
const promptFeedPath = path.join(root, 'data/promptfeed-import.json');
const promptCatalogIndexPath = path.join(root, 'data/promptfeed-catalog-index.json');
const promptCatalogCountPath = path.join(root, 'data/promptfeed-catalog-count.json');
const promptMediaCountsPath = path.join(root, 'data/prompt-media-counts.json');
let sitemap = await fs.readFile(sitemapPath, 'utf8');
const manifestPayload = JSON.parse(await fs.readFile(promptFeedPath, 'utf8'));
const promptFeedPrompts = Array.isArray(manifestPayload) ? manifestPayload : manifestPayload.prompts;
if (!Array.isArray(promptFeedPrompts)) throw new Error('PromptFeed manifest must contain an array.');
const promptFeedSlugs = [...new Set(promptFeedPrompts.map((item) => item?.slug).filter(Boolean))].sort();
await fs.writeFile(promptCatalogIndexPath, `${JSON.stringify(promptFeedSlugs)}\n`);
const uniquePromptSlugs = new Set([...promptsData.map((prompt) => prompt.slug), ...promptFeedSlugs]);
await fs.writeFile(promptCatalogCountPath, `${JSON.stringify(uniquePromptSlugs.size)}\n`);
const allPrompts = [...promptsData, ...promptFeedPrompts];
const imagePromptCategories = new Set(['human-portraits', 'ai-image-generation', 'image-editing-img2img', '3d-design-product-vis']);
const videoPromptCategories = new Set(['ai-video-generation', 'cinematic-camera-vfx']);
const knownPromptCategories = new Set(promptCategories.map((category) => category.id));
const promptTypes = new Map();
for (const prompt of allPrompts) {
  if (!prompt?.slug) continue;
  const explicitType = prompt.mediaType;
  if (explicitType && explicitType !== 'image' && explicitType !== 'video') {
    throw new Error(`Unsupported mediaType "${explicitType}" on prompt ${prompt.slug}.`);
  }
  // Missing mediaType is inferred only from established visual-output categories;
  // code and workflow prompts in other known categories remain non-visual.
  const categoryType = imagePromptCategories.has(prompt.category)
    ? 'image'
    : videoPromptCategories.has(prompt.category)
      ? 'video'
      : null;
  if (explicitType && categoryType && explicitType !== categoryType) {
    throw new Error(`Prompt ${prompt.slug} has mediaType ${explicitType} but category ${prompt.category} implies ${categoryType}.`);
  }
  const derivedType = explicitType || categoryType;
  if (!derivedType && (!prompt.category || !knownPromptCategories.has(prompt.category))) {
    throw new Error(`Prompt ${prompt.slug} has no explicit mediaType or recognized category for the media summary.`);
  }
  const existingType = promptTypes.get(prompt.slug);
  if (existingType && derivedType && existingType !== derivedType) {
    throw new Error(`Conflicting prompt media types for ${prompt.slug}: ${existingType} and ${derivedType}.`);
  }
  if (derivedType) promptTypes.set(prompt.slug, derivedType);
}
const promptMediaCounts = {
  imagePrompts: [...promptTypes.values()].filter((type) => type === 'image').length,
  videoPrompts: [...promptTypes.values()].filter((type) => type === 'video').length,
  nonVisualPrompts: uniquePromptSlugs.size - promptTypes.size,
};
await fs.writeFile(promptMediaCountsPath, `${JSON.stringify(promptMediaCounts)}\n`);
const knownUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const candidates = [
  ...allPrompts.filter((item) => item?.slug).map((item) => ({ url: `https://switchroute.in/prompt-library/${item.slug}`, priority: '0.6' })),
  ...aiToolsData.filter((item) => item?.slug).map((item) => ({ url: `https://switchroute.in/ai-tools/${item.slug}`, priority: '0.7' })),
  ...proprietaryTools.filter((item) => item?.slug).map((item) => ({ url: `https://switchroute.in/alternatives/${item.slug}`, priority: '0.6' })),
];
const entries = candidates.filter((item) => !knownUrls.has(item.url)).map((item) => `  <url>\n    <loc>${item.url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`);
if (entries.length) {
  sitemap = sitemap.replace('</urlset>', `${entries.join('\n')}\n</urlset>`);
  await fs.writeFile(sitemapPath, sitemap);
}
console.log(`Added ${entries.length} prompt, AI tool and alternatives detail URLs to public/sitemap.xml.`);
