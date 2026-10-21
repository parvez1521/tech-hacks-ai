import React, { useMemo, useState } from 'react';
import { CopyButton, UtilityMessage, utilityButtonClass, utilityInputClass, utilityQuietButtonClass, downloadText } from './UtilityShared';

const splitLines = (value: string) => value.replace(/\r\n/g, '\n').split('\n');

function lineDiff(left: string, right: string) {
  const a = splitLines(left);
  const b = splitLines(right);
  const table = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const result: { kind: 'same' | 'removed' | 'added'; text: string }[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      result.push({ kind: 'same', text: a[i] });
      i += 1;
      j += 1;
    } else if (j < b.length && (i === a.length || table[i][j + 1] >= table[i + 1][j])) {
      result.push({ kind: 'added', text: b[j] });
      j += 1;
    } else {
      result.push({ kind: 'removed', text: a[i] });
      i += 1;
    }
  }
  return result;
}

export const TextDiffTool: React.FC = () => {
  const [left, setLeft] = useState('The quick brown fox\njumps over the lazy dog.');
  const [right, setRight] = useState('The quick blue fox\njumps over the very lazy dog.');
  const diff = useMemo(() => lineDiff(left, right), [left, right]);
  const report = diff.map((line) => `${line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '} ${line.text}`).join('\n');

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-xs text-muted-foreground">Original<textarea value={left} onChange={(e) => setLeft(e.target.value)} rows={8} className={utilityInputClass} /></label>
        <label className="space-y-1 text-xs text-muted-foreground">Changed<textarea value={right} onChange={(e) => setRight(e.target.value)} rows={8} className={utilityInputClass} /></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{diff.filter((line) => line.kind !== 'same').length} changed lines</span>
        <div className="flex gap-2"><CopyButton value={report} label="Copy diff" /><button type="button" className={utilityQuietButtonClass} onClick={() => downloadText(report, 'text-diff.txt')}>Download</button></div>
      </div>
      <pre className="max-h-80 overflow-auto rounded-xl border border-border bg-card p-4 text-xs leading-6"><code>{diff.map((line, index) => <span key={`${line.kind}-${index}`} className={`block ${line.kind === 'added' ? 'bg-emerald-500/10 text-emerald-300' : line.kind === 'removed' ? 'bg-red-500/10 text-red-300' : 'text-secondary-foreground'}`}>{line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '} {line.text || ' '}</span>)}</code></pre>
    </div>
  );
};

const toSlug = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const toWords = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLowerCase().split(/\s+/).filter(Boolean);

export const SlugGeneratorTool: React.FC = () => {
  const [input, setInput] = useState('Café & Tea — 2026');
  const words = toWords(input);
  const outputs = {
    slug: toSlug(input),
    kebab: words.join('-'),
    snake: words.join('_'),
    camel: words.map((word, index) => index ? word[0].toUpperCase() + word.slice(1) : word).join(''),
    pascal: words.map((word) => word[0].toUpperCase() + word.slice(1)).join(''),
  };
  return <div className="space-y-4"><label className="block space-y-1 text-xs text-muted-foreground">Source text<input value={input} onChange={(e) => setInput(e.target.value)} className={utilityInputClass} /></label>{!words.length && <UtilityMessage>Enter at least one letter or number to generate an identifier.</UtilityMessage>}<div className="grid gap-3 sm:grid-cols-2">{Object.entries(outputs).map(([key, value]) => <div key={key} className="rounded-lg border border-border bg-card/50 p-3"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{key}</span><div className="flex items-center justify-between gap-2"><code className="break-all text-sm text-foreground">{value || '—'}</code><CopyButton value={value} label="Copy" /></div></div>)}</div></div>;
};

export const MarkdownTableBuilderTool: React.FC = () => {
  const [columns, setColumns] = useState('Name, Description, Status');
  const [rows, setRows] = useState('Tech Hacks AI | Tool discovery | Active\nLocal-first | Browser processing | Ready');
  const result = useMemo(() => {
    const headers = columns.split(',').map((cell) => cell.trim()).filter(Boolean);
    if (!headers.length) return '';
    const parsedRows = rows.split('\n').filter((row) => row.trim()).map((row) => row.split('|').map((cell) => cell.trim().replace(/\|/g, '\\|')));
    const normalize = (row: string[]) => headers.map((_, index) => row[index] || '');
    return [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...parsedRows.map((row) => `| ${normalize(row).join(' | ')} |`)].join('\n');
  }, [columns, rows]);
  return <div className="space-y-4"><label className="block space-y-1 text-xs text-muted-foreground">Column names, comma separated<input value={columns} onChange={(e) => setColumns(e.target.value)} className={utilityInputClass} /></label><label className="block space-y-1 text-xs text-muted-foreground">Rows, one per line; separate cells with <code>|</code><textarea value={rows} onChange={(e) => setRows(e.target.value)} rows={6} className={utilityInputClass} /></label><div className="flex justify-end"><CopyButton value={result} label="Copy Markdown" /></div><pre className="overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{result || 'Add at least one column.'}</code></pre></div>;
};

export const UnicodeInspectorTool: React.FC = () => {
  const [value, setValue] = useState('Café 😀 — नमस्ते');
  const graphemes = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value), (item) => item.segment) : Array.from(value);
  const codePoints = Array.from(value).map((char) => `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')} ${char}`);
  return <div className="space-y-4"><textarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} maxLength={100000} className={utilityInputClass} placeholder="Paste text to inspect Unicode details..." /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-lg border border-border bg-card/50 p-3"><strong className="block text-xl text-foreground">{graphemes.length}</strong><span className="text-xs text-muted-foreground">Graphemes</span></div><div className="rounded-lg border border-border bg-card/50 p-3"><strong className="block text-xl text-foreground">{Array.from(value).length}</strong><span className="text-xs text-muted-foreground">Code points</span></div><div className="rounded-lg border border-border bg-card/50 p-3"><strong className="block text-xl text-foreground">{value.length}</strong><span className="text-xs text-muted-foreground">UTF-16 units</span></div><div className="rounded-lg border border-border bg-card/50 p-3"><strong className="block text-xl text-foreground">{new TextEncoder().encode(value).length}</strong><span className="text-xs text-muted-foreground">UTF-8 bytes</span></div></div><div className="flex justify-end"><CopyButton value={codePoints.join('\n')} label="Copy code points" /></div><pre className="max-h-52 overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{codePoints.join('\n') || 'Nothing to inspect.'}</code></pre></div>;
};

