import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-8 mb-4 text-sm font-medium"
      aria-label="Pagination"
    >
      {/* Prev Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border bg-card text-foreground hover:bg-accent hover:border-border/80 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Numbered Page Buttons */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-muted-foreground select-none font-mono text-xs">
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isCurrent = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Go to page ${pageNum}`}
              className={`min-w-[34px] h-[34px] rounded-md font-mono text-xs flex items-center justify-center border transition-all duration-150 cursor-pointer ${
                isCurrent
                  ? 'bg-primary border-primary text-primary-foreground font-bold shadow-md shadow-primary/20 ring-1 ring-primary/40 scale-105'
                  : 'bg-card border-border text-foreground hover:bg-accent hover:border-border/80 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border bg-card text-foreground hover:bg-accent hover:border-border/80 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
