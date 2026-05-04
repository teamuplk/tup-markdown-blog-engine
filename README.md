# Tup Markdown Blog Engine

Astro-based markdown blog engine designed for an open-source workflow where the app can be updated independently from a user's posts, uploads, and site settings.

This repository keeps TeamUp's local posts, uploads, and site configuration in the top-level `content/` directory so local development still renders the TeamUp site without mixing that data into the app layer.

## What this supports

- A reusable blog engine in this repository.
- A single external content root for user-owned posts, config, and public assets.

## Quick start

1. Install dependencies.

```bash
npm install
```

2. Copy `.env.example` to `.env` and point the content root at your content layer.

```bash
SITE_URL=https://example.com
BLOG_CONTENT_ROOT=content
```

If `BLOG_CONTENT_ROOT` is not set, the app automatically uses the repository's local `content/` directory when it exists.

3. Start the site.

```bash
npm run dev
```

## Content contract

Your external content layer can live in a separate repository or folder. It should contain:

- `blog/` with markdown files matching the schema in `src/content.config.ts`.
- `site.config.json` with partial overrides for `src/data/site.ts`.
- `public/` mirroring Astro's public directory structure.

Set `BLOG_CONTENT_ROOT` to that directory and the app resolves all three paths automatically.

Example:

```text
my-blog-content/
  blog/
    hello-world.md
  public/
    content/
      uploads/
        2026/
          04/
            hero.svg
    favicon.svg
  site.config.json
```

The same structure is used by this repository's own `content/` directory for local TeamUp development.

## Update workflow

The intended open-source workflow is:

1. Keep this repository as the upstream engine/theme repo.
2. Keep your posts, uploads, and site config in a separate repo or external folder.
3. Point `BLOG_CONTENT_ROOT` at that user-owned content layer.
4. Pull updates from this engine repo when new fixes are released.

That keeps upstream merges focused on templates, components, styles, and build logic instead of mixing them with a consumer's content changes.

## Commands

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check`

Each command prepares a generated public-assets directory first, then runs Astro.

## Starter content

`starter-content/` is a working example of the external content contract. It includes:

- a sample post
- a sample site config override
- a sample favicon
- a sample upload under `public/content/uploads/...`

Use it as a reference or as the basis for a separate starter content repository.

The separate `content/` directory is the repository's real TeamUp content root.

## More detail

See `SETUP.md` for the configuration details behind the external content and assets workflow.

## Compatibility

`BLOG_CONTENT_ROOT` is the primary contract.

For advanced overrides or a gradual migration, the app still accepts:

- `BLOG_CONTENT_DIR`
- `BLOG_SITE_CONFIG_PATH`
- `BLOG_PUBLIC_DIR`

Those override the derived paths from `BLOG_CONTENT_ROOT` when set.