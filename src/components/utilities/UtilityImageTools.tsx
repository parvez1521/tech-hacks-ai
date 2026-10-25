import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { FilePicker, UtilityMessage, CopyButton, DownloadButton, utilityButtonClass, utilityInputClass, utilityQuietButtonClass } from './UtilityShared';

type LoadedImage = { file: File; url: string; width: number; height: number };
const loadImage = (file: File): Promise<LoadedImage> => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file); const image = new Image();
  image.onload = () => resolve({ file, url, width: image.naturalWidth, height: image.naturalHeight });
  image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The browser could not decode this image.')); };
  image.src = url;
});

export const ImageCropperTool: React.FC = () => {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) throw new Error('Choose a raster image file.');
      if (file.size > 25 * 1024 * 1024) throw new Error('Images must be 25 MB or smaller.');
      const loaded = await loadImage(file);
      if (image) URL.revokeObjectURL(image.url);
      setImage(loaded);
      setCrop({ x: 0, y: 0, width: loaded.width, height: loaded.height });
      setBlob(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load image.');
    }
  };

  const updateCropValue = (field: 'x' | 'y' | 'width' | 'height', rawValue: string) => {
    if (!image || rawValue.trim() === '') {
      setError('Enter a whole-number crop coordinate or size.');
      return;
    }
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      setError('Crop values must be valid numbers.');
      return;
    }

    setCrop((current) => {
      const value = Math.round(parsed);
      const next = { ...current };
      if (field === 'x') next.x = Math.max(0, Math.min(image.width - current.width, value));
      if (field === 'y') next.y = Math.max(0, Math.min(image.height - current.height, value));
      if (field === 'width') next.width = Math.max(1, Math.min(image.width - current.x, value));
      if (field === 'height') next.height = Math.max(1, Math.min(image.height - current.y, value));
      return next;
    });
    setBlob(null);
    setError('');
  };

  const render = () => {
    if (!image) return;
    if (
      ![crop.x, crop.y, crop.width, crop.height].every(Number.isInteger) ||
      crop.width < 1 || crop.height < 1 ||
      crop.x < 0 || crop.y < 0 ||
      crop.x + crop.width > image.width ||
      crop.y + crop.height > image.height
    ) {
      setError('Choose a valid crop rectangle that stays inside the image.');
      setBlob(null);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const context = canvas.getContext('2d');
    if (!context) {
      setError('Canvas is unavailable in this browser.');
      return;
    }

    const source = new Image();
    source.onload = () => {
      context.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
      canvas.toBlob((value) => {
        if (!value) {
          setBlob(null);
          setError('The browser could not export this crop. Try PNG or WebP.');
          return;
        }
        setBlob(value);
        setError('');
      }, format, 0.9);
    };
    source.onerror = () => {
      setBlob(null);
      setError('The selected image could not be decoded for cropping.');
    };
    source.src = image.url;
  };

  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.url);
  }, [image]);

  return (
    <div className="space-y-4">
      <FilePicker
        accept="image/png,image/jpeg,image/webp"
        onFile={handleFile}
        label={image ? image.file.name : 'Choose an image to crop'}
        helper="PNG, JPEG, or WebP up to 25 MB; local Canvas processing."
      />
      {error && <UtilityMessage>{error}</UtilityMessage>}
      {image && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-xs text-muted-foreground">
              X (left edge)
              <input type="number" min={0} max={Math.max(0, image.width - crop.width)} step={1} value={crop.x}
                onChange={(event) => updateCropValue('x', event.target.value)} className={utilityInputClass} />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Y (top edge)
              <input type="number" min={0} max={Math.max(0, image.height - crop.height)} step={1} value={crop.y}
                onChange={(event) => updateCropValue('y', event.target.value)} className={utilityInputClass} />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Width (px)
              <input type="number" min={1} max={image.width - crop.x} step={1} value={crop.width}
                onChange={(event) => updateCropValue('width', event.target.value)} className={utilityInputClass} />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Height (px)
              <input type="number" min={1} max={image.height - crop.y} step={1} value={crop.height}
                onChange={(event) => updateCropValue('height', event.target.value)} className={utilityInputClass} />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Original image: {image.width} × {image.height}px. Coordinates are clamped to the image bounds and rounded to whole pixels.
          </p>
          <div className="flex flex-wrap gap-2">
            <select value={format} onChange={(event) => { setFormat(event.target.value as typeof format); setBlob(null); }}
              className={utilityInputClass} aria-label="Crop output format">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
            <button type="button" className={utilityButtonClass} onClick={render}>Render crop</button>
            <DownloadButton blob={blob} filename={`crop.${format.split('/')[1]}`} />
          </div>
          {blob && <UtilityMessage tone="success">Crop ready: {crop.width} × {crop.height}px.</UtilityMessage>}
        </>
      )}
    </div>
  );
};

