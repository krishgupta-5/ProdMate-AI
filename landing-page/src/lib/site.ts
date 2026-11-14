// Chat app URL. Override with VITE_CHAT_URL; defaults to the live chat app.
const CHAT_URL: string = import.meta.env.VITE_CHAT_URL || 'https://chat.prodmate.dev/';

/** Every link that leaves this site, plus this site's own pages. */
export const links = {
  app: CHAT_URL,
  login: new URL('login', CHAT_URL).toString(),
  docs: '/docs',
  getStarted: '/get-started',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
};

/** Where to write to us. */
export const emails = {
  hello: 'krishgupta0072@gmail.com',
  privacy: 'privacy@prodmate.dev',
  legal: 'legal@prodmate.dev',
};

/** The nav's links: sections of the home page, then the docs. */
export const navItems = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Integrations', href: '/#integrations' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Docs', href: links.docs },
];
