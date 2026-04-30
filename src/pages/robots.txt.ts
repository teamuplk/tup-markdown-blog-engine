import { siteConfig } from '../data/site';

export async function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', siteConfig.url).toString()}\n`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
}
