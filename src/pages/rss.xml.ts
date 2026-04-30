import rss from '@astrojs/rss';
import { getPostSlug, getPublishedPosts } from '../lib/blog';
import { siteConfig } from '../data/site';

export async function GET() {
  const posts = await getPublishedPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.seoDescription ?? post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${getPostSlug(post)}/`,
    })),
  });
}
