import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'dist', 'ads.txt');
const publisherId = String(process.env.VITE_ADSENSE_PUBLISHER_ID || '').trim();

if (!publisherId) {
  await fs.rm(outputPath, { force: true });
  console.log('[ads.txt] No AdSense publisher ID configured; skipping ads.txt generation.');
} else if (!/^ca-pub-\d{16}$/.test(publisherId)) {
  throw new Error('[ads.txt] VITE_ADSENSE_PUBLISHER_ID must be the real ca-pub- followed by 16 digits from AdSense.');
} else {
  const sellerId = publisherId.replace(/^ca-/, '');
  const content = 'google.com, ' + sellerId + ', DIRECT, f08c47fec0942fa0\n';
  await fs.writeFile(outputPath, content, 'utf8');
  console.log('[ads.txt] Generated dist/ads.txt from the configured AdSense publisher ID.');
}
