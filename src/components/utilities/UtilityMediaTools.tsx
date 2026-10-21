import React, { useEffect, useState } from 'react';
import { FilePicker, UtilityMessage, DownloadButton, CopyButton, formatBytes, utilityButtonClass, utilityInputClass, utilityQuietButtonClass, downloadText } from './UtilityShared';
import { parseInstagramUrl, parseYoutubeUrl, requestTranscription, type TranscriptionLanguage } from '../../services/mediaWorkflowService';

function readText(bytes: Uint8Array) {
  return new TextDecoder('utf-8').decode(bytes).replace(/\0/g, '').trim();
}

function readId3(fileBuffer: ArrayBuffer) {
  const bytes = new Uint8Array(fileBuffer);
  if (readText(bytes.slice(0, 3)) !== 'ID3') return {};
  const view = new DataView(fileBuffer);
  const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
  const result: Record<string, string> = {};
  let offset = 10;
  const labels: Record<string, string> = { TIT2: 'Title', TPE1: 'Artist', TALB: 'Album' };
  while (offset + 10 <= Math.min(bytes.length, 10 + tagSize)) {
    const id = readText(bytes.slice(offset, offset + 4));
    const frameSize = view.getUint32(offset + 4);
    if (!id || frameSize <= 0) break;
    if (labels[id]) result[labels[id]] = readText(bytes.slice(offset + 11, offset + 10 + frameSize));
    offset += 10 + frameSize;
  }
  return result;
}

export const AudioMetadataTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const inspect = async (selected: File) => {
    try {
      if (!selected.type.startsWith('audio/') && !/\.(mp3|wav|m4a|ogg|flac)$/i.test(selected.name)) throw new Error('Choose an audio file.');
      const metadata = readId3(await selected.slice(0, 1024 * 1024).arrayBuffer());
      const url = URL.createObjectURL(selected); const audio = new Audio();
      audio.onloadedmetadata = () => { setDetails({ Type: selected.type || 'Unknown', Size: formatBytes(selected.size), Duration: Number.isFinite(audio.duration) ? `${audio.duration.toFixed(2)} seconds` : 'Unavailable', ...metadata }); URL.revokeObjectURL(url); setError(''); };
      audio.onerror = () => { URL.revokeObjectURL(url); setDetails({ Type: selected.type || 'Unknown', Size: formatBytes(selected.size), ...metadata }); setError('The browser could not read duration metadata for this file, but basic file details are available.'); };
      audio.src = url; setFile(selected);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to inspect audio file.'); }
  };
  return <div className="space-y-4"><FilePicker accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac" onFile={inspect} label={file ? file.name : 'Choose an audio file'} helper="Reads local file details, duration, and common ID3 tags when present." />{error && <UtilityMessage tone="info">{error}</UtilityMessage>}{Object.keys(details).length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{Object.entries(details).map(([key, value]) => <div key={key} className="rounded-lg border border-border bg-card/50 p-3"><span className="block text-[11px] font-semibold uppercase text-muted-foreground">{key}</span><strong className="mt-1 block break-words text-xs text-foreground">{value || 'Not present'}</strong></div>)}</div>}</div>;
};

export const VideoMetadataTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const inspect = (selected: File) => {
    if (!selected.type.startsWith('video/')) { setError('Choose a video file that this browser can decode.'); return; }
    const url = URL.createObjectURL(selected); const video = document.createElement('video'); video.preload = 'metadata';
    video.onloadedmetadata = () => { setFile(selected); setDetails({ Type: selected.type, Size: formatBytes(selected.size), Duration: Number.isFinite(video.duration) ? `${video.duration.toFixed(2)} seconds` : 'Unavailable', Resolution: `${video.videoWidth} × ${video.videoHeight}`, Aspect: video.videoHeight ? (video.videoWidth / video.videoHeight).toFixed(3) : 'Unavailable' }); URL.revokeObjectURL(url); setError(''); };
    video.onerror = () => { URL.revokeObjectURL(url); setError('This browser could not decode the selected video. No conversion was attempted.'); }; video.src = url;
  };
  return <div className="space-y-4"><FilePicker accept="video/*" onFile={inspect} label={file ? file.name : 'Choose a video file'} helper="Reads browser-decodable duration and resolution; no upload or transcoding." />{error && <UtilityMessage>{error}</UtilityMessage>}{Object.keys(details).length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{Object.entries(details).map(([key, value]) => <div key={key} className="rounded-lg border border-border bg-card/50 p-3"><span className="block text-[11px] font-semibold uppercase text-muted-foreground">{key}</span><strong className="mt-1 block text-xs text-foreground">{value}</strong></div>)}</div>}</div>;
};

