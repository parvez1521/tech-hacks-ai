import React, { useMemo, useState } from 'react';
import { Link } from '../router/Router';
import { AiToolCard } from '../components/AiToolCard';
import { getAiToolsForSearchIntent } from '../services/aiCatalogService';
import { ArrowRight, Film, Gauge, MonitorPlay, Sparkles } from 'lucide-react';

type VideoFilter = 'all' | 'free-entry' | 'open-models';

function hasFreeEntry(tool: ReturnType<typeof getAiToolsForSearchIntent>[number]): boolean {
  return tool.hasFreePlan ||
    ['free', 'freemium', 'free-credits', 'free-trial'].includes(tool.pricingType) ||
    ['recurring-free', 'limited-free', 'free-credits', 'open-source-local'].includes(tool.freeAccessType);
}

function hasOpenModelAccess(tool: ReturnType<typeof getAiToolsForSearchIntent>[number]): boolean {
  return tool.isSelfHostable === true ||
    tool.freeAccessType === 'open-source-local' ||
    tool.videoDiscoverySections?.includes('open-weights') === true;
}

function formatVerifiedDate(value: string | undefined): string {
  return value?.match(/^\\d{4}-\\d{2}-\\d{2}/)?.[0] || 'date not listed';
}

export const AiVideoToolsPage: React.FC = () => {
  const [filter, setFilter] = useState<VideoFilter>('all');
  const generators = useMemo(() => getAiToolsForSearchIntent('AI video generator'), []);
  const freeEntryCount = generators.filter(hasFreeEntry).length;
  const openModelCount = generators.filter(hasOpenModelAccess).length;
  const visibleTools = generators.filter((tool) => {
    if (filter === 'free-entry') return hasFreeEntry(tool);
    if (filter === 'open-models') return hasOpenModelAccess(tool);
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/ai-tools" className="transition-colors hover:text-foreground">AI tools</Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-foreground">AI video generators</span>
      </nav>

      <header className="mb-8 border-b border-border pb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Video generation directory
        </div>
        <h1 className="mb-4 max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          AI Video Generators &amp; Text-to-Video Tools
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-secondary-foreground sm:text-lg">
          Compare AI video generators for text-to-video, image-to-video, and open-model workflows.
          Explore what each tool is designed for, whether it lists free or trial access, and where
          to check its official pricing, license, and hardware requirements before you start.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <Film className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
            <div className="text-2xl font-extrabold text-foreground">{generators.length}</div>
            <div className="mt-1 text-sm font-semibold text-foreground">Video generation tools</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Filtered for video-generation intent, not every tool that merely mentions video.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <Gauge className="mb-3 h-5 w-5 text-emerald-400" aria-hidden="true" />
            <div className="text-2xl font-extrabold text-foreground">{freeEntryCount}</div>
            <div className="mt-1 text-sm font-semibold text-foreground">Free or trial entry listed</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Access may mean limited credits, a trial, or a free plan—not unlimited use.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <MonitorPlay className="mb-3 h-5 w-5 text-violet-400" aria-hidden="true" />
            <div className="text-2xl font-extrabold text-foreground">{openModelCount}</div>
            <div className="mt-1 text-sm font-semibold text-foreground">Open-model / self-host options</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Local generation can require a capable GPU and a license check.</p>
          </div>
        </div>
      </header>

      <section aria-labelledby="video-generator-results-heading">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="video-generator-results-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Compare AI video tools
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary-foreground">
              Use the access filters as a starting point, then open an individual listing to review
              its generation modes, access model, and official website.
            </p>
          </div>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            Showing <strong className="text-foreground">{visibleTools.length}</strong> of {generators.length} tools
          </span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter video generators">
          {([
            ['all', `All generators (${generators.length})`],
            ['free-entry', `Free or trial access (${freeEntryCount})`],
            ['open-models', `Open models / self-host (${openModelCount})`],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                filter === value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-secondary-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {visibleTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTools.map((tool) => (
              <div key={tool.id} className="min-w-0">
                <AiToolCard tool={tool} />
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1 pt-2 text-[11px] text-muted-foreground">
                  {tool.pricingSourceUrl ? (
                    <a href={tool.pricingSourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover">
                      Official pricing / access source
                    </a>
                  ) : <span>Official pricing source not listed</span>}
                  <span>Checked: {formatVerifiedDate(tool.pricingVerifiedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No tools match this filter yet. Choose another access filter or browse the full <Link to="/ai-tools" className="font-semibold text-primary underline underline-offset-4">AI tools directory</Link>.
          </div>
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Free plans, credits, watermarks, model access, and licensing can change. Confirm current terms on each provider’s official site before relying on a listed allowance.
        </p>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-2" aria-labelledby="choose-video-workflow-heading">
        <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
          <h2 id="choose-video-workflow-heading" className="text-xl font-bold text-foreground">Choose by video workflow</h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">Text-to-video</h3>
              <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">Start with a written scene, action, or camera description. Check clip duration, motion controls, aspect ratios, and whether the tool includes sound.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Image-to-video</h3>
              <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">Animate an existing image when composition or character appearance matters. Compare reference-image support, motion control, and output resolution.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Open-weight or self-hosted generation</h3>
              <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">Consider local models if you need more control. Read the specific model license and hardware guidance; open weights do not mean inference has zero cost.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground">How to compare a free AI video generator</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-secondary-foreground marker:font-semibold marker:text-primary">
            <li><strong className="text-foreground">Identify the free-access model.</strong> A recurring free plan, trial credits, and open-source weights offer very different amounts of usable generation.</li>
            <li><strong className="text-foreground">Check the output limits.</strong> Clip length, resolution, queue priority, watermark, and monthly or daily credits can matter more than a headline “free” label.</li>
            <li><strong className="text-foreground">Check rights and privacy.</strong> Review commercial-use terms, data handling, and the provider’s current policy before uploading client or personal material.</li>
            <li><strong className="text-foreground">Test with the same prompt.</strong> Compare motion consistency, prompt adherence, image references, and usable results instead of relying on a single showcase demo.</li>
          </ol>
          <Link to="/guides" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Explore practical AI guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="video-generator-faq-heading">
        <h2 id="video-generator-faq-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">AI video generator FAQs</h2>
        <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card/70 px-5 sm:px-6">
          <div className="py-5">
            <h3 className="font-semibold text-foreground">Can I generate AI videos for free?</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">Some tools list a free plan, limited credits, or trial access, while open-weight models may be run locally. “Free” does not always mean unlimited: check the current allowance, watermark, resolution, and usage terms on the provider’s own site.</p>
          </div>
          <div className="py-5">
            <h3 className="font-semibold text-foreground">What is the difference between text-to-video and image-to-video?</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">Text-to-video creates a clip from a prompt. Image-to-video starts with a still image and generates movement from it. Some models support both; check the individual tool details for the modes actually listed.</p>
          </div>
          <div className="py-5">
            <h3 className="font-semibold text-foreground">Are open-source AI video generators always free to run?</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">Not necessarily. Model weights may be available at no charge, but local inference needs hardware and electricity, and some deployments have hosting costs. Read the exact license for the model version you plan to use.</p>
          </div>
          <div className="py-5">
            <h3 className="font-semibold text-foreground">How do I find a tool for my specific video task?</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">Start with the generation mode and output you need, compare the tool pages, then test a consistent prompt across shortlisted options. For video editing or turning long videos into clips, check whether the product is an editor rather than a generative model.</p>
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Looking for more than video generation?</h2>
          <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">Browse the full AI directory for image, voice, coding, research, and automation tools.</p>
        </div>
        <Link to="/ai-tools" className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 sm:mt-0">
          Browse all AI tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
};
