#!/usr/bin/env node

import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { aiToolsData } from '../src/data/aiToolsData.ts';
import { getBrandLogo } from '../src/data/brandLogos.ts';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const EXPORT_DIR = path.join(PROJECT_ROOT, 'exports');
const ZIP_PATH = path.join(EXPORT_DIR, 'tech-hacks-ai-all-ai-logos.zip');
const JSON_PATH = path.join(EXPORT_DIR, 'tech-hacks-ai-all-ai-logos.manifest.json');
const UNRESOLVED_PATH = path.join(EXPORT_DIR, 'tech-hacks-ai-all-ai-logos-unresolved.csv');
const STAGING_DIR = path.join(EXPORT_DIR, `.tech-hacks-ai-all-ai-logos-staging-${process.pid}`);
const LOGOS_DIR = path.join(STAGING_DIR, 'logos');

const MAX_DOWNLOAD_BYTES = 2 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;
const USER_AGENT = 'Tech-Hacks-AI-logo-export/1.0 (+https://techhacksai.com)';

const MANIFEST_COLUMNS = [
  'tool_name',
  'canonical_slug',
  'original_logo_source',
  'downloaded_filename',
  'file_format',
  'source_type',
  'verification_status',
  'download_status',
  'notes',
];

function uniqueCatalogTools() {
  const bySlug = new Map();
  for (const tool of aiToolsData) {
    if (!tool?.slug || bySlug.has(tool.slug)) continue;
    bySlug.set(tool.slug, tool);
  }
  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

function safeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unresolved-logo';
}

function extensionFromPath(filePath) {
  const extension = path.extname(filePath || '').toLowerCase().replace('.', '');
  return extension === 'jpeg' ? 'jpg' : extension;
}

function formatFromBytes(bytes, fallbackExtension = '') {
  if (!bytes || bytes.length === 0) return null;
  const text = bytes.subarray(0, Math.min(bytes.length, 4096)).toString('utf8').trimStart();
  if (/^<svg[\s>]/i.test(text) && /<\/svg\s*>/i.test(text)) return 'svg';
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  if (bytes.length >= 4 && bytes.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0x00]))) return 'ico';
  if (bytes.length >= 3 && bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'jpg';
  if (bytes.length >= 6 && (bytes.subarray(0, 6).toString('ascii') === 'GIF87a' || bytes.subarray(0, 6).toString('ascii') === 'GIF89a')) return 'gif';
  return ['svg', 'png', 'webp', 'ico', 'jpg', 'gif'].includes(fallbackExtension) ? fallbackExtension : null;
}

function looksLikeHtml(bytes, contentType = '') {
  const prefix = bytes.subarray(0, Math.min(bytes.length, 2048)).toString('utf8').trimStart().toLowerCase();
  return /text\/html|application\/xhtml/i.test(contentType) || /^<!doctype html|^<html[\s>]|<body[\s>]/i.test(prefix);
}

function validateBytes(bytes, expectedFormat, label) {
  if (!bytes || bytes.length === 0) throw new Error(`${label}: empty response`);
  if (bytes.length > MAX_DOWNLOAD_BYTES) throw new Error(`${label}: file exceeds ${MAX_DOWNLOAD_BYTES} byte export limit`);
  if (looksLikeHtml(bytes)) throw new Error(`${label}: response looks like HTML, not a logo file`);
  const format = formatFromBytes(bytes, expectedFormat);
  if (!format) throw new Error(`${label}: unsupported or invalid image signature`);
  if (format === 'svg') {
    const svg = bytes.toString('utf8');
    if (!/<svg[\s>]/i.test(svg) || !/<\/svg\s*>/i.test(svg)) throw new Error(`${label}: invalid SVG structure`);
    if (/<script[\s>]/i.test(svg) || /<iframe[\s>]/i.test(svg)) throw new Error(`${label}: SVG contains executable/embed content`);
  }
  return format;
}

function registrySource(entry) {
  return entry?.sourceUrl || (entry?.assetPath ? `local:${entry.assetPath}` : '');
}

