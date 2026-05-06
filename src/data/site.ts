import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (typeof process.loadEnvFile === 'function') {
  const rootEnvPath = resolve(process.cwd(), '.env');
  const localEnvPath = resolve(process.cwd(), '.env.local');

  if (existsSync(rootEnvPath)) {
    process.loadEnvFile(rootEnvPath);
  }

  if (existsSync(localEnvPath)) {
    process.loadEnvFile(localEnvPath);
  }
}

type NavItem = {
  href: string;
  label: string;
};

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer Item>
    ? Array<DeepPartial<Item>>
    : { [Key in keyof T]?: DeepPartial<T[Key]> };

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  brandMark: string;
  branding: {
    primary: string;
    primarySoft: string;
    primaryForeground: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    foreground: string;
    muted: string;
    border: string;
    accent: string;
    link: string;
    linkHover: string;
    selection: string;
    heroFrom: string;
    heroTo: string;
  };
  nav: NavItem[];
  featuredPosts?: string[];
  home: {
    badge: string;
    title: string;
    description: string;
    primaryCta: NavItem;
    secondaryCta: NavItem;
    stats: {
      postsLabel: string;
      categoriesLabel: string;
      tagsLabel: string;
      hostingLabel: string;
      hostingValue: string;
    };
    featuredSection: {
      eyebrow: string;
      title: string;
      readMore: string;
    };
    categoriesSection: {
      eyebrow: string;
      title: string;
      ctaLabel: string;
    };
    latestSection: {
      eyebrow: string;
      title: string;
      ctaLabel: string;
    };
    tagsSection: {
      eyebrow: string;
      title: string;
      ctaLabel: string;
      showTags?: string[];
    };
  };
  blogIndex: {
    metaDescription: string;
    eyebrow: string;
    title: string;
    description: string;
  };
  categoriesPage: {
    metaDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    cardLabel: string;
    detailEyebrow: string;
    detailDescription: string;
    emptyMessage: string;
  };
  tagsPage: {
    metaDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    detailEyebrow: string;
    detailDescription: string;
    emptyMessage: string;
  };
  relatedPosts: {
    eyebrow: string;
    title: string;
  };
  /**
   * Optional HTML snippets injected into every page.
   * Use `head` for scripts that belong in <head> (e.g. GA4, Plausible)
   * and `body` for snippets that go before </body> (e.g. cookie banners).
   */
  tracking?: {
    head?: string;
    body?: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeConfig<T>(base: T, override?: DeepPartial<T>): T {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base)) {
    return override as T;
  }

  if (!isRecord(base) || !isRecord(override)) {
    return override as T;
  }

  const merged = { ...base } as Record<string, unknown>;

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) {
      continue;
    }

    const current = merged[key];

    if (Array.isArray(value)) {
      merged[key] = value;
      continue;
    }

    if (isRecord(current) && isRecord(value)) {
      merged[key] = mergeConfig(
        current as Record<string, unknown>,
        value as DeepPartial<Record<string, unknown>>,
      );
      continue;
    }

    merged[key] = value;
  }

  return merged as T;
}

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

function resolveSiteConfigPath() {
  const configuredPath = process.env.BLOG_SITE_CONFIG_PATH;
  const configuredRoot = process.env.BLOG_CONTENT_ROOT;
  const defaultContentRoot = resolveDefaultContentRoot();

  if (configuredPath) {
    return resolve(process.cwd(), configuredPath);
  }

  if (configuredRoot) {
    return resolve(process.cwd(), configuredRoot, 'site.config.json');
  }

  if (defaultContentRoot) {
    const defaultSiteConfigPath = resolve(defaultContentRoot, 'site.config.json');

    return existsSync(defaultSiteConfigPath) ? defaultSiteConfigPath : undefined;
  }

  return undefined;
}

function loadSiteOverride(): DeepPartial<SiteConfig> | undefined {
  const resolvedPath = resolveSiteConfigPath();

  if (!resolvedPath) {
    return undefined;
  }

  if (!existsSync(resolvedPath)) {
    throw new Error(`Configured site config does not exist: ${resolvedPath}`);
  }

  try {
    return JSON.parse(readFileSync(resolvedPath, 'utf-8')) as DeepPartial<SiteConfig>;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read site config at ${resolvedPath}: ${message}`);
  }
}

export const defaultSiteConfig: SiteConfig = {
  title: 'Tup Markdown Blog Engine',
  description: 'A reusable markdown blog engine with categories, tags, search, and static deployment.',
  url: process.env.SITE_URL ?? 'https://example.com',
  brandMark: 'TB',
  branding: {
    primary: '#2563eb',
    primarySoft: '#dbeafe',
    primaryForeground: '#ffffff',
    background: '#f8fafc',
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
  ],
  featuredPosts: [],
  home: {
    badge: 'Markdown publishing starter',
    title: 'Publish your blog without coupling content to the app.',
    description:
      'Use a single content root for posts, uploads, and site settings while keeping the Astro engine easy to update.',
    primaryCta: { href: '/blog/', label: 'Browse posts' },
    secondaryCta: { href: '/categories/', label: 'View categories' },
    stats: {
      postsLabel: 'Published posts',
      categoriesLabel: 'Categories',
      tagsLabel: 'Tags',
      hostingLabel: 'Hosting',
      hostingValue: 'Cloudflare Pages',
    },
    featuredSection: {
      eyebrow: 'Featured',
      title: 'Featured Posts',
      readMore: 'Read more',
    },
    categoriesSection: {
      eyebrow: 'Categories',
      title: 'Keep the blog organized',
      ctaLabel: 'All categories',
    },
    latestSection: {
      eyebrow: 'Latest posts',
      title: 'Fresh content',
      ctaLabel: 'All posts',
    },
    tagsSection: {
      eyebrow: 'Tags',
      title: 'Browse by tag',
      ctaLabel: 'All tags',
      showTags: [],
    },
  },
  blogIndex: {
    metaDescription: 'Browse every post and search the archive.',
    eyebrow: 'Blog',
    title: 'Blog archive',
    description: 'Search posts by title, category, or description without needing a backend.',
  },
  categoriesPage: {
    metaDescription: 'Browse all categories in the archive.',
    eyebrow: 'Categories',
    title: 'Browse the content by category',
    description: 'Categories make the archive easy to scan and keep related posts grouped together.',
    cardLabel: 'Category',
    detailEyebrow: 'Category',
    detailDescription: 'All posts grouped under this category.',
    emptyMessage: 'No posts were found for this category.',
  },
  tagsPage: {
    metaDescription: 'Browse all tags in the archive.',
    eyebrow: 'Tags',
    title: 'Browse the content by tag',
    description: 'Tags make it easy to browse posts by tag and spot related content across categories.',
    detailEyebrow: 'Tag',
    detailDescription: 'Posts linked by the same tag.',
    emptyMessage: 'No posts were found for this tag.',
  },
  relatedPosts: {
    eyebrow: 'Related',
    title: 'More posts like this',
  },
  tracking: {
    head: '',
    body: '',
  },
};

const mergedSiteConfig = mergeConfig<SiteConfig>(defaultSiteConfig, loadSiteOverride());

export const siteConfig: SiteConfig = {
  ...mergedSiteConfig,
  url: process.env.SITE_URL ?? mergedSiteConfig.url,
};
