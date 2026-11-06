import React from 'react';
import { ArrowUpRight, Download, ExternalLink, Laptop, ShieldCheck } from 'lucide-react';
import { Link } from '../router/Router';

const platformDetails = [
  { name: 'Windows', detail: 'Windows 10 or later' },
  { name: 'macOS', detail: 'macOS 10.15 or later' },
  { name: 'Linux', detail: 'Desktop Linux distributions' },
];

const capabilities = [
  'Paste links from 1,000+ supported site families into one app.',
  'Choose available video quality, including up to 4K when the source offers it, or extract audio.',
  'Manage a queue with pause, resume, retry, and support for interrupted downloads.',
  'Uses yt-dlp and FFmpeg, with the app managing their setup and updates.',
];

export const VideoDownloadersPage: React.FC = () => (
  <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
    <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground">Home</Link>
      <span aria-hidden="true">/</span>
      <Link to="/free-tools" className="hover:text-foreground">Utility Tools</Link>
      <span aria-hidden="true">/</span>
      <span className="text-foreground">Video Downloaders</span>
    </nav>

    <header className="mb-8 max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">Curated utility directory</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">Video Downloaders</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        A focused directory for desktop apps that help save online media. We currently feature one listing: OmniGet.
      </p>
    </header>

    <section aria-label="Video downloader listing" className="grid gap-6">
      <article aria-label="OmniGet listing" className="rounded-xl border border-border bg-card p-5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-primary">
              <Download aria-hidden="true" className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Desktop app</span>
                <span className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Free & open source</span>
                <span className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">GPL-3.0</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">OmniGet</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                A desktop interface for yt-dlp and FFmpeg. Paste a supported link, choose the available quality or format, and manage downloads in one resumable queue—without using the command line.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a href="https://getomniget.com/download" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Download OmniGet <Download aria-hidden="true" className="h-4 w-4" />
            </a>
            <a href="https://getomniget.com/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Official website <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-7 grid gap-6 border-t border-border pt-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h3 className="text-sm font-semibold text-foreground">What it offers</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-6 text-muted-foreground">
              {capabilities.map((capability) => (
                <li key={capability} className="flex gap-2.5">
                  <ShieldCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Available platforms</h3>
            <div className="mt-3 grid gap-2">
              {platformDetails.map((platform) => (
                <div key={platform.name} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                  <Laptop aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">{platform.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Desktop software only. There is no Android, iOS, or browser-based version.</p>
          </div>
        </div>

        <div role="note" className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground">Use responsibly.</strong> OmniGet says it downloads only content your own session can already access; it does not bypass DRM or paywalls. Save only media you own or have permission to download.
          <a href="https://getomniget.com/" target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 font-medium text-primary hover:underline">Read the developer's notes <ArrowUpRight aria-hidden="true" className="h-3 w-3" /></a>
        </div>
      </article>
    </section>

    <p className="mt-6 max-w-3xl text-xs leading-5 text-muted-foreground">
      SwitchRoute is an independent directory. OmniGet is a third-party project; check its official download page and verify the published checksums before installing.
    </p>
  </main>
);
