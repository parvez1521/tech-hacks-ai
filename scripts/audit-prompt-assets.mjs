import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { promptsData } from '../src/data/promptsData.ts';
import { promptArtwork } from '../src/data/promptArtwork.ts';
import { brandLogos, getBrandLogo } from '../src/data/brandLogos.ts';
import { toolsData } from '../src/data/seedData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');
const reportPath = path.join(root, 'docs', 'prompt-image-audit.json');

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

export function inspectImage(buffer, extension) {
  const ext = extension.toLowerCase().replace(/^\./, '');
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { format: 'png', width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    let offset = 12;
    while (offset + 8 <= buffer.length) {
      const kind = buffer.toString('ascii', offset, offset + 4);
      const size = buffer.readUInt32LE(offset + 4);
      const data = offset + 8;
      if (kind === 'VP8X' && data + 10 <= buffer.length) {
        return { format: 'webp', width: readUInt24LE(buffer, data + 4) + 1, height: readUInt24LE(buffer, data + 7) + 1 };
      }
      if (kind === 'VP8L' && data + 5 <= buffer.length && buffer[data] === 0x2f) {
        const b1 = buffer[data + 1]; const b2 = buffer[data + 2]; const b3 = buffer[data + 3]; const b4 = buffer[data + 4];
        return { format: 'webp', width: 1 + (((b2 & 0x3f) << 8) | b1), height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)) };
      }
      if (kind === 'VP8 ' && data + 10 <= buffer.length) {
        const frame = data + 3;
        if (buffer[frame] === 0x9d && buffer[frame + 1] === 0x01 && buffer[frame + 2] === 0x2a) {
          return { format: 'webp', width: buffer.readUInt16LE(frame + 3) & 0x3fff, height: buffer.readUInt16LE(frame + 5) & 0x3fff };
        }
      }
      offset = data + size + (size % 2);
    }
    return { format: 'webp', width: null, height: null };
  }
  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { format: 'jpg', height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      if (length < 2) break;
      offset += 2 + length;
    }
    return { format: 'jpg', width: null, height: null };
  }
  const text = buffer.toString('utf8', 0, Math.min(buffer.length, 8192));
  if (/<svg\b/i.test(text)) {
    const viewBox = text.match(/\bviewBox=["']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
    const width = text.match(/\bwidth=["']([\d.]+)(?:px)?["']/i);
    const height = text.match(/\bheight=["']([\d.]+)(?:px)?["']/i);
    return { format: 'svg', width: Number(viewBox?.[1] || width?.[1]) || null, height: Number(viewBox?.[2] || height?.[1]) || null };
  }
  if (buffer.length >= 10 && buffer.toString('ascii', 0, 3) === 'GIF') return { format: 'gif', width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  return { format: 'unknown', width: null, height: null };
}

function inspectFile(assetPath) {
  const absolutePath = path.join(publicRoot, assetPath.replace(/^\//, ''));
  if (!assetPath.startsWith('/')) return { available: false, actualFormat: 'invalid-path', width: null, height: null, sizeBytes: null, sha256: null };
  if (!fs.existsSync(absolutePath)) return { available: false, actualFormat: 'missing', width: null, height: null, sizeBytes: null, sha256: null };
  const buffer = fs.readFileSync(absolutePath);
  const parsed = inspectImage(buffer, path.extname(absolutePath));
  return {
    available: true,
    actualFormat: parsed.format,
    width: parsed.width,
    height: parsed.height,
    sizeBytes: buffer.length,
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
    extensionMatchesContent: path.extname(absolutePath).slice(1).toLowerCase().replace('jpeg', 'jpg') === parsed.format,
  };
}

async function checkRemoteSources(entries) {
  const records = entries.filter((entry) => entry.sourceUrl);
  let cursor = 0;
  const results = new Map();
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (cursor < records.length) {
      const entry = records[cursor++];
      try {
        const response = await fetch(entry.sourceUrl, { method: 'HEAD', signal: AbortSignal.timeout(10000), redirect: 'follow' });
        results.set(entry.slug, { status: response.status, outcome: response.ok ? 'responded' : response.status === 404 || response.status === 410 ? 'not-found' : 'inconclusive' });
      } catch (error) {
        results.set(entry.slug, { outcome: 'inconclusive', error: error.name || 'network-error' });
      }
    }
  }));
  return results;
}

export async function buildAudit({ checkRemote = false } = {}) {
  const prompts = promptsData.map((prompt) => {
    const artwork = promptArtwork[prompt.slug];
    const asset = inspectFile(artwork?.path || '');
    return {
      slug: prompt.slug,
      title: prompt.title,
      imagePath: artwork?.path || null,
      dimensions: { width: asset.width, height: asset.height },
      actualFileType: asset.actualFormat,
      imageAvailable: asset.available,
      sizeBytes: asset.sizeBytes,
      sha256: asset.sha256,
      extensionMatchesContent: asset.extensionMatchesContent ?? false,
      altText: artwork?.alt || null,
      visualDescription: artwork?.description || null,
      provenance: {
        sourceType: 'original-ai-generated',
        provider: 'Codex built-in image_gen',
        createdFor: 'Tech Hacks AI',
        rightsStatus: 'Original preview generated for this project; no third-party gallery image used.',
      },
    };
  });

  const promptBySha = new Map();
  const duplicateImages = [];
  for (const prompt of prompts) {
    if (!prompt.sha256) continue;
    const previous = promptBySha.get(prompt.sha256);
    if (previous) duplicateImages.push({ imagePath: prompt.imagePath, prompts: [previous, prompt.slug] });
    else promptBySha.set(prompt.sha256, prompt.slug);
  }

  const logoEntries = Object.values(brandLogos).map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    assetPath: entry.assetPath,
    sourceType: entry.sourceType,
    sourceUrl: entry.sourceUrl || null,
    verifiedAt: entry.verifiedAt,
    notes: entry.notes || null,
    ...inspectFile(entry.assetPath),
    provenanceComplete: Boolean(entry.sourceUrl || entry.sourceType === 'fallback'),
  }));
  const remote = checkRemote ? await checkRemoteSources(logoEntries) : null;
  if (remote) for (const entry of logoEntries) entry.remoteSourceCheck = remote.get(entry.slug) || { outcome: 'not-checked' };

  const sourceCounts = Object.groupBy ? Object.groupBy(logoEntries, (entry) => entry.sourceType) : logoEntries.reduce((groups, entry) => ((groups[entry.sourceType] ||= []).push(entry), groups), {});
  const issues = [];
  const unresolvedLogoSources = logoEntries.filter((entry) => entry.sourceType === 'fallback' && entry.notes?.startsWith('Verification gap:'));
  const activeCatalog = [...new Map([...toolsData, ...aiToolsData, ...proprietaryTools].map((tool) => [tool.slug, tool])).values()];
  const activeFallbacks = activeCatalog.filter((tool) => getBrandLogo(tool.slug)?.sourceType === 'fallback');
  for (const prompt of prompts) {
    if (!prompt.imageAvailable) issues.push({ type: 'missing-prompt-image', slug: prompt.slug, imagePath: prompt.imagePath });
    if (!prompt.extensionMatchesContent) issues.push({ type: 'invalid-prompt-image-signature', slug: prompt.slug, imagePath: prompt.imagePath });
    if (!prompt.altText || prompt.altText.length < 20) issues.push({ type: 'missing-or-short-alt-text', slug: prompt.slug });
    if (prompt.sizeBytes > 1_500_000) issues.push({ type: 'large-prompt-image', slug: prompt.slug, sizeBytes: prompt.sizeBytes });
  }
  for (const logo of logoEntries) {
    if (!logo.available || !logo.extensionMatchesContent) issues.push({ type: 'logo-asset-integrity', slug: logo.slug, imagePath: logo.assetPath, available: logo.available, actualFileType: logo.actualFormat });
  }

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      promptCount: prompts.length,
      originalGeneratedImages: prompts.filter((prompt) => prompt.provenance.sourceType === 'original-ai-generated').length,
      duplicatePromptImages: duplicateImages.length,
      missingPromptImages: prompts.filter((prompt) => !prompt.imageAvailable).length,
      logoCount: logoEntries.length,
      logoSourcesByType: Object.fromEntries(Object.entries(sourceCounts).map(([key, entries]) => [key, entries.length])),
      logosWithoutRecordedSource: logoEntries.filter((entry) => !entry.provenanceComplete).length,
      unresolvedLogoSources: unresolvedLogoSources.length,
      activeCatalogIdentities: activeCatalog.length,
      activeCatalogFallbacks: activeFallbacks.length,
      activeCatalogVerificationGaps: activeFallbacks.filter((tool) => getBrandLogo(tool.slug)?.notes?.startsWith('Verification gap:')).length,
      integrityIssues: issues.length,
      remoteSourceChecksPerformed: Boolean(checkRemote),
      meigenAssetsUsed: false,
    },
    duplicateImages,
    prompts,
    logos: logoEntries,
    unresolvedLogoSources: unresolvedLogoSources.map((entry) => ({ slug: entry.slug, name: entry.name, assetPath: entry.assetPath, note: entry.notes })),
    activeCatalogFallbacks: activeFallbacks.map((tool) => ({ slug: tool.slug, name: tool.name, sourceUrl: getBrandLogo(tool.slug)?.sourceUrl || null, note: getBrandLogo(tool.slug)?.notes || null })),
    issues,
  };
}

const args = new Set(process.argv.slice(2));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const audit = await buildAudit({ checkRemote: args.has('--check-remote') });
  if (args.has('--write')) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(audit, null, 2)}\n`);
    console.log(`Wrote ${reportPath}`);
  }
  console.log(JSON.stringify(audit.summary, null, 2));
  if (args.has('--check') && audit.issues.length) process.exitCode = 1;
}