const encodeWav = (buffer: AudioBuffer) => {
  const channels = buffer.numberOfChannels; const length = buffer.length * channels * 2 + 44; const output = new ArrayBuffer(length); const view = new DataView(output);
  const write = (offset: number, text: string) => Array.from(text).forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  write(0, 'RIFF'); view.setUint32(4, length - 8, true); write(8, 'WAVE'); write(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true); view.setUint32(28, buffer.sampleRate * channels * 2, true); view.setUint16(32, channels * 2, true); view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, length - 44, true);
  let offset = 44;
  for (let i = 0; i < buffer.length; i += 1) for (let channel = 0; channel < channels; channel += 1) { const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i])); view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true); offset += 2; }
  return new Blob([output], { type: 'audio/wav' });
};

export const AudioTrimmerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [output, setOutput] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const inspect = async (selected: File) => {
    try {
      if (!selected.type.startsWith('audio/')) throw new Error('Choose an audio file supported by this browser.');
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) throw new Error('Web Audio decoding is unavailable in this browser.');
      const context = new AudioContextCtor(); const decoded = await context.decodeAudioData(await selected.arrayBuffer()); await context.close();
      setFile(selected); setDuration(decoded.duration); setStart(0); setEnd(decoded.duration); setOutput(null); setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to decode this audio file.'); }
  };
  const trim = async () => {
    if (!file || end <= start) { setError('Choose an end time greater than the start time.'); return; }
    try {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) throw new Error('Web Audio decoding is unavailable in this browser.');
      const sourceContext = new AudioContextCtor(); const decoded = await sourceContext.decodeAudioData(await file.arrayBuffer());
      const frameStart = Math.floor(start * decoded.sampleRate); const frameCount = Math.floor((end - start) * decoded.sampleRate); const offline = new OfflineAudioContext(decoded.numberOfChannels, frameCount, decoded.sampleRate); const slice = offline.createBuffer(decoded.numberOfChannels, frameCount, decoded.sampleRate);
      for (let channel = 0; channel < decoded.numberOfChannels; channel += 1) slice.copyToChannel(decoded.getChannelData(channel).slice(frameStart, frameStart + frameCount), channel);
      const source = offline.createBufferSource(); source.buffer = slice; source.connect(offline.destination); source.start(); const rendered = await offline.startRendering(); setOutput(encodeWav(rendered)); await sourceContext.close(); setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to trim this audio file.'); }
  };
  useEffect(() => () => {}, []);
  return <div className="space-y-4"><FilePicker accept="audio/*" onFile={inspect} label={file ? file.name : 'Choose an audio file'} helper="Browser-decodable audio only. Exports a trimmed WAV locally." />{error && <UtilityMessage>{error}</UtilityMessage>}{duration > 0 && <><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs text-muted-foreground">Start: {start.toFixed(2)}s<input type="range" min="0" max={duration} step="0.01" value={start} onChange={(e) => setStart(Math.min(Number(e.target.value), end - 0.01))} className="w-full" /></label><label className="space-y-1 text-xs text-muted-foreground">End: {end.toFixed(2)}s<input type="range" min="0.01" max={duration} step="0.01" value={end} onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 0.01))} className="w-full" /></label></div><div className="flex gap-2"><button type="button" className={utilityButtonClass} onClick={trim}>Render trimmed WAV</button><DownloadButton blob={output} filename="trimmed-audio.wav" /></div></>}</div>;
};

// Keep transcription uploads below Vercel's 4.5 MB function request ceiling,
// including multipart overhead. Local-only conversion can use the larger limit.
const TRANSCRIPTION_MAX_BYTES = 4 * 1024 * 1024;
const LOCAL_CONVERSION_MAX_BYTES = 100 * 1024 * 1024;
const supportedMediaPattern = /\.(mp3|wav|m4a|mp4|mov|webm|ogg|flac)$/i;

