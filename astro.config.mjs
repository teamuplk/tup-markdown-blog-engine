import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function resolveDefaultContentRoot() {
  const localContentRoot = resolve(process.cwd(), 'content');
  const localBlogDir = resolve(localContentRoot, 'blog');

  return existsSync(localBlogDir) ? localContentRoot : undefined;
}

function resolvePublicSourceDir() {
  const configuredPublicDir = process.env.BLOG_PUBLIC_DIR;
  const configuredContentRoot = process.env.BLOG_CONTENT_ROOT;
  const defaultContentRoot = resolveDefaultContentRoot();

  if (configuredPublicDir) {
    return resolve(process.cwd(), configuredPublicDir);
  }

  if (configuredContentRoot) {
    return resolve(process.cwd(), configuredContentRoot, 'public');
  }

  if (defaultContentRoot) {
    const defaultPublicDir = resolve(defaultContentRoot, 'public');

    return existsSync(defaultPublicDir) ? defaultPublicDir : undefined;
  }

  return undefined;
}

function resolveGeneratedPublicDir() {
  const publicSourceDir = resolvePublicSourceDir() ?? 'engine-public';
  const key = createHash('sha1').update(publicSourceDir).digest('hex').slice(0, 12);

  return resolve(process.cwd(), '.generated/public', key);
}

const generatedPublicDir = resolveGeneratedPublicDir();

function resolveSiteConfigPath() {
  const configuredSiteConfigPath = process.env.BLOG_SITE_CONFIG_PATH;
  const configuredContentRoot = process.env.BLOG_CONTENT_ROOT;
  const defaultContentRoot = resolveDefaultContentRoot();

  if (configuredSiteConfigPath) {
    return resolve(process.cwd(), configuredSiteConfigPath);
  }

  if (configuredContentRoot) {
    return resolve(process.cwd(), configuredContentRoot, 'site.config.json');
  }

  if (defaultContentRoot) {
    const defaultSiteConfigPath = resolve(defaultContentRoot, 'site.config.json');

    return existsSync(defaultSiteConfigPath) ? defaultSiteConfigPath : undefined;
  }

  return undefined;
}

function resolveSiteUrl() {
  const configuredSiteUrl = process.env.SITE_URL;
  const resolvedSiteConfigPath = resolveSiteConfigPath();

  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  if (resolvedSiteConfigPath) {
    if (!existsSync(resolvedSiteConfigPath)) {
      throw new Error(`Configured site config does not exist: ${resolvedSiteConfigPath}`);
    }

    try {
      const parsed = JSON.parse(readFileSync(resolvedSiteConfigPath, 'utf-8'));

      if (typeof parsed.url === 'string' && parsed.url.length > 0) {
        return parsed.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read site config at ${resolvedSiteConfigPath}: ${message}`);
    }
  }

  return 'https://example.com';
}

export default defineConfig({
  site: resolveSiteUrl(),
  publicDir: generatedPublicDir,
  trailingSlash: 'always',
  integrations: [vue(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
