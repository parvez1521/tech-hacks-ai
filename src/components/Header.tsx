import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../router/Router';
import { getBookmarks, subscribeBookmarks } from '../services/bookmarkService';
import { TechHacksLogo } from './TechHacksLogo';
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
  BookOpen,
  MessageSquareCode,
  Wrench,
  Bookmark,
  Scales,
  Compass,
  Tag,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const { navigate } = useRouter();

  useEffect(() => {
    setSavedCount(getBookmarks().length);
    const unsubscribe = subscribeBookmarks((items) => {
      setSavedCount(items.length);
    });
    return unsubscribe;
  }, []);

  const handleSearchClick = () => {
    navigate('/ai-tools');
  };

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center" aria-label="Tech Hacks AI Home">
            <TechHacksLogo size="sm" showWordmark={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/ai-tools"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              AI Tools
            </Link>
            <Link
              to="/alternatives"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Alternatives
            </Link>
            <Link
              to="/tools"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Open Source
            </Link>
            <Link
              to="/guides"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Guides
            </Link>
            <Link
              to="/prompt-library"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Prompts
            </Link>
            <Link
              to="/free-tools"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Free Tools
            </Link>
            <Link
              to="/offers"
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150 inline-flex items-center gap-1.5"
            >
              <span>AI Deals</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">New</span>
            </Link>

            {/* Resources Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                onBlur={() => setTimeout(() => setIsResourcesOpen(false), 200)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150 cursor-pointer"
              >
                <span>More</span>
                <span className="text-xs transition-transform duration-200">▾</span>
              </button>

              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 rounded-lg bg-card/95 backdrop-blur-md border border-border p-1.5 shadow-xl shadow-black/40 z-50 flex flex-col gap-0.5 animate-fade-in">
                  <Link
                    to="/offers"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span>AI Deals & Benefits</span>
                  </Link>
                  <Link
                    to="/pick"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Compass className="w-3.5 h-3.5 text-purple-400" />
                    <span>Help Me Pick</span>
                  </Link>
                  <Link
                    to="/compare"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <span className="text-xs">⚖️</span>
                    <span>Compare Software</span>
                  </Link>
                  <Link
                    to="/free-ai-sites"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free AI Sites</span>
                  </Link>
                  <Link
                    to="/categories"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Categories Index</span>
                  </Link>
                  <Link
                    to="/updates"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Changelog & Updates</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Saved Items Link */}
          <Link
            to="/saved"
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 cursor-pointer"
            title="Saved Tools & Prompts"
            aria-label="View saved items"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center animate-pulse-subtle">
                {savedCount}
              </span>
            )}
          </Link>

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 cursor-pointer"
            title="Search software catalog"
            aria-label="Search software catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Help Me Pick CTA */}
          <Link
            to="/pick"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 hover:bg-card hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 text-foreground text-xs font-medium transition-all duration-150 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Help Me Pick</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
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
        <div id="mobile-nav" className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 py-5 flex flex-col gap-4 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Discovery Directories
            </span>
            <Link
              to="/ai-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Tools Directory</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/alternatives"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Replace className="w-4 h-4 text-primary" />
                <span>Proprietary Alternatives</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4 text-emerald-400" />
                <span>Open Source Catalog</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/free-ai-sites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Free AI Sites</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-primary" />
                <span>AI Deals & Benefits</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary">NEW</span>
            </Link>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Learning & Utilities
            </span>
            <Link
              to="/guides"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Guides & Tutorials</span>
            </Link>
            <Link
              to="/prompt-library"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <MessageSquareCode className="w-4 h-4 text-purple-400" />
              <span>Prompt Library</span>
            </Link>
            <Link
              to="/free-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <Wrench className="w-4 h-4 text-rose-400" />
              <span>Free Browser Utilities</span>
            </Link>
            <Link
              to="/pick"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Help Me Pick Wizard</span>
            </Link>
            <Link
              to="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <span className="text-xs">⚖️</span>
              <span>Compare Software</span>
            </Link>
            <Link
              to="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-primary" />
                <span>Saved Items</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {savedCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
