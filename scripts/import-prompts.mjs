import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { fileURLToPath } from 'node:url';
import { promptsData } from '../src/data/promptsData.ts';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputFile = process.argv[2];
const shouldImport = process.argv.includes('--import');
const errors = [];

if (!inputFile || inputFile.startsWith('--')) {
  console.error('Usage: node --experimental-strip-types scripts/import-prompts.mjs <authorized-prompts.json> [--import]');
  process.exit(2);
}

function fingerprint(text) { return createHash('sha256').update(String(text).toLowerCase().replace(/\s+/g, ' ').trim()).digest('hex'); }

async function validateImage(image) {
  if (!image) return 'Preview image is required.';
  if (image.startsWith('/prompts/')) {
    const localFile = path.resolve(projectRoot, 'public', `.${image}`);
    if (!localFile.startsWith(path.join(projectRoot, 'public', 'prompts') + path.sep)) return 'Local preview path must stay inside public/prompts.';
    try {
      const stat = await fs.stat(localFile);
      if (!stat.isFile() || stat.size > 10 * 1024 * 1024) return 'Local preview must be a file smaller than 10 MB.';
      const bytes = await fs.readFile(localFile);
      const sig = bytes.subarray(0, 12).toString('hex');
      const ext = path.extname(localFile).toLowerCase();
      const validFormat = ext === '.svg'
        ? /^\s*(?:<\?xml[^>]*>\s*)?<svg(?:\s|>)/i.test(bytes.subarray(0, 1024).toString('utf8'))
        : ext === '.png' ? sig.startsWith('89504e470d0a1a0a')
          : ext === '.jpg' || ext === '.jpeg' ? sig.startsWith('ffd8ff')
            : ext === '.webp' ? sig.startsWith('52494646') && sig.slice(16, 24) === '57454250' : false;
      return validFormat ? null : 'Local preview extension does not match a valid SVG, PNG, JPEG, or WebP image.';
    } catch { return 'Local preview file does not exist.'; }
  }
  let url;
  try { url = new URL(image); } catch { return 'Preview image URL is invalid.'; }
  if (url.protocol !== 'https:') return 'Remote preview images must use HTTPS.';
  const hostname = url.hostname.toLowerCase();
  if (isIP(hostname) || hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) return 'Preview image host must be a public domain name.';
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000), redirect: 'error' });
    if (!response.ok) return `Preview image check returned HTTP ${response.status}.`;
    if (!response.headers.get('content-type')?.toLowerCase().startsWith('image/')) return 'Remote preview URL does not return an image content type.';
    const length = Number(response.headers.get('content-length') || 0);
    if (!length) return 'Remote preview must provide Content-Length so its size can be validated.';
    if (length > 10 * 1024 * 1024) return 'Remote preview image exceeds the 10 MB limit.';
    return null;
  } catch { return 'Remote preview could not be validated. Check that the authorized source is reachable.'; }
}

let entries;
try {
  const raw = JSON.parse(await fs.readFile(path.resolve(inputFile), 'utf8'));
  entries = Array.isArray(raw) ? raw : raw.prompts;
  if (!Array.isArray(entries)) throw new Error('The JSON file must contain an array or a {"prompts": [...]} object.');
} catch (error) {
  console.error(`Could not read import file: ${error.message}`);
  process.exit(2);
}

const existingSlugs = new Set(promptsData.map((p) => p.slug));
const existingPrompts = new Set(promptsData.map((p) => fingerprint(p.promptText)));
const seenSlugs = new Set();
const seenPrompts = new Set();
const valid = [];
let duplicateCount = 0;

for (const [index, prompt] of entries.entries()) {
  const rowErrors = [];
  const slug = String(prompt?.slug || '').trim();
  const text = String(prompt?.promptText || '').trim();
  if (!prompt || typeof prompt !== 'object' || Array.isArray(prompt)) rowErrors.push('Entry must be an object.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) rowErrors.push('Slug must use lowercase letters, numbers, and hyphens.');
  for (const field of ['title', 'description', 'category', 'targetModel', 'promptText', 'authorOrSource']) if (typeof prompt?.[field] !== 'string' || !prompt[field].trim()) rowErrors.push(`${field} is required.`);
  if (!Array.isArray(prompt?.tags) || prompt.tags.some((tag) => typeof tag !== 'string')) rowErrors.push('Tags must be an array of strings.');
  if (prompt?.rightsConfirmed !== true) rowErrors.push('Set rightsConfirmed: true only after confirming permission to use the prompt and preview image.');
  if (prompt?.attributionUrl && !/^https:\/\//i.test(prompt.attributionUrl)) rowErrors.push('Attribution URL must use HTTPS.');
  if ((existingSlugs.has(slug) || seenSlugs.has(slug)) || (text && (existingPrompts.has(fingerprint(text)) || seenPrompts.has(fingerprint(text))))) {
    duplicateCount += 1;
    errors.push({ entry: index + 1, slug, errors: ['Duplicate slug or prompt text; this item was skipped.'] });
    continue;
  }
  const imageError = await validateImage(prompt?.previewImage);
  if (imageError) rowErrors.push(imageError);
  if (rowErrors.length) { errors.push({ entry: index + 1, slug, errors: rowErrors }); continue; }
  seenSlugs.add(slug); seenPrompts.add(fingerprint(text));
  const { rightsConfirmed, ...cleanPrompt } = prompt;
  valid.push({ ...cleanPrompt, id: String(prompt.id || `import-${slug}`), promptText: text, status: 'draft' });
}

let importedCount = 0;
if (shouldImport && valid.length) {
  const endpoint = process.env.PROMPT_IMPORT_URL;
  const secret = process.env.ADMIN_SECRET;
  if (!endpoint || !secret) errors.push({ entry: 'import', errors: ['Set PROMPT_IMPORT_URL and ADMIN_SECRET in the local environment before using --import.'] });
  else {
    for (const prompt of valid) {
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, status: 'draft' }) });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          errors.push({ entry: prompt.slug, errors: [result.error || `Import endpoint returned HTTP ${response.status}.`] });
        } else importedCount += 1;
      } catch { errors.push({ entry: prompt.slug, errors: ['Import endpoint could not be reached.'] }); }
    }
  }
}

console.log(JSON.stringify({ checked: entries.length, valid: valid.length, duplicates: duplicateCount, imported: importedCount, errors }, null, 2));
if (errors.length) process.exitCode = 1;
