import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Film, GraduationCap } from 'lucide-react';

type VideoInspirationType = 'video-example' | 'tutorial-template';

interface VideoInspirationEntry {
  id: string;
  title: string;
  summary: string;
  platform: string;
  model: string;
  category: string;
  sourceUrl: string;
  sourceName: string;
  creator: string;
  contentType: VideoInspirationType;
  promptAvailable: boolean;
  videoAvailableAtSource: boolean;
  embedStatus: string;
  checkedAt: string;
}

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; entries: VideoInspirationEntry[] };

function isEntry(value: unknown): value is VideoInspirationEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<VideoInspirationEntry>;
  return typeof entry.id === 'string' && typeof entry.title === 'string'
    && typeof entry.summary === 'string' && typeof entry.platform === 'string'
    && typeof entry.model === 'string' && typeof entry.category === 'string'
    && typeof entry.sourceUrl === 'string' && entry.sourceUrl.startsWith('https://')
    && typeof entry.sourceName === 'string' && typeof entry.creator === 'string'
    && (entry.contentType === 'video-example' || entry.contentType === 'tutorial-template')
    && typeof entry.promptAvailable === 'boolean' && typeof entry.videoAvailableAtSource === 'boolean'
    && typeof entry.embedStatus === 'string' && typeof entry.checkedAt === 'string';
}

export const VideoInspirationSection: React.FC = () => {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [selectedType, setSelectedType] = useState<'all' | VideoInspirationType>('all');

  useEffect(() => {
    let active = true;
    fetch('/video-inspiration.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Video inspiration request failed (${response.status})`);
        return response.json();
      })
      .then((body: unknown) => {
        if (!Array.isArray(body) || !body.every(isEntry)) throw new Error('Video inspiration data is invalid.');
        if (active) setLoadState({ status: 'ready', entries: body });
      })
      .catch(() => { if (active) setLoadState({ status: 'error' }); });
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => {
    if (loadState.status !== 'ready') return { examples: 0, tutorials: 0 };
    return {
      examples: loadState.entries.filter((entry) => entry.contentType === 'video-example').length,
      tutorials: loadState.entries.filter((entry) => entry.contentType === 'tutorial-template').length,
    };
  }, [loadState]);
  const entries = loadState.status === 'ready'
    ? loadState.entries.filter((entry) => selectedType === 'all' || entry.contentType === selectedType)
    : [];

  return (
    <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7" aria-labelledby="video-inspiration-heading" data-testid="video-inspiration-section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            <Film size={15} aria-hidden="true" /> AI Video Inspiration
          </div>
          <h2 id="video-inspiration-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Watch what video models can do</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Source-attributed examples and official workflow guides. Videos open on their original publisher; this page does not rehost or embed third-party media.
          </p>
        </div>
        {loadState.status === 'ready' && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter video inspiration">
            {([
              { value: 'all', label: 'All', count: counts.examples + counts.tutorials },
              { value: 'video-example', label: 'Video examples', count: counts.examples },
              { value: 'tutorial-template', label: 'Tutorials & templates', count: counts.tutorials },
            ] as const).map((option) => (
              <button key={option.value} type="button" aria-pressed={selectedType === option.value} onClick={() => setSelectedType(option.value)} className={`rounded-full px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${selectedType === option.value ? 'bg-teal-800 text-white dark:bg-teal-300 dark:text-slate-950' : 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}>
                {option.label} <span className="ml-1 opacity-75">{option.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loadState.status === 'loading' && <p role="status" className="mt-5 text-sm text-slate-500 dark:text-slate-400">Loading verified video sources…</p>}
      {loadState.status === 'error' && <p role="status" className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">Video inspiration could not be loaded. Your prompt library is still available below.</p>}
      {loadState.status === 'ready' && (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <article key={entry.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold text-slate-600 dark:text-slate-300">
                {entry.contentType === 'video-example' ? <Film size={13} aria-hidden="true" /> : <GraduationCap size={13} aria-hidden="true" />}
                <span>{entry.contentType === 'video-example' ? 'Video example' : 'Tutorial / template'}</span>
                <span aria-hidden="true">·</span><span>{entry.category}</span>
              </div>
              <h3 className="mt-2 text-base font-bold leading-snug text-slate-950 dark:text-white">{entry.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{entry.summary}</p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{entry.platform} · {entry.model}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">By {entry.creator} · checked {entry.checkedAt}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {entry.promptAvailable ? 'Prompt shown at source.' : 'No prompt provided at source.'}
                {' '}{entry.videoAvailableAtSource ? 'Video available at source.' : 'Tutorial page; no video example claimed.'}
              </p>
              <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-teal-700 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-teal-300 dark:text-teal-200 dark:hover:bg-teal-950/50">
                {entry.videoAvailableAtSource ? 'Watch / view original' : 'Open official guide'} <ExternalLink size={13} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
