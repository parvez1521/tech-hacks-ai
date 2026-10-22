import React, { useState } from 'react';
import { Link } from '../router/Router';
import { promptCategories } from '../data/promptsData';
import { ArrowLeft, CheckCircle2, Loader2, Send, ShieldCheck } from 'lucide-react';

const fieldClass = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

export const SubmitPromptPage: React.FC = () => {
  const [form, setForm] = useState({ title: '', promptText: '', category: 'human-portraits', tags: '', targetModel: '', provider: '', previewImage: '', previewImageAlt: '', visualStyle: '', aspectRatio: '4:5', sourceCreator: '', sourceUrl: '', attributionUrl: '', rightsStatus: 'original', rightsLicense: '', rightsConfirmed: false, mediaType: 'image', videoSourceUrl: '', videoUrl: '', description: '' });
  const [websiteHp, setWebsiteHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch('/api/prompt-submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), website_hp: websiteHp }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Prompt could not be submitted.');
      setSubmitted(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Prompt could not be submitted.'); }
    finally { setBusy(false); }
  };
  if (submitted) return <main className="mx-auto max-w-2xl px-4 py-16 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" /><h1 className="mt-4 text-3xl font-bold">Prompt submitted for review</h1><p className="mt-3 text-slate-600 dark:text-slate-300">Your submission is saved as a draft. It will not appear in the public library until a moderator reviews and publishes it.</p><Link to="/prompt-library" className="mt-6 inline-flex rounded-lg bg-teal-800 px-4 py-2 text-white">Back to prompt library</Link></main>;
  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><Link to="/prompt-library" className="inline-flex items-center gap-2 text-sm text-teal-800 hover:underline dark:text-teal-300"><ArrowLeft size={16} /> Prompt library</Link><div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8"><div className="flex gap-3"><div className="rounded-xl bg-teal-50 p-3 text-teal-800 dark:bg-teal-950 dark:text-teal-200"><ShieldCheck /></div><div><h1 className="text-2xl font-bold">Submit a prompt</h1><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Share a complete recipe and preview. Submissions are saved as drafts and reviewed before publication.</p></div></div>
    {error && <p role="alert" className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
    <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold sm:col-span-2">Title<input required minLength={5} maxLength={120} className={fieldClass} value={form.title} onChange={(event) => update('title', event.target.value)} /></label>
      <label className="text-sm font-semibold sm:col-span-2">Complete prompt<textarea required minLength={40} maxLength={12000} rows={8} className={fieldClass} value={form.promptText} onChange={(event) => update('promptText', event.target.value)} /></label>
      <label className="text-sm font-semibold">Category<select className={fieldClass} value={form.category} onChange={(event) => update('category', event.target.value)}>{promptCategories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
      <label className="text-sm font-semibold">Image or video prompt<select className={fieldClass} value={form.mediaType} onChange={(event) => update('mediaType', event.target.value)}><option value="image">Image prompt</option><option value="video">Video prompt</option></select></label>
      <label className="text-sm font-semibold">AI model<input required className={fieldClass} value={form.targetModel} onChange={(event) => update('targetModel', event.target.value)} placeholder="e.g. FLUX.1" /></label>
      <label className="text-sm font-semibold">Provider<input required className={fieldClass} value={form.provider} onChange={(event) => update('provider', event.target.value)} placeholder="e.g. Black Forest Labs" /></label>
      <label className="text-sm font-semibold">Visual style<input className={fieldClass} value={form.visualStyle} onChange={(event) => update('visualStyle', event.target.value)} placeholder="e.g. cinematic editorial" /></label>
      <label className="text-sm font-semibold">Aspect ratio<input className={fieldClass} value={form.aspectRatio} onChange={(event) => update('aspectRatio', event.target.value)} placeholder="e.g. 4:5" /></label>
      <label className="text-sm font-semibold sm:col-span-2">Tags, comma separated<input className={fieldClass} value={form.tags} onChange={(event) => update('tags', event.target.value)} /></label>
      <label className="text-sm font-semibold sm:col-span-2">Preview image URL (HTTPS)<input required type="url" className={fieldClass} value={form.previewImage} onChange={(event) => update('previewImage', event.target.value)} /></label>
      <label className="text-sm font-semibold sm:col-span-2">Preview description<input required maxLength={240} className={fieldClass} value={form.previewImageAlt} onChange={(event) => update('previewImageAlt', event.target.value)} /></label>
      <label className="text-sm font-semibold">Creator attribution<input required className={fieldClass} value={form.sourceCreator} onChange={(event) => update('sourceCreator', event.target.value)} /></label>
      <label className="text-sm font-semibold">Rights status<select className={fieldClass} value={form.rightsStatus} onChange={(event) => update('rightsStatus', event.target.value)}><option value="original">My original content</option><option value="licensed">Licensed content</option><option value="permission-granted">Written permission granted</option></select></label>
      <label className="text-sm font-semibold">Source URL<input type="url" className={fieldClass} value={form.sourceUrl} onChange={(event) => update('sourceUrl', event.target.value)} placeholder="https://…" /></label>
      <label className="text-sm font-semibold">Attribution URL<input type="url" className={fieldClass} value={form.attributionUrl} onChange={(event) => update('attributionUrl', event.target.value)} placeholder="https://…" /></label>
      <label className="text-sm font-semibold sm:col-span-2">License or permission details<input required={form.rightsStatus !== 'original'} className={fieldClass} value={form.rightsLicense} onChange={(event) => update('rightsLicense', event.target.value)} placeholder="Required for licensed or permission-granted media" /></label>
      {form.mediaType === 'video' && <><label className="text-sm font-semibold">Video source page<input type="url" className={fieldClass} value={form.videoSourceUrl} onChange={(event) => update('videoSourceUrl', event.target.value)} /></label><label className="text-sm font-semibold">Authorized video URL<input type="url" className={fieldClass} value={form.videoUrl} onChange={(event) => update('videoUrl', event.target.value)} /></label></>}
      <label className="hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={websiteHp} onChange={(event) => setWebsiteHp(event.target.value)} /></label>
      <label className="flex items-start gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:col-span-2"><input required type="checkbox" checked={form.rightsConfirmed} onChange={(event) => setForm((current) => ({ ...current, rightsConfirmed: event.target.checked }))} className="mt-1" />I confirm I created this prompt and preview or have documented permission/license rights to submit and display them. External preview images require a source URL, creator attribution, and license or written permission details.</label>
      <div className="sm:col-span-2"><button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Submit for moderation</button></div>
    </form>
  </div></main>;
};
