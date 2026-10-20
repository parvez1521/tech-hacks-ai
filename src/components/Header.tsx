import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '../router/Router';
import { getBookmarks, subscribeBookmarks } from '../services/bookmarkService';
import { useTheme } from '../context/ThemeContext';
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
  Clock,
  BookOpen,
  MessageSquareCode,
  Wrench,
  Bookmark,
  Scale,
  Compass,
  Tag,
  Sun,
  Moon,
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
  const { theme, toggleTheme } = useTheme();
  const { navigate } = useRouter();

  const handleColorModeToggle = () => {
    toggleTheme();
  };

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
    <header className="sticky top-0 inset-x-0 z-50 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md border-b border-[#DFE7F3] dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-5 xl:gap-7">
          <Link to="/" className="flex items-center shrink-0" aria-label="Tech Hacks AI Home">
            <TechHacksLogo size="sm" showWordmark={true} />
          </Link>

          {/* Compact, Organized Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {/* 1. Discover Dropdown */}
            <div className="relative" ref={discoverRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDiscoverOpen(!isDiscoverOpen);
                  setIsLearnOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  isDiscoverOpen
                    ? 'text-[#2563EB] bg-[#EAF2FF] font-semibold border border-[#BFDBFE] shadow-xs'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
                aria-expanded={isDiscoverOpen}
              >
                <span>Discover</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[#2563EB] ${isDiscoverOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDiscoverOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white border border-[#DFE7F3] p-2 shadow-xl shadow-slate-200/50 z-50 flex flex-col gap-1 animate-fade-in">
                  <Link
                    to="/discoveries"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#EAF2FF] border border-[#BFDBFE] flex items-center justify-center shrink-0 text-[#2563EB]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Daily Discoveries</span>
                      <span className="text-[11px] text-[#64748B]">Editor-verified AI tools</span>
                    </div>
                  </Link>
                  <Link
                    to="/pick"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-600">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Help Me Pick</span>
                      <span className="text-[11px] text-[#64748B]">Guided 3-question tool wizard</span>
                    </div>
                  </Link>
                  <Link
                    to="/tools"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Open Source Catalog</span>
                      <span className="text-[11px] text-[#64748B]">Self-hostable tools & repos</span>
                    </div>
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-sky-600">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Category Index</span>
                      <span className="text-[11px] text-[#64748B]">Explore software domains</span>
                    </div>
                  </Link>
                  <Link
                    to="/collections/trending"
                    onClick={() => setIsDiscoverOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Trending Projects</span>
                      <span className="text-[11px] text-[#64748B]">Fastest growing repos</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. AI Tools Directory */}
            <Link
              to="/ai-tools"
              className="px-3 py-1.5 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all duration-150"
            >
              AI Tools
            </Link>

            {/* 3. Free Tools */}
            <Link
              to="/free-tools"
              className="px-3 py-1.5 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all duration-150"
            >
              Free Tools
            </Link>

            {/* 4. Alternatives */}
            <Link
              to="/alternatives"
              className="px-3 py-1.5 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all duration-150"
            >
              Alternatives
            </Link>

            {/* 5. Offers (AI Deals & Student Benefits) */}
            <Link
              to="/offers"
              className="px-3 py-1.5 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all duration-150 inline-flex items-center gap-1.5"
            >
              <span>Offers</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FF] text-[#2563EB] border border-[#BFDBFE] uppercase tracking-wide">New</span>
            </Link>

            {/* 6. Learn Dropdown */}
            <div className="relative" ref={learnRef}>
              <button
                type="button"
                onClick={() => {
                  setIsLearnOpen(!isLearnOpen);
                  setIsDiscoverOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  isLearnOpen
                    ? 'text-[#2563EB] bg-[#EAF2FF] font-semibold border border-[#BFDBFE] shadow-xs'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
                aria-expanded={isLearnOpen}
              >
                <span>Learn</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[#2563EB] ${isLearnOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLearnOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white border border-[#DFE7F3] p-2 shadow-xl shadow-slate-200/50 z-50 flex flex-col gap-1 animate-fade-in">
                  <Link
                    to="/guides"
                    onClick={() => setIsLearnOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#EAF2FF] border border-[#BFDBFE] flex items-center justify-center shrink-0 text-[#2563EB]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Guides & Tutorials</span>
                      <span className="text-[11px] text-[#64748B]">Step-by-step AI workflows</span>
                    </div>
                  </Link>
                  <Link
                    to="/prompt-library"
                    onClick={() => setIsLearnOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-600">
                      <MessageSquareCode className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Prompt Library</span>
                      <span className="text-[11px] text-[#64748B]">Tested model recipes</span>
                    </div>
                  </Link>
                  <Link
                    to="/updates"
                    onClick={() => setIsLearnOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                  >
                    <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#0F172A]">Changelog & Updates</span>
                      <span className="text-[11px] text-[#64748B]">Platform & AI releases</span>
                    </div>
                  </Link>
                  <div className="pt-1.5 mt-1 border-t border-[#DFE7F3]">
                    <Link
                      to="/submit-tool"
                      onClick={() => setIsLearnOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                    >
                      <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#0F172A]">Submit an AI Tool</span>
                        <span className="text-[11px] text-[#64748B]">Add to public directory</span>
                      </div>
                    </Link>
                    <Link
                      to="/submit-guide"
                      onClick={() => setIsLearnOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#EAF2FF] hover:text-[#2563EB] transition-all duration-150"
                    >
                      <div className="w-7 h-7 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-sky-600">
                        <PenTool className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#0F172A]">Submit a Guide</span>
                        <span className="text-[11px] text-[#64748B]">Share tutorial article</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Compare */}
            <Link
              to="/compare"
              className="px-3 py-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all duration-150"
            >
              Compare
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#DFE7F3] active:scale-95 transition-all duration-150 cursor-pointer"
            title="Search software catalog"
            aria-label="Search software catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Saved Items Link */}
          <Link
            to="/saved"
            className="relative p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#DFE7F3] active:scale-95 transition-all duration-150 cursor-pointer"
            title="Saved Tools & Prompts"
            aria-label="View saved items"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </Link>

          {/* Theme Mode Toggle */}
          <button
            type="button"
            onClick={handleColorModeToggle}
            data-testid="color-mode-toggle"
            aria-label={theme === 'dark' ? 'Activate light theme' : 'Activate dark theme'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#DFE7F3] active:scale-95 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Submit Quick Link (Invary Royal Blue CTA) */}
          <Link
            to="/submit-tool"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs active:translate-y-px transition-all duration-150"
            title="Submit an AI Tool or Tutorial"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit Tool</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
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
        <div id="mobile-nav" className="lg:hidden border-b border-[#DFE7F3] dark:border-slate-800 bg-white/98 dark:bg-[#0B1220]/98 backdrop-blur-2xl px-4 py-5 flex flex-col gap-4 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl">
          {/* Group 1: Core Directories */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] px-2">
              Discovery Directories
            </span>
            <Link
              to="/discoveries"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>Daily Discoveries</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>
            <Link
              to="/ai-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>AI Tools Directory</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>
            <Link
              to="/alternatives"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Replace className="w-4 h-4 text-[#2563EB]" />
                <span>Proprietary Alternatives</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>
            <Link
              to="/free-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-sky-600" />
                <span>Free Browser Utilities</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>
            <Link
              to="/free-ai-sites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Free AI Sites & Plans</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>
            <Link
              to="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#2563EB]" />
                <span>AI Deals & Benefits</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FF] text-[#2563EB] border border-[#BFDBFE]">NEW</span>
            </Link>
          </div>

          {/* Group 2: Guided Discovery & Comparison */}
          <div className="flex flex-col gap-1 pt-2 border-t border-[#DFE7F3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] px-2">
              Guided Discovery & Catalog
            </span>
            <Link
              to="/pick"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Help Me Pick Wizard</span>
            </Link>
            <Link
              to="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Compare Software</span>
            </Link>
            <Link
              to="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <FolderKanban className="w-4 h-4 text-emerald-600" />
              <span>Open Source Catalog</span>
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Categories Index</span>
            </Link>
          </div>

          {/* Group 3: Learning & Resources */}
          <div className="flex flex-col gap-1 pt-2 border-t border-[#DFE7F3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] px-2">
              Learning & Resources
            </span>
            <Link
              to="/guides"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span>Guides & Tutorials</span>
            </Link>
            <Link
              to="/prompt-library"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <MessageSquareCode className="w-4 h-4 text-purple-600" />
              <span>Prompt Library</span>
            </Link>
            <Link
              to="/updates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Changelog & Updates</span>
            </Link>
          </div>

          {/* Group 4: Community Contributions */}
          <div className="flex flex-col gap-1 pt-2 border-t border-[#DFE7F3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] px-2">
              Community Contributions
            </span>
            <Link
              to="/submit-tool"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Submit an AI Tool</span>
            </Link>
            <Link
              to="/submit-guide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <PenTool className="w-4 h-4 text-sky-600" />
              <span>Submit a Guide</span>
            </Link>
          </div>

          {/* Group 5: Preferences & Saved */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#DFE7F3]">
            <Link
              to="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-[#2563EB]" />
                <span>Saved Items</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#EAF2FF] text-[#2563EB] text-xs font-bold border border-[#BFDBFE]">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Mobile Color Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                handleColorModeToggle();
              }}
              data-testid="mobile-color-mode-toggle"
              aria-label={theme === 'dark' ? 'Activate light theme' : 'Activate dark theme'}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
                <span>Color Theme</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF2FF] text-[#2563EB] font-medium border border-[#BFDBFE]">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
