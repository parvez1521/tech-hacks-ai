import React from 'react';
import { ArrowLeft, ArrowUpRight, ExternalLink, GitFork, Github, Star, AlertCircle } from 'lucide-react';
import { Link, useRouter } from '../router/Router';
import { githubProjectCategories, listedGitHubProjects } from '../data/githubProjectsData';

const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
  : 'Not available';
const valueText = (value: boolean | null, yes: string, no: string) => value === null ? 'Not documented' : value ? yes : no;

export const GitHubProjectDetailPage: React.FC = () => {
  const { params } = useRouter();
  const project = listedGitHubProjects.find((item) => item.slug === params.slug);

  if (!project) {
    return <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">SwitchRoute / GitHub Projects</p>
      <h1 className="mt-3 text-3xl font-semibold text-foreground">Project not found</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">This repository may have been removed from the curated directory or its URL may have changed.</p>
      <Link to="/github-projects" className="mt-6 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"><ArrowLeft className="h-4 w-4" /> Back to GitHub Projects</Link>
    </main>;
  }

  const categoryNames = [project.primaryCategory, ...project.secondaryCategories]
    .map((id) => githubProjectCategories.find((category) => category.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const community = project.verificationStatus === 'community-unverified';
  const verificationLabel = community ? 'Community · Unverified'
    : project.verificationStatus === 'verified' ? 'Editorially verified'
    : project.verificationStatus === 'needs-review' ? 'Needs editorial review'
    : project.verificationStatus === 'license-unclear' ? 'License unclear'
    : 'Archived or unavailable';

  return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
    <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link to="/github-projects" className="inline-flex items-center gap-1.5 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> GitHub Projects</Link>
      <span aria-hidden="true">/</span><span className="text-foreground">{project.name}</span>
    </nav>

    <header className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-md border border-border px-2.5 py-1">{categoryNames[0] ?? 'GitHub repository'}</span>
        <span className={`rounded-md border px-2.5 py-1 ${community ? 'border-amber-500/40 text-amber-600 dark:text-amber-300' : 'border-border'}`}>{verificationLabel}</span>
        {project.featured && <span className="rounded-md border border-primary/40 px-2.5 py-1 text-primary">Featured</span>}
      </div>
      <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">{project.name}</h1>
      <p className="mt-2 break-all font-mono text-sm text-muted-foreground">{project.fullName}</p>
      <p className="mt-5 max-w-3xl text-base leading-7 text-foreground/90">{project.description}</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{project.longDescription}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"><Github className="h-4 w-4" /> Open repository <ArrowUpRight className="h-3.5 w-3.5" /></a>
        <a href={project.readmeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Read README <ExternalLink className="h-3.5 w-3.5" /></a>
        {project.documentationUrl && <a href={project.documentationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Documentation <ExternalLink className="h-3.5 w-3.5" /></a>}
        {project.homepageUrl && <a href={project.homepageUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Project website <ArrowUpRight className="h-3.5 w-3.5" /></a>}
      </div>
    </header>

    <section aria-label="Repository statistics" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">GitHub stars</p><p className="mt-2 flex items-center gap-2 text-xl font-semibold tabular-nums text-foreground"><Star className="h-4 w-4 text-muted-foreground" />{project.stars?.toLocaleString() ?? '—'}</p></div>
      <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Forks</p><p className="mt-2 flex items-center gap-2 text-xl font-semibold tabular-nums text-foreground"><GitFork className="h-4 w-4 text-muted-foreground" />{project.forks?.toLocaleString() ?? '—'}</p></div>
      <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Open issues</p><p className="mt-2 text-xl font-semibold tabular-nums text-foreground">{project.openIssues?.toLocaleString() ?? '—'}</p></div>
      <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Primary language</p><p className="mt-2 text-xl font-semibold text-foreground">{project.language ?? 'Not detected'}</p></div>
    </section>

    {community && <aside role="note" className="mt-5 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-6 text-muted-foreground">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
      <div><strong className="text-foreground">Unverified community project.</strong> This is an independent project, not an official Higgsfield product. GitHub does not detect a license and no root LICENSE file was found; the README's MIT claim therefore needs independent verification. The documented local setup routes inference through MuAPI and requires its API key. Review the source, license, security posture, and service terms before installing.</div>
    </aside>}

    <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">Repository details</h2>
        <dl className="mt-4 divide-y divide-border text-sm">
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">License</dt><dd className="max-w-[65%] text-right font-medium text-foreground">{project.licenseName ?? 'Not detected / unclear'}{project.licenseSpdxId && <span className="mt-1 block text-xs text-muted-foreground">{project.licenseSpdxId}</span>}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">Default branch</dt><dd className="font-medium text-foreground">{project.defaultBranch ?? 'Not available'}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">Last commit</dt><dd className="text-right font-medium text-foreground">{formatDate(project.lastCommitAt)}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">Repository updated</dt><dd className="text-right font-medium text-foreground">{formatDate(project.repositoryUpdatedAt)}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">Last metadata check</dt><dd className="text-right font-medium text-foreground">{project.snapshotCheckedAt ?? 'Not available'}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">Setup difficulty</dt><dd className="font-medium capitalize text-foreground">{project.installationDifficulty ?? 'Not assessed'}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">Self-hosting</dt><dd className="text-right font-medium text-foreground">{valueText(project.selfHostable, 'Self-hostable', 'Hosted only')}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">GPU</dt><dd className="text-right font-medium text-foreground">{valueText(project.requiresGpu, 'Required', 'Not required')}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">API key</dt><dd className="text-right font-medium text-foreground">{valueText(project.requiresApiKey, 'Required', 'Not required')}</dd></div>
          <div className="flex items-start justify-between gap-4 py-3"><dt className="text-muted-foreground">Paid service</dt><dd className="text-right font-medium text-foreground">{valueText(project.requiresPaidService, 'May be required', 'Not required for documented default')}</dd></div>
        </dl>
      </section>

      <div className="space-y-5">
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Categories & platforms</h2>
          <div className="mt-3 flex flex-wrap gap-2">{categoryNames.map((name) => <span key={name} className="rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground">{name}</span>)}</div>
          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Supported platforms</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{project.platformSupport?.length ? project.platformSupport.join(' · ') : 'Not documented in the curated record.'}</p>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Topics</h2>
          <div className="mt-3 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground">{tag}</span>)}</div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Editorial notes</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.verificationNotes || 'No additional editorial notes.'}</p>
          {project.licenseUrl && <a href={project.licenseUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground underline underline-offset-4">View license on GitHub <ExternalLink className="h-3.5 w-3.5" /></a>}
        </section>
      </div>
    </div>

    <footer className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>Repository snapshot checked {project.snapshotCheckedAt ?? 'at an unknown date'}. Stars, forks, and activity can change; confirm current values on GitHub. Editorial labels do not constitute a security audit or endorsement.</p>
      <Link to="/github-projects" className="shrink-0 text-sm font-medium text-foreground underline underline-offset-4">Browse all GitHub projects</Link>
    </footer>
  </main>;
};
