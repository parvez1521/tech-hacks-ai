import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promptsData } from '../src/data/promptsData.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = path.join(root, 'public/sitemap.xml');
const promptFeedPath = path.join(root, 'data/promptfeed-import.json');
let sitemap = await fs.readFile(sitemapPath, 'utf8');
const manifestPayload = JSON.parse(await fs.readFile(promptFeedPath, 'utf8'));
const promptFeedPrompts = Array.isArray(manifestPayload) ? manifestPayload : manifestPayload.prompts;
if (!Array.isArray(promptFeedPrompts)) throw new Error('PromptFeed manifest must contain an array.');
const allPrompts = [...promptsData, ...promptFeedPrompts];
const known = new Set([...sitemap.matchAll(/<loc>https:\/\/switchroute\.in\/prompt-library\/([^<]+)<\/loc>/g)].map((match) => match[1]));
const entries = allPrompts.filter((prompt) => prompt?.slug && !known.has(prompt.slug)).map((prompt) => `  <url>\n    <loc>https://switchroute.in/prompt-library/${prompt.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
if (entries.length) {
  sitemap = sitemap.replace('</urlset>', `${entries.join('\n')}\n</urlset>`);
  await fs.writeFile(sitemapPath, sitemap);
}
console.log(`Added ${entries.length} prompt detail URLs from SwitchRoute and PromptFeed to public/sitemap.xml.`);
