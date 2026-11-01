import { randomBytes, createCipheriv, createDecipheriv, createHash, timingSafeEqual } from 'node:crypto';
import { Readable } from 'node:stream';

const IG_HOSTS = new Set(['instagram.com', 'www.instagram.com']);
const CDN_SUFFIXES = ['.cdninstagram.com', '.fbcdn.net'];
const GRAPH_FIELDS = 'id,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}';
const MAX_PAGES = 5;
const MAX_DOWNLOAD_BYTES = 180 * 1024 * 1024;
const lookupLimit = createRateLimiter(12, 10 * 60 * 1000);
const downloadLimit = createRateLimiter(8, 10 * 60 * 1000);

export const config = { maxDuration: 60 };

export function getInstagramConfig() {
  const appId = String(process.env.INSTAGRAM_APP_ID || '').trim();
  const appSecret = String(process.env.INSTAGRAM_APP_SECRET || '').trim();
  const sessionSecret = String(process.env.INSTAGRAM_SESSION_SECRET || '').trim();
  let siteUrl;
  try {
    siteUrl = new URL(String(process.env.SITE_URL || 'https://switchroute.in').trim());
    if (siteUrl.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(siteUrl.hostname)) throw new Error('HTTPS required');
  } catch {
    siteUrl = new URL('https://switchroute.in');
  }
  const requestedVersion = String(process.env.INSTAGRAM_GRAPH_API_VERSION || 'v26.0').trim();
  const graphVersion = /^v\d{1,2}\.0$/.test(requestedVersion) ? requestedVersion : 'v26.0';
  return {
    appId, appSecret, sessionSecret, siteUrl, graphVersion,
    redirectUri: new URL('/api/instagram/callback', siteUrl).toString(),
    configured: Boolean(appId && appSecret && sessionSecret.length >= 32),
  };
}

export function parseInstagramPermalink(value) {
  let url;
  try { url = new URL(String(value || '').trim()); }
  catch { throw new Error('Enter a complete Instagram URL, including https://.'); }
  if (url.protocol !== 'https:' || !IG_HOSTS.has(url.hostname.toLowerCase())) {
    throw new Error('Use an HTTPS instagram.com URL.');
  }
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length !== 2 || !['reel', 'p', 'tv'].includes(String(parts[0]).toLowerCase())) {
    throw new Error('Supported links are Instagram Reels, posts, or IGTV URLs.');
  }
  const shortcode = String(parts[1] || '');
  if (!/^[A-Za-z0-9_-]{3,120}$/.test(shortcode)) throw new Error('That Instagram URL does not contain a valid media identifier.');
  const kind = String(parts[0]).toLowerCase();
  return { shortcode, kind: kind === 'p' ? 'post' : kind, normalizedUrl: 'https://www.instagram.com/' + kind + '/' + shortcode + '/' };
}

export function isTrustedInstagramMediaUrl(value) {
  try {
    const url = new URL(String(value || ''));
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return false;
    return CDN_SUFFIXES.some((suffix) => url.hostname.toLowerCase().endsWith(suffix));
  } catch { return false; }
}

function shortcodeFromPermalink(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !IG_HOSTS.has(url.hostname.toLowerCase())) return '';
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length !== 2 || !['reel', 'p', 'tv'].includes(parts[0].toLowerCase())) return '';
    return parts[1];
  } catch { return ''; }
}

export function encryptInstagramSession(session, secret) {
  const key = createHash('sha256').update(String(secret)).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64url');
}

export function decryptInstagramSession(value, secret) {
  try {
    if (!secret || String(secret).length < 32) return null;
    const packed = Buffer.from(String(value || ''), 'base64url');
    if (packed.length < 30) return null;
    const key = createHash('sha256').update(String(secret)).digest();
    const decipher = createDecipheriv('aes-256-gcm', key, packed.subarray(0, 12));
    decipher.setAuthTag(packed.subarray(12, 28));
    const session = JSON.parse(Buffer.concat([decipher.update(packed.subarray(28)), decipher.final()]).toString('utf8'));
    if (!session || typeof session !== 'object' || typeof session.accessToken !== 'string' ||
        typeof session.userId !== 'string' || typeof session.username !== 'string' ||
        !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) return null;
    return session;
  } catch { return null; }
}

function cookieNames() {
  const secure = getInstagramConfig().siteUrl.protocol === 'https:';
  return {
    session: secure ? '__Host-switchroute_ig_session' : 'switchroute_ig_session',
    state: secure ? '__Host-switchroute_ig_state' : 'switchroute_ig_state',
    secure,
  };
}

