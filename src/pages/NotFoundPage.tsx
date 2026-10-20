import React from 'react';
import { Link } from '../router/Router';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist, has been moved, or the link may be broken. Explore our software directory or return to the homepage.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          to="/tools"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm transition-all w-full sm:w-auto shadow-xs"
        >
          <span>Explore All Tools</span>
        </Link>
      </div>
    </div>
  );
};
