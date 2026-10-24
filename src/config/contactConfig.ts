/**
 * Public SwitchRoute contact channels.
 * Add a phone number in international format and the verified Instagram profile here
 * only after the owner confirms them. Empty values stay hidden from visitors.
 */
export const contactConfig = {
  phone: '',
  instagramHandle: '',
  instagramUrl: '',
  email: 'contact@techhacksai.com',
} as const;

export interface ContactOption {
  id: 'phone' | 'instagram' | 'email';
  label: 'Phone' | 'Instagram' | 'Email';
  display: string;
  href: string;
  external: boolean;
}

export function getConfiguredContactOptions(config: typeof contactConfig | Record<string, string> = contactConfig): ContactOption[] {
  const options: ContactOption[] = [];
  const phone = typeof config.phone === 'string' ? config.phone.trim() : '';
  const phoneHref = phone.replace(/[^\d+]/g, '');
  if (/^\+?[1-9]\d{6,14}$/.test(phoneHref)) {
    options.push({ id: 'phone', label: 'Phone', display: phone, href: `tel:${phoneHref}`, external: false });
  }

  const handle = typeof config.instagramHandle === 'string' ? config.instagramHandle.trim().replace(/^@/, '') : '';
  const instagramUrl = typeof config.instagramUrl === 'string' ? config.instagramUrl.trim() : '';
  if (handle && instagramUrl) {
    try {
      const parsed = new URL(instagramUrl);
      const pathHandle = parsed.pathname.split('/').filter(Boolean)[0];
      const supportedHost = parsed.hostname === 'instagram.com' || parsed.hostname === 'www.instagram.com';
      if (parsed.protocol === 'https:' && supportedHost && pathHandle === handle && /^[A-Za-z0-9._]+$/.test(handle)) {
        options.push({ id: 'instagram', label: 'Instagram', display: `@${handle}`, href: `https://www.instagram.com/${handle}/`, external: true });
      }
    } catch {
      // Invalid/unverified profile values remain hidden.
    }
  }

  const email = typeof config.email === 'string' ? config.email.trim() : '';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    options.push({ id: 'email', label: 'Email', display: email, href: `mailto:${email}`, external: false });
  }

  return options;
}
