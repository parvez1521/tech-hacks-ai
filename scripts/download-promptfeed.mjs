import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectImage } from './audit-prompt-assets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'https://github.com/ClawLabsAI/awesome-verified-text-to-image-prompts';
const raw = 'https://raw.githubusercontent.com/ClawLabsAI/awesome-verified-text-to-image-prompts/main';
const promptsUrl = raw + '/prompts.json';
const previewIndexUrl = 'https://api.github.com/repos/ClawLabsAI/awesome-verified-text-to-image-prompts/contents/previews';
const licenseUrl = raw + '/LICENSE';
const assetDir = path.join(root, 'public', 'prompts', 'promptfeed');
const outputFile = path.join(root, 'data', 'promptfeed-import.json');
const licenseFile = path.join(root, 'docs', 'licenses', 'PROMPTFEED-MIT-LICENSE.txt');
const force = process.argv.includes('--force');
const concurrency = 8;
const failures = [];

async function fetchResponse(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'User-Agent': 'Tech-Hacks-AI-Prompt-Library-Importer', ...(options.headers || {}) },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error('HTTP ' + response.status + ' for ' + url);
  return response;
}

async function fetchJson(url) {
  return (await fetchResponse(url, { headers: { Accept: 'application/vnd.github+json' } })).json();
}

