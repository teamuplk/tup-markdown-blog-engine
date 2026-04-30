---
title: Deploying to Cloudflare Pages
description: The static build path that keeps the blog easy to host and update.
pubDate: 2026-04-30
updatedDate: 2026-04-30
category: Deployment
tags:
  - cloudflare
  - pages
  - static-site
draft: false
---

Cloudflare Pages works well for a markdown-driven blog because the output is static and simple.

## What gets deployed

- HTML generated from Markdown
- CSS from Tailwind
- A small Vue bundle for search and other interactive UI

## Why it fits

There is no runtime database to manage, so publishing stays tied to Git.
