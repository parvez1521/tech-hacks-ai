import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToolBySlug } from '../services/catalogService.ts';

export interface RouteMatch {
  name: string;
  path: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

export function safeScrollTo(options: ScrollToOptions) {
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo(options);
  }
}

interface RouterContextType {
  currentPath: string;
  searchParams: URLSearchParams;
  params: Record<string, string>;
  route: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  setSearchParam: (key: string, value: string | null, options?: { replace?: boolean }) => void;
  setSearchParams: (params: Record<string, string | null>, options?: { replace?: boolean }) => void;
  resetSearchParams: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function matchRoute(pathname: string): { route: string; params: Record<string, string> } {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  if (cleanPath === '/') {
    return { route: 'home', params: {} };
  }
  if (cleanPath === '/tools') {
    return { route: 'tools', params: {} };
  }
  if (cleanPath === '/categories') {
    return { route: 'categories', params: {} };
  }
  if (cleanPath === '/alternatives') {
    return { route: 'alternatives', params: {} };
  }
  if (cleanPath === '/ai-tools') {
    return { route: 'ai-tools', params: {} };
  }
  if (cleanPath === '/community-tools' || cleanPath === '/community') {
    return { route: 'community-redirect', params: {} };
  }
  if (cleanPath === '/free-ai-sites') {
    return { route: 'free-ai-sites', params: {} };
  }
  if (cleanPath === '/guides') {
    return { route: 'guides', params: {} };
  }
  if (cleanPath === '/prompt-library') {
    return { route: 'prompt-library', params: {} };
  }
  if (cleanPath === '/free-tools') {
    return { route: 'free-tools', params: {} };
  }
  if (cleanPath === '/compare') {
    return { route: 'compare', params: {} };
  }
  if (cleanPath === '/pick') {
    return { route: 'pick', params: {} };
  }
  if (cleanPath === '/saved') {
    return { route: 'saved', params: {} };
  }
  if (cleanPath === '/updates') {
    return { route: 'updates', params: {} };
  }
  if (cleanPath === '/offers') {
    return { route: 'offers', params: {} };
  }
  if (cleanPath === '/about' || cleanPath === '/about-us') {
    return { route: 'about', params: {} };
  }
  if (cleanPath === '/contact' || cleanPath === '/contact-us') {
    return { route: 'contact', params: {} };
  }
  if (cleanPath === '/privacy' || cleanPath === '/privacy-policy') {
    return { route: 'privacy', params: {} };
  }
  if (cleanPath === '/terms' || cleanPath === '/terms-of-use' || cleanPath === '/terms-of-service') {
    return { route: 'terms', params: {} };
  }
  if (cleanPath === '/disclosure' || cleanPath === '/affiliate-disclosure') {
    return { route: 'disclosure', params: {} };
  }
  if (cleanPath === '/submit-tool' || cleanPath === '/submit') {
    return { route: 'submit-tool', params: {} };
  }
  if (cleanPath === '/submit-guide') {
    return { route: 'submit-guide', params: {} };
  }
  if (cleanPath === '/submit-prompt') {
    return { route: 'submit-prompt', params: {} };
  }
  if (cleanPath === '/discoveries' || cleanPath === '/daily-discoveries' || cleanPath === '/featured') {
    return { route: 'discoveries', params: {} };
  }
  if (cleanPath === '/admin/moderation' || cleanPath === '/moderation' || cleanPath === '/admin') {
    return { route: 'moderation', params: {} };
  }

  // /offers/:slug
  const offersMatch = cleanPath.match(/^\/offers\/([^/]+)$/);
  if (offersMatch) {
    return { route: 'offer-detail', params: { slug: offersMatch[1] } };
  }

  // /tools/:slug
  const toolsMatch = cleanPath.match(/^\/tools\/([^/]+)$/);
  if (toolsMatch) {
    return { route: 'tool-detail', params: { slug: toolsMatch[1] } };
  }

  // /categories/:slug
  const categoriesMatch = cleanPath.match(/^\/categories\/([^/]+)$/);
  if (categoriesMatch) {
    return { route: 'category-detail', params: { slug: categoriesMatch[1] } };
  }

  // /alternatives/:slug
  const alternativesMatch = cleanPath.match(/^\/alternatives\/([^/]+)$/);
  if (alternativesMatch) {
    return { route: 'alternative-detail', params: { slug: alternativesMatch[1] } };
  }

  // /collections/:slug
  const collectionsMatch = cleanPath.match(/^\/collections\/([^/]+)$/);
  if (collectionsMatch) {
    return { route: 'collection-detail', params: { slug: collectionsMatch[1] } };
  }

  // /ai-tools/:slug
  const aiToolsMatch = cleanPath.match(/^\/ai-tools\/([^/]+)$/);
  if (aiToolsMatch) {
    return { route: 'ai-tool-detail', params: { slug: aiToolsMatch[1] } };
  }

  // Legacy community routes redirect to the editorial AI directory
  const communityToolsMatch = cleanPath.match(/^\/community-tools\/([^/]+)$/);
  if (communityToolsMatch) return { route: 'community-redirect', params: { slug: communityToolsMatch[1] } };

  // /guides/:slug
  const guidesMatch = cleanPath.match(/^\/guides\/([^/]+)$/);
  if (guidesMatch) {
    return { route: 'guide-detail', params: { slug: guidesMatch[1] } };
  }

  // /prompt-library/:slug
  const promptsMatch = cleanPath.match(/^\/prompt-library\/([^/]+)$/);
  if (promptsMatch) {
    return { route: 'prompt-detail', params: { slug: promptsMatch[1] } };
  }

  // /free-tools/:slug
  const freeToolsMatch = cleanPath.match(/^\/free-tools\/([^/]+)$/);
  if (freeToolsMatch) {
    return { route: 'free-tool-detail', params: { slug: freeToolsMatch[1] } };
  }

  // Also support root tool paths like /supabase if it matches a known tool
  const singleSlugMatch = cleanPath.match(/^\/([a-zA-Z0-9_-]+)$/);
  if (singleSlugMatch) {
    const tool = getToolBySlug(singleSlugMatch[1]);
    if (tool) {
      return { route: 'tool-detail', params: { slug: singleSlugMatch[1] } };
    }
  }

  return { route: 'not-found', params: {} };
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [searchParams, setSearchParamsState] = useState(
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    const url = new URL(to, window.location.origin);
    const newPath = url.pathname;
    const newSearch = url.searchParams;

    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setCurrentPath(newPath);
    setSearchParamsState(newSearch);
    safeScrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSearchParams = (paramsToUpdate: Record<string, string | null>, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    const currentUrl = new URL(window.location.href);
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null || value === '' || (key === 'page' && value === '1')) {
        currentUrl.searchParams.delete(key);
      } else {
        currentUrl.searchParams.set(key, value);
      }
    });

    const targetUrl = currentUrl.pathname + (currentUrl.search ? currentUrl.search : '');
    if (options?.replace) {
      window.history.replaceState({}, '', targetUrl);
    } else {
      window.history.pushState({}, '', targetUrl);
    }
    setSearchParamsState(new URLSearchParams(currentUrl.search));
  };

  const setSearchParam = (key: string, value: string | null, options?: { replace?: boolean }) => {
    setSearchParams({ [key]: value }, options);
  };

  const resetSearchParams = () => {
    if (typeof window === 'undefined') return;
    const currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    window.history.pushState({}, '', currentUrl.pathname);
    setSearchParamsState(new URLSearchParams());
  };

  const { route, params } = matchRoute(currentPath);

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        searchParams,
        params,
        route,
        navigate,
        setSearchParam,
        setSearchParams,
        resetSearchParams,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  children: ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, replace, children, className, onClick, ...rest }, ref) => {
  const { navigate, currentPath } = useRouter();
  const isActive = currentPath === to;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 && // Left click
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a
      ref={ref}
      href={to}
      onClick={handleClick}
      className={className}
      data-active={isActive ? 'true' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
});
Link.displayName = 'Link';
