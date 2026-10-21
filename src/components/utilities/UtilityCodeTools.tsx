import React, { useMemo, useState } from 'react';
import { CopyButton, UtilityMessage, utilityButtonClass, utilityInputClass, utilityQuietButtonClass } from './UtilityShared';

const safeTypeName = (value: string, fallback: string) => {
  const name = value.replace(/[^a-zA-Z0-9_$]/g, ' ').split(/\s+/).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join('');
  return /^[A-Za-z_$]/.test(name) ? name : fallback;
};

function inferType(value: unknown, name: string, interfaces: string[], depth = 0): string {
  if (value === null) return 'unknown';
  if (Array.isArray(value)) {
    if (!value.length) return 'unknown[]';
    const types = Array.from(new Set(value.map((item) => inferType(item, `${name}Item`, interfaces, depth + 1))));
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`;
  }
  if (typeof value === 'object') {
    const interfaceName = safeTypeName(name, `Nested${depth}`);
    if (!interfaces.some((item) => item.startsWith(`interface ${interfaceName} `))) {
      const body = Object.entries(value as Record<string, unknown>).map(([key, child]) => `  ${/^[$A-Z_a-z][$\w]*$/.test(key) ? key : JSON.stringify(key)}: ${inferType(child, safeTypeName(key, 'Value'), interfaces, depth + 1)};`).join('\n');
      interfaces.push(`interface ${interfaceName} {\n${body}\n}`);
    }
    return interfaceName;
  }
  if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
  return typeof value;
}

export const JsonToTypeScriptTool: React.FC = () => {
  const [input, setInput] = useState('{"user":{"id":1,"name":"Ada","roles":["admin"]},"active":true}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      if (parsed === null || typeof parsed !== 'object') throw new Error('The root JSON value must be an object or array.');
      const interfaces: string[] = [];
      const rootType = inferType(parsed, 'Root', interfaces);
      setOutput(`${interfaces.reverse().join('\n\n')}\n\nexport type Root = ${rootType};`);
      setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Invalid JSON.'); setOutput(''); }
  };
  return <div className="space-y-4"><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={9} maxLength={500000} className={`${utilityInputClass} font-mono text-xs`} /><div className="flex items-center justify-between gap-2"><button type="button" className={utilityButtonClass} onClick={convert}>Generate interfaces</button><CopyButton value={output} label="Copy TypeScript" disabled={!output} /></div>{error && <UtilityMessage>{error}</UtilityMessage>}{output && <pre className="max-h-80 overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{output}</code></pre>}</div>;
};

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState('\\b[A-Z][a-z]+\\b');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('Ada built a Tool. Linus reviewed the Tool.');
  const [replacement, setReplacement] = useState('[$&]');
  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(input.matchAll(new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`)));
      return { matches, replacement: input.replace(regex, replacement), error: '' };
    } catch (err) { return { matches: [], replacement: '', error: err instanceof Error ? err.message : 'Invalid regular expression.' }; }
  }, [pattern, flags, input, replacement]);
  return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-[1fr_100px]"><label className="space-y-1 text-xs text-muted-foreground">Pattern<input value={pattern} onChange={(e) => setPattern(e.target.value)} className={`${utilityInputClass} font-mono`} /></label><label className="space-y-1 text-xs text-muted-foreground">Flags<input value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^dgimsuvy]/g, ''))} className={`${utilityInputClass} font-mono`} /></label></div><label className="block space-y-1 text-xs text-muted-foreground">Test text<textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} maxLength={200000} className={utilityInputClass} /></label><label className="block space-y-1 text-xs text-muted-foreground">Replacement preview<input value={replacement} onChange={(e) => setReplacement(e.target.value)} className={utilityInputClass} /></label>{result.error ? <UtilityMessage>{result.error}</UtilityMessage> : <><div className="rounded-lg border border-border bg-card/50 p-3 text-xs text-secondary-foreground">{result.matches.length} match{result.matches.length === 1 ? '' : 'es'}: {result.matches.map((match, index) => <code key={`${match.index}-${index}`} className="ml-1 rounded bg-muted px-1.5 py-0.5 text-foreground">{match[0]} @ {match.index}</code>)}</div><div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">Replacement preview</span><CopyButton value={result.replacement} label="Copy" /></div><pre className="overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{result.replacement}</code></pre></>}</div>;
};

