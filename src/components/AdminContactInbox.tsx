import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Check, RefreshCw, Trash2 } from 'lucide-react';

type Status = 'new' | 'read' | 'resolved' | 'spam';
interface Message {
  id: string; name: string; email: string; subject: string; message: string;
  status: Status; created_at: string; updated_at: string;
}
export const AdminContactInbox: React.FC<{ token: string | null }> = ({ token }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    if (!token) { setError('Admin session missing. Unlock the dashboard again.'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/contact?action=inbox', { headers: { 'x-admin-token': token }, cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true || !Array.isArray(result.messages)) {
        throw new Error(response.status === 401 ? 'Admin passkey rejected. Sign out and unlock the dashboard again.' : (result.message || 'Could not load the inbox.'));
      }
      setMessages(result.messages);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not load the inbox.'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  const update = async (message: Message, status: Status) => {
    if (!token) return;
    setBusyId(message.id); setError(''); setNotice('');
    try {
      const response = await fetch('/api/contact?id=' + encodeURIComponent(message.id), {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ status }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true || !result.message) throw new Error(result.message || 'Could not update this message.');
      setMessages((items) => items.map((item) => item.id === message.id ? result.message : item));
      setNotice('Message marked as ' + status + '.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not update this message.'); }
    finally { setBusyId(null); }
  };

  const remove = async (message: Message) => {
    if (!token || !confirm('Permanently delete this contact message? This cannot be undone.')) return;
    setBusyId(message.id); setError(''); setNotice('');
    try {
      const response = await fetch('/api/contact?id=' + encodeURIComponent(message.id), {
        method: 'DELETE', headers: { 'x-admin-token': token },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error(result.message || 'Could not delete this message.');
      setMessages((items) => items.filter((item) => item.id !== message.id));
      setNotice('Message deleted.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not delete this message.'); }
    finally { setBusyId(null); }
  };

  const shown = filter === 'all' ? messages : messages.filter((item) => item.status === filter);
  const count = (status: Status) => messages.filter((item) => item.status === status).length;
  const labels: Record<string, string> = {
    general: 'General feedback', 'tool-suggestion': 'Tool suggestion', 'pricing-correction': 'Pricing correction',
    'bug-report': 'Bug or broken link', copyright: 'Copyright / trademark', privacy: 'Privacy request',
    security: 'Security concern', other: 'Other',
  };

  return (
    <section className="space-y-5" aria-labelledby="admin-contact-inbox-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="admin-contact-inbox-heading" className="text-xl font-bold text-foreground">Contact inbox</h2>
          <p className="mt-1 text-sm text-muted-foreground">Private visitor messages. This inbox is available only after admin authentication.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50">
          <RefreshCw className={'h-4 w-4 ' + (loading ? 'animate-spin' : '')} /> Refresh inbox
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['Total', messages.length], ['New', count('new')], ['Read', count('read')], ['Resolved', count('resolved')]].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-card/70 p-4">
            <div className="text-xs font-semibold text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="contact-inbox-filter" className="text-xs font-semibold text-muted-foreground">Filter messages</label>
        <select id="contact-inbox-filter" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="min-h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground sm:w-56">
          <option value="all">All statuses</option><option value="new">New</option><option value="read">Read</option><option value="resolved">Resolved</option><option value="spam">Spam</option>
        </select>
      </div>

      {notice && <div className="flex items-start gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900" role="status"><Check className="mt-0.5 h-4 w-4 shrink-0" />{notice}</div>}
      {error && <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {loading ? (
        <div className="rounded-xl border border-border bg-card/70 p-8 text-center text-sm text-muted-foreground">Loading contact messages…</div>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/70 p-8 text-center"><h3 className="font-semibold text-foreground">No messages in this view</h3><p className="mt-1 text-sm text-muted-foreground">New submissions appear here once secure contact intake is enabled.</p></div>
      ) : (
        <div className="space-y-3">
          {shown.map((message) => (
            <article key={message.id} className="min-w-0 rounded-2xl border border-border bg-card/70 p-4 sm:p-5">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-base font-bold text-foreground">{message.name}</h3><span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{message.status}</span></div>
                  <a href={'mailto:' + message.email} className="mt-1 block break-all text-sm text-primary underline underline-offset-2">{message.email}</a>
                  <p className="mt-1 text-xs text-muted-foreground">{labels[message.subject] || message.subject} · {new Date(message.created_at).toLocaleString()}</p>
                </div>
                <span className="shrink-0 rounded-lg border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">#{message.id.slice(0, 8)}</span>
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">{message.message}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                {message.status !== 'read' && message.status !== 'resolved' && <button type="button" onClick={() => void update(message, 'read')} disabled={busyId === message.id} className="min-h-9 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50">Mark read</button>}
                {message.status !== 'resolved' && <button type="button" onClick={() => void update(message, 'resolved')} disabled={busyId === message.id} className="min-h-9 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/20 disabled:opacity-50">Resolve</button>}
                {message.status !== 'spam' && <button type="button" onClick={() => void update(message, 'spam')} disabled={busyId === message.id} className="min-h-9 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 disabled:opacity-50">Mark spam</button>}
                <button type="button" onClick={() => void remove(message)} disabled={busyId === message.id} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
