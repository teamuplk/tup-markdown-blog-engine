# Setup

This project supports two modes:

1. External content mode (recommended): point `BLOG_CONTENT_ROOT` at a content directory outside the engine.
2. Starter/default mode: when no content root is configured and no local `content/` directory exists, the engine falls back to `starter-content/` for demo purposes.

## External content mode

Set these environment variables before running the app or build:

```bash
SITE_URL=https://blog.example.com
BLOG_CONTENT_ROOT=../tup-blog-content
```

`BLOG_CONTENT_ROOT`

- Points to the single user-owned content root.
- The app resolves `blog/`, `site.config.json`, and `public/` inside that root automatically.
- This is the primary contract for downstream users.
- If it is not set and no local `content/` directory exists, the app uses `starter-content/` as a minimal demo default.

Expected structure:

```text
your-content-root/
	blog/
	public/
		content/
			uploads/
	site.config.json
```

## Compatibility overrides

If you need non-standard paths, the app still supports these optional overrides:

`BLOG_CONTENT_DIR`

- Points to the directory that contains your markdown posts.
- The app loads files from this directory through Astro's content loader.
- If set, this overrides `BLOG_CONTENT_ROOT/blog`.

`BLOG_SITE_CONFIG_PATH`

- Points to a JSON file with site-specific overrides.
- The JSON file is merged onto the defaults in `src/data/site.ts`.
- You only need to define the keys you want to override.
- If set, this overrides `BLOG_CONTENT_ROOT/site.config.json`.

`BLOG_PUBLIC_DIR`

- Points to a directory that mirrors Astro's `public/` structure.
- Its files are overlaid onto a generated public directory before `dev`, `build`, `check`, or `preview` runs.
- This is the supported place for user-owned uploads such as `/content/uploads/...`, plus optional overrides like `favicon.svg`.
- If set, this overrides `BLOG_CONTENT_ROOT/public`.

## Starter content

The `starter-content/` directory is a working example of the external content contract:

- `starter-content/blog/` contains markdown posts.
- `starter-content/site.config.json` contains partial site overrides.
- `starter-content/public/` contains user-owned public assets and uploads.

You can use it as a template for a separate content repository.

The repository's own TeamUp site content now lives in the separate `tup-blog-content/` directory using the same structure.

## Recommended open-source workflow

For downstream users:

1. Keep this repository as the blog engine/theme repository.
2. Keep your posts, uploads, and `site.config.json` in a separate repository or folder.
3. Point `BLOG_CONTENT_ROOT` at that external content layer.
4. Pull upstream changes from the blog engine repository when new fixes are released.

With that split, upstream updates stay focused on the app, while user-owned writing and branding stay outside the engine repo.