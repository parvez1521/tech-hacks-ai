import React from 'react';
import { Link } from '../router/Router';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="text-secondary-foreground text-sm leading-relaxed mb-8">
        The page you are looking for doesn't exist, has been moved, or the link may be broken. Explore our software directory or return to the homepage.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground font-medium text-sm transition-colors"
        >
          <span>Explore All Tools</span>
        </Link>
      </div>
    </div>
  );
};
