import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '../router/Router';
import { getBookmarks, subscribeBookmarks } from '../services/bookmarkService';
import { TechHacksLogo } from './TechHacksLogo';
import { ThemeToggle } from './ThemeToggle';
import {
  Menu,
  X,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Replace,
  FolderKanban,
  Clock,
  BookOpen,
  MessageSquareCode,
  Wrench,
  Bookmark,
  Scale,
  Compass,
  Tag,
  ChevronDown,
  Gift,
  Flame,
  PlusCircle,
  PenTool,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isLearnOpen, setIsLearnOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const { navigate } = useRouter();

  const discoverRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedCount(getBookmarks().length);
    const unsubscribe = subscribeBookmarks((items) => {
      setSavedCount(items.length);
    });
    return unsubscribe;
  }, []);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (discoverRef.current && !discoverRef.current.contains(event.target as Node)) {
        setIsDiscoverOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
        setIsLearnOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    navigate('/ai-tools');
  };

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-background/95 border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-5 xl:gap-7">
          <Link to="/" aria-label="Tech Hacks AI" className="flex items-center shrink-0">
            <TechHacksLogo size="sm" showWordmark={true} />
          </Link>

          {/* Compact, Organized Desktop Navigation */}
          <nav aria-label="Primary" className="hidden xl:flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-medium">
            {/* 1. Discover Dropdown */}
            <div className="relative" ref={discoverRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDiscoverOpen(!isDiscoverOpen);
                  setIsLearnOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer ${
                  isDiscoverOpen
                    ? 'text-foreground bg-muted font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
                aria-expanded={isDiscoverOpen}
              >
                <span>Discover</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDiscoverOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDiscoverOpen && (
                  <div className="absolute top-full left-0 mt-2 w-60 rounded-lg bg-card border border-border p-1.5 shadow-lg shadow-black/30 z-50 flex flex-col gap-0.5 animate-fade-in">
                  <Link
                    to="/discoveries"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <div>
                      <span className="block font-semibold">Daily Discoveries</span>
                      <span className="text-[11px] text-muted-foreground">Editor-featured AI tools</span>
                    </div>
                  </Link>
                  <Link
                    to="/pick"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Compass className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="block font-semibold">Help Me Pick</span>
                      <span className="text-[11px] text-muted-foreground">Guided 3-question tool wizard</span>
                    </div>
                  </Link>
                  <Link
                    to="/tools"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <FolderKanban className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="block font-semibold">Open Source Catalog</span>
                      <span className="text-[11px] text-muted-foreground">Self-hostable tools & repos</span>
                    </div>
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Layers className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="block font-semibold">Category Index</span>
                      <span className="text-[11px] text-muted-foreground">Explore software domains</span>
                    </div>
                  </Link>
                  <Link
                    to="/collections/trending"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="block font-semibold">Trending Projects</span>
                      <span className="text-[11px] text-muted-foreground">Fastest growing repos</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. AI Tools Directory */}
            <Link
              to="/ai-tools"
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              AI Tools
            </Link>

            <Link
              to="/community-tools"
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Community Tools
            </Link>

            {/* 3. Free Tools */}
            <Link
              to="/free-tools"
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Utility Tools
            </Link>

            {/* 4. Alternatives */}
            <Link
              to="/alternatives"
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Alternatives
            </Link>

            {/* 5. Offers (AI Deals & Student Benefits) */}
            <Link
              to="/offers"
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150 inline-flex items-center gap-1.5"
            >
              <span>Offers</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">New</span>
            </Link>

            {/* 6. Learn Dropdown */}
            <div className="relative" ref={learnRef}>
              <button
                type="button"
                onClick={() => {
                  setIsLearnOpen(!isLearnOpen);
                  setIsDiscoverOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer ${
                  isLearnOpen
                    ? 'text-foreground bg-muted font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
                aria-expanded={isLearnOpen}
              >
                <span>Learn</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLearnOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLearnOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-lg bg-card border border-border p-1.5 shadow-lg shadow-black/30 z-50 flex flex-col gap-0.5 animate-fade-in">
                  <Link
                    to="/guides"
                    onClick={() => setIsLearnOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="block font-semibold">Guides & Tutorials</span>
                      <span className="text-[11px] text-muted-foreground">Step-by-step AI workflows</span>
                    </div>
                  </Link>
                  <Link
                    to="/prompt-library"
                    onClick={() => setIsLearnOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <MessageSquareCode className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="block font-semibold">Prompt Library</span>
                      <span className="text-[11px] text-muted-foreground">Tested model recipes</span>
                    </div>
                  </Link>
                  <Link
                    to="/updates"
                    onClick={() => setIsLearnOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <span className="block font-semibold">Changelog & Updates</span>
                      <span className="text-[11px] text-muted-foreground">Platform & AI releases</span>
                    </div>
                  </Link>
                  <div className="pt-1 mt-1 border-t border-border/60">
                    <Link
                      to="/submit-tool"
                      onClick={() => setIsLearnOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="block font-semibold">Submit an AI Tool</span>
                        <span className="text-[11px] text-muted-foreground">Add to public directory</span>
                      </div>
                    </Link>
                    <Link
                      to="/submit-guide"
                      onClick={() => setIsLearnOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                    >
                      <PenTool className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="block font-semibold">Submit a Guide</span>
                        <span className="text-[11px] text-muted-foreground">Share tutorial article</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Compare */}
            <Link
              to="/compare"
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-98 transition-all duration-150"
            >
              Compare
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
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

          {/* Submit Quick Link */}
          <Link
            to="/submit-tool"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 hover:border-primary/40 bg-card/60 hover:bg-muted text-xs font-semibold text-foreground transition-all duration-150"
            title="Submit an AI Tool or Tutorial"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            <span>Submit</span>
          </Link>

          {/* The theme hint sits beside the control so it points at a real,
              keyboard-accessible action rather than floating over navigation. */}
          <div className="hidden xl:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
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
        <div id="mobile-nav" className="xl:hidden border-b border-border bg-background px-4 py-5 flex flex-col gap-4 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar">
          {/* Group 1: Core Directories */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Discovery Directories
            </span>
            <Link
              to="/discoveries"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Daily Discoveries</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/ai-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Tools Directory</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/community-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5"><Sparkles className="w-4 h-4 text-emerald-400" /><span>Community Tools Directory</span></div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/alternatives"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Replace className="w-4 h-4 text-primary" />
                <span>Proprietary Alternatives</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/free-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-rose-400" />
                <span>Utility Tools</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/free-ai-sites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Free AI Sites & Plans</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-primary" />
                <span>AI Deals & Benefits</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary">NEW</span>
            </Link>
          </div>

          {/* Group 2: Guided Discovery & Comparison */}
          <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Guided Discovery & Catalog
            </span>
            <Link
              to="/pick"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Help Me Pick Wizard</span>
            </Link>
            <Link
              to="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Compare Software</span>
            </Link>
            <Link
              to="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <FolderKanban className="w-4 h-4 text-emerald-400" />
              <span>Open Source Catalog</span>
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Categories Index</span>
            </Link>
          </div>

          {/* Group 3: Learning & Resources */}
          <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Learning & Resources
            </span>
            <Link
              to="/guides"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Guides & Tutorials</span>
            </Link>
            <Link
              to="/prompt-library"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <MessageSquareCode className="w-4 h-4 text-purple-400" />
              <span>Prompt Library</span>
            </Link>
            <Link
              to="/updates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Changelog & Updates</span>
            </Link>
          </div>

          {/* Group 4: Community Contributions */}
          <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Community Contributions
            </span>
            <Link
              to="/submit-tool"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Submit an AI Tool</span>
            </Link>
            <Link
              to="/submit-guide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
            >
              <PenTool className="w-4 h-4 text-blue-400" />
              <span>Submit a Guide</span>
            </Link>
          </div>

          {/* Group 5: Preferences & Saved */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <Link
              to="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-foreground hover:bg-muted"
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
            <div className="px-3 pt-2">
              <ThemeToggle compact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
