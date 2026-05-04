import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function resolveDefaultContentRoot() {
  const localContentRoot = resolve(process.cwd(), 'content');
  const localBlogDir = resolve(localContentRoot, 'blog');

  if (existsSync(localBlogDir)) {
    return localContentRoot;
  }

  const starterContentRoot = resolve(process.cwd(), 'starter-content');
  const starterBlogDir = resolve(starterContentRoot, 'blog');

  return existsSync(starterBlogDir) ? starterContentRoot : undefined;
}

function resolveBlogContentBase() {
  const configuredContentDir = process.env.BLOG_CONTENT_DIR;
  const configuredContentRoot = process.env.BLOG_CONTENT_ROOT;
  const defaultContentRoot = resolveDefaultContentRoot();

  if (configuredContentDir) {
    return pathToFileURL(resolve(process.cwd(), configuredContentDir));
  }

  if (configuredContentRoot) {
    return pathToFileURL(resolve(process.cwd(), configuredContentRoot, 'blog'));
  }

  if (defaultContentRoot) {
    return pathToFileURL(resolve(defaultContentRoot, 'blog'));
  }

  return new URL('./content/blog/', import.meta.url);
}

const blogContentBase = resolveBlogContentBase();

const blog = defineCollection({
  loader: glob({
    base: blogContentBase,
    pattern: '**/*.{md,markdown,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { blog };