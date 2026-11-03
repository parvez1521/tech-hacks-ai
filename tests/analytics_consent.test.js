import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('GA4 uses a denied default and loads only after explicit analytics opt-in', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<meta name="google-adsense-account" content="ca-pub-7627022109232156"/);
  assert.match(html, /analytics_storage: 'denied'/);
  assert.match(html, /ad_storage: 'denied'/);
  assert.match(html, /preferences\.analytics === true/);
  assert.match(html, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/);
  assert.match(html, /analytics_storage: granted \? 'granted' : 'denied'/);
  assert.match(html, /if \(!granted\) return/);
  assert.match(html, /!analyticsAllowed \|\| !preferences \|\| preferences\.analytics !== true/);
});

test('AdSense verification does not silently enable ad serving', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const config = await readFile(new URL('../src/config/site.ts', import.meta.url), 'utf8');
  assert.match(html, /AdSense site ownership verification only/);
  assert.doesNotMatch(html, /pagead2\.googlesyndication\.com\/pagead\/js/);
  assert.match(config, /VITE_ADSENSE_ENABLED/);
  assert.match(config, /VITE_ADSENSE_PRIVACY_READY/);
});
