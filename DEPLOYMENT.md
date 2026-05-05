# Cloudflare Pages Deployment Guide

This guide explains how to deploy blogs using the `tup-markdown-blog-engine` to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with Pages enabled
2. **Wrangler CLI**: Install the Cloudflare Wrangler CLI globally:
   ```bash
   npm install -g wrangler
   ```
3. **Git Repository**: Your blog should be in a Git repository

## Quick Start

### For Existing Blogs

1. **Navigate to your blog content directory**:
   ```bash
   cd /path/to/your-blog-content
   ```

2. **Copy the example configuration**:
   ```bash
   cp engine/deploy.example.toml wrangler.toml
   ```

3. **Customize the configuration**:
   - Open `wrangler.toml`
   - Update `name` with your project name in Cloudflare Pages
   - Update environment names if needed

4. **Build and deploy locally** (for testing):
   ```bash
   npm run build
   npm run deploy
   ```

### For New Blogs

1. **Create a new Cloudflare Pages project**:
   - Go to Cloudflare Dashboard → Pages → Create a project
   - Connect your Git repository
   - Set the build settings:
     - **Build command**: `cd engine && npm run build`
     - **Build output directory**: `engine/dist`
     - **Root directory**: (leave empty or set to your blog content directory)

2. **Add environment variables** (if needed):
   - `SITE_URL`: Your site's URL (e.g., `https://blog.example.com`)
   - `BLOG_CONTENT_ROOT`: Path to your content directory (e.g., `../blog`)
   - `BLOG_PUBLIC_DIR`: Path to your public assets directory (e.g., `../public`)

## Deployment Commands

### Local Deployment

```bash
# Deploy to Cloudflare Pages (uses default branch)
npm run deploy

# Deploy to production (main branch)
npm run deploy:prod

# Deploy to preview branch
npm run deploy:preview
```

### CI/CD Deployment

Add these scripts to your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build site
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: your-blog-name
          directory: ./engine/dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Environment Variables

The following environment variables can be configured in Cloudflare Pages dashboard or via `.env` files:

| Variable | Description | Example |
|----------|-------------|---------|
| `SITE_URL` | Your site's canonical URL | `https://blog.example.com` |
| `BLOG_CONTENT_ROOT` | Path to content directory | `../blog` |
| `BLOG_PUBLIC_DIR` | Path to public assets | `../public` |
| `BLOG_SITE_CONFIG_PATH` | Path to site config file | `../site.config.json` |

## Troubleshooting

### Build fails with "command not found: wrangler"
- Install Wrangler CLI: `npm install -g wrangler`

### Build fails with module resolution errors
- Ensure all dependencies are installed: `npm install` in both root and engine directories

### Site not updating after deployment
- Check Cloudflare Pages dashboard for build logs
- Ensure you're deploying the correct branch
- Clear Cloudflare cache if needed

### Environment variables not working
- Set variables in Cloudflare Pages dashboard (Settings → Environment variables)
- Variables set locally in `.env` files are not used by Cloudflare Pages

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)