export const ImagePaletteTool: React.FC = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [error, setError] = useState('');
  const inspect = async (file: File) => {
    try {
      const image = await loadImage(file); const canvas = document.createElement('canvas'); const size = 64; canvas.width = size; canvas.height = size; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas is unavailable.');
      const source = new Image(); source.onload = () => { ctx.drawImage(source, 0, 0, size, size); const data = ctx.getImageData(0, 0, size, size).data; const buckets = new Map<string, number>(); for (let i = 0; i < data.length; i += 16) { if (data[i + 3] < 80) continue; const rgb = [data[i], data[i + 1], data[i + 2]].map((value) => Math.round(value / 32) * 32); const key = rgb.map((value) => Math.min(255, value)).join(','); buckets.set(key, (buckets.get(key) || 0) + 1); } setColors(Array.from(buckets.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([key]) => `#${key.split(',').map((value) => Number(value).toString(16).padStart(2, '0')).join('')}`)); URL.revokeObjectURL(image.url); setError(''); }; source.src = image.url;
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sample this image.'); }
  };
  return <div className="space-y-4"><FilePicker accept="image/png,image/jpeg,image/webp" onFile={inspect} label="Choose an image to sample" helper="Extracts dominant colors from a 64×64 local sample." />{error && <UtilityMessage>{error}</UtilityMessage>}{colors.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{colors.map((color) => <div key={color} className="overflow-hidden rounded-lg border border-border bg-card"><div className="h-20" style={{ background: color }} /><div className="flex items-center justify-between gap-2 p-2"><code className="text-xs text-foreground">{color}</code><CopyButton value={color} label="Copy" /></div></div>)}</div>}</div>;
};

export const FaviconGeneratorTool: React.FC = () => {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [links, setLinks] = useState<{ size: number; url: string }[]>([]);
  const [error, setError] = useState('');
  const create = async (file: File) => {
    try {
      const image = await loadImage(file); setSource(image); setLinks([]);
      const generated = await Promise.all([16, 32, 48, 180, 192].map(async (size) => {
        const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas unavailable.'); ctx.clearRect(0, 0, size, size);
        const loaded = new Image(); loaded.src = image.url; await new Promise<void>((resolve, reject) => { loaded.onload = () => resolve(); loaded.onerror = () => reject(new Error('Unable to decode image.')); }); ctx.drawImage(loaded, 0, 0, size, size); return { size, url: canvas.toDataURL('image/png') };
      }));
      setLinks(generated); setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to create favicon sizes.'); }
  };
  useEffect(() => () => { if (source) URL.revokeObjectURL(source.url); }, [source]);
  return <div className="space-y-4"><FilePicker accept="image/png,image/jpeg,image/webp" onFile={create} label={source ? source.file.name : 'Choose a square image'} helper="Exports 16, 32, 48, 180, and 192px PNG files locally." />{error && <UtilityMessage>{error}</UtilityMessage>}{links.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{links.map((item) => <a key={item.size} href={item.url} download={`favicon-${item.size}.png`} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 text-xs text-primary hover:border-primary/50"><img src={item.url} alt={`${item.size}px preview`} className="h-12 w-12 object-contain" /><span>{item.size}px download</span></a>)}</div>}</div>;
};

const sanitizeSvg = (input: string) => {
  const doc = new DOMParser().parseFromString(input, 'image/svg+xml');
  if (doc.querySelector('parsererror') || !doc.documentElement || doc.documentElement.nodeName.toLowerCase() !== 'svg') throw new Error('Input is not valid SVG markup.');
  doc.querySelectorAll('script, foreignObject, iframe, object, embed').forEach((node) => node.remove());
  doc.querySelectorAll('*').forEach((node) => { Array.from(node.attributes).forEach((attr) => { if (/^on/i.test(attr.name) || /^(href|src|xlink:href)$/i.test(attr.name) && /^(https?:|javascript:|data:)/i.test(attr.value)) node.removeAttribute(attr.name); }); });
  return new XMLSerializer().serializeToString(doc.documentElement).replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
};

export const SvgOptimizerTool: React.FC = () => {
  const [input, setInput] = useState('<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><!-- safe comment --><path fill="currentColor" d="M3 12h18" onclick="alert(1)"/></svg>');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const optimize = () => { try { setOutput(sanitizeSvg(input)); setError(''); } catch (err) { setOutput(''); setError(err instanceof Error ? err.message : 'Unable to parse SVG.'); } };
  return <div className="space-y-4"><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} maxLength={500000} className={`${utilityInputClass} font-mono text-xs`} /><div className="flex gap-2"><button type="button" className={utilityButtonClass} onClick={optimize}>Sanitize & optimize</button><CopyButton value={output} label="Copy SVG" disabled={!output} /></div>{error && <UtilityMessage>{error}</UtilityMessage>}{output && <><UtilityMessage tone="success">Safe SVG output ready. Scripts, event handlers, external references, comments, and excess whitespace were removed.</UtilityMessage><pre className="max-h-72 overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{output}</code></pre></>}</div>;
};
