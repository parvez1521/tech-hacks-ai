import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  createRateLimiter,
  decryptInstagramSession,
  encryptInstagramSession,
  findOwnedInstagramMedia,
  getInstagramConfig,
  isTrustedInstagramMediaUrl,
  parseInstagramPermalink,
} from '../api/instagram/[action].js';

const SECRET = 'switchroute-test-session-secret-at-least-32-characters';

describe('Instagram Reel Downloader: authorized media integration', () => {
  test('accepts supported Instagram Reel, post, and IGTV permalinks', () => {
    assert.deepEqual(parseInstagramPermalink('https://www.instagram.com/reel/AbC_123/?igsh=abc'), {
      shortcode: 'AbC_123',
      kind: 'reel',
      normalizedUrl: 'https://www.instagram.com/reel/AbC_123/',
    });
    assert.equal(parseInstagramPermalink('https://instagram.com/p/AbC_123/').kind, 'post');
    assert.equal(parseInstagramPermalink('https://www.instagram.com/tv/AbC_123/').kind, 'tv');
  });

  test('rejects non-Instagram hosts, insecure URLs, and unsupported paths', () => {
    assert.throws(() => parseInstagramPermalink('https://example.com/reel/AbC_123/'), /instagram.com/i);
    assert.throws(() => parseInstagramPermalink('http://www.instagram.com/reel/AbC_123/'), /HTTPS/i);
    assert.throws(() => parseInstagramPermalink('https://www.instagram.com/stories/user/123/'), /supported links/i);
    assert.throws(() => parseInstagramPermalink('https://www.instagram.com/reel/../'), /valid media identifier/i);
  });

  test('uses the current, configurable Graph API version', () => {
    const oldValue = process.env.INSTAGRAM_GRAPH_API_VERSION;
    try {
      process.env.INSTAGRAM_GRAPH_API_VERSION = 'v26.0';
      assert.equal(getInstagramConfig().graphVersion, 'v26.0');
      process.env.INSTAGRAM_GRAPH_API_VERSION = 'bad-version';
      assert.equal(getInstagramConfig().graphVersion, 'v26.0');
    } finally {
      if (oldValue === undefined) delete process.env.INSTAGRAM_GRAPH_API_VERSION;
      else process.env.INSTAGRAM_GRAPH_API_VERSION = oldValue;
    }
  });

  test('encrypts the access token and rejects altered or expired cookies', () => {
    const session = {
      accessToken: 'test-access-token',
      userId: '17841400000000000',
      username: 'switchroute_creator',
      accountType: 'MEDIA_CREATOR',
      expiresAt: Date.now() + 3600000,
    };
    const encrypted = encryptInstagramSession(session, SECRET);
    assert.notEqual(encrypted, Buffer.from(JSON.stringify(session)).toString('base64'));
    assert.deepEqual(decryptInstagramSession(encrypted, SECRET), session);
    assert.equal(decryptInstagramSession(encrypted + 'x', SECRET), null);
    assert.equal(decryptInstagramSession(encrypted, 'a-different-session-secret-at-least-32'), null);
    assert.equal(decryptInstagramSession(encryptInstagramSession({ ...session, expiresAt: Date.now() - 1 }, SECRET), SECRET), null);
  });

  test('allows only HTTPS media URLs on approved Instagram CDN hosts', () => {
    assert.equal(isTrustedInstagramMediaUrl('https://scontent.cdninstagram.com/v/t51/file.mp4'), true);
    assert.equal(isTrustedInstagramMediaUrl('https://scontent-mrs2-1.cdninstagram.com/v/t51/file.jpg'), true);
    assert.equal(isTrustedInstagramMediaUrl('https://video.xx.fbcdn.net/file.mp4'), true);
    assert.equal(isTrustedInstagramMediaUrl('http://scontent.cdninstagram.com/file.mp4'), false);
    assert.equal(isTrustedInstagramMediaUrl('https://evil.example/file.mp4'), false);
    assert.equal(isTrustedInstagramMediaUrl('https://cdninstagram.com.evil.example/file.mp4'), false);
    assert.equal(isTrustedInstagramMediaUrl('https://user:pass@scontent.cdninstagram.com/file.mp4'), false);
  });

  test('finds media only in the connected account collection via the official API', async () => {
    const calls = [];
    const mockFetch = async (url) => {
      calls.push(new URL(url));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: [{
            id: '17900000000000000',
            media_type: 'VIDEO',
            permalink: 'https://www.instagram.com/reel/AbC_123/',
            media_url: 'https://scontent.cdninstagram.com/video.mp4',
            thumbnail_url: 'https://scontent.cdninstagram.com/thumbnail.jpg',
            timestamp: '2026-10-30T10:00:00+0000',
          }],
        }),
      };
    };
    const media = await findOwnedInstagramMedia({
      accessToken: 'test-access-token',
      userId: '17841400000000000',
    }, 'AbC_123', mockFetch);
    assert.equal(media.id, '17900000000000000');
    assert.equal(media.items[0].mediaType, 'VIDEO');
    assert.equal(media.items[0].previewUrl, 'https://scontent.cdninstagram.com/thumbnail.jpg');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].hostname, 'graph.instagram.com');
    assert.match(calls[0].pathname, /\/v26\.0\/17841400000000000\/media$/);
    assert.equal(calls[0].searchParams.get('access_token'), 'test-access-token');
  });

  test('does not return a shortcode absent from the connected account media', async () => {
    const mockFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ id: '123456789', media_type: 'VIDEO', permalink: 'https://www.instagram.com/reel/Other_123/' }] }),
    });
    const media = await findOwnedInstagramMedia({
      accessToken: 'test-access-token',
      userId: '17841400000000000',
    }, 'NotMine_123', mockFetch);
    assert.equal(media, null);
  });

  test('rate limiter allows only the configured number of actions', () => {
    const limit = createRateLimiter(2, 60000);
    assert.equal(limit('test-ip'), true);
    assert.equal(limit('test-ip'), true);
    assert.equal(limit('test-ip'), false);
    assert.equal(limit('other-ip'), true);
  });
});