function safeSlug(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function isHttps(value) {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

function categoryFor(value) {
  const s = String(value || '').toLowerCase();
  if (/portrait|people|human|character|headshot/.test(s)) return 'human-portraits';
  if (/edit|inpaint|reference|retouch|variation/.test(s)) return 'image-editing-img2img';
  if (/3d|product|packaging|render|mockup|isometric/.test(s)) return '3d-design-product-vis';
  if (/marketing|commerce|poster|brand|campaign|thumbnail|social|advertis/.test(s)) return 'marketing-content-social';
  return 'ai-image-generation';
}

function toTags(record) {
  const rawTags = [record.category, ...(Array.isArray(record.styles) ? record.styles : [])]
    .map((v) => safeSlug(v))
    .filter(Boolean);
  return Array.from(new Set(['promptfeed', 'gpt-image-2', 'text-to-image', ...rawTags])).slice(0, 12);
}

function makePromptRecord(record, imageFile) {
  const sourceSlug = safeSlug(record.slug);
  const title = String(record.title || sourceSlug.replace(/-/g, ' ')).trim();
  const vars = Array.isArray(record.variables) ? record.variables : [];
  const placeholders = vars
    .map((v) => String(v?.name || '').trim())
    .filter(Boolean)
    .map((name) => name.startsWith('[') && name.endsWith(']') ? name : '[' + name + ']');
  const variableNotes = vars.map((v) => {
    const name = String(v?.name || 'Variable').trim();
    const detail = String(v?.description_en || v?.description || '').trim();
    const examples = Array.isArray(v?.examples) ? v.examples.filter(Boolean).join(', ') : '';
    return name + ': ' + [detail, examples ? 'Examples: ' + examples : ''].filter(Boolean).join(' ');
  });
  const styleLabel = Array.isArray(record.styles) && record.styles.length
    ? record.styles.join(', ')
    : 'AI-generated visual';
  const pageUrl = 'https://promptfeed.app/en/p/' + sourceSlug;
  const sourceUrl = isHttps(record?.source?.url) ? record.source.url : pageUrl;
  const creator = String(record?.source?.label || 'ClawLabs AI / PromptFeed').trim();
  const promptText = String(record.prompt || record.promptText || '').trim();

  return {
    id: 'promptfeed-' + sourceSlug,
    title,
    slug: 'promptfeed-' + sourceSlug,
    description: String(record.description || (styleLabel + ' image prompt; the preview is the corresponding output published with this prompt.')).trim(),
    category: categoryFor(record.category),
    targetModel: 'GPT Image 2',
    provider: 'OpenAI',
    promptText,
    tags: toTags(record),
    tips: vars.length
      ? 'This prompt was published with editable variables. Replace the bracketed placeholders with your own details before generating.'
      : 'This prompt and its matching generated preview are from the PromptFeed tested image-prompt collection.',
    authorOrSource: creator + ' · PromptFeed (MIT-licensed collection)',
    placeholders,
    customizationInstructions: variableNotes.length
      ? variableNotes.join('\n')
      : 'Adjust the subject, composition, style, and lighting to fit your use case.',
    expectedOutputType: styleLabel + ' image generated from the matching text prompt.',
    exampleUseCase: 'Visual exploration, mood boards, editorial concepts, and marketing creative experiments.',
    officialToolUrl: 'https://chatgpt.com/',
    previewImage: '/prompts/promptfeed/' + imageFile,
    previewImageAlt: title + ' — matching output preview from the PromptFeed image prompt.',
    visualStyle: styleLabel,
    attributionUrl: pageUrl,
    sourceUrl,
    sourceCreator: creator,
    rightsStatus: 'licensed',
    rightsLicense: 'MIT License — ' + repo + '; preserve the source copyright and license notice when redistributing.',
    mediaType: 'image',
    promptProvenance: 'verified-source',
    status: 'draft',
    rightsConfirmed: true,
  };
}

function validateImageBytes(bytes, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const info = inspectImage(bytes, ext);
  const allowed = { '.jpg': 'jpg', '.jpeg': 'jpg', '.png': 'png', '.webp': 'webp' };
  if (!allowed[ext] || info.format !== allowed[ext]) throw new Error('Image format does not match its file extension: ' + fileName);
  if (!info.width || !info.height || info.width > 12000 || info.height > 12000 || info.width * info.height > 60000000) {
    throw new Error('Image dimensions are invalid or exceed 60 megapixels: ' + fileName);
  }
  return info;
}

async function ensureImage(item, fileByName) {
  const slug = safeSlug(item.slug);
  if (!slug || slug !== item.slug) throw new Error('Invalid prompt slug: ' + String(item.slug));
  const candidates = ['.jpg', '.jpeg', '.png', '.webp'].map((ext) => slug + ext);
  const file = candidates.map((name) => fileByName.get(name)).find(Boolean);
  if (!file?.download_url) throw new Error('No matching preview image found for prompt slug: ' + slug);
  const destination = path.join(assetDir, file.name);
  await fs.mkdir(assetDir, { recursive: true });

  if (!force) {
    try {
      const existing = await fs.readFile(destination);
      if (existing.length > 0) {
        validateImageBytes(existing, file.name);
        return { fileName: file.name, bytes: existing, skipped: true };
      }
    } catch {}
  }

  const response = await fetchResponse(file.download_url);
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  if (!contentType.startsWith('image/')) throw new Error('Source did not return an image for ' + file.name + ' (' + contentType + ')');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > 10 * 1024 * 1024) throw new Error('Image is empty or over 10 MB: ' + file.name);
  validateImageBytes(bytes, file.name);
  const tempPath = destination + '.part';
  await fs.writeFile(tempPath, bytes);
  await fs.rename(tempPath, destination);
  return { fileName: file.name, bytes, skipped: false };
}

async function main() {
  console.log('Downloading the MIT-licensed PromptFeed prompt/image pairs from the official GitHub repository.');
  const [promptPayload, previewFiles, licenseResponse] = await Promise.all([
    fetchJson(promptsUrl),
    fetchJson(previewIndexUrl),
    fetchResponse(licenseUrl),
  ]);
  const records = Array.isArray(promptPayload) ? promptPayload : promptPayload.prompts;
  if (!Array.isArray(records) || records.length === 0) throw new Error('prompts.json does not contain a prompt array.');
  if (!Array.isArray(previewFiles)) throw new Error('GitHub preview index is not an array.');

  const fileByName = new Map(previewFiles.filter((f) => f.type === 'file').map((f) => [f.name, f]));
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.mkdir(path.dirname(licenseFile), { recursive: true });
  await fs.writeFile(licenseFile, await licenseResponse.text(), 'utf8');

  const normalized = new Array(records.length);
  let downloaded = 0;
  let reused = 0;
  let completed = 0;
  let next = 0;

  async function worker() {
    while (true) {
      const index = next++;
      if (index >= records.length) return;
      const record = records[index];
      try {
        if (!record || typeof record !== 'object' || !record.slug || !String(record.prompt || record.promptText || '').trim()) {
          throw new Error('Prompt record is missing its slug or prompt text.');
        }
        const image = await ensureImage(record, fileByName);
        normalized[index] = makePromptRecord(record, image.fileName);
        if (image.skipped) reused += 1;
        else downloaded += 1;
      } catch (error) {
        failures.push({ slug: record?.slug || 'entry-' + (index + 1), error: error.message });
      } finally {
        completed += 1;
        if (completed % 50 === 0 || completed === records.length) {
          console.log('Processed ' + completed + '/' + records.length + ' image/prompt pairs.');
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, records.length) }, () => worker()));
  const successful = normalized.filter(Boolean);
  await fs.writeFile(outputFile, JSON.stringify(successful, null, 2) + '\n', 'utf8');
  const summary = {
    sourceRepository: repo,
    license: 'MIT',
    sourcePromptCount: records.length,
    previewFilesListed: fileByName.size,
    successfulPairs: successful.length,
    imagesDownloaded: downloaded,
    existingImagesReused: reused,
    failedPairs: failures.length,
    outputFile: path.relative(root, outputFile),
    previewDirectory: path.relative(root, assetDir),
    licenseFile: path.relative(root, licenseFile),
    failures,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error('PromptFeed download failed: ' + error.message);
  process.exitCode = 1;
});
