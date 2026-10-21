import React, { useCallback, useEffect, useState } from 'react';
import { Check, FilePlus2, Loader2, Save, Trash2, X } from 'lucide-react';
import type { PromptItem } from '../types/index.ts';

type PromptStatus = 'draft' | 'pending' | 'published' | 'rejected';
type ManagedPrompt = PromptItem & { status?: PromptStatus };

const blankPrompt = (): ManagedPrompt => ({
  id: `editorial-${Date.now()}`, title: '', slug: '', description: '', category: 'ai-image-generation',
  targetModel: 'Gemini', provider: 'Google', promptText: '', tags: [], authorOrSource: 'Tech Hacks AI editorial team',
  previewImage: '/prompts/digital-garden.svg', visualStyle: 'Conceptual', aspectRatio: '1:1', status: 'draft',
});

export const AdminPromptManager: React.FC<{ token: string }> = ({ token }) => {
  const [prompts, setPrompts] = useState<ManagedPrompt[]>([]);
  const [selected, setSelected] = useState<ManagedPrompt | null>(null);
  const [form, setForm] = useState<ManagedPrompt>(blankPrompt);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/prompts?admin=1', { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to load prompt entries.');
      setPrompts(body.prompts || []);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load prompt entries.'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const beginNew = () => { setSelected(null); setForm(blankPrompt()); setNotice(''); setError(''); };
  const beginEdit = (prompt: ManagedPrompt) => { setSelected(prompt); setForm({ ...prompt, tags: [...(prompt.tags || [])] }); setNotice(''); setError(''); };
  const change = (key: keyof ManagedPrompt, value: string | string[]) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (status = form.status || 'draft') => {
    setSaving(true); setError(''); setNotice('');
    const slug = form.slug.trim() || form.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = { ...form, slug, id: form.id || `editorial-${slug}`, tags: Array.isArray(form.tags) ? form.tags : [] };
    try {
      const url = selected ? `/api/prompts?slug=${encodeURIComponent(selected.slug)}` : '/api/prompts';
      const response = await fetch(url, {
        method: selected ? 'PATCH' : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: payload, status }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not save this prompt.');
      setSelected(body.prompt); setForm(body.prompt); setNotice(`Prompt ${status === 'published' ? 'published' : 'saved'} successfully.`); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save this prompt.'); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!selected || !window.confirm(`Delete “${selected.title}”? This cannot be undone.`)) return;
    setSaving(true); setError('');
    try {
      const response = await fetch(`/api/prompts?slug=${encodeURIComponent(selected.slug)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not delete this prompt.');
      setNotice('Prompt deleted.'); beginNew(); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not delete this prompt.'); }
    finally { setSaving(false); }
  };

  const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60';
  return <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(280px,.7fr)_minmax(0,1.3fr)]" aria-label="Prompt library administration">
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-bold text-foreground">Prompt entries</h2><p className="mt-1 text-xs text-muted-foreground">Review drafts and published recipes.</p></div><button type="button" onClick={beginNew} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><FilePlus2 size={14} /> New</button></div>
      {loading ? <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Loader2 className="animate-spin" size={16} />Loading library…</p> : prompts.length ? <ul className="divide-y divide-border">{prompts.map((prompt) => <li key={prompt.id}><button type="button" onClick={() => beginEdit(prompt)} className={`w-full py-3 text-left ${selected?.id === prompt.id ? 'text-primary' : 'text-foreground'}`}><span className="flex items-center justify-between gap-3"><span className="truncate text-sm font-semibold">{prompt.title}</span><span className="rounded-full border border-border px-2 py-0.5 text-[10px] capitalize text-muted-foreground">{prompt.status || 'published'}</span></span><span className="mt-1 block truncate text-xs text-muted-foreground">/{prompt.slug}</span></button></li>)}</ul> : <p className="py-6 text-sm text-muted-foreground">No database entries yet. The curated recipes remain available.</p>}
    </div>
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold text-foreground">{selected ? 'Edit prompt' : 'Create prompt'}</h2><p className="mt-1 text-xs text-muted-foreground">Add original or authorized content, with source attribution.</p></div>{selected && <button type="button" onClick={beginNew} aria-label="Create new prompt" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><FilePlus2 size={16} /></button>}</div>
      {error && <div role="alert" className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</div>}{notice && <p role="status" className="mb-4 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Title<input className={`${inputClass} mt-1`} value={form.title} onChange={(e) => change('title', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">URL slug<input className={`${inputClass} mt-1`} value={form.slug} onChange={(e) => change('slug', e.target.value)} placeholder="generated-from-title" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Category<input className={`${inputClass} mt-1`} value={form.category} onChange={(e) => change('category', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">AI provider<input className={`${inputClass} mt-1`} value={form.provider || ''} onChange={(e) => change('provider', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">AI model<input className={`${inputClass} mt-1`} value={form.targetModel} onChange={(e) => change('targetModel', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Visual style<input className={`${inputClass} mt-1`} value={form.visualStyle || ''} onChange={(e) => change('visualStyle', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Aspect ratio<input className={`${inputClass} mt-1`} value={form.aspectRatio || ''} onChange={(e) => change('aspectRatio', e.target.value)} placeholder="1:1" /></label>
        <label className="text-xs font-semibold text-muted-foreground sm:col-span-2">Short description<textarea className={`${inputClass} mt-1`} rows={2} value={form.description} onChange={(e) => change('description', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground sm:col-span-2">Full prompt<textarea className={`${inputClass} mt-1 font-mono`} rows={5} value={form.promptText} onChange={(e) => change('promptText', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Tags, comma separated<input className={`${inputClass} mt-1`} value={(form.tags || []).join(', ')} onChange={(e) => change('tags', e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Preview image path<input className={`${inputClass} mt-1`} value={form.previewImage || ''} onChange={(e) => change('previewImage', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Author / attribution<input className={`${inputClass} mt-1`} value={form.authorOrSource || ''} onChange={(e) => change('authorOrSource', e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Attribution URL<input className={`${inputClass} mt-1`} value={form.attributionUrl || ''} onChange={(e) => change('attributionUrl', e.target.value)} placeholder="https://…" /></label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <button type="button" disabled={saving} onClick={() => save('draft')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground disabled:opacity-50"><Save size={14} /> Save draft</button>
        <button type="button" disabled={saving} onClick={() => save('pending')} className="rounded-lg border border-amber-500/40 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 disabled:opacity-50">Submit for review</button>
        <button type="button" disabled={saving} onClick={() => save('published')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><Check size={14} /> Approve &amp; publish</button>
        {selected && <><button type="button" disabled={saving} onClick={() => save('rejected')} className="rounded-lg border border-rose-500/40 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 disabled:opacity-50">Reject</button><button type="button" disabled={saving} onClick={remove} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-500/10 disabled:opacity-50"><Trash2 size={14} /> Delete</button></>}
        {saving && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="animate-spin" size={14} />Saving</span>}
        {!saving && <button type="button" onClick={() => { setNotice(''); setError(''); }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Dismiss current message"><X size={14} /></button>}
      </div>
    </div>
  </section>;
};
