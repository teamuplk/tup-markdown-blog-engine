---
title: "Welcome to your blog"
description: "A sample post that demonstrates how external content can power the site without editing the upstream app code."
pubDate: 2026-04-30
category: "Getting Started"
tags:
  - setup
  - starter
draft: false
---

This post lives in `starter-content/blog` instead of `src/content/blog`.

<figure>
  <img src="/content/uploads/2026/04/starter-cover.svg" alt="Starter cover graphic" />
</figure>

That is the core separation needed for an open-source distribution model where users can keep their own writing while you continue shipping improvements to the blog engine.

To use this mode, point `BLOG_CONTENT_DIR` at your external content folder and `BLOG_SITE_CONFIG_PATH` at your external JSON config file.