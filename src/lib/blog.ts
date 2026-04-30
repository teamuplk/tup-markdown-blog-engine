import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';

export type BlogPost = CollectionEntry<'blog'>;

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(date);
}

export async function getPublishedPosts() {
  const posts = await getCollection('blog');

  return posts
    .filter((post) => !post.data.draft)
    .sort((left, right) => right.data.pubDate.getTime() - left.data.pubDate.getTime());
}

export function collectTaxonomyItems(
  posts: BlogPost[],
  getter: (post: BlogPost) => string[],
) {
  const items = new Map<string, { slug: string; label: string; count: number }>();

  for (const post of posts) {
    for (const label of getter(post)) {
      const slug = slugify(label);
      const existing = items.get(slug);

      if (existing) {
        existing.count += 1;
      } else {
        items.set(slug, { slug, label, count: 1 });
      }
    }
  }

  return [...items.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function getRelatedPosts(currentPost: BlogPost, posts: BlogPost[]) {
  const currentCategory = slugify(currentPost.data.category);
  const currentTags = new Set(currentPost.data.tags.map(slugify));

  return posts
    .filter((post) => {
      if (post.slug === currentPost.slug) {
        return false;
      }

      const sameCategory = slugify(post.data.category) === currentCategory;
      const sharedTag = post.data.tags.some((tag) => currentTags.has(slugify(tag)));

      return sameCategory || sharedTag;
    })
    .slice(0, 3);
}

export function toSearchItem(post: BlogPost) {
  return {
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    pubDate: post.data.pubDate.toISOString(),
  };
}