export function getCookieValue(header, name) {
  for (const cookie of String(header || '').split(';')) {
    const separator = cookie.indexOf('=');
    if (separator < 0 || cookie.slice(0, separator).trim() !== name) continue;
    try { return decodeURIComponent(cookie.slice(separator + 1).trim()); } catch { return ''; }
  }
  return '';
}

function appendSetCookie(res, cookie) {
  const existing = typeof res.getHeader === 'function' ? res.getHeader('Set-Cookie') : undefined;
  const values = Array.isArray(existing) ? existing : existing ? [existing] : [];
  res.setHeader('Set-Cookie', [...values, cookie]);
}

function cookieString(name, value, maxAge, secure) {
  return name + '=' + encodeURIComponent(value) + '; Path=/; Max-Age=' + String(Math.max(0, Math.floor(maxAge))) +
    '; HttpOnly; SameSite=Lax' + (secure ? '; Secure' : '');
}

function setOAuthStateCookie(res, state) {
  const names = cookieNames();
  appendSetCookie(res, cookieString(names.state, state, 600, names.secure));
}

function clearOAuthStateCookie(res) {
  const names = cookieNames();
  appendSetCookie(res, cookieString(names.state, '', 0, names.secure));
}

function getOAuthStateCookie(req) {
  return getCookieValue(req?.headers?.cookie, cookieNames().state);
}

function setInstagramSessionCookie(res, session) {
  const config = getInstagramConfig();
  if (!config.configured) throw new Error('Instagram integration is not configured.');
  const names = cookieNames();
  const encrypted = encryptInstagramSession(session, config.sessionSecret);
  const maxAge = Math.min(45 * 24 * 60 * 60, Math.floor((session.expiresAt - Date.now()) / 1000));
  appendSetCookie(res, cookieString(names.session, encrypted, maxAge, names.secure));
}

function clearInstagramSessionCookie(res) {
  const names = cookieNames();
  appendSetCookie(res, cookieString(names.session, '', 0, names.secure));
}

function readInstagramSession(req) {
  const config = getInstagramConfig();
  if (!config.configured) return null;
  const value = getCookieValue(req?.headers?.cookie, cookieNames().session);
  return value ? decryptInstagramSession(value, config.sessionSecret) : null;
}

function isSameOriginRequest(req) {
  const origin = String(req?.headers?.origin || '').trim();
  if (!origin) return true;
  try { return new URL(origin).origin === getInstagramConfig().siteUrl.origin; }
  catch { return false; }
}

function getRequestIp(req) {
  const headers = req?.headers || {};
  const forwarded = headers['x-vercel-forwarded-for'] || headers['x-forwarded-for'] || headers['x-real-ip'];
  if (forwarded) return String(forwarded).split(',')[0].trim().slice(0, 128) || 'unknown';
  return String(req?.socket?.remoteAddress || 'unknown').slice(0, 128);
}

export function createRateLimiter(maxRequests, windowMs) {
  const attempts = new Map();
  return (key) => {
    const now = Date.now();
    for (const [ip, timestamps] of attempts.entries()) {
      const recent = timestamps.filter((timestamp) => now - timestamp < windowMs);
      if (recent.length) attempts.set(ip, recent);
      else attempts.delete(ip);
    }
    if (attempts.size > 10000) attempts.delete(attempts.keys().next().value);
    const recent = attempts.get(key) || [];
    if (recent.length >= maxRequests) return false;
    recent.push(now);
    attempts.set(key, recent);
    return true;
  };
}

function readJsonBody(req) {
  try {
    if (req?.bodyParseError) return null;
    const raw = req?.body;
    if (raw === undefined || raw === null || raw === '') return {};
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed;
  } catch { return null; }
}

function sendJson(res, statusCode, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (typeof res.status === 'function') return res.status(statusCode).json(payload);
  res.statusCode = statusCode;
  return res.end(JSON.stringify(payload));
}

function redirect(res, location) {
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  return res.end();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) throw new Error('Instagram authorization could not be completed.');
  return payload;
}

async function graphJson(url, fetchImpl = fetch) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'graph.instagram.com') {
    throw new Error('Instagram API request URL was rejected.');
  }
  const response = await fetchImpl(parsed.toString(), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    if (Number(payload?.error?.code) === 190) throw new Error('Your Instagram session has expired. Reconnect the account and try again.');
    throw new Error('Meta could not return media for this Instagram account. Check the connection and try again.');
  }
  return payload;
}