type QueryPair = { key: string; value: string };
export const UrlQueryBuilderTool: React.FC = () => {
  const [input, setInput] = useState('https://example.com/search?q=browser%20tools&tag=local&tag=private');
  const [pairs, setPairs] = useState<QueryPair[]>([]);
  const [base, setBase] = useState('');
  const [error, setError] = useState('');
  const parse = () => {
    try {
      const url = new URL(input);
      setBase(`${url.origin}${url.pathname}${url.hash}`);
      setPairs(Array.from(url.searchParams.entries()).map(([key, value]) => ({ key, value })));
      setError('');
    } catch { setError('Enter a complete URL, including https:// or http://.'); }
  };
  const output = base ? `${base}${pairs.length ? `?${pairs.map((pair) => `${encodeURIComponent(pair.key)}=${encodeURIComponent(pair.value)}`).join('&')}` : ''}` : '';
  return <div className="space-y-4"><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className={utilityInputClass} /><button type="button" className={utilityButtonClass} onClick={parse}>Parse</button></div>{error && <UtilityMessage>{error}</UtilityMessage>}{pairs.length > 0 && <div className="space-y-2">{pairs.map((pair, index) => <div className="grid grid-cols-[1fr_1fr_auto] gap-2" key={`${pair.key}-${index}`}><input aria-label={`Query key ${index + 1}`} value={pair.key} onChange={(e) => setPairs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, key: e.target.value } : item))} className={utilityInputClass} /><input aria-label={`Query value ${index + 1}`} value={pair.value} onChange={(e) => setPairs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: e.target.value } : item))} className={utilityInputClass} /><button type="button" className={utilityQuietButtonClass} onClick={() => setPairs((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div>)}<button type="button" className={utilityQuietButtonClass} onClick={() => setPairs((current) => [...current, { key: '', value: '' }])}>Add parameter</button></div>}{output && <div className="space-y-2"><div className="flex justify-end"><CopyButton value={output} label="Copy URL" /></div><pre className="overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{output}</code></pre></div>}</div>;
};

const specificityOf = (selector: string) => {
  const ids = (selector.match(/#[\w-]+/g) || []).length;
  const classes = (selector.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) || []).length;
  const elements = (selector.replace(/#[\w-]+|\.[\w-]+|\[[^\]]+\]|:{1,2}[\w-]+/g, '').match(/(^|[\s>+~])([a-zA-Z][\w-]*)/g) || []).length;
  return [ids, classes, elements] as const;
};

export const CssSpecificityTool: React.FC = () => {
  const [selector, setSelector] = useState('#app .card:hover');
  const [ids, classes, elements] = specificityOf(selector);
  return <div className="space-y-4"><input value={selector} onChange={(e) => setSelector(e.target.value)} className={`${utilityInputClass} font-mono`} placeholder=".card:hover" /><div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-lg border border-border bg-card/50 p-4"><strong className="block text-2xl text-foreground">{ids}</strong><span className="text-xs text-muted-foreground">IDs</span></div><div className="rounded-lg border border-border bg-card/50 p-4"><strong className="block text-2xl text-foreground">{classes}</strong><span className="text-xs text-muted-foreground">Classes</span></div><div className="rounded-lg border border-border bg-card/50 p-4"><strong className="block text-2xl text-foreground">{elements}</strong><span className="text-xs text-muted-foreground">Elements</span></div></div><p className="text-center font-mono text-sm text-primary">Specificity: ({ids}, {classes}, {elements})</p></div>;
};

export const CssGradientTool: React.FC = () => {
  const [first, setFirst] = useState('#2563eb');
  const [second, setSecond] = useState('#7c3aed');
  const [angle, setAngle] = useState(135);
  const css = `linear-gradient(${angle}deg, ${first} 0%, ${second} 100%)`;
  return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><label className="space-y-1 text-xs text-muted-foreground">Start color<input type="color" value={first} onChange={(e) => setFirst(e.target.value)} className="h-10 w-full rounded border border-border bg-muted" /></label><label className="space-y-1 text-xs text-muted-foreground">End color<input type="color" value={second} onChange={(e) => setSecond(e.target.value)} className="h-10 w-full rounded border border-border bg-muted" /></label><label className="space-y-1 text-xs text-muted-foreground">Angle: {angle}°<input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="mt-3 w-full" /></label></div><div className="h-32 rounded-xl border border-border" style={{ background: css }} aria-label="Gradient preview" /><div className="flex items-center justify-between gap-2"><code className="break-all text-xs text-secondary-foreground">background: {css};</code><CopyButton value={`background: ${css};`} label="Copy CSS" /></div></div>;
};
