import React, { useState } from 'react';
import { AlertCircle, Check, Copy, Download, FileUp } from 'lucide-react';

export const utilityInputClass = 'w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
export const utilityButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50';
export const utilityQuietButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-50';

export const UtilityMessage: React.FC<{ children: React.ReactNode; tone?: 'error' | 'success' | 'info' }> = ({ children, tone = 'error' }) => {
  const styles = {
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    info: 'border-primary/25 bg-primary/10 text-secondary-foreground',
  }[tone];

  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${styles}`} role={tone === 'error' ? 'alert' : 'status'}>
      {tone === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : null}
      <span>{children}</span>
    </div>
  );
};

export const CopyButton: React.FC<{ value: string; label?: string; disabled?: boolean }> = ({ value, label = 'Copy', disabled = false }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value || disabled) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className={utilityQuietButtonClass} onClick={copy} disabled={disabled || !value}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  );
};

export const DownloadButton: React.FC<{ blob: Blob | null; filename: string; label?: string; disabled?: boolean }> = ({ blob, filename, label = 'Download', disabled = false }) => {
  const download = () => {
    if (!blob || disabled) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button type="button" className={utilityButtonClass} onClick={download} disabled={disabled || !blob}>
      <Download className="h-3.5 w-3.5" />
      {label}
    </button>
  );
};

export const FilePicker: React.FC<{
  accept?: string;
  onFile: (file: File) => void;
  label?: string;
  helper?: string;
  disabled?: boolean;
}> = ({ accept, onFile, label = 'Choose a file', helper = 'Processed locally in this browser.' }) => {
  const id = React.useId();
  const [isDragging, setIsDragging] = useState(false);
  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };
  return (
    <div
      className={`rounded-xl border-2 border-dashed ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-card/40'} p-5 text-center transition-colors`}
      onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFiles(event.dataTransfer.files); }}
    >
      <input id={id} type="file" accept={accept} className="sr-only" onChange={(event) => {
        handleFiles(event.target.files);
        event.currentTarget.value = '';
      }} />
      <label htmlFor={id} className="flex cursor-pointer flex-col items-center gap-2">
        <FileUp className="h-7 w-7 text-primary" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{helper} Drop a file here or choose one.</span>
      </label>
    </div>
  );
};

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

export const downloadText = (text: string, filename: string, type = 'text/plain') => {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