function normalizeMedia(record) {
  const children = Array.isArray(record?.children?.data) ? record.children.data : [];
  const records = record?.media_type === 'CAROUSEL_ALBUM' && children.length ? children : [record];
  const items = records.map((item, index) => {
    const mediaType = item?.media_type === 'VIDEO' ? 'VIDEO' : item?.media_type === 'IMAGE' ? 'IMAGE' : '';
    const mediaUrl = isTrustedInstagramMediaUrl(item?.media_url) ? item.media_url : '';
    const thumbnailUrl = isTrustedInstagramMediaUrl(item?.thumbnail_url) ? item.thumbnail_url : '';
    if (!mediaType || !mediaUrl) return null;
    return { index, mediaType, previewUrl: mediaUrl, thumbnailUrl: thumbnailUrl || undefined, mediaUrl };
  }).filter(Boolean);
  if (!items.length) throw new Error('Meta did not return a downloadable media file for this post.');
  return { id: String(record.id || ''), kind: String(record.media_type || 'MEDIA'), permalink: String(record.permalink || ''), items };
}

export async function findOwnedInstagramMedia(session, shortcode, fetchImpl = fetch) {
  if (!session?.accessToken || !session?.userId) throw new Error('Connect an Instagram account before looking up media.');
  const config = getInstagramConfig();
  const firstUrl = new URL('https://graph.instagram.com/' + config.graphVersion + '/' + encodeURIComponent(session.userId) + '/media');
  firstUrl.searchParams.set('fields', GRAPH_FIELDS);
  firstUrl.searchParams.set('limit', '100');
  firstUrl.searchParams.set('access_token', session.accessToken);
  let nextUrl = firstUrl.toString();

  for (let page = 0; page < MAX_PAGES && nextUrl; page += 1) {
    const payload = await graphJson(nextUrl, fetchImpl);
    const records = Array.isArray(payload.data) ? payload.data : [];
    const match = records.find((record) => shortcodeFromPermalink(record?.permalink) === shortcode);
    if (match) return normalizeMedia(match);
    const nextValue = String(payload?.paging?.next || '');
    if (!nextValue) break;
    try {
      const next = new URL(nextValue);
      if (next.protocol !== 'https:' || next.hostname !== 'graph.instagram.com' ||
          !next.pathname.startsWith('/' + config.graphVersion + '/')) break;
      nextUrl = next.toString();
    } catch { break; }
  }
  return null;
}

export async function fetchTrustedInstagramMedia(url, fetchImpl = fetch) {
  let currentUrl = String(url || '');
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    if (!isTrustedInstagramMediaUrl(currentUrl)) throw new Error('The media URL is not on an approved Meta CDN host.');
    const response = await fetchImpl(currentUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: { Accept: 'video/mp4,image/jpeg,image/png,image/webp,application/octet-stream' },
      signal: AbortSignal.timeout(30000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers?.get?.('location');
      if (!location) throw new Error('The Instagram CDN returned an invalid redirect.');
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }
    return response;
  }
  throw new Error('The Instagram CDN redirected too many times.');
}

function getAction(req) {
  const url = new URL(req.url, 'https://switchroute.in');
  const parts = url.pathname.split('/').filter(Boolean);
  return parts[2] || '';
}

async function connect(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { message: 'Method not allowed.' });
  }
  const config = getInstagramConfig();
  if (!config.configured) {
    return sendJson(res, 503, {
      message: 'Instagram Login is not configured yet. Add the Meta app credentials in Vercel first.',
      requiredEnvironment: ['INSTAGRAM_APP_ID', 'INSTAGRAM_APP_SECRET', 'INSTAGRAM_SESSION_SECRET', 'SITE_URL'],
    });
  }
  const state = randomBytes(32).toString('base64url');
  setOAuthStateCookie(res, state);
  const authorizeUrl = new URL('https://www.instagram.com/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', config.appId);
  authorizeUrl.searchParams.set('redirect_uri', config.redirectUri);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'instagram_business_basic');
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('enable_fb_login', '0');
  return redirect(res, authorizeUrl.toString());
}

