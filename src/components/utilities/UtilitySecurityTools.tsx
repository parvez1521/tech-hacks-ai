import React, { useMemo, useState } from 'react';
import { CopyButton, FilePicker, UtilityMessage, formatBytes, utilityButtonClass, utilityInputClass, utilityQuietButtonClass } from './UtilityShared';

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const JwtDecoderTool: React.FC = () => {
  const [token, setToken] = useState('');
  const decoded = useMemo(() => {
    if (!token.trim()) return { header: '', payload: '', error: '' };
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) throw new Error('A JWT must contain exactly three dot-separated segments.');
      return {
        header: JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2),
        payload: JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2),
        error: '',
      };
    } catch (err) {
      return { header: '', payload: '', error: err instanceof Error ? err.message : 'Unable to decode token.' };
    }
  }, [token]);
  return <div className="space-y-4"><UtilityMessage tone="info">Decode only: this tool does not verify signatures, issuer claims, or authentication. Never paste production secrets into a shared screen.</UtilityMessage><textarea value={token} onChange={(e) => setToken(e.target.value)} rows={6} className={`${utilityInputClass} font-mono text-xs`} placeholder="Paste a JWT here..." />{decoded.error && <UtilityMessage>{decoded.error}</UtilityMessage>}{token && !decoded.error && <div className="grid gap-4 md:grid-cols-2"><div><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-foreground">Header</span><CopyButton value={decoded.header} label="Copy" /></div><pre className="max-h-72 overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{decoded.header}</code></pre></div><div><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-foreground">Payload</span><CopyButton value={decoded.payload} label="Copy" /></div><pre className="max-h-72 overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-secondary-foreground"><code>{decoded.payload}</code></pre></div></div>}</div>;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const makeUuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const UuidTool: React.FC = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const generate = () => { try { setValue(makeUuid()); setError(''); } catch { setError('Secure random UUID generation is unavailable in this browser.'); } };
  const valid = value ? uuidPattern.test(value.trim()) : null;
  return <div className="space-y-4"><div className="flex gap-2"><input value={value} onChange={(e) => setValue(e.target.value)} className={`${utilityInputClass} font-mono`} placeholder="Generate or validate a UUID" /><button type="button" className={utilityButtonClass} onClick={generate}>Generate</button></div>{error && <UtilityMessage>{error}</UtilityMessage>}{valid !== null && <UtilityMessage tone={valid ? 'success' : 'error'}>{valid ? 'Valid RFC 4122 UUID v1–v8 format.' : 'This value is not a valid versioned UUID.'}</UtilityMessage>}{value && <div className="flex justify-end"><CopyButton value={value} label="Copy UUID" /></div>}</div>;
};

const charsets = { lowercase: 'abcdefghijklmnopqrstuvwxyz', uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', numbers: '0123456789', symbols: '!@#$%^&*()-_=+[]{}' };
export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(20);
  const [enabled, setEnabled] = useState({ lowercase: true, uppercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const generate = () => {
    const groups = Object.entries(enabled).filter(([, selected]) => selected).map(([name]) => charsets[name as keyof typeof charsets]);
    if (!groups.length) return;
    const pool = groups.join('');
    const bytes = crypto.getRandomValues(new Uint32Array(length));
    const chars = groups.map((group, index) => group[bytes[index] % group.length]);
    while (chars.length < length) chars.push(pool[bytes[chars.length] % pool.length]);
    for (let i = chars.length - 1; i > 0; i -= 1) { const j = bytes[i] % (i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
    setPassword(chars.join(''));
  };
  return <div className="space-y-4"><label className="block text-xs text-muted-foreground">Length: {length}<input type="range" min="8" max="256" value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-2 w-full" /></label><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{Object.keys(charsets).map((name) => <label key={name} className="flex items-center gap-2 rounded-lg border border-border bg-card/50 p-2 text-xs text-foreground"><input type="checkbox" checked={enabled[name as keyof typeof enabled]} onChange={(e) => setEnabled((current) => ({ ...current, [name]: e.target.checked }))} />{name}</label>)}</div><div className="flex gap-2"><input readOnly value={password} className={`${utilityInputClass} font-mono`} placeholder="Generate a secure password" /><button type="button" className={utilityButtonClass} onClick={generate}>Generate</button></div><div className="flex justify-end"><CopyButton value={password} label="Copy password" /></div><UtilityMessage tone="info">Uses the browser's cryptographic random generator. Passwords are not saved or sent anywhere.</UtilityMessage></div>;
};

export const TextHashTool: React.FC = () => {
  const [input, setInput] = useState('abc');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const calculate = async () => {
    try {
      if (!crypto.subtle) throw new Error('Web Crypto requires a secure HTTPS context.');
      const buffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
      setHash(Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join(''));
      setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to hash this input.'); setHash(''); }
  };
  return <div className="space-y-4"><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} maxLength={500000} className={utilityInputClass} /><div className="flex flex-wrap gap-2"><select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className={utilityInputClass}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select><button type="button" className={utilityButtonClass} onClick={calculate}>Hash text</button></div>{error && <UtilityMessage>{error}</UtilityMessage>}{hash && <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"><code className="break-all text-xs text-secondary-foreground">{hash}</code><CopyButton value={hash} label="Copy" /></div>}</div>;
};

export const FileChecksumTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const calculate = async (selected: File) => {
    setFile(selected); setHash('');
    if (selected.size > 100 * 1024 * 1024) { setError('For browser stability, checksum files must be 100 MB or smaller.'); return; }
    try {
      const buffer = await crypto.subtle.digest(algorithm, await selected.arrayBuffer());
      setHash(Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')); setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to read or hash the file.'); }
  };
  return <div className="space-y-4"><FilePicker accept="*/*" onFile={calculate} label={file ? file.name : 'Choose a file to checksum'} helper="Maximum 100 MB; file bytes stay in browser memory." /><select value={algorithm} onChange={(e) => { setAlgorithm(e.target.value); if (file) calculate(file); }} className={utilityInputClass}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select>{error && <UtilityMessage>{error}</UtilityMessage>}{hash && <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"><span className="text-xs text-muted-foreground">{formatBytes(file?.size || 0)}</span><code className="break-all text-xs text-secondary-foreground">{hash}</code><CopyButton value={hash} label="Copy" /></div>}</div>;
};
