import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tools found for the given filters.',
  description = 'Try clearing some search terms or resetting filters to explore more software alternatives.',
  onReset,
}) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center p-12 text-center border border-dashed border-border hover:border-primary/40 rounded-lg bg-card/40 my-8 transition-colors duration-300 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4 shadow-inner">
        <SearchX className="w-6 h-6 animate-pulse-subtle" />
      </div>
      <h2 className="text-base font-semibold text-foreground mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 active:translate-y-0 transition-all duration-150 shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" />
          <span>Reset all filters</span>
        </button>
      )}
    </div>
  );
};