export const VideoAudioTranscriberTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<TranscriptionLanguage>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<'idle' | 'processing' | 'ready' | 'error'>('idle');
  const [error, setError] = useState('');

  const selectFile = (selected: File) => {
    setError(''); setTranscript(''); setDetectedLanguage(''); setProgress(0); setState('idle');
    if (!supportedMediaPattern.test(selected.name) && !selected.type.startsWith('audio/') && !selected.type.startsWith('video/')) {
      setError('Choose an MP3, WAV, M4A, MP4, MOV, WebM, OGG, or FLAC file.'); setState('error'); return;
    }
    if (selected.size > TRANSCRIPTION_MAX_BYTES) { setError('Media files must be 4 MB or smaller.'); setState('error'); return; }
    setFile(selected);
  };

  const transcribe = async () => {
    if (!file) return;
    setState('processing'); setError(''); setProgress(5);
    try {
      const result = await requestTranscription(file, { language, onProgress: setProgress });
      setTranscript(result.text); setDetectedLanguage(result.detectedLanguage || ''); setState('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transcription failed.'); setState('error'); setProgress(0);
    }
  };

  const reset = () => { setFile(null); setTranscript(''); setDetectedLanguage(''); setProgress(0); setState('idle'); setError(''); };
  return <div className="space-y-4">
    <UtilityMessage tone="info">Transcription uses the configured server-side provider only when you start processing. Auto-detect is recommended for Hindi-English mixed speech; English and Hindi can be selected to guide the provider. Output stays in the spoken language: this tool does not translate, label speakers, or add timestamps.</UtilityMessage>
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
      <FilePicker accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov,.webm,.ogg,.flac" onFile={selectFile} label={file ? file.name : 'Choose or drop media'} helper="MP3, WAV, M4A, MP4, MOV, WebM, OGG, or FLAC up to 4 MB per server upload." />
      <label className="space-y-1 text-xs text-muted-foreground">Speech language
        <select value={language} onChange={(event) => setLanguage(event.target.value as TranscriptionLanguage)} className={utilityInputClass}>
          <option value="auto">Auto-detect (best for mixed speech)</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </label>
    </div>
    {file && <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/50 p-3 text-xs"><div><strong className="block text-foreground">{file.name}</strong><span className="text-muted-foreground">{formatBytes(file.size)} · {file.type || 'format reported by filename'}</span></div><button type="button" className={utilityQuietButtonClass} onClick={reset}>Remove file</button></div>}
    {state === 'processing' && <div className="space-y-2" role="status"><div className="flex justify-between text-xs text-muted-foreground"><span>Waiting for transcription provider…</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div></div>}
    {error && <UtilityMessage>{error.includes('not configured') || error.includes('TRANSCRIPTION') ? <>{error} Configure the server-side transcription variables described in `.env.example`.</> : error}</UtilityMessage>}
    {file && state !== 'processing' && <button type="button" className={utilityButtonClass} onClick={transcribe}>Transcribe media</button>}
    {transcript && <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><label className="block text-xs font-semibold text-foreground" htmlFor="transcript-output">Editable transcript</label>{detectedLanguage && <span className="text-xs text-muted-foreground">Provider detected: {detectedLanguage}</span>}</div><textarea id="transcript-output" value={transcript} onChange={(event) => setTranscript(event.target.value)} rows={12} className={`${utilityInputClass} min-h-48`} /><div className="flex flex-wrap gap-2"><CopyButton value={transcript} label="Copy Transcript" /><button type="button" className={utilityQuietButtonClass} onClick={() => downloadText(transcript, `${file?.name.replace(/\.[^.]+$/, '') || 'transcript'}.txt`)}>Download TXT</button></div></div>}
  </div>;
};

export const Mp4ToMp3Tool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState('192k');
  const [filename, setFilename] = useState('converted-audio.mp3');
  const [output, setOutput] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const selectFile = (selected: File) => {
    setOutput(null); setError('');
    if ((!selected.type.startsWith('video/') && !/\.mp4$/i.test(selected.name))) { setFile(null); setError('Choose an MP4 video file.'); return; }
    if (selected.size > LOCAL_CONVERSION_MAX_BYTES) { setFile(null); setError('For browser stability, MP4 files must be 100 MB or smaller.'); return; }
    setFile(selected); setFilename(`${selected.name.replace(/\.[^.]+$/, '') || 'converted-audio'}.mp3`);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true); setProgress(0); setError(''); setOutput(null);
    try {
      const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([import('@ffmpeg/ffmpeg'), import('@ffmpeg/util')]);
      const ffmpeg = new FFmpeg();
      ffmpeg.on('progress', ({ progress: current }) => setProgress(Math.min(99, Math.round(current * 100))));
      await ffmpeg.load({
        coreURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js', 'text/javascript'),
        wasmURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm', 'application/wasm'),
      });
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-codec:a', 'libmp3lame', '-b:a', bitrate, 'output.mp3']);
      const data = await ffmpeg.readFile('output.mp3');
      if (!data || typeof data === 'string' || data.length === 0) throw new Error('The converter produced no MP3 output. The video may have no audio track or use an unsupported codec.');
      setOutput(new Blob([data], { type: 'audio/mpeg' })); setProgress(100);
      await ffmpeg.deleteFile('input.mp4'); await ffmpeg.deleteFile('output.mp3');
    } catch (err) {
      setError(err instanceof Error ? err.message : `MP4 to MP3 conversion failed: ${String(err)}`); setProgress(0);
    } finally { setProcessing(false); }
  };

  return <div className="space-y-4"><UtilityMessage tone="info">Conversion runs locally with a lazily loaded FFmpeg WebAssembly runtime. The runtime is downloaded when conversion starts; your video is not uploaded to this site.</UtilityMessage><FilePicker accept="video/mp4,.mp4" onFile={selectFile} label={file ? file.name : 'Choose or drop an MP4'} helper="MP4 video up to 100 MB; the original file stays unchanged." />{file && <div className="grid gap-3 sm:grid-cols-[1fr_140px]"><label className="space-y-1 text-xs text-muted-foreground">Output filename<input value={filename} onChange={(event) => setFilename(event.target.value.replace(/[^A-Za-z0-9._-]/g, '-'))} className={utilityInputClass} /></label><label className="space-y-1 text-xs text-muted-foreground">Bitrate<select value={bitrate} onChange={(event) => setBitrate(event.target.value)} className={utilityInputClass}><option value="128k">128 kbps</option><option value="192k">192 kbps</option><option value="256k">256 kbps</option><option value="320k">320 kbps</option></select></label></div>}{error && <UtilityMessage>{error}</UtilityMessage>}{processing && <div className="space-y-2" role="status"><div className="flex justify-between text-xs text-muted-foreground"><span>Converting locally…</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div></div>}{file && !processing && <button type="button" className={utilityButtonClass} onClick={convert}>Convert to MP3</button>}{output && <UtilityMessage tone="success">Verified MP3 output ready ({formatBytes(output.size)}).</UtilityMessage>}{output && <DownloadButton blob={output} filename={filename.endsWith('.mp3') ? filename : `${filename}.mp3`} label="Download MP3" />}</div>;
};