function localAssetPath(entry) {
  if (!entry?.assetPath || !entry.assetPath.startsWith('/')) return null;
  const relative = entry.assetPath.replace(/^\/+/, '');
  const absolute = path.resolve(PUBLIC_DIR, relative);
  if (!absolute.startsWith(`${PUBLIC_DIR}${path.sep}`)) return null;
  return absolute;
}

function localSourceType(entry) {
  return entry?.sourceType === 'fallback' ? 'favicon fallback' : 'local asset';
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows, columns = MANIFEST_COLUMNS) {
  return [columns.join(','), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(','))].join('\n') + '\n';
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchBytes(url) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'image/svg+xml,image/png,image/webp,image/x-icon,image/*;q=0.8,*/*;q=0.1' },
        redirect: 'follow',
        signal: controller.signal,
      });
      const contentLength = Number(response.headers.get('content-length'));
      if (Number.isFinite(contentLength) && contentLength > MAX_DOWNLOAD_BYTES) throw new Error(`response exceeds ${MAX_DOWNLOAD_BYTES} byte export limit`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      return { bytes, contentType: response.headers.get('content-type') || '', finalUrl: response.url || url };
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) await sleep(250 * (attempt + 1));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError || new Error('download failed');
}

async function discoverFaviconUrl(websiteUrl) {
  let website;
  try {
    website = new URL(websiteUrl);
  } catch {
    return null;
  }
  const faviconUrl = new URL('/favicon.ico', website).toString();
  try {
    const favicon = await fetchBytes(faviconUrl);
    validateBytes(favicon.bytes, 'ico', faviconUrl);
    return faviconUrl;
  } catch {
    // Continue to the site's declared icon link below.
  }
  try {
    const page = await fetchBytes(website.toString());
    if (looksLikeHtml(page.bytes, page.contentType)) {
      const html = page.bytes.toString('utf8');
      const match = html.match(/<link[^>]+rel=["'][^"']*(?:icon|apple-touch-icon)[^"']*["'][^>]+href=["']([^"']+)["']/i)
        || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*(?:icon|apple-touch-icon)[^"']*["']/i);
      if (match?.[1]) return new URL(match[1], website).toString();
    }
  } catch {
    return null;
  }
  return null;
}

async function externalCandidates(tool, entry) {
  const candidates = [];
  if (entry?.sourceUrl && /\.(?:svg|png|webp|ico|jpg|jpeg)(?:[?#].*)?$/i.test(entry.sourceUrl) && entry.sourceType !== 'fallback') {
    candidates.push({ url: entry.sourceUrl, sourceType: 'official logo', originalSource: entry.sourceUrl });
  }
  const faviconUrl = await discoverFaviconUrl(tool.websiteUrl);
  if (faviconUrl) candidates.push({ url: faviconUrl, sourceType: 'favicon fallback', originalSource: faviconUrl });
  return candidates;
}

async function resolveTool(tool) {
  const entry = getBrandLogo(tool.slug);
  const result = {
    tool_name: tool.name,
    canonical_slug: tool.slug,
    original_logo_source: registrySource(entry),
    downloaded_filename: '',
    file_format: '',
    source_type: '',
    verification_status: 'unresolved',
    download_status: 'unresolved',
    notes: '',
    _bytes: null,
    _hash: '',
  };

  const localPath = localAssetPath(entry);
  if (localPath && fs.existsSync(localPath)) {
    try {
      const bytes = fs.readFileSync(localPath);
      const format = validateBytes(bytes, extensionFromPath(localPath), localPath);
      result._bytes = bytes;
      result._hash = sha256(bytes);
      result.file_format = format;
      result.source_type = localSourceType(entry);
      result.download_status = 'reused-local';
      result.verification_status = entry?.sourceType === 'fallback'
        ? 'registry favicon fallback; file signature validated'
        : entry?.sourceUrl
          ? `registry-mapped ${entry.sourceType}; file signature validated`
          : `registry-mapped ${entry?.sourceType || 'unknown'}; file signature validated; source URL not recorded`;
      result.original_logo_source = registrySource(entry);
      result.notes = entry?.notes || '';
      return result;
    } catch (error) {
      result.notes = `Local asset rejected: ${error instanceof Error ? error.message : String(error)}`;
    }
  } else if (!entry) {
    result.notes = 'No canonical BrandLogo registry entry or local asset was found.';
  } else if (!localPath) {
    result.notes = 'Registry asset path is not a safe public-local path.';
  } else {
    result.notes = 'Registry asset file is missing from public/logos.';
  }

  try {
    const candidates = await externalCandidates(tool, entry);
    for (const candidate of candidates) {
      try {
        const response = await fetchBytes(candidate.url);
        const format = validateBytes(response.bytes, extensionFromPath(new URL(candidate.url).pathname), candidate.url);
        result._bytes = response.bytes;
        result._hash = sha256(response.bytes);
        result.file_format = format;
        result.source_type = candidate.sourceType;
        result.original_logo_source = candidate.originalSource;
        result.verification_status = `${candidate.sourceType} response validated; visual identity requires review`;
        result.download_status = 'downloaded';
        result.notes = result.notes ? `${result.notes} External fallback used.` : '';
        return result;
      } catch (error) {
        result.notes = `${result.notes ? `${result.notes} ` : ''}${candidate.url}: ${error instanceof Error ? error.message : String(error)}`.trim();
      }
    }
  } catch (error) {
    result.notes = `${result.notes ? `${result.notes} ` : ''}External lookup failed: ${error instanceof Error ? error.message : String(error)}`.trim();
  }

  return result;
}

function addDuplicateNotes(rows) {
  const byHash = new Map();
  for (const row of rows) {
    if (!row._hash) continue;
    const group = byHash.get(row._hash) || [];
    group.push(row);
    byHash.set(row._hash, group);
  }
  const duplicateGroups = [];
  for (const [hash, group] of byHash) {
    if (group.length < 2) continue;
    const slugs = group.map((row) => row.canonical_slug);
    duplicateGroups.push({ sha256: hash, canonical_slugs: slugs });
    for (const row of group) {
      row.notes = `${row.notes ? `${row.notes} ` : ''}Suspected duplicate content with: ${slugs.filter((slug) => slug !== row.canonical_slug).join(', ')}.`.trim();
    }
  }
  return duplicateGroups;
}

function publicRow(row) {
  const copy = { ...row };
  delete copy._bytes;
  delete copy._hash;
  return copy;
}

function writeReadme(rows, duplicateGroups, generatedAt) {
  const successful = rows.filter((row) => row.download_status !== 'unresolved');
  const local = rows.filter((row) => row.download_status === 'reused-local');
  const officialDownloads = rows.filter((row) => row.download_status === 'downloaded' && row.source_type === 'official logo');
  const faviconFallbacks = rows.filter((row) => row.source_type === 'favicon fallback');
  const unresolved = rows.filter((row) => row.download_status === 'unresolved');
  const lines = [
    'TECH HACKS AI — AI TOOL LOGO EXPORT',
    '',
    `Date of export: ${generatedAt}`,
    `Unique AI tools discovered: ${rows.length}`,
    `Logos successfully collected: ${successful.length}`,
    `Existing local assets reused: ${local.length}`,
    `Downloaded from official sources: ${officialDownloads.length}`,
    `Favicon fallbacks: ${faviconFallbacks.length}`,
    `Unresolved or failed: ${unresolved.length}`,
    `Suspected duplicate content groups: ${duplicateGroups.length}`,
    '',
    'SOURCE AND LICENSING NOTES',
    '- The source of truth was src/data/aiToolsData.ts, deduplicated by canonical tool slug.',
    '- Community Tools, Utility Tools, and unrelated catalog sections were excluded.',
    '- Existing public/logo registry assets were copied into this archive; source project logos were not modified.',
    '- Registry source URLs and source types are preserved in manifest.csv and the JSON manifest.',
    '- Simple Icons assets may be subject to the Simple Icons license and the relevant brand terms.',
    '- Official brand marks and website favicons may have separate trademark or usage terms; inspect before redistribution.',
    '- Automated validation checked file signatures, size, HTML masquerading, and basic SVG structure.',
    '- File existence and automated validation do not prove visual brand correctness; suspected duplicate or unresolved entries are listed separately.',
    '',
    'UNRESOLVED TOOLS',
    ...(unresolved.length ? unresolved.map((row) => `- ${row.tool_name} (${row.canonical_slug}): ${row.notes}`) : ['- None.']),
    '',
    'ARCHIVE CONTENTS',
    '- logos/ — one validated logo file per successfully collected canonical AI tool.',
    '- manifest.csv — one row per discovered AI tool, including unresolved entries.',
    '- README.txt — this export note.',
  ];
  return `${lines.join('\n')}\n`;
}

function writeJsonManifest(rows, duplicateGroups, generatedAt) {
  const successful = rows.filter((row) => row.download_status !== 'unresolved');
  const payload = {
    generated_at: generatedAt,
    source_catalog: 'src/data/aiToolsData.ts',
    unique_ai_tool_count: rows.length,
    successful_logo_count: successful.length,
    unresolved_count: rows.filter((row) => row.download_status === 'unresolved').length,
    existing_local_assets_reused: rows.filter((row) => row.download_status === 'reused-local').length,
    official_source_downloads: rows.filter((row) => row.download_status === 'downloaded' && row.source_type === 'official logo').length,
    favicon_fallbacks: rows.filter((row) => row.source_type === 'favicon fallback').length,
    suspected_duplicate_groups: duplicateGroups,
    entries: rows.map(publicRow),
  };
  fs.writeFileSync(JSON_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  const generatedAt = new Date().toISOString();
  const tools = uniqueCatalogTools();
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  fs.mkdirSync(LOGOS_DIR, { recursive: true });

  const rows = [];
  for (const tool of tools) {
    // Local assets are resolved first. External lookups run only when a local
    // registry asset is missing or fails validation.
    rows.push(await resolveTool(tool));
  }

  const duplicateGroups = addDuplicateNotes(rows);
  for (const row of rows) {
    if (!row._bytes || row.download_status === 'unresolved') continue;
    const filename = `logos/${safeSlug(row.canonical_slug)}.${row.file_format}`;
    const outputPath = path.join(STAGING_DIR, filename);
    fs.writeFileSync(outputPath, row._bytes);
    row.downloaded_filename = filename;
    validateBytes(row._bytes, row.file_format, outputPath);
  }

  const publicRows = rows.map(publicRow);
  const manifestCsv = toCsv(publicRows);
  const unresolvedRows = publicRows.filter((row) => row.download_status === 'unresolved');
  const unresolvedColumns = ['tool_name', 'canonical_slug', 'original_logo_source', 'notes'];
  fs.writeFileSync(path.join(STAGING_DIR, 'manifest.csv'), manifestCsv, 'utf8');
  fs.writeFileSync(path.join(STAGING_DIR, 'README.txt'), writeReadme(rows, duplicateGroups, generatedAt), 'utf8');
  fs.writeFileSync(path.join(STAGING_DIR, 'unresolved.csv'), toCsv(unresolvedRows, unresolvedColumns), 'utf8');
  writeJsonManifest(rows, duplicateGroups, generatedAt);
  fs.writeFileSync(UNRESOLVED_PATH, toCsv(unresolvedRows, unresolvedColumns), 'utf8');

  if (fs.existsSync(ZIP_PATH)) fs.rmSync(ZIP_PATH, { force: true });
  execFileSync('zip', ['-q', '-r', ZIP_PATH, 'logos', 'manifest.csv', 'README.txt', 'unresolved.csv'], { cwd: STAGING_DIR });
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });

  const successful = publicRows.filter((row) => row.download_status !== 'unresolved');
  const stats = {
    uniqueAiTools: publicRows.length,
    successfulLogos: successful.length,
    unresolved: unresolvedRows.length,
    localAssetsReused: publicRows.filter((row) => row.download_status === 'reused-local').length,
    officialDownloads: publicRows.filter((row) => row.download_status === 'downloaded' && row.source_type === 'official logo').length,
    faviconFallbacks: publicRows.filter((row) => row.source_type === 'favicon fallback').length,
    suspectedDuplicateGroups: duplicateGroups.length,
    zipPath: ZIP_PATH,
    zipBytes: fs.statSync(ZIP_PATH).size,
    jsonManifestPath: JSON_PATH,
    unresolvedPath: UNRESOLVED_PATH,
  };
  console.log(JSON.stringify(stats, null, 2));
  for (const row of unresolvedRows) console.log(`UNRESOLVED\t${row.canonical_slug}\t${row.notes}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
