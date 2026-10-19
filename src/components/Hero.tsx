import React from 'react';
import { Sparkles, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4">
      {/* Quiet context line */}
      <div className="animate-fade-in-up [animation-delay:0ms]">
        <div className="inline-flex items-center gap-1.5 eyebrow mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Open Source Software Directory</span>
        </div>
      </div>

      {/* H1 Headline (Stagger Step 2) */}
      <h1 className="animate-fade-in-up [animation-delay:60ms] text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto leading-tight sm:leading-none mb-4">
        Open Source Alternatives to Popular Software
      </h1>

      {/* Subtitle (Stagger Step 3) */}
      <p className="animate-fade-in-up [animation-delay:120ms] text-base sm:text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Compare reliable open-source software by license, hosting model, and the proprietary workflows it can replace.
      </p>

      {/* Shortlist ribbon */}
      <div className="animate-fade-in-up [animation-delay:180ms] pt-6 border-t border-border/50 max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-primary" />
          <span>Start with a focused shortlist</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-md border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-colors">
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Postiz</span>
          </div>
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-md border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Supabase</span>
          </div>
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-md border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-colors">
            <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Firecrawl</span>
          </div>
          <div className="group flex items-center justify-center gap-2 p-2.5 rounded-md border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-colors">
            <Zap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-foreground">Novu</span>
          </div>
        </div>
      </div>
    </section>
  );
};
