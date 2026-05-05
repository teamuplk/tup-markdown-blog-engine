# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial open-source release of the Tup Markdown Blog Engine.
- MIT License, CONTRIBUTING.md, and CHANGELOG.md documentation.

## [0.1.0] - 2026-05-04

### Added

- Astro 5.x markdown blog engine with Vue 3 and Tailwind CSS 4.
- Decoupled content architecture via `BLOG_CONTENT_ROOT` environment variable.
- Content collection schema with frontmatter support (title, description, pubDate, category, tags, draft, heroImage, canonical URL, SEO fields).
- Static site generation with trailing slashes.
- RSS feed auto-generation at `/rss.xml`.
- Sitemap auto-generation via `@astrojs/sitemap`.
- Client-side post search component (Vue 3).
- Category and tag taxonomy pages.
- Featured posts carousel on the homepage.
- Customizable site configuration via `site.config.json` (deep-merge with defaults).
- Custom branding system (colors, navigation, copy).
- Starter content directory (`starter-content/`) with sample post and config.
- External public assets overlay system via `.generated/public/`.
- `prepare-public-assets.mjs` script for merging engine and user public assets.
- Cloudflare Pages deployment guide with git submodule workflow.
- Compatibility override environment variables (`BLOG_CONTENT_DIR`, `BLOG_SITE_CONFIG_PATH`, `BLOG_PUBLIC_DIR`).
- Sample page, robots.txt generation.
- Google Fonts (Muli) integration.
- Responsive design with Tailwind CSS utility classes.
