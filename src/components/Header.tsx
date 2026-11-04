import React, { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from '../router/Router';
import { getBookmarks, subscribeBookmarks } from '../services/bookmarkService';
import { TechHacksLogo } from './TechHacksLogo';
import { ThemeToggle } from './ThemeToggle';
import { ArrowUpRight, Bookmark, Menu, Plus, Search, X } from 'lucide-react';

const groups = [
  { name: 'Discover', links: [
    ['All AI Tools', '/ai-tools'], ['Frontier Models', '/frontier-models'], ['Free Access', '/free-ai-sites'], ['GitHub Projects', '/github-projects'], ['AI Video', '/ai-tools?category=video'], ['Browse Categories', '/ai-tools'], ['Daily Discoveries', '/discoveries'], ['Help Me Pick', '/pick'],
  ] },
  { name: 'Build', links: [
    ['Open Source Catalog', '/tools'], ['Utility Tools', '/free-tools'], ['Alternatives', '/alternatives'], ['Compare', '/compare'],
  ] },
  { name: 'Learn', links: [
    ['Guides & Tutorials', '/guides'], ['Prompt Library', '/prompt-library'], ['Changelog & Updates', '/updates'],
  ] },
  { name: 'Offers', links: [
    ['Student benefits', '/offers?type=student-plan'], ['Startup credits', '/offers?type=startup-credits'], ['Discounts', '/offers?type=discount'], ['Official promotional offers', '/offers'],
  ] },
];

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [desktopOpenGroup, setDesktopOpenGroup] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const desktopTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { navigate, currentPath } = useRouter();
  useEffect(() => {
    setSavedCount(getBookmarks().length);
    return subscribeBookmarks((items) => setSavedCount(items.length));
  }, []);
  useEffect(() => {
    setOpen(false);
    setDesktopOpenGroup(null);
  }, [currentPath]);
  useEffect(() => {
    // Visual only: deepens the glass header surface once the page scrolls.
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setDesktopOpenGroup(null);
      }
    };
    const closeOnOutsideFocus = (event: FocusEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setDesktopOpenGroup(null);
      }
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('focusin', closeOnOutsideFocus);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('focusin', closeOnOutsideFocus);
    };
  }, []);
  const active = (href: string) => currentPath === href.split('?')[0] || currentPath.startsWith(`${href.split('?')[0]}/`);
  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    if (open) {
      event.preventDefault();
      setOpen(false);
      menuButtonRef.current?.focus();
      return;
    }
    if (desktopOpenGroup) {
      event.preventDefault();
      const openGroup = desktopOpenGroup;
      setDesktopOpenGroup(null);
      desktopTriggerRefs.current[openGroup]?.focus();
    }
  };
  const renderGroup = (group: typeof groups[number]) => (
    <details key={group.name} className="group border-b border-border last:border-0">
      <summary className={`min-h-11 px-2 text-sm ${group.links.some(([, href]) => active(href)) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'} list-none cursor-pointer select-none font-medium transition-colors hover:bg-muted/60 hover:text-foreground flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}>
        {group.name}<span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="pb-2 pl-2">
        {group.links.map(([label, href]) => <Link key={href + label} to={href} aria-current={active(href) ? 'page' : undefined} onClick={() => setOpen(false)} className={`flex items-center justify-between gap-5 min-h-11 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${active(href) ? 'text-primary bg-primary/10 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}>
          {label}<ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
        </Link>)}
      </div>
    </details>
  );
  const renderDesktopGroup = (group: typeof groups[number]) => {
    const isOpen = desktopOpenGroup === group.name;
    const menuId = `desktop-nav-${group.name.toLowerCase()}`;
    const alignment = group.name === 'Offers' ? 'right-0' : 'left-0';
    return (
      <div key={group.name} className="relative">
        <button
          ref={(element) => { desktopTriggerRefs.current[group.name] = element; }}
          type="button"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setDesktopOpenGroup((current) => current === group.name ? null : group.name)}
          className={`min-h-9 rounded-full px-3 text-[13px] list-none cursor-pointer select-none font-medium transition-colors flex items-center justify-between gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${group.links.some(([, href]) => active(href)) ? 'bg-primary/15 text-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]' : isOpen ? 'bg-muted/70 text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}
        >
          {group.name}<span aria-hidden="true" className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
        </button>
        <div id={menuId} hidden={!isOpen} aria-hidden={!isOpen} className={`absolute top-full ${alignment} mt-1 min-w-56 glass-strong rounded-[1.25rem] p-1.5 z-50`}>
          {group.links.map(([label, href]) => <Link key={href + label} to={href} aria-current={active(href) ? 'page' : undefined} onClick={() => setDesktopOpenGroup(null)} className={`flex items-center justify-between gap-5 min-h-11 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${active(href) ? 'text-primary bg-primary/10 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}>
            {label}<ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
          </Link>)}
        </div>
      </div>
    );
  };

  return <header onKeyDown={closeOnEscape} className={`site-header sticky top-0 z-50 border-b border-border ${scrolled ? 'site-header--scrolled' : ''}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 lg:gap-6">
      <Link to="/" aria-label="SwitchRoute home" className="shrink-0"><TechHacksLogo size="sm" showWordmark /></Link>
      <nav ref={desktopNavRef} aria-label="Primary" className="hidden lg:flex items-center gap-1">{groups.map((group) => renderDesktopGroup(group))}</nav>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => navigate('/ai-tools')} aria-label="Search AI tools" className="min-h-11 min-w-11 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Search className="mx-auto h-4 w-4" /></button>
        <Link to="/saved" aria-label={`Saved items${savedCount ? ` (${savedCount})` : ''}`} className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Bookmark className="h-4 w-4" />{savedCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{savedCount}</span>}</Link>
        <Link to="/submit-tool" className="glass-chip hidden min-h-11 items-center gap-1 px-3.5 text-[13px] font-medium hover:bg-muted md:inline-flex"><Plus className="w-3.5 h-3.5" /> Submit</Link>
        <div className="hidden lg:block"><ThemeToggle /></div>
        <button ref={menuButtonRef} type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation" className="lg:hidden min-h-11 min-w-11 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><span className="sr-only">Menu</span>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" aria-label="Mobile primary" className="lg:hidden max-h-[80vh] overflow-y-auto border-t border-border/70 px-4 py-2" onKeyDown={closeOnEscape}>{groups.map((group) => renderGroup(group))}<div className="pt-3"><ThemeToggle /></div></nav>}
  </header>;
};
