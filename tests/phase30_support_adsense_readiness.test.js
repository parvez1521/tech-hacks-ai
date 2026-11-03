import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relativePath) => fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('SwitchRoute support contact and AdSense readiness', () => {
  test('official support email is configured and exposed through Contact Us', () => {
    assert.match(read('src/config/contactConfig.ts'), /email:\s*'support@switchroute\.in'/);
    assert.match(read('src/pages/ContactPage.tsx'), /Official support email/);
    assert.match(read('src/pages/ContactPage.tsx'), /mailto:support@switchroute\.in/);
    assert.match(read('src/pages/PrivacyPage.tsx'), /siteConfig\.links\.email/);
    assert.match(read('src/pages/DisclosurePage.tsx'), /support@switchroute\.in/);
  });

  test('AdSense is opt-in and requires a real publisher ID plus privacy readiness', () => {
    const config = read('src/config/site.ts');
    const banner = read('src/components/AdSenseBanner.tsx');
    const runtime = read('src/components/AdSenseRuntime.tsx');
    const env = read('.env.example');

    assert.match(config, /VITE_ADSENSE_ENABLED/);
    assert.match(config, /VITE_ADSENSE_PRIVACY_READY/);
    assert.ok(config.includes('ca-pub-') && config.includes('adsensePublisherIdIsValid'));
    assert.match(banner, /getCookiePreferences\(\)\?\.advertising === true/);
    assert.match(runtime, /pagead2\.googlesyndication\.com/);
    assert.match(runtime, /!siteConfig\.adsense\.privacyReady/);
    assert.match(read('index.html'), /<meta name="google-adsense-account" content="ca-pub-7627022109232156"\s*\/>/);
    assert.match(env, /VITE_ADSENSE_ENABLED=false/);
    assert.match(env, /VITE_ADSENSE_PRIVACY_READY=false/);
  });

  test('ads.txt is only generated from a valid configured publisher ID', () => {
    const script = read('scripts/generate-ads-txt.mjs');
    const packageJson = JSON.parse(read('package.json'));
    assert.match(script, /VITE_ADSENSE_PUBLISHER_ID/);
    assert.ok(script.includes("google.com, ' + sellerId"));
    assert.match(script, /DIRECT, f08c47fec0942fa0/);
    assert.ok(script.includes('ca-pub-') && script.includes('sellerId'));
    assert.ok(packageJson.scripts.build.includes('npm run ads:txt'));
  });

  test('privacy and disclosure pages state the current ad and consent setup honestly', () => {
    assert.match(read('src/pages/PrivacyPage.tsx'), /not currently serving Google AdSense advertisements/i);
    assert.match(read('src/pages/PrivacyPage.tsx'), /not itself a Google-certified CMP/i);
    assert.match(read('src/pages/DisclosurePage.tsx'), /Google AdSense advertising is not currently active/i);
    assert.match(read('src/components/CookieConsentBanner.tsx'), /not a Google-certified consent management platform/i);
    assert.match(read('src/pages/PrivacyPage.tsx'), /Google Analytics 4 measurement is activated only after/i);
    assert.match(read('src/pages/PrivacyPage.tsx'), /G-YMZP8GNP6B/);
    assert.match(read('src/pages/AboutPage.tsx'), /Pricing & Access Notes/);
    assert.match(read('src/pages/AboutPage.tsx'), /Student & Developer Benefits/);
  });
});
