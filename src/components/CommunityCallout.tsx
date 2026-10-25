import React from 'react';
import { Link } from '../router/Router';
import { Sparkles, ArrowRight, ShieldCheck, PenTool, PlusCircle } from 'lucide-react';

interface CommunityCalloutProps {
  type: 'tool' | 'guide';
  className?: string;
}

export const CommunityCallout: React.FC<CommunityCalloutProps> = ({ type, className }) => {
  const isTool = type === 'tool';

  return (
    <div className={`relative overflow-hidden p-6 sm:p-8 rounded-2xl border border-border bg-card/80 shadow-md ${className || 'my-10'}`}>
      <div
        className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl -z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Contributions</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-2">
            {isTool ? 'Missing an AI Tool or Open Source Alternative?' : 'Have an AI Workflow or Practical Tutorial to Share?'}
          </h2>

          <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">
            {isTool
              ? 'Help expand the SwitchRoute directory! Anyone can submit a newly launched AI tool or open-source software project. Every submission is fact-checked and verified by our editorial team before publication.'
              : 'Write for developer and creator communities! Submit step-by-step AI workflows, prompt recipes, or integration tutorials. Published guides earn verified author credit and community attribution.'}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-medium">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Editorial fact-check</span>
            </span>
            <span>•</span>
            <span>Zero account required</span>
            <span>•</span>
            <span>100% Free contribution</span>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <Link
            to={isTool ? '/submit-tool' : '/submit-guide'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-all shadow-md shadow-primary/20 active:scale-98"
          >
            {isTool ? (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Submit a Tool</span>
              </>
            ) : (
              <>
                <PenTool className="w-4 h-4" />
                <span>Submit a Guide</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
