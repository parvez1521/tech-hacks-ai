import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exportDir = path.join(root, 'exports', 'official-ai-logos');
const zipPath = path.join(root, 'exports', 'tech-hacks-ai-official-ai-logos.zip');
const publicAssetDir = path.join(root, 'public', 'logos', 'official-ai');
const registryPath = path.join(root, 'src', 'data', 'brandLogos.ts');
const publicManifestPath = path.join(root, 'public', 'logo-manifest.json');

// These files were supplied in the workspace after the bounded browser export.
// They are deliberately recorded as `provided`, not as direct web downloads.
const providedAssets = {
  deepseek: { file: 'DEEPSEEK LOGO.svg.webp', officialWebsite: 'https://chat.deepseek.com' },
  dreamina: { file: 'Dreamina.webp', officialWebsite: 'https://dreamina.capcut.com' },
  haiper: { file: 'Hapier AI.jpg', officialWebsite: 'https://haiper.ai' },
  'kokoro-tts': { file: 'KOKORO TTS.png', officialWebsite: 'https://huggingface.co/hexgrad/Kokoro-82M' },
  'ltx-video': { file: 'LTX.png', officialWebsite: 'https://github.com/Lightricks/LTX-Video' },
  'meshy-3d': { file: 'MESHY 3D.png', officialWebsite: 'https://www.meshy.ai' },
  'replit-agent': { file: 'replit-color.png', officialWebsite: 'https://replit.com' },
  whisper: { file: 'Whisper by OpenAI.png', officialWebsite: 'https://github.com/openai/whisper' },
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ',') {
      row.push(field);
      field = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...data] = rows;
  return data.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] || ''])));
}

function extensionFor(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  if (extension === '.jpeg') return '.jpg';
  return extension || '.bin';
}

function formatFor(fileName) {
  const extension = extensionFor(fileName).slice(1);
  if (extension === 'svg' || extension === 'png' || extension === 'webp' || extension === 'jpg') return extension;
  return 'favicon';
}

function writeAsset(slug, fileName, contents) {
  const destination = path.join(publicAssetDir, `${slug}${extensionFor(fileName)}`);
  fs.writeFileSync(destination, contents);
  return {
    assetPath: `/logos/official-ai/${path.basename(destination)}`,
    format: formatFor(fileName),
    sha256: crypto.createHash('sha256').update(contents).digest('hex'),
  };
}

const manifestRows = parseCsv(fs.readFileSync(path.join(exportDir, 'manifest.csv'), 'utf8'));
const directRows = manifestRows.filter((row) => row.source_type === 'official logo');
fs.mkdirSync(publicAssetDir, { recursive: true });

const records = new Map();
for (const row of directRows) {
  const contents = execFileSync('unzip', ['-p', zipPath, row.downloaded_filename]);
  const asset = writeAsset(row.canonical_slug, row.downloaded_filename, contents);
  records.set(row.canonical_slug, {
    ...asset,
    sourceType: 'official',
    sourceUrl: row.direct_asset_url,
    notes: `Browser-inspected official logo from ${row.source_page_url}. ${row.notes}`.trim(),
  });
}

for (const [slug, provided] of Object.entries(providedAssets)) {
  const sourcePath = path.join(exportDir, 'logos', provided.file);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing provided logo asset: ${sourcePath}`);
  const contents = fs.readFileSync(sourcePath);
  const asset = writeAsset(slug, provided.file, contents);
  records.set(slug, {
    ...asset,
    sourceType: 'provided',
    sourceUrl: provided.officialWebsite,
    notes: `Workspace-provided asset visually reviewed against the official page. Direct asset URL was not independently verified. SHA-256: ${asset.sha256}`,
  });
}

const registrySource = fs.readFileSync(registryPath, 'utf8');
const registryMatch = registrySource.match(/export const brandLogos: Record<string, BrandLogoEntry> = ([\s\S]*?)\n};\n\nexport const SLUG_ALIASES/);
if (!registryMatch) throw new Error('Could not locate the canonical brand logo registry object.');
const registry = JSON.parse(`${registryMatch[1].trim()}\n}`.replace(/,\s*([}\]])/g, '$1'));

for (const [slug, record] of records) {
  if (!registry[slug]) throw new Error(`Canonical registry is missing ${slug}.`);
  registry[slug] = {
    ...registry[slug],
    assetPath: record.assetPath,
    sourceType: record.sourceType,
    verifiedAt: '2026-10-21',
    format: record.format,
    sourceUrl: record.sourceUrl,
    notes: record.notes,
  };
  delete registry[slug].pngAssetPath;
}

const replacement = `export const brandLogos: Record<string, BrandLogoEntry> = ${JSON.stringify(registry, null, 2)};\n\nexport const SLUG_ALIASES`;
fs.writeFileSync(registryPath, registrySource.replace(registryMatch[0], replacement));
fs.writeFileSync(publicManifestPath, `${JSON.stringify(Object.values(registry), null, 2)}\n`);

const providedManifest = Object.entries(providedAssets).map(([slug, value]) => {
  const record = records.get(slug);
  return `${slug},${value.officialWebsite},${value.file},${record.sha256}`;
});
fs.writeFileSync(
  path.join(exportDir, 'provided-assets.csv'),
  `canonical_slug,official_website,workspace_filename,sha256\n${providedManifest.join('\n')}\n`,
);

console.log(`Integrated ${directRows.length} browser-exported official logos and ${Object.keys(providedAssets).length} workspace-provided assets.`);