export const YoutubeVideoDownloaderTool: React.FC = () => {
  const [input, setInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [result, setResult] = useState<{ videoId: string; normalizedUrl: string } | null>(null);
  const [error, setError] = useState('');
  const inspect = () => { try { setResult(parseYoutubeUrl(input)); setError(''); } catch (err) { setResult(null); setError(err instanceof Error ? err.message : 'Invalid YouTube URL.'); } };
  return <div className="space-y-4"><UtilityMessage tone="info">Validation and creator workflow only. This utility does not download YouTube videos, access private content, bypass DRM, or call undocumented downloader endpoints.</UtilityMessage><div className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} className={utilityInputClass} placeholder="https://youtube.com/watch?v=..." /><button type="button" className={utilityButtonClass} onClick={inspect}>Validate URL</button></div>{error && <UtilityMessage>{error}</UtilityMessage>}{result && <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4"><div className="grid gap-3 sm:grid-cols-2"><div><span className="block text-xs text-muted-foreground">Detected video ID</span><code className="text-sm text-foreground">{result.videoId}</code></div><div><span className="block text-xs text-muted-foreground">Normalized watch URL</span><a href={result.normalizedUrl} target="_blank" rel="noreferrer" className="break-all text-xs text-primary hover:underline">{result.normalizedUrl}</a></div></div><p className="text-xs text-muted-foreground">For videos you own, use YouTube Studio's official download/export controls.</p><a href="https://studio.youtube.com/" target="_blank" rel="noreferrer" className={utilityQuietButtonClass}>Open YouTube Studio</a></div>}</div>;
};

export const InstagramVideoDownloaderTool: React.FC = () => {
  const [input, setInput] = useState('https://www.instagram.com/reel/example/');
  const [result, setResult] = useState<{ shortcode: string; normalizedUrl: string; kind: string } | null>(null);
  const [error, setError] = useState('');
  const inspect = () => { try { setResult(parseInstagramUrl(input)); setError(''); } catch (err) { setResult(null); setError(err instanceof Error ? err.message : 'Invalid Instagram URL.'); } };
  return <div className="space-y-4"><UtilityMessage tone="info">Validation and authorized workflow only. This utility does not scrape Instagram, access private posts, store credentials or cookies, or claim to download inaccessible media.</UtilityMessage><div className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} className={utilityInputClass} placeholder="https://www.instagram.com/reel/..." /><button type="button" className={utilityButtonClass} onClick={inspect}>Validate URL</button></div>{error && <UtilityMessage>{error}</UtilityMessage>}{result && <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4"><div className="grid gap-3 sm:grid-cols-2"><div><span className="block text-xs text-muted-foreground">Recognized media</span><strong className="text-sm text-foreground">Instagram {result.kind} · {result.shortcode}</strong></div><div><span className="block text-xs text-muted-foreground">Normalized URL</span><a href={result.normalizedUrl} target="_blank" rel="noreferrer" className="break-all text-xs text-primary hover:underline">{result.normalizedUrl}</a></div></div><p className="text-xs text-muted-foreground">For your own content, use Instagram's official download or Accounts Center data export tools. A recognized URL is not proof that media is accessible or downloadable.</p><a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noreferrer" className={utilityQuietButtonClass}>Open official data export</a></div>}</div>;
};
