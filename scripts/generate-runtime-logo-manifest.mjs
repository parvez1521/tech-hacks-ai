import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicManifestPath = path.join(root, 'public/logo-manifest.json');
const sourceRegistryPath = path.join(root, 'src/data/brandLogos.ts');
const outputPath = path.join(root, 'src/data/generated/brandLogos.runtime.json');
const runtimeFields = ['slug', 'name', 'assetPath', 'sourceType', 'sourceUrl', 'pngAssetPath'];
const sourceTypes = new Set(['official', 'provided', 'simple-icons', 'vector', 'fallback']);

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read valid ${label} at ${filePath}: ${error.message}`);
  }
}

function parseRegistry(source, declaration, label) {
  const match = source.match(declaration);
  if (!match) throw new Error(`Could not find ${label} in ${sourceRegistryPath}.`);
  try {
    return JSON.parse(match[1].replace(/,\s*([}\]])/g, '$1'));
  } catch (error) {
    throw new Error(`Could not parse ${label} in ${sourceRegistryPath}: ${error.message}`);
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const publicEntries = readJson(publicManifestPath, 'public logo manifest');
if (!Array.isArray(publicEntries) || publicEntries.length === 0) {
  throw new Error(`${publicManifestPath} must contain a non-empty array of logo records.`);
}

const registrySource = fs.readFileSync(sourceRegistryPath, 'utf8');
const sourceEntries = parseRegistry(
  registrySource,
  /export const brandLogos: Record<string, BrandLogoEntry> = (\{[\s\S]*?\n\});\n\nexport const SLUG_ALIASES/,
  'the canonical brand logo registry'
);
const aliases = parseRegistry(
  registrySource,
  /export const SLUG_ALIASES: Record<string, string> = (\{[\s\S]*?\n\});/,
  'the brand logo alias registry'
);

const manifestBySlug = new Map();
for (const entry of publicEntries) {
  if (!entry || typeof entry.slug !== 'string' || !entry.slug.trim()) {
    throw new Error(`${publicManifestPath} contains a logo entry with no slug.`);
  }
  if (manifestBySlug.has(entry.slug)) throw new Error(`${publicManifestPath} contains duplicate slug "${entry.slug}".`);
  if (typeof entry.name !== 'string' || !entry.name || typeof entry.assetPath !== 'string' || !entry.assetPath.startsWith('/logos/')) {
    throw new Error(`Logo "${entry.slug}" is missing its display name or valid /logos/ asset path.`);
  }
  if (!sourceTypes.has(entry.sourceType)) throw new Error(`Logo "${entry.slug}" has unsupported sourceType "${entry.sourceType}".`);
  if (entry.sourceUrl !== undefined && (typeof entry.sourceUrl !== 'string' || !/^https:\/\//.test(entry.sourceUrl))) {
    throw new Error(`Logo "${entry.slug}" has an invalid sourceUrl.`);
  }
  if (entry.pngAssetPath !== undefined && (typeof entry.pngAssetPath !== 'string' || !entry.pngAssetPath.startsWith('/logos/'))) {
    throw new Error(`Logo "${entry.slug}" has an invalid PNG fallback path.`);
  }
  manifestBySlug.set(entry.slug, entry);
}

const sourceSlugs = Object.keys(sourceEntries).sort();
const manifestSlugs = [...manifestBySlug.keys()].sort();
if (stableStringify(sourceSlugs) !== stableStringify(manifestSlugs)) {
  throw new Error('The public logo manifest and canonical TypeScript registry have different slug sets; synchronize them before generating runtime data.');
}
for (const slug of sourceSlugs) {
  if (stableStringify(sourceEntries[slug]) !== stableStringify(manifestBySlug.get(slug))) {
    throw new Error(`The public logo manifest and canonical TypeScript registry disagree for "${slug}"; synchronize them before generating runtime data.`);
  }
}
for (const [alias, target] of Object.entries(aliases)) {
  if (!alias.trim() || typeof target !== 'string' || !manifestBySlug.has(target)) {
    throw new Error(`Logo alias "${alias}" points to missing or invalid target "${target}".`);
  }
}

const entries = Object.fromEntries(publicEntries.map((entry) => [
  entry.slug,
  Object.fromEntries(runtimeFields.filter((field) => entry[field] !== undefined).map((field) => [field, entry[field]])),
]));
const runtimeManifest = { entries, aliases };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(runtimeManifest)}\n`);
console.log(`Generated runtime logo manifest for ${publicEntries.length} logos and ${Object.keys(aliases).length} aliases.`);
