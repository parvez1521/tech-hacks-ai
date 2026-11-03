import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('api/prompt-stats.js', 'utf8');

test('optional prompt copy-stat reads return an empty successful response when storage fails', () => {
  const start = source.indexOf("if (req.method === 'GET')");
  const end = source.indexOf("if (req.method !== 'POST')", start);
  assert.ok(start >= 0 && end > start, 'Expected separate GET and POST handlers');
  const getHandler = source.slice(start, end);
  assert.match(getHandler, /Promise\.all\(\[getPromptCopyStats\(\), listPrompts\(\{ admin: false \}\)\]\)/);
  assert.match(getHandler, /catch\s*\{[\s\S]*?return res\.status\(200\)\.json\(\{ stats: \[\] \}\)/);
});

test('prompt-copy writes retain their own validation and explicit storage result', () => {
  assert.match(source, /if \(req\.method !== 'POST'\)/);
  assert.match(source, /recordPromptCopy\(slug\)/);
  assert.match(source, /res\.status\(result\.status\)\.json\(result\)/);
});
