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
  const { navigate, currentPath } = useRouter();

  const isRouteActive = (to: string) => currentPath === to || currentPath.startsWith(`${to}/`);
  const navLinkClass = (to: string, className: string) =>
    `${className} ${isRouteActive(to) ? 'text-foreground bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'}`;
  const dropdownNavLinkClass = (to: string) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 ${isRouteActive(to) ? 'bg-accent text-primary font-semibold' : 'font-medium text-foreground hover:bg-primary/10 hover:text-primary'}`;
  const mobileNavLinkClass = (to: string) =>
    `flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm ${isRouteActive(to) ? 'text-foreground bg-muted font-semibold' : 'text-foreground hover:bg-muted'}`;
  const activeDiscoverRoute = ['/discoveries', '/pick', '/tools', '/categories', '/collections/trending'].some(isRouteActive);
  const activeLearnRoute = ['/guides', '/prompt-library', '/updates', '/submit-tool', '/submit-guide'].some(isRouteActive);

  const discoverRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const discoverButtonRef = useRef<HTMLButtonElement>(null);
  const learnButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape') return;
    if (isDiscoverOpen) {
      setIsDiscoverOpen(false);
      discoverButtonRef.current?.focus();
    }
    if (isLearnOpen) {
      setIsLearnOpen(false);
      learnButtonRef.current?.focus();
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      mobileMenuButtonRef.current?.focus();
    }
  };

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
    <header onKeyDown={handleHeaderKeyDown} className="sticky top-0 inset-x-0 z-50 bg-background/95 border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-5 xl:gap-7">
          <Link to="/" aria-label="SwitchRoute" aria-current={isRouteActive('/') ? 'page' : undefined} className="flex items-center shrink-0">
            <TechHacksLogo size="sm" showWordmark={true} />
          </Link>

          {/* Compact, Organized Desktop Navigation */}
          <nav aria-label="Primary" className="hidden xl:flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-medium">
            {/* 1. Discover Dropdown */}
            <div className="relative" ref={discoverRef}>
              <button
                ref={discoverButtonRef}
                type="button"
                onClick={() => {
                  setIsDiscoverOpen(!isDiscoverOpen);
                  setIsLearnOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer ${
                  isDiscoverOpen || activeDiscoverRoute
                    ? 'text-foreground bg-muted font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
                aria-expanded={isDiscoverOpen}
                aria-controls={isDiscoverOpen ? 'discover-menu' : undefined}
              >
                <span>Discover</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDiscoverOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDiscoverOpen && (
                  <div id="discover-menu" className="absolute top-full left-0 mt-2 w-60 rounded-lg bg-card border border-border p-1.5 shadow-lg shadow-black/30 z-50 flex flex-col gap-0.5 animate-fade-in">
                  <Link
                    to="/discoveries"
                    aria-current={isRouteActive('/discoveries') ? 'page' : undefined}
                    onClick={() => setIsDiscoverOpen(false)}
                    className={dropdownNavLinkClass('/discoveries')}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <div>
                      <span className="block font-semibold">Daily Discoveries</span>
                      <span className="text-[11px] text-muted-foreground">Editor-featured AI tools</span>
                    </div>
                  </Link>
                  <Link
                    to="/pick"
                    aria-current={isRouteActive('/pick') ? 'page' : undefined}
                    onClick={() => setIsDiscoverOpen(false)}
                    className={dropdownNavLinkClass('/pick')}
                  >
                    <Compass className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="block font-semibold">Help Me Pick</span>
                      <span className="text-[11px] text-muted-foreground">Guided 3-question tool wizard</span>
                    </div>
                  </Link>
                  <Link
                    to="/tools"
                    aria-current={isRouteActive('/tools') ? 'page' : undefined}
                    onClick={() => setIsDiscoverOpen(false)}
                    className={dropdownNavLinkClass('/tools')}
                  >
                    <FolderKanban className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="block font-semibold">Open Source Catalog</span>
                      <span className="text-[11px] text-muted-foreground">Self-hostable tools & repos</span>
                    </div>
                  </Link>
                  <Link
                    to="/categories"
                    aria-current={isRouteActive('/categories') ? 'page' : undefined}
                    onClick={() => setIsDiscoverOpen(false)}
                    className={dropdownNavLinkClass('/categories')}
                  >
                    <Layers className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="block font-semibold">Category Index</span>
                      <span className="text-[11px] text-muted-foreground">Explore software domains</span>
                    </div>
                  </Link>
                  <Link
                    to="/collections/trending"
                    aria-current={isRouteActive('/collections/trending') ? 'page' : undefined}
                    onClick={() => setIsDiscoverOpen(false)}
                    className={dropdownNavLinkClass('/collections/trending')}
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
              aria-current={isRouteActive('/ai-tools') ? 'page' : undefined}
              className={navLinkClass('/ai-tools', 'px-2.5 py-1.5 rounded-md active:scale-98 transition-all duration-150')}
            >
              AI Tools
            </Link>

            {/* 3. Free Tools */}
            <Link
              to="/free-tools"
              aria-current={isRouteActive('/free-tools') ? 'page' : undefined}
              className={navLinkClass('/free-tools', 'px-2.5 py-1.5 rounded-md active:scale-98 transition-all duration-150')}
            >
              Utility Tools
            </Link>

            {/* 4. Alternatives */}
            <Link
              to="/alternatives"
              aria-current={isRouteActive('/alternatives') ? 'page' : undefined}
              className={navLinkClass('/alternatives', 'px-2.5 py-1.5 rounded-md active:scale-98 transition-all duration-150')}
            >
              Alternatives
            </Link>

            {/* 5. Offers (AI Deals & Student Benefits) */}
            <Link
              to="/offers"
              aria-current={isRouteActive('/offers') ? 'page' : undefined}
              className={navLinkClass('/offers', 'px-2.5 py-1.5 rounded-md active:scale-98 transition-all duration-150 inline-flex items-center gap-1.5')}
            >
              <span>Offers</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">New</span>
            </Link>

            {/* 6. Learn Dropdown */}
            <div className="relative" ref={learnRef}>
              <button
                ref={learnButtonRef}
                type="button"
                onClick={() => {
                  setIsLearnOpen(!isLearnOpen);
                  setIsDiscoverOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer ${
                  isLearnOpen || activeLearnRoute
                    ? 'text-foreground bg-muted font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
                aria-expanded={isLearnOpen}
                aria-controls={isLearnOpen ? 'learn-menu' : undefined}
              >
                <span>Learn</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLearnOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLearnOpen && (
                <div id="learn-menu" className="absolute top-full left-0 mt-2 w-56 rounded-lg bg-card border border-border p-1.5 shadow-lg shadow-black/30 z-50 flex flex-col gap-0.5 animate-fade-in">
                  <Link
                    to="/guides"
                    aria-current={isRouteActive('/guides') ? 'page' : undefined}
                    onClick={() => setIsLearnOpen(false)}
                    className={dropdownNavLinkClass('/guides')}
                  >
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="block font-semibold">Guides & Tutorials</span>
                      <span className="text-[11px] text-muted-foreground">Step-by-step AI workflows</span>
                    </div>
                  </Link>
                  <Link
                    to="/prompt-library"
                    aria-current={isRouteActive('/prompt-library') ? 'page' : undefined}
                    onClick={() => setIsLearnOpen(false)}
                    className={dropdownNavLinkClass('/prompt-library')}
                  >
                    <MessageSquareCode className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="block font-semibold">Prompt Library</span>
                      <span className="text-[11px] text-muted-foreground">Tested model recipes</span>
                    </div>
                  </Link>
                  <Link
                    to="/updates"
                    aria-current={isRouteActive('/updates') ? 'page' : undefined}
                    onClick={() => setIsLearnOpen(false)}
                    className={dropdownNavLinkClass('/updates')}
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
                      aria-current={isRouteActive('/submit-tool') ? 'page' : undefined}
                      onClick={() => setIsLearnOpen(false)}
                      className={dropdownNavLinkClass('/submit-tool')}
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="block font-semibold">Submit an AI Tool</span>
                        <span className="text-[11px] text-muted-foreground">Add to public directory</span>
                      </div>
                    </Link>
                    <Link
                      to="/submit-guide"
                      aria-current={isRouteActive('/submit-guide') ? 'page' : undefined}
                      onClick={() => setIsLearnOpen(false)}
                      className={dropdownNavLinkClass('/submit-guide')}
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
              aria-current={isRouteActive('/compare') ? 'page' : undefined}
              className={navLinkClass('/compare', 'px-2.5 py-1.5 rounded-md active:scale-98 transition-all duration-150')}
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
            aria-current={isRouteActive('/saved') ? 'page' : undefined}
            className={`relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 cursor-pointer ${isRouteActive('/saved') ? 'text-foreground bg-muted' : ''}`}
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
            aria-current={isRouteActive('/submit-tool') ? 'page' : undefined}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 hover:border-primary/40 bg-card/60 hover:bg-muted text-xs font-semibold text-foreground transition-all duration-150 ${isRouteActive('/submit-tool') ? 'border-primary/40 bg-muted' : ''}`}
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
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label="Toggle mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls={isMobileMenuOpen ? 'mobile-nav' : undefined}
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
              aria-current={isRouteActive('/discoveries') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/discoveries')}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Daily Discoveries</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/ai-tools"
              aria-current={isRouteActive('/ai-tools') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/ai-tools')}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Tools Directory</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/alternatives"
              aria-current={isRouteActive('/alternatives') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/alternatives')}
            >
              <div className="flex items-center gap-2.5">
                <Replace className="w-4 h-4 text-primary" />
                <span>Proprietary Alternatives</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/free-tools"
              aria-current={isRouteActive('/free-tools') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/free-tools')}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-rose-400" />
                <span>Utility Tools</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/free-ai-sites"
              aria-current={isRouteActive('/free-ai-sites') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/free-ai-sites')}
            >
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Free AI Sites & Plans</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/offers"
              aria-current={isRouteActive('/offers') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/offers')}
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
              aria-current={isRouteActive('/pick') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/pick')}
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Help Me Pick Wizard</span>
            </Link>
            <Link
              to="/compare"
              aria-current={isRouteActive('/compare') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/compare')}
            >
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Compare Software</span>
            </Link>
            <Link
              to="/tools"
              aria-current={isRouteActive('/tools') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/tools')}
            >
              <FolderKanban className="w-4 h-4 text-emerald-400" />
              <span>Open Source Catalog</span>
            </Link>
            <Link
              to="/categories"
              aria-current={isRouteActive('/categories') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/categories')}
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
              aria-current={isRouteActive('/guides') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/guides')}
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Guides & Tutorials</span>
            </Link>
            <Link
              to="/prompt-library"
              aria-current={isRouteActive('/prompt-library') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/prompt-library')}
            >
              <MessageSquareCode className="w-4 h-4 text-purple-400" />
              <span>Prompt Library</span>
            </Link>
            <Link
              to="/updates"
              aria-current={isRouteActive('/updates') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/updates')}
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
              aria-current={isRouteActive('/submit-tool') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/submit-tool')}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Submit an AI Tool</span>
            </Link>
            <Link
              to="/submit-guide"
              aria-current={isRouteActive('/submit-guide') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/submit-guide')}
            >
              <PenTool className="w-4 h-4 text-blue-400" />
              <span>Submit a Guide</span>
            </Link>
          </div>

          {/* Group 5: Preferences & Saved */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <Link
              to="/saved"
              aria-current={isRouteActive('/saved') ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass('/saved')}
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