const encodeEntities = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));
const decodeEntities = (value: string) => { const area = document.createElement('textarea'); area.innerHTML = value; return area.value; };

export const HtmlEntityCodecTool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('<h1>Keep this as text</h1> & safe');
  const result = mode === 'encode' ? encodeEntities(input) : (typeof document !== 'undefined' ? decodeEntities(input) : input);
  return <div className="space-y-4"><div className="flex gap-2"><button type="button" className={mode === 'encode' ? utilityButtonClass : utilityQuietButtonClass} onClick={() => setMode('encode')}>Encode</button><button type="button" className={mode === 'decode' ? utilityButtonClass : utilityQuietButtonClass} onClick={() => setMode('decode')}>Decode</button></div><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} maxLength={200000} className={utilityInputClass} placeholder="Paste HTML or entity text..." /><div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">Safe text transform — never executed as HTML.</span><CopyButton value={result} label="Copy result" /></div><pre className="overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{result}</code></pre></div>;
};

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"' && quoted && input[i + 1] === '"') { cell += '"'; i += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === ',' && !quoted) { row.push(cell); cell = ''; continue; }
    if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && input[i + 1] === '\n') i += 1; row.push(cell); rows.push(row); row = []; cell = ''; continue; }
    cell += char;
  }
  if (quoted) throw new Error('Unclosed quoted field.');
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const stringifyCsv = (rows: string[][]) => rows.map((row) => row.map((cell) => /[",\n\r]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell).join(',')).join('\n');

export const CsvJsonConverterTool: React.FC = () => {
  const [mode, setMode] = useState<'csv-json' | 'json-csv'>('csv-json');
  const [input, setInput] = useState('name,score\nAda,10\nLinus,9');
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');
  const convert = () => {
    try {
      if (mode === 'csv-json') {
        const rows = parseCsv(input);
        if (rows.length < 2) throw new Error('CSV needs a header row and at least one data row.');
        const headers = rows[0].map((header) => header.trim());
        if (headers.some((header) => !header)) throw new Error('Every CSV column needs a header.');
        setOutput(JSON.stringify(rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']))), null, 2));
      } else {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed) || !parsed.every((item) => item && typeof item === 'object' && !Array.isArray(item))) throw new Error('JSON-to-CSV expects an array of objects.');
        const headers = Array.from(new Set(parsed.flatMap((item) => Object.keys(item))));
        setOutput(stringifyCsv([headers, ...parsed.map((item) => headers.map((header) => item[header] == null ? '' : String(item[header])))]));
      }
      setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to convert input.'); setOutput(''); }
  };
  return <div className="space-y-4"><div className="flex flex-wrap gap-2"><button type="button" className={mode === 'csv-json' ? utilityButtonClass : utilityQuietButtonClass} onClick={() => { setMode('csv-json'); setOutput(''); setError(''); }}>CSV → JSON</button><button type="button" className={mode === 'json-csv' ? utilityButtonClass : utilityQuietButtonClass} onClick={() => { setMode('json-csv'); setOutput(''); setError(''); }}>JSON → CSV</button></div><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={9} maxLength={1000000} className={`${utilityInputClass} font-mono text-xs`} /><button type="button" className={utilityButtonClass} onClick={convert}>Convert</button>{error && <UtilityMessage>{error}</UtilityMessage>}{output && <div className="space-y-2"><div className="flex justify-end"><CopyButton value={output} label="Copy output" /></div><pre className="max-h-80 overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{output}</code></pre></div>}</div>;
};
