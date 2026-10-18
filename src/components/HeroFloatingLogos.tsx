import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';

/**
 * HeroFloatingLogos Component
 *
 * Atmospheric background visual showing recognizable verified logos
 * from real generative AI leaders and authentic open-source alternatives.
 *
 * Visual & UX Architecture:
 * - Distributed around the outer perimeter of the hero section, keeping the
 *   central column (headline, subtitle, search field, intent chips, and shortcuts)
 *   completely unobstructed.
 * - Displays grounded tool-alternative pairs (Claude Code ↔ Aider, Perplexity ↔ Perplexica,
 *   Firebase ↔ Supabase, Figma ↔ Penpot) with relationship glyphs.
 * - Displays single verified AI & OSS pioneers (Cursor, DeepSeek, Ollama, FLUX.1, n8n, Kling AI).
 * - High-contrast glass badge styling for both dark and light modes using design token classes.
 * - High-contrast inner logo tiles ensure 100% visibility for all brand marks.
 * - Gentle CSS floating drift with strict prefers-reduced-motion support.
 * - Completely decorative: pointer-events-none, select-none, and aria-hidden="true".
 * - Zero horizontal overflow across all screen sizes (375px to 1440px+).
 */
export const HeroFloatingLogos: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* =====================================================================
          GROUNDED PAIR 1 (Top Left Outer Periphery):
          Claude Code (Proprietary CLI) ↔ Aider (Open-Source Git Agent)
      ===================================================================== */}
      <div className="absolute top-3 left-2 sm:left-4 lg:left-6 xl:left-8 animate-float-slow-1 opacity-80 dark:opacity-75 hidden sm:flex">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="claude-code" name="Claude Code" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-1 py-0.2 rounded bg-muted/60 border border-border/40 select-none">
            ⇄
          </span>
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="aider" name="Aider" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap pl-1">
            Claude Code ↔ Aider
          </span>
        </div>
      </div>

      {/* =====================================================================
          GROUNDED PAIR 2 (Top Right Outer Periphery):
          Perplexity (AI Search) ↔ Perplexica (Open-Source SearXNG Engine)
      ===================================================================== */}
      <div className="absolute top-3 right-2 sm:right-4 lg:right-6 xl:right-8 animate-float-slow-2 opacity-80 dark:opacity-75 hidden sm:flex">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="perplexity" name="Perplexity" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-1 py-0.2 rounded bg-muted/60 border border-border/40 select-none">
            ⇄
          </span>
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="perplexica" name="Perplexica" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap pl-1">
            Perplexity ↔ Perplexica
          </span>
        </div>
      </div>

      {/* =====================================================================
          AMBIENT SINGLE 1 (Upper-Mid Left Accent):
          Cursor (AI Code Editor)
      ===================================================================== */}
      <div className="absolute top-24 left-2 sm:left-4 lg:left-6 animate-float-slow-2 opacity-80 dark:opacity-75 hidden md:flex">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="cursor" name="Cursor" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">Cursor</span>
        </div>
      </div>

      {/* =====================================================================
          AMBIENT SINGLE 2 (Upper-Mid Right Accent):
          DeepSeek (Reasoning Engine)
      ===================================================================== */}
      <div className="absolute top-24 right-2 sm:right-4 lg:right-6 animate-float-slow-1 opacity-80 dark:opacity-75 hidden md:flex">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="deepseek" name="DeepSeek" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">DeepSeek</span>
        </div>
      </div>

      {/* =====================================================================
          GROUNDED PAIR 3 (Center-Mid Left Periphery):
          Firebase (Proprietary BaaS) ↔ Supabase (Open-Source PostgreSQL)
      ===================================================================== */}
      <div className="absolute top-[52%] -translate-y-1/2 left-2 lg:left-4 xl:left-8 animate-float-slow-1 opacity-80 dark:opacity-75 hidden xl:flex">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="firebase" name="Firebase" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-1 py-0.2 rounded bg-muted/60 border border-border/40 select-none">
            ⇄
          </span>
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="supabase" name="Supabase" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap pl-1">
            Firebase ↔ Supabase
          </span>
        </div>
      </div>

      {/* =====================================================================
          GROUNDED PAIR 4 (Center-Mid Right Periphery):
          Figma (Proprietary Design) ↔ Penpot (Open-Source Web Standards)
      ===================================================================== */}
      <div className="absolute top-[52%] -translate-y-1/2 right-2 lg:right-4 xl:right-8 animate-float-slow-2 opacity-80 dark:opacity-75 hidden xl:flex">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="figma" name="Figma" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-1 py-0.2 rounded bg-muted/60 border border-border/40 select-none">
            ⇄
          </span>
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="penpot" name="Penpot" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap pl-1">
            Figma ↔ Penpot
          </span>
        </div>
      </div>

      {/* =====================================================================
          AMBIENT SINGLE 3 (Lower-Mid Left Accent):
          Ollama (Open-Source Local LLMs)
      ===================================================================== */}
      <div className="absolute bottom-16 left-3 sm:left-6 lg:left-8 animate-float-slow-2 opacity-80 dark:opacity-75 hidden md:flex">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="ollama" name="Ollama" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">Ollama</span>
        </div>
      </div>

      {/* =====================================================================
          AMBIENT SINGLE 4 (Lower-Mid Right Accent):
          FLUX.1 (Open-Weights Image Generation)
      ===================================================================== */}
      <div className="absolute bottom-16 right-3 sm:right-6 lg:right-8 animate-float-slow-1 opacity-80 dark:opacity-75 hidden md:flex">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <div className="w-6 h-6 rounded-md bg-muted/70 dark:bg-muted/40 border border-border/50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
            <BrandLogo slug="flux-1" name="FLUX.1" size="xs" showContainer={false} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">FLUX.1</span>
        </div>
      </div>

      {/* =====================================================================
          AMBIENT SINGLE 5 (Far Outer Left Desk):
          n8n (Open Workflow Automation)
      ===================================================================== */}
      <div className="absolute top-[36%] left-1 animate-float-slow-1 opacity-75 dark:opacity-70 hidden 2xl:flex">
        <div className="p-2 rounded-xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <BrandLogo slug="n8n" name="n8n" size="xs" showContainer={false} className="w-5 h-5 object-contain" />
        </div>
      </div>

      {/* =====================================================================
          AMBIENT SINGLE 6 (Far Outer Right Desk):
          Kling AI (Generative Video)
      ===================================================================== */}
      <div className="absolute top-[36%] right-1 animate-float-slow-2 opacity-75 dark:opacity-70 hidden 2xl:flex">
        <div className="p-2 rounded-xl bg-card/90 dark:bg-card/80 border border-border/80 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/30 backdrop-blur-md">
          <BrandLogo slug="kling-ai" name="Kling AI" size="xs" showContainer={false} className="w-5 h-5 object-contain" />
        </div>
      </div>
    </div>
  );
};