async function callback(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { message: 'Method not allowed.' });
  }
  const config = getInstagramConfig();
  if (!config.configured) return sendJson(res, 503, { message: 'Instagram Login is not configured.' });
  const query = new URL(req.url, config.siteUrl).searchParams;
  const cookieState = getCookieValue(req?.headers?.cookie, cookieNames().state);
  const queryState = String(query.get('state') || '');
  const code = String(query.get('code') || '');
  const stateA = Buffer.from(cookieState);
  const stateB = Buffer.from(queryState);
  const validState = stateA.length > 0 && stateA.length === stateB.length && timingSafeEqual(stateA, stateB);
  const finish = (status) => {
    const url = new URL('/free-tools/instagram-video-downloader', config.siteUrl);
    url.searchParams.set('instagram', status);
    return redirect(res, url.toString());
  };
  if (query.has('error') || !validState || !code || code.length > 4096) {
    clearOAuthStateCookie(res);
    return finish('error');
  }

  try {
    const form = new URLSearchParams({
      client_id: config.appId,
      client_secret: config.appSecret,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      code,
    });
    const tokenResponse = await fetchJson('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: form,
    });
    const shortToken = tokenResponse?.data?.[0] || tokenResponse;
    if (!shortToken.access_token || !shortToken.user_id) throw new Error('Instagram did not return an access token.');

    const exchangeUrl = new URL('https://graph.instagram.com/access_token');
    exchangeUrl.searchParams.set('grant_type', 'ig_exchange_token');
    exchangeUrl.searchParams.set('client_secret', config.appSecret);
    exchangeUrl.searchParams.set('access_token', shortToken.access_token);
    const longToken = await fetchJson(exchangeUrl.toString());
    const expiresIn = Number(longToken.expires_in || 0);
    if (!longToken.access_token || !Number.isFinite(expiresIn) || expiresIn <= 0) throw new Error('Instagram did not return a valid long-lived token.');

    const profileUrl = new URL('https://graph.instagram.com/' + config.graphVersion + '/me');
    profileUrl.searchParams.set('fields', 'user_id,username,account_type,media_count');
    profileUrl.searchParams.set('access_token', longToken.access_token);
    const profile = await fetchJson(profileUrl.toString());
    if (String(profile.account_type || '').toUpperCase() === 'PERSONAL') throw new Error('A Professional or Creator account is required.');
    const userId = String(profile.user_id || profile.id || shortToken.user_id);
    if (!/^\d+$/.test(userId)) throw new Error('Instagram returned an invalid account identifier.');

    const session = {
      accessToken: String(longToken.access_token),
      userId,
      username: String(profile.username || 'Instagram user'),
      accountType: String(profile.account_type || ''),
      mediaCount: Number.isFinite(Number(profile.media_count)) ? Number(profile.media_count) : null,
      expiresAt: Date.now() + expiresIn * 1000,
    };
    setInstagramSessionCookie(res, session);
    clearOAuthStateCookie(res);
    return finish('connected');
  } catch {
    clearOAuthStateCookie(res);
    return finish('error');
  }
}

async function sessionStatus(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { message: 'Method not allowed.' });
  }
  const config = getInstagramConfig();
  const session = readInstagramSession(req);
  return sendJson(res, 200, {
    configured: config.configured,
    connected: Boolean(session),
    username: session?.username || null,
    accountType: session?.accountType || null,
    mediaCount: session?.mediaCount ?? null,
  });
}

async function disconnect(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { message: 'Method not allowed.' });
  }
  if (!isSameOriginRequest(req)) return sendJson(res, 403, { message: 'Request origin was rejected.' });
  clearInstagramSessionCookie(res);
  return sendJson(res, 200, { disconnected: true });
}

