export interface YoutubeUrlResult {
  videoId: string;
  normalizedUrl: string;
}

export interface InstagramUrlResult {
  shortcode: string;
  normalizedUrl: string;
  kind: 'reel' | 'post' | 'tv';
}

export type TranscriptionLanguage = 'auto' | 'en' | 'hi';

export interface TranscriptionOptions {
  language?: TranscriptionLanguage;
  onProgress?: (progress: number) => void;
}

export interface TranscriptionResult {
  text: string;
  detectedLanguage?: string;
}

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be']);
const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com']);

export function parseYoutubeUrl(value: string): YoutubeUrlResult {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('Enter a complete YouTube URL, including https://.');
  }
  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) throw new Error('Use a youtube.com or youtu.be URL.');
  if (url.protocol !== 'https:') throw new Error('Use an HTTPS YouTube URL.');

  const pathname = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');
  if (pathname.includes('//')) throw new Error('Use a canonical YouTube URL without repeated path separators.');
  const parts = pathname ? pathname.split('/').filter(Boolean) : [];

  let videoId = '';
  if (host.endsWith('youtu.be')) {
    if (parts.length !== 1) throw new Error('Use a youtu.be URL with one video ID path segment.');
    videoId = parts[0] || '';
  } else if (parts.length === 1 && parts[0].toLowerCase() === 'watch') {
    videoId = url.searchParams.get('v') || '';
  } else if (parts.length === 2 && (parts[0].toLowerCase() === 'shorts' || parts[0].toLowerCase() === 'embed')) {
    videoId = parts[1] || '';
  }

  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    throw new Error('That URL does not contain a supported 11-character public YouTube video ID.');
  }
  return {
    videoId,
    normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

export function parseInstagramUrl(value: string): InstagramUrlResult {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('Enter a complete Instagram URL, including https://.');
  }
  const host = url.hostname.toLowerCase();
  if (!INSTAGRAM_HOSTS.has(host)) throw new Error('Use a public instagram.com URL.');
  if (url.protocol !== 'https:') throw new Error('Use an HTTPS Instagram URL.');
  const pathname = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');
  if (pathname.includes('//')) throw new Error('Use a canonical Instagram URL without repeated path separators.');
  const parts = pathname ? pathname.split('/').filter(Boolean) : [];
  if (parts.length !== 2) throw new Error('Use one supported Instagram media route and one media identifier.');
  const kind = parts[0]?.toLowerCase();
  if (kind !== 'reel' && kind !== 'p' && kind !== 'tv') {
    throw new Error('Supported links are Instagram Reels, posts, or IGTV URLs.');
  }
  const shortcode = parts[1] || '';
  if (!/^[A-Za-z0-9_-]{3,120}$/.test(shortcode)) throw new Error('That Instagram URL does not contain a valid public media identifier.');
  return {
    shortcode,
    kind: kind === 'p' ? 'post' : kind,
    normalizedUrl: `https://www.instagram.com/${kind}/${shortcode}/`,
  };
}

export async function requestTranscription(file: File, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
  const language = options.language || 'auto';
  const body = new FormData();
  body.append('language', language);
  body.append('file', file, file.name);
  options.onProgress?.(10);
  const response = await fetch('/api/transcribe', { method: 'POST', body });
  options.onProgress?.(90);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || 'Transcription could not be completed.');
  if (!payload.text || typeof payload.text !== 'string') throw new Error('The transcription provider returned no transcript text.');
  options.onProgress?.(100);
  return {
    text: payload.text,
    detectedLanguage: typeof payload.detectedLanguage === 'string' ? payload.detectedLanguage : undefined,
  };
}
