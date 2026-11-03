import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { communityGitHubProjects, githubProjectCategories, githubProjectSources, publicGitHubProjects } from '../data/githubProjectsData';
import { filterAndSortGitHubProjects, refreshGitHubProjectMetadata } from '../services/githubProjectsService';
import type { GitHubProject, GitHubProjectCategory, GitHubProjectLiveMetadata } from '../types/githubProjects';

const PAGE_SIZE = 9;
type RequirementFilter = 'all' | 'required' | 'not-required' | 'unknown';

const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value)) : 'Not available';
const requirementText = (value: boolean | null) => value === null ? 'Unknown' : value ? 'Required' : 'Not required';

function ProjectCard({ project, live, onRefresh, refreshing, refreshError, needsReview, showRefresh = true }: {
  project: GitHubProject;
  live?: GitHubProjectLiveMetadata;
  onRefresh?: () => void;
  refreshing?: boolean;
  refreshError?: string;
  needsReview?: boolean;
  showRefresh?: boolean;
}) {
  return <article className="flex flex-col rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
      <div><p className="text-xs text-muted-foreground">{githubProjectCategories.find((category) => category.id === project.primaryCategory)?.name}</p><h3 className="mt-1 text-lg font-semibold text-foreground">{project.name}{project.featured && <span className="ml-2 text-xs font-normal text-primary">Featured</span>}</h3><p className="mt-1 text-xs text-muted-foreground">{project.fullName}</p>{project.verificationStatus === 'community-unverified' && <span className="mt-2 inline-flex rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground">Community · Unverified</span>}</div>
      <a href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.fullName} on GitHub`} className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><ArrowUpRight className="h-4 w-4" /></a>
    </div>
    <p className="mt-4 text-sm leading-6 text-foreground/90">{project.description}</p>
    {(live?.githubDescription || project.githubDescription) && <p className="mt-2 text-xs leading-5 text-muted-foreground"><span className="font-medium">GitHub repository description:</span> {live?.githubDescription ?? project.githubDescription}</p>}
    <p className="mt-2 text-xs leading-5 text-muted-foreground">{project.longDescription}</p>
    {project.verificationStatus === 'community-unverified' && <div role="note" className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-3 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Unverified community project.</strong> This is not an official Higgsfield product. The README claims MIT, but GitHub does not detect a license and no root LICENSE file was found. Local setup routes generation through MuAPI and requires its API key; the README's privacy and request-flow statements conflict. The README also describes its installers as unsigned/not notarized. Review the repository, license, security, and service terms before installing.</div>}
    {live?.readmeExcerpt && <details className="mt-3 rounded-md border border-border px-3 py-2"><summary className="cursor-pointer text-xs font-medium">Latest README excerpt</summary><p className="mt-2 text-xs leading-5 text-muted-foreground">{live.readmeExcerpt}</p></details>}
    {project.secondaryCategories.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Also in: {project.secondaryCategories.map((id) => githubProjectCategories.find((category) => category.id === id)?.name).filter(Boolean).join(' · ')}</p>}
    <div className="mt-4 flex flex-wrap gap-1.5">{project.tags.map((tag) => <span key={tag} className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground">{tag}</span>)}</div>
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-xs">
      <div><dt className="text-muted-foreground">GitHub stars</dt><dd className="mt-0.5 font-medium tabular-nums">{(live?.stars ?? project.stars)?.toLocaleString() ?? 'Not available'}</dd></div>
      <div><dt className="text-muted-foreground">License</dt><dd className="mt-0.5 font-medium">{live ? (live.licenseName ?? 'Not detected by GitHub') : (project.licenseName ?? 'Unclear')}</dd></div>
      <div><dt className="text-muted-foreground">Language</dt><dd className="mt-0.5 font-medium">{live ? (live.language ?? 'Not detected') : (project.language ?? 'Not available')}</dd></div>
      <div><dt className="text-muted-foreground">Setup</dt><dd className="mt-0.5 font-medium capitalize">{project.installationDifficulty ?? 'Not assessed'}</dd></div>
      <div><dt className="text-muted-foreground">Self-hosting</dt><dd className="mt-0.5 font-medium">{project.selfHostable === null ? 'Unknown' : project.selfHostable ? 'Can self-host' : 'Hosted only'}</dd></div>
      <div><dt className="text-muted-foreground">GPU / API key</dt><dd className="mt-0.5 font-medium">{requirementText(project.requiresGpu)} GPU · {requirementText(project.requiresApiKey)} key</dd></div>
      <div><dt className="text-muted-foreground">Last commit</dt><dd className="mt-0.5 font-medium">{formatDate(live?.lastCommitAt ?? project.lastCommitAt)}</dd></div>
      <div><dt className="text-muted-foreground">Last verified</dt><dd className="mt-0.5 font-medium">{formatDate(project.verifiedAt)}</dd></div>
    </dl>
    {project.requiresPaidService && <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">Uses managed services or paid provider credentials for the documented default deployment. Local alternatives may be available; see the notes.</p>}
    {live?.archived && <p role="alert" className="mt-3 rounded-md border border-border px-3 py-2 text-xs">GitHub now reports this repository archived. Editorial review is needed before any status change.</p>}
    {needsReview && <p role="alert" className="mt-3 rounded-md border border-border px-3 py-2 text-xs">GitHub metadata differs from the reviewed license or archive status. Editorial review is needed before changing this listing.</p>}
    {refreshError && <p role="status" className="mt-3 text-xs text-muted-foreground">{refreshError}</p>}
    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
      <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Open GitHub <ExternalLink className="h-3.5 w-3.5" /></a>
      {showRefresh && onRefresh && <button type="button" onClick={onRefresh} disabled={Boolean(refreshing)} className="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50" aria-label={`Refresh GitHub metadata for ${project.name}`}><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />{refreshing ? 'Checking…' : 'Refresh metadata'}</button>}
    </div>
  </article>;
}

export const GitHubProjectsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GitHubProjectCategory | 'all'>('all');
  const [license, setLicense] = useState('');
  const [language, setLanguage] = useState('');
  const [selfHostable, setSelfHostable] = useState<'all' | 'yes' | 'no' | 'unknown'>('all');
  const [gpu, setGpu] = useState<RequirementFilter>('all');
  const [apiKey, setApiKey] = useState<RequirementFilter>('all');
  const [sort, setSort] = useState<'stars' | 'updated' | 'curated'>('curated');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [liveMetadata, setLiveMetadata] = useState<Record<string, GitHubProjectLiveMetadata>>({});
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  const [refreshErrors, setRefreshErrors] = useState<Record<string, string>>({});
  const [reviewRequired, setReviewRequired] = useState<Record<string, boolean>>({});

  const dataWithLiveMetadata = useMemo(() => publicGitHubProjects.map((project) => {
    const live = liveMetadata[project.fullName];
    return live ? { ...project, ...live } : project;
  }), [liveMetadata]);
  const result = useMemo(() => filterAndSortGitHubProjects({ query, category, license, language, selfHostable, requiresGpu: gpu, requiresApiKey: apiKey, sort, featuredOnly, page, pageSize: PAGE_SIZE }, dataWithLiveMetadata), [query, category, license, language, selfHostable, gpu, apiKey, sort, featuredOnly, page, dataWithLiveMetadata]);
  const licenses = useMemo(() => [...new Set(publicGitHubProjects.map((project) => project.licenseSpdxId).filter((id): id is string => Boolean(id)))].sort(), []);
  const languages = useMemo(() => [...new Set(publicGitHubProjects.map((project) => project.language).filter((value): value is string => Boolean(value)))].sort(), []);

  useEffect(() => {
    const id = 'github-projects-jsonld';
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Curated GitHub Projects',
      description: 'Editorially reviewed free and open-source projects across AI and developer workflows.',
      url: 'https://switchroute.in/github-projects',
      mainEntity: { '@type': 'ItemList', itemListElement: publicGitHubProjects.map((project, index) => ({ '@type': 'ListItem', position: index + 1, name: project.name, url: project.repositoryUrl })) },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const resetPage = (update: () => void) => { update(); setPage(1); };
  const refreshProject = async (project: GitHubProject) => {
    setRefreshing((state) => ({ ...state, [project.fullName]: true }));
    setRefreshErrors((state) => ({ ...state, [project.fullName]: '' }));
    const response = await refreshGitHubProjectMetadata(project.fullName);
    if (response.success && response.metadata) {
      setLiveMetadata((state) => ({ ...state, [project.fullName]: response.metadata! }));
      if (response.reviewRequired) setReviewRequired((state) => ({ ...state, [project.fullName]: true }));
    } else setRefreshErrors((state) => ({ ...state, [project.fullName]: response.error || 'Live metadata unavailable.' }));
    setRefreshing((state) => ({ ...state, [project.fullName]: false }));
  };

  return <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <header className="max-w-3xl mb-8">
      <p className="text-xs tracking-wide text-primary">Curated software library</p>
      <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">GitHub Projects</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Useful free-to-run and open-source projects, reviewed for license, activity, and practical requirements. A public repository does not guarantee free hosted inference, security, or suitability for every use.</p>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={() => resetPage(() => setFeaturedOnly(!featuredOnly))} aria-pressed={featuredOnly} className={`rounded-md border px-3 py-2 ${featuredOnly ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>Featured projects</button>
        <button type="button" onClick={() => { resetPage(() => { setFeaturedOnly(false); setSort('updated'); }); }} aria-pressed={sort === 'updated'} className={`rounded-md border px-3 py-2 ${sort === 'updated' && !featuredOnly ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>Recently updated</button>
        <button type="button" onClick={() => resetPage(() => { setFeaturedOnly(false); setSort('curated'); })} aria-pressed={sort === 'curated' && !featuredOnly} className={`rounded-md border px-3 py-2 ${sort === 'curated' && !featuredOnly ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>Newest curated</button>
      </div>
    </header>

    <section aria-label="Filter projects" className="mb-6 space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="relative"><Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><label htmlFor="project-search" className="sr-only">Search GitHub projects by name or use case</label><input id="project-search" value={query} onChange={(event) => resetPage(() => setQuery(event.target.value))} placeholder="Search by project or use case" className="min-h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground" /></div>
      <div className="filter-chip-rail flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter projects by category">
        <button type="button" onClick={() => resetPage(() => setCategory('all'))} aria-pressed={category === 'all'} className={`shrink-0 rounded-md border px-3 py-2 text-sm ${category === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>All categories ({publicGitHubProjects.length})</button>
        {githubProjectCategories.map((item) => {
          const count = publicGitHubProjects.filter((project) => project.primaryCategory === item.id || project.secondaryCategories.includes(item.id)).length;
          return <button key={item.id} type="button" onClick={() => resetPage(() => setCategory(item.id))} aria-pressed={category === item.id} className={`shrink-0 rounded-md border px-3 py-2 text-sm ${category === item.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>{item.name} ({count})</button>;
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <label className="text-xs text-muted-foreground">License<select aria-label="Filter by license" value={license} onChange={(event) => resetPage(() => setLicense(event.target.value))} className="mt-1 block min-h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"><option value="">Any license</option>{licenses.map((id) => <option key={id} value={id}>{id}</option>)}</select></label>
        <label className="text-xs text-muted-foreground">Language<select aria-label="Filter by language" value={language} onChange={(event) => resetPage(() => setLanguage(event.target.value))} className="mt-1 block min-h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"><option value="">Any language</option>{languages.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-xs text-muted-foreground">Self-hostable<select aria-label="Filter self-hostable projects" value={selfHostable} onChange={(event) => resetPage(() => setSelfHostable(event.target.value as typeof selfHostable))} className="mt-1 block min-h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"><option value="all">Any</option><option value="yes">Yes</option><option value="no">No</option><option value="unknown">Unknown</option></select></label>
        <label className="text-xs text-muted-foreground">GPU<select aria-label="Filter by GPU requirement" value={gpu} onChange={(event) => resetPage(() => setGpu(event.target.value as RequirementFilter))} className="mt-1 block min-h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"><option value="all">Any</option><option value="required">Required</option><option value="not-required">Not required</option><option value="unknown">Unknown</option></select></label>
        <label className="text-xs text-muted-foreground">API key<select aria-label="Filter by API key requirement" value={apiKey} onChange={(event) => resetPage(() => setApiKey(event.target.value as RequirementFilter))} className="mt-1 block min-h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"><option value="all">Any</option><option value="required">Required</option><option value="not-required">Not required</option><option value="unknown">Unknown</option></select></label>
        <label className="text-xs text-muted-foreground">Sort by<select aria-label="Sort GitHub projects" value={sort} onChange={(event) => resetPage(() => { setFeaturedOnly(false); setSort(event.target.value as typeof sort); })} className="mt-1 block min-h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"><option value="stars">GitHub stars</option><option value="updated">Recently updated</option><option value="curated">Newest curated</option></select></label>
      </div>
      <p className="text-xs text-muted-foreground">Showing {result.total ? (result.page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(result.page * PAGE_SIZE, result.total)} of {result.total} verified projects</p>
    </section>

    {result.projects.length ? <section aria-label="GitHub project results" className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{result.projects.map((project) => <ProjectCard key={project.id} project={project} live={liveMetadata[project.fullName]} onRefresh={() => refreshProject(project)} refreshing={Boolean(refreshing[project.fullName])} refreshError={refreshErrors[project.fullName] || undefined} needsReview={reviewRequired[project.fullName]} />)}</section> : <div className="rounded-lg border border-border p-10 text-center"><p className="font-medium">No verified projects match those filters.</p><p className="mt-2 text-sm text-muted-foreground">Try another category or search term.</p></div>}
    {result.pageCount > 1 && <nav aria-label="GitHub projects pagination" className="mt-8 flex items-center justify-center gap-3"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="min-h-10 rounded-md border border-border px-3 text-sm disabled:opacity-40">Previous</button><span aria-live="polite" className="text-sm text-muted-foreground">Page {result.page} of {result.pageCount}</span><button type="button" disabled={page >= result.pageCount} onClick={() => setPage((value) => Math.min(result.pageCount, value + 1))} className="min-h-10 rounded-md border border-border px-3 text-sm disabled:opacity-40">Next</button></nav>}
    
    {communityGitHubProjects.length > 0 && <section aria-label="Community projects pending verification" className="mt-12 border-t border-border pt-8">
      <div className="mb-5 max-w-3xl"><p className="text-xs tracking-wide text-muted-foreground">Separate from verified listings</p><h2 className="mt-1 text-2xl font-semibold text-foreground">Community Projects — Unverified</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Independent community-built projects that may be useful to explore, but have unresolved license, security, or service-term questions. They are not endorsements and are excluded from verified counts, filters, and recommendations.</p></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{communityGitHubProjects.map((project) => <ProjectCard key={project.id} project={project} showRefresh={false} />)}</div>
    </section>}

    <section className="mt-12 border-t border-border pt-7">
      <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" /><div><h2 className="font-semibold">How we select projects</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Listings are reviewed for public availability, current repository status, a clear license, recent maintenance, and a README that supports the stated use. We record hardware, credentials, and paid-service dependencies when documented. This is an editorial selection, not an endorsement, security audit, or guarantee of future maintenance. Verified projects appear in the main results. The separate community section is explicitly unverified and is not an endorsement.</p></div></div>
      <details className="mt-5 rounded-lg border border-border p-4"><summary className="cursor-pointer text-sm font-medium">Research lists used as discovery sources</summary><ul className="mt-3 space-y-2 text-sm">{githubProjectSources.map((source) => <li key={source.fullName}><a href={source.url} target="_blank" rel="noreferrer" className="underline">{source.fullName}</a><span className="text-muted-foreground"> — Research source only; license {source.licenseSpdxId || 'unclear'}; checked {source.updatedAt}.</span></li>)}</ul></details>
      <p className="mt-4 text-xs text-muted-foreground">Repository metadata is fetched from GitHub on request and cached server-side. Editorial categories, requirements, and verification notes are held separately; live metadata does not automatically promote or reclassify projects.</p>
    </section>
  </main>;
};
