import React, { useCallback, useEffect, useState } from 'react';

type PromptCategory = { slug: string; name: string; description: string; displayOrder: number };

export const PromptCategoryManager: React.FC<{ token: string }> = ({ token }) => {
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [form, setForm] = useState<PromptCategory>({ slug: '', name: '', description: '', displayOrder: 100 });
  const [editingSlug, setEditingSlug] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/prompt-categories');
      const body = await response.json();
      if (response.ok) setCategories(body.categories || []);
    } catch { /* curated categories remain available without Supabase */ }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setNotice('');
    const category = { ...form, slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };
    try {
      const response = await fetch(editingSlug ? `/api/prompt-categories?slug=${encodeURIComponent(editingSlug)}` : '/api/prompt-categories', {
        method: editingSlug ? 'PATCH' : 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ category }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to save category.');
      setNotice('Category saved.'); setForm({ slug: '', name: '', description: '', displayOrder: 100 }); setEditingSlug(''); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save category.'); }
  };

  const remove = async (slug: string) => {
    if (!window.confirm(`Delete category “${slug}”? Prompt records are not deleted.`)) return;
    try {
      const response = await fetch(`/api/prompt-categories?slug=${encodeURIComponent(slug)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Unable to delete category.');
      await load(); setNotice('Category deleted.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete category.'); }
  };

  const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60';
  return <section className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="prompt-category-admin-title">
    <h2 id="prompt-category-admin-title" className="font-bold text-foreground">Prompt categories</h2>
    <p className="mt-1 text-xs text-muted-foreground">Curated categories stay available locally; database categories add to them when Supabase is configured.</p>
    {error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}{notice && <p role="status" className="mt-3 text-sm text-emerald-700">{notice}</p>}
    <div className="mt-3 flex flex-wrap gap-2">{categories.map((category) => <div key={category.slug} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs"><button type="button" onClick={() => { setForm(category); setEditingSlug(category.slug); }} className="font-semibold text-foreground hover:text-primary">{category.name}</button><button type="button" onClick={() => remove(category.slug)} aria-label={`Delete ${category.name} category`} className="text-muted-foreground hover:text-rose-600">×</button></div>)}</div>
    <form onSubmit={save} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-xs font-semibold text-muted-foreground">Name<input required className={`${inputClass} mt-1`} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
      <label className="text-xs font-semibold text-muted-foreground">Slug<input required className={`${inputClass} mt-1`} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
      <label className="text-xs font-semibold text-muted-foreground">Display order<input type="number" min="0" max="10000" className={`${inputClass} mt-1`} value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: Number(event.target.value) })} /></label>
      <label className="text-xs font-semibold text-muted-foreground">Description<input className={`${inputClass} mt-1`} maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
      <div className="sm:col-span-2 lg:col-span-4"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">{editingSlug ? 'Save category' : 'Add category'}</button>{editingSlug && <button type="button" onClick={() => { setEditingSlug(''); setForm({ slug: '', name: '', description: '', displayOrder: 100 }); }} className="ml-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold">Cancel edit</button>}</div>
    </form>
  </section>;
};
