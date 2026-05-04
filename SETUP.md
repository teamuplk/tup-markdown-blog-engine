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
## Deploying to Cloudflare Pages (git submodule workflow)

For downstream content repositories that want to deploy their blog to Cloudflare Pages, this engine supports a git submodule workflow.

### Recommended content repo structure

```text
your-blog-content/              ← Your Git repository (Cloudflare Pages project)
├── engine/                     ← Git submodule → tup-markdown-blog-engine
├── blog/                       ← Your markdown posts
├── public/                     ← Your uploads and public assets
│   └── content/uploads/...
├── site.config.json            ← Your site configuration
├── package.json                ← Delegates to engine scripts
├── .env.example                ← Documents required environment variables
└── .gitignore                  ← Ignores engine build artifacts
```

### Setting up the submodule

```bash
cd your-blog-content
git submodule add <engine-repo-url> engine
git submodule update --init --recursive
```

### Root package.json

Create a minimal `package.json` that delegates to the engine:

```jsonc
{
  "name": "your-blog-content",
  "private": true,
  "scripts": {
    "postinstall": "cd engine && npm install",
    "dev": "cd engine && npm run dev",
    "build": "cd engine && npm run build",
    "preview": "cd engine && npm run preview",
    "check": "cd engine && npm run check"
  }
}
```

### Cloudflare Pages configuration

In the Cloudflare Pages dashboard (or via `wrangler.toml`), configure:

| Setting | Value |
|---|---|
| **Build command** | `cd engine && npm ci && npm run build` |
| **Build output directory** | `engine/dist/` |
| **Root directory** | *(leave blank — uses repo root)* |
| **Enable submodules** | ✅ Checked (default for Cloudflare Pages) |

Add these **environment variables** (Production + Preview):

| Variable | Value |
|---|---|
| `BLOG_CONTENT_ROOT` | `../` |
| `SITE_URL` | `https://your-blog-domain.com` |

### How `BLOG_CONTENT_ROOT=../` works

- Cloudflare runs the build command from the content repo root.
- The build command changes into `engine/` (`cd engine`).
- From inside `engine/`, `../` resolves back to your content repo root.
- The engine then finds `blog/`, `site.config.json`, and `public/` there.

### Updating the engine

To pull the latest engine fixes into your content repo:

```bash
cd engine && git pull origin main
# or equivalently:
git submodule update --remote engine
```

Commit and push the updated submodule pointer:

```bash
git add engine
git commit -m "chore: update blog engine to latest"
git push
```

Cloudflare Pages will automatically rebuild and deploy.

### Cloning an existing content repo (for local development)

```bash
git clone --recurse-submodules <your-content-repo-url>
cd your-blog-content
cp .env.example .env     # Edit SITE_URL and BLOG_CONTENT_ROOT
npm install              # Installs root deps + triggers postinstall → cd engine && npm install
npm run dev
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```