async function mediaLookup(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { message: 'Method not allowed.' });
  }
  if (!isSameOriginRequest(req)) return sendJson(res, 403, { message: 'Request origin was rejected.' });
  const session = readInstagramSession(req);
  if (!session) return sendJson(res, 401, { message: 'Connect your Instagram Professional or Creator account first.' });
  if (!lookupLimit(getRequestIp(req))) {
    res.setHeader('Retry-After', '600');
    return sendJson(res, 429, { message: 'Too many lookup requests. Try again in 10 minutes.' });
  }
  const body = readJsonBody(req);
  if (!body || typeof body.url !== 'string' || body.url.length > 2048) {
    return sendJson(res, 400, { message: 'Enter one valid Instagram Reel or post URL.' });
  }
  let parsed;
  try { parsed = parseInstagramPermalink(body.url); }
  catch (error) { return sendJson(res, 400, { message: error instanceof Error ? error.message : 'Invalid Instagram URL.' }); }

  try {
    const media = await findOwnedInstagramMedia(session, parsed.shortcode);
    if (!media) {
      return sendJson(res, 404, { message: 'This post was not found in the connected account’s media. Only media owned by that account and returned by Meta is supported.' });
    }
    const items = media.items.map((item, index) => ({
      index,
      mediaType: item.mediaType,
      previewUrl: item.previewUrl,
      posterUrl: item.thumbnailUrl || null,
      downloadUrl: '/api/instagram/download?shortcode=' + encodeURIComponent(parsed.shortcode) +
        '&mediaId=' + encodeURIComponent(media.id) + '&item=' + String(index),
    }));
    return sendJson(res, 200, { media: { id: media.id, kind: media.kind, permalink: media.permalink, items } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Instagram media could not be retrieved.';
    if (/session has expired/i.test(message)) {
      clearInstagramSessionCookie(res);
      return sendJson(res, 401, { message });
    }
    return sendJson(res, 502, { message });
  }
}

async function download(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { message: 'Method not allowed.' });
  }
  if (req.headers?.['sec-fetch-site'] === 'cross-site') return sendJson(res, 403, { message: 'Cross-site download requests are not allowed.' });
  const session = readInstagramSession(req);
  if (!session) return sendJson(res, 401, { message: 'Connect your Instagram account again before downloading.' });
  if (!downloadLimit(getRequestIp(req))) {
    res.setHeader('Retry-After', '600');
    return sendJson(res, 429, { message: 'Download limit reached. Try again in 10 minutes.' });
  }
  const query = new URL(req.url, 'https://switchroute.in').searchParams;
  const shortcode = String(query.get('shortcode') || '');
  const mediaId = String(query.get('mediaId') || '');
  const itemIndex = Number(query.get('item') || 0);
  if (!/^[A-Za-z0-9_-]{3,120}$/.test(shortcode) || !/^\d{5,50}$/.test(mediaId) ||
      !Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex > 20) {
    return sendJson(res, 400, { message: 'This download link is invalid. Find the media again and retry.' });
  }
  try {
    const media = await findOwnedInstagramMedia(session, shortcode);
    if (!media || media.id !== mediaId || !media.items[itemIndex]) {
      return sendJson(res, 404, { message: 'This media is not available from the connected account. Find it again and retry.' });
    }
    const selected = media.items[itemIndex];
    const upstream = await fetchTrustedInstagramMedia(selected.mediaUrl);
    if (!upstream.ok || !upstream.body) return sendJson(res, 502, { message: 'Instagram’s media CDN could not provide this file. Try again later.' });

    const contentLength = Number(upstream.headers?.get?.('content-length') || 0);
    if (contentLength > MAX_DOWNLOAD_BYTES) {
      await upstream.body.cancel().catch(() => {});
      return sendJson(res, 413, { message: 'This file is larger than the current 180 MB download limit.' });
    }
    const upstreamType = String(upstream.headers?.get?.('content-type') || '').split(';')[0].toLowerCase();
    const allowedType = selected.mediaType === 'VIDEO'
      ? (/^video\//.test(upstreamType) || upstreamType === 'application/octet-stream')
      : (/^image\//.test(upstreamType) || upstreamType === 'application/octet-stream');
    if (upstreamType && !allowedType) {
      await upstream.body.cancel().catch(() => {});
      return sendJson(res, 502, { message: 'Instagram’s CDN did not return a supported media file.' });
    }
    const contentType = upstreamType && upstreamType !== 'application/octet-stream'
      ? upstreamType
      : selected.mediaType === 'VIDEO' ? 'video/mp4' : 'image/jpeg';
    const extension = selected.mediaType === 'VIDEO' ? '.mp4' :
      contentType === 'image/png' ? '.png' : contentType === 'image/webp' ? '.webp' : '.jpg';
    const filename = 'switchroute-instagram-' + shortcode + '-' + String(itemIndex + 1) + extension;

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    if (contentLength > 0) res.setHeader('Content-Length', String(contentLength));
    const stream = Readable.fromWeb(upstream.body);
    stream.on('error', (error) => {
      if (!res.headersSent) sendJson(res, 502, { message: 'The media download stream was interrupted. Try again.' });
      else res.destroy(error);
    });
    stream.pipe(res);
  } catch {
    return sendJson(res, 502, { message: 'The media download could not be completed. Reconnect Instagram or try again later.' });
  }
}

export default async function handler(req, res) {
  const action = getAction(req);
  try {
    switch (action) {
      case 'connect': return await connect(req, res);
      case 'callback': return await callback(req, res);
      case 'session': return await sessionStatus(req, res);
      case 'disconnect': return await disconnect(req, res);
      case 'media': return await mediaLookup(req, res);
      case 'download': return await download(req, res);
      default: return sendJson(res, 404, { message: 'Instagram utility endpoint not found.' });
    }
  } catch {
    return sendJson(res, 500, { message: 'The Instagram service could not complete this request.' });
  }
}
