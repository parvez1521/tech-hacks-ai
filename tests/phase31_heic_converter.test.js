import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { freeToolsData } from '../src/data/freeToolsData.ts';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('HEIC-to-PNG converter is registered, discoverable, locally processed, and build-locked', async () => {
  const tool = freeToolsData.find(({ slug }) => slug === 'heic-to-png');
  assert.ok(tool, 'The converter is included in the utility directory');
  assert.equal(tool.isClientSideOnly, true);
  assert.match(tool.acceptedInput, /HEIC or HEIF/i);
  assert.match(tool.outputFormat, /PNG/i);
  assert.match(tool.description, /not uploaded/i);
  assert.match(tool.description, /EXIF metadata/i);

  const runner = await read('../src/components/utilities/UtilityRunner.tsx');
  assert.match(runner, /case 'heic-to-png': return <module\.HeicToPngTool \/>/);
  assert.match(runner, /case 'heic-to-png':[\s\S]*?case 'image-cropper'/);

  const component = await read('../src/components/utilities/UtilityImageTools.tsx');
  assert.match(component, /await import\('heic2any'\)/);
  assert.match(component, /toType: 'image\/png'/);
  assert.match(component, /25 \* 1024 \* 1024/);
  assert.match(component, /EXIF details is not preserved/);
  assert.match(component, /No file upload/);

  const packageJson = JSON.parse(await read('../package.json'));
  assert.equal(packageJson.dependencies.heic2any, '0.0.4');
  const lock = JSON.parse(await read('../package-lock.json'));
  assert.equal(lock.packages['node_modules/heic2any'].version, '0.0.4');
  assert.equal(lock.packages['node_modules/heic2any'].license, 'MIT');
  assert.ok(lock.packages['']['dependencies'].heic2any);

  const sitemap = await read('../public/sitemap.xml');
  assert.match(sitemap, /https:\/\/switchroute\.in\/free-tools\/heic-to-png/);
});
