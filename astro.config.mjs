import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.com',
  trailingSlash: 'always',
  integrations: [vue(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
