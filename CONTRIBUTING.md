# Contributing

Thank you for your interest in contributing to the Tup Markdown Blog Engine! This document outlines the guidelines for contributing.

## How to contribute

### Reporting issues

If you find a bug or have a feature request, please [open an issue](https://github.com/teamuplk/tup-markdown-blog-engine/issues) with:

- A clear, descriptive title
- Steps to reproduce the issue (for bugs)
- Expected vs. actual behavior
- Any relevant environment details (Node.js version, OS, etc.)

### Suggesting changes

1. **Fork** the repository.
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make your changes**, keeping code style consistent.
4. **Test your changes**:
   ```bash
   npm run check
   npm run build
   ```
5. **Commit** using clear, descriptive messages:
   ```bash
   git commit -m "feat: add support for custom taxonomies"
   ```
6. **Push** to your fork and open a pull request against `main`.

### Pull request guidelines

- Keep PRs focused on a single change — split unrelated changes into separate PRs.
- Include a clear description of what the PR does and why.
- Reference any related issues.
- Ensure the build passes (`npm run build`).
- Update documentation (README, SETUP, etc.) if your change affects the user-facing contract.

## Development setup

```bash
git clone https://github.com/teamuplk/tup-markdown-blog-engine.git
cd tup-markdown-blog-engine
npm install
```

The engine works out of the box with `starter-content/` as the fallback content root. To test with your own content:

```bash
cp .env.example .env
# Edit .env with your SITE_URL and BLOG_CONTENT_ROOT
npm run dev
```

## Code style

- The project uses [Prettier](https://prettier.io/) with the `prettier-plugin-astro` plugin.
- Run formatting before committing:
  ```bash
  npx prettier --check .
  ```
- Follow Astro's component conventions and Vue's Composition API where applicable.

## Content contract changes

If your change modifies the expected structure of the external content layer, make sure to:

1. Update the **content contract** section in `README.md`.
2. Update the **environment variable** documentation in `SETUP.md`.
3. Update the **starter-content/** example to reflect any structural changes.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
