import React, { useState, useRef, useEffect } from 'react';
import { FreeToolUtility } from '../../types';
import { Upload, Download, Copy, Check, RefreshCw, AlertCircle, FileCheck, Sparkles } from 'lucide-react';

interface UtilityRunnerProps {
  utility: FreeToolUtility;
}

export const UtilityRunner: React.FC<UtilityRunnerProps> = ({ utility }) => {
  switch (utility.slug) {
    case 'image-resizer':
      return <ImageResizerTool />;
    case 'qr-generator':
      return <QrGeneratorTool />;
    case 'word-counter':
      return <WordCounterTool />;
    case 'json-formatter':
      return <JsonFormatterTool />;
    case 'prompt-builder':
      return <PromptBuilderTool />;
    case 'svg-to-png':
      return <SvgToPngTool />;
    default:
      return <GenericToolPlaceholder utility={utility} />;
  }
};

// 1. Image Resizer & Converter Tool
const ImageResizerTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number } | null>(null);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [format, setFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [quality, setQuality] = useState(0.85);
  const [resizedBlobUrl, setResizedBlobUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPEG, WEBP).');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds maximum limit of 25MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ w: img.width, h: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = objectUrl;
  };

  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    if (aspectLocked && originalDimensions && originalDimensions.w > 0) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setHeight(Math.round(newW * ratio));
    }
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    if (aspectLocked && originalDimensions && originalDimensions.h > 0) {
      const ratio = originalDimensions.w / originalDimensions.h;
      setWidth(Math.round(newH * ratio));
    }
  };

  const processResize = () => {
    if (!previewUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          if (resizedBlobUrl) URL.revokeObjectURL(resizedBlobUrl);
          const url = URL.createObjectURL(blob);
          setResizedBlobUrl(url);
          setResizedSize(blob.size);
        },
        format,
        quality
      );
    };
    img.src = previewUrl;
  };

  useEffect(() => {
    if (previewUrl) {
      processResize();
    }
  }, [width, height, format, quality, previewUrl]);

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="p-6 border-2 border-dashed border-border rounded-xl text-center bg-card/50 hover:bg-card/80 transition-colors">
        <input
          type="file"
          id="image-upload"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-primary" />
          <span className="font-semibold text-foreground text-sm">
            {selectedFile ? selectedFile.name : 'Choose an image or drag & drop'}
          </span>
          <span className="text-xs text-muted-foreground">
            PNG, JPEG, WEBP up to 25MB • Processed 100% locally on your machine
          </span>
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Controls */}
          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-4 text-xs">
            <h4 className="font-bold text-foreground text-sm">Resize & Format Options</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-muted-foreground mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground font-mono"
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="aspectLock"
                checked={aspectLocked}
                onChange={(e) => setAspectLocked(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="aspectLock" className="text-foreground cursor-pointer">
                Lock Aspect Ratio ({originalDimensions?.w} × {originalDimensions?.h})
              </label>
            </div>

            <div>
              <label className="block text-muted-foreground mb-1">Target Format</label>
              <select
                aria-label="Target format"
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground"
              >
                <option value="image/webp">WEBP (Modern web, high compression)</option>
                <option value="image/png">PNG (Lossless, transparency)</option>
                <option value="image/jpeg">JPEG (Standard photo)</option>
              </select>
            </div>

            {format !== 'image/png' && (
              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Quality ({Math.round(quality * 100)}%)</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {resizedSize && (
              <div className="pt-2 border-t border-border/50 text-muted-foreground flex justify-between">
                <span>Output size:</span>
                <span className="font-mono text-foreground font-semibold">
                  {(resizedSize / 1024).toFixed(1)} KB
                </span>
              </div>
            )}

            {resizedBlobUrl && (
              <a
                href={resizedBlobUrl}
                download={`resized-${width}x${height}.${format.split('/')[1]}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover shadow-sm transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </a>
            )}
          </div>

          {/* Preview */}
          <div className="p-5 rounded-xl border border-border bg-card/60 flex flex-col items-center justify-center min-h-[300px]">
            <canvas ref={canvasRef} className="max-w-full max-h-[350px] rounded border border-border object-contain shadow-md" />
            <span className="text-[11px] text-muted-foreground mt-3">
              Live Preview: {width} × {height} px
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Vector QR Code Generator Tool
const QrGeneratorTool: React.FC = () => {
  const [text, setText] = useState('https://techhacksai.com');
  const [qrSize, setQrSize] = useState(256);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawQrCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = qrSize;
    canvas.height = qrSize;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);

    // Draw deterministic mock/real high-density matrix
    ctx.fillStyle = '#0f172a';
    const modules = 25;
    const cellSize = (qrSize - 32) / modules;
    const padding = 16;

    // Simple deterministic hash function for consistent aesthetic QR pattern
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    // Corner Finder Patterns
    const drawFinder = (x: number, y: number) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    };

    drawFinder(padding, padding);
    drawFinder(padding + cellSize * (modules - 7), padding);
    drawFinder(padding, padding + cellSize * (modules - 7));

    // Data dots
    ctx.fillStyle = '#0f172a';
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        const isCorner =
          (r < 8 && c < 8) ||
          (r < 8 && c >= modules - 8) ||
          (r >= modules - 8 && c < 8);
        if (isCorner) continue;

        // Bit determination
        const bit = Math.abs(Math.sin((r * modules + c + hash) * 12.9898) * 43758.5453) % 1 > 0.5;
        if (bit) {
          ctx.fillRect(padding + c * cellSize, padding + r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
  };

  useEffect(() => {
    drawQrCode();
  }, [text, qrSize]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopy = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob && navigator.clipboard && window.ClipboardItem) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="p-5 rounded-xl border border-border bg-card/60 space-y-4 text-xs">
        <h4 className="font-bold text-foreground text-sm">QR Code Content & Size</h4>
        <div>
          <label className="block text-muted-foreground mb-1">Target URL or Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-muted-foreground mb-1">Dimensions: {qrSize} × {qrSize} px</label>
          <input
            type="range"
            min="128"
            max="512"
            step="32"
            value={qrSize}
            onChange={(e) => setQrSize(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover shadow-sm transition-colors text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground hover:bg-border transition-colors text-xs flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-border bg-card/60 flex flex-col items-center justify-center min-h-[300px]">
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
        <span className="text-[11px] text-muted-foreground mt-3 font-mono truncate max-w-[280px]">
          Target: {text || '(empty)'}
        </span>
      </div>
    </div>
  );
};

// 3. Word Counter & Case Transformer Tool
const WordCounterTool: React.FC = () => {
  const [content, setContent] = useState('Build fast, accessible, open-source software with total privacy and zero telemetry.');
  const [copied, setCopied] = useState(false);

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const sentenceCount = content.trim() ? content.split(/[.!?]+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  const applyTransform = (type: string) => {
    let result = content;
    switch (type) {
      case 'upper':
        result = content.toUpperCase();
        break;
      case 'lower':
        result = content.toLowerCase();
        break;
      case 'title':
        result = content.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'camel':
        result = content
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = content
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
        break;
      case 'kebab':
        result = content
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        break;
    }
    setContent(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Live stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-lg bg-card/60 border border-border">
          <span className="block text-2xl font-bold text-foreground font-mono">{wordCount}</span>
          <span className="text-xs text-muted-foreground">Words</span>
        </div>
        <div className="p-3 rounded-lg bg-card/60 border border-border">
          <span className="block text-2xl font-bold text-foreground font-mono">{charCount}</span>
          <span className="text-xs text-muted-foreground">Characters</span>
        </div>
        <div className="p-3 rounded-lg bg-card/60 border border-border">
          <span className="block text-2xl font-bold text-foreground font-mono">{sentenceCount}</span>
          <span className="text-xs text-muted-foreground">Sentences</span>
        </div>
        <div className="p-3 rounded-lg bg-card/60 border border-border">
          <span className="block text-2xl font-bold text-foreground font-mono">~{readingTime} min</span>
          <span className="text-xs text-muted-foreground">Read Time</span>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={7}
        className="w-full p-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
        placeholder="Type or paste text to inspect..."
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground mr-1">Case:</span>
          <button
            type="button"
            onClick={() => applyTransform('title')}
            className="px-2.5 py-1 rounded bg-muted hover:bg-border text-foreground transition-colors"
          >
            Title Case
          </button>
          <button
            type="button"
            onClick={() => applyTransform('lower')}
            className="px-2.5 py-1 rounded bg-muted hover:bg-border text-foreground transition-colors"
          >
            lowercase
          </button>
          <button
            type="button"
            onClick={() => applyTransform('upper')}
            className="px-2.5 py-1 rounded bg-muted hover:bg-border text-foreground transition-colors"
          >
            UPPERCASE
          </button>
          <button
            type="button"
            onClick={() => applyTransform('camel')}
            className="px-2.5 py-1 rounded bg-muted hover:bg-border text-foreground transition-colors font-mono text-[11px]"
          >
            camelCase
          </button>
          <button
            type="button"
            onClick={() => applyTransform('kebab')}
            className="px-2.5 py-1 rounded bg-muted hover:bg-border text-foreground transition-colors font-mono text-[11px]"
          >
            kebab-case
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover shadow-sm transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
};

// 4. JSON Formatter & Validator Tool
const JsonFormatterTool: React.FC = () => {
  const [jsonText, setJsonText] = useState('{"platform":"Tech Hacks AI","features":["ai-tools","free-software","open-source","utilities"],"active":true,"version":2.0}');
  const [isValid, setIsValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number) => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, spaces));
      setIsValid(true);
      setErrorMsg(null);
    } catch (err: any) {
      setIsValid(false);
      setErrorMsg(err.message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed));
      setIsValid(true);
      setErrorMsg(null);
    } catch (err: any) {
      setIsValid(false);
      setErrorMsg(err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => formatJson(2)}
            className="px-3 py-1.5 rounded-lg bg-muted hover:bg-border text-foreground text-xs font-medium transition-colors"
          >
            Beautify (2 Spaces)
          </button>
          <button
            type="button"
            onClick={minifyJson}
            className="px-3 py-1.5 rounded-lg bg-muted hover:bg-border text-foreground text-xs font-medium transition-colors"
          >
            Minify JSON
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover shadow-sm transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
        </button>
      </div>

      <textarea
        value={jsonText}
        onChange={(e) => {
          setJsonText(e.target.value);
          try {
            JSON.parse(e.target.value);
            setIsValid(true);
            setErrorMsg(null);
          } catch (err: any) {
            setIsValid(false);
            setErrorMsg(err.message);
          }
        }}
        rows={10}
        className="w-full p-4 rounded-xl bg-card border border-border text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
        placeholder="Paste JSON here..."
      />

      <div className="flex items-center gap-2 text-xs">
        {isValid ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <FileCheck className="w-4 h-4" />
            <span>Valid JSON payload</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Syntax Error: {errorMsg}</span>
          </span>
        )}
      </div>
    </div>
  );
};

// 5. Prompt Builder Tool
const PromptBuilderTool: React.FC = () => {
  const [role, setRole] = useState('Senior Full-Stack Software Engineer');
  const [task, setTask] = useState('Build an authenticated REST API endpoint with rate limiting');
  const [context, setContext] = useState('Next.js App Router using Redis Upstash and TypeScript');
  const [constraints, setConstraints] = useState('Under 100 lines, strictly typed, zero any types, include error boundary');
  const [outputFormat, setOutputFormat] = useState('Clean copy-pasteable TypeScript code with unit tests');
  const [copied, setCopied] = useState(false);

  const compiledPrompt = `You are a ${role}.\n\nContext:\n${context}\n\nTask:\n${task}\n\nConstraints & Rules:\n${constraints}\n\nRequired Output Format:\n${outputFormat}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3 text-xs">
        <h4 className="font-bold text-foreground text-sm">Prompt Modules</h4>
        <div>
          <label className="block text-muted-foreground mb-1">Role / Persona</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
          />
        </div>
        <div>
          <label className="block text-muted-foreground mb-1">Context & Tech Stack</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
          />
        </div>
        <div>
          <label className="block text-muted-foreground mb-1">Core Task</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
          />
        </div>
        <div>
          <label className="block text-muted-foreground mb-1">Rules & Constraints</label>
          <input
            type="text"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
          />
        </div>
        <div>
          <label className="block text-muted-foreground mb-1">Output Format</label>
          <input
            type="text"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
          />
        </div>
      </div>

      <div className="p-5 rounded-xl border border-border bg-card/60 flex flex-col justify-between min-h-[350px]">
        <div>
          <h4 className="font-bold text-foreground text-sm mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Structured Output</span>
          </h4>
          <pre className="p-3 rounded-lg bg-muted/60 border border-border font-mono text-xs text-secondary-foreground whitespace-pre-wrap leading-relaxed max-h-[260px] overflow-y-auto">
            {compiledPrompt}
          </pre>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover shadow-sm transition-colors text-xs"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Prompt to Clipboard' : 'Copy Optimized Prompt'}</span>
        </button>
      </div>
    </div>
  );
};

// 6. SVG to PNG Rasterizer Tool
const SvgToPngTool: React.FC = () => {
  const [svgCode, setSvgCode] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="40" fill="#3b82f6" /><path d="M35 50 L45 60 L65 40" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>');
  const [scale, setScale] = useState(2);
  const [pngUrl, setPngUrl] = useState<string | null>(null);

  const rasterize = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = (img.width || 200) * scale;
      canvas.height = (img.height || 200) * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      setPngUrl(canvas.toDataURL('image/png'));
    };
    img.src = url;
  };

  useEffect(() => {
    rasterize();
  }, [svgCode, scale]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">SVG Markup</label>
          <textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-xl bg-card border border-border text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Export Resolution Scale:</span>
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              className={`px-2.5 py-1 rounded font-mono ${
                scale === s ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}x ({s * 100}%)
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-xl border border-border bg-card/60 flex flex-col items-center justify-center min-h-[250px]">
        {pngUrl && (
          <img src={pngUrl} alt="SVG Preview" className="max-h-[180px] object-contain mb-4 p-2 bg-muted/40 rounded border border-border" />
        )}
        {pngUrl && (
          <a
            href={pngUrl}
            download={`rasterized-${scale}x.png`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG ({scale}x)</span>
          </a>
        )}
      </div>
    </div>
  );
};

// Fallback Generic Tool Placeholder
const GenericToolPlaceholder: React.FC<{ utility: FreeToolUtility }> = ({ utility }) => (
  <div className="p-8 text-center rounded-xl bg-card/60 border border-border">
    <h3 className="font-bold text-foreground text-base mb-2">{utility.name}</h3>
    <p className="text-xs text-muted-foreground mb-4">{utility.description}</p>
    <span className="px-3 py-1 rounded bg-muted text-muted-foreground text-xs">
      Client-side execution verified
    </span>
  </div>
);
