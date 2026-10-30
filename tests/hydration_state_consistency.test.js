import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

test('cookie banner state is identical during SSR and first client render', () => {
  const source = read('src/components/CookieConsentBanner.tsx');
  assert.match(source, /const \[isOpen, setIsOpen\] = useState\(true\)/);
  assert.doesNotMatch(source, /useState\(\(\) => getCookiePreferences\(\)/);
  assert.match(source, /const existing = getCookiePreferences\(\)/);
  assert.match(source, /setIsOpen\(false\)/);
});

test('prompt-library bookmarks and recently viewed items are loaded after hydration', () => {
  const source = read('src/pages/PromptLibraryPage.tsx');
  assert.match(source, /useState<string\[]>\(\[\]\)/);
  assert.match(source, /useState<ReturnType<typeof getRecentlyViewedPrompts>>\(\[\]\)/);
  assert.doesNotMatch(source, /useState\(\(\) => getBookmarks\(\)/);
  assert.doesNotMatch(source, /useState\(\(\) => getRecentlyViewedPrompts\(\)/);
  assert.match(source, /setFavoriteIds\(getBookmarks\(\)\.map/);
  assert.match(source, /setRecentlyViewed\(getRecentlyViewedPrompts\(\)/);
});

test('router hydrates without query-string-dependent markup, then restores URL filters', () => {
  const source = read('src/router/Router.tsx');
  assert.match(source, /const \[searchParams, setSearchParamsState\] = useState\(new URLSearchParams\(\)\)/);
  assert.match(source, /setSearchParamsState\(new URLSearchParams\(window\.location\.search\)\)/);
  assert.doesNotMatch(source, /useState\(\s*typeof window !== 'undefined' \? new URLSearchParams\(window\.location\.search\)/);
});

test('chatbot welcome suggestions are deterministic for hydration and randomized after mount', () => {
  const source = read('src/components/FloatingChatbot.tsx');
  const factory = source.slice(source.indexOf('function createWelcomeMessage'), source.indexOf('export const FloatingChatbot'));
  assert.match(factory, /suggestions: suggestionsOrFallback\(suggestions, STARTER_PROMPTS\)/);
  assert.doesNotMatch(factory, /pickRandomSuggestions|Math\.random/);
  assert.match(source, /createWelcomeMessage\(pickRandomSuggestions\(WELCOME_QUESTIONS, 4\)\)/);
});
