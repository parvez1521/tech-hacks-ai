import React, { useEffect, useMemo, useState } from 'react';
import { parseYoutubeUrl } from '../../services/mediaWorkflowService';
import { FilePicker, UtilityMessage, CopyButton, formatBytes, utilityButtonClass, utilityInputClass, utilityQuietButtonClass } from './UtilityShared';

export const TimestampConverterTool: React.FC = () => {
  const [input, setInput] = useState('0');
  const [mode, setMode] = useState<'seconds' | 'milliseconds' | 'iso'>('seconds');
  const [error, setError] = useState('');
  const date = useMemo(() => {
    try {
      const value = mode === 'iso' ? new Date(input) : new Date(Number(input) * (mode === 'seconds' ? 1000 : 1));
      if (!input.trim() || Number.isNaN(value.getTime())) throw new Error('Enter a valid timestamp.');
      return value;
    } catch { return null; }
  }, [input, mode]);
  const result = date ? { iso: date.toISOString(), local: date.toLocaleString(), seconds: Math.floor(date.getTime() / 1000), milliseconds: date.getTime() } : null;
  return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-[1fr_180px]"><input value={input} onChange={(e) => { setInput(e.target.value); setError(''); }} className={`${utilityInputClass} font-mono`} placeholder="0" /><select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className={utilityInputClass}><option value="seconds">Unix seconds</option><option value="milliseconds">Unix milliseconds</option><option value="iso">ISO / date text</option></select></div>{!date && <UtilityMessage>{error || 'Enter a timestamp to convert.'}</UtilityMessage>}{result && <div className="grid gap-3 sm:grid-cols-2">{Object.entries(result).map(([key, value]) => <div key={key} className="rounded-lg border border-border bg-card/50 p-3"><span className="mb-1 block text-[11px] font-semibold uppercase text-muted-foreground">{key}</span><div className="flex items-center justify-between gap-2"><code className="break-all text-xs text-foreground">{value}</code><CopyButton value={String(value)} label="Copy" /></div></div>)}</div>}</div>;
};

export const ViewportInspectorTool: React.FC = () => {
  const read = () => ({ width: window.innerWidth, height: window.innerHeight, screen: `${window.screen.width} × ${window.screen.height}`, dpr: window.devicePixelRatio, orientation: window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape', colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'no-preference', pointer: window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine' });
  const [details, setDetails] = useState<ReturnType<typeof read> | null>(null);
  useEffect(() => {
    const update = () => setDetails(read());
    update(); window.addEventListener('resize', update); window.addEventListener('orientationchange', update);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('orientationchange', update); };
  }, []);
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{details ? Object.entries(details).map(([key, value]) => <div key={key} className="rounded-lg border border-border bg-card/50 p-3"><span className="block text-[11px] font-semibold uppercase text-muted-foreground">{key}</span><strong className="mt-1 block break-words text-sm text-foreground">{String(value)}</strong></div>) : <UtilityMessage tone="info">Reading browser capabilities…</UtilityMessage>}</div>;
};

const signatures: { name: string; mime: string; bytes: number[]; offset?: number }[] = [
  { name: 'PNG image', mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { name: 'JPEG image', mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { name: 'GIF image', mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { name: 'WebP image', mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] },
  { name: 'PDF document', mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] },
  { name: 'ZIP archive', mime: 'application/zip', bytes: [0x50, 0x4b, 0x03, 0x04] },
];

export const MimeSnifferTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [detected, setDetected] = useState<{ name: string; mime: string } | null>(null);
  const inspect = async (selected: File) => {
    setFile(selected);
    const bytes = new Uint8Array(await selected.slice(0, 16).arrayBuffer());
    const match = signatures.find((signature) => signature.bytes.every((byte, index) => bytes[(signature.offset || 0) + index] === byte));
    setDetected(match ? { name: match.name, mime: match.mime } : null);
  };
  return <div className="space-y-4"><FilePicker onFile={inspect} label={file ? file.name : 'Choose a file to inspect'} helper="Checks the first bytes locally; does not upload the file." />{file && <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-border bg-card/50 p-3"><span className="block text-xs text-muted-foreground">Declared type</span><strong className="text-sm text-foreground">{file.type || 'Unknown'}</strong></div><div className="rounded-lg border border-border bg-card/50 p-3"><span className="block text-xs text-muted-foreground">Detected signature</span><strong className="text-sm text-foreground">{detected ? `${detected.name} (${detected.mime})` : 'Unknown signature'}</strong></div></div>}{file && detected && file.type && file.type !== detected.mime && <UtilityMessage tone="info">The filename-declared MIME type differs from the detected file signature.</UtilityMessage>}</div>;
};

export const FileMetadataTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState('');
  const inspect = (selected: File) => {
    setFile(selected); setDimensions('');
    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected); const image = new Image();
      image.onload = () => { setDimensions(`${image.naturalWidth} × ${image.naturalHeight}`); URL.revokeObjectURL(url); };
      image.onerror = () => { setDimensions('Could not decode image'); URL.revokeObjectURL(url); }; image.src = url;
    }
  };
  return <div className="space-y-4"><FilePicker onFile={inspect} label={file ? file.name : 'Choose a local file'} helper="Shows browser-readable file details and image dimensions." />{file && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[['Name', file.name], ['Type', file.type || 'Unknown'], ['Size', formatBytes(file.size)], ['Modified', new Date(file.lastModified).toLocaleString()], ['Dimensions', dimensions || (file.type.startsWith('image/') ? 'Reading…' : 'Not applicable')]].map(([key, value]) => <div key={key} className="rounded-lg border border-border bg-card/50 p-3"><span className="block text-[11px] font-semibold uppercase text-muted-foreground">{key}</span><strong className="mt-1 block break-words text-xs text-foreground">{value}</strong></div>)}</div>}</div>;
};

export const YoutubeMetadataTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const parse = () => {
    try {
      const { videoId } = parseYoutubeUrl(input);
      setVideoId(videoId); setError('');
    } catch (err) { setVideoId(''); setError(err instanceof Error ? err.message : 'Invalid YouTube URL.'); }
  };
  return <div className="space-y-4"><UtilityMessage tone="info">URL recognition only; no video metadata is fetched or downloaded. For your own uploads, use YouTube Studio or Google Takeout.</UtilityMessage><div className="flex flex-col gap-2 sm:flex-row"><input aria-label="YouTube video URL" value={input} onChange={(e) => setInput(e.target.value)} className={utilityInputClass} placeholder="https://youtube.com/watch?v=..." /><button type="button" className={utilityButtonClass} onClick={parse}>Validate URL</button></div>{error && <UtilityMessage>{error}</UtilityMessage>}{videoId && <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4"><div className="grid gap-3 sm:grid-cols-2"><div><span className="block text-xs text-muted-foreground">Video ID</span><code className="text-sm text-foreground">{videoId}</code></div><div><span className="block text-xs text-muted-foreground">Official watch URL</span><a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer" className="break-all text-xs text-primary hover:underline">youtube.com/watch?v={videoId}</a></div></div><p className="text-xs text-muted-foreground">A valid URL only identifies a video; it does not confirm ownership or grant download access.</p><div className="flex flex-wrap gap-2"><a href="https://studio.youtube.com/" target="_blank" rel="noreferrer" className={utilityQuietButtonClass}>Open YouTube Studio</a><a href="https://takeout.google.com/" target="_blank" rel="noreferrer" className={utilityQuietButtonClass}>Open Google Takeout</a></div></div>}</div>;
};
