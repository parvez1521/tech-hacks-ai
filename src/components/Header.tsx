import React, { useState } from 'react';
import { Link, useRouter } from '../router/Router';
import {
  Menu,
  X,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Replace,
  FolderKanban,
  Flame,
  HardDrive,
  Bot,
  Clock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const { navigate } = useRouter();

  const handleSearchClick = () => {
    navigate('/tools');
  };

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Geometric Modern Logo with Tasteful Microinteraction */}
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:rotate-12 group-hover:scale-105 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300 ease-out shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current stroke-current"
                strokeWidth="1.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-foreground text-base tracking-tight">
              Open<span className="text-primary font-normal">Alternative</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/tools"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Tools
            </Link>
            <Link
              to="/alternatives"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Alternatives
            </Link>
            <Link
              to="/categories"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Categories
            </Link>

            {/* Collections Popover Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                onBlur={() => setTimeout(() => setIsCollectionsOpen(false), 200)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150 cursor-pointer"
              >
                <span>Collections</span>
                <span className="text-xs transition-transform duration-200">▾</span>
              </button>

              {isCollectionsOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 rounded-lg bg-card/95 backdrop-blur-md border border-border p-1.5 shadow-xl shadow-black/40 z-50 flex flex-col gap-0.5 animate-fade-in">
                  <Link
                    to="/collections/trending"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Trending</span>
                  </Link>
                  <Link
                    to="/collections/self-hosted"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Self-Hosted</span>
                  </Link>
                  <Link
                    to="/collections/ai-native"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI-Native</span>
                  </Link>
                  <Link
                    to="/collections/latest"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Latest Discoveries</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 cursor-pointer"
            title="Search software"
            aria-label="Search software catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Submit Button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 hover:bg-card hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 text-foreground text-xs font-medium transition-all duration-150 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse-subtle" />
            <span>Submit Tool</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label="Toggle mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 py-5 flex flex-col gap-4 animate-fade-in">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Browse
            </span>
            <Link
              to="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4 text-primary" />
                <span>All Tools</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/alternatives"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
            >
              <div className="flex items-center gap-2.5">
                <Replace className="w-4 h-4 text-primary" />
                <span>Proprietary Alternatives</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-primary" />
                <span>Categories</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Collections
            </span>
            <Link
              to="/collections/trending"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Trending</span>
            </Link>
            <Link
              to="/collections/self-hosted"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Self-Hosted</span>
            </Link>
            <Link
              to="/collections/ai-native"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>AI-Native</span>
            </Link>
            <Link
              to="/collections/latest"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
            >
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Latest</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
