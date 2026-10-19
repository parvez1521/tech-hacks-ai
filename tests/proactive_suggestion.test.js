import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { toolsData } from '../src/data/seedData.ts';
import { getBrandLogo } from '../src/data/brandLogos.ts';
import {
  getProactiveSuggestionPool,
  selectProactiveSuggestion,
} from '../src/services/proactiveSuggestionService.ts';

const chatbotSource = fs.readFileSync(
  path.resolve(process.cwd(), 'src/components/FloatingChatbot.tsx'),
  'utf8'
);

describe('Proactive assistant suggestions', () => {
  test('pool contains actionable prompts and real catalogue-backed tool routes', () => {
    const pool = getProactiveSuggestionPool();
    assert.ok(pool.length > 6, 'The assistant should have more than the fallback prompt set');

    for (const suggestion of pool) {
      assert.ok(suggestion.title.length > 0, 'Every suggestion has a visible title');
      assert.ok(suggestion.prompt.length > 0, 'Every suggestion has an actionable prompt');
      assert.match(suggestion.href, /^\//, 'Every suggestion uses an internal route');

      if (suggestion.tool) {
        const record = [...aiToolsData, ...toolsData].find((tool) => tool.slug === suggestion.tool.slug);
        assert.ok(record, `${suggestion.tool.slug} must exist in the published static catalogue`);
        assert.ok(getBrandLogo(suggestion.tool.slug), `${suggestion.tool.slug} must have a logo mapping`);
        assert.match(suggestion.href, new RegExp(`/${suggestion.tool.type === 'ai' ? 'ai-tools' : 'tools'}/`));
      }
    }
  });

  test('selection avoids the previous suggestion and persists the new id', () => {
    const storage = new Map();
    const storageAdapter = {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    };

    const first = selectProactiveSuggestion({ random: () => 0, storage: storageAdapter });
    const second = selectProactiveSuggestion({ random: () => 0, storage: storageAdapter });

    assert.notEqual(second.id, first.id, 'Consecutive visits should not repeat the same suggestion');
    assert.equal(storage.get('techhacks_proactive_suggestion_id'), second.id);
  });

  test('chatbot displays the selection immediately and guards against duplicate messages', () => {
    assert.ok(chatbotSource.includes('selectProactiveSuggestion()'));
    assert.ok(chatbotSource.includes('setShowWelcome(true)'));
    assert.ok(chatbotSource.includes('data-testid="welcome-question-chip"'));
    assert.ok(chatbotSource.includes('proactiveInitializedRef.current'));
    assert.ok(chatbotSource.includes('previous.some((message) => message.id === proactiveMessage.id)'));
    assert.ok(!chatbotSource.includes('5000'), 'The proactive suggestion must not wait five seconds');
  });
});
