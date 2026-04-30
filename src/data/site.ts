export const siteConfig = {
  title: 'Tup Markdown Blog',
  description:
    'A markdown-first blog with categories, tags, search, and a Cloudflare Pages-friendly build.',
  url: process.env.SITE_URL ?? 'https://example.com',
  branding: {
    primary: '#2563eb',
    primarySoft: '#dbeafe',
    primaryForeground: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#eef2ff',
    foreground: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    accent: '#0f172a',
    link: '#2563eb',
    linkHover: '#1d4ed8',
    selection: '#00ef90',
    heroFrom: '#08d23e',
    heroTo: '#00ef90',
  },
  nav: [
    { href: '/', label: 'Home' },
    { href: '/blog/', label: 'Blog' },
    { href: '/categories/', label: 'Categories' },
    { href: '/tags/', label: 'Tags' },
  ],
};
