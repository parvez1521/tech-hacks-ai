import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';

const dataset = process.argv[2];
if (!dataset) {
  console.error('Usage: FAYMAS_IMPORT_AUTHORIZED=true npm run prompts:import:faymas -- <authorized-export.json> [--import]');
  process.exit(2);
}
if (process.env.FAYMAS_IMPORT_AUTHORIZED !== 'true' || !process.env.FAYMAS_PERMISSION_REFERENCE?.trim()) {
  console.error('Faymas import is disabled. Obtain written permission or an authorized export/API, set FAYMAS_IMPORT_AUTHORIZED=true and provide a FAYMAS_PERMISSION_REFERENCE before importing.');
  process.exit(3);
}

try {
  const parsed = JSON.parse(await fs.readFile(dataset, 'utf8'));
  const records = Array.isArray(parsed) ? parsed : parsed.prompts;
  if (!Array.isArray(records) || records.length === 0) throw new Error('The authorized export must contain a non-empty prompt array.');
  const invalid = records.findIndex((row) => {
    let sourceHost = '';
    try { sourceHost = new URL(row?.sourceUrl).hostname.toLowerCase(); } catch { return true; }
    return !['faymas.in', 'www.faymas.in'].includes(sourceHost) || !row.sourceCreator?.trim() || !row.rightsLicense?.trim() || !['licensed', 'permission-granted'].includes(row.rightsStatus) || row.rightsConfirmed !== true;
  });
  if (invalid >= 0) throw new Error(`Record ${invalid + 1} is missing a Faymas source URL, creator attribution, confirmed license or written permission.`);
} catch (error) {
  console.error(`Faymas export validation failed: ${error.message}`);
  process.exit(2);
}

const child = spawn(process.execPath, ['--experimental-strip-types', 'scripts/import-prompts.mjs', dataset, ...process.argv.slice(3)], { stdio: 'inherit', env: process.env });
child.on('error', (error) => { console.error(`Could not start authorized import: ${error.message}`); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
