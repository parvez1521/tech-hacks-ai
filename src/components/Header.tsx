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
  const [savedCount, setSavedCount] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { navigate, currentPath } = useRouter();
  useEffect(() => {
    setSavedCount(getBookmarks().length);
    return subscribeBookmarks((items) => setSavedCount(items.length));
  }, []);
  useEffect(() => { setOpen(false); }, [currentPath]);
  const active = (href: string) => currentPath === href.split('?')[0] || currentPath.startsWith(`${href.split('?')[0]}/`);
  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      menuButtonRef.current?.focus();
    }
  };
  const renderGroup = (group: typeof groups[number], mobile = false) => <details key={group.name} className={mobile ? 'group border-b border-border last:border-0' : 'relative'}>
    <summary className={`${mobile ? 'py-3 px-2 text-base' : 'px-2.5 py-2 text-sm'} list-none cursor-pointer select-none font-medium text-muted-foreground hover:text-foreground flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden`}>
      {group.name}<span aria-hidden="true" className="text-xs">⌄</span>
    </summary>
    <div className={mobile ? 'pb-2 pl-2' : 'absolute top-full left-0 mt-1 min-w-56 rounded-lg border border-border bg-card p-1.5 shadow-lg z-50'}>
      {group.links.map(([label, href]) => <Link key={href + label} to={href} aria-current={active(href) ? 'page' : undefined} onClick={() => mobile && setOpen(false)} className={`flex items-center justify-between gap-5 ${mobile ? 'min-h-11' : 'min-h-10'} rounded-md px-3 py-2 text-sm ${active(href) ? 'text-foreground bg-muted font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}>
        {label}<ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
      </Link>)}
    </div>
  </details>;

  return <header onKeyDown={closeOnEscape} className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <Link to="/" aria-label="SwitchRoute home" className="shrink-0"><TechHacksLogo size="sm" showWordmark /></Link>
      <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">{groups.map((group) => renderGroup(group))}</nav>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => navigate('/ai-tools')} aria-label="Search AI tools" className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Search className="w-4 h-4" /></button>
        <Link to="/saved" aria-label={`Saved items${savedCount ? ` (${savedCount})` : ''}`} className="relative p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Bookmark className="w-4 h-4" />{savedCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{savedCount}</span>}</Link>
        <Link to="/submit-tool" className="hidden md:inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"><Plus className="w-3.5 h-3.5" /> Submit</Link>
        <div className="hidden lg:block"><ThemeToggle /></div>
        <button ref={menuButtonRef} type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation" className="lg:hidden min-h-11 min-w-11 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted"><span className="sr-only">Menu</span>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" aria-label="Mobile primary" className="lg:hidden max-h-[80vh] overflow-y-auto border-t border-border bg-background px-4 py-2" onKeyDown={closeOnEscape}>{groups.map((group) => renderGroup(group, true))}<div className="pt-3"><ThemeToggle /></div></nav>}
  </header>;
};
