import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pickRandomSuggestions, suggestionsOrFallback } from '../src/services/chatSuggestionService.ts';
import { contactConfig, getConfiguredContactOptions } from '../src/config/contactConfig.ts';

const read = (file) => fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');

describe('Theme, chat suggestions, and contact regression coverage', () => {
  it('selects unique random welcome prompts and always falls back when selection is empty', () => {
    const selected = pickRandomSuggestions(['a', 'b', 'c', 'd', 'e'], 4, () => 0.5);
    assert.equal(selected.length, 4);
    assert.equal(new Set(selected).size, 4);

    assert.deepEqual(suggestionsOrFallback(['one', 'two'], ['fallback'], () => []), ['fallback']);
    assert.deepEqual(suggestionsOrFallback(null, ['fallback'], () => { throw new Error('random unavailable'); }), ['fallback']);
  });

  it('renders welcome and follow-up chips through the normal send action', () => {
    const source = read('src/components/FloatingChatbot.tsx');
    assert.match(source, /useState<ChatMessage\[]>\(\(\) => \[createWelcomeMessage\(\)\]\)/);
    assert.match(source, /suggestions: suggestionsOrFallback\(suggestions, STARTER_PROMPTS\)/);
    assert.match(source, /createWelcomeMessage\(pickRandomSuggestions\(WELCOME_QUESTIONS, 4\)\)/);
    assert.match(source, /suggestionsOrFallback\(data\.suggestions, FOLLOW_UP_PROMPTS\)/);
    assert.match(source, /onClick=\{\(\) => handleSend\(s\)\}/);
    assert.match(source, /msg\.id !== 'bot-welcome' \|\| messages\.length === 1/);
    assert.match(source, /setMessages\(\[createWelcomeMessage\(pickRandomSuggestions\(WELCOME_QUESTIONS, 4\)\)\]\)/);
  });

  it('labels theme toggle with its destination and keeps the arrow non-interactive', () => {
    const component = read('src/components/ThemeToggle.tsx');
    const styles = read('src/index.css');
    assert.match(component, /theme === 'dark' \? 'Light Mode' : 'Dark Mode'/);
    assert.match(component, /aria-label=\{`Switch to \$\{theme === 'dark' \? 'light' : 'dark'\} mode`\}/);
    assert.match(component, /theme === 'dark' \? <Sun/);
    assert.match(component, /onClick=\{handleToggle\}/);
    assert.match(component, /className="theme-control__arrow"[\s\S]*?aria-hidden="true"/);
    assert.match(styles, /\.theme-control__arrow\s*\{[^}]*pointer-events:\s*none/s);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  });

  it('closes open navigation and consent dialogs with Escape and preserves keyboard focus', () => {
    const header = read('src/components/Header.tsx');
    const consent = read('src/components/CookieConsentBanner.tsx');
    assert.match(header, /onKeyDown=\{handleHeaderKeyDown\}/);
    assert.match(header, /event\.key !== 'Escape'/);
    assert.match(header, /discoverButtonRef\.current\?\.focus\(\)/);
    assert.match(header, /learnButtonRef\.current\?\.focus\(\)/);
    assert.match(header, /mobileMenuButtonRef\.current\?\.focus\(\)/);
    assert.match(header, /aria-controls=\{isDiscoverOpen \? 'discover-menu' : undefined\}/);
    assert.match(consent, /role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?onKeyDown=\{handleDialogKeyDown\}/);
    assert.match(consent, /event\.key === 'Escape'/);
    assert.match(consent, /event\.shiftKey && document\.activeElement === first/);
    assert.match(consent, /document\.activeElement === last/);
    assert.match(consent, /restoreFocusAfterCloseRef\.current = true/);
    assert.match(consent, /document\.querySelector<HTMLElement>\('\[data-cookie-consent-customize\]'\)/);
    assert.match(consent, /aria-label="Allow analytics and site diagnostics"/);
    assert.match(consent, /aria-label="Allow advertising and personalization"/);
  });

  it('shows the verified Instagram channel and official support email while hiding unconfigured phone', () => {
    const actual = getConfiguredContactOptions();
    assert.deepEqual(actual.map(({ id }) => id), ['instagram', 'email']);
    assert.equal(actual[0].display, '@tech_hacks.ai');
    assert.equal(actual[0].href, 'https://www.instagram.com/tech_hacks.ai/');
    assert.equal(actual[1].display, 'support@switchroute.in');
    assert.equal(actual[1].href, 'mailto:support@switchroute.in');
    assert.equal(contactConfig.email, 'support@switchroute.in');
    assert.equal(contactConfig.phone, '');

    const complete = getConfiguredContactOptions({
      ...contactConfig,
      phone: '+1 (415) 555-0132',
      instagramHandle: '@tech_hacks.ai',
      instagramUrl: 'https://www.instagram.com/tech_hacks.ai/',
    });
    assert.equal(complete.find(({ id }) => id === 'phone')?.href, 'tel:+14155550132');
    assert.equal(complete.find(({ id }) => id === 'instagram')?.href, 'https://www.instagram.com/tech_hacks.ai/');

    const unsafe = getConfiguredContactOptions({
      ...contactConfig,
      phone: 'phone number',
      instagramHandle: 'tech_hacks.ai',
      instagramUrl: 'https://www.instagram.com/someone-else/',
      email: 'not-an-email',
    });
    assert.deepEqual(unsafe, []);
  });

  it('keeps the footer contact region singular and links back to the existing contact route', () => {
    const footer = read('src/components/Footer.tsx');
    assert.equal((footer.match(/id="footer-contact-heading"/g) || []).length, 1);
    assert.match(footer, /getConfiguredContactOptions\(\)/);
    assert.match(footer, /aria-label="Contact options"/);
    assert.match(footer, /target=\{option\.external \? '_blank' : undefined\}/);
    assert.match(footer, /rel=\{option\.external \? 'noopener noreferrer' : undefined\}/);
  });
});
