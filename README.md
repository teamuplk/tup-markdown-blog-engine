
<div align="center">
  <br />
  <h1 align="center">Tup Markdown Blog Engine</h1>
  <p align="center">
    A reusable, open-source Astro-powered blog engine with decoupled content management.
    <br />
    Write posts in Markdown. Keep content separate from the app. Deploy anywhere.
  </p>

  <p align="center">
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#quick-start"><strong>Quick Start</strong></a> ·
    <a href="#content-contract"><strong>Content Contract</strong></a> ·
    <a href="#deployment"><strong>Deployment</strong></a> ·
    <a href="./SETUP.md"><strong>Setup Guide →</strong></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
    <img src="https://img.shields.io/badge/astro-5.x-bc52ee.svg" alt="Astro 5.x" />
    <img src="https://img.shields.io/badge/vue-3.x-4fc08d.svg" alt="Vue 3.x" />
    <img src="https://img.shields.io/badge/tailwindcss-4.x-06b6d4.svg" alt="Tailwind CSS 4.x" />
  </p>
</div>

---

## Overview

This Markdown Blog Engine is an [Astro](https://astro.build)-based blog engine designed for an **open-source workflow** where the content can be updated independently with your posts, uploads, and site settings, and can be managed in your own repository.

The core idea is simple:

- **This repository** contains the engine — templates, components, styles, and build logic.
- **Your content** lives in a separate directory or your own repository — posts (`blog/`), uploads (`public/`), and configuration (`site.config.json`).
- **`BLOG_CONTENT_ROOT`** points the engine to your content layer.

This separation means you can pull engine updates without having to touch your content, and vice versa.

---

## Features

| Capability | Description |
|---|---|
| **Markdown blogging** | Write posts in plain Markdown with frontmatter metadata |
| **Decoupled content** | Keep posts, uploads, and config outside the engine repository |
| **Categories & tags** | Organize and filter posts by category or tag |
| **Client-side search** | Search titles, descriptions, categories, and tags without a backend |
| **Featured posts** | Pin selected posts to a carousel on the homepage |
| **RSS feed** | Auto-generated RSS feed at `/rss.xml` |
| **Sitemap** | Auto-generated sitemap for SEO |
| **Custom branding** | Override colors, navigation, and copy via `site.config.json` |
| **Tracking support** | Inject any analytics or third-party snippet via `site.config.json` — works with GA4, Plausible, Fathom, Clarity, and more |
| **Static output** | Builds to a flat static site — deploy to any static host |
| **Cloudflare Pages** | Built-in git submodule workflow for easy deployment |
| **Fast by default** | Astro's zero-JS-by-default philosophy keeps pages lean |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm

### 1. Clone and install

```bash
git clone https://github.com/teamuplk/tup-markdown-blog-engine.git
cd tup-markdown-blog-engine
npm install
```

### 2. Configure your environment

Copy the example environment file and edit it:

```bash
cp .env.example .env
```

```bash
# .env
SITE_URL=https://blog.example.com
BLOG_CONTENT_ROOT=../your-blog-content
```

### 3. Start the dev server

```bash
npm run dev
```

If `BLOG_CONTENT_ROOT` is not set, the engine automatically falls back to the included `starter-content/` directory — a working demo you can explore immediately.

---

## Content Contract

Your content layer — whether it's a local folder or a separate Git repository — must follow this structure:

```text
your-content-root/
├── blog/                          # Markdown posts
│   ├── hello-world.md
│   └── ...
├── public/                        # User-owned public assets
│   ├── favicon.svg
│   └── content/
│       └── uploads/
│           └── 2026/
│               └── 04/
│                   └── hero.svg
└── site.config.json               # Site configuration overrides
```

### Post frontmatter schema

Each Markdown post in `blog/` requires the following frontmatter:

```yaml
---
title: "Your Post Title"
description: "A short summary of the post."
pubDate: 2026-04-30
category: "Getting Started"
tags:
  - setup
  - guide
draft: false
heroImage: "/content/uploads/2026/04/hero.svg"   # optional
canonicalUrl: "https://example.com/original"       # optional
seoTitle: "Custom SEO Title"                       # optional
seoDescription: "Custom SEO description"           # optional
---
```

### Site configuration

`site.config.json` supports partial overrides on top of the engine's defaults (defined in `src/data/site.ts`). You only need to include the keys you want to change:

```json
{
  "title": "My Blog",
  "description": "My personal blog.",
  "url": "https://blog.example.com",
  "brandMark": "MB",
  "branding": { "primary": "#2563eb" },
  "nav": [
    { "href": "/", "label": "Home" },
    { "href": "/blog/", "label": "Blog" },
    { "href": "/categories/", "label": "Categories" }
  ],
  "featuredPosts": ["hello-world"]
}
```

> **Tip:** Use `featuredPosts` to pin specific posts to the homepage carousel. Set it to an array of post IDs (filenames without the `.md` extension).

### Tracking & analytics

You can inject any HTML snippet into every page via the `tracking` key. This works with Google Analytics, Plausible, Fathom, Cloudflare Web Analytics, Microsoft Clarity, and any other script-based service.

```json
{
  "tracking": {
    "head": "<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX\"></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');</script>",
    "body": ""
  }
}
```

- **`head`** — injected at the end of `<head>` (ideal for analytics scripts, tag managers).
- **`body`** — injected before `</body>` (ideal for cookie banners, chat widgets).

Both fields are optional — omit them entirely if you don't need tracking.

---

## Commands

All commands prepare the generated public assets directory first, then run the corresponding Astro command.

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and build the static site to `dist/` |
| `npm run preview` | Preview the built site locally |
| `npm run check` | Run Astro type-checking only |

---

## Open-Source Workflow

The intended workflow for downstream users:

1. **Keep this repository as the upstream engine** — pull updates when new fixes or features are released.
2. **Keep your content in a separate repository or folder** — your posts, uploads, and `site.config.json`.
3. **Point `BLOG_CONTENT_ROOT`** at your content layer.
4. **Pull engine updates** cleanly — because content never touches the engine repo, merges stay focused on templates and build logic.

---

## Deployment

### Static host (any)

Build the site and deploy the `dist/` directory to any static host:

```bash
npm run build
# deploy dist/ to Netlify, Vercel, GitHub Pages, S3, etc.
```

### Cloudflare Pages (recommended)

For a seamless deployment with git submodules, see the detailed guide in [SETUP.md](./SETUP.md#deploying-to-cloudflare-pages-git-submodule-workflow).

---

## Starter Content

The `starter-content/` directory is a fully working example of the external content contract. It includes:

- A sample post (`blog/welcome-to-your-blog.md`)
- A sample site config override (`site.config.json`)
- A sample favicon
- A sample upload under `public/content/uploads/`

Use it as a template for your own content repository or as a reference for the expected structure.

---

## Compatibility Overrides

For advanced setups or gradual migrations, the engine supports these optional environment variables that override the derived paths from `BLOG_CONTENT_ROOT`:

| Variable | Overrides | Description |
|---|---|---|
| `BLOG_CONTENT_DIR` | `BLOG_CONTENT_ROOT/blog` | Direct path to your markdown posts directory |
| `BLOG_SITE_CONFIG_PATH` | `BLOG_CONTENT_ROOT/site.config.json` | Direct path to your `site.config.json` |
| `BLOG_PUBLIC_DIR` | `BLOG_CONTENT_ROOT/public` | Direct path to your public assets directory |

---

## Project Structure

```text
tup-markdown-blog-engine/
├── public/                        # Engine-owned public assets (favicon, etc.)
├── scripts/
│   └── prepare-public-assets.mjs  # Merges engine + user public assets
├── src/
│   ├── components/                # Astro + Vue components
│   ├── data/
│   │   └── site.ts                # Default site configuration
│   ├── layouts/
│   │   └── BaseLayout.astro       # Root HTML layout
│   ├── lib/
│   │   ├── blog.ts                # Blog utility functions
│   │   └── slug.ts                # Slug generation helpers
│   ├── pages/
│   ├── content.config.ts          # Astro content collection schema
│   ├── env.d.ts
│   └── styles/
│       └── global.css             # Global styles + Tailwind
├── starter-content/               # Demo content (used as fallback)
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── SETUP.md                       # Detailed setup and deployment guide
├── CONTRIBUTING.md                # Contribution guidelines
├── CHANGELOG.md                   # Release history
└── LICENSE                        # MIT License
```

---

## Documentation

| Document | Description |
|---|---|
| [SETUP.md](./SETUP.md) | Detailed configuration, environment variables, and deployment guide |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guidelines for contributing to the engine |
| [CHANGELOG.md](./CHANGELOG.md) | Version history and release notes |

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <p>
    Built with <a href="https://astro.build">Astro</a> · <a href="https://vuejs.org/">Vue</a> · <a href="https://tailwindcss.com/">Tailwind CSS</a>
  </p>
  <p>
    <a href="https://github.com/teamuplk/tup-markdown-blog-engine">GitHub</a>
  </p>
</div>