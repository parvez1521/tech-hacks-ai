import React from 'react';
import { useRouter, Link } from '../router/Router';
import { getFreeToolBySlug } from '../services/aiCatalogService';
import { UtilityRunner } from '../components/utilities/UtilityRunner';
import { getUtilityCategoryDefinition, getUtilityCategory } from '../data/catalogTaxonomy';
import { Wrench, ShieldCheck, ArrowLeft, Cpu } from 'lucide-react';

export const FreeToolDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const tool = getFreeToolBySlug(slug);
  const category = tool ? getUtilityCategoryDefinition(getUtilityCategory(tool)) : undefined;

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Utility Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a browser utility matching "{slug}".
        </p>
        <Link
          to="/free-tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Utilities</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
         <Link to="/free-tools" className="hover:text-foreground">Utility Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-xl border border-border bg-card/80 shadow-md mb-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-muted text-secondary-foreground border border-border capitalize">
               {category?.name || tool.category}
            </span>
               <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-mono">
               <Cpu className="w-3.5 h-3.5" />
               <span>{tool.isClientSideOnly ? 'In-browser processing' : 'Server provider on request'}</span>
            </span>
          </div>

          <Link
            to="/free-tools"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Utilities</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          {tool.name}
        </h1>

        <p className="text-sm text-secondary-foreground leading-relaxed mb-4">
          {tool.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">Accepted Input:</span>
            <span className="text-foreground font-medium">{tool.acceptedInput}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">Output Format:</span>
            <span className="text-foreground font-medium">{tool.outputFormat}</span>
          </div>
        </div>
      </div>

      {/* Interactive Tool Runner */}
      <div className="p-6 sm:p-8 rounded-xl border border-border bg-card/90 shadow-lg mb-8">
        <UtilityRunner utility={tool} />
      </div>

      {/* Processing policy note */}
      <div className="p-4 rounded-xl bg-card/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
           <strong>Processing policy:</strong> {tool.isClientSideOnly ? 'This runner processes supplied input in browser memory and does not send it to a remote utility-processing service.' : 'This runner sends the selected file to the configured transcription provider only after you start processing. If no provider is configured, it reports that setup is required.'} Normal application resources and optional clipboard/download browser APIs may still be used.
        </span>
      </div>
    </div>
  );
};
