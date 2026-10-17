import React from 'react';
import { Sparkles, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4">
      {/* Fine Background Dot Texture */}
      <div
        className="absolute inset-0 bg-dot-pattern opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Slowly Drifting Background Gradient Bloom */}
      <div
        className="absolute inset-0 -top-20 -z-10 flex items-center justify-center pointer-events-none overflow-visible"
        aria-hidden="true"
      >
        <div className="w-[520px] h-[300px] bg-primary/15 rounded-full blur-3xl opacity-50 animate-ambient-drift" />
      </div>

      {/* Top Pill Badge (Stagger Step 1) */}
      <div className="animate-fade-in-up [animation-delay:0ms]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:border-primary/40 hover:bg-primary/15 transition-all duration-200 cursor-default mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-subtle" />
          <span>Curated Open Source Software Directory</span>
        </div>
      </div>

      {/* H1 Headline (Stagger Step 2) */}
      <h1 className="animate-fade-in-up [animation-delay:60ms] text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto leading-tight sm:leading-none mb-4">
        Open Source Alternatives to Popular Software
      </h1>

      {/* Subtitle (Stagger Step 3) */}
      <p className="animate-fade-in-up [animation-delay:120ms] text-base sm:text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Over 1 million users replaced their proprietary tools with reliable open source software. Save money, prevent vendor lock-in, and own your data.
      </p>

      {/* Sponsors & Partners Ribbon (Stagger Step 4) */}
      <div className="animate-fade-in-up [animation-delay:180ms] pt-6 border-t border-border/50 max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-primary" />
          <span>Supported by awesome open-source builders and sponsors</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-border/90 hover:bg-card/90 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20 transition-all duration-200">
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Postiz</span>
          </div>
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-border/90 hover:bg-card/90 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20 transition-all duration-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Supabase</span>
          </div>
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-border/90 hover:bg-card/90 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20 transition-all duration-200">
            <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Firecrawl</span>
          </div>
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-border/90 hover:bg-card/90 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20 transition-all duration-200">
            <Zap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Novu</span>
          </div>
        </div>
      </div>
    </section>
  );
};
