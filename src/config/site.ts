/**
 * Tech Hacks AI — Central Platform Configuration
 * Canonical brand identity, navigation routes, metadata, and social links.
 */

export interface NavItem {
  title: string;
  href: string;
  badge?: string;
  description?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  brandMark: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    twitter: string;
    email: string;
  };
  adsense: {
    enabled: boolean;
    publisherId: string;
    autoAds: boolean;
  };
  navigation: {
    main: NavItem[];
    discovery: NavItem[];
    resources: NavItem[];
    legal: NavItem[];
  };
  stats: {
    usersLabel: string;
    toolsIndexed: string;
    communitySize: string;
  };
  footer: {
    about: string;
    copyright: string;
  };
}

const configuredUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) || 'https://techhacksai.com';

export const siteConfig: SiteConfig = {
  name: 'Tech Hacks AI',
  shortName: 'Tech Hacks',
  brandMark: 'AI',
  tagline: 'Discover AI Tools, Free Software & Open-Source Alternatives',
  description:
    'A curated discovery platform for top generative AI tools, verified free software, open-source alternatives, step-by-step guides, and developer utilities.',
  url: configuredUrl.replace(/\/+$/, ''),
  ogImage: `${configuredUrl.replace(/\/+$/, '')}/og-image.png`,

  links: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    email: 'contact@techhacksai.com',
  },
  adsense: {
    enabled: false, // Remains disabled until formal Google AdSense account approval
    publisherId: '', // To be filled with official ca-pub-XXXXXXXXXXXXXXXX upon approval
    autoAds: false,
  },
  navigation: {
    main: [
      { title: 'AI Tools', href: '/ai-tools' },
      { title: 'Alternatives', href: '/alternatives' },
      { title: 'Open Source', href: '/tools' },
      { title: 'Guides', href: '/guides' },
      { title: 'Prompts', href: '/prompt-library' },
      { title: 'Free Tools', href: '/free-tools' },
    ],
    discovery: [
      { title: 'Daily Discoveries', href: '/discoveries', badge: 'New' },
      { title: 'AI Tools Directory', href: '/ai-tools' },
      { title: 'Proprietary Alternatives', href: '/alternatives' },
      { title: 'Open Source Catalog', href: '/tools' },
      { title: 'Free AI Sites', href: '/free-ai-sites', badge: 'Free' },
    ],
    resources: [
      { title: 'Help Me Pick', href: '/pick' },
      { title: 'Compare Software', href: '/compare' },
      { title: 'Free AI Sites', href: '/free-ai-sites' },
      { title: 'Categories Index', href: '/categories' },
      { title: 'Changelog & Updates', href: '/updates' },
    ],
    legal: [
      { title: 'About Us', href: '/about' },
      { title: 'Contact Us', href: '/contact' },
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Use', href: '/terms' },
      { title: 'Affiliate Disclosure', href: '/disclosure' },
    ],
  },
  stats: {
    usersLabel: 'Independent editorial directory',
    toolsIndexed: 'Curated catalogue',
    communitySize: 'Open to community submissions',
  },
  footer: {
    about:
      'Tech Hacks AI is a curated discovery platform indexing the top generative AI tools, verified free software, open-source alternatives, step-by-step guides, and developer utilities.',
    copyright: `© ${new Date().getFullYear()} Tech Hacks AI. Built with open web standards.`,
  },
};

/**
 * Format document title with standard Tech Hacks AI suffix
 */
export function formatPageTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return `${siteConfig.name} — ${siteConfig.tagline}`;
  }
  return `${pageTitle} — ${siteConfig.name}`;
}

/**
 * Resolves an absolute canonical URL given a relative route path
 */
export function getCanonicalUrl(pathname: string = '/'): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteConfig.url}${cleanPath}`;
}
