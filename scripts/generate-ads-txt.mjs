import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'dist', 'ads.txt');
const publisherId = String(process.env.VITE_ADSENSE_PUBLISHER_ID || '').trim();

if (!publisherId) {
  // Vite copies public/ads.txt into dist before this script runs. Preserve an existing
  // owner-verified seller record instead of deleting it when the optional env var is unset.
  const existing = await fs.stat(outputPath).catch(() => null);
  if (existing) {
    console.log('[ads.txt] Preserving the existing public/ads.txt publisher record.');
  } else {
    const publicAdsTxt = path.join(root, 'public', 'ads.txt');
    await fs.copyFile(publicAdsTxt, outputPath).catch(() => {});
    console.log('[ads.txt] No publisher env var configured; kept existing public record if present.');
  }
} else if (!/^ca-pub-\d{16}$/.test(publisherId)) {
  throw new Error('[ads.txt] VITE_ADSENSE_PUBLISHER_ID must be the genuine ca-pub- ID with 16 digits.');
} else {
  const sellerId = publisherId.replace(/^ca-/, '');
  await fs.writeFile(outputPath, 'google.com, ' + sellerId + ', DIRECT, f08c47fec0942fa0\n', 'utf8');
  console.log('[ads.txt] Generated from the configured AdSense publisher ID.');
}
